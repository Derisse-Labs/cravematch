import { useCallback, useMemo, useRef, useState } from "react";
import type { CSSProperties, HTMLAttributes, PointerEvent as ReactPointerEvent } from "react";

type SwipeGestureOptions = {
  onLike: () => void | Promise<void>;
  onSkip: () => void | Promise<void>;
  disabled?: boolean;
};

type SwipeDirection = "left" | "right";

const SWIPE_THRESHOLD = 90;
const SWIPE_FLYOUT_X = 520;
const SWIPE_DURATION_MS = 160;

export function useSwipeGesture({ onLike, onSkip, disabled = false }: SwipeGestureOptions) {
  const [offsetX, setOffsetX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [useTransition, setUseTransition] = useState(false);

  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);

  const finishSwipe = useCallback(
    (direction: SwipeDirection) => {
      if (disabled || isAnimating) {
        return;
      }

      const callback = direction === "right" ? onLike : onSkip;

      setIsAnimating(true);
      setUseTransition(true);
      setOffsetX(direction === "right" ? SWIPE_FLYOUT_X : -SWIPE_FLYOUT_X);

      window.setTimeout(() => {
        void callback();

        window.requestAnimationFrame(() => {
          setUseTransition(false);
          setOffsetX(0);
          setIsAnimating(false);
        });
      }, SWIPE_DURATION_MS);
    },
    [disabled, isAnimating, onLike, onSkip],
  );

  const resetSwipe = useCallback(() => {
    setUseTransition(true);
    setOffsetX(0);

    window.setTimeout(() => {
      setUseTransition(false);
    }, SWIPE_DURATION_MS);
  }, []);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled || isAnimating) {
        return;
      }

      pointerIdRef.current = event.pointerId;
      startXRef.current = event.clientX;
      setUseTransition(false);
    },
    [disabled, isAnimating],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled || isAnimating || pointerIdRef.current !== event.pointerId) {
        return;
      }

      setOffsetX(event.clientX - startXRef.current);
    },
    [disabled, isAnimating],
  );

  const onPointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== event.pointerId) {
        return;
      }

      pointerIdRef.current = null;

      if (offsetX >= SWIPE_THRESHOLD) {
        finishSwipe("right");
        return;
      }

      if (offsetX <= -SWIPE_THRESHOLD) {
        finishSwipe("left");
        return;
      }

      resetSwipe();
    },
    [finishSwipe, offsetX, resetSwipe],
  );

  const pointerHandlers = useMemo<HTMLAttributes<HTMLDivElement>>(
    () => ({
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
    }),
    [onPointerDown, onPointerEnd, onPointerMove],
  );

  const cardStyle = useMemo<CSSProperties>(() => {
    const rotation = offsetX / 18;

    return {
      transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
      transition: useTransition ? `transform ${SWIPE_DURATION_MS}ms ease-out` : undefined,
      cursor: isAnimating ? "grabbing" : "grab",
      willChange: "transform",
    };
  }, [isAnimating, offsetX, useTransition]);

  const triggerLike = useCallback(() => {
    finishSwipe("right");
  }, [finishSwipe]);

  const triggerSkip = useCallback(() => {
    finishSwipe("left");
  }, [finishSwipe]);

  return {
    cardStyle,
    pointerHandlers,
    triggerLike,
    triggerSkip,
  };
}
