interface InteracHeaderProps {
  logoUrl?: string
  language?: "en" | "fr"
}

export function InteracHeader({
  logoUrl = "https://etransfer-notification.interac.ca/images/new/interac_logo.png",
  language = "en",
}: InteracHeaderProps) {
  return (
    <div className="bg-black px-3 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between flex-wrap gap-2 sm:gap-3">
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
        <img src={logoUrl || "/placeholder.svg"} alt="INTERAC e-Transfer" className="h-8 sm:h-10 md:h-[50px] block" />
        <div className="bg-black text-[rgba(250,250,250,0.4)] font-bold text-[10px] sm:text-xs px-2 py-1 sm:px-2.5 sm:py-1.5 rounded flex items-center">
          <span className="hidden sm:inline">
            {language === "en" ? "QuantumYield" : "QuantumYield"}
          </span>
          <span className="inline sm:hidden">
            {language === "en" ? "QuantumYield" : "QuantumYield"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-1.5 sm:gap-2 text-white text-xs sm:text-sm">
          <span
            className={`font-bold cursor-pointer transition-opacity ${language === "en" ? "underline opacity-100" : "opacity-70 hover:opacity-90"}`}
          >
            EN
          </span>
          <span className="text-white opacity-50">|</span>
          <span
            className={`font-bold cursor-pointer transition-opacity ${language === "fr" ? "underline opacity-100" : "opacity-70 hover:opacity-90"}`}
          >
            FR
          </span>
        </div>
        <div className="bg-[#FDB913] text-black font-bold text-sm sm:text-base px-2.5 py-1.5 sm:px-3 sm:py-2 rounded flex items-center whitespace-nowrap">
          Interac e-Transfer
        </div>
      </div>
    </div>
  )
}
