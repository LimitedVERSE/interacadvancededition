"use client"

import type React from "react"

import { useAuth } from "@/lib/auth/context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading, isAdmin, getAccessSource } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
        return
      }

      // If this route requires admin and user is not admin
      if (requireAdmin && !isAdmin) {
        // Non-admin users attempting to access admin features are redirected
        router.push("/deposit-portal/client")
        return
      }

      // Prevent client portal users from accessing admin/send/dashboard routes via browser history
      const source = getAccessSource()
      if (source === "client" && (requireAdmin || window.location.pathname.includes("/send") || window.location.pathname.includes("/dashboard"))) {
        router.push("/deposit-portal/client")
        return
      }
    }
  }, [user, isLoading, isAdmin, requireAdmin, getAccessSource, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#6D1ED4] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || (requireAdmin && !isAdmin)) {
    return null
  }

  return <>{children}</>
}
