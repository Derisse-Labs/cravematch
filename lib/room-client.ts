import type { LikePayload, RoomJoinResponse, RoomPreferencesPayload, RoomState } from "@/lib/types";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type ErrorResponse = {
  message?: string;
};

async function readJson<T>(response: Response) {
  const rawBody = await response.text();

  const parsePayload = <TValue>(fallback: TValue) => {
    if (!rawBody) {
      return fallback;
    }

    try {
      return JSON.parse(rawBody) as TValue;
    } catch {
      return fallback;
    }
  };

  if (response.ok) {
    const payload = parsePayload<T | null>(null);

    if (payload !== null) {
      return payload;
    }

    throw new ApiError("Server returned an invalid response.", response.status);
  }

  const payload = parsePayload<ErrorResponse>({});
  throw new ApiError(payload.message ?? "Request failed.", response.status);
}

export async function createRoomRequest() {
  const response = await fetch("/api/room/create", {
    method: "POST",
  });

  return readJson<RoomJoinResponse>(response);
}

export async function joinRoomRequest(roomCode: string) {
  const response = await fetch("/api/room/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomCode }),
  });

  return readJson<RoomJoinResponse>(response);
}

export async function likeFoodRequest(payload: LikePayload) {
  const response = await fetch("/api/room/like", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return readJson<RoomState>(response);
}

export async function getRoomStateRequest(roomCode: string) {
  const response = await fetch(`/api/room/state?roomCode=${encodeURIComponent(roomCode)}`, {
    method: "GET",
  });

  return readJson<RoomState>(response);
}

export async function saveRoomPreferencesRequest(payload: RoomPreferencesPayload) {
  const response = await fetch("/api/room/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return readJson<RoomState>(response);
}

export async function leaveRoomRequest(roomCode: string, role: string) {
  const response = await fetch("/api/room/leave", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomCode, role }),
  });

  return readJson<{ ok: true }>(response);
}
