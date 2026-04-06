"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Send,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  User,
  DollarSign,
  Shield,
  FileText,
  Clock,
  ArrowUpRight,
  Zap,
  Copy,
  Check,
  AlertCircle,
  Lock,
  RefreshCw,
  TrendingUp,
  Building2,
  ArrowDown,
  Info,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// ─── Ledger constants (mirrored from dashboard) ───────────────────────────────
const CHECKING_USD      = 7_000_000
const SAVINGS_USD       = 14_250_000
const RELOAD_THRESHOLD  = 0.20                                // 20% of Checking
const THRESHOLD_USD     = CHECKING_USD * RELOAD_THRESHOLD

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  recipient:        string
  recipientName:    string
  amount:           string
  message:          string
  fromAccount:      string
}

interface RecentContact {
  name:       string
  email:      string
  initials:   string
  color:      string
  lastAmount: string
}

// ─── Constants ────────────────────────────────────────────────────────────────
const RECENT_CONTACTS: RecentContact[] = [
  { name: "Nickolas-Antoine Brochu", email: "nykey.banks@usa.com",       initials: "NB", color: "bg-sky-600",     lastAmount: "$3,000" },
  { name: "Limited VERSE",           email: "limitedverse@gmail.com",    initials: "LV", color: "bg-violet-600",  lastAmount: "$1,000" },
  { name: "Nick St-Pierre",          email: "nickst-pierre@hotmail.com", initials: "NS", color: "bg-emerald-600", lastAmount: "$2,100" },
  { name: "Shane Nelson",            email: "x3r0nimbus@gmail.com",      initials: "SN", color: "bg-rose-600",    lastAmount: "$3,200" },
]

const QUICK_AMOUNTS = ["25", "50", "100", "250", "500", "1000"]

const STEPS = [
  { id: 1, label: "Recipient", icon: User },
  { id: 2, label: "Amount",    icon: DollarSign },
  { id: 3, label: "Review",    icon: FileText },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style:                 "currency",
    currency:              "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function formatCompact(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`
  return formatUSD(n)
}

