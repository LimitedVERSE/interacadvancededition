"use client"

import { Suspense } from "react"
import CountdownRedirectScreen from "@/components/CountdownRedirectScreen"
import { buildInteracMock } from "@/lib/mockInteracService"
import { useSearchParams } from "next/navigation"

interface TransferData {
  transferId: string
  amount: string
  recipient: string
  recipientName: string
  senderBank: string
  message: string
  timestamp: string
}

function CountdownContent() {
  const searchParams = useSearchParams()

  const bankId     = searchParams.get("bankId")     || undefined
  const bankName   = searchParams.get("bankName")   || undefined
  const categoryId = searchParams.get("categoryId") || undefined

  // Extract all transfer data forwarded from the deposit portal bank selector
  const transferData: TransferData | null = searchParams.get("transferId")
    ? {
        transferId:    searchParams.get("transferId")    || "",
        amount:        searchParams.get("amount")        || "0.00",
        recipient:     searchParams.get("recipient")     || "",
        recipientName: searchParams.get("recipientName") || "",
        senderBank:    searchParams.get("senderBank")    || searchParams.get("bankName") || "Banking System",
        message:       searchParams.get("message")       || "",
        timestamp:     searchParams.get("timestamp")     || new Date().toISOString(),
      }
    : null

  const data = buildInteracMock(bankId, bankName, categoryId, transferData)

  return <CountdownRedirectScreen data={data} transferData={transferData} />
}

export default function CountdownPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#FFCB05] border-r-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CountdownContent />
    </Suspense>
  )
}
