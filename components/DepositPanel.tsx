"use client"

import { useState, useEffect } from "react"
import { ArrowDown } from "lucide-react"
import { getDepositDetails } from "@/services/depositService"
import type { DepositInfo } from "@/types/bank"
import { useLanguage } from "@/lib/i18n/context"

interface DepositPanelProps {
  transferAmount?: string
  transferSender?: string
}

function getExpiryDate(): Date {
  const expiry = new Date()
  expiry.setMonth(expiry.getMonth() + 1)
  return expiry
}

function formatTimeRemaining(
  ms: number,
  timeLabels: {
    day: string
    days: string
    hour: string
    hours: string
    minute: string
    minutes: string
    second: string
    seconds: string
  },
): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const remainingHours = hours % 24
  const remainingMinutes = minutes % 60
  const remainingSeconds = seconds % 60

  if (days > 0) {
    return `${days} ${days !== 1 ? timeLabels.days : timeLabels.day}, ${remainingHours} ${remainingHours !== 1 ? timeLabels.hours : timeLabels.hour}, ${remainingMinutes} ${remainingMinutes !== 1 ? timeLabels.minutes : timeLabels.minute}`
  }
  if (hours > 0) {
    return `${remainingHours} ${remainingHours !== 1 ? timeLabels.hours : timeLabels.hour}, ${remainingMinutes} ${remainingMinutes !== 1 ? timeLabels.minutes : timeLabels.minute}, ${remainingSeconds} ${remainingSeconds !== 1 ? timeLabels.seconds : timeLabels.second}`
  }
  if (minutes > 0) {
    return `${remainingMinutes} ${remainingMinutes !== 1 ? timeLabels.minutes : timeLabels.minute}, ${remainingSeconds} ${remainingSeconds !== 1 ? timeLabels.seconds : timeLabels.second}`
  }
  return `${remainingSeconds} ${remainingSeconds !== 1 ? timeLabels.seconds : timeLabels.second}`
}

export default function DepositPanel({ transferAmount, transferSender }: DepositPanelProps) {
  const { t, language } = useLanguage()

  const [depositInfo, setDepositInfo] = useState<DepositInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [expiryDate] = useState<Date>(getExpiryDate())

  const displayAmount = transferAmount || depositInfo?.amount || "0"

  useEffect(() => {
    const loadDepositInfo = async () => {
      setIsLoading(true)
      try {
        if (transferAmount) {
          setDepositInfo({
            amount: transferAmount,
            currency: "USD",
            sender: transferSender || "Zelle Network",
            reference: `ZELLE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          })
        } else {
          const info = await getDepositDetails()
          setDepositInfo(info)
        }
      } catch (error) {
        console.error("Failed to load deposit details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDepositInfo()
  }, [transferAmount, transferSender])

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const diff = expiryDate.getTime() - now.getTime()

      if (diff > 0) {
        setTimeRemaining(formatTimeRemaining(diff, t.depositPanel.time))
      } else {
        setTimeRemaining(t.depositPanel.time.expired)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [expiryDate, t.depositPanel.time])

  if (isLoading) {
    return (
      <section className="border-b-2 border-border pb-8 mb-8" aria-labelledby="deposit-heading">
        <div className="flex items-center justify-center py-12">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#6D1ED4] border-r-transparent"
            role="status"
          >
            <span className="sr-only">{t.depositPanel.loadingMessage}</span>
          </div>
        </div>
      </section>
    )
  }

  if (!depositInfo) {
    return (
      <section className="border-b-2 border-border pb-8 mb-8" aria-labelledby="deposit-heading">
        <div className="text-center py-8 text-muted-foreground">{t.depositPanel.errorMessage}</div>
      </section>
    )
  }

  return (
    <section className="border-b-2 border-border pb-8 mb-8" aria-labelledby="deposit-heading">
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0"
              aria-hidden="true"
            >
              <ArrowDown className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
            </div>
            <h1
              id="deposit-heading"
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight"
            >
              {t.depositPanel.title}
            </h1>
          </div>

          <div className="space-y-3 md:space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                ${Number.parseFloat(displayAmount).toFixed(2)}
              </span>
              <span className="text-lg md:text-xl lg:text-2xl font-semibold text-muted-foreground">
                {depositInfo?.currency || "USD"}
              </span>
            </div>

            <div>
              <p className="text-base md:text-lg lg:text-xl text-foreground">
                <span className="font-semibold">{t.depositPanel.from}</span> {depositInfo?.sender}
              </p>
            </div>
          </div>
        </div>

        <div
          className="space-y-4 bg-muted p-5 md:p-6 rounded-lg border border-border"
          role="complementary"
          aria-label={t.depositPanel.transactionDetails}
        >
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <span className="font-semibold text-foreground min-w-[100px]">{t.depositPanel.expires}</span>
              <div className="flex flex-col gap-1">
                <span className="text-foreground">
                  {expiryDate.toLocaleDateString(language === "fr" ? "fr-CA" : "en-CA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="text-sm text-muted-foreground font-medium" role="timer" aria-live="polite">
                  {t.depositPanel.timeRemaining} {timeRemaining}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-4">
              <span className="font-semibold text-foreground min-w-[100px]">{t.depositPanel.notice}</span>
              <span className="text-foreground">{t.depositPanel.noticeText}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
