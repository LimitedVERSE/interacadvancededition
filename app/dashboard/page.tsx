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
  Lock,
  RefreshCw,
  TrendingUp,
  Building2,
  Zap,
  LayoutDashboard,
  Activity,
} from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"
import FooterMegaMenu from "@/components/FooterMegaMenu"

/* ═══════════════════════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════════════════════ */
const CHECKING_USD     = 7_000_000
const SAVINGS_USD      = 14_250_000
const RELOAD_PCT       = 0.20

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(n)
}

/* ═══════════════════════════════════════════════════════════════════════════
   3D ROOM ENVIRONMENT
   Creates the "inside the digital room" presence:
   - Perspective ceiling with reflected grid
   - Perspective floor advancing toward viewer
   - Side wall edge glows
   - Electrical arc flashes along edges
   - Volumetric light cones from above
   - Floating haze / atmosphere
   - Particle system with depth layers
   - Multiple scan lines (vertical + horizontal)
   ═══════════════════════════════════════════════════════════════════════════ */

function DigitalRoom() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">

      {/* ── Deep space base gradient ── */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 140% 90% at 50% 30%, #0d0422 0%, #060312 25%, #020108 60%, #000 100%)",
      }} />

      {/* ── Ceiling: reflected grid receding upward ── */}
      <div
        className="absolute left-0 right-0 top-0"
        style={{
          height: "40%",
          transformOrigin: "50% 0%",
          transform: "perspective(500px) rotateX(-68deg) scaleX(2.2)",
          backgroundImage:
            "linear-gradient(rgba(109,30,212,0.12) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(109,30,212,0.12) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)",
        }}
      />

      {/* ── Ceiling volumetric light ── */}
      <div className="absolute top-0 left-0 right-0 h-[50%] ceiling-flicker" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(109,30,212,0.14) 0%, transparent 80%)",
      }} />

      {/* ── Volumetric light cone sweeping ── */}
      <div className="absolute inset-0 light-cone" style={{
        background: "radial-gradient(ellipse 30% 100% at 50% 0%, rgba(109,30,212,0.06) 0%, transparent 70%)",
      }} />

      {/* ── Floor: perspective grid advancing toward camera ── */}
      <div
        className="absolute bottom-0 left-0 right-0 grid-advance"
        style={{
          height: "55%",
          transformOrigin: "50% 100%",
          transform: "perspective(500px) rotateX(72deg) scaleX(2.2)",
          backgroundImage:
            "linear-gradient(rgba(109,30,212,0.2) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(109,30,212,0.2) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
        }}
      />
      {/* Secondary larger cyan grid on floor */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "55%",
          transformOrigin: "50% 100%",
          transform: "perspective(500px) rotateX(72deg) scaleX(2.2)",
          backgroundImage:
            "linear-gradient(rgba(0,200,255,0.06) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(0,200,255,0.06) 1px, transparent 1px)",
          backgroundSize: "240px 240px",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
        }}
      />

      {/* ── Horizon glow line ── */}
      <div className="absolute left-0 right-0" style={{
        top: "42%",
        height: "3px",
        background: "linear-gradient(90deg, transparent 5%, rgba(109,30,212,0.6) 25%, rgba(0,200,255,0.4) 50%, rgba(109,30,212,0.6) 75%, transparent 95%)",
        filter: "blur(2px)",
        boxShadow: "0 0 30px 8px rgba(109,30,212,0.15), 0 0 60px 15px rgba(0,200,255,0.08)",
      }} />
      {/* Thin sharp horizon on top */}
      <div className="absolute left-0 right-0" style={{
        top: "42%",
        height: "1px",
        background: "linear-gradient(90deg, transparent 10%, rgba(109,30,212,0.9) 30%, rgba(0,200,255,0.7) 50%, rgba(109,30,212,0.9) 70%, transparent 90%)",
      }} />

      {/* ── Left wall edge glow ── */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] wall-glow" style={{
        background: "linear-gradient(to bottom, transparent 5%, rgba(109,30,212,0.5) 30%, rgba(0,200,255,0.3) 50%, rgba(109,30,212,0.5) 70%, transparent 95%)",
        boxShadow: "0 0 20px 4px rgba(109,30,212,0.12), 4px 0 30px 2px rgba(109,30,212,0.06)",
      }} />
      {/* ── Right wall edge glow ── */}
      <div className="absolute right-0 top-0 bottom-0 w-[3px] wall-glow" style={{
        background: "linear-gradient(to bottom, transparent 5%, rgba(109,30,212,0.5) 30%, rgba(0,200,255,0.3) 50%, rgba(109,30,212,0.5) 70%, transparent 95%)",
        boxShadow: "0 0 20px 4px rgba(109,30,212,0.12), -4px 0 30px 2px rgba(109,30,212,0.06)",
        animationDelay: "2s",
      }} />

      {/* ── Electrical arcs along horizon ── */}
      <ElectricalArcs />

      {/* ── Vertical scan line ── */}
      <div className="scan-line absolute left-0 right-0 h-[2px] pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(109,30,212,0.4) 20%, rgba(0,200,255,0.3) 50%, rgba(109,30,212,0.4) 80%, transparent)" }}
      />

      {/* ── Horizontal scan line ── */}
      <div className="scan-line-h absolute top-0 bottom-0 w-[2px] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(0,200,255,0.25) 20%, rgba(109,30,212,0.2) 50%, rgba(0,200,255,0.25) 80%, transparent)" }}
      />

      {/* ── Atmospheric haze ── */}
      <div className="absolute inset-0 haze-drift" style={{
        background: "radial-gradient(ellipse 80% 50% at 45% 55%, rgba(109,30,212,0.04) 0%, transparent 70%)",
      }} />
      <div className="absolute inset-0 haze-drift" style={{
        background: "radial-gradient(ellipse 60% 40% at 65% 40%, rgba(0,200,255,0.03) 0%, transparent 60%)",
        animationDelay: "-7s",
      }} />

      {/* ── Depth vignette ── */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
      }} />

      {/* ── CRT scanline overlay (very subtle) ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
        backgroundSize: "100% 4px",
      }} />
    </div>
  )
}

/* ── Electrical Arc Flashes ── */
function ElectricalArcs() {
  const arcs = [
    { top: "41.5%", left: "8%",  width: "12%", delay: "0s",   color: "#6D1ED4" },
    { top: "42.5%", left: "30%", width: "8%",  delay: "1.3s", color: "#00C8FF" },
    { top: "41%",   left: "55%", width: "15%", delay: "2.6s", color: "#6D1ED4" },
    { top: "42%",   left: "78%", width: "10%", delay: "3.8s", color: "#00C8FF" },
    { top: "15%",   left: "0%",  width: "3%",  delay: "1.5s", color: "#6D1ED4" },
    { top: "70%",   right: "0%", width: "4%",  delay: "2.8s", color: "#6D1ED4" },
  ]
  return (
    <>
      {arcs.map((a, i) => (
        <div
          key={i}
          className="absolute h-[1px] electric-arc"
          style={{
            top: a.top,
            left: a.left,
            right: a.right,
            width: a.width,
            background: `linear-gradient(90deg, transparent, ${a.color}, transparent)`,
            filter: `blur(0.5px)`,
            boxShadow: `0 0 8px 2px ${a.color}40`,
            animationDelay: a.delay,
          }}
        />
      ))}
    </>
  )
}

/* ── Multi-depth Particle System ── */
function ParticleField() {
  const particles = useRef(
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 15 + Math.random() * 80,
      size: 0.8 + Math.random() * 2.5,
      delay: Math.random() * 10,
      drift: (Math.random() - 0.5) * 80,
      dur: 5 + Math.random() * 8,
      layer: i % 3,   // 0=far dim, 1=mid, 2=near bright
      color: i % 5 === 0 ? "#00C8FF" : i % 3 === 0 ? "#8B4AE8" : "#6D1ED4",
    }))
  ).current

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * (p.layer === 0 ? 0.5 : p.layer === 1 ? 1 : 1.5),
            height: p.size * (p.layer === 0 ? 0.5 : p.layer === 1 ? 1 : 1.5),
            background: p.color,
            opacity: p.layer === 0 ? 0.3 : p.layer === 1 ? 0.6 : 1,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            filter: p.layer === 0 ? "blur(1px)" : "none",
            animation: `floatParticle ${p.dur}s ease-in-out ${p.delay}s infinite`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Corner Brackets (HUD markers)
   ═══════════════════════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════════════════════
   Live Ledger Panel (right sidebar data feed)
   ═══════════════════════════════════════════════════════════════════════════ */
