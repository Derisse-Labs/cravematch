import { NextResponse } from "next/server";

import { createRoom } from "@/lib/room-service";

export async function POST() {
  const room = createRoom();

  return NextResponse.json({
    roomCode: room.roomCode,
    role: "A",
  });
}
