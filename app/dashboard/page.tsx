"use client"

import { useAuth } from "@/lib/auth/context"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SendIcon, DollarSign, CreditCard, History, Settings, LogOut, ArrowRight } from "lucide-react"

const menuItems = [
  {
    id: "send",
    title: "Send e-Transfer",
    description: "Send money via Interac e-Transfer to recipients",
    icon: SendIcon,
    href: "/send",
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "deposit",
    title: "Deposit Money",
    description: "Deposit received e-Transfers to your account",
    icon: DollarSign,
    href: "/deposit-portal",
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    id: "bank-connect",
    title: "Connect Bank",
    description: "Connect your financial institution securely",
    icon: CreditCard,
    href: "/",
    color: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    id: "history",
    title: "Transaction History",
    description: "View your recent transfers and deposits",
    icon: History,
    href: "/admin",
    color: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    id: "admin",
    title: "Admin Dashboard",
    description: "Manage transfers and email templates",
    icon: Settings,
    href: "/admin",
    color: "bg-slate-50",
    iconColor: "text-slate-600",
  },
]

function DashboardContent() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FDB913] rounded-lg flex items-center justify-center p-2">
                <img
                  src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
                  alt="Interac Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Interac Partner Network</h1>
                <p className="text-sm text-muted-foreground">Dashboard Lobby</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2 border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-lg text-muted-foreground">
            Select a service to get started with your Interac transactions
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Card
                key={item.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-[#FDB913]"
                onClick={() => router.push(item.href)}
              >
                <CardHeader>
                  <div className={`w-14 h-14 ${item.color} rounded-lg flex items-center justify-center mb-3`}>
                    <IconComponent className={`w-7 h-7 ${item.iconColor}`} />
                  </div>
                  <CardTitle className="text-xl group-hover:text-[#FDB913] transition-colors">{item.title}</CardTitle>
                  <CardDescription className="text-base">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full gap-2 bg-[#FDB913] text-[#1a1a1a] hover:bg-[#e5a811] group-hover:translate-x-1 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(item.href)
                    }}
                  >
                    Access Now
                    <ArrowRight className="w-4 h-4" />
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
