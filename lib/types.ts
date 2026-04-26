export type Role = "A" | "B";

export type Step = "home" | "swipe" | "match" | "result";

export type FoodPlace = {
  name: string;
  distance: string;
};

export type FoodItem = {
  id: string;
  name: string;
  image: string;
  places: FoodPlace[];
};

export type RoomState = {
  roomCode: string;
  playerA: string[];
  playerB: string[];
  match: string | null;
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
