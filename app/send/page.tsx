"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
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
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  recipient: string
  recipientName: string
  amount: string
  message: string
  securityQuestion: string
  securityAnswer: string
  fromAccount: string
}

interface RecentContact {
  name: string
  email: string
  initials: string
  color: string
  lastAmount: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const RECENT_CONTACTS: RecentContact[] = [
  { name: "Nickolas-Antoine Brochu", email: "nykey.banks@usa.com",        initials: "NB", color: "bg-sky-600",     lastAmount: "$3,000" },
  { name: "Limited VERSE",           email: "limitedverse@gmail.com",     initials: "LV", color: "bg-violet-600",  lastAmount: "$1,000" },
  { name: "Nick St-Pierre",          email: "nickst-pierre@hotmail.com",  initials: "NS", color: "bg-emerald-600", lastAmount: "$2,100" },
  { name: "Shane Nelson",            email: "x3r0nimbus@gmail.com",       initials: "SN", color: "bg-rose-600",    lastAmount: "$3,200" },
]

const QUICK_AMOUNTS = ["25", "50", "100", "250", "500", "1000"]

const SECURITY_QUESTIONS = [
  "What is your favorite color?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What was the make of your first car?",
  "What is your childhood nickname?",
  "What street did you grow up on?",
]

const STEPS = [
  { id: 1, label: "Recipient", icon: User },
  { id: 2, label: "Amount",    icon: DollarSign },
  { id: 3, label: "Security",  icon: Shield },
  { id: 4, label: "Review",    icon: FileText },
]

const FEE = 0 // Interac is free

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(val: string | number) {
  const n = typeof val === "string" ? parseFloat(val) : val
  if (isNaN(n)) return "$0.00"
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n)
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, idx) => {
        const done    = current > step.id
        const active  = current === step.id
        const Icon    = step.icon
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  done
                    ? "bg-[#FDB913] border-[#FDB913]"
                    : active
                    ? "bg-zinc-800 border-[#FDB913]"
                    : "bg-zinc-900 border-zinc-700"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="w-4 h-4 text-black" />
                ) : (
                  <Icon className={`w-4 h-4 ${active ? "text-[#FDB913]" : "text-zinc-600"}`} />
                )}
              </div>
              <span
                className={`text-[10px] font-medium hidden sm:block ${
                  active ? "text-[#FDB913]" : done ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`w-14 sm:w-20 h-[2px] mb-5 mx-1 transition-all duration-500 ${
                  current > step.id ? "bg-[#FDB913]" : "bg-zinc-800"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function SummaryPanel({ form, step }: { form: FormData; step: number }) {
  const amount = parseFloat(form.amount) || 0
  const hasRecipient = form.recipient.trim().length > 0

  return (
    <Card className="bg-zinc-900/80 border-zinc-800 p-5 sticky top-6 space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
        <div className="w-7 h-7 rounded-md bg-[#FDB913]/15 flex items-center justify-center">
          <FileText className="w-3.5 h-3.5 text-[#FDB913]" />
        </div>
        <h3 className="text-sm font-semibold text-white">Transfer Summary</h3>
      </div>

      {/* Amount spotlight */}
      <div className="text-center py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
        <p className="text-xs text-zinc-500 mb-1 uppercase tracking-widest">Total Sending</p>
        <p
          className={`text-3xl font-bold transition-all duration-300 ${
            amount > 0 ? "text-[#FDB913]" : "text-zinc-600"
          }`}
        >
          {amount > 0 ? formatCurrency(amount) : "$0.00"}
        </p>
        <p className="text-[11px] text-zinc-500 mt-1">CAD · Interac Fee: Free</p>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-zinc-500">To</span>
          <span className="text-xs text-white font-medium text-right max-w-[160px] truncate">
            {hasRecipient ? (form.recipientName || form.recipient) : <span className="text-zinc-600">—</span>}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-zinc-500">Email</span>
          <span className="text-xs text-zinc-400 max-w-[160px] truncate">
            {form.recipient || <span className="text-zinc-600">—</span>}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-zinc-500">From</span>
          <span className="text-xs text-zinc-400">
            {form.fromAccount === "checking" ? "Checking ••••4521" : "Savings ••••7893"}
          </span>
        </div>
        {form.message && (
          <div className="pt-2 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 mb-1">Message</p>
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{form.message}</p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-[10px] text-zinc-600 mb-1.5">
          <span>Progress</span>
          <span>Step {step} of 4</span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FDB913] rounded-full transition-all duration-500"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Info chips */}
      <div className="space-y-2">
        {[
          { icon: Zap,   text: "Instant delivery" },
          { icon: Clock, text: "Available 24/7" },
          { icon: Shield, text: "256-bit encrypted" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2">
            <Icon className="w-3 h-3 text-zinc-600" />
            <span className="text-[11px] text-zinc-600">{text}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SendTransferPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    fromAccount:      "checking",
    recipient:        "",
    recipientName:    "",
    amount:           "",
    message:          "",
    securityQuestion: SECURITY_QUESTIONS[0],
    securityAnswer:   "",
  })
  const [showAnswer, setShowAnswer]   = useState(false)
  const [isLoading, setIsLoading]     = useState(false)
  const [error, setError]             = useState("")
  const [transferId, setTransferId]   = useState("")
  const [copied, setCopied]           = useState(false)
  const [countdown, setCountdown]     = useState(5)
  const [stepError, setStepError]     = useState("")

  // Countdown after success
  useEffect(() => {
    if (transferId) {
      const t = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(t)
            router.push(
              `/deposit-portal?transferId=${transferId}&amount=${formData.amount}&recipient=${formData.recipient}&recipientName=${encodeURIComponent(formData.recipientName || formData.recipient)}&bankName=Banking+System&message=${encodeURIComponent(formData.message)}&timestamp=${new Date().toISOString()}`,
            )
            return 0
          }
          return c - 1
        })
      }, 1000)
      return () => clearInterval(t)
    }
  }, [transferId])

  // ── Field update helper ───────────────────────────────────────────────────
  const set = (field: keyof FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  // ── Step validation ───────────────────────────────────────────────────────
  const validateStep = (): boolean => {
    setStepError("")
    if (step === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!formData.recipient.trim()) { setStepError("Recipient email is required."); return false }
      if (!emailRegex.test(formData.recipient)) { setStepError("Please enter a valid email address."); return false }
    }
    if (step === 2) {
      const amt = parseFloat(formData.amount)
      if (!formData.amount || isNaN(amt) || amt <= 0) { setStepError("Please enter a valid amount greater than $0."); return false }
      if (amt > 10000) { setStepError("Single transfer limit is $10,000 CAD."); return false }
    }
    if (step === 3) {
      if (!formData.securityAnswer.trim()) { setStepError("Security answer is required."); return false }
      if (formData.securityAnswer.trim().length < 2) { setStepError("Answer must be at least 2 characters."); return false }
    }
    return true
  }

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, 4)) }
  const back = () => { setStepError(""); setStep((s) => Math.max(s - 1, 1)) }

  // ── Copy transfer ID ──────────────────────────────────────────────────────
  const copyTransferId = () => {
    navigator.clipboard.writeText(transferId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateStep()) return
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/send-interac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail:   formData.recipient,
          recipientName:    formData.recipientName || formData.recipient,
          amount:           formData.amount,
          message:          formData.message,
          securityQuestion: formData.securityQuestion,
          securityAnswer:   formData.securityAnswer,
          templateId:       "transfer-received",
          language:         "en",
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to send e-Transfer")

      setTransferId(data.transferId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send e-Transfer. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SUCCESS STATE
  // ─────────────────────────────────────────────────────────────────────────
  if (transferId) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-6">
          {/* Animated checkmark ring */}
          <div className="relative flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-[#FDB913]/10 border-2 border-[#FDB913]/30 flex items-center justify-center animate-pulse">
              <div className="w-20 h-20 rounded-full bg-[#FDB913]/20 border-2 border-[#FDB913]/50 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-[#FDB913]" />
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

          {/* Transfer ID card */}
          <Card className="bg-zinc-900/80 border-zinc-800 p-4">
            <p className="text-xs text-zinc-500 mb-2 uppercase tracking-widest">Transfer ID</p>
            <div className="flex items-center justify-between gap-3">
              <code className="text-sm font-mono text-[#FDB913] tracking-wider">{transferId}</code>
              <button
                onClick={copyTransferId}
                className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors"
                aria-label="Copy transfer ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              </button>
            </div>
          </Card>

          {/* Summary row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Amount",    value: formatCurrency(formData.amount) },
              { label: "To",        value: (formData.recipientName || formData.recipient).split(" ")[0] || "Recipient" },
              { label: "Status",    value: "Delivered" },
            ].map(({ label, value }) => (
              <Card key={label} className="bg-zinc-900/60 border-zinc-800 p-3">
                <p className="text-[10px] text-zinc-500 mb-1 uppercase tracking-wider">{label}</p>
                <p className="text-xs font-semibold text-white truncate">{value}</p>
              </Card>
            ))}
          </div>

          {/* Auto-redirect */}
          <div className="space-y-3">
            <p className="text-xs text-zinc-600">
              Redirecting to deposit portal in{" "}
              <span className="text-[#FDB913] font-semibold">{countdown}s</span>…
            </p>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FDB913] rounded-full transition-all duration-1000"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              />
            </div>
            <Link
              href={`/deposit-portal?transferId=${transferId}&amount=${formData.amount}&recipient=${formData.recipient}&recipientName=${encodeURIComponent(formData.recipientName || formData.recipient)}&bankName=Banking+System&message=${encodeURIComponent(formData.message)}&timestamp=${new Date().toISOString()}`}
              className="inline-flex items-center gap-2 text-sm text-[#FDB913] hover:text-[#e5a811] font-medium transition-colors"
            >
              Go now <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN FORM
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-950 font-sans">
      {/* ── Header ── */}
      <header className="border-b border-zinc-900 bg-zinc-950/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#FDB913] rounded-lg flex items-center justify-center p-1.5">
              <img
                src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
                alt="Interac"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">Interac e-Transfer</p>
              <p className="text-[10px] text-zinc-500 leading-none mt-0.5">via QuantumYield</p>
            </div>
          </Link>
          <Link
            href="/dashboard"
            className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-3 h-3" /> Dashboard
          </Link>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Send e-Transfer</h1>
          <p className="text-zinc-500 text-sm mt-1">Send money instantly to anyone in Canada.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* ── Left column: steps ── */}
          <div>
            <StepIndicator current={step} />

            {/* Step error */}
            {stepError && (
              <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-300">{stepError}</p>
              </div>
            )}

            {/* Global API error */}
            {error && (
              <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <Card className="bg-zinc-900/60 border-zinc-800 p-6 md:p-8">
              {/* ───────────── STEP 1 – Recipient ───────────── */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Who are you sending to?</h2>
                    <p className="text-sm text-zinc-500">Enter the recipient&apos;s email or select a recent contact.</p>
                  </div>

                  {/* Recent contacts */}
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-3">Recent Contacts</p>
                    <div className="grid grid-cols-2 gap-2">
                      {RECENT_CONTACTS.map((c) => (
                        <button
                          key={c.email}
                          type="button"
                          onClick={() => {
                            set("recipient", c.email)
                            set("recipientName", c.name)
                          }}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left group ${
                            formData.recipient === c.email
                              ? "border-[#FDB913] bg-[#FDB913]/8"
                              : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full ${c.color} flex items-center justify-center shrink-0`}>
                            <span className="text-[10px] font-bold text-white">{c.initials}</span>
                          </div>
                          <div className="min-w-0">
                            <p className={`text-xs font-medium truncate ${formData.recipient === c.email ? "text-[#FDB913]" : "text-white"}`}>
                              {c.name}
                            </p>
                            <p className="text-[10px] text-zinc-500 truncate">{c.lastAmount} last</p>
                          </div>
                          {formData.recipient === c.email && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#FDB913] ml-auto shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-zinc-800" />
                    <span className="text-xs text-zinc-600 font-medium">or enter manually</span>
                    <div className="flex-1 h-px bg-zinc-800" />
                  </div>

                  {/* Manual fields */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="recipient" className="text-zinc-300 text-xs uppercase tracking-wider mb-2 block">
                        Email Address <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="recipient"
                        type="email"
                        placeholder="recipient@example.com"
                        value={formData.recipient}
                        onChange={(e) => set("recipient", e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#FDB913] focus:ring-[#FDB913]/20"
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipientName" className="text-zinc-300 text-xs uppercase tracking-wider mb-2 block">
                        Recipient Name <span className="text-zinc-600 font-normal normal-case">(optional)</span>
                      </Label>
                      <Input
                        id="recipientName"
                        type="text"
                        placeholder="Full name"
                        value={formData.recipientName}
                        onChange={(e) => set("recipientName", e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#FDB913] focus:ring-[#FDB913]/20"
                        autoComplete="name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fromAccount" className="text-zinc-300 text-xs uppercase tracking-wider mb-2 block">
                        From Account
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { val: "checking", label: "Checking", sub: "••••4521" },
                          { val: "savings",  label: "Savings",  sub: "••••7893" },
                        ].map((a) => (
                          <button
                            key={a.val}
                            type="button"
                            onClick={() => set("fromAccount", a.val)}
                            className={`flex flex-col items-start px-4 py-3 rounded-xl border transition-all ${
                              formData.fromAccount === a.val
                                ? "border-[#FDB913] bg-[#FDB913]/8"
                                : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                            }`}
                          >
                            <span className={`text-sm font-semibold ${formData.fromAccount === a.val ? "text-[#FDB913]" : "text-white"}`}>
                              {a.label}
                            </span>
                            <span className="text-xs text-zinc-500 font-mono">{a.sub}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────── STEP 2 – Amount & Message ───────────── */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">How much are you sending?</h2>
                    <p className="text-sm text-zinc-500">Maximum single transfer: $10,000 CAD.</p>
                  </div>

                  {/* Quick amounts */}
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-3">Quick Amount</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {QUICK_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => set("amount", amt)}
                          className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                            formData.amount === amt
                              ? "bg-[#FDB913] border-[#FDB913] text-black"
                              : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white"
                          }`}
                        >
                          ${amt.replace("1000", "1k")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom amount */}
                  <div>
                    <Label htmlFor="amount" className="text-zinc-300 text-xs uppercase tracking-wider mb-2 block">
                      Amount (CAD) <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-semibold text-lg">$</span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        max="10000"
                        value={formData.amount}
                        onChange={(e) => set("amount", e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#FDB913] focus:ring-[#FDB913]/20 pl-9 text-lg font-semibold"
                      />
                    </div>
                    {formData.amount && !isNaN(parseFloat(formData.amount)) && (
                      <p className="text-xs text-zinc-500 mt-2">
                        Recipient receives:{" "}
                        <span className="text-[#FDB913] font-semibold">{formatCurrency(formData.amount)}</span>{" "}
                        (No fees)
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="message" className="text-zinc-300 text-xs uppercase tracking-wider">
                        Message <span className="text-zinc-600 font-normal normal-case">(optional)</span>
                      </Label>
                      <span className={`text-xs ${(formData.message.length) > 200 ? "text-red-400" : "text-zinc-600"}`}>
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
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#FDB913] focus:ring-[#FDB913]/20 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ───────────── STEP 3 – Security ───────────── */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Set a security question</h2>
                    <p className="text-sm text-zinc-500">
                      The recipient must answer correctly to deposit the funds.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <Shield className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-300 leading-relaxed">
                        Share your answer only with the recipient through a secure channel — never by email or phone.
                      </p>
                    </div>
                  </div>

                  {/* Question picker */}
                  <div>
                    <p className="text-zinc-300 text-xs uppercase tracking-wider mb-3">Select a Question</p>
                    <div className="space-y-2">
                      {SECURITY_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => set("securityQuestion", q)}
                          className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm ${
                            formData.securityQuestion === q
                              ? "border-[#FDB913] bg-[#FDB913]/8 text-[#FDB913]"
                              : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-white"
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Answer */}
                  <div>
                    <Label htmlFor="securityAnswer" className="text-zinc-300 text-xs uppercase tracking-wider mb-2 block">
                      Your Answer <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="securityAnswer"
                        type={showAnswer ? "text" : "password"}
                        placeholder="Enter the answer"
                        value={formData.securityAnswer}
                        onChange={(e) => set("securityAnswer", e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#FDB913] focus:ring-[#FDB913]/20 pr-11"
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
                    <p className="text-xs text-zinc-600 mt-2">Answers are case-insensitive.</p>
                  </div>
                </div>
              )}

              {/* ───────────── STEP 4 – Review ───────────── */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Review & confirm</h2>
                    <p className="text-sm text-zinc-500">Double-check the details before sending.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "From",              value: formData.fromAccount === "checking" ? "Checking ••••4521" : "Savings ••••7893" },
                      { label: "To",                value: formData.recipientName || formData.recipient },
                      { label: "Email",             value: formData.recipient },
                      { label: "Amount",            value: formatCurrency(formData.amount), highlight: true },
                      { label: "Fee",               value: "Free" },
                      { label: "Security Question", value: formData.securityQuestion },
                      ...(formData.message ? [{ label: "Message", value: formData.message }] : []),
                    ].map(({ label, value, highlight }) => (
                      <div
                        key={label}
                        className="flex justify-between items-start gap-4 py-3 border-b border-zinc-800 last:border-0"
                      >
                        <span className="text-sm text-zinc-500 shrink-0">{label}</span>
                        <span
                          className={`text-sm text-right break-all ${
                            highlight ? "text-[#FDB913] font-bold text-base" : "text-white font-medium"
                          }`}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      By clicking <strong className="text-zinc-300">Send e-Transfer</strong>, you authorize
                      QuantumYield to debit your account. Transfers are subject to Interac&apos;s{" "}
                      <span className="text-[#FDB913]">Terms of Service</span>.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Navigation buttons ── */}
              <div className={`flex gap-3 mt-8 ${step > 1 ? "justify-between" : "justify-end"}`}>
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={back}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white bg-transparent"
                    disabled={isLoading}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                )}

                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={next}
                    className="bg-[#FDB913] hover:bg-[#e5a811] text-black font-semibold ml-auto"
                  >
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-[#FDB913] hover:bg-[#e5a811] text-black font-bold px-8"
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
                        Send e-Transfer
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* ── Right column: summary ── */}
          <div className="hidden lg:block">
            <SummaryPanel form={formData} step={step} />
          </div>
        </div>
      </main>

      {/* ── Mobile sticky bottom bar ── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-zinc-950/95 backdrop-blur-sm border-t border-zinc-800 px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Sending</p>
          <p className={`text-lg font-bold leading-none mt-0.5 ${parseFloat(formData.amount) > 0 ? "text-[#FDB913]" : "text-zinc-600"}`}>
            {parseFloat(formData.amount) > 0 ? formatCurrency(formData.amount) : "$0.00"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={back}
              disabled={isLoading}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent h-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}
          {step < 4 ? (
            <Button
              type="button"
              size="sm"
              onClick={next}
              className="bg-[#FDB913] hover:bg-[#e5a811] text-black font-semibold h-10 px-5"
            >
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-[#FDB913] hover:bg-[#e5a811] text-black font-bold h-10 px-5"
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

      {/* Spacer so content isn't hidden behind mobile bar */}
      <div className="lg:hidden h-20" />
    </div>
  )
}
