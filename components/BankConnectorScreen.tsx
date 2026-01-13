"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { BankConnector } from "@/types/bankConnector"

interface BankConnectorScreenProps {
  connector: BankConnector
}

export default function BankConnectorScreen({ connector }: BankConnectorScreenProps) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detect if user is on a mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileCheck = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      setIsMobile(mobileCheck)
    }

    checkMobile()
  }, [])

  const handleBankRedirect = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobile) {
      e.preventDefault()

      // Attempt to open the mobile banking app via deep link
      // Each bank would have their own app scheme, this is a generic approach
      const bankAppSchemes: Record<string, string> = {
        td: "tdct://",
        rbc: "rbc-mobile://",
        scotiabank: "scotiabank://",
        bmo: "bmo://",
        cibc: "cibc://",
        // Add more bank app schemes as needed
      }

      const appScheme = bankAppSchemes[connector.bankId]

      if (appScheme) {
        // Try to open the mobile app
        window.location.href = appScheme

        // Fallback to web URL if app is not installed (after a short delay)
        setTimeout(() => {
          window.location.href = connector.loginUrl
        }, 1500)
      } else {
        // If no app scheme defined, just open the web URL
        window.location.href = connector.loginUrl
      }
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <img
          src={`/${connector.bankId}-bank-logo.jpg`}
          alt={connector.bankName}
          className="mx-auto mb-4 object-contain h-40 border-2 shadow-xl rounded-lg"
          onError={(e) => {
            e.currentTarget.style.display = "none"
          }}
        />

        <h1 className="text-xl font-bold mb-2 text-gray-900 leading-7 tracking-tight">
          You're about to leave Interac's secure interface
        </h1>

        <p className="mb-6 text-gray-600 text-sm">
          {isMobile ? (
            <>
              You'll be redirected to <strong>{connector.bankName}</strong>'s mobile app or website.
            </>
          ) : (
            <>
              You'll be redirected to <strong>{connector.bankName}</strong>'s official banking website.
            </>
          )}
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href={connector.loginUrl}
            target={isMobile ? "_self" : "_blank"}
            rel="noopener noreferrer"
            onClick={handleBankRedirect}
            className="bg-[#FDB913] hover:bg-[#e5a812] px-6 py-2 rounded text-black font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:ring-offset-2"
          >
            {isMobile ? `Open ${connector.bankName} App` : `Continue to ${connector.bankName}`}
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
