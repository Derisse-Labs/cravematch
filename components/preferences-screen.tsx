"use client";

import { useEffect, useState } from "react";

import { PrimaryButton } from "@/components/primary-button";
import { RoomExitButton } from "@/components/room-exit-button";

type PreferencesScreenProps = {
  roomCode: string;
  error: string;
  isLoading: boolean;
  initialPrompt: string;
  onContinue: (prompt: string) => Promise<void>;
  onSkip: () => Promise<void>;
  onLeaveRoom: () => void;
};

export function PreferencesScreen({
  roomCode,
  error,
  isLoading,
  initialPrompt,
  onContinue,
  onSkip,
  onLeaveRoom,
}: PreferencesScreenProps) {
  const [prompt, setPrompt] = useState(initialPrompt);

  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-between overflow-y-auto px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] sm:px-6 sm:py-8">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a3412]">Room ready</p>
            <h1 className="max-w-[16rem] text-4xl font-extrabold tracking-[-0.05em] text-[#221b19]">
              What are you in the mood for?
            </h1>
            <p className="max-w-[20rem] text-sm leading-6 text-[#6b4a42]">
              Add a short vibe and we&apos;ll rank the static place list by things like distance, price, reviews, and vibe.
            </p>
          </div>
          <RoomExitButton onClick={onLeaveRoom} />
        </div>

        <div className="rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_18px_40px_rgba(255,95,64,0.10)]">
          <div className="space-y-5">
            <div className="rounded-2xl bg-[#fff3ef] px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b3290f]">Share this code</p>
              <p className="mt-2 text-3xl font-extrabold uppercase tracking-[0.18em] text-[#7c2d12]">{roomCode}</p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a3412]" htmlFor="place-prompt">
                AI filter
              </label>
              <textarea
                id="place-prompt"
                className="min-h-32 w-full resize-none rounded-[24px] border border-[#f3d0c7] bg-white px-4 py-4 text-base text-[#3b2b27] outline-none ring-0 placeholder:text-[#c08472] focus:border-[#ff5f40]"
                enterKeyHint="done"
                maxLength={140}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Cheap and close, or maybe cozy with strong reviews..."
                value={prompt}
              />
              <p className="text-sm leading-6 text-[#7b5e56]">
                Try: <span className="font-semibold text-[#9a3412]">cheap</span>, <span className="font-semibold text-[#9a3412]">close</span>, <span className="font-semibold text-[#9a3412]">top rated</span>, <span className="font-semibold text-[#9a3412]">cozy</span>, or <span className="font-semibold text-[#9a3412]">date night</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-6">
        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        <PrimaryButton className="w-full" disabled={isLoading} onClick={() => void onContinue(prompt)}>
          {isLoading ? "Saving..." : "Continue"}
        </PrimaryButton>

        <PrimaryButton className="w-full" disabled={isLoading} onClick={() => void onSkip()} variant="secondary">
          Skip and sort by distance
        </PrimaryButton>
      </div>
    </div>
  );
}
