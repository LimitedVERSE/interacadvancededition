"use client"

import { useAuth } from "@/lib/auth/context"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SendIcon, DollarSign, CreditCard, History, Settings, LogOut, ArrowRight } from "lucide-react"
import { useState } from "react"

const menuItems = [
  {
    id: "send",
    title: "Send e-Transfer",
    description: "Send money via Interac e-Transfer to recipients",
    icon: SendIcon,
    href: "/send",
    color: "bg-blue-950/50",
    iconColor: "text-blue-400",
  },
  {
    id: "deposit",
    title: "Deposit Money",
    description: "Deposit received e-Transfers to your account",
    icon: DollarSign,
    href: "/deposit-portal",
    color: "bg-green-950/50",
    iconColor: "text-green-400",
  },
  {
    id: "bank-connect",
    title: "Connect Bank",
    description: "Connect your financial institution securely",
    icon: CreditCard,
    href: "/",
    color: "bg-purple-950/50",
    iconColor: "text-purple-400",
  },
  {
    id: "history",
    title: "Transaction History",
    description: "View your recent transfers and deposits",
    icon: History,
    href: "/admin",
    color: "bg-orange-950/50",
    iconColor: "text-orange-400",
  },
  {
    id: "admin",
    title: "Admin Dashboard",
    description: "Manage transfers and email templates",
    icon: Settings,
    href: "/admin",
    color: "bg-slate-800/50",
    iconColor: "text-slate-400",
  },
]

function DashboardContent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6 max-w-7xl">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FDB913] rounded-lg flex items-center justify-center p-1.5 sm:p-2 flex-shrink-0">
                <img
                  src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
                  alt="Interac Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-white truncate">Interac Partner Network</h1>
                <p className="text-xs sm:text-sm text-zinc-400 hidden sm:block">Dashboard Lobby</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white truncate max-w-[150px]">{user?.name}</p>
                <p className="text-xs text-zinc-400 truncate max-w-[150px]">{user?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2 border-red-900/50 hover:bg-red-950/50 text-red-400 hover:text-red-300 bg-transparent text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>

          <div className="md:hidden mt-3 pt-3 border-t border-zinc-800 text-center">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 max-w-7xl">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h2>
          <p className="text-base sm:text-lg text-zinc-400">Select a service to get started</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Card
                key={item.id}
                className="group hover:shadow-2xl hover:shadow-[#FDB913]/20 transition-all duration-300 cursor-pointer border-2 border-zinc-800 hover:border-[#FDB913] active:scale-95 sm:active:scale-100 bg-zinc-900/50 backdrop-blur-sm"
                onClick={() => router.push(item.href)}
              >
                <CardHeader className="p-4 sm:p-6">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 ${item.color} rounded-lg flex items-center justify-center mb-2 sm:mb-3 flex-shrink-0 border border-zinc-800`}
                  >
                    <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 ${item.iconColor}`} />
                  </div>
                  <CardTitle className="text-lg sm:text-xl group-hover:text-[#FDB913] transition-colors line-clamp-2 text-white">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base line-clamp-2 text-zinc-400">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <Button
                    className="w-full gap-2 bg-[#FDB913] text-[#1a1a1a] hover:bg-[#e5a811] group-hover:translate-x-1 transition-transform text-sm sm:text-base"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(item.href)
                    }}
                  >
                    Access Now
                    <ArrowRight className="w-4 h-4 flex-shrink-0" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
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
