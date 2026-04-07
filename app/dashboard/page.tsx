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
  LayoutDashboard,
  Wallet,
  ChevronRight,
  Activity,
} from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import FooterMegaMenu from "@/components/FooterMegaMenu"

// ─── Constants ───────────────────────────────────────────────────────────────
const CHECKING_USD     = 7_000_000
const SAVINGS_USD      = 14_250_000
const RELOAD_THRESHOLD = 0.20

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(n)
}

function formatCompact(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`
  return formatUSD(n)
}

// ─── Particle System ─────────────────────────────────────────────────────────
interface Particle { id: number; x: number; y: number; size: number; delay: number; drift: number; duration: number; color: string }

function ParticleField() {
  const particlesRef = useRef<Particle[]>([])
  if (particlesRef.current.length === 0) {
    particlesRef.current = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: (i * 37.3) % 100,
      y: 20 + (i * 29.7) % 75,
      size: 1 + (i * 0.09) % 2.5,
      delay: (i * 0.31) % 8,
      drift: ((i % 2 === 0 ? 1 : -1) * (i * 2.3)) % 60,
      duration: 5 + (i * 0.41) % 6,
      color: i % 3 === 0 ? "#6D1ED4" : i % 3 === 1 ? "#00B8D9" : "#8B4AE8",
    }))
  }
  const particles = particlesRef.current
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Perspective Grid Floor ───────────────────────────────────────────────────
function PerspectiveGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Deep space backdrop */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 120% 60% at 50% 0%, rgba(109,30,212,0.12) 0%, rgba(0,10,30,0.0) 70%)",
      }} />
      {/* Perspective floor grid */}
      <div
        className="absolute bottom-0 left-0 right-0 grid-advance"
        style={{
          height: "65%",
          transformOrigin: "50% 100%",
          transform: "perspective(600px) rotateX(70deg) scaleX(1.8)",
          backgroundImage:
            "linear-gradient(rgba(109,30,212,0.18) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(109,30,212,0.18) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
        }}
      />
      {/* Secondary grid (cyan accent) */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "65%",
          transformOrigin: "50% 100%",
          transform: "perspective(600px) rotateX(70deg) scaleX(1.8)",
          backgroundImage:
            "linear-gradient(rgba(0,180,217,0.07) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(0,180,217,0.07) 1px, transparent 1px)",
          backgroundSize: "240px 240px",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
        }}
      />
      {/* Horizon glow */}
      <div className="absolute left-0 right-0" style={{
        bottom: "38%",
        height: "2px",
        background: "linear-gradient(90deg, transparent 0%, rgba(109,30,212,0.5) 20%, rgba(0,180,217,0.4) 50%, rgba(109,30,212,0.5) 80%, transparent 100%)",
        filter: "blur(1px)",
      }} />
      {/* Scan line */}
      <div className="scan-line absolute left-0 right-0 h-[2px] pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(109,30,212,0.35) 30%, rgba(0,180,217,0.25) 50%, rgba(109,30,212,0.35) 70%, transparent)" }}
      />
      {/* Top vignette */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(3,5,20,0.7) 100%)",
      }} />
    </div>
  )
}

// ─── Corner Brackets ─────────────────────────────────────────────────────────
function CornerBrackets({ color = "#6D1ED4", size = 14 }: { color?: string; size?: number }) {
  const s = `${size}px`
  const style: React.CSSProperties = { width: s, height: s, borderColor: color }
  return (
    <>
      <span className="absolute top-0 left-0 corner-blink border-t-[2px] border-l-[2px]" style={style} />
      <span className="absolute top-0 right-0 corner-blink border-t-[2px] border-r-[2px]" style={style} />
      <span className="absolute bottom-0 left-0 corner-blink border-b-[2px] border-l-[2px]" style={style} />
      <span className="absolute bottom-0 right-0 corner-blink border-b-[2px] border-r-[2px]" style={style} />
    </>
  )
}

// ─── Live Ledger Panel ────────────────────────────────────────────────────────
const LEDGER_LINES = [
  { label: "ROUTE UPLINK",   val: "NOMINAL",  col: "#4ade80" },
  { label: "PROCESSING",     val: "ACTIVE",   col: "#6D1ED4" },
  { label: "LATENCY",        val: "12ms",     col: "#00B8D9" },
  { label: "NODES",          val: "847",      col: "#a78bfa" },
  { label: "ENCRYPT",        val: "AES-256",  col: "#4ade80" },
  { label: "TX POOL",        val: "CLEAR",    col: "#4ade80" },
  { label: "NET STATUS",     val: "OPTIMAL",  col: "#4ade80" },
  { label: "ROUTE UPLINK",   val: "NOMINAL",  col: "#4ade80" },
  { label: "PROCESSING",     val: "ACTIVE",   col: "#6D1ED4" },
  { label: "LATENCY",        val: "12ms",     col: "#00B8D9" },
]

function LiveLedgerPanel() {
  const [uptime, setUptime] = useState(99.09)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => {
      setTick(n => n + 1)
      setUptime(v => Math.min(100, v + (Math.random() - 0.48) * 0.02))
    }, 1800)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative rounded-xl border border-white/[0.06] bg-[rgba(3,5,20,0.88)] overflow-hidden h-full flex flex-col holo-card-cyan crt-flicker">
      <CornerBrackets color="#00B8D9" size={10} />
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #00B8D9, transparent)" }} />

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.05]">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3 h-3" style={{ color: "#00B8D9" }} />
          <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-zinc-400">Live Ledger</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 ledger-tick" />
          <span className="text-[9px] font-mono text-emerald-400">{uptime.toFixed(2)}%</span>
        </div>
      </div>

      {/* Scrolling data */}
      <div className="flex-1 overflow-hidden relative px-2.5 py-1">
        <div className="data-scroll">
          {[...LEDGER_LINES, ...LEDGER_LINES].map((line, i) => (
            <div key={i} className="flex items-center justify-between py-[5px] border-b border-white/[0.03]">
              <span className="text-[8px] font-mono text-zinc-600 tracking-widest">{line.label}</span>
              <span className="text-[8px] font-mono font-bold" style={{ color: line.col }}>{line.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer ping */}
      <div className="px-3 py-2 border-t border-white/[0.05] flex items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-[#6D1ED4] animate-ping" />
        <span className="text-[8px] font-mono text-zinc-600 tracking-widest">LINQNET OGS · RE-KNOW</span>
      </div>
    </div>
  )
}

// ─── Account Cards ────────────────────────────────────────────────────────────
function AccountBalancePanel() {
  const [revealed, setRevealed]       = useState(false)
  const [reloadPulse, setReloadPulse] = useState(false)
  const [rateFlash, setRateFlash]     = useState(false)
  const [checkingLive, setCheckingLive] = useState(CHECKING_USD)

  const thresholdUSD  = CHECKING_USD * RELOAD_THRESHOLD
  const checkingPct   = (checkingLive / CHECKING_USD) * 100
  const isLow         = checkingLive <= thresholdUSD

  useEffect(() => {
    const t  = setTimeout(() => setRateFlash(true),  800)
    const t2 = setTimeout(() => setRateFlash(false), 2200)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    if (isLow && !reloadPulse) {
      setReloadPulse(true)
      const t = setTimeout(() => { setCheckingLive(CHECKING_USD); setReloadPulse(false) }, 2000)
      return () => clearTimeout(t)
    }
  }, [isLow, reloadPulse])

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">

      {/* ── CHECKING ── */}
      <div className={`relative rounded-xl border overflow-hidden transition-all duration-500 glow-pop ${
        isLow ? "border-amber-500/40 bg-[rgba(30,20,5,0.85)]" : "holo-card-purple bg-[rgba(3,5,20,0.85)]"
      }`} style={{ animationDelay: "0.1s" }}>
        <CornerBrackets color={isLow ? "#f59e0b" : "#6D1ED4"} size={12} />
        <div className="h-px w-full" style={{
          background: isLow
            ? "linear-gradient(90deg, transparent, #f59e0b88, transparent)"
            : "linear-gradient(90deg, transparent, #6D1ED4, transparent)",
        }} />

        <div className="p-4 sm:p-5">
          {/* Title row */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-300">Checking</span>
                {isLow && (
                  <span className="text-[8px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded uppercase tracking-wide">
                    Low
                  </span>
                )}
              </div>
              <span className="text-[10px] text-zinc-500 tracking-wider">Zelle Network · Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              {reloadPulse && <RefreshCw className="w-3.5 h-3.5 text-[#6D1ED4] animate-spin" />}
              <div className="w-7 h-7 rounded-lg flex items-center justify-center border"
                style={{ background: "rgba(109,30,212,0.12)", borderColor: "rgba(109,30,212,0.25)" }}>
                <Zap className="w-3.5 h-3.5 text-[#8B4AE8]" />
              </div>
            </div>
          </div>

          {/* Balance */}
          <button
            onClick={() => setRevealed(v => !v)}
            className="text-left mb-0.5 focus:outline-none group w-full"
            aria-label={revealed ? "Hide balance" : "Reveal balance"}
          >
            <span className={`font-mono font-bold tracking-tight tabular-nums transition-all duration-300 ${
              revealed ? "text-2xl sm:text-[26px] text-white" : "text-2xl sm:text-[26px] text-zinc-600 group-hover:text-zinc-500"
            }`}>
              {revealed ? (
                <span style={{ textShadow: "0 0 20px rgba(109,30,212,0.6)" }}>{formatUSD(checkingLive)}</span>
              ) : "$\u00a0••••••••••••"}
            </span>
          </button>
          <p className="text-[10px] text-zinc-500 mb-4 font-mono tracking-widest">USD · FDIC INSURED</p>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] text-zinc-500 tracking-widest uppercase">Balance level</span>
              <span className={`text-[9px] font-mono font-bold tabular-nums ${isLow ? "text-amber-400" : "text-[#8B4AE8]"}`}>
                {checkingPct.toFixed(1)}%
              </span>
            </div>
            <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.max(checkingPct, 1)}%`,
                  background: isLow ? "#f59e0b" : "linear-gradient(90deg, #6D1ED4, #00B8D9)",
                  boxShadow: isLow ? "0 0 8px #f59e0b" : "0 0 8px #6D1ED4",
                }}
              />
            </div>
            <div className="relative h-4 mt-0.5">
              <div className="absolute top-0 w-px h-2 bg-zinc-600" style={{ left: "20%" }} />
              <span className="absolute text-[8px] text-zinc-600 font-mono -translate-x-1/2" style={{ left: "20%", top: "9px" }}>20%</span>
            </div>
          </div>
        </div>
        {reloadPulse && <div className="absolute inset-0 bg-[#6D1ED4]/5 animate-pulse pointer-events-none" />}
      </div>

      {/* ── SAVINGS ── */}
      <div className="relative rounded-xl border overflow-hidden holo-card-cyan bg-[rgba(3,5,20,0.85)] glow-pop" style={{ animationDelay: "0.2s" }}>
        <CornerBrackets color="#00B8D9" size={12} />
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #00B8D9, transparent)" }} />

        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-300">Savings</span>
                <span className="text-[8px] font-bold bg-white/[0.06] text-zinc-400 border border-white/[0.10] px-1.5 py-0.5 rounded uppercase tracking-wide">
                  Reserve
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 tracking-wider">Zelle Network · Reserve</span>
            </div>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center border"
              style={{ background: "rgba(0,180,217,0.08)", borderColor: "rgba(0,180,217,0.2)" }}>
              <Lock className="w-3.5 h-3.5" style={{ color: "#00B8D9" }} />
            </div>
          </div>

          <div className="mb-0.5">
            <span className={`font-mono font-bold tracking-tight tabular-nums transition-all duration-300 text-2xl sm:text-[26px] ${
              revealed ? "text-zinc-200" : "text-zinc-600"
            }`}>
              {revealed ? (
                <span style={{ textShadow: "0 0 20px rgba(0,180,217,0.4)" }}>{formatUSD(SAVINGS_USD)}</span>
              ) : "$\u00a0••••••••••••"}
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 mb-4 font-mono tracking-widest">USD · FDIC INSURED</p>

          <div className="flex items-start gap-2 p-2.5 rounded-lg border"
            style={{ background: "rgba(0,180,217,0.05)", borderColor: "rgba(0,180,217,0.12)" }}>
            <RefreshCw className="w-3 h-3 mt-0.5 shrink-0" style={{ color: "#00B8D9" }} />
            <p className="text-[9px] text-zinc-400 leading-relaxed font-mono">
              Auto-reloads Checking below{" "}
              <span className="text-zinc-200 font-bold">{formatUSD(CHECKING_USD * RELOAD_THRESHOLD)}</span>
              {" "}(20% threshold)
            </p>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-zinc-500" />
            <span className="text-[9px] text-zinc-500 font-mono tracking-wider">Funds securely held · FDIC insured</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar nav ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",  active: true  },
  { icon: SendIcon,        label: "Payments",   href: "/send" },
  { icon: Building2,       label: "Banking",    href: "/connect-bank" },
  { icon: History,         label: "History",    href: "/history" },
  { icon: Users,           label: "Contacts",   href: "/recipients" },
  { icon: Settings,        label: "Settings",   href: "/admin" },
]

