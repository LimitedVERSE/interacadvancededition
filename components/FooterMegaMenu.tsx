"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  SendIcon,
  DollarSign,
  CreditCard,
  History,
  Users,
  FileText,
  Bell,
  ShieldCheck,
  BarChart3,
  Mail,
  Settings,
  X,
  Grid3x3,
  ChevronUp,
  Banknote,
  ArrowUpRight,
  Landmark,
  ClipboardList,
  Search,
} from "lucide-react"

// ─── Service catalogue ───────────────────────────────────────────────────────
const CATEGORIES = ["All", "Payments", "Accounts", "Reports", "Tools"] as const
type Category = (typeof CATEGORIES)[number]

const SERVICES: {
  id: string
  title: string
  description: string
  icon: React.ElementType
  href: string
  category: Category
  accent: string
  bg: string
  featured?: boolean
}[] = [
  {
    id: "send",
    title: "Send Payment",
    description: "Send funds to any recipient instantly via Zelle",
    icon: SendIcon,
    href: "/send",
    category: "Payments",
    accent: "text-blue-400",
    bg: "bg-blue-500/10 group-hover:bg-blue-500/20",
    featured: true,
  },
  {
    id: "deposit",
    title: "Receive Funds",
    description: "Accept and deposit incoming Zelle payments",
    icon: DollarSign,
    href: "/deposit-portal",
    category: "Payments",
    accent: "text-green-400",
    bg: "bg-green-500/10 group-hover:bg-green-500/20",
    featured: true,
  },
  {
    id: "bank-connect",
    title: "Link Bank Account",
    description: "Connect a US financial institution for Zelle transfers",
    icon: CreditCard,
    href: "/connect-bank",
    category: "Accounts",
    accent: "text-purple-400",
    bg: "bg-purple-500/10 group-hover:bg-purple-500/20",
  },
  {
    id: "history",
    title: "Transaction History",
    description: "Review past transfers, deposits and ledger activity",
    icon: History,
    href: "/history",
    category: "Reports",
    accent: "text-orange-400",
    bg: "bg-orange-500/10 group-hover:bg-orange-500/20",
  },
  {
    id: "recipients",
    title: "Contacts & Recipients",
    description: "Manage saved contacts for quick Zelle payments",
    icon: Users,
    href: "/recipients",
    category: "Accounts",
    accent: "text-cyan-400",
    bg: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
  },
  {
    id: "reports",
    title: "Statements & Reports",
    description: "Download and review detailed account statements",
    icon: FileText,
    href: "/reports",
    category: "Reports",
    accent: "text-indigo-400",
    bg: "bg-indigo-500/10 group-hover:bg-indigo-500/20",
  },
  {
    id: "notifications",
    title: "Alerts & Notifications",
    description: "Configure transfer alerts, delivery channels and thresholds",
    icon: Bell,
    href: "/notifications",
    category: "Tools",
    accent: "text-yellow-400",
    bg: "bg-yellow-500/10 group-hover:bg-yellow-500/20",
  },
  {
    id: "security",
    title: "Verification & Access",
    description: "Two-step verification, session management and access controls",
    icon: ShieldCheck,
    href: "/security",
    category: "Tools",
    accent: "text-red-400",
    bg: "bg-red-500/10 group-hover:bg-red-500/20",
  },
  {
    id: "analytics",
    title: "Payment Insights",
    description: "Visualise flows, transaction volume and performance trends",
    icon: BarChart3,
    href: "/analytics",
    category: "Reports",
    accent: "text-teal-400",
    bg: "bg-teal-500/10 group-hover:bg-teal-500/20",
  },
  {
    id: "email-studio",
    title: "Communication Centre",
    description: "Draft and send Zelle-branded payment notifications",
    icon: Mail,
    href: "/email-studio",
    category: "Tools",
    accent: "text-pink-400",
    bg: "bg-pink-500/10 group-hover:bg-pink-500/20",
  },
  {
    id: "admin",
    title: "Portal Settings",
    description: "Preferences, connected institutions and partner configuration",
    icon: Settings,
    href: "/admin",
    category: "Tools",
    accent: "text-slate-400",
    bg: "bg-slate-500/10 group-hover:bg-slate-500/20",
  },
]

// Quick-access items pinned in the footer dock
const DOCK_ITEMS = [
  { id: "send",    icon: ArrowUpRight, label: "Send",    href: "/send" },
  { id: "deposit", icon: Banknote,     label: "Deposit", href: "/deposit-portal" },
  { id: "history", icon: ClipboardList,label: "History", href: "/history" },
]

