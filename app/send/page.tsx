"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Send, Users, Download, Settings } from "lucide-react"
import Link from "next/link"

export default function SendTransferPage() {
  const [formData, setFormData] = useState({
    fromAccount: "checking",
    recipient: "",
    amount: "",
    message: "",
    securityQuestion: "",
    securityAnswer: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    alert("Send e-Transfer functionality - Coming soon!")
    console.log("[v0] Form submitted:", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FDB913] rounded-lg flex items-center justify-center">
                <img
                  src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
                  alt="Interac"
                  className="h-6 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">Interac e-Transfer</h1>
                <p className="text-sm text-muted-foreground">Advanced Edition</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">Send e-Transfer</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="from-account">From Account</Label>
              <Select
                value={formData.fromAccount}
                onValueChange={(value) => setFormData({ ...formData, fromAccount: value })}
              >
                <SelectTrigger id="from-account" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking Account</SelectItem>
                  <SelectItem value="savings">Savings Account</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="recipient">Recipient Email or Phone</Label>
              <Input
                id="recipient"
                type="text"
                placeholder="email@example.com or 123-456-7890"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Enter a message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="mt-2"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="security-question">Security Question (Optional)</Label>
              <Input
                id="security-question"
                type="text"
                placeholder="What is your favorite color?"
                value={formData.securityQuestion}
                onChange={(e) => setFormData({ ...formData, securityQuestion: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="security-answer">Security Answer</Label>
              <Input
                id="security-answer"
                type="text"
                placeholder="Blue"
                value={formData.securityAnswer}
                onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                className="mt-2"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-[#FDB913] hover:bg-[#e5a811] text-black font-semibold" size="lg">
              <Send className="w-4 h-4 mr-2" />
              Send e-Transfer
            </Button>
          </form>
        </Card>

        <Card className="p-6 md:p-8 mt-6">
          <h2 className="text-xl font-bold mb-4">Advanced Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 bg-transparent"
              onClick={() => alert("Bulk transfer functionality coming soon!")}
            >
              <Users className="w-6 h-6" />
              <span className="font-semibold">Bulk Transfers</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 bg-transparent"
              onClick={() => alert("Request money functionality coming soon!")}
            >
              <Download className="w-6 h-6" />
              <span className="font-semibold">Request Money</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 bg-transparent"
              onClick={() => alert("Set up autodeposit functionality coming soon!")}
            >
              <Settings className="w-6 h-6" />
              <span className="font-semibold">Set Up Autodeposit</span>
            </Button>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
