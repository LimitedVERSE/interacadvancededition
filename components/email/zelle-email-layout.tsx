import type React from "react"
import ZelleHeader from "./zelle-header"
import { ZelleFooter } from "./zelle-footer"

interface ZelleEmailLayoutProps {
  children: React.ReactNode
  senderName?: string
  institution?: string
}

export function ZelleEmailLayout({ children, senderName, institution }: ZelleEmailLayoutProps) {
  return (
    <div className="min-h-screen bg-[#eaeced] font-sans">
      <div className="max-w-[600px] mx-auto bg-white">
        <ZelleHeader />

        <div className="bg-[#dcdcdc] rounded-b-[36px] min-h-[600px] pb-12">
          {children}

          <div className="px-[72px] mt-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-xs">
                <a
                  href="https://www.zellepay.com/faq"
                  className="text-[#6D1ED4] hover:underline"
                >
                  FAQ
                </a>
                <span className="text-[#c5b9ac]">|</span>
                <span className="italic text-[#404040]">This is a secure transaction.</span>
              </div>

              <p className="text-xs text-[#666666] italic">
                For your security, please do not forward this email as it contains confidential information meant only
                for you. Zelle will never request access to this email notification from you.
              </p>

              <p className="text-xs text-[#666666]">
                Click here to{" "}
                <a href="#" className="text-[#6D1ED4] underline">
                  manage notification preferences
                </a>{" "}
                from this contact.
              </p>
            </div>
          </div>
        </div>

        <ZelleFooter senderName={senderName} institution={institution} />
      </div>
    </div>
  )
}
