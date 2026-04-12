"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Bank } from "@/types/bank"
import { searchBanks } from "@/services/bankService"

interface TransferData {
  transferId: string
  amount: string
  recipient: string
  recipientName: string
  bankName: string
  message: string
  timestamp: string
}

interface BankSelectorGridProps {
  searchTerm?: string
  transferData?: TransferData | null
  clientMode?: boolean
}

export default function BankSelectorGrid({ searchTerm = "", transferData, clientMode = false }: BankSelectorGridProps) {
  const router = useRouter()
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [banks, setBanks] = useState<Bank[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadBanks = async () => {
      setIsLoading(true)
      try {
        const results = await searchBanks(searchTerm)
        setBanks(results)
      } catch (error) {
        console.error("Failed to load banks:", error)
        setBanks([])
      } finally {
        setIsLoading(false)
      }
    }
    loadBanks()
  }, [searchTerm])

  const handleBankSelect = (bankId: string, bankName: string) => {
    setSelectedBank(bankId)
    const params = new URLSearchParams({ bankId, bankName, categoryId: "major-banks" })
    if (transferData) {
      params.set("transferId", transferData.transferId)
      params.set("amount", transferData.amount)
      params.set("recipient", transferData.recipient)
      params.set("recipientName", transferData.recipientName)
      params.set("senderBank", transferData.bankName)
      params.set("message", transferData.message)
      params.set("timestamp", transferData.timestamp)
    }
    window.location.href = `/countdown?${params.toString()}`
  }

  const containerCls = clientMode
    ? "bg-white border border-gray-200 shadow-sm p-6 md:p-8 rounded-xl"
    : "bg-zinc-900 p-6 md:p-8 rounded-xl"

  const emptyTextCls  = clientMode ? "text-gray-400" : "text-zinc-400"
  const emptyText2Cls = clientMode ? "text-gray-400" : "text-zinc-500"
  const bankCardBase  = clientMode ? "bg-gray-50 border-gray-200" : "bg-zinc-800 border-zinc-700"
  const bankCardHover = clientMode
    ? "hover:border-[#FDB913]/80 hover:bg-white"
    : "hover:border-[#FDB913]/60 hover:bg-zinc-700"
  const ringOffset    = clientMode ? "ring-offset-white" : "ring-offset-zinc-900"

  if (isLoading) {
    return (
      <div className={containerCls} role="region" aria-label="Bank selection grid">
        <div className="text-center py-12">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FDB913] border-r-transparent"
            role="status"
          >
            <span className="sr-only">Loading banks...</span>
          </div>
          <p className={`${emptyTextCls} mt-4 text-sm`}>Loading financial institutions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={containerCls} role="region" aria-label="Bank selection grid">
      {banks.length === 0 ? (
        <div className="text-center py-12">
          <p className={`${emptyTextCls} text-lg`}>No financial institutions match your search.</p>
          <p className={`${emptyText2Cls} text-sm mt-2`}>Try adjusting your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {banks.map((bank) => (
            <button
              key={bank.id}
              onClick={() => handleBankSelect(bank.id, bank.name)}
              className={`
                group relative ${bankCardBase} p-4 rounded-xl transition-all duration-200
                flex flex-col items-center justify-center gap-2 min-h-[100px]
                border-2 ${
                  selectedBank === bank.id
                    ? `border-[#FDB913] ring-2 ring-[#FDB913] ring-offset-2 ${ringOffset} scale-105`
                    : `${bankCardHover}`
                }
                focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:ring-offset-2 ${ringOffset}
              `}
              aria-label={`Select ${bank.name}`}
              aria-pressed={selectedBank === bank.id}
            >
              <div className="w-full flex items-center justify-center">
                {bank.logo && !brokenImages.has(bank.id) ? (
                  <img
                    src={bank.logo}
                    alt={`${bank.name} logo`}
                    className="max-w-full h-10 object-contain transition-all duration-200 group-hover:scale-105"
                    onError={() => setBrokenImages((prev) => new Set(prev).add(bank.id))}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 bg-[#FDB913] rounded-lg flex items-center justify-center">
                      <span className="text-black font-bold text-lg">{bank.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-[10px] font-medium text-zinc-400 text-center leading-tight">{bank.name}</span>
                  </div>
                )}
              </div>

              {selectedBank === bank.id && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#FDB913] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-black" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
