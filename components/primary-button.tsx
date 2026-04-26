type PrimaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  onTouchEnd?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
  type?: "button" | "submit";
};

export function PrimaryButton({
  children,
  onClick,
  onTouchEnd,
  disabled,
  variant = "primary",
  className = "",
  type = "button",
}: PrimaryButtonProps) {
  const toneClassName =
    variant === "primary"
      ? "bg-[#ff5f40] text-white shadow-[0_18px_35px_rgba(255,95,64,0.32)]"
      : "bg-white/70 text-[#7a341f] shadow-[0_12px_28px_rgba(255,95,64,0.12)]";

  return (
    <button
      className={`relative z-10 inline-flex min-h-14 touch-manipulation select-none items-center justify-center rounded-2xl px-5 text-base font-bold transition enabled:cursor-pointer enabled:hover:scale-[1.01] enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${toneClassName} ${className}`}
      disabled={disabled}
      onClick={onClick}
      onTouchEnd={onTouchEnd}
      type={type}
    >
      {children}
    </button>
  );
}
