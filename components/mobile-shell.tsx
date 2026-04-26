type MobileShellProps = {
  children: React.ReactNode;
  variant?: "default" | "match";
};

export function MobileShell({ children, variant = "default" }: MobileShellProps) {
  const shellClassName =
    variant === "match"
      ? "border border-white/25 bg-white/12 shadow-[0_30px_90px_rgba(255,95,64,0.22)] backdrop-blur-xl"
      : "border border-white/70 bg-white/85 shadow-[0_24px_80px_rgba(255,95,64,0.15)] backdrop-blur-md";

  return (
    <div
      className={`relative flex min-h-dvh w-full max-w-[430px] flex-col overflow-hidden sm:min-h-[min(884px,100dvh)] sm:rounded-[32px] ${shellClassName}`}
    >
      {children}
    </div>
  );
}
