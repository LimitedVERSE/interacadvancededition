"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, Download, Calendar, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

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

type DownloadState = "idle" | "downloading" | "done" | "empty"

function getTransactions(): DepositHistory[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem("depositHistory")
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function triggerDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function downloadTransactionHistory(transactions: DepositHistory[]) {
  const header = "Transfer ID,Recipient Name,Recipient Email,Amount (CAD),Bank,Status,Date,Time,Message"
  const rows = transactions.map((t) => {
    const date = new Date(t.timestamp)
    return [
      t.transferId,
      `"${t.recipientName}"`,
      t.recipient,
      Number.parseFloat(t.amount).toFixed(2),
      `"${t.bankName}"`,
      t.status,
      date.toLocaleDateString("en-CA"),
      date.toLocaleTimeString("en-CA"),
      `"${(t.message || "").replace(/"/g, '""')}"`,
    ].join(",")
  })
  const csv = [header, ...rows].join("\n")
  triggerDownload(`interac-transaction-history-${new Date().toISOString().slice(0, 10)}.csv`, csv, "text/csv")
}

function downloadMonthlySummary(transactions: DepositHistory[]) {
  // Group by year-month
  const months: Record<string, { completed: number; pending: number; failed: number; total: number; count: number }> =
    {}
  for (const t of transactions) {
    const d = new Date(t.timestamp)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (!months[key]) months[key] = { completed: 0, pending: 0, failed: 0, total: 0, count: 0 }
    const amt = Number.parseFloat(t.amount) || 0
    months[key].count++
    months[key].total += amt
    if (t.status === "completed") months[key].completed += amt
    else if (t.status === "pending") months[key].pending += amt
    else if (t.status === "failed") months[key].failed += amt
  }

  const sortedKeys = Object.keys(months).sort()
  const header = "Month,Transactions,Total (CAD),Completed (CAD),Pending (CAD),Failed (CAD)"
  const rows = sortedKeys.map((k) => {
    const m = months[k]
    const [year, month] = k.split("-")
    const label = new Date(Number(year), Number(month) - 1, 1).toLocaleString("en-CA", {
      month: "long",
      year: "numeric",
    })
    return [
      `"${label}"`,
      m.count,
      m.total.toFixed(2),
      m.completed.toFixed(2),
      m.pending.toFixed(2),
      m.failed.toFixed(2),
    ].join(",")
  })

  const grandTotal = transactions.reduce((s, t) => s + (Number.parseFloat(t.amount) || 0), 0)
  const footer = `"TOTAL",${transactions.length},${grandTotal.toFixed(2)},,,`
  const csv = [header, ...rows, "", footer].join("\n")
  triggerDownload(
    `interac-monthly-summary-${new Date().toISOString().slice(0, 10)}.csv`,
    csv,
    "text/csv",
  )
}

function downloadAnnualReport(transactions: DepositHistory[]) {
  // Group by year
  const years: Record<
    string,
    {
      completed: { count: number; total: number }
      pending: { count: number; total: number }
      failed: { count: number; total: number }
      months: Record<string, number>
    }
  > = {}

  for (const t of transactions) {
    const d = new Date(t.timestamp)
    const year = String(d.getFullYear())
    const monthKey = String(d.getMonth() + 1).padStart(2, "0")
    if (!years[year]) {
      years[year] = {
        completed: { count: 0, total: 0 },
        pending: { count: 0, total: 0 },
        failed: { count: 0, total: 0 },
        months: {},
      }
    }
    const amt = Number.parseFloat(t.amount) || 0
    years[year].months[monthKey] = (years[year].months[monthKey] || 0) + amt
    if (t.status === "completed") {
      years[year].completed.count++
      years[year].completed.total += amt
    } else if (t.status === "pending") {
      years[year].pending.count++
      years[year].pending.total += amt
    } else {
      years[year].failed.count++
      years[year].failed.total += amt
    }
  }

  const lines: string[] = []
  lines.push("INTERAC E-TRANSFER — ANNUAL FINANCIAL REPORT")
  lines.push(`Generated: ${new Date().toLocaleString("en-CA")}`)
  lines.push("")

  for (const year of Object.keys(years).sort()) {
    const y = years[year]
    const totalAmt = y.completed.total + y.pending.total + y.failed.total
    const totalCount = y.completed.count + y.pending.count + y.failed.count
    lines.push(`══════════════════════════════`)
    lines.push(`  YEAR: ${year}`)
    lines.push(`══════════════════════════════`)
    lines.push(`  Total Transactions : ${totalCount}`)
    lines.push(`  Total Volume       : $${totalAmt.toFixed(2)} CAD`)
    lines.push(`  Completed          : ${y.completed.count} txns — $${y.completed.total.toFixed(2)} CAD`)
    lines.push(`  Pending            : ${y.pending.count} txns — $${y.pending.total.toFixed(2)} CAD`)
    lines.push(`  Failed             : ${y.failed.count} txns — $${y.failed.total.toFixed(2)} CAD`)
    lines.push("")
    lines.push("  Monthly Breakdown:")

    const MONTH_NAMES = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ]
    for (let m = 1; m <= 12; m++) {
      const mk = String(m).padStart(2, "0")
      const val = y.months[mk] || 0
      if (val > 0) {
        lines.push(`    ${MONTH_NAMES[m - 1].padEnd(12)} $${val.toFixed(2)} CAD`)
      }
    }
    lines.push("")
  }

  if (Object.keys(years).length > 1) {
    const grandTotal = transactions.reduce((s, t) => s + (Number.parseFloat(t.amount) || 0), 0)
    lines.push(`══════════════════════════════`)
    lines.push(`  ALL-TIME SUMMARY`)
    lines.push(`══════════════════════════════`)
    lines.push(`  Total Transactions : ${transactions.length}`)
    lines.push(`  Total Volume       : $${grandTotal.toFixed(2)} CAD`)
    lines.push("")
  }

  triggerDownload(
    `interac-annual-report-${new Date().getFullYear()}.txt`,
    lines.join("\n"),
    "text/plain",
  )
}

