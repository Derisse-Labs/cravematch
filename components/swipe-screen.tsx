import type { CSSProperties, HTMLAttributes } from "react";

import { FoodCard } from "@/components/food-card";
import { RoomExitButton } from "@/components/room-exit-button";
import type { FoodItem, Role } from "@/lib/types";

type SwipeScreenProps = {
  roomCode: string;
  role: Role | null;
  currentFood: FoodItem;
  nextFood: FoodItem;
  swipeStyle: CSSProperties;
  pointerHandlers: HTMLAttributes<HTMLDivElement>;
  error: string;
  onLeaveRoom: () => void;
  onSkip: () => void;
  onLike: () => void;
};

export function SwipeScreen({
  roomCode,
  role,
  currentFood,
  nextFood,
  swipeStyle,
  pointerHandlers,
  error,
  onLeaveRoom,
  onSkip,
  onLike,
}: SwipeScreenProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] sm:px-6 sm:pb-8 sm:pt-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex flex-1 items-center justify-between rounded-full bg-white/60 px-4 py-3 text-sm font-semibold text-[#7c2d12] backdrop-blur-md">
          <span>{roomCode}</span>
          <span>Player {role ?? "-"}</span>
        </div>
        <RoomExitButton onClick={onLeaveRoom} />
      </div>

      <div className="mb-5 space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a3412]">Find your overlap</p>
        <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-[#231815]">
          Swipe together on Vietnamese favorites.
        </h1>
      </div>

      {error ? (
        <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex min-h-0 flex-1 items-center justify-center py-1">
        <FoodCard food={currentFood} nextFood={nextFood} pointerHandlers={pointerHandlers} style={swipeStyle} />
      </div>

      <div className="mt-5 flex shrink-0 items-center justify-center gap-5">
        <button
          aria-label="Skip"
          className="flex h-16 w-16 touch-manipulation items-center justify-center rounded-full border border-white/80 bg-white/75 text-[#7a341f] shadow-[0_16px_32px_rgba(255,95,64,0.10)] transition hover:scale-[1.01] active:scale-[0.98]"
          onClick={onSkip}
          type="button"
        >
          <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24">
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.4"
            />
          </svg>
        </button>
        <button
          aria-label="Like"
          className="flex h-16 w-16 touch-manipulation items-center justify-center rounded-full bg-[#ff5f40] text-white shadow-[0_20px_36px_rgba(255,95,64,0.30)] transition hover:scale-[1.01] active:scale-[0.98]"
          onClick={onLike}
          type="button"
        >
          <svg aria-hidden="true" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-[#7b5e56]">
        Drag left to pass. Drag right to like. Buttons still work too.
      </p>
    </div>
  );
}
