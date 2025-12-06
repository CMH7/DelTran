/**
 * swipe-reveal-manager.ts
 *
 * A simple singleton manager to coordinate swipe-reveal components so that
 * only one card can be open at a time (accordion-like behavior).
 *
 * Usage (in a swipeable card component):
 *
 * import { swipeRevealManager, makeSwipeId } from "./swipe-reveal-manager";
 *
 * const id = useRef(makeSwipeId());
 *
 * useEffect(() => {
 *   // register with a callback that closes this card
 *   const unregister = swipeRevealManager.register(id.current, () => setIsOpen(false));
 *   return () => unregister();
 * }, []);
 *
 * // When this card opens (e.g. user finished dragging and we decide to open):
 * swipeRevealManager.open(id.current);
 *
 * // When this card closes manually (optional):
 * swipeRevealManager.close(id.current);
 *
 * The manager will invoke the registered close callbacks for every other registered id
 * when `open()` is called — ensuring that only one registered card remains open.
 */

let __swipeIdCounter = 0;

/**
 * Generate a unique ID suitable for registering with the manager.
 * Consumers (components) can call `makeSwipeId()` and keep the value for register/unregister.
 */
export function makeSwipeId(prefix = "swipe"): string {
  __swipeIdCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${__swipeIdCounter}`;
}

export type CloseCallback = () => void;

export class SwipeRevealManager {
  // Map from id -> close callback
  private registry: Map<string, CloseCallback> = new Map();

  // The currently-open id (if any). This is for convenience and quick checks.
  private openId: string | null = null;

  /**
   * Register a component with a close callback.
   * Returns an unregister function that callers should call when they unmount.
   */
  register(id: string, closeCb: CloseCallback): () => void {
    if (!id) throw new Error("SwipeRevealManager.register requires a non-empty id");
    this.registry.set(id, closeCb);

    // Return an unregister function for convenience.
    return () => {
      this.unregister(id);
    };
  }

  /**
   * Unregister a previously registered id.
   */
  unregister(id: string): void {
    if (!id) return;
    // If the id being unregistered is currently open, clear openId
    if (this.openId === id) this.openId = null;
    this.registry.delete(id);
  }

  /**
   * Open the card with `id`. This will:
   * - Close every other registered card by invoking their close callbacks
   * - Mark `id` as the currently-open card
   *
   * It's safe to call `open` for an id that is not registered; in that case
   * the manager will still close others and set openId to the provided id.
   */
  open(id: string): void {
    // Close all other registered cards
    for (const [regId, cb] of this.registry) {
      if (regId !== id) {
        try {
          cb();
        } catch (err) {
          // swallow individual callback errors so the loop continues
          // (components should guard themselves, but we protect the coordinator)
          // eslint-disable-next-line no-console
          console.error("Error in swipe reveal close callback for id:", regId, err);
        }
      }
    }

    this.openId = id;
  }

  /**
   * Close the card with `id`. If `id` is null/undefined the manager will close all.
   * - Invokes the close callback for the specified id (if registered).
   * - Clears openId if it matches.
   */
  close(id?: string | null): void {
    if (!id) {
      // close all registered
      for (const [regId, cb] of this.registry) {
        try {
          cb();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("Error in swipe reveal close callback for id:", regId, err);
        }
      }
      this.openId = null;
      return;
    }

    const cb = this.registry.get(id);
    if (cb) {
      try {
        cb();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error closing swipe reveal for id:", id, err);
      }
    }
    if (this.openId === id) this.openId = null;
  }

  /**
   * Returns the id of the currently open card, or null if none.
   */
  getOpenId(): string | null {
    return this.openId;
  }

  /**
   * Returns true if the given id is currently open.
   */
  isOpen(id: string): boolean {
    return this.openId !== null && this.openId === id;
  }

  /**
   * Utility: closes all other cards except the provided id.
   * Equivalent to calling `open(id)` but without setting `openId` of a non-registered id.
   */
  closeOthers(id: string): void {
    for (const [regId, cb] of this.registry) {
      if (regId !== id) {
        try {
          cb();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("Error closing swipe reveal for id:", regId, err);
        }
      }
    }
    this.openId = this.registry.has(id) ? id : null;
  }
}

/**
 * Default singleton instance used across the app.
 * Import this in your swipeable components.
 */
export const swipeRevealManager = new SwipeRevealManager();
