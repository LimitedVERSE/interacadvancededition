interface InteracFooterProps {
  senderName?: string
  institution?: string
}

export function InteracFooter({ senderName = "Sender", institution = "Financial Institution" }: InteracFooterProps) {
  return (
    <div className="px-8 py-8 border-t">
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 bg-[#FDB913] rounded-lg flex items-center justify-center p-2.5 flex-shrink-0">
          <img
            src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
            alt="INTERAC e-Transfer"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-right text-sm">
          <p>2000 - 2025 Interac Corp.</p>
          <p>All rights reserved.</p>
          <a
            href="https://www.interac.ca/en/interac-e-transfer-terms-of-use/"
            className="text-blue-600 hover:underline"
          >
            Terms of Use
          </a>
          <p className="mt-1">Trade-Mark of Interac Corp.</p>
          <p>Interac Corp.</p>
          <p>P.O. Box 45, Toronto, Ontario M5J 2J1</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-xs text-[#373737]">
          Email or text messages carry the notice while the financial institutions securely transfer the money using
          existing payment networks.
          <br />
          <br />
          This email was sent to you by Interac Corp., the owner of the Interac e-Transfer service, on behalf of{" "}
          <strong>{senderName}</strong> at <strong>{institution}</strong>.
        </p>
      </div>
    </div>
  )
}
