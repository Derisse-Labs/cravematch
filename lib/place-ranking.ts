import type { FoodPlace, RankedFoodPlace } from "@/lib/types";

type ParsedPrompt = {
  prefersDistance: boolean;
  prefersBudget: boolean;
  prefersPremium: boolean;
  prefersReviews: boolean;
  searchTerms: string[];
  preferredTags: string[];
};

const DEMO_USER_LOCATION = {
  lat: 16.0674,
  lng: 108.2208,
};

const DISTANCE_KEYWORDS = ["close", "near", "nearby", "quick", "walk", "walkable", "fast"];
const BUDGET_KEYWORDS = ["cheap", "budget", "affordable", "value", "student"];
const PREMIUM_KEYWORDS = ["date", "date night", "fancy", "premium", "nice", "special"];
const REVIEW_KEYWORDS = ["best", "top", "top-rated", "high rated", "review", "reviews", "popular"];
const TAG_KEYWORDS: Record<string, string[]> = {
  cozy: ["cozy", "cosy", "warm", "quiet"],
  local: ["local", "authentic", "traditional"],
  casual: ["casual", "easy", "relaxed"],
  quick: ["quick", "fast", "bite"],
  lively: ["lively", "busy", "fun"],
  date: ["date", "romantic", "special"],
};
const TAG_POOL = ["cozy", "local", "casual", "quick", "lively", "date"] as const;
const STOP_WORDS = new Set([
  "and",
  "the",
  "with",
  "for",
  "near",
  "close",
  "cheap",
  "budget",
  "affordable",
  "value",
  "student",
  "date",
  "night",
  "fancy",
  "premium",
  "nice",
  "special",
  "best",
  "top",
  "rated",
  "review",
  "reviews",
  "popular",
  "food",
  "place",
  "spot",
  "restaurant",
  "restaurants",
  "want",
  "something",
]);

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesKeyword(prompt: string, keywords: string[]) {
  return keywords.some((keyword) => prompt.includes(keyword));
}

function parsePrompt(prompt: string): ParsedPrompt {
  const normalizedPrompt = normalizeText(prompt);

  return {
    prefersDistance: includesKeyword(normalizedPrompt, DISTANCE_KEYWORDS),
    prefersBudget: includesKeyword(normalizedPrompt, BUDGET_KEYWORDS),
    prefersPremium: includesKeyword(normalizedPrompt, PREMIUM_KEYWORDS),
    prefersReviews: includesKeyword(normalizedPrompt, REVIEW_KEYWORDS),
    searchTerms: normalizedPrompt
      .split(" ")
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word)),
    preferredTags: Object.entries(TAG_KEYWORDS)
      .filter(([, keywords]) => includesKeyword(normalizedPrompt, keywords))
      .map(([tag]) => tag),
  };
}

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function seededNumber(seed: number, min: number, max: number) {
  const normalizedSeed = Math.abs(Math.sin(seed) * 10000) % 1;
  return min + normalizedSeed * (max - min);
}

