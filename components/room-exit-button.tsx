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
      className={`inline-flex min-h-11 items-center justify-center rounded-full border px-4 text-sm font-bold transition active:scale-[0.98] ${toneClassName}`}
      onClick={onClick}
      type="button"
    >
      Quit room
    </button>
  );
}
