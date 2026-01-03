"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TransferCardProps {
  amount?: number
  message?: string
  securityQuestion?: string
  depositLink?: string
  transferId?: string
  date?: string
  senderName?: string
  details?: Array<{ label: string; value: string }>
}

export function TransferCard({
  amount,
  message,
  securityQuestion,
  depositLink = "https://brandcentre.interac.ca/member-login/",
  transferId,
  date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  senderName = "Banking System",
  details,
}: TransferCardProps) {
  const [showSecurityAnswer, setShowSecurityAnswer] = useState(false)

  const safeAmount = amount ?? 0
  // </CHANGE>

  return (
    <div className="px-[72px] space-y-8">
      {/* Amount Display */}
      <div className="mt-6 p-4 bg-[#FDB913] rounded-lg">
        <p className="text-lg font-semibold">Amount: ${safeAmount.toFixed(2)} CAD</p>
      </div>

      {message && (
        <div className="bg-gray-50 border-l-4 border-[#FDB913] p-4 rounded">
          <p className="text-sm font-semibold text-gray-700 mb-2">Message (Optional):</p>
          <p className="text-base text-gray-900">{message}</p>
        </div>
      )}
      {/* </CHANGE> */}

      {/* Transfer Details Card */}
      <div className="bg-white border border-[#dfdfdf] rounded-lg p-5">
        <h3 className="font-bold text-base mb-4">Transfer Details</h3>

        {details ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {details.map((detail, index) => (
              <div key={index}>
                <p className="text-sm text-[#404040] mb-1">{detail.label}:</p>
                <p className="text-base break-all">{detail.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-sm text-[#404040] mb-1">Date:</p>
              <p className="text-base break-all">{date}</p>
            </div>
            <div>
              <p className="text-sm text-[#404040] mb-1">Reference Number:</p>
              <p className="text-base break-all">{transferId || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-[#404040] mb-1">From:</p>
              <p className="text-base break-all">{senderName}</p>
            </div>
            <div>
              <p className="text-sm text-[#404040] mb-1">Amount:</p>
              <p className="text-base break-all">${safeAmount.toFixed(2)} CAD</p>
            </div>
          </div>
        )}
        {/* </CHANGE> */}
      </div>

      {securityQuestion && (
        <div className="bg-yellow-50 border-2 border-[#FDB913] rounded-lg p-5">
          <h4 className="font-bold text-base mb-3 flex items-center gap-2">🔒 Security Question</h4>
          <div className="space-y-3">
            <p className="text-sm text-gray-700">{securityQuestion}</p>
            <div className="bg-white border border-gray-300 p-3 rounded">
              <p className="font-semibold text-gray-900">
                Answer: {showSecurityAnswer ? "****** (Hidden for security)" : "****** (Reveal when depositing)"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSecurityAnswer(!showSecurityAnswer)}
              className="flex items-center gap-2"
            >
              {showSecurityAnswer ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Hide Answer
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Show Answer
                </>
              )}
            </Button>
            <p className="text-xs text-gray-600 italic">
              You'll need to answer this security question when depositing your funds through your financial
              institution.
            </p>
          </div>
        </div>
      )}
      {/* </CHANGE> */}

      {/* Deposit Button */}
      <div className="text-center">
        <a
          href={depositLink}
          className="inline-flex items-center justify-center gap-2 bg-[#FDB913] text-black hover:bg-[#e5a811] font-bold px-8 py-4 text-base rounded-lg transition-colors"
        >
          Deposit Your Money
        </a>
      </div>

      {/* How to Deposit Instructions */}
      <div className="bg-white border border-[#dfdfdf] rounded-lg p-5">
        <h3 className="font-bold text-base mb-4">How to deposit:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-[#404040]">
          <li>Click the "Deposit Your Money" button above</li>
          <li>Select your financial institution</li>
          <li>Sign in to your online banking</li>
          <li>Answer the security question</li>
          <li>Choose which account to deposit the money into</li>
        </ol>
      </div>
    </div>
  )
}
