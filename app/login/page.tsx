"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth/context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertCircle,
  SendIcon,
  DollarSign,
  CreditCard,
  History,
  Users,
  FileText,
  Bell,
  ShieldCheck,
  BarChart3,
  Mail,
  Settings,
} from "lucide-react"

const featureItems = [
  { icon: SendIcon, label: "Send e-Transfer", color: "text-blue-400" },
  { icon: DollarSign, label: "Deposit Money", color: "text-green-400" },
  { icon: CreditCard, label: "Connect Bank", color: "text-purple-400" },
  { icon: History, label: "Depository History", color: "text-orange-400" },
  { icon: Users, label: "Manage Recipients", color: "text-cyan-400" },
  { icon: FileText, label: "Transaction Reports", color: "text-indigo-400" },
  { icon: Bell, label: "Notifications", color: "text-yellow-400" },
  { icon: ShieldCheck, label: "Security Settings", color: "text-red-400" },
  { icon: BarChart3, label: "Analytics", color: "text-teal-400" },
  { icon: Mail, label: "Email Templates", color: "text-pink-400" },
  { icon: Settings, label: "Admin Dashboard", color: "text-slate-400" },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-center">
        {/* Left side - Feature showcase */}
        <div className="flex-1 hidden lg:block">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-[#FDB913] rounded-lg flex items-center justify-center p-2">
                <img
                  src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
                  alt="Interac"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Interac Partner Network</h1>
                <p className="text-zinc-400 text-sm">Secure Financial Gateway</p>
              </div>
            </div>
            <p className="text-zinc-300 text-lg mb-6">
              Access all your financial tools in one secure platform
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {featureItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <IconComponent className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="text-sm text-zinc-300">{item.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full max-w-md">
          <Card className="border-2 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm shadow-2xl shadow-black/50">
            <CardHeader className="space-y-2 text-center pb-4">
              <div className="flex justify-center mb-4 lg:hidden">
                <div className="w-16 h-16 bg-[#FDB913] rounded-lg flex items-center justify-center p-3">
                  <img
                    src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
                    alt="Interac"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
              <CardDescription className="text-zinc-400">Sign in to access your partner portal</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#FDB913] focus:ring-[#FDB913]/20"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#FDB913] focus:ring-[#FDB913]/20"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-950/50 border border-red-900/50 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#FDB913] text-[#1a1a1a] hover:bg-[#e5a811] font-semibold h-11 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                {/* Mobile feature icons */}
                <div className="lg:hidden pt-4 border-t border-zinc-800">
                  <p className="text-xs text-zinc-500 text-center mb-3">Available Services</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {featureItems.slice(0, 6).map((item, index) => {
                      const IconComponent = item.icon
                      return (
                        <div
                          key={index}
                          className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center"
                          title={item.label}
                        >
                          <IconComponent className={`w-4 h-4 ${item.color}`} />
                        </div>
                      )
                    })}
                    <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">
                      +5
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-zinc-500 mt-6">
                  QuantumYield Innovation Technology Holdings
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
