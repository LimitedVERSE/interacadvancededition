"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ShieldCheck, Lock, ArrowLeft, ExternalLink } from "lucide-react"
import type { BankConnector } from "@/types/bankConnector"

interface BankConnectorScreenProps {
  connector: BankConnector
}

export default function BankConnectorScreen({ connector }: BankConnectorScreenProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    setIsMobile(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua))
  }, [])

  const handleRedirect = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobile) {
      e.preventDefault()
      const appSchemes: Record<string, string> = {
        chase:     "chase://",
        bofa:      "bofa://",
        wellsfargo:"wellsfargo://",
        citi:      "citi://",
        usbank:    "usbank://",
      }
      const scheme = appSchemes[connector.bankId]
      if (scheme) {
        window.location.href = scheme
        setTimeout(() => { window.location.href = connector.loginUrl }, 1500)
      } else {
        window.location.href = connector.loginUrl
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm shrink-0">
        <div className="h-1 bg-[#6D1ED4]" />
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <a
            href="https://www.zellepay.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-md overflow-hidden">
              <img src="/zelle-logo.webp" alt="Zelle" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold text-gray-900 tracking-tight">Zelle Payment</span>
          </a>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secured
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Bank logo card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 mb-5 flex flex-col items-center text-center gap-5">

            {/* Bank logo */}
            <div className="w-24 h-24 rounded-2xl border-2 border-gray-100 bg-white shadow-sm flex items-center justify-center overflow-hidden">
              {logoError ? (
                <span className="text-2xl font-bold text-gray-300">
                  {connector.bankName.slice(0, 2).toUpperCase()}
                </span>
              ) : (
                <img
                  src={`/${connector.bankId}-bank-logo.jpg`}
                  alt={connector.bankName}
                  className="w-20 h-20 object-contain"
                  onError={() => setLogoError(true)}
                />
              )}
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-2 leading-snug text-balance">
                Connecting to {connector.bankName}
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                {isMobile
                  ? `You'll be taken to the ${connector.bankName} mobile app to securely authenticate.`
                  : `You'll be redirected to ${connector.bankName}'s official online banking portal.`}
              </p>
            </div>

            {/* Security notice */}
            <div className="w-full bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 flex items-start gap-3 text-left">
              <Lock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <p className="text-xs text-purple-700 leading-relaxed">
                Your banking credentials are entered directly on{" "}
                <strong>{connector.bankName}&apos;s</strong> website — never shared with Zelle or any third party.
              </p>
            </div>

            {/* CTA */}
            <a
              href={connector.loginUrl}
              target={isMobile ? "_self" : "_blank"}
              rel="noopener noreferrer"
              onClick={handleRedirect}
              className="w-full flex items-center justify-center gap-2 bg-[#6D1ED4] hover:bg-[#5A18B0] text-white font-bold py-3.5 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 text-sm min-h-[48px]"
            >
              {isMobile ? `Open ${connector.bankName} App` : `Continue to ${connector.bankName}`}
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors min-h-[44px] px-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back and choose another bank
            </button>
          </div>

          {/* Trust row */}
          <div className="flex items-center justify-center gap-5 text-xs text-gray-400">
            {[
              { icon: ShieldCheck, label: "256-bit SSL" },
              { icon: Lock,        label: "Bank-level security" },
              { icon: ShieldCheck, label: "FDIC Member" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1">
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-5 px-4 shrink-0">
        <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span>&copy; {new Date().getFullYear()} Zelle. All rights reserved.</span>
          <div className="flex items-center gap-3">
            <a href="https://www.zellepay.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">Privacy</a>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <a href="https://www.zellepay.com/terms-of-use" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">Terms</a>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <a href="https://www.zellepay.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">zellepay.com</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
