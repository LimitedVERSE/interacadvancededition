export default function DarkLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-14 h-14 bg-[#6D1ED4] rounded-xl flex items-center justify-center shadow-lg shadow-[#6D1ED4]/20">
            <span className="text-white font-black text-3xl leading-none select-none">Z</span>
          </div>
          <div className="absolute -inset-2 border-2 border-transparent border-t-[#6D1ED4] rounded-full animate-spin" />
        </div>
        <div className="w-40 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-[#6D1ED4] rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}
