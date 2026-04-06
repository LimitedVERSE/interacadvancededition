"use client"

import { useAuth } from "@/lib/auth/context"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import {
  SendIcon,
  DollarSign,
  CreditCard,
  History,
  Settings,
  LogOut,
  Users,
  FileText,
  Bell,
  ShieldCheck,
  BarChart3,
  Mail,
  Lock,
  RefreshCw,
  TrendingUp,
  Building2,
  Zap,
} from "lucide-react"
import { useState, useEffect } from "react"
import FooterMegaMenu from "@/components/FooterMegaMenu"

// ─── Zelle Payments Portal — Ledger ─────────────────────────────────────────
const CHECKING_USD       = 7_000_000
const SAVINGS_USD        = 14_250_000
const RELOAD_THRESHOLD   = 0.20              // Auto-reload triggers at 20% of Checking

function formatUSD(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function AccountBalancePanel() {
  const [revealed, setRevealed]         = useState(false)
  const [reloadPulse, setReloadPulse]   = useState(false)
  const [rateFlash, setRateFlash]       = useState(false)

  const [checkingLive, setCheckingLive] = useState(CHECKING_USD)
  const thresholdUSD                    = CHECKING_USD * RELOAD_THRESHOLD
  const checkingPct                     = (checkingLive / CHECKING_USD) * 100
  const isLow                           = checkingLive <= thresholdUSD

  useEffect(() => {
    const t = setTimeout(() => setRateFlash(true), 800)
    const t2 = setTimeout(() => setRateFlash(false), 2200)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    if (isLow && !reloadPulse) {
      setReloadPulse(true)
      const t = setTimeout(() => {
        setCheckingLive(CHECKING_USD)
        setReloadPulse(false)
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [isLow, reloadPulse])

  return (
    <div className="w-full max-w-3xl mx-auto mb-5 sm:mb-6">
      {/* Zelle ledger badge row */}
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3 h-3 text-zinc-500" />
          <span className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">
            Zelle Payments Portal
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${rateFlash ? "bg-[#6D1ED4] animate-ping" : "bg-emerald-500"}`} />
          <span className="text-[10px] text-zinc-500">Live Ledger</span>
        </div>
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">

        {/* Checking */}
        <div className={`relative rounded-2xl border overflow-hidden transition-all duration-500 ${
          isLow
            ? "border-amber-500/30 bg-amber-950/10"
            : "border-white/[0.08] bg-white/[0.04]"
        }`}>
          <div className={`h-px w-full ${isLow ? "bg-amber-500/70" : "bg-[#6D1ED4]/50"}`} />

          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Checking</span>
                  {isLow && (
                    <span className="text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                      Low
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-zinc-500">Zelle Network &middot; Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                {reloadPulse && <RefreshCw className="w-3.5 h-3.5 text-[#6D1ED4] animate-spin" />}
                <div className="w-7 h-7 bg-[#6D1ED4]/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-[#6D1ED4]" />
                </div>
              </div>
            </div>

            <button
              onClick={() => setRevealed(v => !v)}
              className="text-left mb-0.5 focus:outline-none group"
              aria-label={revealed ? "Hide balance" : "Reveal balance"}
            >
              {revealed ? (
                <span className="text-2xl sm:text-[28px] font-bold text-white tracking-tight tabular-nums">
                  {formatUSD(checkingLive)}
                </span>
              ) : (
                <span className="text-2xl sm:text-[28px] font-bold text-zinc-600 tracking-tight select-none group-hover:text-zinc-500 transition-colors">
                  $&nbsp;••••••••••
                </span>
              )}
            </button>
            <p className="text-[11px] text-zinc-500">USD &middot; FDIC Insured</p>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-zinc-500">Balance level</span>
                <span className={`text-[10px] font-semibold tabular-nums ${isLow ? "text-amber-400" : "text-zinc-400"}`}>
                  {checkingPct.toFixed(1)}%
                </span>
              </div>
              <div className="h-1 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${isLow ? "bg-amber-500" : "bg-[#6D1ED4]"}`}
                  style={{ width: `${Math.max(checkingPct, 1)}%` }}
                />
              </div>
              <div className="relative h-4 mt-0">
                <div className="absolute top-0 w-px h-2 bg-zinc-600" style={{ left: "20%" }} />
                <span className="absolute text-[9px] text-zinc-600 -translate-x-1/2" style={{ left: "20%", top: "8px" }}>
                  20%
                </span>
              </div>
            </div>
          </div>

          {reloadPulse && (
            <div className="absolute inset-0 bg-[#6D1ED4]/5 animate-pulse rounded-2xl pointer-events-none" />
          )}
        </div>

        {/* Savings */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.04] overflow-hidden">
          <div className="h-px w-full bg-white/[0.08]" />

          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Savings</span>
                  <span className="text-[9px] font-bold bg-white/[0.07] text-zinc-400 border border-white/[0.10] px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                    Reserve
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500">Zelle Network &middot; Reserve</span>
              </div>
              <div className="w-7 h-7 bg-white/[0.07] rounded-lg flex items-center justify-center">
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
              </div>
            </div>

            <div className="mb-0.5">
              {revealed ? (
                <span className="text-2xl sm:text-[28px] font-bold text-zinc-300 tracking-tight tabular-nums">
                  {formatUSD(SAVINGS_USD)}
                </span>
              ) : (
                <span className="text-2xl sm:text-[28px] font-bold text-zinc-600 tracking-tight select-none">
                  $&nbsp;••••••••••
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-500">USD &middot; FDIC Insured</p>

            <div className="mt-4 flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08]">
              <RefreshCw className="w-3 h-3 text-zinc-500 mt-0.5 shrink-0" />
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Auto-reloads Checking below{" "}
                <span className="text-zinc-200 font-semibold">{formatUSD(CHECKING_USD * RELOAD_THRESHOLD)}</span>
                {" "}(20% threshold)
              </p>
            </div>

            <div className="mt-2.5 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-zinc-500" />
              <span className="text-[10px] text-zinc-500">Unlocks on Checking reload trigger</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-zinc-800 mt-2">
        {revealed ? "Tap to hide balances" : "Tap Checking balance to reveal"}
      </p>
    </div>
  )
}

const menuItems = [
  {
    id: "send",
    title: "Send Payment",
    icon: SendIcon,
    href: "/send",
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-400",
    hoverBg: "group-hover:bg-blue-500/20",
  },
  {
    id: "deposit",
    title: "Receive Funds",
    icon: DollarSign,
    href: "/deposit-portal",
    bgColor: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    hoverBg: "group-hover:bg-emerald-500/20",
  },
  {
    id: "bank-connect",
    title: "Link Bank",
    icon: CreditCard,
    href: "/connect-bank",
    bgColor: "bg-violet-500/10",
    iconColor: "text-violet-400",
    hoverBg: "group-hover:bg-violet-500/20",
  },
  {
    id: "history",
    title: "History",
    icon: History,
    href: "/history",
    bgColor: "bg-amber-500/10",
    iconColor: "text-amber-400",
    hoverBg: "group-hover:bg-amber-500/20",
  },
  {
    id: "recipients",
    title: "Contacts",
    icon: Users,
    href: "/recipients",
    bgColor: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    hoverBg: "group-hover:bg-cyan-500/20",
  },
  {
    id: "reports",
    title: "Statements",
    icon: FileText,
    href: "/reports",
    bgColor: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    hoverBg: "group-hover:bg-indigo-500/20",
  },
  {
    id: "notifications",
    title: "Alerts",
    icon: Bell,
    href: "/notifications",
    bgColor: "bg-purple-500/10",
    iconColor: "text-purple-400",
    hoverBg: "group-hover:bg-purple-500/20",
  },
  {
    id: "security",
    title: "Verification",
    icon: ShieldCheck,
    href: "/security",
    bgColor: "bg-red-500/10",
    iconColor: "text-red-400",
    hoverBg: "group-hover:bg-red-500/20",
  },
  {
    id: "analytics",
    title: "Insights",
    icon: BarChart3,
    href: "/analytics",
    bgColor: "bg-teal-500/10",
    iconColor: "text-teal-400",
    hoverBg: "group-hover:bg-teal-500/20",
  },
  {
    id: "email-studio",
    title: "Messages",
    icon: Mail,
    href: "/email-studio",
    bgColor: "bg-pink-500/10",
    iconColor: "text-pink-400",
    hoverBg: "group-hover:bg-pink-500/20",
  },
  {
    id: "admin",
    title: "Settings",
    icon: Settings,
    href: "/admin",
    bgColor: "bg-zinc-500/10",
    iconColor: "text-zinc-400",
    hoverBg: "group-hover:bg-zinc-500/20",
  },
]

function ZelleLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setFadeOut(true), 200)
          setTimeout(() => onComplete(), 600)
          return 100
        }
        return prev + 4
      })
    }, 40)
    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Animated Zelle Logo */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#6D1ED4] rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-[#6D1ED4]/30">
            <span className="text-white font-black text-5xl sm:text-6xl leading-none">Z</span>
          </div>
          {/* Spinning ring */}
          <div className="absolute -inset-3 border-4 border-transparent border-t-[#6D1ED4] rounded-full animate-spin" />
          <div
            className="absolute -inset-6 border-2 border-transparent border-t-[#6D1ED4]/50 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          />
        </div>

        {/* Loading text */}
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Zelle Disbursement Portal</h2>
          <p className="text-zinc-400 text-sm sm:text-base">Initializing secure session...</p>
        </div>

        {/* Progress bar */}
        <div className="w-48 sm:w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#6D1ED4] to-[#8B4AE8] rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function AppGridItem({
  item,
  index,
  onClick,
}: {
  item: (typeof menuItems)[0]
  index: number
  onClick: () => void
}) {
  const IconComponent = item.icon

  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl hover:bg-white/[0.04] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6D1ED4]/40 focus:ring-offset-2 focus:ring-offset-[#080808]"
      style={{
        animationDelay: `${index * 40}ms`,
        animation: "fadeInUp 0.45s ease-out forwards",
        opacity: 0,
      }}
    >
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border border-white/[0.06] ${item.bgColor} ${item.hoverBg} flex items-center justify-center transition-all duration-200 group-hover:border-white/[0.12] group-hover:scale-[1.06]`}
      >
        <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 ${item.iconColor}`} />
      </div>
      <span className="text-[11px] sm:text-xs font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors duration-200 text-center leading-tight">
        {item.title}
      </span>
    </button>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "morning"
  if (h < 17) return "afternoon"
  return "evening"
}

