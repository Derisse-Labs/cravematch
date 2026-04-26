import { PrimaryButton } from "@/components/primary-button";

type HomeScreenProps = {
  joinCode: string;
  error: string;
  isLoading: boolean;
  onJoinCodeChange: (value: string) => void;
  onCreateRoom: () => Promise<void>;
  onJoinRoom: () => Promise<void>;
};

export function HomeScreen({
  joinCode,
  error,
  isLoading,
  onJoinCodeChange,
  onCreateRoom,
  onJoinRoom,
}: HomeScreenProps) {
  const handleCreatePress = () => {
    void onCreateRoom();
  };

  const handleJoinPress = () => {
    if (joinCode.length === 0) {
      return;
    }

    void onJoinRoom();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-between overflow-y-auto px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] sm:px-6 sm:py-8">
      <div className="space-y-6">
        <div className="inline-flex rounded-full bg-[#ff5f40]/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#b3290f]">
          Mobile demo
        </div>

        <div className="space-y-4">
          <h1 className="max-w-[14rem] text-5xl font-extrabold tracking-[-0.05em] text-[#221b19]">
            CraveMatch
          </h1>
          <p className="max-w-[20rem] text-base leading-7 text-[#6b4a42]">
            Two phones. One room code. Like Vietnamese food together and instantly match on what to eat in Da Nang.
          </p>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_18px_40px_rgba(255,95,64,0.10)]">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a3412]">Start a room</p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#2b211e]">
                Create a private code for both phones.
              </h2>
            </div>
            <PrimaryButton disabled={isLoading} className="w-full" onClick={handleCreatePress} type="button">
              {isLoading ? "Creating..." : "Create Room"}
            </PrimaryButton>
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_18px_40px_rgba(255,95,64,0.08)]">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a3412]">Join a room</p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#2b211e]">
                Enter the shared code and become Player B.
              </h2>
            </div>

            <input
              className="h-14 w-full rounded-2xl border border-[#f3d0c7] bg-white px-4 text-base font-semibold uppercase tracking-[0.18em] text-[#7c2d12] outline-none ring-0 placeholder:tracking-[0.18em] placeholder:text-[#c08472] focus:border-[#ff5f40]"
              enterKeyHint="go"
              maxLength={9}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleJoinPress();
                }
              }}
              onChange={(event) => onJoinCodeChange(event.target.value)}
              placeholder="FOOD-1234"
              value={joinCode}
            />

            <PrimaryButton
              disabled={isLoading || joinCode.length === 0}
              className="w-full"
              onClick={handleJoinPress}
              type="button"
              variant="secondary"
            >
              {isLoading ? "Joining..." : "Join Room"}
            </PrimaryButton>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-6">
        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}
        <p className="text-sm leading-6 text-[#7b5e56]">
          Tip: open the app on both phones on the same Wi-Fi, then share the room code.
        </p>
      </div>
    </div>
  );
}
