import type { ReactNode, ComponentPropsWithoutRef } from "react";

type GlassCardSupportedElements = "article" | "div" | "section" | "a";
type Variant = "default" | "featured" | "compact";
type AccentColor = "blue" | "amber" | "green" | "red";

const accentMap: Record<AccentColor, string> = {
  blue: "",
  amber: "accent-amber",
  green: "accent-green",
  red: "accent-red",
};

/**
 * Glassmorphism card with carbon-fiber texture and 3D perspective hover.
 *
 * Variants (Figma component logic):
 * - `default`  — standard card with hover lift
 * - `featured` — colored 2px top-border accent strip + elevated shadow
 * - `compact`  — tighter padding for dense grid items
 */
export function GlassCard({
  children,
  className = "",
  hover = true,
  variant = "default",
  accent = "blue",
  as: Tag = "article",
  ...props
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  variant?: Variant;
  accent?: AccentColor;
  as?: GlassCardSupportedElements;
} & Omit<ComponentPropsWithoutRef<any>, "as">) {
  return (
    <Tag
      className={[
        "glass surface-carbon rounded-lg",
        variant === "compact" ? "p-3 sm:p-4" : "p-5 sm:p-6",
        variant === "featured" ? `glass-featured ${accentMap[accent]}` : "",
        "transition-all duration-300 ease-out",
        hover
          ? "hover:border-[var(--edge-active)] hover:shadow-[var(--shadow-glow-blue)] hover:-translate-y-1"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ perspective: "1000px", ...props.style }}
      {...props}
    >
      {children}
    </Tag>
  );
}
