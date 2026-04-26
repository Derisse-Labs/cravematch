import { NextResponse } from "next/server";

import { likeFood, RoomServiceError } from "@/lib/room-service";
import type { Role } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      roomCode?: string;
      role?: Role;
      foodId?: string;
    };

    const room = likeFood({
      roomCode: body.roomCode ?? "",
      role: body.role,
      foodId: body.foodId ?? "",
    });

    return NextResponse.json(room);
  } catch (error) {
    if (error instanceof RoomServiceError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Unable to save like." }, { status: 500 });
  }
}
