"use client"

import type React from "react"
import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { useAuth } from "@/lib/auth/context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Wallet,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// ─── Ledger constants ─────────────────────────────────────────────────────────
const CHECKING_USD = 7_000_000
const SAVINGS_USD = 14_250_000
const RELOAD_THRESHOLD = 0.2
const THRESHOLD_USD = CHECKING_USD * RELOAD_THRESHOLD

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  recipient: string
  recipientName: string
  amount: string
  message: string
  fromAccount: string
  securityQuestion: string
  securityAnswer: string
}

interface RecentContact {
  name: string
  email: string
  initials: string
  color: string
  lastAmount: string
}

// ─── Constants ────────────────────────────────────────────────────────────────
const RECENT_CONTACTS: RecentContact[] = [
  { name: "Michael Dunagan",  email: "d45james@gmail.com",        initials: "MD", color: "#0369a1", lastAmount: "$100,000" },
  { name: "Limited VERSE",    email: "limitedverse@gmail.com",    initials: "LV", color: "#7c3aed", lastAmount: "$1,000"   },
  { name: "Nick St-Pierre",   email: "nickst-pierre@hotmail.com", initials: "NS", color: "#059669", lastAmount: "$2,100"   },
  { name: "Richard Madokoro", email: "richard93610@gmail.com",    initials: "RM", color: "#be123c", lastAmount: "$100,000" },
]

const QUICK_AMOUNTS = ["250", "500", "1000", "5000", "10000", "100000"]

const STEPS = [
  { id: 1, label: "Recipient", icon: User       },
  { id: 2, label: "Amount",    icon: DollarSign  },
  { id: 3, label: "Security",  icon: Shield      },
  { id: 4, label: "Review",    icon: FileText    },
]

const SECURITY_QUESTIONS = [
  "What is the name of your first pet?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was the name of your elementary school?",
  "What is your oldest sibling's middle name?",
  "What street did you grow up on?",
  "What was the make of your first car?",
  "What is your favorite sports team?",
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtUSD(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n)
}
function fmtCompact(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`
  return fmtUSD(n)
}
function fmtCurrency(val: string | number) {
  const n = typeof val === "string" ? parseFloat(val) : val
  if (isNaN(n)) return "$0.00"
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
}

// ─── Stepper ──────────────────────────────────────────────────────────────────
function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 w-full" role="list" aria-label="Transfer steps">
      {STEPS.map((step, idx) => {
        const done   = current > step.id
        const active = current === step.id
        const Icon   = step.icon
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none" role="listitem">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D1ED4] ${
                  done   ? "bg-[#6D1ED4] border-[#6D1ED4] shadow-[0_0_12px_rgba(109,30,212,0.4)]"
                  : active ? "bg-[#0B0B0F] border-[#6D1ED4]"
                  :          "bg-[#0B0B0F] border-[#2a2a35]"
                }`}
                aria-current={active ? "step" : undefined}
              >
                {done
                  ? <CheckCircle2 className="w-4 h-4 text-white" />
                  : <Icon className={`w-4 h-4 ${active ? "text-[#6D1ED4]" : "text-[#3a3a50]"}`} />
                }
              </div>
              <span className={`text-[11px] font-semibold tracking-wide whitespace-nowrap ${
                active ? "text-[#6D1ED4]" : done ? "text-zinc-400" : "text-[#3a3a50]"
              }`}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className="flex-1 mx-3 mb-6">
                <div className="h-px bg-[#1e1e2a] overflow-hidden rounded-full">
                  <div
                    className="h-full bg-[#6D1ED4] transition-all duration-500 rounded-full"
                    style={{ width: current > step.id ? "100%" : "0%" }}
                  />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Contact Card ─────────────────────────────────────────────────────────────
function ContactCard({
  contact,
  selected,
  onClick,
}: {
  contact: RecentContact
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-200 text-left w-full min-h-[64px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D1ED4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] ${
        selected
          ? "border-[#6D1ED4]/70 bg-[#6D1ED4]/10 shadow-[0_0_20px_rgba(109,30,212,0.15)]"
          : "border-[#1e1e2a] bg-[#12121A] hover:border-[#2e2e42] hover:bg-[#161622]"
      }`}
      aria-pressed={selected}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-md"
        style={{ backgroundColor: contact.color }}
      >
        {contact.initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold truncate leading-tight ${selected ? "text-white" : "text-zinc-200"}`}>
          {contact.name}
        </p>
        <p className="text-[11px] text-zinc-500 truncate mt-0.5">{contact.lastAmount} last</p>
      </div>
      {selected && (
        <CheckCircle2 className="w-4 h-4 text-[#6D1ED4] shrink-0" />
      )}
    </button>
  )
}