// ─── Component ───────────────────────────────────────────────────────────────
export default function FooterMegaMenu() {
  const router                        = useRouter()
  const [open, setOpen]               = useState(false)
  const [activeCategory, setCategory] = useState<Category>("All")
  const [search, setSearch]           = useState("")
  const [mounted, setMounted]         = useState(false)
  const searchRef                     = useRef<HTMLInputElement>(null)
  const overlayRef                    = useRef<HTMLDivElement>(null)

  // Wait one frame before showing so CSS transitions play
  useEffect(() => { setMounted(true) }, [])

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      setTimeout(() => searchRef.current?.focus(), 350)
    } else {
      document.body.style.overflow = ""
      setSearch("")
      setCategory("All")
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  // Dismiss on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const navigate = useCallback((href: string) => {
    setOpen(false)
    setTimeout(() => router.push(href), 220)
  }, [router])

  const filtered = SERVICES.filter(s => {
    const matchCat    = activeCategory === "All" || s.category === activeCategory
    const matchSearch = search === "" ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <>
      {/* ── Fullscreen mega-menu overlay ─────────────────────────── */}
      <div
        ref={overlayRef}
        aria-hidden={!open}
        className={`fixed inset-0 z-50 flex flex-col transition-all duration-500 ease-out ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-full pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-[#080808]/98 backdrop-blur-2xl" />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Top accent bar */}
        <div className="relative z-10 h-0.5 w-full bg-gradient-to-r from-transparent via-[#6D1ED4] to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full overflow-hidden">

            {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 sm:px-8 pt-5 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#6D1ED4] rounded-xl flex items-center justify-center shadow-md shadow-[#6D1ED4]/20">
                <span className="text-white font-black text-base leading-none select-none">Z</span>
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-white tracking-tight leading-none mb-0.5">All Services</h2>
                <p className="text-[11px] text-zinc-600 leading-none">Select a service to continue</p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.09] flex items-center justify-center transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#6D1ED4]/40"
              aria-label="Close menu"
            >
              <X className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
            </button>
          </div>

          {/* ── Search + Category filter ── */}
          <div className="px-5 sm:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3 border-b border-white/[0.04]">
            {/* Search */}
            <div className="relative flex-1 w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search services..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-[14px] text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#6D1ED4]/40 focus:border-[#6D1ED4]/30 transition-all"
                style={{ fontSize: "16px" }}
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150 ${
                    activeCategory === cat
                      ? "bg-[#6D1ED4] text-white shadow-sm"
                      : "bg-white/[0.04] border border-white/[0.07] text-zinc-500 hover:border-white/[0.14] hover:text-zinc-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ── Service grid ── */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-2.5">
                <Grid3x3 className="w-7 h-7 text-zinc-600" />
                <p className="text-[13px] text-zinc-500">No services match your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-2.5">
                {filtered.map((service, i) => {
                  const Icon = service.icon
                  return (
                    <button
                      key={service.id}
                      onClick={() => navigate(service.href)}
                      className="group relative flex flex-col items-start gap-3 p-3.5 sm:p-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/[0.12] active:scale-[0.98] transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-[#6D1ED4]/40"
                      style={{
                        animation: open ? `megaFadeUp 0.32s ease-out ${i * 24}ms both` : "none",
                      }}
                    >
                      {/* Popular badge */}
                      {service.featured && (
                        <span className="absolute top-2.5 right-2.5 text-[9px] font-bold tracking-widest text-[#6D1ED4]/70 uppercase">
                          Popular
                        </span>
                      )}

                      {/* Icon */}
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${service.bg} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${service.accent}`} />
                      </div>

                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-zinc-200 leading-tight mb-1 group-hover:text-white transition-colors">
                          {service.title}
                        </p>
                        <p className="text-[11px] text-zinc-600 leading-snug group-hover:text-zinc-500 transition-colors line-clamp-2">
                          {service.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ArrowUpRight className={`absolute bottom-3 right-3 w-3 h-3 ${service.accent} opacity-0 group-hover:opacity-60 transition-all duration-200`} />
                    </button>
                  )
                })}
              </div>
            )}

            {/* Bottom padding so last row isn't obscured */}
            <div className="h-4" />
          </div>

          {/* ── Mini footer inside overlay ── */}
          <div className="relative z-10 border-t border-white/[0.05] px-5 sm:px-8 py-3 flex items-center justify-between">
            <p className="text-[10px] text-zinc-500">Zelle &middot; Secure Payment Services</p>
            <button
              onClick={() => setOpen(false)}
              className="text-[12px] font-semibold text-zinc-600 hover:text-[#6D1ED4] transition-colors flex items-center gap-1.5 focus:outline-none"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              Dismiss
            </button>
          </div>
        </div>
      </div>

      {/* ── Fixed footer bar ─────────────────────────────────────── */}
      <div
        className={`fixed bottom-0 inset-x-0 z-40 transition-all duration-300 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div className="mx-3 sm:mx-auto sm:max-w-md mb-3 sm:mb-5">
          <div className="relative rounded-2xl border border-white/[0.08] bg-[#111]/95 backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden">
            {/* Purple hairline */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-[#6D1ED4]/30" />

            <div className="flex items-center px-2 py-1.5 gap-0.5">
              {/* Dock items */}
              {DOCK_ITEMS.map(item => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.href)}
                    className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl hover:bg-white/[0.06] active:scale-95 transition-all duration-150 group"
                  >
                    <Icon className="w-[18px] h-[18px] text-zinc-400 group-hover:text-zinc-100 transition-colors duration-150" />
                    <span className="text-[10px] font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors duration-150 leading-none">
                      {item.label}
                    </span>
                  </button>
                )
              })}

              {/* Divider */}
              <div className="w-px h-7 bg-white/[0.07] mx-0.5 shrink-0" />

              {/* Mega-menu trigger — prominent gold pill */}
              <button
                onClick={() => setOpen(true)}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 mx-1 rounded-xl bg-[#6D1ED4]/10 hover:bg-[#6D1ED4]/20 border border-[#6D1ED4]/30 hover:border-[#6D1ED4]/50 active:scale-95 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#6D1ED4]/40"
                aria-label="Open service menu"
                aria-expanded={open}
              >
                <Grid3x3 className="w-[18px] h-[18px] text-[#6D1ED4] group-hover:scale-105 transition-transform duration-200" />
                <span className="text-[10px] font-bold text-[#6D1ED4]/80 group-hover:text-[#6D1ED4] transition-colors leading-none">
                  Services
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Keyframe for staggered card entries ── */}
      <style jsx global>{`
        @keyframes megaFadeUp {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </>
  )
}
