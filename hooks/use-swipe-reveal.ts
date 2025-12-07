/**
 * use-swipe-reveal.ts
 *
 * Reusable hook that encapsulates the swipe-to-reveal logic used by card components.
 *
 * - Pointer events based (works with mouse & touch via Pointer Events).
 * - Uses the existing `swipeRevealManager` to ensure only one card is open at a time.
 * - Exposes refs and handlers for easy wiring in presentational components.
 *
 * Usage:
 *
 * const {
 *   containerRef,
 *   translateX,
 *   isDragging,
 *   isOpen,
 *   actionsWidth,
 *   onPointerDown,
 *   onPointerMove,
 *   onPointerUp,
 *   onPointerCancel,
 *   onKeyDown,
 *   setIsOpen,
 *   close,
 * } = useSwipeReveal({ actionsWidth: 160 });
 *
 * Then spread handlers and ref onto the moving content element and render the actions
 * as an absolutely-positioned element with width = `actionsWidth`.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
	swipeRevealManager,
	makeSwipeId,
} from "../components/custom/swipe-reveal-manager";

export interface UseSwipeRevealOptions {
	// Width in px of the actions area (default 160)
	actionsWidth?: number;
	// How far (fraction) to move before locking open (default 0.8)
	openThresholdFraction?: number;
	// Optional id prefix used when generating manager id
	idPrefix?: string;
}

export interface UseSwipeRevealReturn {
	// ref to attach to the content element that will translate left/right
	containerRef: React.RefObject<HTMLDivElement | null>;
	// current translateX (negative to move left and reveal right actions)
	translateX: number;
	// true while dragging
	isDragging: boolean;
	// open locked state
	isOpen: boolean;
	// configured actions width (px)
	actionsWidth: number;
	// pointer & keyboard handlers to attach
	onPointerDown: (e: React.PointerEvent) => void;
	onPointerMove: (e: React.PointerEvent) => void;
	onPointerUp: (e: React.PointerEvent) => void;
	onPointerCancel: (e: React.PointerEvent) => void;
	onKeyDown: (e: React.KeyboardEvent) => void;
	// programmatic controls
	setIsOpen: (v: boolean) => void;
	close: () => void;
}

/**
 * Hook implementation.
 */