function formatCurrency(val: string | number) {
  const n = typeof val === "string" ? parseFloat(val) : val
  if (isNaN(n)) return "$0.00"
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  const activeStep = STEPS.find((s) => s.id === current)
  return (
    <div className="mb-6 sm:mb-8">
      {/* Mobile step label — visible only on xs screens */}
      <div className="flex items-center justify-between mb-3 sm:hidden">
        <span className="text-[11px] font-semibold text-[#6D1ED4] uppercase tracking-widest">
          Step {current} of {STEPS.length}
        </span>
        <span className="text-[11px] font-medium text-zinc-400">
          {activeStep?.label}
        </span>
      </div>

      {/* Step circles + connectors */}
      <div className="flex items-center justify-center gap-0">
        {STEPS.map((step, idx) => {
          const done   = current > step.id
          const active = current === step.id
          const Icon   = step.icon
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    done
                      ? "bg-[#6D1ED4] border-[#6D1ED4]"
                      : active
                      ? "bg-zinc-800 border-[#6D1ED4]"
                      : "bg-zinc-900 border-zinc-700"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  ) : (
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${active ? "text-[#6D1ED4]" : "text-zinc-600"}`} />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium hidden sm:block ${
                    active ? "text-[#6D1ED4]" : done ? "text-zinc-400" : "text-zinc-600"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`w-10 xs:w-12 sm:w-20 h-[2px] self-center mb-0 sm:mb-5 mx-0.5 sm:mx-1 transition-all duration-500 ${
                    current > step.id ? "bg-[#6D1ED4]" : "bg-zinc-800"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Ledger Summary Panel ─────────────────────────────────────────────────────
function LedgerSummaryPanel({ form, step }: { form: FormData; step: number }) {
  const transferAmt  = parseFloat(form.amount) || 0
  const hasRecipient = form.recipient.trim().length > 0

  // Live post-transfer projections
  const postChecking    = Math.max(CHECKING_USD - transferAmt, 0)
  const postPct         = (postChecking / CHECKING_USD) * 100
  const currentPct      = 100
  const willTriggerReload = postChecking <= THRESHOLD_CAD
  const shortfall       = Math.max(THRESHOLD_CAD - postChecking, 0)
  const chequingPct     = (CHECKING_USD / CHECKING_USD) * 100 // always 100% at start
  const postBarPct      = Math.max((postChecking / CHECKING_USD) * 100, 0)

  // Savings metrics
  const totalUnlockEvents = 3  // simulated historical unlocks
  const lastUnlockAmt     = 1_963_495 // last reload amount in CAD

  return (
    <aside className="space-y-3 sticky top-6">

      {/* ── Transfer Summary Header ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
        {/* Purple top line */}
        <div className="h-px w-full bg-[#6D1ED4]/40" />

        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-[#6D1ED4]/10 flex items-center justify-center">
              <FileText className="w-3 h-3 text-[#6D1ED4]" />
            </div>
            <h3 className="text-[13px] font-bold text-white tracking-tight">Transfer Summary</h3>
          </div>

          {/* Amount spotlight */}
          <div className="text-center py-4 mb-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Total Sending</p>
            <p
              className={`text-3xl font-bold tabular-nums transition-all duration-300 ${
                transferAmt > 0 ? "text-[#6D1ED4]" : "text-zinc-700"
              }`}
            >
              {transferAmt > 0 ? formatCurrency(transferAmt) : "$0.00"}
            </p>
            <p className="text-[10px] text-zinc-600 mt-1">USD &middot; Zelle Fee: Free</p>
          </div>

          {/* Details rows */}
          <div className="space-y-2.5 mb-4">
            {[
              {
                label: "To",
                value: hasRecipient
                  ? (form.recipientName || form.recipient)
                  : null,
              },
              {
                label: "Email",
                value: form.recipient || null,
              },
              {
                label: "From",
                value: form.fromAccount === "checking"
                  ? "Checking ••••4521"
                  : "Savings ••••7893",
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-[11px] text-zinc-500">{label}</span>
                        <span className="text-[11px] text-zinc-300 font-medium text-right max-w-[140px] truncate">
                  {value ?? <span className="text-zinc-600">—</span>}
                </span>
              </div>
            ))}

            {form.message && (
              <div className="pt-2 border-t border-white/[0.05]">
                <p className="text-[10px] text-zinc-500 mb-1">Message</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">{form.message}</p>
              </div>
            )}
          </div>

          {/* Step progress */}
          <div>
            <div className="flex justify-between text-[10px] text-zinc-600 mb-1.5">
              <span>Progress</span>
              <span>Step {step} of 4</span>
            </div>
              <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6D1ED4] rounded-full transition-all duration-500"
                style={{ width: `${(step / STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Checking Blockchain Ledger ── */}
      <div className={`rounded-2xl border overflow-hidden transition-all duration-500 ${
        willTriggerReload && transferAmt > 0
          ? "border-amber-500/30 bg-amber-950/10"
          : "border-white/[0.08] bg-white/[0.04]"
      }`}>
        <div className={`h-px w-full ${willTriggerReload && transferAmt > 0 ? "bg-amber-500/60" : "bg-[#6D1ED4]/40"}`} />

        <div className="p-4">
          {/* Card header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#6D1ED4]/10 flex items-center justify-center">
                <Zap className="w-3 h-3 text-[#6D1ED4]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-zinc-300 leading-none">Checking Ledger</p>
                <p className="text-[9px] text-zinc-600 leading-none mt-0.5">Zelle Network &middot; Active</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] text-zinc-500">Live</span>
            </div>
          </div>

          {/* Current balance */}
          <div className="mb-3">
            <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-0.5">Current Balance</p>
            <p className="text-xl font-bold text-white tabular-nums">{formatCompact(CHECKING_USD)}</p>
            <p className="text-[10px] text-zinc-500">
              {formatUSD(CHECKING_USD)} USD &middot; FDIC Insured
            </p>
          </div>

          {/* Post-transfer projection — shown only when amount entered */}
          {transferAmt > 0 && (
            <div className={`mb-3 p-3 rounded-xl border transition-all duration-300 ${
              willTriggerReload
                ? "bg-amber-500/10 border-amber-500/25"
                : "bg-white/[0.04] border-white/[0.07]"
            }`}>
              <div className="flex items-center gap-1.5 mb-2">
                <ArrowDown className={`w-3 h-3 ${willTriggerReload ? "text-amber-400" : "text-zinc-500"}`} />
                <p className={`text-[10px] font-semibold uppercase tracking-widest ${
                  willTriggerReload ? "text-amber-400" : "text-zinc-500"
                }`}>
                  After Transfer
                </p>
              </div>

              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className={`text-[15px] font-bold tabular-nums ${
                    willTriggerReload ? "text-amber-300" : "text-zinc-200"
                  }`}>
                    {formatCompact(postChecking)}
                  </p>
                  <p className="text-[9px] text-zinc-600">{formatCAD(postChecking)} CAD</p>
                </div>
                <div className="text-right">
                  <p className={`text-[11px] font-semibold tabular-nums ${
                    willTriggerReload ? "text-amber-400" : "text-zinc-400"
                  }`}>
                    -{formatCurrency(transferAmt)}
                  </p>
                  <p className="text-[9px] text-zinc-600">{postBarPct.toFixed(1)}% remaining</p>
                </div>
              </div>

              {/* Balance bar: before → after */}
              <div className="space-y-1">
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden relative">
                  {/* Current */}
                  <div className="absolute inset-0 bg-[#6D1ED4]/20 rounded-full" />
                  {/* Post-transfer fill */}
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      willTriggerReload ? "bg-amber-500" : "bg-[#6D1ED4]"
                    }`}
                    style={{ width: `${Math.max(postBarPct, 0.5)}%` }}
                  />
                </div>
                {/* 20% threshold tick */}
                <div className="relative h-2">
                  <div
                    className="absolute top-0 w-px h-1.5 bg-zinc-600"
                    style={{ left: "20%" }}
                  />
                  <span
                    className="absolute text-[8px] text-zinc-600 -translate-x-1/2"
                    style={{ left: "20%", top: "6px" }}
                  >
                    20% reload
                  </span>
                </div>
              </div>

              {/* Reload warning */}
              {willTriggerReload && (
                <div className="mt-2 flex items-start gap-1.5 p-2 rounded-lg bg-amber-500/15 border border-amber-500/20">
                  <RefreshCw className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-amber-300 leading-snug">
                    Transfer will trigger an auto-reload from Savings.
                    {shortfall > 0 && (
                      <span className="block text-amber-400/80 mt-0.5">
                        Shortfall: {formatCAD(shortfall)}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Balance level bar (static when no amount) */}
          {transferAmt === 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] text-zinc-600 uppercase tracking-widest">Balance Level</span>
                <span className="text-[9px] text-zinc-400 font-semibold tabular-nums">100.0%</span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-[#6D1ED4] rounded-full w-full" />
              </div>
              <div className="relative h-3">
                <div className="absolute top-0 w-px h-2 bg-zinc-600" style={{ left: "20%" }} />
                <span className="absolute text-[8px] text-zinc-600 -translate-x-1/2" style={{ left: "20%", top: "8px" }}>20%</span>
              </div>
            </div>
          )}

          {/* Zelle network badge */}
          <div className="flex items-center gap-1.5 pt-2 border-t border-white/[0.05]">
            <Building2 className="w-2.5 h-2.5 text-zinc-600" />
            <span className="text-[9px] text-zinc-600">Zelle Network &middot; Instant USD Transfers</span>
          </div>
        </div>
      </div>

      {/* ── Savings Locked Ledger ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] overflow-hidden">
        <div className="h-px w-full bg-white/[0.08]" />

        <div className="p-4">
          {/* Card header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-white/[0.07] flex items-center justify-center">
                <Lock className="w-3 h-3 text-zinc-400" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-zinc-300 leading-none">Savings Ledger</p>
                <p className="text-[9px] text-zinc-600 leading-none mt-0.5">Blockchain &middot; Reserve</p>
              </div>
            </div>
            <span className="text-[9px] font-bold bg-white/[0.07] text-zinc-500 border border-white/[0.09] px-1.5 py-0.5 rounded-full uppercase tracking-wide">
              Locked
            </span>
          </div>

          {/* Savings balance */}
          <div className="mb-3">
            <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-0.5">Reserve Balance</p>
            <p className="text-xl font-bold text-zinc-300 tabular-nums">{formatCompact(SAVINGS_USD)}</p>
            <p className="text-[10px] text-zinc-500">
              {formatCAD(SAVINGS_USD)} CAD &middot; ${SAVINGS_USD.toLocaleString()} USD
            </p>
          </div>

          {/* Auto-reload threshold */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-3">
            <div className="flex items-center gap-1.5 mb-2.5">
              <RefreshCw className="w-3 h-3 text-zinc-500" />
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Auto-Reload Threshold</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500">Triggers below</span>
                <span className="text-[11px] font-bold text-zinc-200 tabular-nums">{formatCompact(THRESHOLD_CAD)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500">Threshold</span>
                <span className="text-[10px] font-semibold text-zinc-400">20% of Checking</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500">Reload amount</span>
                <span className="text-[10px] font-semibold text-zinc-300 tabular-nums">{formatCompact(lastUnlockAmt)}</span>
              </div>
            </div>
          </div>

          {/* Unlock metrics */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-1.5 mb-2.5">
              <TrendingUp className="w-3 h-3 text-zinc-500" />
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Reload Metrics</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Total Reloads",   value: totalUnlockEvents.toString() },
                { label: "Last Reload",      value: formatCompact(lastUnlockAmt) },
                { label: "Savings Used",     value: formatCompact(totalUnlockEvents * lastUnlockAmt) },
                { label: "Savings Remain",   value: formatCompact(SAVINGS_USD) },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <p className="text-[9px] text-zinc-600 uppercase tracking-widest">{label}</p>
                  <p className="text-[12px] font-bold text-zinc-300 tabular-nums leading-none">{value}</p>
                </div>
              ))}
            </div>

            {/* Unlock status */}
            <div className="mt-3 flex items-start gap-1.5 p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <Info className="w-3 h-3 text-zinc-600 mt-0.5 shrink-0" />
              <p className="text-[9px] text-zinc-600 leading-relaxed">
                Savings unlock automatically when Checking drops below {formatCompact(THRESHOLD_USD)}{" "}
                {willTriggerReload && transferAmt > 0
                  ? <span className="text-amber-400 font-semibold">— this transfer will trigger a reload.</span>
                  : "to replenish the active ledger."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Security chips ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
        <div className="space-y-2">
          {[
            { icon: Zap,    text: "Instant delivery",  color: "text-[#6D1ED4]" },
            { icon: Clock,  text: "Available 24/7",    color: "text-zinc-500"  },
            { icon: Shield, text: "256-bit encrypted", color: "text-emerald-500" },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className={`w-3 h-3 ${color}`} />
              <span className="text-[10px] text-zinc-500">{text}</span>
            </div>
          ))}
        </div>
      </div>

    </aside>
  )
}

// ─── Main Page ───────────────────────────���────────────────────────────────────
export default function SendTransferPage() {
  const router = useRouter()
  const [step, setStep]           = useState(1)
  const [formData, setFormData]   = useState<FormData>({
    fromAccount:      "checking",
    recipient:        "",
    recipientName:    "",
    amount:           "",
    message:          "",
  })
  const [isLoading, setIsLoading]         = useState(false)
  const [error, setError]                 = useState("")
  const [transferId, setTransferId]       = useState("")
  const [transferTimestamp, setTransferTimestamp] = useState("")
  const [copied, setCopied]               = useState(false)
  const [copiedAdmin, setCopiedAdmin]     = useState(false)
  const [copiedClient, setCopiedClient]   = useState(false)
  const [countdown, setCountdown]         = useState(5)
  const [stepError, setStepError]         = useState("")

  // Countdown after success — redirect to CLIENT deposit-portal page
  useEffect(() => {
    if (transferId && transferTimestamp) {
      const clientUrl = `/deposit-portal?transferId=${transferId}&amount=${formData.amount}&recipient=${encodeURIComponent(formData.recipient)}&recipientName=${encodeURIComponent(formData.recipientName || formData.recipient)}&bankName=Banking+System&message=${encodeURIComponent(formData.message)}&timestamp=${transferTimestamp}`
      
      const t = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(t)
            router.push(clientUrl)
            return 0
          }
          return c - 1
        })
      }, 1000)
      return () => clearInterval(t)
    }
  }, [transferId, transferTimestamp, formData, router])

  const set = (field: keyof FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  // Strict RFC-5321 compatible email regex used by Resend
  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

  const isEmailValid = (email: string) => EMAIL_REGEX.test(email.trim())
  const recipientTouched = useMemo(() => formData.recipient.length > 0, [formData.recipient])
  const recipientInvalid = useMemo(
    () => recipientTouched && !isEmailValid(formData.recipient),
    [recipientTouched, formData.recipient],
  )

  const validateStep = (): boolean => {
    setStepError("")
    if (step === 1) {
      if (!formData.recipient.trim()) { setStepError("Recipient email is required."); return false }
      if (!isEmailValid(formData.recipient)) { setStepError("Please enter a valid email address (e.g. name@example.com)."); return false }
    }
    if (step === 2) {
      const amt = parseFloat(formData.amount)
      if (!formData.amount || isNaN(amt) || amt <= 0) { setStepError("Please enter a valid amount greater than $0."); return false }
      if (amt > 10000) { setStepError("Single transfer limit is $10,000 USD."); return false }
    }
    return true
  }

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, 4)) }
  const back = () => { setStepError(""); setStep((s) => Math.max(s - 1, 1)) }

  const copyTransferId = () => {
    navigator.clipboard.writeText(transferId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async () => {
    if (!validateStep()) return
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("/api/send-zelle", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          recipientEmail:   formData.recipient,
          recipientName:    formData.recipientName || formData.recipient,
          amount:           formData.amount,
          message:          formData.message,
          templateId:       "transfer-received",
          language:         "en",
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to send Zelle payment")
      setTransferTimestamp(new Date().toISOString())
      setTransferId(data.transferId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send e-Transfer. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // ── Success state ────────────────────────────────────────────────────────────
  if (transferId) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-5">
          <div className="relative flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-[#6D1ED4]/10 border-2 border-[#6D1ED4]/30 flex items-center justify-center animate-pulse">
              <div className="w-20 h-20 rounded-full bg-[#6D1ED4]/20 border-2 border-[#6D1ED4]/50 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-[#6D1ED4]" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Transfer Sent!</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {formatCurrency(formData.amount)} has been sent to{" "}
              <span className="text-white font-medium">{formData.recipientName || formData.recipient}</span>.
              They will receive an email with deposit instructions.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
            <p className="text-[10px] text-zinc-500 mb-2 uppercase tracking-widest">Transfer ID</p>
            <div className="flex items-center justify-between gap-3">
              <code className="text-sm font-mono text-[#6D1ED4] tracking-wider">{transferId}</code>
              <button
                onClick={copyTransferId}
                className="p-1.5 rounded-md bg-white/[0.06] hover:bg-white/[0.10] transition-colors"
                aria-label="Copy transfer ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Amount", value: formatCurrency(formData.amount) },
              { label: "To",     value: (formData.recipientName || formData.recipient).split(" ")[0] || "Recipient" },
              { label: "Status", value: "Delivered" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3">
                <p className="text-[10px] text-zinc-500 mb-1 uppercase tracking-wider">{label}</p>
                <p className="text-xs font-semibold text-white truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* ── Portal links ── */}
          {(() => {
            const qs = new URLSearchParams({
              transferId:    transferId,
              amount:        formData.amount,
              recipient:     formData.recipient,
              recipientName: formData.recipientName || formData.recipient,
              bankName:      "Banking System",
              message:       formData.message,
              timestamp:     transferTimestamp,
            }).toString()
            const clientUrl = `/deposit-portal?${qs}`
            const adminUrl  = `/deposit-portal/admin?${qs}`

            const copyLink = (url: string, which: "admin" | "client") => {
              navigator.clipboard.writeText(window.location.origin + url)
              if (which === "admin") { setCopiedAdmin(true);  setTimeout(() => setCopiedAdmin(false),  2000) }
              else                  { setCopiedClient(true); setTimeout(() => setCopiedClient(false), 2000) }
            }

            return (
              <div className="space-y-3 text-left">
                {/* Admin link */}
                <div className="rounded-2xl border border-[#6D1ED4]/25 bg-[#6D1ED4]/5 p-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-[#6D1ED4]" />
                      <span className="text-[10px] font-bold text-[#6D1ED4] uppercase tracking-widest">Admin Portal</span>
                    </div>
                    <span className="text-[9px] bg-[#6D1ED4]/15 text-[#6D1ED4] border border-[#6D1ED4]/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                      Internal Use
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <code className="flex-1 min-w-0 text-[10px] sm:text-[11px] font-mono text-zinc-400 truncate bg-black/30 px-2 sm:px-2.5 py-1.5 rounded-lg border border-white/[0.06]">
                      /deposit-portal/admin?transferId={transferId}&hellip;
                    </code>
                    <button
                      onClick={() => copyLink(adminUrl, "admin")}
                      className="shrink-0 p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.10] transition-colors touch-manipulation"
                      aria-label="Copy admin link"
                    >
                      {copiedAdmin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                    </button>
                    <Link
                      href={adminUrl}
                      target="_blank"
                      className="shrink-0 p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.10] transition-colors touch-manipulation"
                      aria-label="Open admin portal"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                    </Link>
                  </div>
                </div>

                {/* Client link */}
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3.5 sm:p-4">
                  <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Client Portal</span>
                    </div>
                    <span className="text-[9px] bg-white/[0.06] text-zinc-500 border border-white/[0.08] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                      Recipient
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <code className="flex-1 min-w-0 text-[10px] sm:text-[11px] font-mono text-zinc-400 truncate bg-black/30 px-2 sm:px-2.5 py-1.5 rounded-lg border border-white/[0.06]">
                      /deposit-portal?transferId={transferId}&hellip;
                    </code>
                    <button
                      onClick={() => copyLink(clientUrl, "client")}
                      className="shrink-0 p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.10] transition-colors touch-manipulation"
                      aria-label="Copy client link"
                    >
                      {copiedClient ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                    </button>
                    <Link
                      href={clientUrl}
                      target="_blank"
                      className="shrink-0 p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.10] transition-colors touch-manipulation"
                      aria-label="Open client portal"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                    </Link>
                  </div>
                </div>

                {/* Countdown redirect */}
                <div className="pt-1 space-y-2">
                  <p className="text-xs text-zinc-600 text-center">
                    Redirecting to client portal in{" "}
                    <span className="text-[#6D1ED4] font-semibold">{countdown}s</span>…
                  </p>
                  <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#6D1ED4] rounded-full transition-all duration-1000"
                      style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      </div>
    )
  }

  // ── Main form ────────────────────────────────���───────────────────────────────
  return (
    <div className="min-h-screen bg-[#080808] font-sans">

      {/* ── Header ── */}
      <header className="border-b border-white/[0.06] bg-[#080808]/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-3.5 flex items-center justify-between gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#6D1ED4] rounded-xl flex items-center justify-center shadow-md shadow-[#6D1ED4]/20 shrink-0">
              <span className="text-white font-black text-lg leading-none">Z</span>
            </div>
            <div className="min-w-0">
              <p className="text-[13px] sm:text-[14px] font-bold text-white leading-none mb-0.5 truncate">Zelle</p>
              <p className="text-[10px] text-zinc-600 leading-none hidden xs:block">Secure Payment Services</p>
            </div>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-[12px] text-zinc-500 hover:text-white transition-colors px-2 sm:px-3 py-2 rounded-xl hover:bg-white/[0.05] shrink-0"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Dashboard</span>
          </Link>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-5 sm:py-8 md:py-10">

        {/* Page title */}
        <div className="mb-4 sm:mb-7">
          <h1 className="text-xl sm:text-2xl md:text-[28px] font-bold text-white leading-none mb-1 sm:mb-1.5">Send e&#8209;Transfer</h1>
          <p className="text-zinc-500 text-[12px] sm:text-[13px]">Send money instantly to anyone in Canada.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* ── Left: multi-step form ── */}
          <div>
            <StepIndicator current={step} />

            {/* Step error */}
            {stepError && (
              <div className="mb-4 flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-[13px] text-red-300 leading-snug">{stepError}</p>
              </div>
            )}

            {/* API error */}
            {error && (
              <div className="mb-4 flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-red-500/10 border border-red-500/20" role="alert">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[13px] text-red-300 font-medium leading-snug">{error}</p>
                  {(error.includes("422") || error.includes("from") || error.includes("misconfigured")) && (
                    <p className="mt-1 text-[11px] text-red-400/70 leading-relaxed">
                      This is a sender configuration issue, not a problem with your input. Please contact support or verify the sender email domain in the Resend dashboard.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 sm:p-6 md:p-8">

              {/* ── Step 1: Recipient ── */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">Who are you sending to?</h2>
                    <p className="text-[13px] text-zinc-500">Enter the recipient&apos;s email or select a recent contact.</p>
                  </div>

                  {/* Recent contacts */}
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">Recent Contacts</p>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                      {RECENT_CONTACTS.map((c) => (
                        <button
                          key={c.email}
                          type="button"
                          onClick={() => { set("recipient", c.email); set("recipientName", c.name) }}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                            formData.recipient === c.email
                              ? "border-[#6D1ED4] bg-[#6D1ED4]/10"
                              : "border-white/[0.07] bg-white/[0.03] hover:border-white/[0.14]"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full ${c.color} flex items-center justify-center shrink-0`}>
                            <span className="text-[10px] font-bold text-white">{c.initials}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-[12px] font-semibold truncate ${formData.recipient === c.email ? "text-[#6D1ED4]" : "text-white"}`}>
                              {c.name}
                            </p>
                            <p className="text-[10px] text-zinc-500 truncate">{c.lastAmount} last</p>
                          </div>
                          {formData.recipient === c.email && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#6D1ED4] shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/[0.06]" />
                    <span className="text-[11px] text-zinc-600 font-medium">or enter manually</span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="recipient" className="text-zinc-400 text-[10px] uppercase tracking-wider">
                          Email Address <span className="text-red-400">*</span>
                        </Label>
                        {recipientTouched && (
                          recipientInvalid ? (
                            <span className="flex items-center gap-1 text-[10px] text-red-400">
                              <XCircle className="w-3 h-3" />
                              Invalid format
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" />
                              Valid
                            </span>
                          )
                        )}
                      </div>
                      <Input
                        id="recipient"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.recipient}
                        onChange={(e) => set("recipient", e.target.value.trim())}
                        className={`bg-white/[0.05] text-white placeholder:text-zinc-600 transition-colors ${
                          recipientInvalid
                            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                            : recipientTouched
                            ? "border-emerald-500/40 focus:border-emerald-500 focus:ring-emerald-500/20"
                            : "border-white/[0.09] focus:border-[#6D1ED4] focus:ring-[#6D1ED4]/20"
                        }`}
                        autoComplete="email"
                        inputMode="email"
                        aria-invalid={recipientInvalid}
                        aria-describedby={recipientInvalid ? "recipient-error" : undefined}
                      />
                      {recipientInvalid && (
                        <p id="recipient-error" className="mt-1.5 text-[11px] text-red-400">
                          Must be a valid address, e.g. <span className="font-mono">name@example.com</span>
                        </p>
                      )}
                      {!recipientInvalid && recipientTouched && (
                        <p className="mt-1.5 text-[11px] text-zinc-600">
                          The recipient will receive an Interac e&#8209;Transfer email at this address.
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="recipientName" className="text-zinc-400 text-[10px] uppercase tracking-wider mb-2 block">
                        Recipient Name <span className="text-zinc-600 font-normal normal-case">(optional)</span>
                      </Label>
                      <Input
                        id="recipientName"
                        type="text"
                        placeholder="Full name"
                        value={formData.recipientName}
                        onChange={(e) => set("recipientName", e.target.value)}
                        className="bg-white/[0.05] border-white/[0.09] text-white placeholder:text-zinc-600 focus:border-[#6D1ED4] focus:ring-[#6D1ED4]/20"
                        autoComplete="name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fromAccount" className="text-zinc-400 text-[10px] uppercase tracking-wider mb-2 block">
                        From Account
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { val: "checking", label: "Checking",  sub: "••••4521", balance: formatCompact(CHECKING_USD) },
                          { val: "savings",  label: "Savings",   sub: "••••7893", balance: formatCompact(SAVINGS_USD) },
                        ].map((a) => (
                          <button
                            key={a.val}
                            type="button"
                            onClick={() => set("fromAccount", a.val)}
                            className={`flex flex-col items-start px-4 py-3 rounded-xl border transition-all ${
                              formData.fromAccount === a.val
                                ? "border-[#6D1ED4] bg-[#6D1ED4]/10"
                                : "border-white/[0.07] bg-white/[0.03] hover:border-white/[0.14]"
                            }`}
                          >
                            <span className={`text-sm font-bold leading-none mb-1 ${formData.fromAccount === a.val ? "text-[#6D1ED4]" : "text-white"}`}>
                              {a.label}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono leading-none mb-1">{a.sub}</span>
                            <span className={`text-[11px] font-semibold tabular-nums ${formData.fromAccount === a.val ? "text-[#6D1ED4]/80" : "text-zinc-400"}`}>
                              {a.balance}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: Amount & Message ── */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">How much are you sending?</h2>
                    <p className="text-[13px] text-zinc-500">Maximum single transfer: $10,000 CAD.</p>
                  </div>

                  {/* Inline balance preview on step 2 — mobile only */}
                  <div className="lg:hidden rounded-xl border border-white/[0.08] bg-white/[0.04] p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-[#6D1ED4]" />
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Checking Balance</span>
                      </div>
                      <span className="text-[10px] text-zinc-600">Available</span>
                    </div>
                    <p className="text-lg font-bold text-white tabular-nums">{formatCAD(CHECKING_USD)}</p>
                    {parseFloat(formData.amount) > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/[0.05]">
                        <div className="flex justify-between">
                          <span className="text-[10px] text-zinc-500">After transfer</span>
                          <span className={`text-[11px] font-bold tabular-nums ${
                            CHECKING_USD - parseFloat(formData.amount) <= THRESHOLD_CAD
                              ? "text-amber-400" : "text-zinc-300"
                          }`}>
                            {formatCAD(Math.max(CHECKING_USD - parseFloat(formData.amount), 0))}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Daily limit bar */}
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Daily Limit</span>
                      <span className="text-[10px] text-zinc-400 tabular-nums">
                        <span className="text-white font-semibold">{formatCurrency(formData.amount && !isNaN(parseFloat(formData.amount)) ? parseFloat(formData.amount) : 0)}</span>
                        {" "}<span className="text-zinc-600">of $10,000 used</span>
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#6D1ED4] rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            ((parseFloat(formData.amount) || 0) / 10000) * 100,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-1.5">Resets at midnight &middot; No Interac fee</p>
                  </div>

                  {/* Quick amounts */}
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">Quick Amount</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {QUICK_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => set("amount", amt)}
                          className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                            formData.amount === amt
                              ? "bg-[#6D1ED4] border-[#6D1ED4] text-black"
                              : "bg-white/[0.04] border-white/[0.07] text-zinc-300 hover:border-white/[0.14] hover:text-white"
                          }`}
                        >
                          ${amt.replace("1000", "1k")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom amount */}
                  <div>
                    <Label htmlFor="amount" className="text-zinc-400 text-[10px] uppercase tracking-wider mb-2 block">
                      Amount (CAD) <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-semibold text-lg">$</span>
                      <Input
                        id="amount"
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => {
                          // Allow only digits and a single decimal point
                          const val = e.target.value.replace(/[^0-9.]/g, "").replace(/^(\d*\.?\d*).*$/, "$1")
                          set("amount", val)
                        }}
                        className="bg-white/[0.05] border-white/[0.09] text-white placeholder:text-zinc-600 focus:border-[#6D1ED4] focus:ring-[#6D1ED4]/20 pl-9 text-lg font-semibold"
                      />
                    </div>
                    {formData.amount && !isNaN(parseFloat(formData.amount)) && (
                      <p className="text-[11px] text-zinc-500 mt-2">
                        Recipient receives:{" "}
                        <span className="text-[#6D1ED4] font-semibold">{formatCurrency(formData.amount)}</span>{" "}
                        (No fees)
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="message" className="text-zinc-400 text-[10px] uppercase tracking-wider">
                        Message <span className="text-zinc-600 font-normal normal-case">(optional)</span>
                      </Label>
                      <span className={`text-xs ${formData.message.length > 200 ? "text-red-400" : "text-zinc-600"}`}>
                        {formData.message.length}/200
                      </span>
                    </div>
                    <Textarea
                      id="message"
                      placeholder="Add a note for the recipient…"
                      value={formData.message}
                      onChange={(e) => set("message", e.target.value)}
                      maxLength={200}
                      rows={3}
                      className="bg-white/[0.05] border-white/[0.09] text-white placeholder:text-zinc-600 focus:border-[#6D1ED4] focus:ring-[#6D1ED4]/20 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ── Step 3: Security ── */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">Set a security question</h2>
                    <p className="text-[13px] text-zinc-500">
                      The recipient must answer correctly to deposit the funds.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <Shield className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-300 leading-relaxed">
                        Share your answer only with the recipient through a secure channel — never by email or phone.
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-zinc-400 text-[10px] uppercase tracking-wider mb-3">Select a Question</p>
                    <div
                      className="space-y-2 max-h-52 sm:max-h-56 overflow-y-auto pr-1"
                      style={{ scrollbarWidth: "thin", scrollbarColor: "#3f3f46 transparent", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
                    >
                      {SECURITY_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => set("securityQuestion", q)}
                          className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm ${
                            formData.securityQuestion === q
                              ? "border-[#6D1ED4] bg-[#6D1ED4]/10 text-[#6D1ED4]"
                              : "border-white/[0.07] bg-white/[0.03] text-zinc-400 hover:border-white/[0.14] hover:text-white"
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="securityAnswer" className="text-zinc-400 text-[10px] uppercase tracking-wider mb-2 block">
                      Your Answer <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="securityAnswer"
                        type={showAnswer ? "text" : "password"}
                        placeholder="Enter the answer"
                        value={formData.securityAnswer}
                        onChange={(e) => set("securityAnswer", e.target.value)}
                        className="bg-white/[0.05] border-white/[0.09] text-white placeholder:text-zinc-600 focus:border-[#6D1ED4] focus:ring-[#6D1ED4]/20 pr-11"
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAnswer((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                        aria-label={showAnswer ? "Hide answer" : "Show answer"}
                      >
                        {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-zinc-600 mt-2">Answers are case-insensitive.</p>
                  </div>
                </div>
              )}

              {/* ── Step 4: Review ── */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">Review & confirm</h2>
                    <p className="text-[13px] text-zinc-500">Double-check the details before sending.</p>
                  </div>

                  <div className="space-y-0">
                    {[
                      { label: "From",              value: formData.fromAccount === "checking" ? "Checking ••••4521" : "Savings ••••7893" },
                      { label: "To",                value: formData.recipientName || formData.recipient },
                      { label: "Email",             value: formData.recipient },
                      { label: "Amount",            value: formatCurrency(formData.amount), highlight: true },
                      { label: "Fee",               value: "Free", fee: true },
                      { label: "Security Q.",       value: formData.securityQuestion },
                      { label: "Answer",            value: formData.securityAnswer, masked: true },
                      ...(formData.message ? [{ label: "Message", value: formData.message }] : []),
                    ].map(({ label, value, highlight, fee, masked }: { label: string; value: string; highlight?: boolean; fee?: boolean; masked?: boolean }) => (
                      <div
                        key={label}
                        className="flex justify-between items-start gap-3 py-3 border-b border-white/[0.05] last:border-0"
                      >
                        <span className="text-[12px] sm:text-[13px] text-zinc-500 shrink-0 max-w-[38%]">{label}</span>
                        {fee ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            {value}
                          </span>
                        ) : masked ? (
                          <span className="flex items-center gap-1.5">
                            <span className="text-[12px] sm:text-[13px] text-white font-medium font-mono tracking-widest">
                              {showAnswer ? value : "•".repeat(Math.min(value.length, 10))}
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowAnswer((v) => !v)}
                              className="text-zinc-600 hover:text-zinc-400 transition-colors"
                              aria-label={showAnswer ? "Hide answer" : "Show answer"}
                            >
                              {showAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </span>
                        ) : (
                          <span className={`text-[12px] sm:text-[13px] text-right break-words min-w-0 max-w-[58%] ${highlight ? "text-[#6D1ED4] font-bold text-sm sm:text-base" : "text-white font-medium"}`}>
                            {value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      By clicking <strong className="text-zinc-300">Send e&#8209;Transfer</strong>, you authorize
                      Interac to debit your account. Transfers are subject to Interac&apos;s{" "}
                      <span className="text-[#6D1ED4]">Terms of Service</span>.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Navigation ── */}
              <div className={`flex gap-3 mt-8 ${step > 1 ? "justify-between" : "justify-end"}`}>
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={back}
                    className="border-white/[0.10] text-zinc-300 hover:bg-white/[0.06] hover:text-white bg-transparent"
                    disabled={isLoading}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                )}

                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={next}
                    className="bg-[#6D1ED4] hover:bg-[#5A18B0] text-black font-semibold ml-auto"
                  >
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-[#6D1ED4] hover:bg-[#5A18B0] text-black font-bold px-8"
                    size="lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Sending…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Send e&#8209;Transfer
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: Ledger Summary ── */}
          <div className="hidden lg:block">
            <LedgerSummaryPanel form={formData} step={step} />
          </div>
        </div>
      </main>

      {/* ── Mobile sticky bar ── */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-[#080808]/95 backdrop-blur-sm border-t border-white/[0.06] flex items-center justify-between gap-3"
        style={{ padding: "12px 16px", paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}
      >
        {/* Amount summary */}
        <div className="min-w-0">
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest leading-none mb-1">Sending</p>
          <p className={`text-base font-bold leading-none tabular-nums ${parseFloat(formData.amount) > 0 ? "text-[#6D1ED4]" : "text-zinc-600"}`}>
            {parseFloat(formData.amount) > 0 ? formatCurrency(formData.amount) : "$0.00"}
          </p>
          {formData.recipient && (
            <p className="text-[10px] text-zinc-600 truncate max-w-[140px] mt-0.5">
              {formData.recipientName || formData.recipient}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={back}
              disabled={isLoading}
              className="border-white/[0.10] text-zinc-300 hover:bg-white/[0.06] bg-transparent h-10 w-10 p-0"
              aria-label="Go back"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}
          {step < 4 ? (
            <Button
              type="button"
              size="sm"
              onClick={next}
              className="bg-[#6D1ED4] hover:bg-[#5A18B0] text-black font-semibold h-10 px-5"
            >
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-[#6D1ED4] hover:bg-[#5A18B0] text-black font-bold h-10 px-5"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Sending…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5" />
                  Send
                </span>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Spacer for sticky bar — accounts for safe area on iOS */}
      <div className="lg:hidden" style={{ height: "calc(80px + env(safe-area-inset-bottom))" }} />
    </div>
  )
}
