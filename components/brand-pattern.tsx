/**
 * Brand patterns — CSS-based recreations of the three brand patterns.
 * Each renders as an absolutely-positioned overlay, so pass positioning
 * classes via `className` (e.g. "absolute inset-0 text-black/[0.06]").
 */

/**
 * Dots pattern (produce) — repeating circles via radial-gradient.
 */
export function DotsPattern({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        backgroundImage:
          "radial-gradient(circle, currentColor 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
      }}
    />
  );
}

/**
 * Wavy pattern (sea) — repeating wavy horizontal lines via inline SVG.
 */
export function WavyPattern({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="wavy-pattern"
          x="0"
          y="0"
          width="60"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 10 Q15 0 30 10 Q45 20 60 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wavy-pattern)" />
    </svg>
  );
}

/**
 * Dash pattern (soil/earth) — repeating diagonal dashes via inline SVG.
 */
export function DashPattern({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="dash-pattern"
          x="0"
          y="0"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-30)"
        >
          <line
            x1="4"
            y1="12"
            x2="20"
            y2="12"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dash-pattern)" />
    </svg>
  );
}
