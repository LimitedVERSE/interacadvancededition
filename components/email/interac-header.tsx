interface InteracHeaderProps {
  logoUrl?: string
  language?: "en" | "fr"
  clientMode?: boolean
}

export default function InteracHeader({
  logoUrl = "https://etransfer-notification.interac.ca/images/new/interac_logo.png",
  language = "en",
  clientMode = false,
}: InteracHeaderProps) {
  if (clientMode) {
    return (
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="h-1 bg-[#FDB913]" />
        <div className="px-6 py-3.5 flex items-center justify-between">
          <a href="https://www.interac.ca" target="_blank" rel="noopener noreferrer" className="flex items-center">
            <img
              src={logoUrl || "/placeholder.svg"}
              alt="INTERAC"
              className="h-10 block flex-shrink-0"
            />
            <div className="w-px h-7 bg-gray-200 mx-4 flex-shrink-0" />
            <div className="flex flex-col justify-center">
              <span className="text-gray-900 font-bold text-[13px] tracking-[0.04em] leading-tight">
                Interac e&#8209;Transfer
              </span>
              <span className="text-gray-400 font-normal text-[10px] tracking-[0.06em] uppercase mt-0.5">
                {language === "fr" ? "Portail de Dépôt" : "Secure Deposit Portal"}
              </span>
            </div>
          </a>
          <div className="inline-flex items-center gap-1.5 bg-[#FDB913] text-black font-bold text-[11px] tracking-[0.05em] uppercase px-3 py-1.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-black/40 flex-shrink-0" />
            e&#8209;Transfer
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
      {/* Yellow accent bar */}
      <div className="h-[3px] bg-[#FDB913]" />

      <div className="px-6 py-3.5 flex items-center justify-between">
        {/* Left: logo + divider + brand name */}
        <div className="flex items-center">
          <img
            src={logoUrl || "/placeholder.svg"}
            alt="INTERAC"
            className="h-10 block flex-shrink-0"
          />
          {/* Vertical divider */}
          <div className="w-px h-7 bg-white/15 mx-4 flex-shrink-0" />
          <div className="flex flex-col justify-center">
            <span className="text-white font-bold text-[13px] tracking-[0.04em] leading-tight">
              QuantumYield
            </span>
            <span className="text-white/40 font-normal text-[10px] tracking-[0.06em] uppercase mt-0.5">
              {language === "fr" ? "Paiements Sécurisés" : "Secure Payments"}
            </span>
          </div>
        </div>

        {/* Right: e-Transfer badge */}
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
          <div className="inline-flex items-center gap-1.5 bg-[#FDB913] text-black font-bold text-[11px] tracking-[0.05em] uppercase px-3 py-1.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-black/40 flex-shrink-0" />
            e&#8209;Transfer
          </div>
        </div>
      </div>
    </div>
  )
}
