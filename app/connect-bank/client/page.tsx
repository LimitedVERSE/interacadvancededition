"use client"

import Image from "next/image"
import ConnectBankFlow from "@/components/ConnectBankFlow"

export default function ClientConnectBankPage() {
  // No auth, no Header, no dashboard access — public URL sent to clients
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Minimal brand header — no nav, no dashboard links */}
      <header className="border-b border-zinc-100 bg-white shrink-0">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left: Interac logo + QuantumYield */}
          <div className="flex items-center gap-3">
            <div className="relative h-7 w-[88px]">
              <Image
                src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
                alt="Interac"
                fill
                className="object-contain object-left"
                unoptimized
              />
            </div>
            <div className="w-px h-5 bg-zinc-200" />
            <span className="text-sm font-bold text-zinc-900 tracking-tight">QuantumYield</span>
          </div>

          {/* Right: secure badge */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <svg className="w-3.5 h-3.5 text-[#FDB913]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
            Secured by Interac
          </div>
        </div>
      </header>

      {/* Flow — no manual entry for clients, back button just resets to bank select */}
      <div className="flex-1">
        <ConnectBankFlow
          onBack={() => {/* client has nowhere to go back to — no-op, flow resets internally */}}
          backLabel="Start over"
          showManualEntry={false}
        />
      </div>

      {/* Minimal footer */}
      <footer className="border-t border-zinc-100 py-6 px-4 shrink-0">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <p>
            &copy; {new Date().getFullYear()} QuantumYield. Payments processed via{" "}
            <span className="font-medium text-zinc-500">Interac e-Transfer</span>.
          </p>
          <div className="flex items-center gap-4">
            <span>256-bit SSL encryption</span>
            <span className="w-1 h-1 rounded-full bg-zinc-300" />
            <span>CDIC member institution</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
