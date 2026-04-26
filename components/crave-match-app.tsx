"use client";

import { HomeScreen } from "@/components/home-screen";
import { LocationsScreen } from "@/components/locations-screen";
import { MatchScreen } from "@/components/match-screen";
import { MobileShell } from "@/components/mobile-shell";
import { PreferencesScreen } from "@/components/preferences-screen";
import { SwipeScreen } from "@/components/swipe-screen";
import { useRoomSession } from "@/lib/use-room-session";
import { useSwipeGesture } from "@/lib/use-swipe-gesture";

export function CraveMatchApp() {
  const session = useRoomSession();
  const swipeGesture = useSwipeGesture({
    onLike: session.likeCurrentFood,
    onSkip: session.skipCurrentFood,
    disabled: session.step !== "swipe" || !session.currentFood,
  });

  return (
    <main className="flex min-h-dvh items-center justify-center px-0 py-0 sm:min-h-screen sm:px-4 sm:py-6">
      <MobileShell variant={session.step === "match" ? "match" : "default"}>
        {session.step === "home" ? (
          <HomeScreen
            error={session.error}
            isLoading={session.isLoading}
            joinCode={session.joinCode}
            onCreateRoom={session.createRoomSession}
            onJoinCodeChange={session.updateJoinCode}
            onJoinRoom={session.joinRoomSession}
          />
        ) : null}

        {session.step === "preferences" ? (
          <PreferencesScreen
            error={session.error}
            initialPrompt={session.placePrompt}
            isLoading={session.isLoading}
            onContinue={session.savePlacePreferences}
            onLeaveRoom={session.leaveRoom}
            onSkip={session.skipPlacePreferences}
            roomCode={session.roomCode}
          />
        ) : null}

        {session.step === "swipe" && session.currentFood ? (
          <SwipeScreen
            currentFood={session.currentFood}
            error={session.error}
            onLeaveRoom={session.leaveRoom}
            nextFood={session.nextFood}
            onLike={swipeGesture.triggerLike}
            onSkip={swipeGesture.triggerSkip}
            pointerHandlers={swipeGesture.pointerHandlers}
            role={session.role}
            roomCode={session.roomCode}
            swipeStyle={swipeGesture.cardStyle}
          />
        ) : null}

        {session.step === "match" && session.matchedFood ? (
          <MatchScreen
            food={session.matchedFood}
            onLeaveRoom={session.leaveRoom}
            onSeePlaces={session.showResults}
          />
        ) : null}

        {session.step === "result" && session.matchedFood ? (
          <LocationsScreen
            food={session.matchedFood}
            onLeaveRoom={session.leaveRoom}
            places={session.rankedPlaces}
            preferenceSummary={session.placePreferenceSummary}
          />
        ) : null}
      </MobileShell>
    </main>
  );
}
