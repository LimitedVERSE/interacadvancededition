"use client"

interface MessageSectionProps {
  recipientName: string
  title: string
  description: string
  amount?: string
  message?: string
}

export function MessageSection({ recipientName, title, description, amount, message }: MessageSectionProps) {
  return (
    <div className="px-[72px] py-8">
      <h1 className="text-2xl font-bold mb-2 break-all">Hi {recipientName},</h1>

      <h2 className="text-3xl font-bold mb-2">{title}</h2>

      <p className="text-base leading-relaxed">{description}</p>

      {amount && (
        <div className="mt-6 p-4 bg-[#6D1ED4] rounded-lg">
          <p className="text-lg font-semibold text-white">Amount: ${amount} USD</p>
        </div>
      )}

      {message && message.trim() !== "" && (
        <div className="mt-4 p-4 bg-slate-100 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600 mb-1 font-semibold">Message:</p>
          <p className="text-base text-slate-900">{message}</p>
        </div>
      )}
    </div>
  )
}
