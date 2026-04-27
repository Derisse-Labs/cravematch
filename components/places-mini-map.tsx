"use client";

import { useMemo } from "react";

import { getEmbeddedMapUrl } from "@/lib/place-map";
import type { RankedFoodPlace } from "@/lib/types";

type PlacesMiniMapProps = {
  places: RankedFoodPlace[];
  selectedPlace: RankedFoodPlace | null;
  onSelectPlace: (place: RankedFoodPlace) => void;
};

export function PlacesMiniMap({ places, selectedPlace, onSelectPlace }: PlacesMiniMapProps) {
  const activePlace = selectedPlace ?? places[0] ?? null;
  const mapUrl = useMemo(() => (activePlace ? getEmbeddedMapUrl(activePlace) : ""), [activePlace]);

  return (
    <div className="rounded-[30px] border border-white/80 bg-white/72 p-3 shadow-[0_18px_40px_rgba(255,95,64,0.10)] backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b3290f]">Live map</p>
          <p className="text-sm font-medium text-[#7b5e56]">Tap a place below to recenter the map</p>
        </div>
        <div className="rounded-full bg-[#ff5f40]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#b3290f]">
          Da Nang
        </div>
      </div>

      <div className="relative h-[280px] overflow-hidden rounded-[26px] border border-white/70 bg-[#fff6f2]">
        {activePlace && mapUrl ? (
          <iframe
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
            title={`Map for ${activePlace.name}`}
          />
        ) : null}

        {activePlace ? (
          <div className="absolute inset-x-3 bottom-3 rounded-[22px] border border-white/80 bg-white/90 p-4 shadow-[0_10px_24px_rgba(255,95,64,0.12)] backdrop-blur-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b3290f]">Selected place</p>
                <h2 className="mt-1 text-base font-extrabold tracking-[-0.03em] text-[#221b19]">{activePlace.name}</h2>
                <p className="mt-1 text-sm leading-5 text-[#7b5e56]">{activePlace.address}</p>
              </div>
              <div className="shrink-0 rounded-full bg-[#ffefe9] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#b3290f]">
                {activePlace.distanceLabel}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {places.map((place, index) => {
                const isSelected = activePlace.name === place.name && activePlace.address === place.address;

                return (
                  <button
                    key={`${place.name}-${place.address}`}
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] transition ${
                      isSelected
                        ? "bg-[#ff5f40] text-white"
                        : "bg-[#fff2ed] text-[#9a3412] hover:bg-[#ffe4da]"
                    }`}
                    onClick={() => onSelectPlace(place)}
                    type="button"
                  >
                    #{index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
