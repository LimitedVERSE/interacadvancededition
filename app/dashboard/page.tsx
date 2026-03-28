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
} from "lucide-react"
import { useState, useEffect } from "react"

const menuItems = [
  {
    id: "send",
    title: "Send e-Transfer",
    icon: SendIcon,
    href: "/send",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-400",
  },
  {
    id: "deposit",
    title: "Deposit Money",
    icon: DollarSign,
    href: "/deposit-portal",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-500/10",
    iconColor: "text-green-400",
  },
  {
    id: "bank-connect",
    title: "Connect Bank",
    icon: CreditCard,
    href: "/connect-bank",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500/10",
    iconColor: "text-purple-400",
  },
  {
    id: "history",
    title: "Depository History",
    icon: History,
    href: "/history",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-500/10",
    iconColor: "text-orange-400",
  },
  {
    id: "recipients",
    title: "Manage Recipients",
    icon: Users,
    href: "/recipients",
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
  },
  {
    id: "reports",
    title: "Transaction Reports",
    icon: FileText,
    href: "/reports",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    href: "/notifications",
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-500/10",
    iconColor: "text-yellow-400",
  },
  {
    id: "security",
    title: "Security Settings",
    icon: ShieldCheck,
    href: "/security",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-500/10",
    iconColor: "text-red-400",
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: BarChart3,
    href: "/analytics",
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-500/10",
    iconColor: "text-teal-400",
  },
  {
    id: "email-studio",
    title: "Email Studio",
    icon: Mail,
    href: "/email-studio",
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-500/10",
    iconColor: "text-pink-400",
  },
  {
    id: "admin",
    title: "Admin Dashboard",
    icon: Settings,
    href: "/admin",
    color: "from-slate-500 to-slate-600",
    bgColor: "bg-slate-500/10",
    iconColor: "text-slate-400",
  },
]

function InteracLoader({ onComplete }: { onComplete: () => void }) {
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
        {/* Animated Interac Logo */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#FDB913] rounded-2xl flex items-center justify-center p-4 sm:p-5 animate-pulse shadow-lg shadow-[#FDB913]/30">
            <img
              src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
              alt="Interac"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Spinning ring */}
          <div className="absolute -inset-3 border-4 border-transparent border-t-[#FDB913] rounded-full animate-spin" />
          <div
            className="absolute -inset-6 border-2 border-transparent border-t-[#FDB913]/50 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          />
        </div>

        {/* Loading text */}
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Interac Partner Network</h2>
          <p className="text-zinc-400 text-sm sm:text-base">Initializing secure session...</p>
        </div>

        {/* Progress bar */}
        <div className="w-48 sm:w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FDB913] to-[#e5a811] rounded-full transition-all duration-100 ease-out"
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
  const [isHovered, setIsHovered] = useState(false)
  const IconComponent = item.icon

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FDB913]/50"
      style={{
        animationDelay: `${index * 50}ms`,
        animation: "fadeInUp 0.5s ease-out forwards",
        opacity: 0,
      }}
    >
      {/* Icon container */}
      <div
        className={`relative w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-2xl ${item.bgColor} flex items-center justify-center transition-all duration-300 group-hover:shadow-lg`}
        style={{
          boxShadow: isHovered ? `0 8px 32px -8px ${item.iconColor.replace("text-", "rgb(var(--")})` : "none",
        }}
      >
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />
        <IconComponent
          className={`relative z-10 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 ${item.iconColor} group-hover:text-white transition-colors duration-300`}
        />
      </div>

      {/* Label */}
      <span className="text-xs sm:text-sm font-medium text-zinc-400 group-hover:text-white transition-colors duration-300 text-center leading-tight max-w-[80px] sm:max-w-[100px]">
        {item.title}
      </span>
    </button>
  )
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
    return <InteracLoader onComplete={() => setIsLoading(false)} />
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
    <div className="fixed inset-0 bg-black overflow-hidden flex flex-col">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[#FDB913]/5 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/5 via-transparent to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FDB913] rounded-xl flex items-center justify-center p-2 shadow-lg shadow-[#FDB913]/20">
            <img
              src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
              alt="Interac"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-xl font-bold text-white">Partner Network</h1>
            <p className="text-xs text-zinc-500">Secure Gateway</p>
          </div>
        </div>

        {/* Time display */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center hidden md:block">
          <p className="text-3xl lg:text-4xl font-light text-white tracking-tight">{formatTime(currentTime)}</p>
          <p className="text-xs text-zinc-500">{formatDate(currentTime)}</p>
        </div>

        {/* User info & logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white truncate max-w-[120px]">{user?.name}</p>
            <p className="text-xs text-zinc-500 truncate max-w-[120px]">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-red-900/50 hover:bg-red-950/30 text-zinc-400 hover:text-red-400 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile time display */}
      <div className="md:hidden text-center py-2">
        <p className="text-2xl font-light text-white tracking-tight">{formatTime(currentTime)}</p>
        <p className="text-xs text-zinc-500">{formatDate(currentTime)}</p>
      </div>

      {/* Main content - App Grid */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-4">
        {/* Welcome message */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white mb-1">
            Welcome, {user?.name?.split(" ")[0]}
          </h2>
          <p className="text-sm sm:text-base text-zinc-500">Select a service to continue</p>
        </div>

        {/* App Grid */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 justify-items-center">
            {menuItems.map((item, index) => (
              <AppGridItem key={item.id} item={item} index={index} onClick={() => router.push(item.href)} />
            ))}
          </div>
        </div>

        {/* Footer branding */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs text-zinc-600">QuantumYield Innovation Technology Holdings</p>
        </div>
      </main>

      {/* Bottom safe area indicator */}
      <div className="relative z-10 flex justify-center pb-4 sm:pb-6">
        <div className="w-32 h-1 rounded-full bg-zinc-800" />
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
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
