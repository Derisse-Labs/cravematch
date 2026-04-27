import type { RankedFoodPlace } from "@/lib/types";

function getMapQuery(place: RankedFoodPlace) {
  return encodeURIComponent(`${place.lat},${place.lng}`);
}

export function getEmbeddedMapUrl(place: RankedFoodPlace) {
  return `https://www.google.com/maps?q=${getMapQuery(place)}&z=16&output=embed`;
}