function getDistanceMeters(lat: number, lng: number) {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadius = 6371000;
  const deltaLat = toRadians(lat - DEMO_USER_LOCATION.lat);
  const deltaLng = toRadians(lng - DEMO_USER_LOCATION.lng);
  const startLat = toRadians(DEMO_USER_LOCATION.lat);
  const endLat = toRadians(lat);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  return Math.round(earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function formatDistance(distanceMeters: number) {
  if (distanceMeters < 1000) {
    return `${distanceMeters} m`;
  }

  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

function getPriceAverage(price: string) {
  const values = price
    .split("-")
    .map((part) => Number.parseInt(part.replace(/[^0-9]/g, ""), 10))
    .filter((value) => Number.isFinite(value));

  if (values.length === 0) {
    return 50;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getPriceTier(price: string): RankedFoodPlace["priceTier"] {
  const averagePrice = getPriceAverage(price);

  if (averagePrice <= 30) {
    return 1;
  }

  if (averagePrice <= 80) {
    return 2;
  }

  return 3;
}

function getRating(place: FoodPlace) {
  const seed = hashString(`${place.name}:${place.address}:rating`);
  return Number(seededNumber(seed, 4.1, 4.9).toFixed(1));
}

function getReviewCount(place: FoodPlace) {
  const seed = hashString(`${place.name}:${place.address}:reviews`);
  return Math.round(seededNumber(seed, 120, 1800));
}

function getTags(place: FoodPlace) {
  const baseSeed = hashString(`${place.name}:${place.address}:tags`);
  const tags = new Set<string>();

  for (let index = 0; index < TAG_POOL.length && tags.size < 3; index += 1) {
    const tagIndex = Math.floor(seededNumber(baseSeed + index, 0, TAG_POOL.length));
    tags.add(TAG_POOL[tagIndex] ?? TAG_POOL[0]);
  }

  return [...tags];
}

function getDistanceScore(distanceMeters: number, maxDistanceMeters: number) {
  if (maxDistanceMeters <= 0) {
    return 1;
  }

  return 1 - distanceMeters / maxDistanceMeters;
}

function getBudgetScore(priceTier: RankedFoodPlace["priceTier"]) {
  return (3 - priceTier) / 2;
}

function getPremiumScore(priceTier: RankedFoodPlace["priceTier"]) {
  return (priceTier - 1) / 2;
}

function getReviewSignal(reviewCount: number) {
  return Math.min(reviewCount / 1800, 1);
}

function getTextMatchScore(place: FoodPlace, searchTerms: string[]) {
  if (searchTerms.length === 0) {
    return 0;
  }

  const searchableText = normalizeText(`${place.name} ${place.address}`);
  const matches = searchTerms.filter((term) => searchableText.includes(term)).length;

  return matches / searchTerms.length;
}

function getTagMatchScore(place: RankedFoodPlace, preferredTags: string[]) {
  if (preferredTags.length === 0) {
    return 0;
  }

  const matches = preferredTags.filter((tag) => place.tags.includes(tag)).length;
  return matches / preferredTags.length;
}

function toRankedPlace(place: FoodPlace): RankedFoodPlace {
  const baseDistanceMeters = getDistanceMeters(place.lat, place.lng);
  const distanceSeed = hashString(`${place.name}:${place.address}:distance`);
  const distanceJitter = Math.round(seededNumber(distanceSeed, -120, 260));
  const distanceMeters = Math.max(250, baseDistanceMeters + distanceJitter);

  return {
    ...place,
    distanceMeters,
    distanceLabel: formatDistance(distanceMeters),
    priceTier: getPriceTier(place.price),
    rating: getRating(place),
    reviewCount: getReviewCount(place),
    tags: getTags(place),
  };
}

export function getPlacePreferenceSummary(prompt: string) {
  const trimmedPrompt = prompt.trim();

  if (!trimmedPrompt) {
    return "Sorted by static demo distance";
  }

  const parsedPrompt = parsePrompt(trimmedPrompt);
  const labels: string[] = [];

  if (parsedPrompt.prefersDistance) {
    labels.push("closer spots");
  }

  if (parsedPrompt.prefersBudget) {
    labels.push("better prices");
  }

  if (parsedPrompt.prefersReviews) {
    labels.push("strong reviews");
  }

  if (parsedPrompt.prefersPremium) {
    labels.push("special-night picks");
  }

  if (parsedPrompt.preferredTags.length > 0) {
    labels.push(parsedPrompt.preferredTags.join(", "));
  }

  if (parsedPrompt.searchTerms.length > 0) {
    labels.push(`matches for ${parsedPrompt.searchTerms.slice(0, 2).join(" ")}`);
  }

  return labels.length > 0 ? `Ranked for ${labels.join(" + ")}` : `Based on "${trimmedPrompt}"`;
}

export function rankPlaces(places: FoodPlace[], prompt: string) {
  const rankedPlaces = places.map(toRankedPlace);
  const trimmedPrompt = prompt.trim();

  if (!trimmedPrompt) {
    return [...rankedPlaces].sort((left, right) => left.distanceMeters - right.distanceMeters || left.priceTier - right.priceTier);
  }

  const parsedPrompt = parsePrompt(trimmedPrompt);
  const maxDistanceMeters = Math.max(...rankedPlaces.map((place) => place.distanceMeters), 1);

  return [...rankedPlaces]
    .map((place, index) => {
      const distanceScore = getDistanceScore(place.distanceMeters, maxDistanceMeters);
      const budgetScore = getBudgetScore(place.priceTier);
      const premiumScore = getPremiumScore(place.priceTier);
      const reviewScore = place.rating / 5;
      const reviewSignal = getReviewSignal(place.reviewCount);
      const textMatchScore = getTextMatchScore(place, parsedPrompt.searchTerms);
      const tagMatchScore = getTagMatchScore(place, parsedPrompt.preferredTags);

      const score =
        distanceScore * (parsedPrompt.prefersDistance ? 3 : 1.2) +
        budgetScore * (parsedPrompt.prefersBudget ? 2.5 : 0) +
        premiumScore * (parsedPrompt.prefersPremium ? 2.2 : 0) +
        reviewScore * (parsedPrompt.prefersReviews ? 2.3 : 0.6) +
        reviewSignal * (parsedPrompt.prefersReviews ? 1.4 : 0.2) +
        tagMatchScore * (parsedPrompt.preferredTags.length > 0 ? 2 : 0) +
        textMatchScore * 2;

      return { index, place, score };
    })
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.place.distanceMeters - right.place.distanceMeters ||
        right.place.rating - left.place.rating ||
        left.place.priceTier - right.place.priceTier ||
        left.index - right.index,
    )
    .map(({ place }) => place);
}
