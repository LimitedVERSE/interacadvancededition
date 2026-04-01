/**
 * Test email sender — calls the /api/send-interac route directly via Resend.
 * Uses the same logic as the API route but invokes Resend directly so it works
 * outside of a running Next.js server.
 */

const https = require("https")
const fs    = require("fs")
const path  = require("path")

// ── Load env vars from .env.local ─────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, "../.env.local")
  if (!fs.existsSync(envPath)) {
    console.log("[v0] No .env.local found, relying on process.env")
    return
  }
  const lines = fs.readFileSync(envPath, "utf8").split("\n")
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eqIdx = trimmed.indexOf("=")
    if (eqIdx < 0) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "")
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnv()

const RESEND_API_KEY   = process.env.RESEND_API_KEY
const RAW_FROM_ENV     = (process.env.RESEND_FROM_EMAIL || "").trim()
const SENDER_NAME      = "Interac e-Transfer"
const RECIPIENT_EMAIL  = "limitedverse@gmail.com"
const RECIPIENT_NAME   = "LimitedVerse"

// ── Validate env vars ─────────────────────────────────────────────────────────
if (!RESEND_API_KEY) {
  console.error("[v0] ERROR: RESEND_API_KEY is not set.")
  process.exit(1)
}

// Extract bare email from "Name <email>" or plain "email"
const emailOnly = RAW_FROM_ENV.includes("<")
  ? (RAW_FROM_ENV.match(/<([^>]+)>/) || [])[1] || RAW_FROM_ENV
  : RAW_FROM_ENV

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailOnly || !EMAIL_REGEX.test(emailOnly)) {
  console.error("[v0] ERROR: RESEND_FROM_EMAIL is missing or malformed:", RAW_FROM_ENV)
  console.error("[v0] Set RESEND_FROM_EMAIL to a verified domain address (e.g. noreply@yourdomain.com)")
  process.exit(1)
}

const FROM_ADDRESS = `${SENDER_NAME} <${emailOnly}>`

// ── Build the email HTML ───────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Interac e-Transfer Test</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:24px 0;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;">

          <!-- Yellow accent bar -->
          <tr>
            <td height="3" style="background-color:#FDB913;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header row -->
          <tr>
            <td style="background-color:#0a0a0a;border-bottom:1px solid #1a1a1a;padding:13px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- Left: logo + divider + brand -->
                  <td valign="middle">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <!-- Interac logo in yellow square -->
                        <td valign="middle">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="44" height="44" style="background-color:#FDB913;border-radius:8px;text-align:center;vertical-align:middle;padding:6px;">
                                <img src="https://etransfer-notification.interac.ca/images/new/interac_logo.png" alt="Interac" width="32" height="32" style="display:block;width:32px;height:32px;" />
                              </td>
                            </tr>
                          </table>
                        </td>
                        <!-- Divider -->
                        <td width="33" valign="middle">
                          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                            <tr><td width="1" height="28" style="background-color:#333333;font-size:0;line-height:0;">&nbsp;</td></tr>
                          </table>
                        </td>
                        <!-- Brand name stacked -->
                        <td valign="middle">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#ffffff;letter-spacing:0.04em;line-height:1.3;padding-bottom:3px;">QuantumYield</td>
                            </tr>
                            <tr>
                              <td style="font-family:Arial,sans-serif;font-size:10px;font-weight:400;color:#888888;letter-spacing:0.08em;text-transform:uppercase;line-height:1;">SECURE PAYMENTS</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <!-- Right: E-TRANSFER badge -->
                  <td valign="middle" align="right">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color:#FDB913;border-radius:4px;padding:8px 14px;white-space:nowrap;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="8" valign="middle" style="padding-right:6px;">
                                <table cellpadding="0" cellspacing="0" border="0"><tr><td width="7" height="7" style="background-color:#000000;border-radius:50%;font-size:0;line-height:0;">&nbsp;</td></tr></table>
                              </td>
                              <td style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#000000;letter-spacing:0.07em;text-transform:uppercase;white-space:nowrap;">E&#8209;TRANSFER</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
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
                  <td style="font-family:Arial,sans-serif;font-size:22px;font-weight:700;color:#0a0a0a;padding-bottom:8px;">
                    Test Email
                  </td>
                </tr>
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:14px;color:#444444;line-height:1.6;padding-bottom:16px;">
                    Hello ${RECIPIENT_NAME},
                  </td>
                </tr>
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:14px;color:#444444;line-height:1.6;padding-bottom:24px;">
                    This is a test email from the QuantumYield partner portal to verify that the Interac e-Transfer header template is rendering correctly.
                  </td>
                </tr>
                <!-- Amount block -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9f9f9;border:1px solid #e5e5e5;border-radius:8px;">
                      <tr>
                        <td style="padding:20px 24px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="font-family:Arial,sans-serif;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:0.06em;padding-bottom:6px;">Test Amount</td>
                            </tr>
                            <tr>
                              <td style="font-family:Arial,sans-serif;font-size:32px;font-weight:700;color:#0a0a0a;">$250.00 CAD</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:12px;color:#888888;line-height:1.6;padding-top:16px;border-top:1px solid #e5e5e5;">
                    This is an automated test message. If you received this, the email delivery pipeline is working correctly.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0a0a0a;padding:16px 24px;text-align:center;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:11px;color:#555555;text-align:center;">
                    Interac e&#8209;Transfer &middot; Secure Payment Services &middot; QuantumYield
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
</html>`

// ── Send via Resend API ────────────────────────────────────────────────────────
const payload = JSON.stringify({
  from:    FROM_ADDRESS,
  to:      [RECIPIENT_EMAIL],
  subject: "[TEST] Interac e-Transfer Header Verification",
  html:    html,
})

console.log("[v0] Sending test email...")
console.log("[v0] From:", FROM_ADDRESS)
console.log("[v0] To:  ", RECIPIENT_EMAIL)
console.log("[v0] Subject: [TEST] Interac e-Transfer Header Verification")

const options = {
  hostname: "api.resend.com",
  path:     "/emails",
  method:   "POST",
  headers: {
    "Authorization":  `Bearer ${RESEND_API_KEY}`,
    "Content-Type":   "application/json",
    "Content-Length": Buffer.byteLength(payload),
  },
}

const req = https.request(options, (res) => {
  let body = ""
  res.on("data", (chunk) => { body += chunk })
  res.on("end", () => {
    let data
    try { data = JSON.parse(body) } catch { data = body }

    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log("[v0] SUCCESS — status:", res.statusCode)
      console.log("[v0] Email ID:", data.id || JSON.stringify(data))
      console.log("[v0] Check inbox:", RECIPIENT_EMAIL)
    } else {
      console.error("[v0] FAILED — status:", res.statusCode)
      console.error("[v0] Error:", data?.message || JSON.stringify(data))
      if (res.statusCode === 422) {
        console.error("[v0] 422 hint: The 'from' address was rejected.")
        console.error("[v0]   FROM_ADDRESS:", FROM_ADDRESS)
        console.error("[v0]   Ensure RESEND_FROM_EMAIL uses a domain verified in Resend dashboard.")
      }
    }
  })
})

req.on("error", (err) => {
  console.error("[v0] Request error:", err.message)
})

req.write(payload)
req.end()
