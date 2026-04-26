import { RoomExitButton } from "@/components/room-exit-button";
import type { FoodItem, RankedFoodPlace } from "@/lib/types";

type LocationsScreenProps = {
  food: FoodItem;
  places: RankedFoodPlace[];
  preferenceSummary: string;
  onLeaveRoom: () => void;
};

export function LocationsScreen({ food, places, preferenceSummary, onLeaveRoom }: LocationsScreenProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] sm:px-6 sm:pb-8 sm:pt-7">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a3412]">Nearby picks</p>
          <h1 className="text-4xl font-extrabold tracking-[-0.05em] text-[#221b19]">
            Where to eat <span className="text-[#ff5f40]">{food.name}</span>
          </h1>
          <p className="max-w-[18rem] text-sm leading-6 text-[#6f534b]">
            {preferenceSummary}
          </p>
        </div>
        <RoomExitButton onClick={onLeaveRoom} />
      </div>

      <div className="mt-8 space-y-4">
        {places.map((place, index) => (
          <div
            key={place.name}
            className="rounded-[26px] border border-white/80 bg-white/72 p-5 shadow-[0_18px_40px_rgba(255,95,64,0.10)] backdrop-blur-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#ffefe9] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#b3290f]">
                    #{index + 1}
                  </div>
                  <div className="rounded-full bg-[#ff5f40]/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#b3290f]">
                    {place.price}
                  </div>
                </div>
                <h2 className="text-xl font-bold tracking-[-0.03em] text-[#221b19]">{place.name}</h2>
                <p className="text-sm font-medium text-[#7b5e56]">
                  {place.distanceLabel} away • {place.rating.toFixed(1)} stars • {place.reviewCount} reviews
                </p>
                <p className="text-sm leading-6 text-[#8a5b4d]">{place.address}</p>
                <div className="flex flex-wrap gap-2">
                  {place.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#8a5b4d]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <a
                className="inline-flex rounded-full bg-[#ff5f40]/12 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#b3290f] transition hover:bg-[#ff5f40]/18"
                href={place.googleMapsUrl}
                rel="noreferrer"
                target="_blank"
              >
                Map
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
