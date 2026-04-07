"use client"

interface InteracFooterProps {
  senderName?: string
  institution?: string
}

export function InteracFooter({ senderName = "Sender", institution = "Financial Institution" }: InteracFooterProps) {
  return (
    <div className="px-8 py-8 border-t">
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <img src="/zelle-logo.webp" alt="Zelle" className="w-full h-full object-cover" />
        </div>
        <div className="text-right text-sm">
          <p>&copy; {new Date().getFullYear()} Zelle.</p>
          <p>All rights reserved.</p>
          <a
            href="https://www.zellepay.com/terms-of-use"
            className="text-[#6D1ED4] hover:underline"
          >
            Terms of Use
          </a>
          <p className="mt-1">Zelle and the Zelle related marks are property of Early Warning Services, LLC.</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-xs text-[#373737]">
          Email or text messages carry the notice while the financial institutions securely transfer the money using
          existing payment networks.
          <br />
          <br />
          This email was sent to you by Zelle on behalf of{" "}
          <strong>{senderName}</strong> at <strong>{institution}</strong>.
        </p>
      </div>
    </div>
  )
}
