import type React from "react"
import { InteracHeader } from "./interac-header"
import { InteracFooter } from "./interac-footer"

interface InteracEmailLayoutProps {
  children: React.ReactNode
  senderName?: string
  institution?: string
}

export function InteracEmailLayout({ children, senderName, institution }: InteracEmailLayoutProps) {
  return (
    <div className="min-h-screen bg-[#eaeced] font-sans">
      <div className="max-w-[600px] mx-auto bg-white">
        <InteracHeader />

        <div className="bg-[#dcdcdc] rounded-b-[36px] min-h-[600px] pb-12">
          {children}

          <div className="px-[72px] mt-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-xs">
                <a
                  href="https://www.interac.ca/en/interac-etransfer/etransfer-faq"
                  className="text-blue-600 hover:underline"
                >
                  FAQ
                </a>
                <span className="text-[#c5b9ac]">|</span>
                <span className="italic text-[#404040]">This is a secure transaction.</span>
                <img
                  src="https://etransfer-notification.interac.ca/images/new/lock.png"
                  width="11"
                  height="14"
                  alt="Lock"
                  className="inline-block"
                />
              </div>

              <p className="text-xs text-[#666666] italic">
                For your security, please do not forward this email as it contains confidential information meant only
                for you. Interac will never request access to this email notification from you.
              </p>

              <p className="text-xs text-[#666666]">
                Click here to{" "}
                <a href="#" className="text-blue-600 underline">
                  manage notification preferences
                </a>{" "}
                from this contact. You will still be able to receive Interac e-Transfer transactions and notifications.
              </p>
            </div>
          </div>
        </div>

        <InteracFooter senderName={senderName} institution={institution} />
      </div>
    </div>
  )
}
