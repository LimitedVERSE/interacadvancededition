"use client"

import { Languages } from "lucide-react"
import ConnectBankFlow from "@/components/ConnectBankFlow"
import { useLanguage } from "@/lib/i18n/context"

export default function ClientConnectBankPage() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">

      {/* Minimal brand header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 shrink-0">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left: Interac logo + QuantumYield */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#FDB913] rounded-lg flex items-center justify-center">
              <img
                src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
                alt="Interac"
                className="h-5 object-contain"
              />
            </div>
            <div className="w-px h-5 bg-zinc-700" />
            <span className="text-sm font-bold text-white tracking-tight">QuantumYield</span>
          </div>

          {/* Right: language toggle + secure badge */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === "en" ? "fr" : "en")}
              className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors min-h-[44px]"
              aria-label={language === "en" ? "Passer au français" : "Switch to English"}
            >
              <Languages className="w-4 h-4" />
              <span>{language === "en" ? "Français" : "English"}</span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
              <svg className="w-3.5 h-3.5 text-[#FDB913]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
              </svg>
              Secured by Interac
            </div>
          </div>
        </div>
      </header>

      {/* Flow */}
      <div className="flex-1">
        <ConnectBankFlow
          onBack={() => {}}
          showManualEntry={false}
        />
      </div>

      {/* Minimal footer */}
      <footer className="border-t border-zinc-800 py-6 px-4 shrink-0">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} QuantumYield. Payments processed via{" "}
            <span className="font-medium text-zinc-400">Interac e-Transfer</span>.
          </p>
          <div className="flex items-center gap-4">
            <span>256-bit SSL encryption</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span>CDIC member institution</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
