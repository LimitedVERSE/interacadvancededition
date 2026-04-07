"use client"

interface ZelleHeaderProps {
  language?: "en" | "fr"
  clientMode?: boolean
}

export default function ZelleHeader({
  language = "en",
  clientMode = false,
}: ZelleHeaderProps) {
  if (clientMode) {
    return (
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="h-1 bg-[#6D1ED4]" />
        <div className="px-6 py-3.5 flex items-center justify-between">
          <a href="https://www.zellepay.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
            <div className="w-10 h-10 bg-[#6D1ED4] rounded-lg flex items-center justify-center p-2 shadow-sm flex-shrink-0">
              <span className="text-white font-black text-lg leading-none">Z</span>
            </div>
            <div className="w-px h-7 bg-gray-200 mx-4 flex-shrink-0" />
            <div className="flex flex-col justify-center">
              <span className="text-gray-900 font-bold text-[13px] tracking-[0.04em] leading-tight">
                Zelle
              </span>
              <span className="text-gray-400 font-normal text-[10px] tracking-[0.06em] uppercase mt-0.5">
                {language === "fr" ? "Portail de Dépôt" : "Secure Deposit Portal"}
              </span>
            </div>
          </a>
          <div className="inline-flex items-center gap-1.5 bg-[#6D1ED4] text-white font-bold text-[11px] tracking-[0.05em] uppercase px-3 py-1.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
            Zelle
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
      {/* Purple accent bar */}
      <div className="h-[3px] bg-[#6D1ED4]" />

      <div className="px-6 py-3.5 flex items-center justify-between">
        {/* Left: logo + divider + brand name */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-[#6D1ED4] rounded-lg flex items-center justify-center p-2 flex-shrink-0">
            <span className="text-white font-black text-lg leading-none">Z</span>
          </div>
          {/* Vertical divider */}
          <div className="w-px h-7 bg-white/15 mx-4 flex-shrink-0" />
          <div className="flex flex-col justify-center gap-0">
            <span className="block text-white font-bold text-[13px] tracking-[0.04em] leading-tight">
              Zelle
            </span>
            <span className="block text-[#888888] font-normal text-[10px] tracking-[0.08em] uppercase mt-0.5">
              {language === "fr" ? "PAIEMENTS SÉCURISÉS" : "SECURE PAYMENTS"}
            </span>
          </div>
        </div>

        {/* Right: Zelle badge */}
        <div className="flex items-center gap-2">
          {/* EN / FR toggle */}
          <div className="flex items-center gap-1.5 mr-3">
            <span
              className={`text-xs font-semibold tracking-wide cursor-pointer transition-opacity ${
                language === "en" ? "text-white opacity-100" : "text-white/50 hover:text-white/75"
              }`}
            >
              EN
            </span>
            <span className="text-white/25 text-xs">|</span>
            <span
              className={`text-xs font-semibold tracking-wide cursor-pointer transition-opacity ${
                language === "fr" ? "text-white opacity-100" : "text-white/50 hover:text-white/75"
              }`}
            >
              FR
            </span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#6D1ED4] text-white font-bold text-[12px] tracking-[0.07em] uppercase px-3.5 py-2 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-white/50 flex-shrink-0" />
            ZELLE
          </div>
        </div>
      </div>
    </div>
  )
}