function ReportsContent() {
  const router = useRouter()
  const [states, setStates] = useState<Record<string, DownloadState>>({
    "Transaction History": "idle",
    "Monthly Summary": "idle",
    "Annual Report": "idle",
  })

  const setReportState = (title: string, state: DownloadState) => {
    setStates((prev) => ({ ...prev, [title]: state }))
  }

  const handleDownload = (title: string) => {
    const transactions = getTransactions()
    setReportState(title, "downloading")

    setTimeout(() => {
      if (transactions.length === 0) {
        setReportState(title, "empty")
        setTimeout(() => setReportState(title, "idle"), 3000)
        return
      }

      if (title === "Transaction History") downloadTransactionHistory(transactions)
      else if (title === "Monthly Summary") downloadMonthlySummary(transactions)
      else if (title === "Annual Report") downloadAnnualReport(transactions)

      setReportState(title, "done")
      setTimeout(() => setReportState(title, "idle"), 3000)
    }, 400)
  }

  const reportTypes = [
    {
      title: "Transaction History",
      description: "Complete list of all transactions",
      icon: FileText,
      format: "CSV",
      iconColor: "text-[#FDB913]",
      borderAccent: "hover:border-[#FDB913]/60",
    },
    {
      title: "Monthly Summary",
      description: "Monthly transaction summary and totals",
      icon: Calendar,
      format: "CSV",
      iconColor: "text-[#FDB913]",
      borderAccent: "hover:border-[#FDB913]/60",
    },
    {
      title: "Annual Report",
      description: "Year-end financial summary",
      icon: FileText,
      format: "TXT",
      iconColor: "text-[#FDB913]",
      borderAccent: "hover:border-[#FDB913]/60",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-5 max-w-7xl">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="gap-2 border-border text-foreground hover:bg-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FDB913]/10 border border-[#FDB913]/30 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#FDB913]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">Transaction Reports</h1>
                <p className="text-xs text-muted-foreground">Generate and download detailed reports</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {reportTypes.map((report) => {
            const IconComponent = report.icon
            const state = states[report.title]
            const isDownloading = state === "downloading"
            const isDone = state === "done"
            const isEmpty = state === "empty"

            return (
              <Card
                key={report.title}
                className={`bg-card border border-border transition-all duration-200 ${report.borderAccent}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 bg-[#FDB913]/10 border border-[#FDB913]/20 rounded-lg flex items-center justify-center">
                      <IconComponent className={`w-5 h-5 ${report.iconColor}`} />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border text-muted-foreground bg-secondary">
                      .{report.format}
                    </span>
                  </div>
                  <CardTitle className="text-foreground text-base">{report.title}</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                    {report.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEmpty ? (
                    <div className="w-full flex items-center justify-center gap-2 py-2.5 text-sm rounded-lg bg-destructive/10 border border-destructive/30 text-destructive-foreground">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      No transaction data found
                    </div>
                  ) : isDone ? (
                    <div className="w-full flex items-center justify-center gap-2 py-2.5 text-sm rounded-lg bg-[#FDB913]/10 border border-[#FDB913]/30 text-[#FDB913]">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      Download started
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleDownload(report.title)}
                      disabled={isDownloading}
                      className="w-full bg-[#FDB913] text-black hover:bg-[#e5a811] font-semibold gap-2 disabled:opacity-60"
                    >
                      <Download className={`w-4 h-4 ${isDownloading ? "animate-bounce" : ""}`} />
                      {isDownloading ? "Preparing..." : "Download Report"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Info panel */}
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-base">About These Reports</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Reports are generated from your local session data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Transaction History",
                  detail: "Exports every transaction as a CSV with transfer ID, recipient, amount, bank, status, date, and message.",
                },
                {
                  title: "Monthly Summary",
                  detail: "Aggregates transactions by calendar month, showing completed, pending, and failed totals.",
                },
                {
                  title: "Annual Report",
                  detail: "Year-over-year financial summary with monthly breakdowns, volume totals, and status breakdowns.",
                },
              ].map((item) => (
                <div key={item.title} className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <ReportsContent />
    </ProtectedRoute>
  )
}
