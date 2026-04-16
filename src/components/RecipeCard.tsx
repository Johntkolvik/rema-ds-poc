import type { CSSProperties } from "react";

export type CardSize = "sm" | "md" | "lg";

export interface RecipeCardProps {
  size?: CardSize;
  image?: string;
  category?: string;
  title?: string;
  time?: string;
  difficulty?: string;
  ingredientCount?: number;
  rating?: number;
  ratingCount?: number;
  className?: string;
}

/**
 * RecipeCard
 *
 * Structure and values extracted via `get_design_context` from Figma
 * node 2044:669 (Size=md variant).
 *
 * Responsive tokens (from tokens.generated.css):
 *   --card-{sm|md|lg}-min-width / max-width
 *   --card-padding, --card-gap, --card-radius
 *
 * Semantic tokens:
 *   --card-background, --card-border, --card-title, --card-subtitle
 *   --global-text-brand
 *
 * Typography tokens:
 *   --typography-label-md-size / line-height
 *   --typography-heading-sm-size / line-height
 */
export function RecipeCard({
  size = "md",
  image,
  category = "Kategori",
  title = "Oppskriftstittel",
  time = "20 min",
  difficulty = "Enkel",
  ingredientCount = 8,
  rating = 4.0,
  ratingCount,
  className,
}: RecipeCardProps) {
  const sizeVars = {
    "--min-w": `var(--card-${size}-min-width)`,
    "--max-w": `var(--card-${size}-max-width)`,
  } as CSSProperties;

  const filledStars = Math.round(rating);

  return (
    <article
      className={className}
      style={{
        ...sizeVars,
        minWidth: "var(--min-w)",
        maxWidth: "var(--max-w)",
        flex: "1 1 var(--min-w)",
      }}
    >
      {/* Outer card — matches Figma: white bg, border, rounded-12, pb-20 */}
      <div
        style={{
          background: "var(--card-background)",
          border: "1px solid var(--card-border)",
          borderRadius: "12px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          paddingBottom: "20px",
        }}
      >
        {/* MediaContainer — fixed 200px height, card-radius on image */}
        <div
          style={{
            height: "200px",
            overflow: "hidden",
            borderRadius: "var(--card-radius)",
            flexShrink: 0,
            background: "var(--global-bg-tertiary)",
          }}
        >
          {image ? (
            <img
              src={image}
              alt={title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "var(--global-bg-tertiary)",
              }}
            />
          )}
        </div>

        {/* Content — padding and gap from card tokens */}
        <div
          style={{
            padding: "var(--card-padding)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--card-gap)",
            flexGrow: 1,
          }}
        >
          {/* Category */}
          <p
            style={{
              fontSize: "var(--typography-label-md-size)",
              lineHeight: "var(--typography-label-md-line-height)",
              color: "var(--card-subtitle)",
            }}
          >
            {category}
          </p>

          {/* Title */}
          <p
            style={{
              fontSize: "var(--typography-heading-sm-size)",
              lineHeight: "var(--typography-heading-sm-line-height)",
              fontWeight: 700,
              color: "var(--card-title)",
            }}
          >
            {title}
          </p>

          {/* Meta row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flexWrap: "wrap",
            }}
          >
            <MetaItem icon="⏱" label={time} />
            <Dot />
            <MetaItem label={difficulty} variant="brand" />
            <Dot />
            <MetaItem label={`${ingredientCount} ingredienser`} />
          </div>

          {/* Star rating */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              marginTop: "2px",
            }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} filled={i < filledStars} />
            ))}
            <div style={{ width: "4px" }} />
            <span
              style={{
                fontSize: "var(--typography-label-md-size)",
                lineHeight: "var(--typography-label-md-line-height)",
                color: "var(--card-subtitle)",
              }}
            >
              {rating.toFixed(1)}
              {ratingCount && ` (${ratingCount})`}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function MetaItem({
  icon,
  label,
  variant = "default",
}: {
  icon?: string;
  label: string;
  variant?: "default" | "brand";
}) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: "3px",
        fontSize: "var(--typography-label-md-size)",
        lineHeight: "var(--typography-label-md-line-height)",
        color: variant === "brand" ? "var(--global-text-brand)" : "var(--card-subtitle)",
        fontWeight: variant === "brand" ? 700 : 400,
        whiteSpace: "nowrap",
      }}
    >
      {icon && <span style={{ fontSize: "11px" }}>{icon}</span>}
      {label}
    </span>
  );
}

function Dot() {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "16px",
        height: "3px",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: "3px",
          height: "3px",
          borderRadius: "50%",
          background: "var(--card-subtitle)",
        }}
      />
    </span>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5l1.76 3.57L13.5 5.6l-2.86 2.78.67 3.93L8 10.16l-3.31 1.75.57-3.93L2.5 5.6l3.74-.53L8 1.5z"
        fill={filled ? "var(--global-text-brand)" : "none"}
        stroke={filled ? "var(--global-text-brand)" : "var(--global-border-secondary)"}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
