import { emailCopy, type EmailLang, type EmailLangMode } from "@/lib/email/copy"

export interface ZelleEmailData {
  recipientName: string
  amount: number
  message?: string
  transferId: string
  depositLink: string
  senderName?: string
  institution?: string
}

function wrapEmail(html: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Zelle</title>
  <style>
    body{margin:0;padding:0;background:#eaeced;font-family:Arial,sans-serif}
    table{border-collapse:collapse}
    img{border:0;display:block}
    a{color:#6D1ED4;text-decoration:none}
    a:hover{text-decoration:underline}
  </style>
</head>
<body>${html}</body>
</html>`
}

export function renderZelleEmail(data: ZelleEmailData, mode: EmailLangMode = "en"): string {
  const amount = `$${data.amount.toFixed(2)} USD`
  const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  const renderOne = (lang: EmailLang) => {
    const copy = emailCopy[lang]

    return `
      <div style="background-color:#eaeced;font-family:Arial,sans-serif;width:100%">
        <div style="max-width:600px;margin:0 auto;background-color:#fff">
          <!-- Header: table-based for full email-client compatibility -->
          <!-- Purple accent bar -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0a;">
            <tr><td height="3" style="background-color:#6D1ED4;font-size:0;line-height:0;">&nbsp;</td></tr>
          </table>
          <!-- Main header row -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0a;border-bottom:1px solid #1a1a1a;">
            <tr>
              <!-- Left: logo + divider + brand -->
              <td style="padding:13px 24px;" valign="middle">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <!-- Zelle logo in purple square -->
                    <td valign="middle">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="44" height="44" style="background-color:#6D1ED4;border-radius:8px;text-align:center;vertical-align:middle;padding:6px;">
                            <span style="color:#ffffff;font-family:Arial,sans-serif;font-size:22px;font-weight:900;line-height:32px;display:block;">Z</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <!-- Vertical divider -->
                    <td width="33" valign="middle">
                      <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                        <tr><td width="1" height="28" style="background-color:#333333;font-size:0;line-height:0;">&nbsp;</td></tr>
                      </table>
                    </td>
                    <!-- Brand name stacked -->
                    <td valign="middle">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#ffffff;letter-spacing:0.04em;line-height:1.3;padding-bottom:3px;">Zelle</td>
                        </tr>
                        <tr>
                          <td style="font-family:Arial,sans-serif;font-size:10px;font-weight:400;color:#888888;letter-spacing:0.08em;text-transform:uppercase;line-height:1;">SECURE PAYMENTS</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
              <!-- Right: ZELLE badge -->
              <td style="padding:13px 24px;" valign="middle" align="right">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="background-color:#6D1ED4;border-radius:4px;padding:8px 14px;vertical-align:middle;white-space:nowrap;">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="8" valign="middle" style="padding-right:6px;">
                            <table cellpadding="0" cellspacing="0" border="0"><tr><td width="7" height="7" style="background-color:#ffffff;border-radius:50%;opacity:0.5;font-size:0;line-height:0;">&nbsp;</td></tr></table>
                          </td>
                          <td style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#ffffff;letter-spacing:0.07em;text-transform:uppercase;white-space:nowrap;">ZELLE</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Body -->
          <div style="background-color:#dcdcdc;border-radius:0 0 36px 36px;min-height:600px;padding-bottom:48px">
            <div style="padding:32px 72px">
              <h1 style="font-size:20px;font-weight:700;margin:0 0 8px 0;word-break:break-all">${copy.greetingPrefix} ${data.recipientName},</h1>
              <h2 style="font-size:24px;font-weight:700;margin:0 0 8px 0">${copy.mainHeading}</h2>
              <p style="font-size:16px;line-height:1.5;margin:0 0 16px 0">${copy.description(amount)}</p>

              <!-- Amount Box -->
              <div style="margin-top:24px;padding:16px;background-color:#6D1ED4;border-radius:8px">
                <p style="font-size:18px;font-weight:600;margin:0;color:#ffffff">${copy.amountLabel} ${amount}</p>
              </div>
            </div>

            ${
              data.message
                ? `
            <div style="padding:0 72px;margin-top:32px">
              <div style="background-color:#f9fafb;border-left:4px solid #6D1ED4;padding:16px;border-radius:4px">
                <p style="font-size:14px;font-weight:600;color:#374151;margin:0 0 8px 0">${copy.messageLabel}</p>
                <p style="font-size:16px;color:#111827;margin:0">${data.message}</p>
              </div>
            </div>
            `
                : ""
            }

            <!-- Transfer Details Card -->
            <div style="padding:0 72px;margin-top:32px">
              <div style="background-color:#fff;border:1px solid #dfdfdf;border-radius:8px;padding:20px">
                <h3 style="font-weight:700;font-size:16px;margin:0 0 16px 0">${copy.transferDetailsHeading}</h3>
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td valign="top" width="50%">
                      <p style="font-size:14px;color:#404040;margin:0 0 4px 0">${copy.dateLabel}</p>
                      <p style="font-size:16px;margin:0;word-break:break-all">${date}</p>
                    </td>
                    <td valign="top" width="50%">
                      <p style="font-size:14px;color:#404040;margin:0 0 4px 0">${copy.referenceNumberLabel}</p>
                      <p style="font-size:16px;margin:0;word-break:break-all">${data.transferId}</p>
                    </td>
                  </tr>
                  <tr>
                    <td valign="top" width="50%">
                      <p style="font-size:14px;color:#404040;margin:0 0 4px 0">${copy.fromLabel}</p>
                      <p style="font-size:16px;margin:0;word-break:break-all">${data.senderName || "Zelle Network"}</p>
                    </td>
                    <td valign="top" width="50%">
                      <p style="font-size:14px;color:#404040;margin:0 0 4px 0">${copy.amountDetailLabel}</p>
                      <p style="font-size:16px;margin:0;word-break:break-all">${amount}</p>
                    </td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Deposit Button -->
            <div style="padding:0 72px;margin-top:32px;text-align:center">
              <a href="${data.depositLink}" style="display:inline-block;background-color:#6D1ED4;color:#ffffff;font-weight:700;padding:16px 32px;font-size:16px;border-radius:8px;text-decoration:none">${copy.depositCta}</a>
            </div>

            <!-- How to Deposit -->
            <div style="padding:0 72px;margin-top:32px">
              <div style="background-color:#fff;border:1px solid #dfdfdf;border-radius:8px;padding:20px">
                <h3 style="font-weight:700;font-size:16px;margin:0 0 16px 0">${copy.howToDepositHeading}</h3>
                <ol style="margin:0;padding-left:20px;font-size:14px;color:#404040;line-height:1.8">
                  ${copy.depositSteps.map((step) => `<li>${step}</li>`).join("")}
                </ol>
              </div>
            </div>

            <!-- Compliance Footer -->
            <div style="padding:0 72px;margin-top:32px">
              <div style="background-color:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px">
                <p style="font-size:11px;line-height:16px;color:#6b7280;margin:0">
                  <strong>${copy.complianceTitle}</strong><br/>
                  ${copy.complianceBody}
                </p>
              </div>
            </div>

            <!-- Email Footer Info -->
            <div style="padding:0 72px;margin-top:48px">
              <div style="text-align:center">
                <div style="display:flex;align-items:center;justify-content:center;gap:8px;font-size:12px;margin-bottom:16px">
                  <a href="https://www.zellepay.com/faq" style="color:#6D1ED4" target="_blank">FAQ</a>
                  <span style="color:#c5b9ac">|</span>
                  <span style="font-style:italic;color:#404040">This is a secure transaction.</span>
                </div>
                <p style="font-size:12px;color:#666;font-style:italic;margin:0 0 16px 0">
                  For your security, please do not forward this email as it contains confidential information meant only for you. Zelle will never request access to this email notification from you.
                </p>
                <p style="font-size:12px;color:#666;margin:0">
                  Click here to <a href="#" style="color:#6D1ED4">manage notification preferences</a> from this contact.
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="padding:32px;border-top:1px solid #e5e7eb">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td valign="top" width="50%">
                  <div style="width:48px;height:48px;background-color:#6D1ED4;border-radius:8px;display:flex;align-items:center;justify-content:center;">
                    <span style="color:#ffffff;font-family:Arial,sans-serif;font-size:24px;font-weight:900;line-height:48px;display:block;text-align:center;">Z</span>
                  </div>
                </td>
                <td valign="top" width="50%" style="text-align:right;font-size:14px">
                  <p style="margin:0">2000 - 2025 Zelle.</p>
                  <p style="margin:0">All rights reserved.</p>
                  <a href="https://www.zellepay.com/terms-of-use" style="color:#6D1ED4" target="_blank">Terms of Use</a>
                  <p style="margin:4px 0 0 0">Zelle and the Zelle related marks are property of Early Warning Services, LLC.</p>
                  <p style="margin:0">8501 E Princess Dr, Scottsdale, AZ 85255</p>
                </td>
              </tr>
            </table>
            <div style="border-top:1px solid #e5e7eb;margin-top:16px;padding-top:16px">
              <p style="font-size:12px;color:#373737;line-height:1.6;margin:0">
                Zelle transfers money between enrolled bank accounts in the U.S. using existing payment networks.<br/><br/>
                This email was sent to you by the Zelle Network on behalf of <strong>${data.senderName || "Zelle Network"}</strong> at <strong>${data.institution || "Zelle | Secure Disbursement Portal"}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    `
  }

  const body = mode === "dual" ? `${renderOne("en")}<div style="height:32px"></div>${renderOne("fr")}` : renderOne(mode)

  return wrapEmail(body)
}
