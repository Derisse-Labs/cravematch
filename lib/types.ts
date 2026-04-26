export type Role = "A" | "B";

export type Step = "home" | "preferences" | "swipe" | "match" | "result";

export type FoodPlace = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  price: string;
  googleMapsUrl: string;
};

export type FoodItem = {
  id: string;
  name: string;
  emoji: string;
  image: string;
  places: FoodPlace[];
};

export type RankedFoodPlace = FoodPlace & {
  distanceMeters: number;
  distanceLabel: string;
  priceTier: 1 | 2 | 3;
  rating: number;
  reviewCount: number;
  tags: string[];
};

export type RoomState = {
  roomCode: string;
  playerA: string[];
  playerB: string[];
  match: string | null;
  placePrompt: string;
  preferencesReady: boolean;
};

export type StoredRoomState = RoomState & {
  playerAJoined: boolean;
  playerBJoined: boolean;
};

export type RoomJoinResponse = {
  roomCode: string;
  role: Role;
};

export type LikePayload = {
  roomCode: string;
  role: Role;
  foodId: string;
};

export type RoomPreferencesPayload = {
  roomCode: string;
  role: Role;
  prompt: string;
};
