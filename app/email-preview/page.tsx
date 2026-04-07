"use client"

import type React from "react"
import { useState } from "react"
import { generateEmailByTemplateId } from "@/lib/email-template-generators"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Loader2, Send, Eye, CheckCircle2 } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Zelle Email Preview &amp; Sender</h1>
            <p className="text-slate-600">Preview the email template and send test transfers</p>
          </div>
          <Button variant="outline" size="lg" onClick={() => setShowPreview(!showPreview)} className="gap-2">
            <Eye className="h-4 w-4" />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-6 bg-white shadow-lg border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Send className="h-6 w-6 text-[#6D1ED4]" />
              Send Zelle Payment
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="recipientEmail">Recipient Email *</Label>
                <Input
                  id="recipientEmail"
                  name="recipientEmail"
                  type="email"
                  value={formData.recipientEmail}
                  onChange={handleChange}
                  placeholder="recipient@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="recipientName">Recipient Name *</Label>
                <Input
                  id="recipientName"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="amount">Amount (USD) *</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="250.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Thanks for your help!"
                  rows={3}
                />
              </div>

              {status && (
                <div
                  className={`p-4 rounded-lg ${
                    status.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6D1ED4] hover:bg-[#5A18B0] text-white font-semibold py-6 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Email Now
                  </>
                )}
              </Button>
            </form>
          </Card>

          {showPreview && (
            <div className="lg:col-span-1">
              <div className="bg-slate-100 p-4 rounded-lg shadow-inner">
                <p className="text-sm text-slate-600 mb-4 text-center font-medium">Live Preview</p>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {previewHtml ? (
                    <iframe
                      title="Email Preview"
                      srcDoc={previewHtml}
                      className="w-full"
                      style={{ height: "800px", border: "none" }}
                    />
                  ) : (
                    <div className="w-full flex items-center justify-center" style={{ height: "800px" }}>
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
