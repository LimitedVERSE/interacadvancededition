"use client"

import type React from "react"
import { useState } from "react"
import { generateEmailByTemplateId } from "@/lib/email-template-generators"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Loader2, Send, Eye, CheckCircle2, Mail } from "lucide-react"

export default function EmailPreview() {
  const [formData, setFormData] = useState({
    recipientEmail: "",
    recipientName: "",
    amount: "",
    message: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [showPreview, setShowPreview] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus(null)

    try {
      const response = await fetch("/api/send-zelle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({
          type: "success",
          message: `Email sent successfully! Transfer ID: ${data.transferId}`,
        })
        setFormData({ recipientEmail: "", recipientName: "", amount: "", message: "" })
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to send email",
        })
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const previewHtml = generateEmailByTemplateId("transfer-received", {
    recipientName: formData.recipientName || "Recipient",
    amount: Number.parseFloat(formData.amount) || 0,
    message: formData.message || undefined,
    transferId: `ZELLE-${Date.now().toString().slice(-6)}`,
    depositLink: "https://app.quantumyield.digital/deposit-portal",
    senderName: "QuantumYield Treasury",
    institution: "QuantumYield | Treasury & Vault Portal",
  })

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">Email Preview</h1>
              <p className="text-[10px] text-zinc-500 leading-none">Zelle Payment Notifications</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2 bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
          >
            <Eye className="h-3.5 w-3.5" />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className={`grid gap-8 ${showPreview ? "lg:grid-cols-2" : "max-w-xl"}`}>

          {/* Form card */}
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
              <Send className="h-4 w-4 text-[#6D1ED4]" />
              Send Zelle Payment
            </h2>
            <p className="text-xs text-zinc-500 mb-6">Send a test email notification to any recipient</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Recipient Email *</label>
                <Input
                  name="recipientEmail"
                  type="email"
                  value={formData.recipientEmail}
                  onChange={handleChange}
                  placeholder="recipient@example.com"
                  required
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#6D1ED4]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Recipient Name *</label>
                <Input
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#6D1ED4]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Amount (USD) *</label>
                <Input
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="250.00"
                  required
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#6D1ED4]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Message (Optional)</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Thanks for your help!"
                  rows={3}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#6D1ED4] resize-none"
                />
              </div>

              {status && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    status.type === "success"
                      ? "bg-green-950/50 border border-green-900/50 text-green-400"
                      : "bg-red-950/50 border border-red-900/50 text-red-400"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6D1ED4] hover:bg-[#5A18B0] text-white font-semibold h-11"
              >
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
                ) : (
                  <><Send className="mr-2 h-4 w-4" />Send Email Now</>
                )}
              </Button>
            </form>
          </Card>

          {/* Preview card */}
          {showPreview && (
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Eye className="h-4 w-4 text-[#6D1ED4]" />
                  Live Preview
                </h2>
                <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-md">
                  transfer-received
                </span>
              </div>
              <div className="border border-zinc-700 rounded-xl overflow-hidden bg-white">
                {previewHtml ? (
                  <iframe
                    title="Email Preview"
                    srcDoc={previewHtml}
                    className="w-full"
                    style={{ height: "700px", border: "none" }}
                  />
                ) : (
                  <div className="w-full flex items-center justify-center bg-zinc-800" style={{ height: "700px" }}>
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