const LEDGER_LINES = [
  { label: "ROUTE UPLINK",   val: "NOMINAL",  col: "#4ade80" },
  { label: "PROCESSING",     val: "ACTIVE",   col: "#6D1ED4" },
  { label: "LATENCY",        val: "12ms",     col: "#00C8FF" },
  { label: "NODES",          val: "847",      col: "#a78bfa" },
  { label: "ENCRYPT",        val: "AES-256",  col: "#4ade80" },
  { label: "TX POOL",        val: "CLEAR",    col: "#4ade80" },
  { label: "NET STATUS",     val: "OPTIMAL",  col: "#4ade80" },
  { label: "SYNC DELTA",     val: "0.3ms",    col: "#00C8FF" },
  { label: "VAULT SEAL",     val: "LOCKED",   col: "#a78bfa" },
  { label: "SESSION",        val: "ACTIVE",   col: "#4ade80" },
]

function LiveLedgerPanel() {
  const [uptime, setUptime] = useState(99.09)
  useEffect(() => {
    const t = setInterval(() => setUptime(v => Math.min(100, v + (Math.random() - 0.48) * 0.02)), 1800)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative rounded-xl border border-white/[0.06] bg-[rgba(3,4,18,0.92)] backdrop-blur-sm overflow-hidden h-full flex flex-col holo-card-cyan crt-flicker">
      <CornerBrackets color="#00C8FF" size={10} />
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #00C8FF, transparent)" }} />

      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.05]">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3 h-3" style={{ color: "#00C8FF" }} />
          <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-zinc-400">Live Ledger</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 ledger-tick" />
          <span className="text-[9px] font-mono text-emerald-400">{uptime.toFixed(2)}%</span>
        </div>
      </div>

      <div className="px-3 py-1.5 border-b border-white/[0.04]">
        <p className="text-[8px] text-zinc-500 font-mono leading-relaxed">
          Caution: your card was once placed shortly delayed.
          Review is being completed; transaction data may show pending status.
        </p>
      </div>

      <div className="px-3 py-1.5 border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono text-zinc-500 tracking-widest">Route latency:</span>
          <span className="text-[8px] font-mono font-bold text-amber-400 tracking-widest">Downloading...</span>
          <span className="text-[8px] font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-400/10 border border-emerald-400/20">Check log here</span>
        </div>
      </div>

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

      <div className="px-3 py-2 border-t border-white/[0.05]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[8px] font-mono text-zinc-600 tracking-widest">LINQNET OGS</span>
          <span className="text-[8px] font-mono text-zinc-500 tracking-widest">Balance</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-mono text-zinc-400">A</span>
            <span className="text-[8px] font-mono text-zinc-600">dataset</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-mono text-red-400">-20%</span>
            <div className="flex gap-px">
              {[3, 5, 2, 7, 4, 6, 3, 8, 5, 2].map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-sm"
                  style={{ height: `${h * 2}px`, background: i > 6 ? "#ef4444" : "rgba(0,200,255,0.4)" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Account Balance Cards
   ═══════════════════════════════════════════════════════════════════════════ */
function AccountBalancePanel() {
  const [revealed, setRevealed]       = useState(false)
  const [reloadPulse, setReloadPulse] = useState(false)
  const [checkingLive, setCheckingLive] = useState(CHECKING_USD)

  const thresholdUSD  = CHECKING_USD * RELOAD_PCT
  const checkingPct   = (checkingLive / CHECKING_USD) * 100
  const isLow         = checkingLive <= thresholdUSD

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
      <div className={`relative rounded-xl border overflow-hidden transition-all duration-500 glow-pop backdrop-blur-sm ${
        isLow ? "border-amber-500/40 bg-[rgba(20,14,4,0.88)]" : "holo-card-purple bg-[rgba(5,3,18,0.88)]"
      }`} style={{ animationDelay: "0.15s" }}>
        <CornerBrackets color={isLow ? "#f59e0b" : "#6D1ED4"} size={12} />
        <div className="h-px w-full" style={{
          background: isLow
            ? "linear-gradient(90deg, transparent, #f59e0b88, transparent)"
            : "linear-gradient(90deg, transparent, #6D1ED4, transparent)",
        }} />

        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-bold uppercase tracking-[0.14em] text-zinc-200">Checking</span>
                {isLow && (
                  <span className="text-[8px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded uppercase tracking-wide">
                    Low
                  </span>
                )}
              </div>
              <span className="text-[10px] text-zinc-500 tracking-wider">Zelle Network &middot; Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              {reloadPulse && <RefreshCw className="w-3.5 h-3.5 text-[#6D1ED4] animate-spin" />}
              <div className="w-7 h-7 rounded-lg flex items-center justify-center border"
                style={{ background: "rgba(109,30,212,0.12)", borderColor: "rgba(109,30,212,0.25)" }}>
                <Zap className="w-3.5 h-3.5 text-[#8B4AE8]" />
              </div>
            </div>
          </div>

          <button
            onClick={() => setRevealed(v => !v)}
            className="text-left mb-0.5 focus:outline-none group w-full"
            aria-label={revealed ? "Hide balance" : "Reveal balance"}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg text-zinc-400 font-mono">$</span>
              <span className={`font-mono font-bold tracking-tight tabular-nums transition-all duration-300 ${
                revealed ? "text-2xl sm:text-[26px] text-white" : "text-2xl sm:text-[26px] text-zinc-600 group-hover:text-zinc-500"
              }`}>
                {revealed ? (
                  <span style={{ textShadow: "0 0 24px rgba(109,30,212,0.7), 0 0 60px rgba(109,30,212,0.3)" }}>
                    {formatUSD(checkingLive).replace("$", "")}
                  </span>
                ) : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
              </span>
            </div>
          </button>
          <p className="text-[10px] text-zinc-500 mb-4 font-mono tracking-widest">USD &middot; FDIC Insured</p>

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
                  background: isLow ? "#f59e0b" : "linear-gradient(90deg, #6D1ED4, #00C8FF)",
                  boxShadow: isLow ? "0 0 10px #f59e0b" : "0 0 10px #6D1ED4, 0 0 20px rgba(0,200,255,0.3)",
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
      <div className="relative rounded-xl border overflow-hidden holo-card-cyan bg-[rgba(3,5,18,0.88)] backdrop-blur-sm glow-pop" style={{ animationDelay: "0.25s" }}>
        <CornerBrackets color="#00C8FF" size={12} />
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #00C8FF, transparent)" }} />

        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-bold uppercase tracking-[0.14em] text-zinc-200">Savings</span>
                <span className="text-[8px] font-bold bg-white/[0.06] text-zinc-400 border border-white/[0.10] px-1.5 py-0.5 rounded uppercase tracking-wide font-mono">
                  Reserve
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 tracking-wider">Zelle Network &middot; Reserve</span>
            </div>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center border"
              style={{ background: "rgba(0,200,255,0.08)", borderColor: "rgba(0,200,255,0.2)" }}>
              <Lock className="w-3.5 h-3.5" style={{ color: "#00C8FF" }} />
            </div>
          </div>

          <button
            onClick={() => setRevealed(v => !v)}
            className="text-left mb-0.5 focus:outline-none group w-full"
            aria-label={revealed ? "Hide balance" : "Reveal balance"}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg text-zinc-400 font-mono">$</span>
              <span className={`font-mono font-bold tracking-tight tabular-nums transition-all duration-300 text-2xl sm:text-[26px] ${
                revealed ? "text-zinc-200" : "text-zinc-600 group-hover:text-zinc-500"
              }`}>
                {revealed ? (
                  <span style={{ textShadow: "0 0 24px rgba(0,200,255,0.5), 0 0 60px rgba(0,200,255,0.2)" }}>
                    {formatUSD(SAVINGS_USD).replace("$", "")}
                  </span>
                ) : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
              </span>
            </div>
          </button>
          <p className="text-[10px] text-zinc-500 mb-4 font-mono tracking-widest">USD &middot; FDIC Insured</p>

          <div className="flex items-start gap-2 p-2.5 rounded-lg border"
            style={{ background: "rgba(0,200,255,0.05)", borderColor: "rgba(0,200,255,0.12)" }}>
            <RefreshCw className="w-3 h-3 mt-0.5 shrink-0" style={{ color: "#00C8FF" }} />
            <p className="text-[9px] text-zinc-400 leading-relaxed font-mono">
              Auto-reloads Checking below{" "}
              <span className="text-zinc-200 font-bold">{formatUSD(CHECKING_USD * RELOAD_PCT)}</span>
              {" "}(20% threshold)
            </p>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-zinc-500" />
            <span className="text-[9px] text-zinc-500 font-mono tracking-wider">Funds securely held &middot; FDIC insured</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Sidebar Navigation
   ═══════════════════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",  active: true  },
  { icon: SendIcon,        label: "Payments",   href: "/send" },
  { icon: Building2,       label: "Banking",    href: "/connect-bank" },
  { icon: History,         label: "History",     href: "/history" },
  { icon: Users,           label: "Contacts",   href: "/recipients" },
  { icon: Settings,        label: "Settings",   href: "/admin" },
]

function Sidebar({ onNav }: { onNav: (href: string) => void }) {
  return (
    <aside
      className="hidden lg:flex flex-col gap-1 py-5 px-3 border-r border-white/[0.04] w-[160px] shrink-0 relative z-30"
      style={{ background: "rgba(3,3,16,0.95)", backdropFilter: "blur(12px)" }}
      aria-label="Main navigation"
    >
      {/* Z logo */}
      <div className="flex items-center gap-2.5 px-2 mb-5">
        <div className="w-9 h-9 bg-[#6D1ED4] rounded-xl flex items-center justify-center shrink-0"
          style={{ boxShadow: "0 0 20px rgba(109,30,212,0.7), 0 0 40px rgba(109,30,212,0.3)" }}>
          <span className="text-white font-black text-lg leading-none">Z</span>
        </div>
        <span className="text-[13px] font-bold text-white tracking-wide">Zelle</span>
      </div>

      {NAV_ITEMS.map(({ icon: Icon, label, active, href }) => (
        <button
          key={label}
          onClick={() => href && onNav(href)}
          title={label}
          aria-label={label}
          aria-current={active ? "page" : undefined}
          className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D1ED4] ${
            active
              ? "bg-[#6D1ED4]/15 border border-[#6D1ED4]/30"
              : "hover:bg-white/[0.04] border border-transparent"
          }`}
        >
          <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#8B4AE8]" : "text-zinc-500 group-hover:text-zinc-300"} transition-colors`} />
          <span className={`text-[12px] font-medium tracking-wide ${active ? "text-[#8B4AE8]" : "text-zinc-500 group-hover:text-zinc-300"} transition-colors`}>
            {label}
          </span>
          {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-l-full bg-[#6D1ED4]" />}
        </button>
      ))}
    </aside>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Action Buttons (bottom dock)
   ═══════════════════════════════════════════════════════════════════════════ */
const ACTION_BTNS = [
  { label: "Send Payment",   icon: SendIcon,    href: "/send",           color: "#6D1ED4", glow: "rgba(109,30,212,0.4)" },
  { label: "Receive Funds",  icon: DollarSign,  href: "/deposit-portal", color: "#00C8FF", glow: "rgba(0,200,255,0.35)" },
  { label: "Link Bank",      icon: CreditCard,  href: "/connect-bank",   color: "#8B4AE8", glow: "rgba(139,74,232,0.35)" },
  { label: "Statements",     icon: FileText,    href: "/reports",        color: "#4ade80", glow: "rgba(74,222,128,0.3)" },
]

function ActionButtons({ onNav }: { onNav: (href: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full">
      {ACTION_BTNS.map(({ label, icon: Icon, href, color, glow }, i) => (
        <button
          key={label}
          onClick={() => onNav(href)}
          className="group flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border text-[12px] sm:text-[13px] font-bold tracking-wide uppercase transition-all duration-200 glow-pop hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 backdrop-blur-sm"
          style={{
            borderColor: `${color}40`,
            background: `${color}0d`,
            color,
            animationDelay: `${0.35 + i * 0.08}s`,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = `${color}1a`
            e.currentTarget.style.boxShadow  = `0 0 20px ${glow}, inset 0 0 14px ${color}0d`
            e.currentTarget.style.borderColor = `${color}80`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background  = `${color}0d`
            e.currentTarget.style.boxShadow   = "none"
            e.currentTarget.style.borderColor = `${color}40`
          }}
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span className="hidden xs:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Boot Loader (entry sequence)
   ═══════════════════════════════════════════════════════════════════════════ */
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
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
      <DigitalRoom />
      <ParticleField />
      <div className="relative flex flex-col items-center gap-6 z-10">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#6D1ED4]/20 orbit-ring" />
          <div className="absolute inset-[-12px] rounded-full border border-[#6D1ED4]/10 orbit-ring" style={{ animationDirection: "reverse", animationDuration: "12s" }} />
          <div className="w-16 h-16 bg-[#6D1ED4] rounded-2xl flex items-center justify-center"
            style={{ boxShadow: "0 0 50px rgba(109,30,212,0.9), 0 0 100px rgba(109,30,212,0.3), inset 0 0 20px rgba(139,74,232,0.3)" }}>
            <span className="text-white font-black text-3xl leading-none">Z</span>
          </div>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-base font-bold text-white tracking-[0.25em] uppercase font-mono">
            Zelle Disbursement Portal
          </h2>
          {BOOT_LINES.slice(0, phase + 1).map((line, i) => (
            <p key={i} className="text-[10px] font-mono tracking-widest" style={{ color: i === phase ? "#00C8FF" : "#3f3f46" }}>
              {line}
            </p>
          ))}
        </div>
        <div className="w-48 sm:w-64 space-y-1.5">
          <div className="h-[2px] bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #6D1ED4, #00C8FF)",
                boxShadow: "0 0 12px #6D1ED4, 0 0 24px rgba(0,200,255,0.4)",
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

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════════════════════════════ */
function DashboardContent() {
  const { user, logout } = useAuth()
  const router           = useRouter()
  const [isLoading, setIsLoading]     = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleLogout = () => { logout(); router.push("/login") }
  const handleNav    = useCallback((href: string) => router.push(href), [router])

  const fmt = (d: Date) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
  const fmtDate = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })

  if (isLoading) return <ZelleLoader onComplete={() => setIsLoading(false)} />

  return (
    <div className="fixed inset-0 overflow-hidden flex crt-flicker">

      {/* ── Full 3D Room Environment ── */}
      <DigitalRoom />
      <ParticleField />

      {/* ── Sidebar ── */}
      <Sidebar onNav={handleNav} />

      {/* ── Content Area ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative z-10">

        {/* ── Cinematic Clock ── */}
        <div className="relative z-10 flex flex-col items-center pt-4 sm:pt-6 pb-2">
          <p className="text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight tabular-nums font-mono"
            style={{ textShadow: "0 0 40px rgba(109,30,212,0.5), 0 0 80px rgba(109,30,212,0.2), 0 2px 4px rgba(0,0,0,0.5)" }}>
            {fmt(currentTime)}
          </p>
          <p className="text-[11px] sm:text-[12px] text-zinc-500 font-mono tracking-[0.2em] mt-1">{fmtDate(currentTime)}</p>
        </div>

        {/* ── User bar ── */}
        <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-1.5 shrink-0">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 bg-[#6D1ED4] rounded-lg flex items-center justify-center"
              style={{ boxShadow: "0 0 14px rgba(109,30,212,0.6)" }}>
              <span className="text-white font-black text-sm leading-none">Z</span>
            </div>
            <span className="text-[11px] font-bold text-white tracking-wide">Zelle</span>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-right">
              <p className="text-[11px] font-semibold text-white leading-none mb-0.5 truncate max-w-[140px]">{user?.name}</p>
              <p className="text-[9px] text-zinc-500 font-mono leading-none truncate max-w-[140px]">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Sign out"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] hover:bg-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-all duration-200 text-[11px] font-medium backdrop-blur-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        {/* ── Main Scroll Area ── */}
        <main className="flex-1 overflow-y-auto relative z-10 pb-24" aria-label="Dashboard content">
          <div className="max-w-6xl mx-auto px-3 sm:px-5 py-3 space-y-3">

            {/* Portal header */}
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
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="text-[9px] text-zinc-600 font-mono tracking-widest">Powered by</span>
                  <span className="text-[9px] font-bold text-[#00C8FF] font-mono tracking-widest">CBS</span>
                  <span className="text-[9px] font-bold text-zinc-400 font-mono tracking-widest border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 rounded">CREDSEC</span>
                </div>
              </div>
            </div>

            {/* ── Account Cards + Ledger ── */}
            <div className="flex gap-3 items-stretch">
              <div className="flex-1 min-w-0">
                <AccountBalancePanel />
              </div>
              <div className="hidden xl:flex w-[220px] shrink-0" style={{ minHeight: "280px" }}>
                <LiveLedgerPanel />
              </div>
            </div>

            {/* ── Action Buttons ── */}
            <div className="pt-1">
              <ActionButtons onNav={handleNav} />
            </div>

            {/* Mobile ledger fallback */}
            <div className="xl:hidden" style={{ height: "200px" }}>
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

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
