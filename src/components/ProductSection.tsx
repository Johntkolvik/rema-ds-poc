import type { CSSProperties } from "react";
import {
  ProductCard,
  type ProductCardProps,
  type ProductCardSize,
} from "./ProductCard";

export interface ProductSectionProps {
  headline?: string;
  cardSize?: ProductCardSize;
  cards?: ProductCardProps[];
}

/**
 * ProductSection
 *
 * Horizontal product grid using the same responsive token pattern
 * as PromoSection. Renders ProductCards in a flex row that wraps.
 */
export function ProductSection({
  headline = "Populære produkter",
  cardSize = "md",
  cards = DEMO_PRODUCTS,
}: ProductSectionProps) {
  const outerStyle: CSSProperties = {
    background: "var(--global-bg-primary)",
    paddingTop: "var(--promo-section-padding-top)",
    paddingBottom: "var(--promo-section-padding-bottom)",
    paddingLeft: "var(--promo-section-padding-left)",
    paddingRight: "var(--promo-section-padding-right)",
    width: "100%",
    maxWidth: "var(--page-max-width)",
    margin: "0 auto",
  };

  return (
    <section style={outerStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--promo-section-gap)",
        }}
      >
        {/* Header */}
        <h2
          style={{
            fontSize: "var(--typography-heading-xl-size)",
            lineHeight: "var(--typography-heading-xl-line-height)",
            fontWeight: 700,
            color: "var(--global-text-primary)",
          }}
        >
          {headline}
        </h2>

        {/* Product grid */}
        <div
          style={{
            display: "flex",
            gap: "var(--grid-gutter-md)",
            flexWrap: "wrap",
            alignItems: "stretch",
          }}
        >
          {cards.map((card, i) => (
            <ProductCard key={i} {...card} size={cardSize} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Demo data ──────────────────────────────────────────────── */
const DEMO_PRODUCTS: ProductCardProps[] = [
  {
    name: "Coca-Cola Original",
    weight: "1.5L",
    price: 23.9,
    originalPrice: 34.9,
    badge: "Tilbud",
    image:
      "https://bilder.ngdata.no/7044610874418/meny/large.jpg",
  },
  {
    name: "Coca-Cola Zero Sugar",
    weight: "1.5L",
    price: 23.9,
    originalPrice: 34.9,
    badge: "Tilbud",
    image:
      "https://bilder.ngdata.no/7044610874524/meny/large.jpg",
  },
  {
    name: "Coca-Cola Original",
    weight: "330ml boks",
    price: 15.9,
    image:
      "https://bilder.ngdata.no/5000112636710/meny/large.jpg",
  },
  {
    name: "Fanta Orange",
    weight: "1.5L",
    price: 23.9,
    originalPrice: 34.9,
    badge: "Tilbud",
    image:
      "https://bilder.ngdata.no/7044610874319/meny/large.jpg",
  },
  {
    name: "Sprite",
    weight: "1.5L",
    price: 34.9,
    image:
      "https://bilder.ngdata.no/5000112602784/meny/large.jpg",
  },
];
