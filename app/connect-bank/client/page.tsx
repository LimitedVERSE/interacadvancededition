"use client"

import { Languages, Shield } from "lucide-react"
import ConnectBankFlow from "@/components/ConnectBankFlow"
import { useLanguage } from "@/lib/i18n/context"

export default function ClientConnectBankPage() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Client header */}
      <header className="bg-white border-b border-gray-200 shrink-0 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo block */}
          <a href="https://www.zellepay.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#6D1ED4] rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-xl leading-none">Z</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none tracking-tight">Zelle Payment</p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5 font-medium uppercase tracking-wide">Secure Deposit Portal</p>
            </div>
          </a>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "fr" : "en")}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors min-h-[44px] px-2"
              aria-label={language === "en" ? "Passer au français" : "Switch to English"}
            >
              <Languages className="w-4 h-4" />
              <span>{language === "en" ? "Français" : "English"}</span>
            </button>
            {/* Secure badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5" />
              <span>Secured by Zelle</span>
            </div>
          </div>
        </div>
      </header>

      {/* Flow */}
      <div className="flex-1">
        <ConnectBankFlow
          onBack={() => {}}
          showManualEntry={false}
          clientMode
        />
      </div>

      {/* Client footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4 shrink-0">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#6D1ED4] rounded flex items-center justify-center">
              <span className="text-white font-black text-xs leading-none">Z</span>
            </div>
            <span>&copy; {new Date().getFullYear()} Zelle. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.zellepay.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <a href="https://www.zellepay.com/terms-of-use" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">Terms of Use</a>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <a href="https://www.zellepay.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">zellepay.com</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