export function useSwipeReveal(
	options?: UseSwipeRevealOptions,
): UseSwipeRevealReturn {
	const actionsWidth = options?.actionsWidth ?? 160;
	const openThresholdFraction = options?.openThresholdFraction ?? 0.8;
	const OPEN_THRESHOLD = actionsWidth * openThresholdFraction;

	const containerRef = useRef<HTMLDivElement | null>(null);
	const pointerIdRef = useRef<number | null>(null);
	const startXRef = useRef<number>(0);
	const startTranslateRef = useRef<number>(0);
	// requestAnimationFrame handle used to defer state updates that would otherwise
	// run synchronously inside an effect (avoids cascading renders).
	const rafRef = useRef<number | null>(null);

	const swipeIdRef = useRef<string>(
		makeSwipeId(options?.idPrefix ?? "swipe-reveal"),
	);

	const [translateX, setTranslateX] = useState<number>(0);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	// clamp utility
	const clamp = useCallback((v: number, min: number, max: number) => {
		return Math.max(min, Math.min(max, v));
	}, []);

	// Register with manager so manager can request close on this instance
	useEffect(() => {
		const id = swipeIdRef.current;
		const unregister = swipeRevealManager.register(id, () => {
			setIsOpen(false);
			setTranslateX(0);
		});
		return () => {
			unregister();
		};
	}, []);

	// Pointer down
	const onPointerDown = useCallback(
		(e: React.PointerEvent) => {
			// only primary button
			if (e.button !== undefined && e.button !== 0) return;
			const el = containerRef.current;
			if (!el) return;

			// close others so this can be dragged/open (non-destructive)
			try {
				swipeRevealManager.closeOthers(swipeIdRef.current);
			} catch {
				// ignore manager errors
			}

			// capture pointer so we continue receiving move/up outside element
			el.setPointerCapture?.(e.pointerId);
			pointerIdRef.current = e.pointerId;
			startXRef.current = e.clientX;
			startTranslateRef.current = translateX;
			setIsDragging(true);
		},
		[translateX],
	);

	// Pointer move
	const onPointerMove = useCallback(
		(e: React.PointerEvent) => {
			if (!isDragging) return;
			if (pointerIdRef.current !== e.pointerId) return;
			const dx = e.clientX - startXRef.current;
			const raw = startTranslateRef.current + dx;
			const clamped = clamp(raw, -actionsWidth, 0);
			setTranslateX(clamped);
		},
		[isDragging, clamp, actionsWidth],
	);

	// Finish pointer (pointerup/pointercancel or pointerUp handler)
	const finishPointer = useCallback(() => {
		if (!isDragging) return;

		const final = translateX; // negative or zero
		const shouldOpen = Math.abs(final) >= OPEN_THRESHOLD;
		const target = shouldOpen ? -actionsWidth : 0;

		setTranslateX(target);
		setIsOpen(shouldOpen);
		setIsDragging(false);

		// notify manager
		if (shouldOpen) {
			try {
				swipeRevealManager.open(swipeIdRef.current);
			} catch {
				// ignore
			}
		} else {
			try {
				if (swipeRevealManager.isOpen(swipeIdRef.current)) {
					swipeRevealManager.close(swipeIdRef.current);
				}
			} catch {
				// ignore
			}
		}

		try {
			const pid = pointerIdRef.current;
			if (pid != null && containerRef.current) {
				containerRef.current.releasePointerCapture?.(pid);
			}
		} catch {
			// ignore
		}
		pointerIdRef.current = null;
	}, [isDragging, translateX, OPEN_THRESHOLD, actionsWidth]);

	// Expose onPointerUp/onPointerCancel that call finishPointer
	const onPointerUp = useCallback(() => {
		finishPointer();
	}, [finishPointer]);
	const onPointerCancel = onPointerUp;

	// Window-level pointerup/cancel to ensure we finalize drags that end outside the element
	useEffect(() => {
		const onUp = () => finishPointer();
		window.addEventListener("pointerup", onUp);
		window.addEventListener("pointercancel", onUp);
		return () => {
			window.removeEventListener("pointerup", onUp);
			window.removeEventListener("pointercancel", onUp);
		};
	}, [finishPointer]);

	// Sync translate when isOpen changed programmatically.
	// Defer the translateX state update to rAF to avoid calling setState synchronously
	// inside an effect (which can cause cascading renders).
	useEffect(() => {
		// Cancel any pending rAF scheduled earlier for this instance.
		if (rafRef.current != null) {
			try {
				cancelAnimationFrame(rafRef.current);
			} catch {
				// ignore environments without cancelAnimationFrame (very unlikely in browser)
			}
			rafRef.current = null;
		}

		// Schedule the translate update on the next animation frame.
		rafRef.current = requestAnimationFrame(() => {
			setTranslateX(isOpen ? -actionsWidth : 0);
			rafRef.current = null;
		});

		if (isOpen) {
			try {
				swipeRevealManager.open(swipeIdRef.current);
			} catch {
				// ignore
			}
		} else {
			try {
				if (swipeRevealManager.isOpen(swipeIdRef.current)) {
					swipeRevealManager.close(swipeIdRef.current);
				}
			} catch {
				// ignore
			}
		}

		return () => {
			// Ensure any scheduled rAF is cancelled when effect re-runs or component unmounts.
			if (rafRef.current != null) {
				try {
					cancelAnimationFrame(rafRef.current);
				} catch {
					// ignore
				}
				rafRef.current = null;
			}
		};
	}, [isOpen, actionsWidth]);

	// Keyboard accessibility: toggle open/close with Enter/Space, Esc to close
	const onKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			setIsOpen((prev) => !prev);
		} else if (e.key === "Escape") {
			setIsOpen(false);
		}
	}, []);

	// Programmatic close helper
	const close = useCallback(() => {
		setIsOpen(false);
		setTranslateX(0);
		try {
			if (swipeRevealManager.isOpen(swipeIdRef.current)) {
				swipeRevealManager.close(swipeIdRef.current);
			}
		} catch {
			// ignore
		}
	}, []);

	return {
		containerRef,
		translateX,
		isDragging,
		isOpen,
		actionsWidth,
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerCancel,
		onKeyDown,
		setIsOpen,
		close,
	};
}

export default useSwipeReveal;
