import type { CSSProperties, HTMLAttributes } from "react";

import type { FoodItem } from "@/lib/types";

type FoodCardProps = {
  food: FoodItem;
  nextFood?: FoodItem;
  style?: CSSProperties;
  pointerHandlers?: HTMLAttributes<HTMLDivElement>;
};

export function FoodCard({ food, nextFood, style, pointerHandlers }: FoodCardProps) {
  return (
    <div className="relative h-[min(54dvh,560px)] min-h-[360px] w-full max-w-[382px] sm:h-[560px]">
      {nextFood ? (
        <div className="pointer-events-none absolute inset-x-4 inset-y-6 rounded-[28px] bg-white/45 shadow-[0_18px_40px_rgba(255,95,64,0.08)]" />
      ) : null}

      <div
        className="absolute inset-0 overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_24px_52px_rgba(255,95,64,0.18)] touch-pan-y"
        style={style}
        {...pointerHandlers}
      >
        <img
          alt={food.name}
          className="pointer-events-none h-full w-full object-cover select-none"
          draggable={false}
          src={food.image}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="pointer-events-none absolute left-5 top-5 rounded-full bg-white/85 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#9a3412] backdrop-blur-sm">
          Da Nang picks
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 space-y-3 p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/75">
            Swipe right to like
          </p>
          <h2 className="text-4xl font-extrabold tracking-[-0.03em]">
            <span className="mr-2">{food.emoji}</span>
            {food.name}
          </h2>
          <p className="max-w-[18rem] text-sm text-white/85">
            Match your next bowl, baguette, or noodle craving together.
          </p>
        </div>
      </div>
    </div>
  );
}
