/**
 * Themed section divider — replaces raw <hr> and border-t hacks
 * with a consistent edge-colored separator.
 */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-full bg-[var(--edge)] ${className}`.trim()}
      role="separator"
    />
  );
}
