"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { Loader2 } from "lucide-react"

/**
 * /deposit-portal — smart router
 *
 * Logged-in admin  → /deposit-portal/admin   (full management view, custom amount composer, deposit history)
 * Not logged in    → /deposit-portal/client  (public client view, URL-param driven, no auth required)
 *
 * All existing URL params (transferId, amount, recipient, etc.) are preserved
 * and forwarded to whichever sub-route is selected.
 */
function DepositPortalRouter() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (isLoading) return
    // Preserve all query params when redirecting
    const qs = searchParams.toString()
    const suffix = qs ? `?${qs}` : ""
    if (user) {
      router.replace(`/deposit-portal/admin${suffix}`)
    } else {
      router.replace(`/deposit-portal/client${suffix}`)
    }
  }, [user, isLoading, router, searchParams])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#FDB913]" />
    </div>
  )
}

export default function DepositPortalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FDB913]" />
      </div>
    }>
      <DepositPortalRouter />
    </Suspense>
  )
}
