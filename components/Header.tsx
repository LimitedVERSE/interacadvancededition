"use client"

import Link from "next/link"
import { HelpCircle, Languages } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

export default function Header() {
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en")
  }

  return (
    <header className="bg-[#1a1a1a] text-white py-4 shadow-lg border-b-2 border-[#6D1ED4]" role="banner">
      <div className="container mx-auto px-4 flex items-center justify-between max-w-7xl">
        <Link
          href="/"
          className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 focus:ring-offset-[#1a1a1a] rounded-lg"
          aria-label="Zelle home"
        >
          <div className="bg-[#6D1ED4] rounded-lg w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shadow-md">
            <span className="text-white font-black text-3xl sm:text-4xl leading-none">Z</span>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-white font-bold text-lg leading-tight tracking-wide">Zelle</span>
            <span className="text-[#888] text-[10px] uppercase tracking-widest">Secure Disbursement</span>
          </div>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6 lg:gap-8" role="navigation" aria-label="Main navigation">
          <a
            href="https://www.zellepay.com/support"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#8B4AE8] transition-colors font-medium text-xs sm:text-sm lg:text-base focus:outline-none focus:underline focus:underline-offset-4"
          >
            {t.header.contactUs}
          </a>
          <a
            href="https://www.zellepay.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#8B4AE8] transition-colors font-medium text-xs sm:text-sm lg:text-base focus:outline-none focus:underline focus:underline-offset-4"
          >
            {t.header.about}
          </a>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-white hover:text-[#8B4AE8] transition-colors font-medium text-xs sm:text-sm lg:text-base focus:outline-none focus:underline focus:underline-offset-4"
            aria-label={`Switch to ${language === "en" ? "French" : "English"}`}
          >
            <Languages className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{language === "en" ? "Français" : "English"}</span>
          </button>
          <button
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white hover:border-[#6D1ED4] hover:bg-[#6D1ED4] hover:text-white transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
            aria-label={t.header.helpLabel}
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </nav>
      </div>
    </header>
  )
}
