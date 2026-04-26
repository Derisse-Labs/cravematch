import type { Role } from "@/lib/types";

export function normalizeRoomCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

export function isRole(value: unknown): value is Role {
  return value === "A" || value === "B";
}

export function generateRoomCode() {
  return `FOOD-${Math.floor(1000 + Math.random() * 9000)}`;
}
