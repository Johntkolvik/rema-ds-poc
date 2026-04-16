/**
 * Code Connect — PromoSection
 *
 * Links the Figma Promo-section component to the React implementation.
 * Publish with: npx figma connect publish
 */
import figma from "@figma/code-connect";
import { PromoSection } from "./PromoSection";

figma.connect(
  PromoSection,
  "https://www.figma.com/design/TPytjALjphlR0C6DJGvohU/REMA-Variable-POC--GitHub-?node-id=2044-734",
  {
    props: {
      // When card size variant is added to Figma, map it here:
      // cardSize: figma.enum("Card size", { sm: "sm", md: "md", lg: "lg" }),
    },
    example: () => (
      <PromoSection
        headline="Til under 200-lappen"
        body="Det er tid for ukens billigste middag – og vi har gjort planleggingen for deg."
        primaryCta={{ label: "Se ukas oppskrift", href: "#" }}
        secondaryCta={{ label: "Alle oppskrifter", href: "#" }}
        cardSize="md"
      />
    ),
  }
);
