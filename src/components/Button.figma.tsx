/**
 * Code Connect — Button
 *
 * Links the Figma Button ComponentSet (36 variants) to the React implementation.
 *
 * Figma variants mapped:
 *   Style        → variant  (Primary | Secondary | Ghost | Danger)
 *   Size         → size     (sm | md | lg)
 *   Shape        → shape    (Pill | Sharp)
 *   State        → disabled (Disabled = true, Default/Hover = false)
 *   showLeftIcon → leftIcon (boolean → ReactNode via figma.boolean children mapping)
 *   showRightIcon→ rightIcon (boolean → ReactNode via figma.boolean children mapping)
 *
 * Publish with: npx figma connect publish
 */
import figma from "@figma/code-connect";
import { Button } from "./Button";

figma.connect(
  Button,
  "https://www.figma.com/design/TPytjALjphlR0C6DJGvohU/REMA-Variable-POC--GitHub-?node-id=2136-1324",
  {
    links: [
      {
        name: "Storybook",
        url: "https://rema-storybook.vercel.app/?path=/story/components-button--primary",
      },
    ],
    props: {
      variant: figma.enum("Style", {
        Primary: "Primary",
        Secondary: "Secondary",
        Ghost: "Ghost",
        Danger: "Danger",
      }),
      size: figma.enum("Size", {
        sm: "sm",
        md: "md",
        lg: "lg",
      }),
      shape: figma.enum("Shape", {
        Pill: "Pill",
        Sharp: "Sharp",
      }),
      // State=Disabled → disabled prop; Default/Hover are interactive states
      disabled: figma.enum("State", {
        Default: false,
        Hover: false,
        Disabled: true,
      }),
    },
    example: ({ variant, size, shape, disabled }) => (
      <Button
        variant={variant}
        size={size}
        shape={shape}
        disabled={disabled}
      >
        Button
      </Button>
    ),
  }
);
