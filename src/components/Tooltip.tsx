interface TooltipProps {
  content: string;
  x: number;
  y: number;
  visible: boolean;
}

export default function Tooltip({ content, x, y, visible }: TooltipProps) {
  if (!visible) return null;

  const clampedX = Math.min(x + 12, window.innerWidth - 200);
  const clampedY = Math.max(y - 12, 10);

  return (
    <div
      className="pointer-events-none fixed z-50 max-w-[220px] rounded-lg bg-ascte-crimson px-3 py-2 text-sm text-white shadow-lg"
      style={{
        left: clampedX,
        top: clampedY,
      }}
    >
      {content}
    </div>
  );
}
