# Agents Notes

## Goal
- Build a minimal mobile-first "Tinder for Vietnamese food" demo called `CraveMatch`.
- Two phones join the same room code, like foods, and both see a match when they overlap.

## Hard Constraints
- Next.js App Router.
- Single page only. No route-based UI flow.
- No authentication.
- No database.
- No external APIs.
- Use only the static food data in `lib/foods.ts`.
- Sync with polling, not WebSockets.
- Keep the app fast and simple.

## Architecture
- `app/page.tsx` only mounts the client app.
- UI lives in `components/`.
- Logic and business rules live in `lib/`.
- API handlers call `lib/room-service.ts`.
- In-memory rooms are stored in `lib/room-store.ts`.

## UI References
- Use `ui-samples/swipe-screen.html` for swipe-screen styling direction.
- Use `ui-samples/match-screen.html` for match-screen styling direction.
- Use `ui-samples/locations-screen.html` for locations-screen styling direction.
- Treat samples as inspiration, not exact structure.

## Behavior Rules
- First user to create a room is Player A.
- Second user to join is Player B.
- Third user must be rejected.
- Room codes are normalized to uppercase trimmed values.
- Refresh restores `roomCode` and `role` from local storage.
- Swiping right likes. Swiping left skips.
- Keep buttons visible even with gestures enabled.
- When a shared match exists, both devices switch to the match screen.
- The result screen transition is local to each device.

## Local Demo Notes
- Run `npm run dev`.
- App binds to `0.0.0.0` for local network testing.
- Open the host machine LAN IP on both phones.
- In-memory room data resets on server restart.
