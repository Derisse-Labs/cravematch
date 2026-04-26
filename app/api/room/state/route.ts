import { NextResponse } from "next/server";

import { getRoomState, RoomServiceError } from "@/lib/room-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomCode = searchParams.get("roomCode") ?? "";
    const room = getRoomState(roomCode);

    return NextResponse.json(room);
  } catch (error) {
    if (error instanceof RoomServiceError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Unable to load room." }, { status: 500 });
  }
}