function Sidebar({ onNav }: { onNav: (href: string) => void }) {
  return (
    <aside
      className="hidden lg:flex flex-col items-center gap-1 py-6 px-2 border-r border-white/[0.05] w-[72px] shrink-0"
      style={{ background: "rgba(3,5,20,0.92)" }}
      aria-label="Main navigation"
    >
      {/* Zelle logo */}
      <div className="w-10 h-10 rounded-xl overflow-hidden mb-4 shrink-0"
        style={{ boxShadow: "0 0 16px rgba(109,30,212,0.6)" }}>
        <img src="/zelle-logo.webp" alt="Zelle" className="w-full h-full object-cover" />
      </div>

      {NAV_ITEMS.map(({ icon: Icon, label, active, href }) => (
        <button
          key={label}
          onClick={() => href && onNav(href)}
          title={label}
          aria-label={label}
          aria-current={active ? "page" : undefined}
          className={`group relative w-12 h-12 flex flex-col items-center justify-center rounded-xl gap-1 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D1ED4] ${
            active
              ? "bg-[#6D1ED4]/15 border border-[#6D1ED4]/30"
              : "hover:bg-white/[0.04] border border-transparent"
          }`}
        >
          <Icon className={`w-4 h-4 ${active ? "text-[#8B4AE8]" : "text-zinc-500 group-hover:text-zinc-300"} transition-colors`} />
          <span className={`text-[7px] font-mono tracking-wider ${active ? "text-[#8B4AE8]" : "text-zinc-600 group-hover:text-zinc-400"} transition-colors`}>
            {label.slice(0, 4).toUpperCase()}
          </span>
          {active && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-l-full bg-[#6D1ED4]" />
          )}
        </button>
      ))}
    </aside>
  )
}

