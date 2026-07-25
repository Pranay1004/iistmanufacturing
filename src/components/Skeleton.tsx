export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-[var(--edge)] bg-[var(--panel)]/50 p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="w-16 h-20 rounded bg-[var(--machined)]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-[var(--machined)]" />
          <div className="h-3 w-24 rounded bg-[var(--machined)]" />
          <div className="h-3 w-full rounded bg-[var(--machined)]" />
          <div className="flex gap-2 mt-2">
            <div className="h-5 w-16 rounded bg-[var(--machined)]" />
            <div className="h-5 w-16 rounded bg-[var(--machined)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-pulse">
      <div className="h-4 w-24 rounded bg-[var(--machined)]" />
      <div className="mt-4 h-10 w-96 rounded bg-[var(--machined)]" />
      <div className="mt-4 h-4 w-64 rounded bg-[var(--machined)]" />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
