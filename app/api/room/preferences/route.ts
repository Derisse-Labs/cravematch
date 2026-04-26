import { NextResponse } from "next/server";

import { RoomServiceError, setRoomPreferences } from "@/lib/room-service";
import type { Role } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      roomCode?: string;
      role?: Role;
      prompt?: string;
    };

    const room = setRoomPreferences({
      roomCode: body.roomCode ?? "",
      role: body.role,
      prompt: body.prompt ?? "",
    });

    return NextResponse.json(room);
  } catch (error) {
    if (error instanceof RoomServiceError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Unable to save place preferences." }, { status: 500 });
  }
}
