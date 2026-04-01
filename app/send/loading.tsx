export default function SendLoading() {
  return (
    <div className="min-h-screen bg-[#080808] font-sans">
      {/* Header skeleton */}
      <header className="border-b border-white/[0.06] bg-[#080808]/90 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] animate-pulse" />
            <div className="space-y-1.5">
              <div className="w-36 h-3.5 rounded bg-white/[0.06] animate-pulse" />
              <div className="w-28 h-2.5 rounded bg-white/[0.04] animate-pulse" />
            </div>
          </div>
          <div className="w-24 h-8 rounded-xl bg-white/[0.05] animate-pulse" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-10">
        {/* Page title skeleton */}
        <div className="mb-7 space-y-2">
          <div className="w-52 h-7 rounded-lg bg-white/[0.06] animate-pulse" />
          <div className="w-64 h-3.5 rounded bg-white/[0.04] animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left wizard skeleton */}
          <div>
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-0 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-9 h-9 rounded-full bg-white/[0.06] animate-pulse" />
                    <div className="w-12 h-2 rounded bg-white/[0.04] animate-pulse hidden sm:block" />
                  </div>
                  {i < 4 && <div className="w-14 sm:w-20 h-[2px] mb-6 mx-1 bg-white/[0.06] animate-pulse" />}
                </div>
              ))}
            </div>

            {/* Form card skeleton */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <div className="w-48 h-5 rounded bg-white/[0.06] animate-pulse" />
                <div className="w-72 h-3.5 rounded bg-white/[0.04] animate-pulse" />
              </div>

              {/* Contact chips */}
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 rounded-xl bg-white/[0.04] animate-pulse" />
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.05] animate-pulse" />

              {/* Input fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="w-28 h-3 rounded bg-white/[0.05] animate-pulse" />
                  <div className="h-10 rounded-lg bg-white/[0.04] animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="w-32 h-3 rounded bg-white/[0.05] animate-pulse" />
                  <div className="h-10 rounded-lg bg-white/[0.04] animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-16 rounded-xl bg-white/[0.04] animate-pulse" />
                  <div className="h-16 rounded-xl bg-white/[0.04] animate-pulse" />
                </div>
              </div>

              {/* CTA */}
              <div className="flex justify-end mt-8">
                <div className="w-28 h-10 rounded-lg bg-[#FDB913]/20 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right summary panel skeleton */}
          <div className="hidden lg:block space-y-3">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 space-y-4">
              <div className="w-32 h-4 rounded bg-white/[0.05] animate-pulse" />
              <div className="h-20 rounded-xl bg-white/[0.04] animate-pulse" />
              <div className="space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="w-12 h-3 rounded bg-white/[0.04] animate-pulse" />
                    <div className="w-24 h-3 rounded bg-white/[0.05] animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="h-1 rounded-full bg-white/[0.05] animate-pulse" />
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 space-y-3">
              <div className="w-28 h-4 rounded bg-white/[0.05] animate-pulse" />
              <div className="w-36 h-6 rounded bg-white/[0.06] animate-pulse" />
              <div className="h-12 rounded-xl bg-white/[0.03] animate-pulse" />
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 space-y-3">
              <div className="w-28 h-4 rounded bg-white/[0.05] animate-pulse" />
              <div className="w-36 h-6 rounded bg-white/[0.06] animate-pulse" />
              <div className="h-24 rounded-xl bg-white/[0.03] animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
