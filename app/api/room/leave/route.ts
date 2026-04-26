import { NextResponse } from "next/server";

import { leaveRoom, RoomServiceError } from "@/lib/room-service";
import type { Role } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      roomCode?: string;
      role?: Role;
    };

    leaveRoom({
      roomCode: body.roomCode ?? "",
      role: body.role,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof RoomServiceError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Unable to leave room." }, { status: 500 });
  }
}
