import type { CSSProperties, ReactNode } from "react";

export type BadgeStyle = "Primary" | "Danger" | "Subtle";

export interface BadgeProps {
  variant?: BadgeStyle;
  children?: ReactNode;
  className?: string;
}

/**
 * Badge
 *
 * Semantic tokens (from tokens.generated.css):
 *   --badge-{primary,danger}-{background,text}
 *   --global-bg-brand-subtle / --global-text-brand (Subtle)
 *   --radius-sm
 */
export function Badge({
  variant = "Primary",
  children = "Badge",
  className,
}: BadgeProps) {
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    paddingInline: "8px",
    paddingBlock: "4px",
    borderRadius: "var(--radius-sm)",
    fontSize: "var(--typography-caption-md-size)",
    lineHeight: "var(--typography-caption-md-line-height)",
    fontWeight: 600,
    whiteSpace: "nowrap",
    background:
      variant === "Danger"
        ? "var(--badge-danger-background)"
        : variant === "Subtle"
          ? "var(--global-bg-brand-subtle)"
          : "var(--badge-primary-background)",
    color:
      variant === "Danger"
        ? "var(--badge-danger-text)"
        : variant === "Subtle"
          ? "var(--global-text-brand)"
          : "var(--badge-primary-text)",
  };

  return (
    <span className={className} style={style}>
      {children}
    </span>
  );
}
