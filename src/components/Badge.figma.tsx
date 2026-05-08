/**
 * Code Connect — Badge
 *
 * Links the Figma Badge ComponentSet (3 variants) to the React implementation.
 *
 * Figma variants mapped:
 *   Style → variant  (Primary | Danger | Subtle)
 *
 * Publish with: npx figma connect publish
 */
import figma from "@figma/code-connect";
import { Badge } from "./Badge";

figma.connect(
  Badge,
  "https://www.figma.com/design/TPytjALjphlR0C6DJGvohU/REMA-Variable-POC--GitHub-?node-id=2154-2660",
  {
    links: [
      {
        name: "Storybook",
        url: "https://rema-storybook.vercel.app/?path=/story/components-badge--primary",
      },
    ],
    props: {
      variant: figma.enum("Style", {
        Primary: "Primary",
        Danger: "Danger",
        Subtle: "Subtle",
      }),
    },
    example: ({ variant }) => <Badge variant={variant}>Badge</Badge>,
  }
);
