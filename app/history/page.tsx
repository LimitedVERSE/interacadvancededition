"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Search, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface DepositHistory {
  id: string
  transferId: string
  amount: string
  recipient: string
  recipientName: string
  bankName: string
  message: string
  timestamp: string
  status: "pending" | "completed" | "failed"
}

function HistoryContent() {
  const router = useRouter()
  const [deposits, setDeposits] = useState<DepositHistory[]>([])
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "failed">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAmounts, setShowAmounts] = useState(true)

  useEffect(() => {
    const storedHistory = localStorage.getItem("depositHistory")
    if (storedHistory) {
      setDeposits(JSON.parse(storedHistory))
    }
  }, [])

  const filteredDeposits = deposits.filter((deposit) => {
    const matchesFilter = filter === "all" || deposit.status === filter
    const matchesSearch =
      searchTerm === "" ||
      deposit.transferId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.recipient.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="gap-2 border-zinc-800 hover:bg-zinc-900 text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#6D1ED4] rounded-xl flex items-center justify-center shadow-lg shadow-[#6D1ED4]/30">
                <span className="text-white font-black text-2xl leading-none">Z</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Depository History</h1>
                <p className="text-sm text-zinc-400">View and manage your transfer history</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by ID, name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#6D1ED4] focus:ring-2 focus:ring-[#6D1ED4]/20"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAmounts(!showAmounts)}
                variant="outline"
                className="gap-2 border-zinc-800 hover:bg-zinc-900 text-white"
              >
                {showAmounts ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {showAmounts ? "Hide" : "Show"} Amounts
              </Button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "completed", "failed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? "bg-[#6D1ED4] text-white"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredDeposits.length === 0 ? (
          <Card className="border-2 border-zinc-800 bg-zinc-900/50">
            <CardContent className="py-12 text-center">
              <p className="text-zinc-400 text-lg">No deposits found</p>
              <p className="text-zinc-500 text-sm mt-2">
                {filter !== "all" ? "Try changing the filter" : "Your deposit history will appear here"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredDeposits.map((deposit) => (
              <Card
                key={deposit.id}
                className="border-2 border-zinc-800 hover:border-[#6D1ED4] transition-colors bg-zinc-900/50 backdrop-blur-sm cursor-pointer"
                onClick={() =>
                  router.push(
                    `/deposit-portal?transferId=${deposit.transferId}&amount=${deposit.amount}&recipient=${deposit.recipient}&recipientName=${encodeURIComponent(deposit.recipientName)}&bankName=${encodeURIComponent(deposit.bankName)}&message=${encodeURIComponent(deposit.message)}&timestamp=${deposit.timestamp}`,
                  )
                }
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-white text-lg">{deposit.recipientName}</CardTitle>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(deposit.status)}`}
                        >
                          {deposit.status}
                        </span>
                      </div>
                      <CardDescription className="text-zinc-400">{deposit.recipient}</CardDescription>
                      <p className="text-sm font-mono text-zinc-500">{deposit.transferId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        {showAmounts ? `$${Number.parseFloat(deposit.amount).toFixed(2)}` : "••••••"}
                      </p>
                      <p className="text-sm text-zinc-400">USD</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="border-t border-zinc-800 pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-zinc-500">Bank</p>
                      <p className="text-white font-medium">{deposit.bankName}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Date</p>
                      <p className="text-white font-medium">{new Date(deposit.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Time</p>
                      <p className="text-white font-medium">{new Date(deposit.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-zinc-500">Message</p>
                      <p className="text-white font-medium truncate">{deposit.message || "No message"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <HistoryContent />
    </ProtectedRoute>
  )
}
