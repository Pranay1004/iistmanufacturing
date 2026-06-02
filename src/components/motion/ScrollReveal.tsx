"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Variant = "up" | "left" | "right" | "scale";

const variantClass: Record<Variant, string> = {
  up: "scroll-reveal",
  left: "scroll-reveal-left",
  right: "scroll-reveal-right",
  scale: "scroll-reveal-scale",
};

/**
 * Wraps children in a scroll-driven reveal animation.
 * Uses native CSS `animation-timeline: view()` where supported,
 * with an IntersectionObserver fallback for Firefox.
 *
 * `delay` — animation delay in ms (e.g. 80, 160)
 */
export function ScrollReveal({
  children,
  variant = "up",
  className = "",
  as: Tag = "div",
  stagger = false,
  delay,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  as?: "div" | "section" | "article" | "aside" | "header" | "footer";
  stagger?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  /* Fallback for browsers without scroll-driven animations */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Check if native scroll-driven animations are supported */
    const supportsScrollDriven = CSS.supports(
      "(animation-timeline: view()) and (animation-range: entry 0% cover 100%)"
    );
    if (supportsScrollDriven) return; /* Native CSS handles it */

    /* Respect reduced motion preference */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.filter = "none";
      return;
    }

    /* Set initial hidden state */
    el.style.opacity = "0";
    if (variant === "up") el.style.transform = "translateY(50px)";
    else if (variant === "left") el.style.transform = "translateX(-60px)";
    else if (variant === "right") el.style.transform = "translateX(60px)";
    else el.style.transform = "scale(0.9)";
    el.style.filter = "blur(3px)";
    el.style.transition =
      "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
    if (delay) el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "none";
          el.style.filter = "none";
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [variant, delay]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={`${variantClass[variant]} ${stagger ? "stagger" : ""} ${className}`.trim()}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

