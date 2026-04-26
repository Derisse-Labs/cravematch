type RoomExitButtonProps = {
  onClick: () => void;
  inverse?: boolean;
};

export function RoomExitButton({ onClick, inverse = false }: RoomExitButtonProps) {
  const toneClassName = inverse
    ? "border-white/25 bg-white/14 text-white hover:bg-white/22"
    : "border-white/80 bg-white/72 text-[#7a341f] hover:bg-white";

  return (
    <button
      aria-label="Quit room"
      className={`inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border transition active:scale-[0.98] ${toneClassName}`}
      onClick={onClick}
      type="button"
    >
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
        <path
          d="M6 6L18 18M18 6L6 18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.4"
        />
      </svg>
    </button>
  );
}
