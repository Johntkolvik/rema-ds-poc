/**
 * Code Connect — ProductCard
 *
 * Links the Figma ProductCard component (Size=sm/md/lg variants) to the
 * React implementation. Publish with: npx figma connect publish
 */
import figma from "@figma/code-connect";
import { ProductCard } from "./ProductCard";

figma.connect(
  ProductCard,
  "https://www.figma.com/design/TPytjALjphlR0C6DJGvohU/REMA-Variable-POC--GitHub-?node-id=2170-339",
  {
    links: [
      {
        name: "Storybook",
        url: "https://rema-storybook.vercel.app/?path=/story/components-productcard--default",
      },
    ],
    props: {
      size: figma.enum("Size", { sm: "sm", md: "md", lg: "lg" }),
    },
    example: ({ size }) => (
      <ProductCard
        size={size}
        name="Coca-Cola Original"
        weight="1.5L"
        price={23.9}
        originalPrice={34.9}
        badge="Tilbud"
      />
    ),
  }
);
