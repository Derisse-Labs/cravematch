import type { Role } from "@/lib/types";

export function normalizeRoomCode(value: string) {
  const normalizedValue = value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

  return normalizedValue.startsWith("FOOD") ? normalizedValue.slice(4) : normalizedValue;
}

export function isRole(value: unknown): value is Role {
  return value === "A" || value === "B";
}

export function generateRoomCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}
