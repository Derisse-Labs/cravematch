import { NextResponse } from "next/server";

import { joinRoom, RoomServiceError } from "@/lib/room-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { roomCode?: string };
    const room = joinRoom(body.roomCode ?? "");

    return NextResponse.json({
      roomCode: room.roomCode,
      role: "B",
    });
  } catch (error) {
    if (error instanceof RoomServiceError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Unable to join room." }, { status: 500 });
  }
}