// ─── Action buttons ───────────────────────────────────────────────────────────
const ACTION_BTNS = [
  { label: "Send Payment",   icon: SendIcon,   href: "/send",           color: "#6D1ED4", glow: "rgba(109,30,212,0.35)" },
  { label: "Receive Funds",  icon: DollarSign, href: "/deposit-portal", color: "#00B8D9", glow: "rgba(0,184,217,0.3)"   },
  { label: "Link Bank",      icon: CreditCard, href: "/connect-bank",   color: "#8B4AE8", glow: "rgba(139,74,232,0.3)"  },
  { label: "Statements",     icon: FileText,   href: "/reports",        color: "#4ade80", glow: "rgba(74,222,128,0.25)" },
]

function ActionButtons({ onNav }: { onNav: (href: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full">
      {ACTION_BTNS.map(({ label, icon: Icon, href, color, glow }, i) => (
        <button
          key={label}
          onClick={() => onNav(href)}
          className="group flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl border text-[12px] sm:text-[13px] font-bold tracking-wide uppercase transition-all duration-200 glow-pop focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          style={{
            borderColor: `${color}40`,
            background: `${color}0d`,
            color,
            animationDelay: `${0.3 + i * 0.07}s`,
          }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.background = `${color}1a`
            el.style.boxShadow  = `0 0 18px ${glow}, inset 0 0 12px ${color}0d`
            el.style.borderColor = `${color}80`
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.background  = `${color}0d`
            el.style.boxShadow   = "none"
            el.style.borderColor = `${color}40`
          }}
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span className="hidden xs:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}

// ─── App grid ─────────────────────────────────────────────────────────────────
const GRID_ITEMS = [
  { id: "history",       title: "History",      icon: History,     href: "/history",         color: "#f59e0b" },
  { id: "recipients",   title: "Contacts",     icon: Users,       href: "/recipients",       color: "#00B8D9" },
  { id: "reports",      title: "Statements",   icon: FileText,    href: "/reports",          color: "#6D1ED4" },
  { id: "notifications",title: "Alerts",       icon: Bell,        href: "/notifications",    color: "#a78bfa" },
  { id: "security",     title: "Verification", icon: ShieldCheck, href: "/security",         color: "#4ade80" },
  { id: "analytics",    title: "Insights",     icon: BarChart3,   href: "/analytics",        color: "#00B8D9" },
  { id: "email-studio", title: "Messages",     icon: Mail,        href: "/email-studio",     color: "#f472b6" },
  { id: "wallet",       title: "Wallet",       icon: Wallet,      href: "/deposit-portal",   color: "#8B4AE8" },
  { id: "admin",        title: "Settings",     icon: Settings,    href: "/admin",            color: "#71717a" },
]

// ─── Loader ───────────────────────────────────────────────────────────────────
function ZelleLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut]   = useState(false)
  const [phase, setPhase]       = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setFadeOut(true), 300)
          setTimeout(() => onComplete(), 800)
          return 100
        }
        return prev + 3
      })
    }, 40)
    return () => clearInterval(timer)
  }, [onComplete])

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500)
    const t2 = setTimeout(() => setPhase(2), 1200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const BOOT_LINES = [
    "INITIALIZING ZELLE SECURE PROTOCOL...",
    "ESTABLISHING ENCRYPTED CHANNEL...",
    "AUTHENTICATING SESSION CREDENTIALS...",
    "LOADING LEDGER STATE...",
  ]

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${fadeOut ? "opacity-0" : "opacity-100"}`}
      style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, #060818 0%, #030310 100%)" }}>

      <PerspectiveGrid />

      <div className="relative flex flex-col items-center gap-6 z-10">
        {/* Orbiting Z */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#6D1ED4]/20 orbit-ring" />
          <div className="absolute inset-[-12px] rounded-full border border-[#6D1ED4]/10 orbit-ring" style={{ animationDirection: "reverse", animationDuration: "12s" }} />
          <div className="w-16 h-16 rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 0 40px rgba(109,30,212,0.8), inset 0 0 20px rgba(139,74,232,0.3)" }}>
            <img src="/zelle-logo.webp" alt="Zelle" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Boot text */}
        <div className="text-center space-y-1">
          <h2 className="text-base font-bold text-white tracking-[0.25em] uppercase font-mono">
            Zelle Disbursement Portal
          </h2>
          {BOOT_LINES.slice(0, phase + 1).map((line, i) => (
            <p key={i} className="text-[10px] font-mono tracking-widest" style={{ color: i === phase ? "#00B8D9" : "#3f3f46" }}>
              {line}
            </p>
          ))}
        </div>

        {/* Progress */}
        <div className="w-48 sm:w-64 space-y-1.5">
          <div className="h-[2px] bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #6D1ED4, #00B8D9)",
                boxShadow: "0 0 8px #6D1ED4",
              }}
            />
          </div>
          <div className="flex justify-between">
            <span className="text-[9px] font-mono text-zinc-600 tracking-widest">BOOT SEQUENCE</span>
            <span className="text-[9px] font-mono text-[#6D1ED4]">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
function DashboardContent() {
  const { user, logout } = useAuth()
  const router           = useRouter()
  const [isLoading, setIsLoading]     = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [revealed, ]                  = useState(false)

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleLogout = () => { logout(); router.push("/login") }
  const handleNav    = useCallback((href: string) => router.push(href), [router])

  const formatTime = (d: Date) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
  const formatDate = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })

  if (isLoading) return <ZelleLoader onComplete={() => setIsLoading(false)} />

  return (
    <div className="fixed inset-0 overflow-hidden flex crt-flicker"
      style={{ background: "radial-gradient(ellipse 120% 80% at 50% 0%, #0a0618 0%, #030310 60%, #020208 100%)" }}>

      {/* ── Animated background ── */}
      <PerspectiveGrid />
      <ParticleField />

      {/* ── Sidebar ── */}
      <Sidebar onNav={handleNav} />

      {/* ── Content area ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-white/[0.05] shrink-0"
          style={{ background: "rgba(3,5,20,0.7)", backdropFilter: "blur(12px)" }}>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg overflow-hidden"
              style={{ boxShadow: "0 0 12px rgba(109,30,212,0.5)" }}>
              <img src="/zelle-logo.webp" alt="Zelle" className="w-full h-full object-cover" />
            </div>
            <span className="text-[12px] font-bold text-white tracking-wide">Zelle</span>
          </div>

          {/* Clock — center */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-white tracking-tight tabular-nums font-mono"
              style={{ textShadow: "0 0 20px rgba(109,30,212,0.5)" }}>
              {formatTime(currentTime)}
            </p>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest">{formatDate(currentTime)}</p>
          </div>

          {/* User + logout */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-right">
              <p className="text-[12px] font-semibold text-white leading-none mb-0.5 truncate max-w-[140px]">{user?.name}</p>
              <p className="text-[10px] text-zinc-500 font-mono leading-none truncate max-w-[140px]">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Sign out"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-all duration-200 text-[12px] font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        {/* Main scroll area */}
        <main className="flex-1 overflow-y-auto relative z-10 pb-24" aria-label="Dashboard content">
          <div className="max-w-5xl mx-auto px-3 sm:px-5 py-4 sm:py-5 space-y-4">

            {/* Portal header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-zinc-500" />
                <span className="text-[9px] font-bold tracking-[0.22em] text-zinc-500 uppercase font-mono">
                  Zelle Payments Portal
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 ledger-tick" />
                  <span className="text-[9px] text-emerald-400 font-mono tracking-widest">Live Ledger</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-mono tracking-widest">
                  <span style={{ color: "#00B8D9" }}>⬡</span>
                  <span>CREDSEC</span>
                </div>
              </div>
            </div>

            {/* Cards + Ledger */}
            <div className="flex gap-3 items-stretch">
              {/* Account cards */}
              <div className="flex-1 min-w-0">
                <AccountBalancePanel />
              </div>
              {/* Live ledger — desktop */}
              <div className="hidden xl:flex w-[180px] shrink-0" style={{ minHeight: "240px" }}>
                <LiveLedgerPanel />
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-1">
              <ActionButtons onNav={handleNav} />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(109,30,212,0.3), transparent)" }} />
              <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-600 uppercase">Quick Access</span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(109,30,212,0.3))" }} />
            </div>

            {/* App grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-9 gap-1.5 sm:gap-2">
              {GRID_ITEMS.map(({ id, title, icon: Icon, href, color }, i) => (
                <button
                  key={id}
                  onClick={() => handleNav(href)}
                  className="group flex flex-col items-center gap-1.5 p-2.5 sm:p-3 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.05] active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#6D1ED4]/60"
                  style={{
                    animationDelay: `${0.5 + i * 0.05}s`,
                    animation: "glowPop 0.4s ease-out forwards",
                    opacity: 0,
                  }}
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border transition-all duration-200 group-hover:scale-105"
                    style={{
                      background: `${color}10`,
                      borderColor: `${color}25`,
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget
                      el.style.boxShadow = `0 0 12px ${color}40`
                      el.style.borderColor = `${color}55`
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget
                      el.style.boxShadow = "none"
                      el.style.borderColor = `${color}25`
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-wide text-zinc-500 group-hover:text-zinc-300 transition-colors text-center leading-tight">
                    {title}
                  </span>
                </button>
              ))}
            </div>

            {/* Live ledger — mobile/tablet */}
            <div className="xl:hidden" style={{ height: "130px" }}>
              <LiveLedgerPanel />
            </div>

          </div>
        </main>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <FooterMegaMenu />
      </div>
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
