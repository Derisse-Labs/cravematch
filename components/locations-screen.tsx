import { RoomExitButton } from "@/components/room-exit-button";
import type { FoodItem } from "@/lib/types";

type LocationsScreenProps = {
  food: FoodItem;
  onLeaveRoom: () => void;
};

export function LocationsScreen({ food, onLeaveRoom }: LocationsScreenProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] sm:px-6 sm:pb-8 sm:pt-7">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a3412]">Nearby picks</p>
          <h1 className="text-4xl font-extrabold tracking-[-0.05em] text-[#221b19]">
            Where to eat <span className="text-[#ff5f40]">{food.name}</span>
          </h1>
          <p className="max-w-[18rem] text-sm leading-6 text-[#6f534b]">
            Three simple places to keep the demo moving after your shared match.
          </p>
        </div>
        <RoomExitButton onClick={onLeaveRoom} />
      </div>

      <div className="mt-8 space-y-4">
        {food.places.map((place) => (
          <div
            key={place.name}
            className="rounded-[26px] border border-white/80 bg-white/72 p-5 shadow-[0_18px_40px_rgba(255,95,64,0.10)] backdrop-blur-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-[-0.03em] text-[#221b19]">{place.name}</h2>
                <p className="mt-2 text-sm font-medium text-[#7b5e56]">{place.distance} away</p>
              </div>
              <div className="rounded-full bg-[#ff5f40]/12 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#b3290f]">
                Place
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