// ─── Account Card ─────────────────────────────────────────────────────────────
function AccountCard({
  type,
  label,
  mask,
  balance,
  selected,
  locked,
  onClick,
}: {
  type: "checking" | "savings"
  label: string
  mask: string
  balance: string
  selected: boolean
  locked?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locked}
      className={`relative flex flex-col items-start gap-1.5 px-4 py-4 rounded-2xl border transition-all duration-200 text-left w-full min-h-[88px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D1ED4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] disabled:opacity-60 disabled:cursor-not-allowed ${
        selected
          ? "border-[#6D1ED4]/70 bg-[#6D1ED4]/10 shadow-[0_0_20px_rgba(109,30,212,0.12)]"
          : "border-[#1e1e2a] bg-[#12121A] hover:border-[#2e2e42]"
      }`}
      aria-pressed={selected}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {locked
            ? <Lock className="w-3.5 h-3.5 text-zinc-600" />
            : <Wallet className={`w-3.5 h-3.5 ${selected ? "text-[#6D1ED4]" : "text-zinc-500"}`} />
          }
          <span className={`text-sm font-bold ${selected ? "text-white" : "text-zinc-300"}`}>{label}</span>
        </div>
        {selected && !locked && (
          <div className="w-2 h-2 rounded-full bg-[#6D1ED4]" />
        )}
        {locked && (
          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest border border-[#2a2a35] px-1.5 py-0.5 rounded-full">
            Reserve
          </span>
        )}
      </div>
      <span className="text-[11px] font-mono text-zinc-600">{mask}</span>
      <span className={`text-base font-bold tabular-nums ${selected ? "text-[#6D1ED4]" : "text-zinc-200"}`}>
        {balance}
      </span>
    </button>
  )
}

