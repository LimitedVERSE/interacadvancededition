"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, DollarSign, Users, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface AnalyticsData {
  totalSent: number
  totalReceived: number
  totalTransactions: number
  uniqueRecipients: number
  avgTransactionAmount: number
}

function AnalyticsContent() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalSent: 0,
    totalReceived: 0,
    totalTransactions: 0,
    uniqueRecipients: 0,
    avgTransactionAmount: 0,
  })

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("depositHistory") || "[]")
    const recipients = JSON.parse(localStorage.getItem("recipients") || "[]")

    const totalReceived = history.reduce((sum: number, item: any) => sum + Number.parseFloat(item.amount), 0)
    const totalTransactions = history.length

    setAnalytics({
      totalSent: 0,
      totalReceived,
      totalTransactions,
      uniqueRecipients: recipients.length,
      avgTransactionAmount: totalTransactions > 0 ? totalReceived / totalTransactions : 0,
    })
  }, [])

  const stats = [
    {
      title: "Total Sent",
      value: `$${analytics.totalSent.toFixed(2)}`,
      icon: ArrowUpRight,
      color: "text-red-400",
      bgColor: "bg-red-950/50",
    },
    {
      title: "Total Received",
      value: `$${analytics.totalReceived.toFixed(2)}`,
      icon: ArrowDownRight,
      color: "text-green-400",
      bgColor: "bg-green-950/50",
    },
    {
      title: "Total Transactions",
      value: analytics.totalTransactions,
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-950/50",
    },
    {
      title: "Unique Recipients",
      value: analytics.uniqueRecipients,
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-950/50",
    },
    {
      title: "Average Amount",
      value: `$${analytics.avgTransactionAmount.toFixed(2)}`,
      icon: DollarSign,
      color: "text-cyan-400",
      bgColor: "bg-cyan-950/50",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/dashboard")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Analytics</h1>
              <p className="text-sm text-zinc-400">View your transaction statistics and insights</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const IconComponent = stat.icon
            return (
              <Card key={stat.title} className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-zinc-400">{stat.title}</CardDescription>
                    <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-3xl text-white">{stat.value}</CardTitle>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mt-6 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Transaction Insights</CardTitle>
            <CardDescription className="text-zinc-400">View detailed analytics and spending patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-zinc-500">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
              <p>Advanced analytics coming soon</p>
              <p className="text-sm mt-2">Charts and graphs will be available in the next update</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsContent />
    </ProtectedRoute>
  )
}
