"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { signUp } from "@/lib/actions/auth"
import {
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Zap,
  Lock,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"

const trustItems = [
  { icon: Shield, label: "Bank-grade encryption" },
  { icon: Zap,    label: "Instant transfers"      },
  { icon: Lock,   label: "2-step verification"    },
]

export default function SignupPage() {
  const [showPassword, setShowPw] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    
    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    
    startTransition(async () => {
      const result = await signUp(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(true)
      }
    })
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-[400px] text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Check your email</h2>
          <p className="text-zinc-400 text-[15px] leading-relaxed mb-8">
            {"We've sent a confirmation link to your email address. Please click the link to verify your account."}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-[#FDB913] hover:text-[#e5a811] font-medium transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-5 py-10 relative">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-[#FDB913]/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
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
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight mb-1.5">Create your account</h2>
          <p className="text-[14px] text-zinc-500">Get started with Interac e-Transfer</p>
        </div>

        {/* Form card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/60">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="block text-[13px] font-medium text-zinc-300">
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="John Smith"
                required
                disabled={isPending}
                className="w-full h-11 px-3.5 rounded-xl bg-white/[0.05] border border-white/[0.09] text-[14px] text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#FDB913]/40 focus:border-[#FDB913]/40 transition-all disabled:opacity-50"
                style={{ fontSize: "16px" }}
              />
            </div>

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
              <label htmlFor="password" className="block text-[13px] font-medium text-zinc-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-[13px] font-medium text-zinc-300">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                required
                disabled={isPending}
                className="w-full h-11 px-3.5 rounded-xl bg-white/[0.05] border border-white/[0.09] text-[14px] text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#FDB913]/40 focus:border-[#FDB913]/40 transition-all disabled:opacity-50"
                style={{ fontSize: "16px" }}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-[13px] text-red-400 leading-snug">{error}</p>
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
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
            <p className="text-[13px] text-zinc-500">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="text-[#FDB913] hover:text-[#e5a811] font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mt-8">
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

        {/* Footer */}
        <p className="text-center text-[11px] text-zinc-500 mt-6">
          Interac e-Transfer &middot; Secure Payment Services
        </p>
      </div>
    </div>
  )
}
