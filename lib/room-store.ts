import type { StoredRoomState } from "@/lib/types";

type RoomStore = Record<string, StoredRoomState>;

declare global {
  // eslint-disable-next-line no-var
  var __cravematchRooms: RoomStore | undefined;
}

const globalRooms = globalThis.__cravematchRooms ?? {};

if (!globalThis.__cravematchRooms) {
  globalThis.__cravematchRooms = globalRooms;
}

export const rooms = globalRooms;
