interface ZelleFooterProps {
  senderName?: string
  institution?: string
}

export function ZelleFooter({ senderName = "Sender", institution = "Financial Institution" }: ZelleFooterProps) {
  return (
    <div className="px-8 py-8 border-t">
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 bg-[#6D1ED4] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-3xl leading-none">Z</span>
        </div>
        <div className="text-right text-sm">
          <p>2000 - 2025 Zelle.</p>
          <p>All rights reserved.</p>
          <a
            href="https://www.zellepay.com/terms-of-use"
            className="text-[#6D1ED4] hover:underline"
          >
            Terms of Use
          </a>
          <p className="mt-1">Zelle and the Zelle related marks are property of Early Warning Services, LLC.</p>
          <p>Zelle Network</p>
          <p>8501 E Princess Dr, Scottsdale, AZ 85255</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-xs text-[#373737]">
          Zelle transfers money between enrolled bank accounts in the U.S. using existing payment networks.
          <br />
          <br />
          This email was sent to you by the Zelle Network on behalf of{" "}
          <strong>{senderName}</strong> at <strong>{institution}</strong>.
        </p>
      </div>
    </div>
  )
}
