"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
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
}

export default function BankSelectorGrid({ searchTerm = "", transferData }: BankSelectorGridProps) {
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
    
    // Build countdown URL with transfer data if available
    const params = new URLSearchParams({
      bankId,
      bankName,
      categoryId: "major-banks",
    })
    
    if (transferData) {
      params.set("transferId", transferData.transferId)
      params.set("amount", transferData.amount)
      params.set("recipient", transferData.recipient)
      params.set("recipientName", transferData.recipientName)
      params.set("senderBank", transferData.bankName)
      params.set("message", transferData.message)
      params.set("timestamp", transferData.timestamp)
    }
    
    router.push(`/countdown?${params.toString()}`)
  }

  const handleImageError = (bankId: string) => {
    setBrokenImages((prev) => new Set(prev).add(bankId))
  }

  if (isLoading) {
    return (
      <div className="bg-gray-100 p-6 md:p-8 rounded-lg" role="region" aria-label="Bank selection grid">
        <div className="text-center py-12">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FDB913] border-r-transparent"
            role="status"
          >
            <span className="sr-only">Loading banks...</span>
          </div>
          <p className="text-gray-600 mt-4">Loading financial institutions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 p-6 md:p-8 rounded-lg" role="region" aria-label="Bank selection grid">
      {banks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No financial institutions match your search.</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {banks.map((bank) => (
            <button
              key={bank.id}
              onClick={() => handleBankSelect(bank.id, bank.name)}
              className={`
                group relative bg-white p-5 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300
                flex items-center justify-center min-h-[120px]
                border-2 ${selectedBank === bank.id ? "border-[#FDB913] bg-yellow-50 ring-2 ring-[#FDB913] ring-offset-2 scale-105" : "border-gray-200 hover:border-[#FDB913]/50"}
                focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:ring-offset-2
                overflow-hidden transform hover:scale-105 hover:-translate-y-1
              `}
              aria-label={`Select ${bank.name}`}
              aria-pressed={selectedBank === bank.id}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
                {bank.logo && !brokenImages.has(bank.id) ? (
                  <Image
                    src={bank.logo || "/placeholder.svg"}
                    alt={`${bank.name} logo`}
                    width={160}
                    height={80}
                    className={`
                      max-w-full h-auto object-contain transition-all duration-300
                      ${selectedBank === bank.id ? "grayscale-0 brightness-100" : "grayscale group-hover:grayscale-0"}
                      group-hover:brightness-110
                    `}
                    onError={() => handleImageError(bank.id)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 bg-[#FDB913] rounded-lg flex items-center justify-center">
                      <span className="text-black font-bold text-xl">{bank.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center line-clamp-2">{bank.name}</span>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </div>

              {selectedBank === bank.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-[#FDB913] rounded-full flex items-center justify-center animate-in fade-in zoom-in duration-200">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
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
