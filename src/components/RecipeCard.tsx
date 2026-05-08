import type { CSSProperties } from "react";

export type CardSize = "sm" | "md" | "lg";

export interface RecipeCardProps {
  size?: CardSize;
  image?: string;
  category?: string;
  title?: string;
  time?: string;
  difficulty?: "Enkel" | "Medium" | "Hard" | string;
  ingredientCount?: number;
  rating?: number;
  ratingCount?: number;
  className?: string;
}

/**
 * RecipeCard
 *
 * Matches Figma ComponentSet node 2342:8605 (Size=sm/md/lg).
 *
 * Structure:
 * - Image area (aspect-ratio 4/3, full-width) with absolute overlays:
 *     • Rating chip (star + number) — top left
 *     • Category chip — top right
 * - Content area below image:
 *     • Title (Heading/5, bold)
 *     • Meta chips (pill-shape) in a flex-wrap row:
 *         – Time: clock icon + "X min"
 *         – Difficulty: dot-pattern (●○○ / ●●○ / ●●●) + label
 *         – Ingredienser: list icon + "X ingredienser"
 *
 * Tokens used (from tokens.generated.css):
 *   --card-{sm|md|lg}-min-width / max-width
 *   --card-padding, --card-gap, --card-radius
 *   --card-background, --card-border, --card-title, --card-subtitle
 *   --global-bg-secondary, --global-text-on-brand-subtle, --global-text-brand
 *   --typography-heading-sm-size / line-height
 *   --typography-caption-md-size / line-height
 *   --radius-full
 *   --grid-gutter-sm, --grid-gutter-md
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
      <div
        style={{
          background: "var(--card-background)",
          border: "1px solid var(--card-border)",
          borderRadius: "12px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* ── Image with overlays ─────────────────────────────── */}
        <div
          style={{
            position: "relative",
            aspectRatio: "4 / 3",
            flexShrink: 0,
            overflow: "hidden",
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

          {/* Rating overlay — top left */}
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "var(--global-bg-secondary, #fbf8f4)",
              borderRadius: "var(--radius-full, 999px)",
              padding: "4px 8px",
            }}
          >
            <StarIcon />
            <span
              style={{
                fontSize: "var(--typography-caption-md-size, 12px)",
                lineHeight: "var(--typography-caption-md-line-height, 17px)",
                fontWeight: 600,
                color: "var(--global-text-on-brand-subtle, #002855)",
                whiteSpace: "nowrap",
              }}
            >
              {rating.toFixed(1)}
              {ratingCount != null && ` (${ratingCount})`}
            </span>
          </div>

          {/* Category overlay — top right */}
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "var(--global-bg-secondary, #fbf8f4)",
              borderRadius: "var(--radius-full, 999px)",
              padding: "4px 8px",
            }}
          >
            <span
              style={{
                fontSize: "var(--typography-caption-md-size, 12px)",
                lineHeight: "var(--typography-caption-md-line-height, 17px)",
                color: "var(--global-text-on-brand-subtle, #002855)",
                whiteSpace: "nowrap",
              }}
            >
              {category}
            </span>
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────────── */}
        <div
          style={{
            padding: "var(--card-padding, 12px)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--card-gap, 8px)",
            flexGrow: 1,
          }}
        >
          {/* Title */}
          <p
            style={{
              fontSize: "var(--typography-heading-sm-size, 16px)",
              lineHeight: "var(--typography-heading-sm-line-height, 21px)",
              fontWeight: 700,
              color: "var(--card-title)",
              margin: 0,
            }}
          >
            {title}
          </p>

          {/* Meta chips — flex-wrap row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            {/* Time chip */}
            <MetaChip>
              <TimeIcon />
              <span>{time}</span>
            </MetaChip>

            {/* Difficulty chip */}
            <MetaChip>
              <DifficultyDots difficulty={difficulty} />
              <span>{difficultyLabel(difficulty)}</span>
            </MetaChip>

            {/* Ingredients chip */}
            <MetaChip>
              <ListIcon />
              <span>{ingredientCount} ingredienser</span>
            </MetaChip>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function MetaChip({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        background: "var(--global-bg-secondary, #fbf8f4)",
        borderRadius: "var(--radius-full, 999px)",
        padding: "4px 6px",
        height: "25px",
        boxSizing: "border-box",
        fontSize: "var(--typography-caption-md-size, 12px)",
        lineHeight: "var(--typography-caption-md-line-height, 17px)",
        color: "var(--global-text-on-brand-subtle, #002855)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
}

/**
 * Difficulty dot pattern.
 * Enkel  = ●○○ (1 filled, 2 outlined)
 * Medium = ●●○ (2 filled, 1 outlined)
 * Hard   = ●●● (3 filled, 0 outlined)
 */
function DifficultyDots({ difficulty }: { difficulty: string }) {
  const level =
    difficulty === "Hard" || difficulty === "Vanskelig"
      ? 3
      : difficulty === "Medium"
      ? 2
      : 1; // Enkel or default

  return (
    <svg
      width="28"
      height="8"
      viewBox="0 0 28 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle
        cx="4"
        cy="4"
        r="3.5"
        fill={level >= 1 ? "var(--global-text-brand, #023EA5)" : "none"}
        stroke="var(--global-text-brand, #023EA5)"
      />
      <circle
        cx="14"
        cy="4"
        r="3.5"
        fill={level >= 2 ? "var(--global-text-brand, #023EA5)" : "none"}
        stroke="var(--global-text-brand, #023EA5)"
      />
      <circle
        cx="24"
        cy="4"
        r="3.5"
        fill={level >= 3 ? "var(--global-text-brand, #023EA5)" : "none"}
        stroke="var(--global-text-brand, #023EA5)"
      />
    </svg>
  );
}

function difficultyLabel(difficulty: string): string {
  if (difficulty === "Hard") return "Vanskelig";
  return difficulty;
}

/* ── Icons (inline SVG from Figma assets) ───────────────────── */

/** Clock / time icon — Utility/Time-Clock-Circle */
function TimeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M6.00006 3.0228V6H8.40006M6.00007 11.4C7.43223 11.4 8.80574 10.8311 9.81844 9.81838C10.8311 8.80568 11.4001 7.43217 11.4001 6C11.4001 4.56783 10.8311 3.19432 9.81844 2.18162C8.80574 1.16893 7.43223 0.6 6.00007 0.6C4.5679 0.6 3.19438 1.16893 2.18169 2.18162C1.16899 3.19432 0.600065 4.56783 0.600065 6C0.600065 7.43217 1.16899 8.80568 2.18169 9.81838C3.19438 10.8311 4.5679 11.4 6.00007 11.4Z"
        stroke="var(--global-text-brand, #023EA5)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** List / ingredients icon — Utility/List */
function ListIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M9.33334 3.00002V9.7344C9.34138 10.1668 9.17742 10.5848 8.87749 10.8964C8.57755 11.2081 7.95537 11.3879 7.52293 11.3964H0.600006C1.06704 11.3649 0.66902 11.331 1.00001 11C1.331 10.669 1.30188 10.0634 1.33334 9.59641V2.13121C1.37691 1.69325 1.58907 1.28938 1.92497 1.00499C2.26087 0.720593 2.69419 0.57795 3.13334 0.607211L9.90001 0.6072M5.33334 4H7.33334M3.33334 4H3.66667M5.33334 6H7.33334M3.33334 6H3.66667M5.33334 8H7.33334M3.33334 8H3.66667M10.3333 0.666667C10.4647 0.666667 10.5947 0.701293 10.716 0.768568C10.8373 0.835844 10.9476 0.934451 11.0404 1.05876C11.1333 1.18307 11.207 1.33064 11.2572 1.49306C11.3075 1.65548 11.3333 1.82956 11.3333 2.00535V3.33333H9.33334V2.00535C9.33334 1.65031 9.4387 1.30981 9.62623 1.05876C9.81377 0.807707 10.0681 0.666667 10.3333 0.666667Z"
        stroke="var(--global-text-brand, #023EA5)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Filled star icon for the rating overlay */
function StarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M8 1.5l1.76 3.57L13.5 5.6l-2.86 2.78.67 3.93L8 10.16l-3.31 1.75.57-3.93L2.5 5.6l3.74-.53L8 1.5z"
        fill="var(--global-text-brand, #023EA5)"
        stroke="var(--global-text-brand, #023EA5)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
