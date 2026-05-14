import { BRAND_NAME_WITH_DEGREE } from "@/lib/brand";

// Logo RawSpot — SVG inline, currentColor pour adaptation light/dark.
// Couleur définie par le parent via `color` CSS ou utility `text-…`.
//
// Variantes :
//   - "full"     : icône circulaire + texte "RawSpot°"
//   - "icon"     : icône circulaire seule
//   - "monogram" : monogramme "R°" texte pur
//
// Tailles (en px) : sm=24, md=40, lg=80.

export type LogoVariant = "full" | "icon" | "monogram";
export type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  title?: string;
}

const SIZE_PX: Record<LogoSize, number> = {
  sm: 24,
  md: 40,
  lg: 80,
};

export function Logo({
  variant = "full",
  size = "md",
  className,
  title = BRAND_NAME_WITH_DEGREE,
}: LogoProps) {
  const px = SIZE_PX[size];

  if (variant === "monogram") {
    return (
      <span
        className={className}
        role="img"
        aria-label={title}
        style={{
          display: "inline-block",
          fontSize: px * 0.8,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          fontFeatureSettings: "'ss01' on",
        }}
      >
        R°
      </span>
    );
  }

  if (variant === "icon") {
    return (
      <LogoIcon size={px} className={className} title={title} />
    );
  }

  // variant === "full"
  return (
    <span
      className={className}
      role="img"
      aria-label={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: px * 0.25,
        lineHeight: 1,
      }}
    >
      <LogoIcon size={px} aria-hidden />
      <span
        style={{
          fontSize: px * 0.55,
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}
      >
        {BRAND_NAME_WITH_DEGREE}
      </span>
    </span>
  );
}

function LogoIcon({
  size,
  className,
  title,
}: {
  size: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="32" cy="32" r="29" fill="currentColor" opacity="0.06" />
      <circle
        cx="32"
        cy="32"
        r="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="30"
        fontWeight="600"
        fill="currentColor"
        fontFamily="var(--font-geist-sans), system-ui, sans-serif"
      >
        R°
      </text>
    </svg>
  );
}