// ─── Summary Sidebar ──────────────────────────────────────────────────────────
function SummaryPanel({ form, step }: { form: FormData; step: number }) {
  const transferAmt       = parseFloat(form.amount) || 0
  const hasRecipient      = form.recipient.trim().length > 0
  const postChecking      = Math.max(CHECKING_USD - transferAmt, 0)
  const postBarPct        = Math.max((postChecking / CHECKING_USD) * 100, 0)
  const willTriggerReload = postChecking <= THRESHOLD_USD
  const shortfall         = Math.max(THRESHOLD_USD - postChecking, 0)
  const lastUnlockAmt     = 1_963_495

  return (
    <aside className="flex flex-col gap-4 h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>

      {/* ── Transfer Summary ── */}
      <div className="rounded-2xl border border-[#1e1e2a] bg-[#12121A] overflow-hidden">
        <div className="h-0.5 bg-[#6D1ED4]" />
        <div className="p-5">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-7 h-7 rounded-lg bg-[#6D1ED4]/15 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-[#6D1ED4]" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-white leading-none">Transfer Summary</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">Live preview</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-zinc-500">Live</span>
            </div>
          </div>

          {/* Amount spotlight */}
          <div className="rounded-xl bg-[#0B0B0F] border border-[#1e1e2a] p-4 text-center mb-5">
            <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-2">Total Sending</p>
            <p className={`text-3xl font-bold tabular-nums transition-all duration-300 ${transferAmt > 0 ? "text-[#6D1ED4]" : "text-[#2a2a35]"}`}>
              {transferAmt > 0 ? fmtCurrency(transferAmt) : "$0.00"}
            </p>
            <p className="text-[10px] text-zinc-700 mt-1.5">USD &middot; No Zelle Fee</p>
          </div>

          {/* Detail rows */}
          <div className="space-y-3 mb-5">
            {[
              { label: "To",    value: hasRecipient ? (form.recipientName || form.recipient) : null },
              { label: "Email", value: form.recipient || null },
              { label: "From",  value: form.fromAccount === "checking" ? "Checking ••••4521" : "Savings ••••7893" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-[11px] text-zinc-600">{label}</span>
                <span className="text-[11px] font-medium text-right max-w-[160px] truncate text-zinc-300">
                  {value ?? <span className="text-[#2a2a35]">—</span>}
                </span>
              </div>
            ))}
            {form.message && (
              <div className="pt-3 border-t border-[#1a1a26]">
                <p className="text-[10px] text-zinc-600 mb-1">Message</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">{form.message}</p>
              </div>
            )}
          </div>

          {/* Step progress */}
          <div>
            <div className="flex justify-between text-[10px] mb-2">
              <span className="text-zinc-600">Progress</span>
              <span className="text-zinc-400 font-semibold">Step {step} / {STEPS.length}</span>
            </div>
            <div className="h-1.5 bg-[#0B0B0F] rounded-full overflow-hidden border border-[#1e1e2a]">
              <div
                className="h-full bg-[#6D1ED4] rounded-full transition-all duration-500"
                style={{ width: `${(step / STEPS.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {STEPS.map((s) => (
                <span key={s.id} className={`text-[9px] font-semibold uppercase tracking-widest ${step >= s.id ? "text-[#6D1ED4]" : "text-[#2a2a35]"}`}>
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Checking Ledger ── */}
      <div className={`rounded-2xl border overflow-hidden transition-all duration-500 ${
        willTriggerReload && transferAmt > 0
          ? "border-amber-500/30 bg-amber-950/10"
          : "border-[#1e1e2a] bg-[#12121A]"
      }`}>
        <div className={`h-0.5 ${willTriggerReload && transferAmt > 0 ? "bg-amber-500" : "bg-[#6D1ED4]/50"}`} />
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#6D1ED4]/15 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-[#6D1ED4]" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-zinc-300 leading-none">Checking Ledger</p>
                <p className="text-[9px] text-zinc-600 mt-0.5">Zelle Network &middot; Active</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] text-zinc-500">Live</span>
            </div>
          </div>

          <p className="text-[9px] text-zinc-700 uppercase tracking-widest mb-0.5">Current Balance</p>
          <p className="text-2xl font-bold text-white tabular-nums">{fmtCompact(CHECKING_USD)}</p>
          <p className="text-[10px] text-zinc-600 mt-0.5 mb-4">{fmtUSD(CHECKING_USD)} &middot; FDIC Insured</p>

          {transferAmt > 0 ? (
            <div className={`rounded-xl border p-3.5 transition-all duration-300 ${
              willTriggerReload ? "bg-amber-500/10 border-amber-500/25" : "bg-[#0B0B0F] border-[#1e1e2a]"
            }`}>
              <div className="flex items-center gap-1.5 mb-3">
                <ArrowDown className={`w-3 h-3 ${willTriggerReload ? "text-amber-400" : "text-zinc-600"}`} />
                <p className={`text-[10px] font-semibold uppercase tracking-widest ${willTriggerReload ? "text-amber-400" : "text-zinc-600"}`}>
                  After Transfer
                </p>
              </div>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className={`text-lg font-bold tabular-nums ${willTriggerReload ? "text-amber-300" : "text-zinc-200"}`}>
                    {fmtCompact(postChecking)}
                  </p>
                  <p className="text-[9px] text-zinc-700">{fmtUSD(postChecking)}</p>
                </div>
                <div className="text-right">
                  <p className={`text-[11px] font-semibold tabular-nums ${willTriggerReload ? "text-amber-400" : "text-zinc-500"}`}>
                    -{fmtCurrency(transferAmt)}
                  </p>
                  <p className="text-[9px] text-zinc-700">{postBarPct.toFixed(1)}% remaining</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-2 bg-[#0B0B0F] rounded-full overflow-hidden relative border border-[#1e1e2a]">
                  <div className="absolute inset-0 bg-[#6D1ED4]/10 rounded-full" />
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${willTriggerReload ? "bg-amber-500" : "bg-[#6D1ED4]"}`}
                    style={{ width: `${Math.max(postBarPct, 0.5)}%` }}
                  />
                </div>
                <div className="relative h-3">
                  <div className="absolute top-0 w-px h-1.5 bg-[#3a3a50]" style={{ left: "20%" }} />
                  <span className="absolute text-[8px] text-zinc-700 -translate-x-1/2" style={{ left: "20%", top: "8px" }}>
                    20% reload
                  </span>
                </div>
              </div>
              {willTriggerReload && (
                <div className="mt-3 flex items-start gap-1.5 p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/20">
                  <RefreshCw className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-amber-300 leading-snug">
                    Auto-reload from Savings will trigger.
                    {shortfall > 0 && (
                      <span className="block text-amber-400/80 mt-0.5">Shortfall: {fmtUSD(shortfall)}</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-[9px] mb-1.5">
                <span className="text-zinc-700 uppercase tracking-widest">Balance Level</span>
                <span className="text-zinc-500 font-semibold">100.0%</span>
              </div>
              <div className="h-1.5 bg-[#0B0B0F] rounded-full overflow-hidden border border-[#1e1e2a]">
                <div className="h-full bg-[#6D1ED4] rounded-full w-full" />
              </div>
              <div className="relative h-3 mt-1">
                <div className="absolute top-0 w-px h-1.5 bg-[#3a3a50]" style={{ left: "20%" }} />
                <span className="absolute text-[8px] text-zinc-700 -translate-x-1/2" style={{ left: "20%", top: "8px" }}>20%</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1.5 pt-3 mt-3 border-t border-[#1a1a26]">
            <Building2 className="w-2.5 h-2.5 text-zinc-700" />
            <span className="text-[9px] text-zinc-700">Zelle Network &middot; Instant USD</span>
          </div>
        </div>
      </div>

      {/* ── Savings Ledger ── */}
      <div className="rounded-2xl border border-[#1e1e2a] bg-[#12121A] overflow-hidden">
        <div className="h-0.5 bg-[#2a2a35]" />
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#1e1e2a] flex items-center justify-center">
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-zinc-300 leading-none">Savings Ledger</p>
                <p className="text-[9px] text-zinc-600 mt-0.5">Blockchain &middot; Reserve</p>
              </div>
            </div>
            <span className="text-[9px] font-bold text-zinc-600 border border-[#2a2a35] px-2 py-0.5 rounded-full uppercase tracking-widest">
              Locked
            </span>
          </div>

          <p className="text-[9px] text-zinc-700 uppercase tracking-widest mb-0.5">Reserve Balance</p>
          <p className="text-2xl font-bold text-zinc-300 tabular-nums">{fmtCompact(SAVINGS_USD)}</p>
          <p className="text-[10px] text-zinc-600 mt-0.5 mb-4">${SAVINGS_USD.toLocaleString()} USD</p>

          <div className="rounded-xl bg-[#0B0B0F] border border-[#1e1e2a] p-3.5 mb-3">
            <div className="flex items-center gap-1.5 mb-3">
              <RefreshCw className="w-3 h-3 text-zinc-600" />
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Auto-Reload</p>
            </div>
            <div className="space-y-2">
              {[
                { l: "Triggers below", v: fmtCompact(THRESHOLD_USD) },
                { l: "Threshold",      v: "20% of Checking"         },
                { l: "Reload amount",  v: fmtCompact(lastUnlockAmt) },
              ].map(({ l, v }) => (
                <div key={l} className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-600">{l}</span>
                  <span className="text-[11px] font-bold text-zinc-400 tabular-nums">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-[#0B0B0F] border border-[#1e1e2a] p-3.5">
            <div className="flex items-center gap-1.5 mb-3">
              <TrendingUp className="w-3 h-3 text-zinc-600" />
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Reload Metrics</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { l: "Total Reloads", v: "3" },
                { l: "Last Reload",   v: fmtCompact(lastUnlockAmt) },
                { l: "Savings Used",  v: fmtCompact(3 * lastUnlockAmt) },
                { l: "Remaining",     v: fmtCompact(SAVINGS_USD) },
              ].map(({ l, v }) => (
                <div key={l}>
                  <p className="text-[9px] text-zinc-700 uppercase tracking-widest">{l}</p>
                  <p className="text-[12px] font-bold text-zinc-300 tabular-nums">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2.5 rounded-lg bg-[#12121A] border border-[#1e1e2a] flex items-start gap-1.5">
              <Info className="w-3 h-3 text-zinc-700 mt-0.5 shrink-0" />
              <p className="text-[9px] text-zinc-700 leading-relaxed">
                Savings auto-reload when Checking drops below {fmtCompact(THRESHOLD_USD)}.
                {willTriggerReload && transferAmt > 0 && (
                  <span className="text-amber-500 font-semibold"> This transfer will trigger a reload.</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Security badges ── */}
      <div className="rounded-2xl border border-[#1e1e2a] bg-[#12121A] p-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Zap,    label: "Instant",   sub: "Delivery",   color: "text-[#6D1ED4]", bg: "bg-[#6D1ED4]/10" },
            { icon: Clock,  label: "24/7",      sub: "Available",  color: "text-zinc-500",  bg: "bg-[#1e1e2a]"   },
            { icon: Shield, label: "256-bit",   sub: "Encrypted",  color: "text-emerald-500", bg: "bg-emerald-950/40" },
          ].map(({ icon: Icon, label, sub, color, bg }) => (
            <div key={label} className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl ${bg}`}>
              <Icon className={`w-4 h-4 ${color}`} />
              <p className="text-[10px] font-bold text-zinc-300 leading-none">{label}</p>
              <p className="text-[9px] text-zinc-600">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SendTransferPage() {
  const router = useRouter()
  const { user, getAuthHeaders } = useAuth()
  const [step, setStep]                     = useState(1)
  const [showAnswer, setShowAnswer]         = useState(false)
  const [formData, setFormData]             = useState<FormData>({
    fromAccount:      "checking",
    recipient:        "",
    recipientName:    "",
    amount:           "",
    message:          "",
    securityQuestion: "",
    securityAnswer:   "",
  })
  const [isLoading, setIsLoading]           = useState(false)
  const [error, setError]                   = useState("")
  const [transferId, setTransferId]         = useState("")
  const [transferTimestamp, setTransferTimestamp] = useState("")
  const [copied, setCopied]                 = useState(false)
  const [copiedAdmin, setCopiedAdmin]       = useState(false)
  const [copiedClient, setCopiedClient]     = useState(false)
  const [countdown, setCountdown]           = useState(5)
  const [stepError, setStepError]           = useState("")
  const [reviewBanner, setReviewBanner]     = useState<string | null>(null)
  const prefillDone = useRef(false)

  useEffect(() => {
    if (prefillDone.current) return
    const params   = new URLSearchParams(window.location.search)
    const reviewId = params.get("review")
    const token    = params.get("token")
    if (!reviewId) return
    prefillDone.current = true
    fetch(`/api/transfer/${encodeURIComponent(reviewId)}?token=${encodeURIComponent(token || "")}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data?.transfer) return
        const t = data.transfer
        setFormData((prev) => ({
          ...prev,
          recipient:     t.recipient_email_masked ?? prev.recipient,
          recipientName: t.recipient_name         ?? prev.recipientName,
          amount:        String(t.amount)          ?? prev.amount,
          message:       t.message                ?? prev.message,
        }))
        setReviewBanner(t.transfer_id)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (transferId && transferTimestamp) {
      const clientUrl = `/deposit-portal?transferId=${transferId}&amount=${formData.amount}&recipient=${encodeURIComponent(formData.recipient)}&recipientName=${encodeURIComponent(formData.recipientName || formData.recipient)}&bankName=Banking+System&message=${encodeURIComponent(formData.message)}&timestamp=${transferTimestamp}`
      const t = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) { clearInterval(t); router.push(clientUrl); return 0 }
          return c - 1
        })
      }, 1000)
      return () => clearInterval(t)
    }
  }, [transferId, transferTimestamp, formData, router])

  const set = useCallback((field: keyof FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value })), [])

  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/
  const isEmailValid     = (email: string) => EMAIL_REGEX.test(email.trim())
  const recipientTouched = useMemo(() => formData.recipient.length > 0, [formData.recipient])
  const recipientInvalid = useMemo(
    () => recipientTouched && !isEmailValid(formData.recipient),
    [recipientTouched, formData.recipient],
  )

  const validateStep = (): boolean => {
    setStepError("")
    if (step === 1) {
      if (!formData.recipient.trim())       { setStepError("Recipient email is required."); return false }
      if (!isEmailValid(formData.recipient)){ setStepError("Please enter a valid email address."); return false }
    }
    if (step === 2) {
      const amt = parseFloat(formData.amount)
      if (!formData.amount || isNaN(amt) || amt <= 0) { setStepError("Please enter a valid amount greater than $0."); return false }
      if (amt > 100000)                                { setStepError("Single transfer limit is $100,000 USD."); return false }
    }
    if (step === 3) {
      if (!formData.securityQuestion) { setStepError("Please select a security question."); return false }
      if (!formData.securityAnswer.trim()) { setStepError("Please enter an answer to the security question."); return false }
    }
    return true
  }

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length)) }
  const back = () => { setStepError(""); setStep((s) => Math.max(s - 1, 1)) }

  const copyTransferId = () => {
    navigator.clipboard.writeText(transferId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async () => {
    if (!validateStep()) return
    if (!user) { setError("Not authenticated. Please log in first."); return }
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("/api/send-zelle", {
        method:  "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body:    JSON.stringify({
          recipientEmail: formData.recipient,
          recipientName:  formData.recipientName || formData.recipient,
          amount:         formData.amount,
          message:        formData.message,
          templateId:     "transfer-received",
          language:       "en",
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

  // ── Keyboard nav ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return
      if (e.key === "ArrowRight" && step < STEPS.length) next()
      if (e.key === "ArrowLeft"  && step > 1)            back()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [step, formData])

  // ── Success state ─────────────────────────────────────────────────────────────
  if (transferId) {
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
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center px-4 font-sans">
        <div className="w-full max-w-md space-y-5 text-center">
          {/* Icon ring */}
          <div className="relative flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-[#6D1ED4]/10 border-2 border-[#6D1ED4]/30 flex items-center justify-center animate-pulse">
              <div className="w-20 h-20 rounded-full bg-[#6D1ED4]/20 border-2 border-[#6D1ED4]/50 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-[#6D1ED4]" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Transfer Sent!</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {fmtCurrency(formData.amount)} sent to{" "}
              <span className="text-white font-medium">{formData.recipientName || formData.recipient}</span>.
            </p>
          </div>
          <div className="rounded-2xl border border-[#1e1e2a] bg-[#12121A] p-4">
            <p className="text-[10px] text-zinc-600 mb-2 uppercase tracking-widest">Transfer ID</p>
            <div className="flex items-center justify-between gap-3">
              <code className="text-sm font-mono text-[#6D1ED4]">{transferId}</code>
              <button onClick={copyTransferId} className="p-1.5 rounded-md bg-[#1e1e2a] hover:bg-[#2a2a35] transition-colors" aria-label="Copy transfer ID">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Amount", value: fmtCurrency(formData.amount) },
              { label: "To",     value: (formData.recipientName || formData.recipient).split(" ")[0] || "Recipient" },
              { label: "Status", value: "Delivered" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl border border-[#1e1e2a] bg-[#12121A] p-3">
                <p className="text-[10px] text-zinc-600 mb-1 uppercase tracking-wider">{label}</p>
                <p className="text-xs font-semibold text-white truncate">{value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-left">
            {/* Admin link */}
            <div className="rounded-2xl border border-[#6D1ED4]/25 bg-[#6D1ED4]/5 p-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-[#6D1ED4]" />
                  <span className="text-[10px] font-bold text-[#6D1ED4] uppercase tracking-widest">Admin Portal</span>
                </div>
                <span className="text-[9px] bg-[#6D1ED4]/15 text-[#6D1ED4] border border-[#6D1ED4]/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">Internal</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 min-w-0 text-[11px] font-mono text-zinc-400 truncate bg-black/30 px-2.5 py-1.5 rounded-lg border border-[#1e1e2a]">
                  /deposit-portal/admin?transferId={transferId}&hellip;
                </code>
                <button onClick={() => copyLink(adminUrl, "admin")} className="shrink-0 p-2 rounded-lg bg-[#1e1e2a] hover:bg-[#2a2a35] transition-colors" aria-label="Copy admin link">
                  {copiedAdmin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                </button>
                <Link href={adminUrl} target="_blank" className="shrink-0 p-2 rounded-lg bg-[#1e1e2a] hover:bg-[#2a2a35] transition-colors" aria-label="Open admin portal">
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                </Link>
              </div>
            </div>
            {/* Client link */}
            <div className="rounded-2xl border border-[#1e1e2a] bg-[#12121A] p-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Client Portal</span>
                </div>
                <span className="text-[9px] bg-[#1e1e2a] text-zinc-500 border border-[#2a2a35] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">Recipient</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 min-w-0 text-[11px] font-mono text-zinc-400 truncate bg-black/30 px-2.5 py-1.5 rounded-lg border border-[#1e1e2a]">
                  /deposit-portal?transferId={transferId}&hellip;
                </code>
                <button onClick={() => copyLink(clientUrl, "client")} className="shrink-0 p-2 rounded-lg bg-[#1e1e2a] hover:bg-[#2a2a35] transition-colors" aria-label="Copy client link">
                  {copiedClient ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                </button>
                <Link href={clientUrl} target="_blank" className="shrink-0 p-2 rounded-lg bg-[#1e1e2a] hover:bg-[#2a2a35] transition-colors" aria-label="Open client portal">
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                </Link>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-zinc-600 text-center">
                Redirecting in <span className="text-[#6D1ED4] font-semibold">{countdown}s</span>…
              </p>
              <div className="h-1 bg-[#1e1e2a] rounded-full overflow-hidden">
                <div className="h-full bg-[#6D1ED4] rounded-full transition-all duration-1000" style={{ width: `${((5 - countdown) / 5) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Main layout ───────────────────────────────────────────────────────────────
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0B0B0F] font-sans flex flex-col">

      {/* ── Top header bar ── */}
      <header className="shrink-0 h-14 flex items-center justify-between px-6 border-b border-[#1a1a26] bg-[#0B0B0F] z-10">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl overflow-hidden shadow-md shadow-[#6D1ED4]/30">
            <img src="/zelle-logo.webp" alt="Zelle" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-white leading-none">Zelle</p>
            <p className="text-[10px] text-zinc-600 leading-none mt-0.5 hidden sm:block">Secure Payment Services</p>
          </div>
        </Link>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] hidden sm:flex">
          <Link href="/dashboard" className="text-zinc-600 hover:text-zinc-300 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3 text-zinc-700" />
          <span className="text-zinc-300 font-medium">Send e-Transfer</span>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-white transition-colors px-3 py-1.5 rounded-xl hover:bg-[#1a1a26]"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Back</span>
        </Link>
      </header>

      {/* ── Body (fills remaining viewport) ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Left panel (70%) ── */}
        <main
          className="flex-[7] flex flex-col overflow-hidden border-r border-[#1a1a26]"
          role="main"
        >
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-10 lg:py-8" style={{ scrollbarWidth: "thin", scrollbarColor: "#1e1e2a transparent" }}>

            {/* Page title */}
            <div className="mb-8">
              <h1 className="text-[26px] font-bold text-white leading-none mb-1.5 text-balance">Send e-Transfer</h1>
              <p className="text-[13px] text-zinc-500">Send money instantly to anyone in the US. Use keyboard arrows to navigate steps.</p>
            </div>

            {/* Review banner */}
            {reviewBanner && (
              <div className="mb-6 flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-[#6D1ED4]/10 border border-[#6D1ED4]/25">
                <RefreshCw className="w-4 h-4 text-[#6D1ED4] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[13px] text-[#A87EE8] font-semibold leading-snug">
                    Reviewing transfer <code className="font-mono text-[#6D1ED4]">{reviewBanner}</code>
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Form pre-filled from original transfer. Confirm and resend.</p>
                </div>
              </div>
            )}

            {/* Stepper */}
            <div className="mb-8">
              <Stepper current={step} />
            </div>

            {/* Errors */}
            {stepError && (
              <div className="mb-5 flex items-start gap-2.5 px-4 py-3.5 rounded-2xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-[13px] text-red-300 leading-snug">{stepError}</p>
              </div>
            )}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 px-4 py-3.5 rounded-2xl bg-red-500/10 border border-red-500/20" role="alert">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-[13px] text-red-300 leading-snug">{error}</p>
              </div>
            )}

            {/* Step content card */}
            <div className="rounded-2xl border border-[#1e1e2a] bg-[#12121A] p-6 lg:p-8 mb-6">

              {/* ── Step 1: Recipient ── */}
              {step === 1 && (
                <div className="space-y-7">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1.5">Who are you sending to?</h2>
                    <p className="text-[13px] text-zinc-500">Select a recent contact or enter an email address below.</p>
                  </div>

                  {/* Recent contacts */}
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">Recent Contacts</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {RECENT_CONTACTS.map((c) => (
                        <ContactCard
                          key={c.email}
                          contact={c}
                          selected={formData.recipient === c.email}
                          onClick={() => { set("recipient", c.email); set("recipientName", c.name) }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-[#1e1e2a]" />
                    <span className="text-[11px] text-zinc-600 font-medium">or enter manually</span>
                    <div className="flex-1 h-px bg-[#1e1e2a]" />
                  </div>

                  <div className="space-y-4">
                    {/* Email field */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="recipient" className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        {recipientTouched && (
                          recipientInvalid
                            ? <span className="flex items-center gap-1 text-[10px] text-red-400"><XCircle className="w-3 h-3" />Invalid</span>
                            : <span className="flex items-center gap-1 text-[10px] text-emerald-400"><CheckCircle2 className="w-3 h-3" />Valid</span>
                        )}
                      </div>
                      <Input
                        id="recipient"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.recipient}
                        onChange={(e) => set("recipient", e.target.value.trim())}
                        className={`h-11 bg-[#0B0B0F] text-white placeholder:text-zinc-700 border transition-colors rounded-xl ${
                          recipientInvalid
                            ? "border-red-500/50 focus:border-red-500"
                            : recipientTouched
                            ? "border-emerald-500/40 focus:border-emerald-500"
                            : "border-[#2a2a35] focus:border-[#6D1ED4]"
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
                    </div>

                    {/* Name field */}
                    <div>
                      <label htmlFor="recipientName" className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2 block">
                        Recipient Name <span className="text-zinc-700 font-normal normal-case">(optional)</span>
                      </label>
                      <Input
                        id="recipientName"
                        type="text"
                        placeholder="Full name"
                        value={formData.recipientName}
                        onChange={(e) => set("recipientName", e.target.value)}
                        className="h-11 bg-[#0B0B0F] border-[#2a2a35] text-white placeholder:text-zinc-700 focus:border-[#6D1ED4] rounded-xl"
                        autoComplete="name"
                      />
                    </div>

                    {/* Account selection */}
                    <div>
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2.5 block">
                        From Account
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <AccountCard
                          type="checking"
                          label="Checking"
                          mask="••••4521"
                          balance={fmtCompact(CHECKING_USD)}
                          selected={formData.fromAccount === "checking"}
                          onClick={() => set("fromAccount", "checking")}
                        />
                        <AccountCard
                          type="savings"
                          label="Savings"
                          mask="••••7893"
                          balance={fmtCompact(SAVINGS_USD)}
                          selected={formData.fromAccount === "savings"}
                          locked
                          onClick={() => {}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: Amount ── */}
              {step === 2 && (
                <div className="space-y-7">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1.5">How much are you sending?</h2>
                    <p className="text-[13px] text-zinc-500">Maximum single transfer: $100,000 USD. No fees.</p>
                  </div>

                  {/* Mobile balance preview */}
                  <div className="lg:hidden rounded-2xl border border-[#1e1e2a] bg-[#0B0B0F] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-[#6D1ED4]" />
                        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Checking Balance</span>
                      </div>
                      <span className="text-[10px] text-emerald-500">Available</span>
                    </div>
                    <p className="text-xl font-bold text-white tabular-nums">{fmtCompact(CHECKING_USD)}</p>
                    {parseFloat(formData.amount) > 0 && (
                      <div className="mt-2 pt-2 border-t border-[#1e1e2a]">
                        <div className="flex justify-between">
                          <span className="text-[10px] text-zinc-600">After transfer</span>
                          <span className={`text-[11px] font-bold tabular-nums ${CHECKING_USD - parseFloat(formData.amount) <= THRESHOLD_USD ? "text-amber-400" : "text-zinc-300"}`}>
                            {fmtCompact(Math.max(CHECKING_USD - parseFloat(formData.amount), 0))}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Daily limit bar */}
                  <div className="rounded-2xl border border-[#1e1e2a] bg-[#0B0B0F] p-4">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Daily Limit Used</span>
                      <span className="text-[10px] text-zinc-400 tabular-nums">
                        <span className="text-white font-bold">{fmtCurrency(formData.amount && !isNaN(parseFloat(formData.amount)) ? parseFloat(formData.amount) : 0)}</span>
                        {" "}<span className="text-zinc-600">of $100,000</span>
                      </span>
                    </div>
                    <div className="h-2 bg-[#12121A] rounded-full overflow-hidden border border-[#1e1e2a]">
                      <div
                        className="h-full bg-[#6D1ED4] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(((parseFloat(formData.amount) || 0) / 100000) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-zinc-700 mt-1.5">Resets at midnight &middot; No Zelle fee</p>
                  </div>

                  {/* Quick amounts */}
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">Quick Amount</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                      {QUICK_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => set("amount", amt)}
                          className={`py-3 rounded-xl text-[13px] font-semibold border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D1ED4] ${
                            formData.amount === amt
                              ? "bg-[#6D1ED4] border-[#6D1ED4] text-white shadow-[0_0_16px_rgba(109,30,212,0.35)]"
                              : "bg-[#0B0B0F] border-[#2a2a35] text-zinc-400 hover:border-[#3a3a50] hover:text-white"
                          }`}
                        >
                          {fmtCompact(parseFloat(amt))}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom amount */}
                  <div>
                    <label htmlFor="amount" className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2.5 block">
                      Amount (USD) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-semibold text-xl">$</span>
                      <Input
                        id="amount"
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, "").replace(/^(\d*\.?\d*).*$/, "$1")
                          set("amount", val)
                        }}
                        className="h-14 bg-[#0B0B0F] border-[#2a2a35] text-white placeholder:text-zinc-700 focus:border-[#6D1ED4] pl-10 text-2xl font-bold rounded-xl tabular-nums"
                      />
                    </div>
                    {formData.amount && !isNaN(parseFloat(formData.amount)) && (
                      <p className="text-[11px] text-zinc-600 mt-2">
                        Recipient receives:{" "}
                        <span className="text-[#6D1ED4] font-semibold">{fmtCurrency(formData.amount)}</span> (No fees)
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <label htmlFor="message" className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                        Message <span className="text-zinc-700 font-normal normal-case">(optional)</span>
                      </label>
                      <span className={`text-[11px] ${formData.message.length > 200 ? "text-red-400" : "text-zinc-700"}`}>
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
                      className="bg-[#0B0B0F] border-[#2a2a35] text-white placeholder:text-zinc-700 focus:border-[#6D1ED4] resize-none rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* ── Step 3: Security ── */}
              {step === 3 && (
                <div className="space-y-7">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1.5">Set a security question</h2>
                    <p className="text-[13px] text-zinc-500">The recipient must answer correctly to deposit the funds.</p>
                  </div>

                  <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-amber-500/8 border border-amber-500/20">
                    <Shield className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-[12px] text-amber-300 leading-relaxed">
                      Share your answer only through a secure channel — never by email or phone.
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">Select a Question</p>
                    <div
                      className="space-y-2 max-h-56 overflow-y-auto pr-1"
                      style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2a35 transparent" }}
                    >
                      {SECURITY_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => set("securityQuestion", q)}
                          className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all text-[13px] leading-snug focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D1ED4] ${
                            formData.securityQuestion === q
                              ? "border-[#6D1ED4]/70 bg-[#6D1ED4]/10 text-white"
                              : "border-[#2a2a35] bg-[#0B0B0F] text-zinc-500 hover:border-[#3a3a50] hover:text-zinc-300"
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="securityAnswer" className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2.5 block">
                      Your Answer <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="securityAnswer"
                        type={showAnswer ? "text" : "password"}
                        placeholder="Enter the answer"
                        value={formData.securityAnswer}
                        onChange={(e) => set("securityAnswer", e.target.value)}
                        className="h-11 bg-[#0B0B0F] border-[#2a2a35] text-white placeholder:text-zinc-700 focus:border-[#6D1ED4] pr-11 rounded-xl"
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAnswer((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
                        aria-label={showAnswer ? "Hide answer" : "Show answer"}
                      >
                        {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-zinc-700 mt-1.5">Answers are case-insensitive.</p>
                  </div>
                </div>
              )}

              {/* ── Step 4: Review ── */}
              {step === 4 && (
                <div className="space-y-7">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1.5">Review &amp; confirm</h2>
                    <p className="text-[13px] text-zinc-500">Double-check all details before sending the transfer.</p>
                  </div>

                  <div className="rounded-2xl border border-[#1e1e2a] bg-[#0B0B0F] overflow-hidden">
                    {[
                      { label: "From",        value: formData.fromAccount === "checking" ? "Checking ••••4521" : "Savings ••••7893", plain: true },
                      { label: "To",          value: formData.recipientName || formData.recipient, plain: true },
                      { label: "Email",       value: formData.recipient, plain: true },
                      { label: "Amount",      value: fmtCurrency(formData.amount), highlight: true },
                      { label: "Fee",         value: "Free", fee: true },
                      { label: "Security Q.", value: formData.securityQuestion, plain: true },
                      { label: "Answer",      value: formData.securityAnswer, masked: true },
                      ...(formData.message ? [{ label: "Message", value: formData.message, plain: true }] : []),
                    ].map(({ label, value, highlight, fee, masked, plain }: {
                      label: string; value: string;
                      highlight?: boolean; fee?: boolean; masked?: boolean; plain?: boolean
                    }) => (
                      <div key={label} className="flex justify-between items-start gap-4 px-5 py-3.5 border-b border-[#1a1a26] last:border-0">
                        <span className="text-[12px] text-zinc-600 shrink-0 w-24">{label}</span>
                        {fee ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            {value}
                          </span>
                        ) : masked ? (
                          <span className="flex items-center gap-1.5">
                            <span className="text-[12px] text-white font-medium font-mono tracking-widest">
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
                          <span className={`text-right break-words min-w-0 max-w-[55%] leading-snug ${highlight ? "text-[#6D1ED4] font-bold text-base" : "text-zinc-200 text-[12px] font-medium"}`}>
                            {value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-3.5 rounded-2xl bg-[#0B0B0F] border border-[#1e1e2a]">
                    <p className="text-[12px] text-zinc-600 leading-relaxed">
                      By clicking <strong className="text-zinc-300">Send Payment</strong>, you authorize Zelle to debit your account.
                      Transfers are subject to Zelle&apos;s{" "}
                      <span className="text-[#6D1ED4] cursor-pointer">Terms of Service</span>.
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
                    disabled={isLoading}
                    className="border-[#2a2a35] text-zinc-400 hover:text-white hover:bg-[#1e1e2a] bg-transparent h-11 px-5 rounded-xl"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                )}
                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={next}
                    className="bg-[#6D1ED4] hover:bg-[#5A18B0] text-white font-semibold h-11 px-6 rounded-xl shadow-[0_4px_20px_rgba(109,30,212,0.35)] ml-auto"
                  >
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-[#6D1ED4] hover:bg-[#5A18B0] text-white font-bold h-12 px-8 rounded-xl shadow-[0_4px_24px_rgba(109,30,212,0.4)] text-[14px]"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" /> Send e&#8209;Transfer
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* ── Mobile sticky bottom bar ── */}
          <div
            className="lg:hidden shrink-0 flex items-center justify-between gap-3 border-t border-[#1a1a26] bg-[#0B0B0F] px-4"
            style={{ paddingTop: 12, paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}
          >
            <div className="min-w-0">
              <p className="text-[9px] text-zinc-600 uppercase tracking-widest leading-none mb-1">Sending</p>
              <p className={`text-base font-bold leading-none tabular-nums ${parseFloat(formData.amount) > 0 ? "text-[#6D1ED4]" : "text-zinc-700"}`}>
                {parseFloat(formData.amount) > 0 ? fmtCurrency(formData.amount) : "$0.00"}
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
                  className="border-[#2a2a35] text-zinc-400 hover:bg-[#1e1e2a] bg-transparent h-10 w-10 p-0 rounded-xl"
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
                  className="bg-[#6D1ED4] hover:bg-[#5A18B0] text-white font-semibold h-10 px-5 rounded-xl"
                >
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-[#6D1ED4] hover:bg-[#5A18B0] text-white font-bold h-10 px-5 rounded-xl"
                >
                  {isLoading
                    ? <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</span>
                    : <span className="flex items-center gap-2"><Send className="w-3.5 h-3.5" />Send</span>
                  }
                </Button>
              )}
            </div>
          </div>
        </main>

        {/* ── Right panel (30%) ── */}
        <aside className="hidden lg:flex flex-[3] flex-col overflow-hidden bg-[#0D0D13]">
          <div
            className="flex-1 overflow-y-auto px-6 py-6"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#1e1e2a transparent" }}
          >
            <SummaryPanel form={formData} step={step} />
          </div>
        </aside>
      </div>
    </div>
  )
}