function DashboardContent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (isLoading) {
    return <ZelleLoader onComplete={() => setIsLoading(false)} />
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="fixed inset-0 bg-[#080808] overflow-hidden flex flex-col">
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#6D1ED4]/4 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 border-b border-white/[0.05]">
        {/* Logo + brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#6D1ED4] rounded-xl flex items-center justify-center shadow-md shadow-[#6D1ED4]/20">
            <span className="text-white font-black text-xl sm:text-2xl leading-none">Z</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-[14px] font-bold text-white leading-none mb-0.5">Zelle</p>
            <p className="text-[11px] text-zinc-600 leading-none">Secure Disbursement Portal</p>
          </div>
        </div>

        {/* Clock */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center hidden md:block">
          <p className="text-2xl lg:text-3xl font-light text-white tracking-tight tabular-nums">
            {formatTime(currentTime)}
          </p>
          <p className="text-[11px] text-zinc-600 mt-0.5">{formatDate(currentTime)}</p>
        </div>

        {/* User + logout */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-[13px] font-semibold text-white leading-none mb-0.5 truncate max-w-[140px]">{user?.name}</p>
            <p className="text-[11px] text-zinc-600 leading-none truncate max-w-[140px]">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-all duration-200 text-[13px] font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Mobile clock */}
      <div className="md:hidden flex items-center justify-center gap-2 py-2 border-b border-white/[0.05]">
        <p className="text-sm font-semibold text-white tabular-nums">{formatTime(currentTime)}</p>
        <span className="text-zinc-600">&middot;</span>
        <p className="text-[11px] text-zinc-500">{formatDate(currentTime)}</p>
      </div>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 pb-28">

        {/* Welcome */}
        <div className="w-full max-w-3xl mx-auto mb-5 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-0.5">
            Good {getGreeting()}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
          </h2>
          <p className="text-[13px] text-zinc-500">What would you like to do today?</p>
        </div>

        {/* Account Balance Panel */}
        <AccountBalancePanel />

        {/* App grid */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1 sm:gap-2">
            {menuItems.map((item, i) => (
              <AppGridItem
                key={item.id}
                item={item}
                index={i}
                onClick={() => router.push(item.href)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterMegaMenu />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
