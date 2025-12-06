import React, { useCallback, useEffect, useRef, useState } from "react";
import { Item } from "@/domain/entities/item.schema";
import { BaseProp } from "../props/base-prop";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { EditIcon, TrashIcon } from "lucide-react";
import { swipeRevealManager, makeSwipeId } from "./swipe-reveal-manager";

interface ItemCardProps extends BaseProp {
  item: Item;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
}

/**
 * ItemCard
 *
 * - Slide left to reveal right-side actions (iOS-like horizontal layout).
 * - If released past 80% of the actions width, the card locks open; otherwise it snaps back.
 * - Uses Pointer Events so it works with mouse and touch.
 * - Only one card can be open at a time via swipeRevealManager.
 */
export default function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef<number>(0);
  const startTranslateRef = useRef<number>(0);

  // translateX is negative when content moves left to reveal right-side actions.
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Width (px) of the right-side actions area when fully revealed.
  const ACTIONS_WIDTH = 160;
  // Lock threshold = 80% of ACTIONS_WIDTH
  const OPEN_THRESHOLD = ACTIONS_WIDTH * 0.8;

  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

  // Unique id for this card used by the manager
  const swipeIdRef = useRef<string>(makeSwipeId("item-card"));

  // Register with manager so it can close this card when another opens
  useEffect(() => {
    const id = swipeIdRef.current;
    const unregister = swipeRevealManager.register(id, () => {
      // manager requests this card close
      setIsOpen(false);
      setTranslateX(0);
    });
    return () => {
      unregister();
    };
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // only primary pointer
      if (e.button && e.button !== 0) return;
      const el = containerRef.current;
      if (!el) return;

      // Close other cards immediately so only one can be dragged/open at once
      try {
        swipeRevealManager.closeOthers(swipeIdRef.current);
      } catch {
        // ignore manager errors
      }

      // capture pointer so we continue receiving moves outside element
      el.setPointerCapture?.(e.pointerId);
      pointerIdRef.current = e.pointerId;
      startXRef.current = e.clientX;
      startTranslateRef.current = translateX;
      setIsDragging(true);
    },
    [translateX],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || pointerIdRef.current !== e.pointerId) return;
      const dx = e.clientX - startXRef.current;
      // left drag => dx negative; combine with starting translate
      const raw = startTranslateRef.current + dx;
      const clamped = clamp(raw, -ACTIONS_WIDTH, 0);
      setTranslateX(clamped);
    },
    [isDragging],
  );

  const finishPointer = useCallback(
    (e?: React.PointerEvent | PointerEvent) => {
      if (!isDragging) return;

      const final = translateX; // negative or zero
      const shouldOpen = Math.abs(final) >= OPEN_THRESHOLD;
      const target = shouldOpen ? -ACTIONS_WIDTH : 0;

      setTranslateX(target);
      setIsOpen(shouldOpen);
      setIsDragging(false);

      // Notify manager when we open so it can close others.
      if (shouldOpen) {
        try {
          swipeRevealManager.open(swipeIdRef.current);
        } catch {
          // ignore
        }
      } else {
        // If closed and manager thinks this is open, clear it
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
    },
    [isDragging, translateX],
  );

  // window-level listeners to catch pointerup outside component
  useEffect(() => {
    const onUp = (ev: globalThis.PointerEvent) => finishPointer(ev);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [finishPointer]);

  // Sync translateX to open/closed state if toggled programmatically
  useEffect(() => {
    setTranslateX(isOpen ? -ACTIONS_WIDTH : 0);
    if (isOpen) {
      // ensure manager knows this card is open
      try {
        swipeRevealManager.open(swipeIdRef.current);
      } catch {
        // ignore
      }
    } else {
      // clear manager state if necessary
      try {
        if (swipeRevealManager.isOpen(swipeIdRef.current)) {
          swipeRevealManager.close(swipeIdRef.current);
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  // Action handlers
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit ? onEdit(item) : console.log("Edit", item);
    setIsOpen(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete ? onDelete(item) : console.log("Delete", item);
    setIsOpen(false);
  };

  // Keyboard accessibility: Enter/Space toggles, Esc closes.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Right-side actions (horizontal layout) */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-center pr-2"
        style={{
          width: ACTIONS_WIDTH,
          zIndex: 0,
        }}
        aria-hidden={false}
      >
        <div className="w-full flex items-center justify-evenly gap-2 h-full">
          <Button onClick={handleDelete} variant="destructive" size="lg">
            <TrashIcon />
          </Button>

          <Button onClick={handleEdit} variant="secondary" size="lg">
            <EditIcon />
          </Button>
        </div>
      </div>

      {/* Card content - this moves left (negative translateX) to reveal right actions */}
      <div
        ref={containerRef}
        role="button"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => finishPointer(e)}
        onPointerCancel={(e) => finishPointer(e)}
        className="relative z-10 select-none"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging
            ? "none"
            : "transform 260ms cubic-bezier(.2,.9,.2,1)",
          touchAction: "pan-y", // allow vertical scrolling while handling horizontal swipe
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between items-start">
                <div className="truncate">{item.name}</div>
                <Badge variant="secondary">₱ {item.price}</Badge>
              </div>
            </CardTitle>
            <CardDescription>{item.vendor.name}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
