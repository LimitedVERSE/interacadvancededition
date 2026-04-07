"use client"

import Link from "next/link"
import { HelpCircle, Languages, ShieldCheck, ExternalLink } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

export default function Header() {
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en")
  }

  return (
    <header
      className="sticky top-0 z-50 bg-[#111111]/95 backdrop-blur-md border-b border-white/[0.06] shadow-[0_1px_0_0_rgba(109,30,212,0.35)]"
      role="banner"
    >
      {/* Top purple accent line */}
      <div className="h-[2px] bg-[#6D1ED4]" />

      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between max-w-7xl h-16">

        {/* ── Logo lockup ── */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D1ED4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111] rounded-lg"
          aria-label="Zelle home"
        >
          {/* Z icon */}
          <div className="relative w-9 h-9 bg-[#6D1ED4] rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(109,30,212,0.5)] group-hover:shadow-[0_0_18px_rgba(109,30,212,0.7)] transition-shadow duration-200">
            <span className="text-white font-black text-xl leading-none select-none">Z</span>
          </div>

          {/* Brand text */}
          <div className="flex flex-col leading-none gap-0.5">
            <span className="text-white font-bold text-[15px] tracking-tight leading-none">Zelle</span>
            <span className="text-[#6D6D6D] text-[10px] uppercase tracking-[0.12em] leading-none font-medium">
              Secure Disbursement
            </span>
          </div>
        </Link>

        {/* ── Right: trust badge + nav ── */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Trust badge — hidden on very small screens */}
          <div className="hidden md:flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full px-3 py-1.5 mr-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6D1ED4] shrink-0" />
            <span className="text-[11px] font-medium text-[#aaa] tracking-wide">SSL Secured</span>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-white/10 mx-1" />

          {/* Nav links */}
          <nav className="flex items-center gap-1" role="navigation" aria-label="Main navigation">
            <a
              href="https://www.zellepay.com/support"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-9 px-3 text-[#aaa] hover:text-white text-[13px] font-medium rounded-md hover:bg-white/[0.06] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D1ED4]"
            >
              {t.header.contactUs}
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>

            <a
              href="https://www.zellepay.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 text-[#aaa] hover:text-white text-[13px] font-medium rounded-md hover:bg-white/[0.06] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D1ED4]"
            >
              {t.header.about}
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>

            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-[#aaa] hover:text-white text-[13px] font-medium rounded-md hover:bg-white/[0.06] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D1ED4]"
              aria-label={`Switch to ${language === "en" ? "French" : "English"}`}
            >
              <Languages className="w-4 h-4 shrink-0" />
              <span className="hidden xs:inline">{language === "en" ? "FR" : "EN"}</span>
            </button>

            {/* Help */}
            <button
              className="inline-flex items-center justify-center w-9 h-9 rounded-md text-[#aaa] hover:text-white hover:bg-white/[0.06] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D1ED4]"
              aria-label={t.header.helpLabel}
            >
              <HelpCircle className="w-[18px] h-[18px]" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
