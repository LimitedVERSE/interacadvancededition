"use client"

import { generateInteracEmailHtml } from "@/lib/email-template"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Loader2, Send } from "lucide-react"

export default function EmailPreviewPage() {
  const [formData, setFormData] = useState({
    recipientEmail: "",
    recipientName: "Jean-Francois Melancon",
    amount: "555.55",
    message: "ENTER-VAULT-SECURE-CYPHER-PASS",
    securityQuestion: "ENTER-VAULT-SECURE-CYPHER-PASS",
    securityAnswer: "+1(844)GO-QYX20",
  })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const html = generateInteracEmailHtml({
    recipientName: formData.recipientName,
    amount: Number.parseFloat(formData.amount) || 0,
    message: formData.message || undefined,
    securityQuestion: formData.securityQuestion,
    transferId: "INTC-733346-AWLX84P",
    depositLink: "https://v0-interacadvancededition-git-main-nykeygpts-projects.vercel.app/deposit-portal",
    senderName: "QuantumYield Treasury",
    institution: "QuantumYield Holdings | Treasury Reserve & Vaulted-Portal",
  })
  // </CHANGE>

  const handleSendEmail = async () => {
    setError("")
    setSuccess(false)
    setSending(true)

    try {
      const response = await fetch("/api/send-interac", {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Email Preview & Send - Interac e-Transfer</h1>
          <p className="text-gray-600">
            Configure and send Interac e-Transfer emails via SendGrid with interactive EN/FR preview
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Email Configuration</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Recipient Email *</label>
                <Input
                  type="email"
                  placeholder="recipient@example.com"
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Recipient Name *</label>
                <Input
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Amount (CAD) *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Message (Optional)</label>
                <Textarea
                  placeholder="Add a personal message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Security Question *</label>
                <Input
                  value={formData.securityQuestion}
                  onChange={(e) => setFormData({ ...formData, securityQuestion: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Security Answer *</label>
                <Input
                  type="password"
                  value={formData.securityAnswer}
                  onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                />
              </div>

              <Button
                onClick={handleSendEmail}
                disabled={sending || !formData.recipientEmail}
                className="w-full bg-[#FDB913] hover:bg-[#e5a811] text-black font-bold"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Email via SendGrid...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Email Sent Successfully!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send via SendGrid
                  </>
                )}
              </Button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
              )}
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  ✓ Email sent successfully to {formData.recipientEmail}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Live Interactive Preview (EN/FR Toggle)</h2>
            <p className="text-sm text-gray-600 mb-4">
              Click EN/FR in the header to switch languages. Click the security answer to reveal.
            </p>
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg">
              <iframe title="Email Preview" srcDoc={html} className="w-full" style={{ height: "800px" }} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
