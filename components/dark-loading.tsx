export default function DarkLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-14 h-14 bg-[#6D1ED4] rounded-xl flex items-center justify-center p-2.5 shadow-lg shadow-[#6D1ED4]/20">
            <img
              src="/zelle-logo.png"
              alt="Zelle"
              className="w-full h-full object-contain"
              onError={(e) => {
                const t = e.currentTarget
                t.style.display = "none"
                const fallback = document.createElement("span")
                fallback.className = "text-white font-bold text-lg"
                fallback.textContent = "Z"
                t.parentElement?.appendChild(fallback)
              }}
            />
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
