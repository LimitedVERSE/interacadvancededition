"use client"

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

export default function CountdownPage() {
  const searchParams = useSearchParams()

  const bankId = searchParams.get("bankId") || undefined
  const bankName = searchParams.get("bankName") || undefined
  const categoryId = searchParams.get("categoryId") || undefined

  // Extract transfer data from URL params
  const transferData: TransferData | null = searchParams.get("transferId")
    ? {
        transferId: searchParams.get("transferId") || "",
        amount: searchParams.get("amount") || "0.00",
        recipient: searchParams.get("recipient") || "",
        recipientName: searchParams.get("recipientName") || "",
        senderBank: searchParams.get("senderBank") || "Banking System",
        message: searchParams.get("message") || "",
        timestamp: searchParams.get("timestamp") || new Date().toISOString(),
      }
    : null

  const data = buildInteracMock(bankId, bankName, categoryId, transferData)

  return <CountdownRedirectScreen data={data} transferData={transferData} />
}
