export default function AnalysisLoading() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-10 space-y-5">
        <div className="h-8 w-52 rounded bg-surface-subtle animate-pulse" />
        <div className="h-36 rounded-xl border border-border bg-white animate-pulse" />
        <div className="h-28 rounded-xl border border-border bg-white animate-pulse" />
        <div className="h-40 rounded-xl border border-border bg-white animate-pulse" />
        <p className="text-center text-xs text-ink-soft">
          Running structured-output analysis…
        </p>
      </div>
    </div>
  )
}
