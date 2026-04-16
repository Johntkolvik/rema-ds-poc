/**
 * Code Connect — RecipeCard
 *
 * Links the Figma RecipeCard component (Size=sm/md/lg variants) to the
 * React implementation. Publish with: npx figma connect publish
 */
import figma from "@figma/code-connect";
import { RecipeCard } from "./RecipeCard";

figma.connect(
  RecipeCard,
  "https://www.figma.com/design/TPytjALjphlR0C6DJGvohU/REMA-Variable-POC--GitHub-?node-id=2116-804",
  {
    props: {
      size: figma.enum("Size", { sm: "sm", md: "md", lg: "lg" }),
    },
    example: ({ size }) => (
      <RecipeCard
        size={size}
        category="Pasta"
        title="Pasta med kylling og kremet saus"
        time="20 min"
        difficulty="Enkel"
        ingredientCount={10}
        rating={3.4}
      />
    ),
  }
);
