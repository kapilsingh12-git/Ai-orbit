export default function Loading() {
  return (
    <div className="container-page py-8 lg:py-12">
      <div className="skeleton h-4 w-64" />
      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="flex gap-4">
            <div className="skeleton h-14 w-14 rounded-[var(--radius-card)]" />
            <div className="flex-1">
              <div className="skeleton h-9 w-2/3" />
              <div className="skeleton mt-3 h-4 w-48" />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-4/5" />
          </div>
          <div className="skeleton mt-14 h-6 w-48" />
          <div className="mt-5 flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5"
              >
                <div className="skeleton h-14 w-12 rounded-[var(--radius-control)]" />
                <div className="flex-1 space-y-3">
                  <div className="skeleton h-4 w-40" />
                  <div className="skeleton h-3 w-full max-w-md" />
                  <div className="skeleton h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="skeleton h-40 rounded-[var(--radius-card)]" />
      </div>
    </div>
  );
}
