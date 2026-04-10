"use client"

import { generateEmailByTemplateId } from "@/lib/email-template-generators"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Loader2, Send, Eye, Mail } from "lucide-react"

export default function AdminEmailPreviewPage() {
  const [formData, setFormData] = useState({
    recipientEmail: "",
    recipientName: "John Smith",
    amount: "555.55",
    message: "ENTER-VAULT-SECURE-CYPHER-PASS",
  })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const html = generateEmailByTemplateId("transfer-received", {
    recipientName: formData.recipientName,
    amount: Number.parseFloat(formData.amount) || 0,
    message: formData.message || undefined,
    transferId: "ZELLE-733346-AWLX84P",
    depositLink: "https://app.quantumyield.digital/deposit-portal",
    senderName: "QuantumYield Treasury",
    institution: "QuantumYield | Treasury Reserve & Vault Portal",
  })

  const handleSendEmail = async () => {
    setError("")
    setSuccess(false)
    setSending(true)

    try {
      const response = await fetch("/api/send-zelle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email")
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">Admin Email Preview</h1>
            <p className="text-[10px] text-zinc-500 leading-none">Zelle Payment Notifications</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Configuration card */}
          <Card className="bg-zinc-900 border-zinc-800 p-6 h-fit">
            <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
              <Send className="h-4 w-4 text-[#6D1ED4]" />
              Email Configuration
            </h2>
            <p className="text-xs text-zinc-500 mb-5">Send Zelle payment notification via Resend</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Recipient Email *</label>
                <Input
                  type="email"
                  placeholder="recipient@example.com"
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#6D1ED4]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Recipient Name</label>
                <Input
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white focus:border-[#6D1ED4]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Amount (USD)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white focus:border-[#6D1ED4]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Message (Optional)</label>
                <Textarea
                  placeholder="Add a personal message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#6D1ED4] resize-none"
                />
              </div>

              <Button
                onClick={handleSendEmail}
                disabled={sending || !formData.recipientEmail}
                className="w-full bg-[#6D1ED4] hover:bg-[#5A18B0] text-white font-semibold h-11"
              >
                {sending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>
                ) : success ? (
                  <><CheckCircle2 className="w-4 h-4 mr-2" />Email Sent!</>
                ) : (
                  <><Send className="w-4 h-4 mr-2" />Send Email</>
                )}
              </Button>

              {error && (
                <div className="p-3 bg-red-950/50 border border-red-900/50 rounded-lg text-red-400 text-sm">{error}</div>
              )}
              {success && (
                <div className="p-3 bg-green-950/50 border border-green-900/50 rounded-lg text-green-400 text-sm">
                  Email sent to {formData.recipientEmail}
                </div>
              )}
            </div>
          </Card>

          {/* Preview card */}
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#6D1ED4]" />
              Live Preview
            </h2>
            <div className="border border-zinc-700 rounded-xl overflow-hidden">
              {html ? (
                <iframe
                  title="Email Preview"
                  srcDoc={html}
                  className="w-full"
                  style={{ height: "750px", border: "none" }}
                />
              ) : (
                <div className="w-full flex items-center justify-center bg-zinc-800" style={{ height: "750px" }}>
                  <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
