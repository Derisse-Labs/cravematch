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

      <div className="mt-5 grid shrink-0 grid-cols-2 gap-4">
        <button
          className="min-h-16 rounded-[26px] border border-white/80 bg-white/75 px-5 text-base font-bold text-[#7a341f] shadow-[0_16px_32px_rgba(255,95,64,0.10)] transition hover:scale-[1.01] active:scale-[0.98]"
          onClick={onSkip}
          type="button"
        >
          Skip
        </button>
        <button
          className="min-h-16 rounded-[26px] bg-[#ff5f40] px-5 text-base font-bold text-white shadow-[0_20px_36px_rgba(255,95,64,0.30)] transition hover:scale-[1.01] active:scale-[0.98]"
          onClick={onLike}
          type="button"
        >
          Like
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-[#7b5e56]">
        Drag left to pass. Drag right to like. Buttons still work too.
      </p>
    </div>
  );
}
