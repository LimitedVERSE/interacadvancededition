import { renderToStaticMarkup } from "react-dom/server"
import { InteracEmailLayout } from "@/components/email/interac-email-layout"
import { TransferCard } from "@/components/email/transfer-card"
import { MessageSection } from "@/components/email/message-section"

interface EmailData {
  recipientName: string
  amount: number
  message?: string
  securityQuestion: string
  transferId: string
  depositLink: string
}

export function renderInteracEmail(data: EmailData): string {
  const emailComponent = (
    <InteracEmailLayout senderName="Your Institution" institution="Your Bank">
      <MessageSection
        recipientName={data.recipientName}
        greeting={`Hi ${data.recipientName},`}
        description="You've received a secure Zelle payment."
      />

      <TransferCard
        amount={data.amount}
        message={data.message}
        securityQuestion={data.securityQuestion}
        depositLink={data.depositLink}
        transferId={data.transferId}
      />
    </InteracEmailLayout>
  )

  const html = renderToStaticMarkup(emailComponent)

  // Wrap in HTML document structure for email clients
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Zelle Payment</title>
  <style>
    body { margin: 0; padding: 0; }
    img { border: 0; display: block; }
    table { border-collapse: collapse; }
  </style>
</head>
<body>
  ${html}
</body>
</html>
  `
}
