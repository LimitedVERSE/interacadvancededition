"use client"

import { useRouter } from "next/navigation"
import type { BankConnector } from "@/types/bankConnector"

interface BankConnectorScreenProps {
  connector: BankConnector
}

export default function BankConnectorScreen({ connector }: BankConnectorScreenProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <img
          src={`/${connector.bankId}-bank-logo.jpg`}
          alt={connector.bankName}
          className="mx-auto mb-4 object-contain h-40 border-2 shadow-xl rounded-lg"
          onError={(e) => {
            // Fallback if logo not found
            e.currentTarget.style.display = "none"
          }}
        />

        <h1 className="text-xl font-bold mb-2 text-gray-900 leading-7 tracking-tight">You're about to leave Interac's secure interface</h1>

        <p className="mb-6 text-gray-600 text-sm">
          You'll be redirected to <strong>{connector.bankName}</strong>'s official banking website.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href={connector.loginUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FDB913] hover:bg-[#e5a812] px-6 py-2 rounded text-black font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:ring-offset-2"
          >
            Continue to {connector.bankName}
          </a>

          <button
            onClick={() => router.push("/")}
            className="border-2 border-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-100 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
