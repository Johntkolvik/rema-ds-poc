import type { CSSProperties } from "react";

export type ProductCardSize = "sm" | "md" | "lg";

export interface ProductCardProps {
  size?: ProductCardSize;
  image?: string;
  name?: string;
  weight?: string;
  price?: number;
  originalPrice?: number;
  badge?: string;
  className?: string;
}

/**
 * ProductCard
 *
 * Responsive tokens (from tokens.generated.css):
 *   --product-card-{sm|md|lg}-min-width / max-width
 *   --product-card-padding, --product-card-gap, --product-card-radius
 *   --product-card-image-height
 *   --product-card-price-size / line-height
 *   --product-card-badge-padding-x / padding-y
 *
 * Semantic tokens (shared with design system):
 *   --card-background, --card-border, --card-title, --card-subtitle
 *   --global-text-brand, --badge-danger-background, --badge-danger-text
 *   --font-family-price
 *
 * Zero media queries — all responsive behaviour from CSS custom properties.
 */
export function ProductCard({
  size = "md",
  image,
  name = "Produktnavn",
  weight = "1.5L",
  price = 29.9,
  originalPrice,
  badge,
  className,
}: ProductCardProps) {
  const sizeVars = {
    "--min-w": `var(--product-card-${size}-min-width)`,
    "--max-w": `var(--product-card-${size}-max-width)`,
  } as CSSProperties;

  const hasOffer = originalPrice != null && originalPrice > price;
  const formattedPrice = formatPrice(price);
  const formattedOriginal = originalPrice ? formatPrice(originalPrice) : null;

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
          borderRadius: "var(--product-card-radius)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
        }}
      >
        {/* Badge */}
        {badge && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              zIndex: 1,
              background: "var(--badge-danger-background)",
              color: "var(--badge-danger-text)",
              padding:
                "var(--product-card-badge-padding-y) var(--product-card-badge-padding-x)",
              borderRadius: "var(--radius-sm)",
              fontSize: "var(--typography-eyebrow-md-size)",
              lineHeight: "var(--typography-eyebrow-md-line-height)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {badge}
          </div>
        )}

        {/* Image */}
        <div
          style={{
            height: "var(--product-card-image-height)",
            overflow: "hidden",
            flexShrink: 0,
            background: "var(--global-bg-tertiary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--product-card-padding)",
          }}
        >
          {image ? (
            <img
              src={image}
              alt={name}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: "60%",
                height: "60%",
                background: "var(--global-bg-secondary)",
                borderRadius: "var(--radius-md)",
              }}
            />
          )}
        </div>

        {/* Content */}
        <div
          style={{
            padding: "var(--product-card-padding)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--product-card-gap)",
            flexGrow: 1,
          }}
        >
          {/* Product name */}
          <p
            style={{
              fontSize: "var(--typography-body-sm-size)",
              lineHeight: "var(--typography-body-sm-line-height)",
              fontWeight: 400,
              color: "var(--card-title)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {name}
          </p>

          {/* Weight / volume */}
          <p
            style={{
              fontSize: "var(--typography-caption-md-size)",
              lineHeight: "var(--typography-caption-md-line-height)",
              color: "var(--card-subtitle)",
            }}
          >
            {weight}
          </p>

          {/* Price area — pushed to bottom */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "6px",
              marginTop: "auto",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-family-price)",
                fontSize: "var(--product-card-price-size)",
                lineHeight: "var(--product-card-price-line-height)",
                fontWeight: 700,
                color: hasOffer
                  ? "var(--color-red-500)"
                  : "var(--card-title)",
              }}
            >
              {formattedPrice}
            </span>
            {hasOffer && formattedOriginal && (
              <span
                style={{
                  fontSize: "var(--typography-caption-md-size)",
                  lineHeight: "var(--typography-caption-md-line-height)",
                  color: "var(--card-subtitle)",
                  textDecoration: "line-through",
                }}
              >
                {formattedOriginal}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Helpers ────────────────────────────────────────────────── */

function formatPrice(value: number): string {
  const [whole, decimals] = value.toFixed(2).split(".");
  if (decimals === "00") return `${whole},-`;
  return `${whole},${decimals}`;
}
