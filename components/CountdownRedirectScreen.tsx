"use client"

import { useEffect, useState, useRef } from "react"
import type { InteracMockPayload } from "@/types/interac"
import Image from "next/image"

interface CountdownRedirectScreenProps {
  data: InteracMockPayload
}

export default function CountdownRedirectScreen({ data }: CountdownRedirectScreenProps) {
  const [countdown, setCountdown] = useState(data.ui.redirectSeconds)
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (countdown <= 0) {
      if (data.ui.autoRedirect && !hasRedirected.current) {
        hasRedirected.current = true
        window.open(data.bankVisuals.login, "_blank")
      }
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown, data.ui.autoRedirect, data.bankVisuals.login])

  const handleManualRedirect = () => {
    window.open(data.bankVisuals.login, "_blank")
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="w-full h-2 bg-[#FFCB05]" />

      <header className="border-b border-zinc-800 bg-black">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white flex items-center justify-center">
            <Image
              src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
              alt="Interac"
              fill
              className="object-contain p-1"
            />
          </div>
          <h1 className="text-xl font-semibold text-white">{data.bankVisuals.name}</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full space-y-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-8 border-zinc-800" />
              <div
                className="absolute inset-0 rounded-full border-8 border-[#FFCB05] border-t-transparent animate-spin"
                style={{ animationDuration: "3s" }}
              />
              <span className="text-7xl font-bold text-[#FFCB05] tabular-nums">{countdown}</span>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-white">Redirecting to your bank</h2>
              <p className="text-lg text-zinc-400">
                You will be redirected to your banking portal in{" "}
                <span className="text-[#FFCB05] font-semibold tabular-nums">{countdown}</span> seconds
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-lg font-semibold text-white">Transaction Details</h3>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                {data.meta.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-zinc-500">Amount</p>
                <p className="text-xl font-bold text-white">
                  ${data.deposit.amount.toFixed(2)} {data.deposit.currency}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-zinc-500">Reference</p>
                <p className="text-base font-mono text-white">{data.deposit.reference}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-zinc-500">Payee</p>
                <p className="text-base text-white">{data.payee.name}</p>
                <p className="text-sm text-zinc-400">{data.payee.email}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-zinc-500">Bank</p>
                <p className="text-base text-white">{data.sender.bankName}</p>
                <p className="text-sm text-zinc-400">
                  {data.sender.institution}-{data.sender.branch}
                </p>
              </div>

              {data.deposit.memo && (
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-zinc-500">Memo</p>
                  <p className="text-base text-white">{data.deposit.memo}</p>
                </div>
              )}

              <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-zinc-500">Transaction ID</p>
                <p className="text-sm font-mono text-zinc-400">{data.meta.id}</p>
              </div>
            </div>
          </div>

          {(!data.ui.autoRedirect || countdown <= 0) && (
            <div className="flex flex-col items-center space-y-3">
              <button
                onClick={handleManualRedirect}
                className="w-full md:w-auto px-8 py-4 bg-[#FFCB05] hover:bg-[#FFD84D] text-black font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Continue to {data.bankVisuals.name}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <p className="text-sm text-zinc-500">Click to open your banking portal</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-zinc-800 bg-black">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-start gap-3 text-sm text-zinc-500">
            <svg className="w-5 h-5 text-[#FFCB05] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <p className="leading-relaxed">
              You are being securely redirected to your financial institution. Never share your banking credentials with
              anyone. Interac e-Transfer is a registered trademark of Interac Corp.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
