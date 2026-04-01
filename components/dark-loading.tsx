export default function DarkLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-14 h-14 bg-[#FDB913] rounded-xl flex items-center justify-center p-2.5 shadow-lg shadow-[#FDB913]/20">
            <img
              src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
              alt="Interac"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute -inset-2 border-2 border-transparent border-t-[#FDB913] rounded-full animate-spin" />
        </div>
        <div className="w-40 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-[#FDB913] rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}
