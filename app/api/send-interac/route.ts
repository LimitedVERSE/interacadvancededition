import { NextResponse } from "next/server"
import { generateInteracEmailHtml } from "@/lib/email-template"
// </CHANGE>

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

    // Check for SendGrid API key
    const sendGridApiKey = process.env.SENDGRID_API_KEY
    if (!sendGridApiKey) {
      console.error("[v0] SENDGRID_API_KEY is not set")
      return NextResponse.json(
        { error: "Email service not configured. Please add SENDGRID_API_KEY to environment variables." },
        { status: 500 },
      )
    }

    const transferId = `INTC-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    const depositLink = `https://brandcentre.interac.ca/member-login/`

    const emailHtml = generateInteracEmailHtml({
      recipientName,
      amount: amountNum,
      message,
      securityQuestion,
      transferId,
      depositLink,
      senderName: "QuantumYield Treasury",
      institution: "QuantumYield Holdings | Treasury & Vault Portal",
    })
    // </CHANGE>

    console.log("[v0] Sending email via SendGrid...")

    // Send email via SendGrid
    const sendGridResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sendGridApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [
              {
                email: recipientEmail,
                name: recipientName,
              },
            ],
            subject: `You've received an Interac e-Transfer for $${amountNum.toFixed(2)}`,
          },
        ],
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || "gateway@quantumyield.exchange",
          name: "Interac e-Transfer",
        },
        content: [
          {
            type: "text/html",
            value: emailHtml,
          },
        ],
      }),
    })

    if (!sendGridResponse.ok) {
      const errorText = await sendGridResponse.text()
      console.error("[v0] SendGrid error:", errorText)
      return NextResponse.json({ error: `Failed to send email: ${errorText}` }, { status: 500 })
    }

    console.log("[v0] Interac e-Transfer email sent successfully:", transferId)

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
