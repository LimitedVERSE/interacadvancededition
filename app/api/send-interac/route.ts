import { NextResponse } from "next/server"
import { generateInteracEmailHtml } from "@/lib/email-template"

export async function POST(request: Request) {
  try {
    console.log("[v0] Received request to send Interac e-Transfer")
    const body = await request.json()
    const { recipientEmail, recipientName, amount, message, securityQuestion, securityAnswer, langMode } = body

    console.log("[v0] Request data:", { recipientEmail, recipientName, amount, langMode })

    // Validate required fields
    if (!recipientEmail || !recipientName || !amount || !securityQuestion || !securityAnswer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Validate amount
    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
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

    const transferId = `INTC-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    const timestamp = Date.now()

    // Generate dynamic deposit URL with all required parameters
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const depositLink = `${baseUrl}/deposit-portal?transferId=${transferId}&amount=${amountNum}&recipient=${encodeURIComponent(recipientEmail)}&recipientName=${encodeURIComponent(recipientName)}&bankName=${encodeURIComponent("QuantumYield Holdings")}&message=${encodeURIComponent(message || "")}&timestamp=${timestamp}`

    const emailHtml = generateInteracEmailHtml({
      recipientName,
      amount: amountNum,
      message,
      securityQuestion,
      securityAnswer,
      transferId,
      depositLink,
      senderName: "QuantumYield Treasury",
      institution: "QuantumYield Holdings | Treasury & Vault Portal",
    })

    console.log("[v0] Sending email via Resend...")

    // Send email via Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "Interac e-Transfer <onboarding@resend.dev>",
        to: [recipientEmail],
        subject: `You've received an Interac e-Transfer for $${amountNum.toFixed(2)}`,
        html: emailHtml,
      }),
    })

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json()
      console.error("[v0] Resend error:", errorData)
      return NextResponse.json({ error: `Failed to send email: ${JSON.stringify(errorData)}` }, { status: 500 })
    }

    const resendResult = await resendResponse.json()
    console.log("[v0] Interac e-Transfer email sent successfully:", transferId, resendResult)

    return NextResponse.json({
      success: true,
      transferId,
      message: "Interac e-Transfer sent successfully",
    })
  } catch (error) {
    console.error("[v0] Error in send-interac API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
