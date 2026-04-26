import { rooms } from "@/lib/room-store";
import { generateRoomCode, isRole, normalizeRoomCode } from "@/lib/room-utils";
import type { Role, RoomState, StoredRoomState } from "@/lib/types";

type LikeFoodInput = {
  roomCode: string;
  role: unknown;
  foodId: string;
};

type LeaveRoomInput = {
  roomCode: string;
  role: unknown;
};

export class RoomServiceError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function getRoomOrThrow(roomCode: string) {
  const normalizedCode = normalizeRoomCode(roomCode);
  const room = rooms[normalizedCode];

  if (!room) {
    throw new RoomServiceError("Room not found.", 404);
  }

  return room;
}

function getLikesByRole(room: StoredRoomState, role: Role) {
  return role === "A" ? room.playerA : room.playerB;
}

function isRoleJoined(room: StoredRoomState, role: Role) {
  return role === "A" ? room.playerAJoined : room.playerBJoined;
}

function serializeRoom(room: StoredRoomState): RoomState {
  return {
    roomCode: room.roomCode,
    playerA: room.playerA,
    playerB: room.playerB,
    match: room.match,
  };
}

function syncMatch(room: StoredRoomState) {
  room.match = room.playerA.find((id) => room.playerB.includes(id)) ?? null;
}

export function createRoom() {
  let roomCode = generateRoomCode();

  while (rooms[roomCode]) {
    roomCode = generateRoomCode();
  }

  rooms[roomCode] = {
    roomCode,
    playerA: [],
    playerB: [],
    match: null,
    playerAJoined: true,
    playerBJoined: false,
  };

  return serializeRoom(rooms[roomCode]);
}

export function joinRoom(roomCode: string) {
  const room = getRoomOrThrow(roomCode);

  if (room.playerBJoined) {
    throw new RoomServiceError("Room already has two players.", 409);
  }

  room.playerBJoined = true;
  room.playerB = [];
  room.match = null;

  return serializeRoom(room);
}

export function likeFood({ roomCode, role, foodId }: LikeFoodInput) {
  if (!foodId) {
    throw new RoomServiceError("Food ID is required.");
  }

  if (!isRole(role)) {
    throw new RoomServiceError("Role must be A or B.");
  }

  const room = getRoomOrThrow(roomCode);

  if (!isRoleJoined(room, role)) {
    throw new RoomServiceError("Player is not active in this room.", 409);
  }

  const likes = getLikesByRole(room, role);

  if (!likes.includes(foodId)) {
    likes.push(foodId);
  }

  syncMatch(room);

  return serializeRoom(room);
}

export function getRoomState(roomCode: string) {
  return serializeRoom(getRoomOrThrow(roomCode));
}

export function leaveRoom({ roomCode, role }: LeaveRoomInput) {
  if (!isRole(role)) {
    throw new RoomServiceError("Role must be A or B.");
  }

  const room = getRoomOrThrow(roomCode);

  if (role === "A") {
    delete rooms[room.roomCode];
    return;
  }

  room.playerB = [];
  room.playerBJoined = false;
  syncMatch(room);
}

export { normalizeRoomCode };
