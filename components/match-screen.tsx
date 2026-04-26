"use client";

import { useEffect } from "react";

import confetti from "canvas-confetti";

import { PrimaryButton } from "@/components/primary-button";
import { RoomExitButton } from "@/components/room-exit-button";
import type { FoodItem } from "@/lib/types";

type MatchScreenProps = {
  food: FoodItem;
  onLeaveRoom: () => void;
  onSeePlaces: () => void;
};

export function MatchScreen({ food, onLeaveRoom, onSeePlaces }: MatchScreenProps) {
  useEffect(() => {
    const fire = () => {
      confetti({
        particleCount: 120,
        spread: 72,
        startVelocity: 32,
        origin: { y: 0.62 },
      });
    };

    fire();
  }, []);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col justify-between overflow-y-auto px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] text-[#2b1814] sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,95,64,0.72),transparent_68%)] opacity-70" />

      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="text-xs font-bold uppercase tracking-[0.24em] text-[#7c2d12]">Shared match found</div>
        <RoomExitButton inverse onClick={onLeaveRoom} />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 py-8 text-center">
        <div className="space-y-3 rounded-[28px] border border-white/70 bg-white/72 px-6 py-5 shadow-[0_18px_40px_rgba(255,95,64,0.14)] backdrop-blur-md">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#b3290f]">CraveMatch</p>
          <h1 className="text-5xl font-extrabold tracking-[-0.05em] text-[#221b19]">It&apos;s a Match!</h1>
        </div>

        <div className="relative h-52 w-52 overflow-hidden rounded-full border-4 border-white/75 shadow-[0_24px_56px_rgba(255,95,64,0.35)]">
          <img alt={food.name} className="h-full w-full object-cover" src={food.image} />
        </div>

        <div className="space-y-2">
          <p className="text-lg font-semibold text-[#6f3b2d]">You both want:</p>
          <p className="text-3xl font-extrabold tracking-[-0.04em] text-[#9a3412]">
            <span className="mr-2">{food.emoji}</span>
            {food.name}
          </p>
        </div>
      </div>

      <div className="relative z-10">
        <PrimaryButton className="w-full" onClick={onSeePlaces}>
          See places
        </PrimaryButton>
      </div>
    </div>
  );
}
