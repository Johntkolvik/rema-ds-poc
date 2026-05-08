import type { CSSProperties, ReactNode } from "react";

export type ButtonStyle = "Primary" | "Secondary" | "Ghost" | "Danger";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonShape = "Pill" | "Sharp";

export interface ButtonProps {
  variant?: ButtonStyle;
  size?: ButtonSize;
  shape?: ButtonShape;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * Button
 *
 * Semantic tokens (from tokens.generated.css):
 *   --button-{primary,secondary,danger}-{background,text,border}
 *   --button-{sm,md,lg}-{height,padding-x}
 *   --radius-{full,sm}
 *   --global-{bg,text,border}-disabled
 *   --global-text-brand (Ghost)
 */
export function Button({
  variant = "Primary",
  size = "md",
  shape = "Pill",
  disabled = false,
  leftIcon,
  rightIcon,
  children = "Button",
  onClick,
  className,
}: ButtonProps) {
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    height: `var(--button-${size}-height)`,
    paddingInline: `var(--button-${size}-padding-x)`,
    borderRadius:
      shape === "Pill" ? "var(--radius-full)" : "var(--radius-sm)",
    fontFamily: "inherit",
    fontWeight: 600,
    fontSize: "var(--typography-body-md-size)",
    lineHeight: 1,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background 120ms ease, color 120ms ease",
    background: disabled
      ? "var(--global-bg-disabled)"
      : variant === "Primary"
        ? "var(--button-primary-background)"
        : variant === "Secondary"
          ? "var(--button-secondary-background)"
          : variant === "Danger"
            ? "var(--button-danger-background)"
            : "transparent",
    color: disabled
      ? "var(--global-text-disabled)"
      : variant === "Primary"
        ? "var(--button-primary-text)"
        : variant === "Secondary"
          ? "var(--button-secondary-text)"
          : variant === "Danger"
            ? "var(--button-danger-text)"
            : "var(--global-text-brand)",
    border: disabled
      ? "1.5px solid var(--global-border-disabled)"
      : variant === "Primary"
        ? "1.5px solid var(--button-primary-border)"
        : variant === "Secondary"
          ? "1.5px solid var(--button-secondary-border)"
          : "1.5px solid transparent",
  };

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      onClick={onClick}
      style={style}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
