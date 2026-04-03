import { NextResponse } from "next/server"

/**
 * API route to send notification emails to the admin team
 * Used for system alerts, transaction summaries, and other notifications
 */

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { subject, message, htmlContent, metadata } = body

    // Validate required fields
    if (!subject || (!message && !htmlContent)) {
      return NextResponse.json(
        { error: "Missing required fields: subject and (message or htmlContent)" },
        { status: 400 }
      )
    }

    // Check for Resend API key
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error("[v0] RESEND_API_KEY is not set")
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      )
    }

    // Get the notify email address
    const notifyEmail = process.env.NOTIFY_EMAIL || "notify@quantumyield.digital"
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@quantumyield.digital"

    // Build the from address with display name
    const SENDER_NAME = "QuantumYield Notifications"
    const emailOnly = fromEmail.includes("<")
      ? fromEmail.match(/<([^>]+)>/)?.[1]?.trim() ?? fromEmail
      : fromEmail

    const fromAddress = `${SENDER_NAME} <${emailOnly}>`

    // Build HTML content if only message was provided
    const html = htmlContent || `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:24px 0;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#0a0a0a;border-bottom:1px solid #1a1a1a;padding:20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#ffffff;">
                    QuantumYield System Notification
                  </td>
                  <td align="right" style="font-family:Arial,sans-serif;font-size:11px;color:#888888;">
                    ${new Date().toISOString().split('T')[0]}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 24px;background-color:#ffffff;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#0a0a0a;padding-bottom:16px;border-bottom:2px solid #FDB913;">
                    ${subject}
                  </td>
                </tr>
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:14px;color:#444444;line-height:1.6;padding:24px 0;">
                    ${message.replace(/\n/g, '<br />')}
                  </td>
                </tr>
                ${
                  metadata
                    ? `<tr>
                      <td style="padding:16px;background-color:#f9f9f9;border-radius:6px;font-family:Arial,sans-serif;font-size:12px;color:#666666;border-left:3px solid #FDB913;">
                        <strong>Metadata:</strong><br />
                        ${Object.entries(metadata)
                          .map(([key, value]) => `${key}: ${String(value)}`)
                          .join('<br />')}
                      </td>
                    </tr>`
                    : ''
                }
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0a0a0a;padding:16px 24px;text-align:center;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:11px;color:#555555;">
                    QuantumYield Treasury &amp; Vault Portal &mdash; Automated Notification
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    // Send via Resend
    const resendPayload = {
      from: fromAddress,
      to: [notifyEmail],
      subject: subject,
      html: html,
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resendPayload),
    })

    const resendData = await resendResponse.json()

    if (!resendResponse.ok) {
      const errorMsg = resendData?.message || resendData?.name || JSON.stringify(resendData)
      console.error("[send-notification] Resend error:", resendResponse.status, errorMsg)
      return NextResponse.json(
        { error: `Email delivery failed: ${errorMsg}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      emailId: resendData?.id,
      message: "Notification sent successfully",
      recipient: notifyEmail,
    })
  } catch (error) {
    console.error("[send-notification] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
