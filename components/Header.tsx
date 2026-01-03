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
    <header className="bg-[#1a1a1a] text-white py-4 shadow-lg" role="banner">
      <div className="container mx-auto px-4 flex items-center justify-between max-w-7xl">
        <Link
          href="/"
          className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:ring-offset-2 focus:ring-offset-[#1a1a1a] rounded-lg"
          aria-label="Interac home"
        >
          <div className="bg-[#FDB913] rounded-lg p-2.5 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shadow-md">
            <img
              src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
              alt="Interac e-Transfer"
              className="w-full h-full object-contain p-1"
            />
          </div>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6 lg:gap-8" role="navigation" aria-label="Main navigation">
          <Link
            href="/contact"
            className="text-white hover:text-[#FDB913] transition-colors font-medium text-xs sm:text-sm lg:text-base focus:outline-none focus:underline focus:underline-offset-4"
          >
            {t.header.contactUs}
          </Link>
          <Link
            href="/about"
            className="text-white hover:text-[#FDB913] transition-colors font-medium text-xs sm:text-sm lg:text-base focus:outline-none focus:underline focus:underline-offset-4"
          >
            {t.header.about}
          </Link>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-white hover:text-[#FDB913] transition-colors font-medium text-xs sm:text-sm lg:text-base focus:outline-none focus:underline focus:underline-offset-4"
            aria-label={`Switch to ${language === "en" ? "French" : "English"}`}
          >
            <Languages className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{language === "en" ? "Français" : "English"}</span>
          </button>
          <button
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white hover:border-[#FDB913] hover:bg-[#FDB913] hover:text-black transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
            aria-label={t.header.helpLabel}
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </nav>
      </div>
    </header>
  )
}
