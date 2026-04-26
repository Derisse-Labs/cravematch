import { useCallback, useEffect, useMemo, useState } from "react";

import { foods } from "@/lib/foods";
import {
  ApiError,
  createRoomRequest,
  getRoomStateRequest,
  joinRoomRequest,
  leaveRoomRequest,
  likeFoodRequest,
} from "@/lib/room-client";
import { normalizeRoomCode } from "@/lib/room-utils";
import type { Role, Step } from "@/lib/types";

const ROOM_CODE_KEY = "cravematch-roomCode";
const ROLE_KEY = "cravematch-role";

export function useRoomSession() {
  const [roomCode, setRoomCode] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [match, setMatch] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("home");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const currentFood = foods[currentIndex] ?? foods[0];
  const nextFood = foods[(currentIndex + 1) % foods.length] ?? foods[0];

  const matchedFood = useMemo(
    () => foods.find((food) => food.id === match) ?? null,
    [match],
  );

  const advanceFood = useCallback(() => {
    setCurrentIndex((index) => (index + 1) % foods.length);
  }, []);

  const clearStoredSession = useCallback(() => {
    window.localStorage.removeItem(ROOM_CODE_KEY);
    window.localStorage.removeItem(ROLE_KEY);
  }, []);

  const resetToHome = useCallback((nextError = "") => {
    setRoomCode("");
    setRole(null);
    setMatch(null);
    setCurrentIndex(0);
    setJoinCode("");
    setError(nextError);
    setStep("home");
    clearStoredSession();
  }, [clearStoredSession]);

  const createRoomSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await createRoomRequest();

      setRoomCode(response.roomCode);
      setRole(response.role);
      setCurrentIndex(0);
      setMatch(null);
      setStep("swipe");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create room.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const joinRoomSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const normalizedCode = normalizeRoomCode(joinCode);
      const response = await joinRoomRequest(normalizedCode);

      setRoomCode(response.roomCode);
      setRole(response.role);
      setCurrentIndex(0);
      setMatch(null);
      setStep("swipe");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to join room.");
    } finally {
      setIsLoading(false);
    }
  }, [joinCode]);

  const likeCurrentFood = useCallback(async () => {
    if (!roomCode || !role || !currentFood) {
      return;
    }

    setError("");
    const selectedFoodId = currentFood.id;
    advanceFood();

    try {
      const room = await likeFoodRequest({
        roomCode,
        role,
        foodId: selectedFoodId,
      });

      if (room.match) {
        setMatch(room.match);
        setStep("match");
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save like.");
    }
  }, [advanceFood, currentFood, role, roomCode]);

  const skipCurrentFood = useCallback(async () => {
    setError("");
    advanceFood();
  }, [advanceFood]);

  const showResults = useCallback(() => {
    setStep("result");
  }, []);

  const leaveRoom = useCallback(async () => {
    if (roomCode && role) {
      try {
        await leaveRoomRequest(roomCode, role);
      } catch {
        // Local exit should still work even if the room has already disappeared.
      }
    }

    resetToHome();
  }, [resetToHome, role, roomCode]);

  const updateJoinCode = useCallback((value: string) => {
    setJoinCode(normalizeRoomCode(value));
  }, []);

  useEffect(() => {
    const storedRoomCode = window.localStorage.getItem(ROOM_CODE_KEY);
    const storedRole = window.localStorage.getItem(ROLE_KEY);

    if (!storedRoomCode || (storedRole !== "A" && storedRole !== "B")) {
      return;
    }

    setRoomCode(storedRoomCode);
    setRole(storedRole);
    setStep("swipe");
  }, []);

  useEffect(() => {
    if (!roomCode || !role) {
      clearStoredSession();
      return;
    }

    window.localStorage.setItem(ROOM_CODE_KEY, roomCode);
    window.localStorage.setItem(ROLE_KEY, role);
  }, [clearStoredSession, role, roomCode]);

  useEffect(() => {
    if (!roomCode || !role || step !== "swipe") {
      return;
    }

    let active = true;

    const syncRoomState = async () => {
      try {
        const room = await getRoomStateRequest(roomCode);

        if (!active) {
          return;
        }

        if (room.match) {
          setMatch(room.match);
          setStep("match");
        }
      } catch (requestError) {
        if (!active) {
          return;
        }

        if (requestError instanceof ApiError && requestError.status === 404) {
          resetToHome("Room expired. Create a new room.");
          return;
        }

        setError(requestError instanceof Error ? requestError.message : "Unable to sync room.");
      }
    };

    void syncRoomState();
    const intervalId = window.setInterval(syncRoomState, 1500);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [resetToHome, role, roomCode, step]);

  return {
    roomCode,
    role,
    currentFood,
    nextFood,
    matchedFood,
    step,
    joinCode,
    error,
    isLoading,
    createRoomSession,
    joinRoomSession,
    likeCurrentFood,
    skipCurrentFood,
    showResults,
    leaveRoom,
    updateJoinCode,
  };
}
