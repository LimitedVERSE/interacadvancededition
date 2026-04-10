import { renderZelleEmail } from "@/lib/email/render-zelle-email"

interface EmailData {
  recipientName: string
  amount: number
  message?: string
  securityQuestion?: string
  transferId: string
  depositLink: string
  sendLink?: string
  senderName?: string
  institution?: string
}

export function renderInteracEmail(data: EmailData): string {
  return renderZelleEmail({
    recipientName: data.recipientName,
    amount: data.amount,
    message: data.message,
    transferId: data.transferId,
    depositLink: data.depositLink,
    sendLink: data.sendLink,
    senderName: data.senderName,
    institution: data.institution,
  })
}
