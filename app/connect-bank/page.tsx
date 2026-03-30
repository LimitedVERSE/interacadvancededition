"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, Check, ExternalLink, ShieldCheck } from "lucide-react"
import Header from "@/components/Header"
import { ProtectedRoute } from "@/components/protected-route"
import ConnectBankFlow from "@/components/ConnectBankFlow"

const CLIENT_URL =
  typeof window !== "undefined"
    ? `${window.location.origin}/connect-bank/client`
    : "/connect-bank/client"

function AdminConnectBankInner() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/connect-bank/client`
        : "/connect-bank/client"
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      {/* Admin toolbar */}
      <div className="border-b border-zinc-800 bg-zinc-900/80">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FDB913]" />
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Admin view</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="text-xs text-zinc-500">Clients access this via the public link below</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 sm:flex-none flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 min-w-0">
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="text-xs text-zinc-400 truncate max-w-[200px] sm:max-w-xs font-mono">
                {typeof window !== "undefined" ? `${window.location.origin}/connect-bank/client` : "/connect-bank/client"}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[36px] whitespace-nowrap ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-[#FDB913] hover:bg-[#e5a811] text-black"
              }`}
            >
              {copied ? (
                <><Check className="w-3.5 h-3.5" />Copied</>
              ) : (
                <><Copy className="w-3.5 h-3.5" />Copy link</>
              )}
            </button>
          </div>
        </div>
      </div>

      <ConnectBankFlow
        onBack={() => router.push("/dashboard")}
        showManualEntry
      />
    </div>
  )
}

export default function ConnectBankPage() {
  return (
    <ProtectedRoute>
      <AdminConnectBankInner />
    </ProtectedRoute>
  )
}
