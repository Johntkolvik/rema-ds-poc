import type { CSSProperties } from "react";
import { RecipeCard, type RecipeCardProps, type CardSize } from "./RecipeCard";

export interface PromoSectionProps {
  headline?: string;
  body?: string;
  primaryCta?: { label: string; href?: string };
  secondaryCta?: { label: string; href?: string };
  cardSize?: CardSize;
  cards?: RecipeCardProps[];
}

/**
 * PromoSection
 *
 * Structure extracted via `get_design_context` from Figma node 2044:734.
 *
 * Two-layer structure:
 *   Outer — light blue background (var(--global-bg-brand-subtle)),
 *           padding from promo-section tokens, min/max width
 *   Inner — white card background, rounded-[4px],
 *           padding from promo-section tokens, gap from promo-section gap
 *
 * This matches Figma exactly: the blue "gutter" is part of the component,
 * not the page background.
 */
export function PromoSection({
  headline = "Til under 200-lappen",
  body = "Det er tid for ukens billigste middag\n- og vi har gjort planleggingen for deg.",
  primaryCta = { label: "Se ukas oppskrift", href: "#" },
  secondaryCta = { label: "Alle oppskrifter", href: "#" },
  cardSize = "md",
  cards = DEMO_CARDS,
}: PromoSectionProps) {
  /* Outer — light blue, section padding, width constraints */
  const outerStyle: CSSProperties = {
    background: "var(--global-bg-brand-subtle)",
    paddingTop: "var(--promo-section-padding-top)",
    paddingBottom: "var(--promo-section-padding-bottom)",
    paddingLeft: "var(--promo-section-padding-left)",
    paddingRight: "var(--promo-section-padding-right)",
    minWidth: "var(--promo-section-min-width)",
    maxWidth: "var(--promo-section-max-width)",
    width: "100%",
    margin: "0 auto",
    overflow: "hidden",
  };

  /* Inner — white card, same padding, section gap between header & cards */
  const innerStyle: CSSProperties = {
    background: "var(--global-surface-default)",
    borderRadius: "var(--radius-sm)",
    paddingTop: "var(--promo-section-padding-top)",
    paddingBottom: "var(--promo-section-padding-bottom)",
    paddingLeft: "var(--promo-section-padding-left)",
    paddingRight: "var(--promo-section-padding-right)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--promo-section-gap)",
    alignItems: "stretch",
    overflow: "hidden",
    width: "100%",
  };

  return (
    <section style={outerStyle}>
      <div style={innerStyle}>
        {/* Header Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          {/* Header Text Container — all text in brand blue */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--promo-section-gap)",
              color: "var(--global-text-brand)",
              width: "100%",
            }}
          >
            <h2
              style={{
                fontSize: "var(--typography-heading-2xl-size)",
                lineHeight: "var(--typography-heading-2xl-line-height)",
                fontWeight: 700,
                letterSpacing: "-0.36px",
              }}
            >
              {headline}
            </h2>
            <p
              style={{
                fontSize: "var(--typography-body-sm-size)",
                lineHeight: "var(--typography-body-sm-line-height)",
                whiteSpace: "pre-wrap",
              }}
            >
              {body}
            </p>
          </div>

          {/* CTA row — gap matches promo-section gap */}
          <div
            style={{
              display: "flex",
              gap: "var(--promo-section-gap)",
              alignItems: "center",
            }}
          >
            {primaryCta && (
              <a
                href={primaryCta.href ?? "#"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "32px",
                  padding: "8px 12px",
                  background: "var(--button-primary-background)",
                  color: "var(--button-primary-text)",
                  border: "1px solid var(--button-primary-border)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "12px",
                  fontWeight: 700,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href ?? "#"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "32px",
                  padding: "8px 12px",
                  background: "transparent",
                  color: "var(--button-secondary-text)",
                  border: "1px solid var(--button-secondary-border)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "12px",
                  fontWeight: 700,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        </div>

        {/* Recipe List Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            width: "100%",
          }}
        >
          {/* Recipe Cards Container — 8px gap between cards */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "stretch",
              width: "100%",
              overflow: "hidden",
            }}
          >
            {cards.map((card, i) => (
              <RecipeCard key={i} {...card} size={cardSize} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Demo data ──────────────────────────────────────────────── */
const DEMO_CARDS: RecipeCardProps[] = [
  {
    category: "Pasta",
    title: "Pasta med kylling og kremet saus",
    time: "20 min",
    difficulty: "Enkel",
    ingredientCount: 10,
    rating: 3.4,
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80",
  },
  {
    category: "Suppe",
    title: "Tomatsuppe med sprøtt brød",
    time: "30 min",
    difficulty: "Enkel",
    ingredientCount: 7,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80",
  },
  {
    category: "Middag",
    title: "Kyllinggryte med grønnsaker",
    time: "40 min",
    difficulty: "Middels",
    ingredientCount: 12,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=600&q=80",
  },
  {
    category: "Vegetar",
    title: "Grønn thai-curry",
    time: "25 min",
    difficulty: "Enkel",
    ingredientCount: 9,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80",
  },
  {
    category: "Fisk",
    title: "Ovnsbakt laks med sitron",
    time: "35 min",
    difficulty: "Enkel",
    ingredientCount: 6,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
  },
];
