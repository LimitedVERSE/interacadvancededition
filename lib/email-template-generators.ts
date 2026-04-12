// Email Template Generators for all 33 templates

interface BaseEmailData {
  recipientName: string
  amount?: number
  message?: string
  transferId?: string
  senderName?: string
  institution?: string
  timestamp?: string
  bankName?: string
  limit?: string
  deviceInfo?: string
  location?: string
  securityQuestion?: string
  securityAnswer?: string
  depositLink?: string
}

// Shared email styles
const getEmailStyles = () => `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .content { padding: 32px 24px; }
    .greeting { font-size: 24px; font-weight: 700; color: #000000; margin-bottom: 8px; }
    .subtitle { font-size: 16px; color: #666666; margin-bottom: 24px; }
    .amount-box { background-color: #FDB913; color: #000000; padding: 20px; border-radius: 8px; text-align: center; margin: 24px 0; }
    .amount-value { font-size: 32px; font-weight: 700; }
    .amount-label { font-size: 14px; color: #333333; margin-top: 4px; }
    .details-card { background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 24px 0; }
    .details-title { font-size: 16px; font-weight: 600; color: #000000; margin-bottom: 16px; }
    /* detail-row: use display:table for broad email client support */
    .detail-row { display: table; width: 100%; padding: 10px 0; border-bottom: 1px solid #e9ecef; border-collapse: collapse; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { display: table-cell; width: 45%; color: #666666; font-size: 14px; vertical-align: top; padding-right: 12px; }
    .detail-value { display: table-cell; width: 55%; color: #000000; font-size: 14px; font-weight: 500; vertical-align: top; text-align: right; }
    .button-section { text-align: center; margin: 32px 0; }
    .action-button { display: inline-block; background-color: #FDB913; color: #000000; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; }
    .alert-box { padding: 16px; border-radius: 8px; margin: 24px 0; }
    .alert-success { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
    .alert-warning { background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; }
    .alert-danger { background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
    .alert-info { background-color: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; }
    .security-section { background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 24px 0; }
    /* security-title: avoid flexbox — use inline-block spacing instead */
    .security-title { font-size: 16px; font-weight: 600; color: #000000; margin-bottom: 12px; }
    .instructions { margin: 24px 0; }
    .instructions ol { padding-left: 20px; color: #333333; }
    .instructions li { padding: 8px 0; line-height: 1.6; }
    .footer { background-color: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #e9ecef; }
    .footer-text { font-size: 12px; color: #666666; line-height: 1.6; }
    .footer-links { margin-top: 16px; }
    .footer-link { color: #FDB913; text-decoration: none; font-size: 12px; margin: 0 8px; }
  </style>
`

const getHeader = () => `
  <!--[if mso]><table width="600" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
  <!-- Yellow accent bar -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0a;">
    <tr>
      <td height="3" style="background-color:#FDB913;font-size:0;line-height:0;">&nbsp;</td>
    </tr>
  </table>
  <!-- Main header row -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0a;border-bottom:1px solid #1a1a1a;">
    <tr>
      <!-- Left: logo square + divider + brand text -->
      <td style="padding:13px 24px;" valign="middle">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <!-- Interac logo in yellow square -->
            <td valign="middle" style="padding-right:0;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="44" height="44" style="background-color:#FDB913;border-radius:8px;text-align:center;vertical-align:middle;padding:6px;">
                    <img
                      src="https://etransfer-notification.interac.ca/images/new/interac_logo.png"
                      alt="Interac"
                      width="32"
                      height="32"
                      style="display:block;width:32px;height:32px;object-fit:contain;"
                    />
                  </td>
                </tr>
              </table>
            </td>
            <!-- Vertical divider -->
            <td width="1" style="padding:0 16px;" valign="middle">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="1" height="28" style="background-color:rgba(255,255,255,0.18);font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
            <!-- Brand name stacked -->
            <td valign="middle">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:13px;font-weight:700;color:#ffffff;letter-spacing:0.04em;line-height:1.2;display:block;padding-bottom:3px;">
                    QuantumYield
                  </td>
                </tr>
                <tr>
                  <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:10px;font-weight:400;color:#888888;letter-spacing:0.08em;text-transform:uppercase;line-height:1;">
                    SECURE PAYMENTS
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
      <!-- Right: E-TRANSFER badge -->
      <td style="padding:13px 24px;" valign="middle" align="right">
        <table cellpadding="0" cellspacing="0" border="0" style="display:inline-table;">
          <tr>
            <td style="background-color:#FDB913;border-radius:4px;padding:8px 14px;vertical-align:middle;white-space:nowrap;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- Bullet dot -->
                  <td width="7" height="7" valign="middle" style="padding-right:6px;">
                    <div style="width:7px;height:7px;background-color:#000000;border-radius:50%;opacity:0.5;"></div>
                  </td>
                  <!-- Label -->
                  <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:12px;font-weight:700;color:#000000;letter-spacing:0.07em;text-transform:uppercase;white-space:nowrap;vertical-align:middle;">
                    E&#8209;TRANSFER
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <!--[if mso]></td></tr></table><![endif]-->
`

const getFooter = () => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8f9fa;border-top:1px solid #e9ecef;">
    <tr>
      <td style="padding:24px;text-align:center;">
        <p style="font-size:12px;color:#666666;line-height:1.6;margin:0 0 12px 0;font-family:Arial,sans-serif;">
          This is an automated message from Interac e-Transfer. Please do not reply to this email.<br>
          For assistance, visit <a href="https://www.interac.ca" style="color:#FDB913;text-decoration:none;">interac.ca</a>
        </p>
        <p style="font-size:12px;color:#666666;margin:0 0 12px 0;font-family:Arial,sans-serif;">
          <a href="https://www.interac.ca/en/consumers/products/interac-e-transfer/" style="color:#FDB913;text-decoration:none;margin:0 8px;">Learn More</a>
          <a href="https://www.interac.ca/en/contact-us/" style="color:#FDB913;text-decoration:none;margin:0 8px;">Contact Us</a>
          <a href="https://www.interac.ca/en/privacy/" style="color:#FDB913;text-decoration:none;margin:0 8px;">Privacy Policy</a>
        </p>
        <p style="font-size:12px;color:#666666;margin:0;font-family:Arial,sans-serif;">
          &copy; ${new Date().getFullYear()} Interac Corp. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
`

function formatAmount(amount: number): string {
  return amount.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-CA", { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

// 1. Transfer Received
export function generateTransferReceived(data: BaseEmailData): string {
  const amount = data.amount || 0
  const link = data.depositLink || "https://interac.quantumyield.digital/deposit-portal"
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Hello ${data.recipientName},</h1>
          <p class="subtitle">You have received a secure Interac e-Transfer.</p>
          
          <div class="amount-box">
            <div class="amount-value">$${formatAmount(amount)} CAD</div>
            <div class="amount-label">Transfer Amount</div>
          </div>
          
          <div class="details-card">
            <h3 class="details-title">Transfer Details</h3>
            <div class="detail-row"><span class="detail-label">From:</span><span class="detail-value">${data.senderName || "QuantumYield Treasury"}</span></div>
            <div class="detail-row"><span class="detail-label">Date:</span><span class="detail-value">${formatDate()}</span></div>
            <div class="detail-row"><span class="detail-label">Reference:</span><span class="detail-value">${data.transferId || "INTC-000000"}</span></div>
            ${data.message ? `<div class="detail-row"><span class="detail-label">Message:</span><span class="detail-value">${data.message}</span></div>` : ""}
          </div>

          ${data.securityQuestion ? `
          <div class="security-section">
            <h4 class="security-title">Security Question</h4>
            <p style="color:#555555;font-size:14px;margin-bottom:10px;">${data.securityQuestion}</p>
            ${data.securityAnswer ? `<p style="font-size:14px;font-weight:700;color:#000000;letter-spacing:2px;">${data.securityAnswer}</p>` : ""}
          </div>` : ""}
          
          <div class="button-section">
            <a href="${link}" class="action-button">Deposit Your Money</a>
          </div>
          
          <div class="alert-box alert-warning">
            <strong>Important:</strong> This transfer expires in 30 days. Please deposit promptly.
          </div>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 2. Transfer Sent Confirmation
export function generateTransferSent(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Transfer Sent Successfully</h1>
          <p class="subtitle">Your Interac e-Transfer has been sent.</p>
          
          <div class="alert-box alert-success">
            <strong>Confirmed:</strong> Your transfer of $${formatAmount(amount)} CAD has been successfully sent.
          </div>
          
          <div class="details-card">
            <h3 class="details-title">Transaction Summary</h3>
            <div class="detail-row"><span class="detail-label">Amount Sent:</span><span class="detail-value">$${formatAmount(amount)} CAD</span></div>
            <div class="detail-row"><span class="detail-label">To:</span><span class="detail-value">${data.recipientName}</span></div>
            <div class="detail-row"><span class="detail-label">Date:</span><span class="detail-value">${formatDate()}</span></div>
            <div class="detail-row"><span class="detail-label">Reference:</span><span class="detail-value">${data.transferId || "INTC-000000"}</span></div>
            <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color: #28a745;">Sent</span></div>
          </div>
          
          <p style="color: #666666; font-size: 14px; margin-top: 24px;">
            The recipient will receive an email notification with instructions to deposit the funds.
            You will be notified once the transfer has been deposited.
          </p>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 3. Transfer Pending
export function generateTransferPending(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Transfer Pending</h1>
          <p class="subtitle">Action required to complete your e-Transfer.</p>
          
          <div class="alert-box alert-warning">
            <strong>Pending:</strong> Your transfer of $${formatAmount(amount)} CAD is awaiting deposit.
          </div>
          
          <div class="amount-box" style="background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);">
            <div class="amount-value">$${formatAmount(amount)} CAD</div>
            <div class="amount-label">Pending Amount</div>
          </div>
          
          <div class="details-card">
            <h3 class="details-title">Transfer Details</h3>
            <div class="detail-row"><span class="detail-label">Recipient:</span><span class="detail-value">${data.recipientName}</span></div>
            <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color: #ffc107;">Pending</span></div>
            <div class="detail-row"><span class="detail-label">Expires:</span><span class="detail-value">30 days from send date</span></div>
            <div class="detail-row"><span class="detail-label">Reference:</span><span class="detail-value">${data.transferId || "INTC-000000"}</span></div>
          </div>
          
          <p style="color: #666666; font-size: 14px;">
            The recipient has been notified. If they haven't received the email, you may resend or cancel the transfer.
          </p>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 4. Transfer Cancelled
export function generateTransferCancelled(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Transfer Cancelled</h1>
          <p class="subtitle">Your Interac e-Transfer has been cancelled.</p>
          
          <div class="alert-box alert-danger">
            <strong>Cancelled:</strong> The transfer of $${formatAmount(amount)} CAD has been cancelled and funds returned.
          </div>
          
          <div class="details-card">
            <h3 class="details-title">Cancellation Details</h3>
            <div class="detail-row"><span class="detail-label">Original Amount:</span><span class="detail-value">$${formatAmount(amount)} CAD</span></div>
            <div class="detail-row"><span class="detail-label">Intended Recipient:</span><span class="detail-value">${data.recipientName}</span></div>
            <div class="detail-row"><span class="detail-label">Cancelled On:</span><span class="detail-value">${formatDate()}</span></div>
            <div class="detail-row"><span class="detail-label">Reference:</span><span class="detail-value">${data.transferId || "INTC-000000"}</span></div>
            <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color: #dc3545;">Cancelled</span></div>
          </div>
          
          <p style="color: #666666; font-size: 14px;">
            The funds have been returned to your account. Please allow 1-2 business days for the refund to appear.
          </p>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 5. Transfer Expired
export function generateTransferExpired(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Transfer Expired</h1>
          <p class="subtitle">Your Interac e-Transfer was not claimed in time.</p>
          
          <div class="alert-box alert-warning">
            <strong>Expired:</strong> The transfer of $${formatAmount(amount)} CAD was not deposited within 30 days.
          </div>
          
          <div class="details-card">
            <h3 class="details-title">Expiry Details</h3>
            <div class="detail-row"><span class="detail-label">Amount:</span><span class="detail-value">$${formatAmount(amount)} CAD</span></div>
            <div class="detail-row"><span class="detail-label">Recipient:</span><span class="detail-value">${data.recipientName}</span></div>
            <div class="detail-row"><span class="detail-label">Reference:</span><span class="detail-value">${data.transferId || "INTC-000000"}</span></div>
            <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color: #6c757d;">Expired</span></div>
          </div>
          
          <p style="color: #666666; font-size: 14px;">
            The funds will be automatically returned to your account within 1-2 business days. You may send a new transfer if needed.
          </p>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 6. Deposit Completed
export function generateDepositCompleted(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Deposit Successful!</h1>
          <p class="subtitle">Your e-Transfer has been deposited to your account.</p>
          
          <div class="alert-box alert-success">
            <strong>Complete:</strong> $${formatAmount(amount)} CAD has been added to your account.
          </div>
          
          <div class="amount-box" style="background: linear-gradient(135deg, #28a745 0%, #218838 100%);">
            <div class="amount-value">$${formatAmount(amount)} CAD</div>
            <div class="amount-label">Successfully Deposited</div>
          </div>
          
          <div class="details-card">
            <h3 class="details-title">Deposit Details</h3>
            <div class="detail-row"><span class="detail-label">From:</span><span class="detail-value">${data.senderName || "QuantumYield Treasury"}</span></div>
            <div class="detail-row"><span class="detail-label">To Account:</span><span class="detail-value">${data.bankName || "Primary Chequing"}</span></div>
            <div class="detail-row"><span class="detail-label">Date:</span><span class="detail-value">${formatDate()}</span></div>
            <div class="detail-row"><span class="detail-label">Reference:</span><span class="detail-value">${data.transferId || "INTC-000000"}</span></div>
            <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color: #28a745;">Completed</span></div>
          </div>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 7. Deposit Failed
export function generateDepositFailed(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Deposit Failed</h1>
          <p class="subtitle">We couldn't complete your e-Transfer deposit.</p>
          
          <div class="alert-box alert-danger">
            <strong>Action Required:</strong> Your deposit of $${formatAmount(amount)} CAD could not be processed.
          </div>
          
          <div class="details-card">
            <h3 class="details-title">Issue Details</h3>
            <div class="detail-row"><span class="detail-label">Amount:</span><span class="detail-value">$${formatAmount(amount)} CAD</span></div>
            <div class="detail-row"><span class="detail-label">Reference:</span><span class="detail-value">${data.transferId || "INTC-000000"}</span></div>
            <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color: #dc3545;">Failed</span></div>
          </div>
          
          <div class="security-section">
            <h4 class="security-title">Common Reasons for Failure</h4>
            <ul style="color: #666666; padding-left: 20px;">
              <li>Incorrect security answer</li>
              <li>Account restrictions</li>
              <li>Technical issues with your bank</li>
            </ul>
          </div>
          
          <div class="button-section">
            <a href="https://interac.quantumyield.digital/deposit-portal" class="action-button">Try Again</a>
          </div>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 8. Deposit Reminder
export function generateDepositReminder(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Reminder: Unclaimed e-Transfer</h1>
          <p class="subtitle">Don't forget to deposit your money, ${data.recipientName}!</p>
          
          <div class="alert-box alert-warning">
            <strong>Reminder:</strong> You have an unclaimed e-Transfer of $${formatAmount(amount)} CAD waiting.
          </div>
          
          <div class="amount-box">
            <div class="amount-value">$${formatAmount(amount)} CAD</div>
            <div class="amount-label">Waiting for You</div>
          </div>
          
          <div class="details-card">
            <h3 class="details-title">Transfer Details</h3>
            <div class="detail-row"><span class="detail-label">From:</span><span class="detail-value">${data.senderName || "QuantumYield Treasury"}</span></div>
            <div class="detail-row"><span class="detail-label">Reference:</span><span class="detail-value">${data.transferId || "INTC-000000"}</span></div>
          </div>
          
          <div class="button-section">
            <a href="https://interac.quantumyield.digital/deposit-portal" class="action-button">Deposit Now</a>
          </div>
          
          <p style="color: #856404; font-size: 14px; text-align: center;">
            This transfer will expire soon. Please deposit before the expiry date.
          </p>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 9. Deposit Instructions
export function generateDepositInstructions(data: BaseEmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">How to Deposit Your e-Transfer</h1>
          <p class="subtitle">Follow these simple steps to receive your money.</p>
          
          <div class="instructions">
            <ol>
              <li><strong>Click the Deposit Button:</strong> Click "Deposit Your Money" in the transfer notification email.</li>
              <li><strong>Select Your Bank:</strong> Choose your financial institution from the list of supported banks.</li>
              <li><strong>Sign In:</strong> Log in to your online banking using your credentials.</li>
              <li><strong>Answer Security Question:</strong> Enter the correct answer provided by the sender.</li>
              <li><strong>Choose Account:</strong> Select which account to deposit the funds into.</li>
              <li><strong>Confirm:</strong> Review and confirm the deposit.</li>
            </ol>
          </div>
          
          <div class="alert-box alert-info">
            <strong>Tip:</strong> Enable Auto-Deposit to automatically receive future e-Transfers without answering security questions.
          </div>
          
          <div class="button-section">
            <a href="https://interac.quantumyield.digital/deposit-portal" class="action-button">Start Deposit</a>
          </div>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 10. Auto-Deposit Enabled
export function generateAutoDepositEnabled(data: BaseEmailData): string {
  const activationDate = "Thursday, March 26, 2026 at 10:31 a.m."
  const receiver = data.recipientName || "NICK ST-PIERRE"
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Auto-Deposit Activated!</h1>
          <p class="subtitle">Future e-Transfers will be deposited automatically.</p>

          <div class="alert-box alert-success">
            <strong>Enablement:</strong> Interac e-Transfer Auto-Deposit has been activated for your account when receiving from QuantumYield.
          </div>

          <div class="details-card">
            <h3 class="details-title">Auto-Deposit Settings</h3>
            <div class="detail-row">
              <span class="detail-label">Verified Sender:</span>
              <span class="detail-value">QuantumYield Innovation Technology</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Receiver:</span>
              <span class="detail-value">${receiver}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value" style="color: #28a745; font-weight: 600;">Active</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Activation Date:</span>
              <span class="detail-value">${activationDate}</span>
            </div>
          </div>

          <div class="security-section">
            <h4 class="security-title">What This Means</h4>
            <p style="color: #555555; font-size: 14px; line-height: 1.7; margin: 0;">
              All future Interac e-Transfers sent from this verified sender will be automatically deposited into the recipient&apos;s account, requiring no action on their part. Note that wait times may vary, and an email confirmation will follow each transaction.
            </p>
          </div>

          <div class="alert-box alert-info" style="margin-top: 24px;">
            <strong>Note:</strong> If you did not request Auto-Deposit activation or do not recognize this sender, please contact your financial institution immediately to review your account settings.
          </div>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 11. Security Question Updated
export function generateSecurityQuestionUpdated(data: BaseEmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Security Settings Updated</h1>
          <p class="subtitle">Your e-Transfer security question has been changed.</p>
          
          <div class="alert-box alert-info">
            <strong>Updated:</strong> Your security question was successfully changed on ${formatDate()}.
          </div>
          
          <div class="security-section">
            <h4 class="security-title">Important Security Notice</h4>
            <p style="color: #666666; font-size: 14px; line-height: 1.6;">
              If you did not make this change, please contact your financial institution immediately.
              Your account security is our top priority.
            </p>
          </div>
          
          <div class="alert-box alert-warning">
            <strong>Remember:</strong> Never share your security answer with anyone. Legitimate organizations will never ask for it.
          </div>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 12. Suspicious Activity Alert
export function generateSuspiciousActivity(data: BaseEmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting" style="color: #dc3545;">Security Alert</h1>
          <p class="subtitle">Unusual activity detected on your account.</p>
          
          <div class="alert-box alert-danger">
            <strong>Alert:</strong> We detected unusual activity that requires your immediate attention.
          </div>
          
          <div class="details-card">
            <h3 class="details-title">Activity Details</h3>
            <div class="detail-row"><span class="detail-label">Type:</span><span class="detail-value">Unusual Transaction Pattern</span></div>
            <div class="detail-row"><span class="detail-label">Detected:</span><span class="detail-value">${formatDate()}</span></div>
            <div class="detail-row"><span class="detail-label">Location:</span><span class="detail-value">${data.location || "Unknown Location"}</span></div>
          </div>
          
          <div class="security-section">
            <h4 class="security-title">Recommended Actions</h4>
            <ol style="color: #666666; padding-left: 20px;">
              <li>Review your recent transactions</li>
              <li>Change your password immediately</li>
              <li>Enable two-factor authentication</li>
              <li>Contact your bank if unauthorized activity is found</li>
            </ol>
          </div>
          
          <p style="color: #dc3545; font-size: 14px; font-weight: 500; text-align: center;">
            If you don't recognize this activity, contact your financial institution immediately.
          </p>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 13. Password Reset
export function generatePasswordReset(data: BaseEmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Reset Your Password</h1>
          <p class="subtitle">You requested to reset your password.</p>
          
          <div class="alert-box alert-info">
            This password reset link will expire in 24 hours.
          </div>
          
          <div class="button-section">
            <a href="#" class="action-button">Reset Password</a>
          </div>
          
          <div class="security-section">
            <h4 class="security-title">Didn't Request This?</h4>
            <p style="color: #666666; font-size: 14px; line-height: 1.6;">
              If you didn't request a password reset, please ignore this email or contact support if you believe your account has been compromised.
            </p>
          </div>
          
          <p style="color: #666666; font-size: 12px; text-align: center; margin-top: 24px;">
            For security, this request was received from IP: ${data.location || "Unknown"} on ${formatDate()}
          </p>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 14. Two-Factor Authentication
export function generateTwoFactorEnabled(data: BaseEmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Two-Factor Authentication Enabled</h1>
          <p class="subtitle">Your account is now more secure.</p>
          
          <div class="alert-box alert-success">
            <strong>Enabled:</strong> Two-factor authentication has been activated for your account.
          </div>
          
          <div class="details-card">
            <h3 class="details-title">2FA Settings</h3>
            <div class="detail-row"><span class="detail-label">Method:</span><span class="detail-value">Authenticator App</span></div>
            <div class="detail-row"><span class="detail-label">Enabled On:</span><span class="detail-value">${formatDate()}</span></div>
            <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color: #28a745;">Active</span></div>
          </div>
          
          <div class="security-section">
            <h4 class="security-title">Important</h4>
            <p style="color: #666666; font-size: 14px; line-height: 1.6;">
              Save your backup codes in a secure location. You'll need them if you lose access to your authenticator app.
            </p>
          </div>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 15. New Login Detected
export function generateLoginNotification(data: BaseEmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">New Sign-In Detected</h1>
          <p class="subtitle">A new device signed in to your account.</p>
          
          <div class="alert-box alert-info">
            <strong>New Login:</strong> We noticed a sign-in to your account from a new device.
          </div>
          
          <div class="details-card">
            <h3 class="details-title">Login Details</h3>
            <div class="detail-row"><span class="detail-label">Device:</span><span class="detail-value">${data.deviceInfo || "Chrome on Windows"}</span></div>
            <div class="detail-row"><span class="detail-label">Location:</span><span class="detail-value">${data.location || "Toronto, Canada"}</span></div>
            <div class="detail-row"><span class="detail-label">Time:</span><span class="detail-value">${formatDate()}</span></div>
          </div>
          
          <div class="security-section">
            <h4 class="security-title">Was this you?</h4>
            <p style="color: #666666; font-size: 14px; line-height: 1.6;">
              If this was you, no action is needed. If you don't recognize this activity, please secure your account immediately.
            </p>
          </div>
          
          <div class="button-section">
            <a href="#" class="action-button" style="background-color: #dc3545;">Secure My Account</a>
          </div>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 16. Account Verified
export function generateAccountVerified(data: BaseEmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Account Verified!</h1>
          <p class="subtitle">Welcome to Interac e-Transfer, ${data.recipientName}.</p>
          
          <div class="alert-box alert-success">
            <strong>Verified:</strong> Your account has been successfully verified and activated.
          </div>
          
          <div class="security-section">
            <h4 class="security-title">You Can Now</h4>
            <ul style="color: #666666; padding-left: 20px; line-height: 2;">
              <li>Send money to anyone with an email address</li>
              <li>Receive e-Transfers from others</li>
              <li>Set up Auto-Deposit for instant funds</li>
              <li>Request money from contacts</li>
            </ul>
          </div>
          
          <div class="button-section">
            <a href="https://interac.quantumyield.digital/dashboard" class="action-button">Get Started</a>
          </div>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 17. Profile Updated
export function generateProfileUpdated(data: BaseEmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Profile Updated</h1>
          <p class="subtitle">Your profile information has been changed.</p>
          
          <div class="alert-box alert-info">
            <strong>Updated:</strong> Your profile was modified on ${formatDate()}.
          </div>
          
          <div class="details-card">
            <h3 class="details-title">Changed Information</h3>
            <div class="detail-row"><span class="detail-label">Account:</span><span class="detail-value">${data.recipientName}</span></div>
            <div class="detail-row"><span class="detail-label">Updated:</span><span class="detail-value">${formatDate()}</span></div>
          </div>
          
          <div class="security-section">
            <h4 class="security-title">Didn't Make These Changes?</h4>
            <p style="color: #666666; font-size: 14px; line-height: 1.6;">
              If you didn't update your profile, please contact support immediately and change your password.
            </p>
          </div>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 18. Bank Account Linked
export function generateBankLinked(data: BaseEmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Bank Account Linked</h1>
          <p class="subtitle">Your bank account has been successfully connected.</p>
          
          <div class="alert-box alert-success">
            <strong>Connected:</strong> ${data.bankName || "Your bank account"} is now linked to your profile.
          </div>
          
          <div class="details-card">
            <h3 class="details-title">Linked Account</h3>
            <div class="detail-row"><span class="detail-label">Bank:</span><span class="detail-value">${data.bankName || "Financial Institution"}</span></div>
            <div class="detail-row"><span class="detail-label">Account:</span><span class="detail-value">****${Math.floor(Math.random() * 9000) + 1000}</span></div>
            <div class="detail-row"><span class="detail-label">Linked On:</span><span class="detail-value">${formatDate()}</span></div>
            <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color: #28a745;">Active</span></div>
          </div>
          
          <p style="color: #666666; font-size: 14px;">
            You can now send and receive e-Transfers using this account.
          </p>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 19. Transfer Limit Increased
export function generateLimitIncrease(data: BaseEmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Transfer Limit Increased</h1>
          <p class="subtitle">Your daily e-Transfer limit has been updated.</p>
          
          <div class="alert-box alert-success">
            <strong>Approved:</strong> Your transfer limit has been increased.
          </div>
          
          <div class="amount-box" style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);">
            <div class="amount-value">$${data.limit || "10,000"}</div>
            <div class="amount-label">New Daily Limit</div>
          </div>
          
          <div class="details-card">
            <h3 class="details-title">Limit Details</h3>
            <div class="detail-row"><span class="detail-label">Previous Limit:</span><span class="detail-value">$3,000 CAD</span></div>
            <div class="detail-row"><span class="detail-label">New Limit:</span><span class="detail-value">$${data.limit || "10,000"} CAD</span></div>
            <div class="detail-row"><span class="detail-label">Effective:</span><span class="detail-value">${formatDate()}</span></div>
          </div>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 20. Money Request
export function generateMoneyRequest(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Money Request</h1>
          <p class="subtitle">${data.senderName || "Someone"} is requesting money from you.</p>
          
          <div class="amount-box" style="background: linear-gradient(135deg, #e83e8c 0%, #c82333 100%);">
            <div class="amount-value">$${formatAmount(amount)} CAD</div>
            <div class="amount-label">Requested Amount</div>
          </div>
          
          <div class="details-card">
            <h3 class="details-title">Request Details</h3>
            <div class="detail-row"><span class="detail-label">From:</span><span class="detail-value">${data.senderName || "Requester"}</span></div>
            <div class="detail-row"><span class="detail-label">Amount:</span><span class="detail-value">$${formatAmount(amount)} CAD</span></div>
            ${data.message ? `<div class="detail-row"><span class="detail-label">Message:</span><span class="detail-value">${data.message}</span></div>` : ""}
            <div class="detail-row"><span class="detail-label">Request ID:</span><span class="detail-value">${data.transferId || "REQ-000000"}</span></div>
          </div>
          
          <div class="button-section" style="display: flex; gap: 12px; justify-content: center;">
            <a href="#" class="action-button">Send Money</a>
            <a href="#" class="action-button" style="background-color: #6c757d;">Decline</a>
          </div>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 21. Request Accepted
export function generateRequestAccepted(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Request Accepted!</h1>
          <p class="subtitle">Your money request has been fulfilled.</p>
          
          <div class="alert-box alert-success">
            <strong>Success:</strong> ${data.recipientName || "Someone"} sent you $${formatAmount(amount)} CAD.
          </div>
          
          <div class="amount-box" style="background: linear-gradient(135deg, #28a745 0%, #218838 100%);">
            <div class="amount-value">$${formatAmount(amount)} CAD</div>
            <div class="amount-label">Received</div>
          </div>
          
          <div class="details-card">
            <h3 class="details-title">Transaction Details</h3>
            <div class="detail-row"><span class="detail-label">From:</span><span class="detail-value">${data.recipientName || "Sender"}</span></div>
            <div class="detail-row"><span class="detail-label">Amount:</span><span class="detail-value">$${formatAmount(amount)} CAD</span></div>
            <div class="detail-row"><span class="detail-label">Date:</span><span class="detail-value">${formatDate()}</span></div>
            <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color: #28a745;">Completed</span></div>
          </div>
          
          <div class="button-section">
            <a href="https://interac.quantumyield.digital/deposit-portal" class="action-button">Deposit Funds</a>
          </div>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// 22. Request Declined
export function generateRequestDeclined(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head>
    <body>
      <div class="container">
        ${getHeader()}
        <div class="content">
          <h1 class="greeting">Request Declined</h1>
          <p class="subtitle">Your money request was not fulfilled.</p>
          
          <div class="alert-box alert-warning">
            <strong>Declined:</strong> ${data.recipientName || "The recipient"} couldn't fulfill your request.
          </div>
          
          <div class="details-card">
            <h3 class="details-title">Request Details</h3>
            <div class="detail-row"><span class="detail-label">Requested From:</span><span class="detail-value">${data.recipientName || "Recipient"}</span></div>
            <div class="detail-row"><span class="detail-label">Amount:</span><span class="detail-value">$${formatAmount(amount)} CAD</span></div>
            <div class="detail-row"><span class="detail-label">Date:</span><span class="detail-value">${formatDate()}</span></div>
            <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color: #6c757d;">Declined</span></div>
          </div>
          
          <p style="color: #666666; font-size: 14px; text-align: center;">
            You can send a new request or contact the recipient directly.
          </p>
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `
}

// ---------- FRENCH TRANSLATIONS – TEMPLATES 1–11 ----------

export function generateTransferReceivedFr(d: BaseEmailData): string {
  const a = d.amount || 0
  const link = d.depositLink || "https://interac.quantumyield.digital/deposit-portal"
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Bonjour ${d.recipientName},</h1><p class="subtitle">Vous avez reçu un virement Interac sécurisé.</p><div class="amount-box"><div class="amount-value">${formatAmount(a)} $ CAD</div><div class="amount-label">Montant du virement</div></div><div class="details-card"><h3 class="details-title">Détails du virement</h3><div class="detail-row"><span class="detail-label">De :</span><span class="detail-value">${d.senderName || "QuantumYield Treasury"}</span></div><div class="detail-row"><span class="detail-label">Date :</span><span class="detail-value">${formatDate()}</span></div><div class="detail-row"><span class="detail-label">Référence :</span><span class="detail-value">${d.transferId || "INTC-000000"}</span></div>${d.message ? `<div class="detail-row"><span class="detail-label">Message :</span><span class="detail-value">${d.message}</span></div>` : ""}</div>${d.securityQuestion ? `<div class="security-section"><h4 class="security-title">Question de sécurité</h4><p style="color:#555555;font-size:14px;margin-bottom:10px;">${d.securityQuestion}</p>${d.securityAnswer ? `<p style="font-size:14px;font-weight:700;color:#000000;letter-spacing:2px;">${d.securityAnswer}</p>` : ""}</div>` : ""}<div class="button-section"><a href="${link}" class="action-button">Déposer votre argent</a></div><div class="alert-box alert-warning"><strong>Important :</strong> Ce virement expire dans 30 jours. Veuillez le déposer rapidement.</div></div>${getFooter()}</div></body></html>`
}

export function generateTransferSentFr(d: BaseEmailData): string {
  const a = d.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Virement envoyé avec succès</h1><p class="subtitle">Votre virement Interac a été envoyé.</p><div class="alert-box alert-success"><strong>Confirmé :</strong> Votre virement de ${formatAmount(a)} $ CAD a été envoyé avec succès.</div><div class="details-card"><h3 class="details-title">Résumé de la transaction</h3><div class="detail-row"><span class="detail-label">Montant envoyé :</span><span class="detail-value">${formatAmount(a)} $ CAD</span></div><div class="detail-row"><span class="detail-label">À :</span><span class="detail-value">${d.recipientName}</span></div><div class="detail-row"><span class="detail-label">Date :</span><span class="detail-value">${formatDate()}</span></div><div class="detail-row"><span class="detail-label">Référence :</span><span class="detail-value">${d.transferId || "INTC-000000"}</span></div><div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#28a745;">Envoyé</span></div></div><p style="color:#666666;font-size:14px;margin-top:24px;">Le destinataire recevra un courriel avec les instructions pour déposer les fonds.</p></div>${getFooter()}</div></body></html>`
}

export function generateTransferPendingFr(d: BaseEmailData): string {
  const a = d.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Virement en attente</h1><p class="subtitle">Une action est requise pour compléter votre virement.</p><div class="alert-box alert-warning"><strong>En attente :</strong> Votre virement de ${formatAmount(a)} $ CAD attend d&apos;être déposé.</div><div class="amount-box" style="background:linear-gradient(135deg,#ffc107 0%,#e0a800 100%);"><div class="amount-value">${formatAmount(a)} $ CAD</div><div class="amount-label">Montant en attente</div></div><div class="details-card"><h3 class="details-title">Détails du virement</h3><div class="detail-row"><span class="detail-label">Destinataire :</span><span class="detail-value">${d.recipientName}</span></div><div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#ffc107;">En attente</span></div><div class="detail-row"><span class="detail-label">Expire :</span><span class="detail-value">30 jours à compter de la date d&apos;envoi</span></div><div class="detail-row"><span class="detail-label">Référence :</span><span class="detail-value">${d.transferId || "INTC-000000"}</span></div></div></div>${getFooter()}</div></body></html>`
}

export function generateTransferCancelledFr(d: BaseEmailData): string {
  const a = d.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Virement annulé</h1><p class="subtitle">Votre virement Interac a été annulé.</p><div class="alert-box alert-danger"><strong>Annulé :</strong> Le virement de ${formatAmount(a)} $ CAD a été annulé et les fonds ont été remboursés.</div><div class="details-card"><h3 class="details-title">Détails de l&apos;annulation</h3><div class="detail-row"><span class="detail-label">Montant initial :</span><span class="detail-value">${formatAmount(a)} $ CAD</span></div><div class="detail-row"><span class="detail-label">Destinataire prévu :</span><span class="detail-value">${d.recipientName}</span></div><div class="detail-row"><span class="detail-label">Annulé le :</span><span class="detail-value">${formatDate()}</span></div><div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#dc3545;">Annulé</span></div></div><p style="color:#666666;font-size:14px;margin-top:16px;">Les fonds seront remboursés dans 1 à 2 jours ouvrables.</p></div>${getFooter()}</div></body></html>`
}

export function generateTransferExpiredFr(d: BaseEmailData): string {
  const a = d.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Virement expiré</h1><p class="subtitle">Votre virement Interac n&apos;a pas été réclamé à temps.</p><div class="alert-box alert-warning"><strong>Expiré :</strong> Le virement de ${formatAmount(a)} $ CAD n&apos;a pas été déposé dans les 30 jours.</div><div class="details-card"><h3 class="details-title">Détails de l&apos;expiration</h3><div class="detail-row"><span class="detail-label">Montant :</span><span class="detail-value">${formatAmount(a)} $ CAD</span></div><div class="detail-row"><span class="detail-label">Destinataire :</span><span class="detail-value">${d.recipientName}</span></div><div class="detail-row"><span class="detail-label">Référence :</span><span class="detail-value">${d.transferId || "INTC-000000"}</span></div><div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#6c757d;">Expiré</span></div></div><p style="color:#666666;font-size:14px;margin-top:16px;">Les fonds seront remboursés à votre compte dans 1 à 2 jours ouvrables.</p></div>${getFooter()}</div></body></html>`
}

export function generateDepositCompletedFr(d: BaseEmailData): string {
  const a = d.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Dépôt réussi!</h1><p class="subtitle">Votre virement a été déposé dans votre compte.</p><div class="alert-box alert-success"><strong>Complété :</strong> ${formatAmount(a)} $ CAD ont été ajoutés à votre compte.</div><div class="amount-box" style="background:linear-gradient(135deg,#28a745 0%,#218838 100%);"><div class="amount-value">${formatAmount(a)} $ CAD</div><div class="amount-label">Déposé avec succès</div></div><div class="details-card"><h3 class="details-title">Détails du dépôt</h3><div class="detail-row"><span class="detail-label">De :</span><span class="detail-value">${d.senderName || "QuantumYield Treasury"}</span></div><div class="detail-row"><span class="detail-label">Au compte :</span><span class="detail-value">${d.bankName || "Compte chèques principal"}</span></div><div class="detail-row"><span class="detail-label">Date :</span><span class="detail-value">${formatDate()}</span></div><div class="detail-row"><span class="detail-label">Référence :</span><span class="detail-value">${d.transferId || "INTC-000000"}</span></div><div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#28a745;">Complété</span></div></div></div>${getFooter()}</div></body></html>`
}

export function generateDepositFailedFr(d: BaseEmailData): string {
  const a = d.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Dépôt échoué</h1><p class="subtitle">Nous n&apos;avons pas pu compléter votre dépôt.</p><div class="alert-box alert-danger"><strong>Action requise :</strong> Votre dépôt de ${formatAmount(a)} $ CAD n&apos;a pas pu être traité.</div><div class="details-card"><h3 class="details-title">Détails du problème</h3><div class="detail-row"><span class="detail-label">Montant :</span><span class="detail-value">${formatAmount(a)} $ CAD</span></div><div class="detail-row"><span class="detail-label">Référence :</span><span class="detail-value">${d.transferId || "INTC-000000"}</span></div><div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#dc3545;">Échoué</span></div></div><div class="security-section"><h4 class="security-title">Raisons courantes d&apos;échec</h4><ul style="color:#666666;padding-left:20px;"><li>Réponse de sécurité incorrecte</li><li>Restrictions du compte bancaire</li><li>Problèmes techniques avec votre banque</li></ul></div><div class="button-section"><a href="https://interac.quantumyield.digital/deposit-portal" class="action-button">Réessayer le dépôt</a></div></div>${getFooter()}</div></body></html>`
}

export function generateDepositReminderFr(d: BaseEmailData): string {
  const a = d.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Rappel : Virement non réclamé</h1><p class="subtitle">N&apos;oubliez pas de déposer votre argent, ${d.recipientName}!</p><div class="alert-box alert-warning"><strong>Rappel :</strong> Vous avez un virement non réclamé de ${formatAmount(a)} $ CAD en attente.</div><div class="amount-box"><div class="amount-value">${formatAmount(a)} $ CAD</div><div class="amount-label">En attente de dépôt</div></div><div class="details-card"><h3 class="details-title">Détails du virement</h3><div class="detail-row"><span class="detail-label">De :</span><span class="detail-value">${d.senderName || "QuantumYield Treasury"}</span></div><div class="detail-row"><span class="detail-label">Référence :</span><span class="detail-value">${d.transferId || "INTC-000000"}</span></div></div><div class="button-section"><a href="https://interac.quantumyield.digital/deposit-portal" class="action-button">Déposer maintenant</a></div><p style="color:#856404;font-size:14px;text-align:center;margin-top:16px;">Ce virement expirera bientôt. Veuillez le déposer avant la date d&apos;expiration.</p></div>${getFooter()}</div></body></html>`
}

export function generateDepositInstructionsFr(_d: BaseEmailData): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Comment déposer votre virement</h1><p class="subtitle">Suivez ces étapes simples pour recevoir votre argent.</p><div class="instructions"><ol><li><strong>Cliquez sur le bouton de dépôt :</strong> Cliquez sur « Déposer votre argent » dans le courriel de notification.</li><li><strong>Sélectionnez votre banque :</strong> Choisissez votre institution financière dans la liste.</li><li><strong>Connectez-vous :</strong> Entrez vos informations de connexion bancaire en ligne.</li><li><strong>Répondez à la question de sécurité :</strong> Entrez la réponse fournie par l&apos;expéditeur.</li><li><strong>Choisissez votre compte :</strong> Sélectionnez le compte où déposer les fonds.</li><li><strong>Confirmez :</strong> Vérifiez les détails et confirmez le dépôt.</li></ol></div><div class="alert-box alert-info"><strong>Conseil :</strong> Activez le dépôt automatique pour recevoir automatiquement les futurs virements sans question de sécurité.</div><div class="button-section"><a href="https://interac.quantumyield.digital/deposit-portal" class="action-button">Démarrer le dépôt</a></div></div>${getFooter()}</div></body></html>`
}

export function generateAutoDepositEnabledFr(d: BaseEmailData): string {
  const receiver = d.recipientName || "NICK ST-PIERRE"
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Dépôt automatique activé!</h1><p class="subtitle">Les futurs virements seront déposés automatiquement.</p><div class="alert-box alert-success"><strong>Activation :</strong> Le dépôt automatique Interac a été activé pour votre compte lors de la réception de virements de QuantumYield.</div><div class="details-card"><h3 class="details-title">Paramètres du dépôt automatique</h3><div class="detail-row"><span class="detail-label">Expéditeur vérifié :</span><span class="detail-value">QuantumYield Innovation Technology</span></div><div class="detail-row"><span class="detail-label">Destinataire :</span><span class="detail-value">${receiver}</span></div><div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#28a745;font-weight:600;">Actif</span></div><div class="detail-row"><span class="detail-label">Date d&apos;activation :</span><span class="detail-value">${formatDate()}</span></div></div><div class="security-section"><h4 class="security-title">Ce que cela signifie</h4><p style="color:#555555;font-size:14px;line-height:1.7;margin:0;">Tous les futurs virements Interac envoyés par cet expéditeur vérifié seront automatiquement déposés dans le compte du destinataire, sans action requise de sa part. Les délais peuvent varier et une confirmation par courriel suivra chaque transaction.</p></div><div class="alert-box alert-info" style="margin-top:24px;"><strong>Remarque :</strong> Si vous n&apos;avez pas demandé l&apos;activation du dépôt automatique, communiquez immédiatement avec votre institution financière.</div></div>${getFooter()}</div></body></html>`
}

export function generateSecurityQuestionUpdatedFr(_d: BaseEmailData): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Paramètres de sécurité mis à jour</h1><p class="subtitle">Votre question de sécurité de virement a été modifiée.</p><div class="alert-box alert-info"><strong>Mis à jour :</strong> Votre question de sécurité a été modifiée avec succès le ${formatDate()}.</div><div class="security-section"><h4 class="security-title">Avis de sécurité important</h4><p style="color:#666666;font-size:14px;line-height:1.6;">Si vous n&apos;avez pas effectué cette modification, veuillez communiquer immédiatement avec votre institution financière. La sécurité de votre compte est notre priorité absolue.</p></div><div class="alert-box alert-warning"><strong>Rappel :</strong> Ne partagez jamais votre réponse de sécurité avec qui que ce soit. Les organismes légitimes ne vous la demanderont jamais.</div></div>${getFooter()}</div></body></html>`
}

// ---------- FRENCH TRANSLATIONS – TEMPLATES 12–22 ----------

export function generateSuspiciousActivityFr(d: BaseEmailData): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting" style="color:#dc3545;">Alerte de sécurité</h1><p class="subtitle">Activité inhabituelle détectée sur votre compte.</p><div class="alert-box alert-danger"><strong>Alerte :</strong> Nous avons détecté une activité inhabituelle qui nécessite votre attention immédiate.</div><div class="details-card"><h3 class="details-title">Détails de l&apos;activité</h3><div class="detail-row"><span class="detail-label">Type :</span><span class="detail-value">Schéma de transaction inhabituel</span></div><div class="detail-row"><span class="detail-label">Détecté le :</span><span class="detail-value">${formatDate()}</span></div><div class="detail-row"><span class="detail-label">Emplacement :</span><span class="detail-value">${d.location || "Emplacement inconnu"}</span></div></div><div class="security-section"><h4 class="security-title">Actions recommandées</h4><ol style="color:#666666;padding-left:20px;"><li>Vérifiez vos transactions récentes</li><li>Changez votre mot de passe immédiatement</li><li>Activez l&apos;authentification à deux facteurs</li><li>Contactez votre banque si une activité non autorisée est trouvée</li></ol></div><p style="color:#dc3545;font-size:14px;font-weight:500;text-align:center;margin-top:16px;">Si vous ne reconnaissez pas cette activité, contactez immédiatement votre institution financière.</p></div>${getFooter()}</div></body></html>`
}

export function generatePasswordResetFr(d: BaseEmailData): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Réinitialiser votre mot de passe</h1><p class="subtitle">Vous avez demandé la réinitialisation de votre mot de passe.</p><div class="alert-box alert-info">Ce lien de réinitialisation expirera dans 24 heures.</div><div class="button-section"><a href="#" class="action-button">Réinitialiser le mot de passe</a></div><div class="security-section"><h4 class="security-title">Vous n&apos;avez pas fait cette demande?</h4><p style="color:#666666;font-size:14px;line-height:1.6;">Si vous n&apos;avez pas demandé de réinitialisation, veuillez ignorer ce courriel ou contacter le support si vous croyez que votre compte a été compromis.</p></div><p style="color:#666666;font-size:12px;text-align:center;margin-top:24px;">Pour des raisons de sécurité, cette demande a été reçue de : ${d.location || "Emplacement inconnu"} le ${formatDate()}</p></div>${getFooter()}</div></body></html>`
}

export function generateTwoFactorEnabledFr(_d: BaseEmailData): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Authentification à deux facteurs activée</h1><p class="subtitle">Votre compte est maintenant plus sécurisé.</p><div class="alert-box alert-success"><strong>Activé :</strong> L&apos;authentification à deux facteurs a été activée pour votre compte.</div><div class="details-card"><h3 class="details-title">Paramètres 2FA</h3><div class="detail-row"><span class="detail-label">Méthode :</span><span class="detail-value">Application d&apos;authentification</span></div><div class="detail-row"><span class="detail-label">Activé le :</span><span class="detail-value">${formatDate()}</span></div><div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#28a745;">Actif</span></div></div><div class="security-section"><h4 class="security-title">Important</h4><p style="color:#666666;font-size:14px;line-height:1.6;">Sauvegardez vos codes de récupération dans un endroit sécurisé. Vous en aurez besoin si vous perdez l&apos;accès à votre application d&apos;authentification.</p></div></div>${getFooter()}</div></body></html>`
}

export function generateLoginNotificationFr(d: BaseEmailData): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Nouvelle connexion détectée</h1><p class="subtitle">Un nouvel appareil s&apos;est connecté à votre compte.</p><div class="alert-box alert-info"><strong>Nouvelle connexion :</strong> Nous avons remarqué une connexion à votre compte depuis un nouvel appareil.</div><div class="details-card"><h3 class="details-title">Détails de la connexion</h3><div class="detail-row"><span class="detail-label">Appareil :</span><span class="detail-value">${d.deviceInfo || "Chrome sur Windows"}</span></div><div class="detail-row"><span class="detail-label">Emplacement :</span><span class="detail-value">${d.location || "Toronto, Canada"}</span></div><div class="detail-row"><span class="detail-label">Heure :</span><span class="detail-value">${formatDate()}</span></div></div><div class="security-section"><h4 class="security-title">Était-ce vous?</h4><p style="color:#666666;font-size:14px;line-height:1.6;">Si c&apos;était vous, aucune action n&apos;est nécessaire. Si vous ne reconnaissez pas cette activité, sécurisez votre compte immédiatement.</p></div><div class="button-section"><a href="#" class="action-button" style="background-color:#dc3545;color:#ffffff;">Sécuriser mon compte</a></div></div>${getFooter()}</div></body></html>`
}

export function generateAccountVerifiedFr(d: BaseEmailData): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Compte vérifié!</h1><p class="subtitle">Bienvenue au virement Interac, ${d.recipientName}.</p><div class="alert-box alert-success"><strong>Vérifié :</strong> Votre compte a été vérifié et activé avec succès.</div><div class="security-section"><h4 class="security-title">Vous pouvez maintenant</h4><ul style="color:#666666;padding-left:20px;line-height:2;"><li>Envoyer de l&apos;argent à quiconque possède une adresse courriel</li><li>Recevoir des virements Interac en toute sécurité</li><li>Configurer le dépôt automatique pour des fonds instantanés</li><li>Demander de l&apos;argent à vos contacts</li></ul></div><div class="button-section"><a href="https://interac.quantumyield.digital/dashboard" class="action-button">Commencer</a></div></div>${getFooter()}</div></body></html>`
}

export function generateProfileUpdatedFr(d: BaseEmailData): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Profil mis à jour</h1><p class="subtitle">Vos informations de profil ont été modifiées.</p><div class="alert-box alert-info"><strong>Mis à jour :</strong> Votre profil a été modifié avec succès le ${formatDate()}.</div><div class="details-card"><h3 class="details-title">Informations modifiées</h3><div class="detail-row"><span class="detail-label">Compte :</span><span class="detail-value">${d.recipientName}</span></div><div class="detail-row"><span class="detail-label">Mis à jour le :</span><span class="detail-value">${formatDate()}</span></div></div><div class="security-section"><h4 class="security-title">Vous n&apos;avez pas fait ces modifications?</h4><p style="color:#666666;font-size:14px;line-height:1.6;">Si vous n&apos;avez pas mis à jour votre profil, contactez le support immédiatement et changez votre mot de passe.</p></div></div>${getFooter()}</div></body></html>`
}

export function generateBankLinkedFr(d: BaseEmailData): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Compte bancaire lié</h1><p class="subtitle">Votre compte bancaire a été connecté avec succès.</p><div class="alert-box alert-success"><strong>Connecté :</strong> ${d.bankName || "Votre compte bancaire"} est maintenant lié à votre profil.</div><div class="details-card"><h3 class="details-title">Compte lié</h3><div class="detail-row"><span class="detail-label">Banque :</span><span class="detail-value">${d.bankName || "Institution financière"}</span></div><div class="detail-row"><span class="detail-label">Lié le :</span><span class="detail-value">${formatDate()}</span></div><div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#28a745;">Actif</span></div></div><p style="color:#666666;font-size:14px;margin-top:16px;">Vous pouvez maintenant envoyer et recevoir des virements Interac en utilisant ce compte.</p></div>${getFooter()}</div></body></html>`
}

export function generateLimitIncreaseFr(d: BaseEmailData): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Limite de virement augmentée</h1><p class="subtitle">Votre limite quotidienne de virement a été mise à jour.</p><div class="alert-box alert-success"><strong>Approuvé :</strong> Votre limite de virement a été augmentée avec succès.</div><div class="amount-box" style="background:linear-gradient(135deg,#17a2b8 0%,#138496 100%);"><div class="amount-value">${d.limit || "10 000"} $</div><div class="amount-label">Nouvelle limite quotidienne</div></div><div class="details-card"><h3 class="details-title">Détails de la limite</h3><div class="detail-row"><span class="detail-label">Limite précédente :</span><span class="detail-value">3 000 $ CAD</span></div><div class="detail-row"><span class="detail-label">Nouvelle limite :</span><span class="detail-value">${d.limit || "10 000"} $ CAD</span></div><div class="detail-row"><span class="detail-label">En vigueur le :</span><span class="detail-value">${formatDate()}</span></div></div></div>${getFooter()}</div></body></html>`
}

export function generateMoneyRequestFr(d: BaseEmailData): string {
  const a = d.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Demande d&apos;argent</h1><p class="subtitle">${d.senderName || "Quelqu&apos;un"} vous demande de l&apos;argent.</p><div class="amount-box" style="background:linear-gradient(135deg,#e83e8c 0%,#c82333 100%);"><div class="amount-value">${formatAmount(a)} $ CAD</div><div class="amount-label">Montant demandé</div></div><div class="details-card"><h3 class="details-title">Détails de la demande</h3><div class="detail-row"><span class="detail-label">De :</span><span class="detail-value">${d.senderName || "Demandeur"}</span></div><div class="detail-row"><span class="detail-label">Montant :</span><span class="detail-value">${formatAmount(a)} $ CAD</span></div>${d.message ? `<div class="detail-row"><span class="detail-label">Message :</span><span class="detail-value">${d.message}</span></div>` : ""}<div class="detail-row"><span class="detail-label">ID de demande :</span><span class="detail-value">${d.transferId || "REQ-000000"}</span></div></div><div class="button-section" style="display:flex;gap:12px;justify-content:center;"><a href="#" class="action-button">Envoyer l&apos;argent</a><a href="#" class="action-button" style="background-color:#6c757d;">Refuser</a></div></div>${getFooter()}</div></body></html>`
}

export function generateRequestAcceptedFr(d: BaseEmailData): string {
  const a = d.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Demande acceptée!</h1><p class="subtitle">Votre demande d&apos;argent a été honorée.</p><div class="alert-box alert-success"><strong>Succès :</strong> ${d.recipientName || "Quelqu&apos;un"} vous a envoyé ${formatAmount(a)} $ CAD.</div><div class="amount-box" style="background:linear-gradient(135deg,#28a745 0%,#218838 100%);"><div class="amount-value">${formatAmount(a)} $ CAD</div><div class="amount-label">Reçu</div></div><div class="details-card"><h3 class="details-title">Détails de la transaction</h3><div class="detail-row"><span class="detail-label">De :</span><span class="detail-value">${d.recipientName || "Expéditeur"}</span></div><div class="detail-row"><span class="detail-label">Montant :</span><span class="detail-value">${formatAmount(a)} $ CAD</span></div><div class="detail-row"><span class="detail-label">Date :</span><span class="detail-value">${formatDate()}</span></div><div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#28a745;">Complété</span></div></div><div class="button-section"><a href="https://interac.quantumyield.digital/deposit-portal" class="action-button">Déposer les fonds</a></div></div>${getFooter()}</div></body></html>`
}

export function generateRequestDeclinedFr(d: BaseEmailData): string {
  const a = d.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Demande refusée</h1><p class="subtitle">Votre demande d&apos;argent n&apos;a pas été honorée.</p><div class="alert-box alert-warning"><strong>Refusé :</strong> ${d.recipientName || "Le destinataire"} n&apos;a pas pu honorer votre demande.</div><div class="details-card"><h3 class="details-title">Détails de la demande</h3><div class="detail-row"><span class="detail-label">Demandé à :</span><span class="detail-value">${d.recipientName || "Destinataire"}</span></div><div class="detail-row"><span class="detail-label">Montant :</span><span class="detail-value">${formatAmount(a)} $ CAD</span></div><div class="detail-row"><span class="detail-label">Date :</span><span class="detail-value">${formatDate()}</span></div><div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#6c757d;">Refusé</span></div></div><p style="color:#666666;font-size:14px;text-align:center;margin-top:16px;">Vous pouvez envoyer une nouvelle demande ou contacter le destinataire directement.</p></div>${getFooter()}</div></body></html>`
}

// ---------- 11 NEW TEMPLATES (23–33) ----------

// 23. Transfer Receipt
export function generateTransferReceipt(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Transfer Receipt</h1>
    <p class="subtitle">Official record of your Interac e-Transfer.</p>
    <div class="amount-box"><div class="amount-value">$${formatAmount(amount)} CAD</div><div class="amount-label">Transfer Amount</div></div>
    <div class="details-card">
      <h3 class="details-title">Receipt Details</h3>
      <div class="detail-row"><span class="detail-label">Receipt No.:</span><span class="detail-value">${data.transferId || "RCPT-" + Date.now().toString().slice(-8)}</span></div>
      <div class="detail-row"><span class="detail-label">Recipient:</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Institution:</span><span class="detail-value">${data.institution || "QuantumYield"}</span></div>
      <div class="detail-row"><span class="detail-label">Date & Time:</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color:#28a745;font-weight:600;">Completed</span></div>
    </div>
    <div class="alert-box alert-info">Please retain this receipt for your financial records. This serves as official proof of your Interac e-Transfer transaction.</div>
  </div>${getFooter()}</div></body></html>`
}

// 23-FR. Transfer Receipt (French)
export function generateTransferReceiptFr(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Reçu de virement</h1>
    <p class="subtitle">Dossier officiel de votre virement Interac.</p>
    <div class="amount-box"><div class="amount-value">${formatAmount(amount)} $ CAD</div><div class="amount-label">Montant du virement</div></div>
    <div class="details-card">
      <h3 class="details-title">Détails du reçu</h3>
      <div class="detail-row"><span class="detail-label">No de reçu :</span><span class="detail-value">${data.transferId || "RCPT-" + Date.now().toString().slice(-8)}</span></div>
      <div class="detail-row"><span class="detail-label">Destinataire :</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Institution :</span><span class="detail-value">${data.institution || "QuantumYield"}</span></div>
      <div class="detail-row"><span class="detail-label">Date et heure :</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#28a745;font-weight:600;">Complété</span></div>
    </div>
    <div class="alert-box alert-info">Veuillez conserver ce reçu pour vos dossiers financiers. Il constitue une preuve officielle de votre transaction Interac.</div>
  </div>${getFooter()}</div></body></html>`
}

// 24. Scheduled Transfer
export function generateScheduledTransfer(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Scheduled Transfer Reminder</h1>
    <p class="subtitle">An Interac e-Transfer is scheduled to process tomorrow.</p>
    <div class="amount-box"><div class="amount-value">$${formatAmount(amount)} CAD</div><div class="amount-label">Scheduled Amount</div></div>
    <div class="details-card">
      <h3 class="details-title">Schedule Details</h3>
      <div class="detail-row"><span class="detail-label">Recipient:</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Scheduled Date:</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Reference:</span><span class="detail-value">${data.transferId || "N/A"}</span></div>
      <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color:#FDB913;font-weight:600;">Scheduled</span></div>
    </div>
    <div class="alert-box alert-warning">Ensure sufficient funds are available in your account before the scheduled date to avoid cancellation.</div>
  </div>${getFooter()}</div></body></html>`
}

// 24-FR. Scheduled Transfer (French)
export function generateScheduledTransferFr(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Rappel de virement programmé</h1>
    <p class="subtitle">Un virement Interac est prévu pour demain.</p>
    <div class="amount-box"><div class="amount-value">${formatAmount(amount)} $ CAD</div><div class="amount-label">Montant programmé</div></div>
    <div class="details-card">
      <h3 class="details-title">Détails du calendrier</h3>
      <div class="detail-row"><span class="detail-label">Destinataire :</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Date prévue :</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Référence :</span><span class="detail-value">${data.transferId || "S/O"}</span></div>
      <div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#FDB913;font-weight:600;">Programmé</span></div>
    </div>
    <div class="alert-box alert-warning">Assurez-vous que votre compte dispose de fonds suffisants avant la date prévue pour éviter l&apos;annulation.</div>
  </div>${getFooter()}</div></body></html>`
}

// 25. Deposit on Hold
export function generateDepositOnHold(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Deposit Temporarily on Hold</h1>
    <p class="subtitle">We are reviewing your deposit before it is released.</p>
    <div class="amount-box"><div class="amount-value">$${formatAmount(amount)} CAD</div><div class="amount-label">Amount on Hold</div></div>
    <div class="details-card">
      <h3 class="details-title">Hold Details</h3>
      <div class="detail-row"><span class="detail-label">Recipient:</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Reference:</span><span class="detail-value">${data.transferId || "N/A"}</span></div>
      <div class="detail-row"><span class="detail-label">Hold Applied:</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color:#856404;font-weight:600;">Under Review</span></div>
    </div>
    <div class="alert-box alert-warning"><strong>Why is my deposit on hold?</strong> Deposits may be temporarily held for security verification. You will receive a follow-up notification once the review is complete, typically within 1–2 business days.</div>
  </div>${getFooter()}</div></body></html>`
}

// 25-FR. Deposit on Hold (French)
export function generateDepositOnHoldFr(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Dépôt temporairement suspendu</h1>
    <p class="subtitle">Nous examinons votre dépôt avant de le libérer.</p>
    <div class="amount-box"><div class="amount-value">${formatAmount(amount)} $ CAD</div><div class="amount-label">Montant suspendu</div></div>
    <div class="details-card">
      <h3 class="details-title">Détails de la suspension</h3>
      <div class="detail-row"><span class="detail-label">Destinataire :</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Référence :</span><span class="detail-value">${data.transferId || "S/O"}</span></div>
      <div class="detail-row"><span class="detail-label">Suspension appliquée :</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#856404;font-weight:600;">En cours d&apos;examen</span></div>
    </div>
    <div class="alert-box alert-warning"><strong>Pourquoi mon dépôt est-il suspendu?</strong> Les dépôts peuvent être temporairement retenus pour vérification de sécurité. Vous recevrez une notification de suivi une fois l&apos;examen terminé, généralement sous 1 à 2 jours ouvrables.</div>
  </div>${getFooter()}</div></body></html>`
}

// 26. Two-Factor Code
export function generateTwoFactorCode(data: BaseEmailData): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Your Verification Code</h1>
    <p class="subtitle">Use the code below to complete your sign-in.</p>
    <div class="amount-box" style="letter-spacing: 8px; font-size: 36px; font-weight: 700;">${code}</div>
    <div class="details-card">
      <h3 class="details-title">Code Details</h3>
      <div class="detail-row"><span class="detail-label">Issued To:</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Expires In:</span><span class="detail-value">10 minutes</span></div>
      <div class="detail-row"><span class="detail-label">Time:</span><span class="detail-value">${formatDate()}</span></div>
    </div>
    <div class="alert-box alert-danger"><strong>Security Notice:</strong> Never share this code with anyone. QuantumYield and Interac will never ask for this code by phone or email.</div>
  </div>${getFooter()}</div></body></html>`
}

// 26-FR. Two-Factor Code (French)
export function generateTwoFactorCodeFr(data: BaseEmailData): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Votre code de vérification</h1>
    <p class="subtitle">Utilisez le code ci-dessous pour compléter votre connexion.</p>
    <div class="amount-box" style="letter-spacing: 8px; font-size: 36px; font-weight: 700;">${code}</div>
    <div class="details-card">
      <h3 class="details-title">Détails du code</h3>
      <div class="detail-row"><span class="detail-label">Émis à :</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Expire dans :</span><span class="detail-value">10 minutes</span></div>
      <div class="detail-row"><span class="detail-label">Heure :</span><span class="detail-value">${formatDate()}</span></div>
    </div>
    <div class="alert-box alert-danger"><strong>Avis de sécurité :</strong> Ne partagez jamais ce code avec qui que ce soit. QuantumYield et Interac ne vous demanderont jamais ce code par téléphone ou par courriel.</div>
  </div>${getFooter()}</div></body></html>`
}

// 27. Welcome Onboarding
export function generateWelcomeOnboard(data: BaseEmailData): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Welcome, ${data.recipientName}!</h1>
    <p class="subtitle">Your Interac e-Transfer account via QuantumYield is ready.</p>
    <div class="alert-box alert-success"><strong>Account Activated:</strong> You can now send and receive Interac e-Transfers securely through QuantumYield.</div>
    <div class="details-card">
      <h3 class="details-title">Getting Started</h3>
      <div class="detail-row"><span class="detail-label">Account Holder:</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Partner:</span><span class="detail-value">QuantumYield Innovation Technology</span></div>
      <div class="detail-row"><span class="detail-label">Member Since:</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color:#28a745;font-weight:600;">Active</span></div>
    </div>
    <div class="button-section"><a href="https://interac.quantumyield.digital/deposit-portal" class="action-button">Explore Your Portal</a></div>
    <div class="instructions"><h4 style="margin-bottom:12px;font-weight:600;">Next Steps</h4><ol><li>Set up your security question for deposits</li><li>Link your preferred financial institution</li><li>Enable Auto-Deposit for seamless transfers</li><li>Review your transaction limits</li></ol></div>
  </div>${getFooter()}</div></body></html>`
}

// 27-FR. Welcome Onboarding (French)
export function generateWelcomeOnboardFr(data: BaseEmailData): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Bienvenue, ${data.recipientName}!</h1>
    <p class="subtitle">Votre compte Interac via QuantumYield est prêt.</p>
    <div class="alert-box alert-success"><strong>Compte activé :</strong> Vous pouvez maintenant envoyer et recevoir des virements Interac de façon sécurisée via QuantumYield.</div>
    <div class="details-card">
      <h3 class="details-title">Pour commencer</h3>
      <div class="detail-row"><span class="detail-label">Titulaire du compte :</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Partenaire :</span><span class="detail-value">QuantumYield Innovation Technology</span></div>
      <div class="detail-row"><span class="detail-label">Membre depuis :</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#28a745;font-weight:600;">Actif</span></div>
    </div>
    <div class="button-section"><a href="https://interac.quantumyield.digital/deposit-portal" class="action-button">Explorer votre portail</a></div>
    <div class="instructions"><h4 style="margin-bottom:12px;font-weight:600;">Prochaines étapes</h4><ol><li>Configurez votre question de sécurité pour les dépôts</li><li>Liez votre institution financière préférée</li><li>Activez le dépôt automatique pour des virements transparents</li><li>Vérifiez vos limites de transaction</li></ol></div>
  </div>${getFooter()}</div></body></html>`
}

// 28. Account Suspended
export function generateAccountSuspended(data: BaseEmailData): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Account Temporarily Suspended</h1>
    <p class="subtitle">Immediate action is required to restore your access.</p>
    <div class="alert-box alert-danger"><strong>Account Suspended:</strong> Your Interac e-Transfer access has been temporarily suspended due to a security review.</div>
    <div class="details-card">
      <h3 class="details-title">Suspension Details</h3>
      <div class="detail-row"><span class="detail-label">Account Holder:</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Suspended On:</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Reason:</span><span class="detail-value">Security Review Required</span></div>
      <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color:#721c24;font-weight:600;">Suspended</span></div>
    </div>
    <div class="instructions"><h4 style="margin-bottom:12px;font-weight:600;">To Restore Access</h4><ol><li>Contact your financial institution immediately</li><li>Verify your identity with a valid government-issued ID</li><li>Complete the required security questionnaire</li><li>Await confirmation from our compliance team</li></ol></div>
    <div class="alert-box alert-warning">If you believe this suspension was made in error, please contact QuantumYield support or your financial institution directly.</div>
  </div>${getFooter()}</div></body></html>`
}

// 28-FR. Account Suspended (French)
export function generateAccountSuspendedFr(data: BaseEmailData): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Compte temporairement suspendu</h1>
    <p class="subtitle">Une action immédiate est requise pour restaurer votre accès.</p>
    <div class="alert-box alert-danger"><strong>Compte suspendu :</strong> Votre accès au virement Interac a été temporairement suspendu en raison d&apos;une vérification de sécurité.</div>
    <div class="details-card">
      <h3 class="details-title">Détails de la suspension</h3>
      <div class="detail-row"><span class="detail-label">Titulaire du compte :</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Suspendu le :</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Raison :</span><span class="detail-value">Vérification de sécurité requise</span></div>
      <div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#721c24;font-weight:600;">Suspendu</span></div>
    </div>
    <div class="instructions"><h4 style="margin-bottom:12px;font-weight:600;">Pour restaurer l&apos;accès</h4><ol><li>Communiquez immédiatement avec votre institution financière</li><li>Vérifiez votre identité avec une pièce d&apos;identité gouvernementale valide</li><li>Remplissez le questionnaire de sécurité requis</li><li>Attendez la confirmation de notre ��quipe de conformité</li></ol></div>
    <div class="alert-box alert-warning">Si vous croyez que cette suspension est une erreur, veuillez contacter le soutien QuantumYield ou votre institution financière directement.</div>
  </div>${getFooter()}</div></body></html>`
}

// 29. Referral Bonus
export function generateReferralBonus(data: BaseEmailData): string {
  const amount = data.amount || 25
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">You&apos;ve Earned a Referral Bonus!</h1>
    <p class="subtitle">Thank you for growing the QuantumYield network.</p>
    <div class="amount-box"><div class="amount-value">$${formatAmount(amount)} CAD</div><div class="amount-label">Referral Bonus Applied</div></div>
    <div class="details-card">
      <h3 class="details-title">Bonus Details</h3>
      <div class="detail-row"><span class="detail-label">Recipient:</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Bonus Amount:</span><span class="detail-value">$${formatAmount(amount)} CAD</span></div>
      <div class="detail-row"><span class="detail-label">Applied On:</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color:#28a745;font-weight:600;">Credited</span></div>
    </div>
    <div class="alert-box alert-success">Your referral bonus has been credited to your account. Keep referring friends to earn more rewards!</div>
  </div>${getFooter()}</div></body></html>`
}

// 29-FR. Referral Bonus (French)
export function generateReferralBonusFr(data: BaseEmailData): string {
  const amount = data.amount || 25
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Vous avez gagné une prime de parrainage!</h1>
    <p class="subtitle">Merci de faire croître le réseau QuantumYield.</p>
    <div class="amount-box"><div class="amount-value">${formatAmount(amount)} $ CAD</div><div class="amount-label">Prime de parrainage appliquée</div></div>
    <div class="details-card">
      <h3 class="details-title">Détails de la prime</h3>
      <div class="detail-row"><span class="detail-label">Destinataire :</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Montant de la prime :</span><span class="detail-value">${formatAmount(amount)} $ CAD</span></div>
      <div class="detail-row"><span class="detail-label">Appliqué le :</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#28a745;font-weight:600;">Crédité</span></div>
    </div>
    <div class="alert-box alert-success">Votre prime de parrainage a été créditée à votre compte. Continuez à référer des amis pour gagner plus de récompenses!</div>
  </div>${getFooter()}</div></body></html>`
}

// 30. KYC Verification
export function generateKycVerification(data: BaseEmailData): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Identity Verification Required</h1>
    <p class="subtitle">Please complete your Know Your Customer (KYC) verification to continue.</p>
    <div class="alert-box alert-warning"><strong>Action Required:</strong> Your account requires identity verification before processing further transactions.</div>
    <div class="details-card">
      <h3 class="details-title">Verification Details</h3>
      <div class="detail-row"><span class="detail-label">Account Holder:</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Request Date:</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Deadline:</span><span class="detail-value">Within 5 business days</span></div>
      <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color:#856404;font-weight:600;">Pending Verification</span></div>
    </div>
    <div class="instructions"><h4 style="margin-bottom:12px;font-weight:600;">Documents Required</h4><ol><li>Valid government-issued photo ID (passport, driver&apos;s license)</li><li>Proof of address (utility bill or bank statement, within 90 days)</li><li>A clear selfie holding your photo ID</li></ol></div>
    <div class="alert-box alert-danger">Failure to complete verification within the deadline may result in temporary suspension of your account.</div>
  </div>${getFooter()}</div></body></html>`
}

// 30-FR. KYC Verification (French)
export function generateKycVerificationFr(data: BaseEmailData): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Vérification d&apos;identité requise</h1>
    <p class="subtitle">Veuillez compléter votre vérification KYC pour continuer.</p>
    <div class="alert-box alert-warning"><strong>Action requise :</strong> Votre compte nécessite une vérification d&apos;identité avant de traiter d&apos;autres transactions.</div>
    <div class="details-card">
      <h3 class="details-title">Détails de la vérification</h3>
      <div class="detail-row"><span class="detail-label">Titulaire du compte :</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Date de la demande :</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Délai :</span><span class="detail-value">Dans les 5 jours ouvrables</span></div>
      <div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#856404;font-weight:600;">En attente de vérification</span></div>
    </div>
    <div class="instructions"><h4 style="margin-bottom:12px;font-weight:600;">Documents requis</h4><ol><li>Pièce d&apos;identité avec photo valide (passeport, permis de conduire)</li><li>Preuve d&apos;adresse (facture de service ou relevé bancaire, dans les 90 jours)</li><li>Un égoportrait clair tenant votre pièce d&apos;identité</li></ol></div>
    <div class="alert-box alert-danger">Le non-respect du délai de vérification peut entraîner la suspension temporaire de votre compte.</div>
  </div>${getFooter()}</div></body></html>`
}

// 31. AML Hold
export function generateAmlHold(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Transaction Hold Applied</h1>
    <p class="subtitle">Your transfer is currently under compliance review.</p>
    <div class="alert-box alert-danger"><strong>Compliance Hold:</strong> This transaction has been flagged for anti-money laundering (AML) review as part of our regulatory obligations.</div>
    <div class="details-card">
      <h3 class="details-title">Hold Details</h3>
      <div class="detail-row"><span class="detail-label">Account Holder:</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Amount:</span><span class="detail-value">$${formatAmount(amount)} CAD</span></div>
      <div class="detail-row"><span class="detail-label">Reference:</span><span class="detail-value">${data.transferId || "N/A"}</span></div>
      <div class="detail-row"><span class="detail-label">Hold Date:</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color:#721c24;font-weight:600;">AML Review</span></div>
    </div>
    <div class="alert-box alert-warning">Our compliance team will contact you within 2–5 business days. You may be asked to provide source-of-funds documentation. This process is required by Canadian financial regulations.</div>
  </div>${getFooter()}</div></body></html>`
}

// 31-FR. AML Hold (French)
export function generateAmlHoldFr(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Blocage de transaction appliqué</h1>
    <p class="subtitle">Votre virement est actuellement en cours d&apos;examen de conformité.</p>
    <div class="alert-box alert-danger"><strong>Blocage de conformité :</strong> Cette transaction a été signalée pour un examen anti-blanchiment d&apos;argent (ABA) dans le cadre de nos obligations réglementaires.</div>
    <div class="details-card">
      <h3 class="details-title">Détails du blocage</h3>
      <div class="detail-row"><span class="detail-label">Titulaire du compte :</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Montant :</span><span class="detail-value">${formatAmount(amount)} $ CAD</span></div>
      <div class="detail-row"><span class="detail-label">Référence :</span><span class="detail-value">${data.transferId || "S/O"}</span></div>
      <div class="detail-row"><span class="detail-label">Date du blocage :</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#721c24;font-weight:600;">Examen ABA</span></div>
    </div>
    <div class="alert-box alert-warning">Notre équipe de conformité communiquera avec vous dans les 2 à 5 jours ouvrables. Il est possible qu&apos;on vous demande de fournir des documents sur la source des fonds. Ce processus est requis par la réglementation financière canadienne.</div>
  </div>${getFooter()}</div></body></html>`
}

// 32. Monthly Statement
export function generateMonthlyStatement(data: BaseEmailData): string {
  const amount = data.amount || 0
  const month = new Date().toLocaleDateString("en-CA", { month: "long", year: "numeric" })
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Monthly Statement Ready</h1>
    <p class="subtitle">Your Interac e-Transfer activity summary for ${month}.</p>
    <div class="amount-box"><div class="amount-value">$${formatAmount(amount)} CAD</div><div class="amount-label">Total Activity This Month</div></div>
    <div class="details-card">
      <h3 class="details-title">Statement Summary</h3>
      <div class="detail-row"><span class="detail-label">Account Holder:</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Period:</span><span class="detail-value">${month}</span></div>
      <div class="detail-row"><span class="detail-label">Transfers Sent:</span><span class="detail-value">—</span></div>
      <div class="detail-row"><span class="detail-label">Transfers Received:</span><span class="detail-value">—</span></div>
      <div class="detail-row"><span class="detail-label">Total Volume:</span><span class="detail-value">$${formatAmount(amount)} CAD</span></div>
    </div>
    <div class="button-section"><a href="https://interac.quantumyield.digital/deposit-portal" class="action-button">View Full Statement</a></div>
    <div class="alert-box alert-info">Your monthly statement is available in your portal for download. Statements are retained for 7 years in compliance with Canadian financial regulations.</div>
  </div>${getFooter()}</div></body></html>`
}

// 32-FR. Monthly Statement (French)
export function generateMonthlyStatementFr(data: BaseEmailData): string {
  const amount = data.amount || 0
  const month = new Date().toLocaleDateString("fr-CA", { month: "long", year: "numeric" })
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Relevé mensuel prêt</h1>
    <p class="subtitle">Résumé de votre activité Interac pour ${month}.</p>
    <div class="amount-box"><div class="amount-value">${formatAmount(amount)} $ CAD</div><div class="amount-label">Activité totale ce mois</div></div>
    <div class="details-card">
      <h3 class="details-title">Résumé du relevé</h3>
      <div class="detail-row"><span class="detail-label">Titulaire du compte :</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Période :</span><span class="detail-value">${month}</span></div>
      <div class="detail-row"><span class="detail-label">Virements envoyés :</span><span class="detail-value">—</span></div>
      <div class="detail-row"><span class="detail-label">Virements reçus :</span><span class="detail-value">—</span></div>
      <div class="detail-row"><span class="detail-label">Volume total :</span><span class="detail-value">${formatAmount(amount)} $ CAD</span></div>
    </div>
    <div class="button-section"><a href="https://interac.quantumyield.digital/deposit-portal" class="action-button">Voir le relevé complet</a></div>
    <div class="alert-box alert-info">Votre relevé mensuel est disponible dans votre portail pour téléchargement. Les relevés sont conservés pendant 7 ans conformément à la réglementation financière canadienne.</div>
  </div>${getFooter()}</div></body></html>`
}

// 33. Large Transaction Review
export function generateLargeTransactionReview(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Large Transaction — Review Required</h1>
    <p class="subtitle">Additional verification is needed for this transfer.</p>
    <div class="amount-box"><div class="amount-value">$${formatAmount(amount)} CAD</div><div class="amount-label">Transaction Amount</div></div>
    <div class="alert-box alert-warning"><strong>Review Required:</strong> This transfer exceeds your standard threshold and requires additional verification before processing.</div>
    <div class="details-card">
      <h3 class="details-title">Transaction Details</h3>
      <div class="detail-row"><span class="detail-label">Account Holder:</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Amount:</span><span class="detail-value">$${formatAmount(amount)} CAD</span></div>
      <div class="detail-row"><span class="detail-label">Reference:</span><span class="detail-value">${data.transferId || "N/A"}</span></div>
      <div class="detail-row"><span class="detail-label">Submitted:</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color:#856404;font-weight:600;">Pending Review</span></div>
    </div>
    <div class="instructions"><h4 style="margin-bottom:12px;font-weight:600;">Verification Steps</h4><ol><li>Confirm the transaction via your registered phone number</li><li>Provide source-of-funds documentation if requested</li><li>Contact your financial institution to authorize the transfer</li></ol></div>
  </div>${getFooter()}</div></body></html>`
}

// 33-FR. Large Transaction Review (French)
export function generateLargeTransactionReviewFr(data: BaseEmailData): string {
  const amount = data.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${getEmailStyles()}</head><body>
  <div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Grande transaction — Vérification requise</h1>
    <p class="subtitle">Une vérification supplémentaire est nécessaire pour ce virement.</p>
    <div class="amount-box"><div class="amount-value">${formatAmount(amount)} $ CAD</div><div class="amount-label">Montant de la transaction</div></div>
    <div class="alert-box alert-warning"><strong>Vérification requise :</strong> Ce virement dépasse votre seuil standard et nécessite une vérification supplémentaire avant traitement.</div>
    <div class="details-card">
      <h3 class="details-title">Détails de la transaction</h3>
      <div class="detail-row"><span class="detail-label">Titulaire du compte :</span><span class="detail-value">${data.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Montant :</span><span class="detail-value">${formatAmount(amount)} $ CAD</span></div>
      <div class="detail-row"><span class="detail-label">Référence :</span><span class="detail-value">${data.transferId || "S/O"}</span></div>
      <div class="detail-row"><span class="detail-label">Soumis le :</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#856404;font-weight:600;">En attente d&apos;examen</span></div>
    </div>
    <div class="instructions"><h4 style="margin-bottom:12px;font-weight:600;">Étapes de vérification</h4><ol><li>Confirmez la transaction via votre numéro de téléphone enregistré</li><li>Fournissez des documents sur la source des fonds si demandé</li><li>Communiquez avec votre institution financière pour autoriser le virement</li></ol></div>
  </div>${getFooter()}</div></body></html>`
}

// ---------- END NEW TEMPLATES ----------

// Export a function to get generator by template ID
export const templateGenerators: Record<string, (data: BaseEmailData) => string> = {
  "transfer-received": generateTransferReceived,
  "transfer-sent": generateTransferSent,
  "transfer-pending": generateTransferPending,
  "transfer-cancelled": generateTransferCancelled,
  "transfer-expired": generateTransferExpired,
  "deposit-completed": generateDepositCompleted,
  "deposit-failed": generateDepositFailed,
  "deposit-reminder": generateDepositReminder,
  "deposit-instructions": generateDepositInstructions,
  "auto-deposit-enabled": generateAutoDepositEnabled,
  "security-question-updated": generateSecurityQuestionUpdated,
  "suspicious-activity": generateSuspiciousActivity,
  "password-reset": generatePasswordReset,
  "two-factor-enabled": generateTwoFactorEnabled,
  "login-notification": generateLoginNotification,
  "account-verified": generateAccountVerified,
  "profile-updated": generateProfileUpdated,
  "bank-linked": generateBankLinked,
  "limit-increase": generateLimitIncrease,
  "money-request": generateMoneyRequest,
  "request-accepted": generateRequestAccepted,
  "request-declined": generateRequestDeclined,
  // New 11 templates
  "transfer-receipt": generateTransferReceipt,
  "scheduled-transfer": generateScheduledTransfer,
  "deposit-on-hold": generateDepositOnHold,
  "two-factor-code": generateTwoFactorCode,
  "welcome-onboard": generateWelcomeOnboard,
  "account-suspended": generateAccountSuspended,
  "referral-bonus": generateReferralBonus,
  "kyc-verification": generateKycVerification,
  "aml-hold": generateAmlHold,
  "monthly-statement": generateMonthlyStatement,
  "large-transaction-review": generateLargeTransactionReview,
}

// ─── SETTLEMENT & COMPLIANCE GENERATORS ───────────────────────────────────────

// 34. Settlement Confirmation
export function generateSettlementConfirmation(d: BaseEmailData): string {
  const a = d.amount || 0
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Settlement Confirmed</h1>
    <p class="subtitle">Your funds have been successfully settled, ${d.recipientName}.</p>
    <div class="amount-box"><div class="amount-value">$${formatAmount(a)} CAD</div><div class="amount-label">Settled Amount</div></div>
    <div class="details-card">
      <h3 class="details-title">Settlement Details</h3>
      <div class="detail-row"><span class="detail-label">Settlement ID:</span><span class="detail-value">${d.transferId || "SET-000000"}</span></div>
      <div class="detail-row"><span class="detail-label">Recipient:</span><span class="detail-value">${d.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Institution:</span><span class="detail-value">${d.bankName || d.institution || "Your financial institution"}</span></div>
      <div class="detail-row"><span class="detail-label">Settled On:</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color:#28a745;font-weight:600;">Completed</span></div>
    </div>
    <div class="alert-box alert-success"><strong>Funds Available:</strong> The settled amount is now available in your designated account. Please allow up to 2 business hours for your balance to reflect.</div>
    ${d.message ? `<div class="details-card"><h3 class="details-title">Settlement Notes</h3><p style="color:#555555;font-size:14px;line-height:1.7;">${d.message}</p></div>` : ""}
    <div class="security-section">
      <h4 class="security-title">Compliance Notice</h4>
      <p style="color:#666666;font-size:14px;line-height:1.7;">This settlement was processed in accordance with FINTRAC regulations and Canadian payment clearing standards. Retain this confirmation for your records. Transactions are subject to the Proceeds of Crime (Money Laundering) and Terrorist Financing Act.</p>
    </div>
    <div class="button-section"><a href="https://interac.quantumyield.digital/deposit-portal/admin" class="action-button">View Settlement Report</a></div>
  </div>${getFooter()}</div></body></html>`
}

// 35. Settlement Delayed
export function generateSettlementDelayed(d: BaseEmailData): string {
  const a = d.amount || 0
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content">
    <h1 class="greeting" style="color:#856404;">Settlement Delay Notice</h1>
    <p class="subtitle">Your pending settlement requires additional processing time.</p>
    <div class="amount-box" style="background:linear-gradient(135deg,#ffc107 0%,#e0a800 100%);"><div class="amount-value">$${formatAmount(a)} CAD</div><div class="amount-label">Pending Settlement</div></div>
    <div class="alert-box alert-warning"><strong>Delay Notice:</strong> Your settlement of $${formatAmount(a)} CAD has been delayed due to additional verification requirements. No action is required from you at this time.</div>
    <div class="details-card">
      <h3 class="details-title">Settlement Details</h3>
      <div class="detail-row"><span class="detail-label">Reference:</span><span class="detail-value">${d.transferId || "SET-000000"}</span></div>
      <div class="detail-row"><span class="detail-label">Original Date:</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Estimated Release:</span><span class="detail-value">1–3 Business Days</span></div>
      <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color:#856404;font-weight:600;">Under Review</span></div>
    </div>
    <div class="security-section">
      <h4 class="security-title">Reason for Delay</h4>
      <p style="color:#666666;font-size:14px;line-height:1.7;">${d.message || "Your transaction has been flagged for routine compliance review. This may include identity verification, source-of-funds confirmation, or standard AML screening. Our compliance team will process your settlement as quickly as possible."}</p>
    </div>
    <div class="security-section">
      <h4 class="security-title">What Happens Next</h4>
      <ol style="color:#666666;padding-left:20px;line-height:2;">
        <li>Our compliance team reviews your transaction</li>
        <li>You will receive an email once the review is complete</li>
        <li>Funds will be released or you will be contacted for documents</li>
      </ol>
    </div>
  </div>${getFooter()}</div></body></html>`
}

// 36. Regulatory Hold
export function generateRegulatoryHold(d: BaseEmailData): string {
  const a = d.amount || 0
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content">
    <h1 class="greeting" style="color:#dc3545;">Regulatory Hold Notice</h1>
    <p class="subtitle">A regulatory hold has been placed on your transaction.</p>
    <div class="alert-box alert-danger"><strong>Hold Applied:</strong> A mandatory regulatory hold has been placed on a transaction of $${formatAmount(a)} CAD associated with your account. This action is required under applicable Canadian financial legislation.</div>
    <div class="details-card">
      <h3 class="details-title">Hold Details</h3>
      <div class="detail-row"><span class="detail-label">Reference ID:</span><span class="detail-value">${d.transferId || "REG-000000"}</span></div>
      <div class="detail-row"><span class="detail-label">Amount Held:</span><span class="detail-value">$${formatAmount(a)} CAD</span></div>
      <div class="detail-row"><span class="detail-label">Applied On:</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Regulatory Body:</span><span class="detail-value">FINTRAC / Financial Intelligence</span></div>
      <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color:#dc3545;font-weight:600;">Hold Active</span></div>
    </div>
    <div class="security-section">
      <h4 class="security-title">Legal Basis</h4>
      <p style="color:#666666;font-size:14px;line-height:1.7;">This hold is applied pursuant to the <em>Proceeds of Crime (Money Laundering) and Terrorist Financing Act (PCMLTFA)</em> and associated FINTRAC directives. QuantumYield is required by law to cooperate fully with regulatory review processes.</p>
    </div>
    <div class="security-section">
      <h4 class="security-title">Required Actions</h4>
      <ol style="color:#666666;padding-left:20px;line-height:2;">
        <li>Do not attempt to reverse or dispute this hold</li>
        <li>Gather supporting documentation (source of funds, contracts, invoices)</li>
        <li>Contact our compliance team at compliance@quantumyield.digital</li>
        <li>Cooperate fully with any information requests within 5 business days</li>
      </ol>
    </div>
    <p style="color:#dc3545;font-size:13px;font-weight:500;text-align:center;margin-top:16px;">Failure to respond may result in permanent forfeiture of the held funds as required by law.</p>
  </div>${getFooter()}</div></body></html>`
}

// 37. Compliance Document Request
export function generateComplianceDocumentRequest(d: BaseEmailData): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Document Submission Required</h1>
    <p class="subtitle">We need supporting documents to process your transaction, ${d.recipientName}.</p>
    <div class="alert-box alert-warning"><strong>Action Required:</strong> To comply with Canadian anti-money laundering regulations, we require supporting documentation before releasing your funds. Please submit the requested documents within <strong>5 business days</strong>.</div>
    <div class="details-card">
      <h3 class="details-title">Required Documents</h3>
      <div class="detail-row"><span class="detail-label">1. Source of Funds:</span><span class="detail-value">Bank statement or income proof</span></div>
      <div class="detail-row"><span class="detail-label">2. Identity:</span><span class="detail-value">Government-issued photo ID</span></div>
      <div class="detail-row"><span class="detail-label">3. Transaction Purpose:</span><span class="detail-value">Invoice, contract, or agreement</span></div>
      <div class="detail-row"><span class="detail-label">4. Address Proof:</span><span class="detail-value">Utility bill or bank statement</span></div>
    </div>
    <div class="details-card">
      <h3 class="details-title">Case Reference</h3>
      <div class="detail-row"><span class="detail-label">Case ID:</span><span class="detail-value">${d.transferId || "COMP-000000"}</span></div>
      <div class="detail-row"><span class="detail-label">Assigned To:</span><span class="detail-value">QuantumYield Compliance Team</span></div>
      <div class="detail-row"><span class="detail-label">Deadline:</span><span class="detail-value">5 Business Days from ${formatDate()}</span></div>
    </div>
    <div class="button-section"><a href="https://interac.quantumyield.digital/compliance/upload" class="action-button">Submit Documents</a></div>
    <div class="security-section">
      <h4 class="security-title">Submission Guidelines</h4>
      <ul style="color:#666666;padding-left:20px;line-height:2;">
        <li>Documents must be clear, legible scans or photos</li>
        <li>Accepted formats: PDF, JPG, PNG (max 10MB each)</li>
        <li>All documents must be current and not expired</li>
        <li>Documents in French or English are accepted</li>
      </ul>
    </div>
    <p style="color:#666666;font-size:13px;text-align:center;margin-top:16px;">Questions? Contact us at <a href="mailto:compliance@quantumyield.digital" style="color:#FDB913;">compliance@quantumyield.digital</a></p>
  </div>${getFooter()}</div></body></html>`
}

// 38. Settlement Summary
export function generateSettlementSummary(d: BaseEmailData): string {
  const a = d.amount || 0
  const period = (d as BaseEmailData & { period?: string }).period || new Date().toLocaleDateString("en-CA", { month: "long", year: "numeric" })
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Settlement Summary</h1>
    <p class="subtitle">Your settlement activity report for ${period}.</p>
    <div class="amount-box" style="background:linear-gradient(135deg,#495057 0%,#343a40 100%);color:#ffffff;">
      <div class="amount-value">$${formatAmount(a)} CAD</div>
      <div class="amount-label">Total Settled This Period</div>
    </div>
    <div class="details-card">
      <h3 class="details-title">Period Summary</h3>
      <div class="detail-row"><span class="detail-label">Period:</span><span class="detail-value">${period}</span></div>
      <div class="detail-row"><span class="detail-label">Total Transactions:</span><span class="detail-value">${d.transferId || "—"}</span></div>
      <div class="detail-row"><span class="detail-label">Total Settled:</span><span class="detail-value">$${formatAmount(a)} CAD</span></div>
      <div class="detail-row"><span class="detail-label">Held / Pending:</span><span class="detail-value">$0.00 CAD</span></div>
      <div class="detail-row"><span class="detail-label">Account:</span><span class="detail-value">${d.recipientName}</span></div>
      <div class="detail-row"><span class="detail-label">Institution:</span><span class="detail-value">${d.bankName || d.institution || "On file"}</span></div>
    </div>
    <div class="security-section">
      <h4 class="security-title">Compliance Statement</h4>
      <p style="color:#666666;font-size:14px;line-height:1.7;">All transactions in this report have been processed in compliance with FINTRAC reporting requirements and the Proceeds of Crime (Money Laundering) and Terrorist Financing Act. This statement is generated for record-keeping purposes and may be required for tax reporting.</p>
    </div>
    <div class="alert-box alert-info"><strong>Record Keeping:</strong> Please retain this summary for a minimum of 5 years as required by CRA and FINTRAC regulations.</div>
    <div class="button-section"><a href="https://interac.quantumyield.digital/deposit-portal/admin" class="action-button">View Full Report</a></div>
  </div>${getFooter()}</div></body></html>`
}

// 39. Dispute Resolution
export function generateDisputeResolution(d: BaseEmailData): string {
  const a = d.amount || 0
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content">
    <h1 class="greeting">Dispute Case Update</h1>
    <p class="subtitle">An update is available for your dispute case, ${d.recipientName}.</p>
    <div class="details-card">
      <h3 class="details-title">Case Details</h3>
      <div class="detail-row"><span class="detail-label">Case ID:</span><span class="detail-value">${d.transferId || "DISP-000000"}</span></div>
      <div class="detail-row"><span class="detail-label">Disputed Amount:</span><span class="detail-value">$${formatAmount(a)} CAD</span></div>
      <div class="detail-row"><span class="detail-label">Filed On:</span><span class="detail-value">${formatDate()}</span></div>
      <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value" style="color:#17a2b8;font-weight:600;">${d.message || "Under Investigation"}</span></div>
    </div>
    <div class="alert-box alert-info"><strong>Case Update:</strong> Our dispute resolution team has reviewed your case and is progressing toward a determination. You will receive a final resolution notice within 10 business days.</div>
    <div class="security-section">
      <h4 class="security-title">Investigation Steps Completed</h4>
      <ol style="color:#666666;padding-left:20px;line-height:2;">
        <li style="color:#28a745;">Initial case review and documentation collection</li>
        <li style="color:#28a745;">Transaction history analysis</li>
        <li style="color:#ffc107;">Communication with involved financial institutions</li>
        <li>Final determination and fund release or recovery</li>
      </ol>
    </div>
    <div class="security-section">
      <h4 class="security-title">Possible Outcomes</h4>
      <p style="color:#666666;font-size:14px;line-height:1.7;"><strong>Resolution in your favour:</strong> Funds will be credited to your account within 2 business days of the final decision.<br><br><strong>Resolution against your claim:</strong> You will receive a detailed written explanation and information about the appeals process.</p>
    </div>
    <div class="button-section"><a href="https://interac.quantumyield.digital/compliance/dispute" class="action-button">View Case Status</a></div>
    <p style="color:#666666;font-size:13px;text-align:center;margin-top:16px;">Case managed by QuantumYield Dispute Resolution — <a href="mailto:disputes@quantumyield.digital" style="color:#FDB913;">disputes@quantumyield.digital</a></p>
  </div>${getFooter()}</div></body></html>`
}

// ─── FRENCH VARIANTS — SETTLEMENT ────────────────────────────────────────────

export function generateSettlementConfirmationFr(d: BaseEmailData): string {
  const a = d.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Règlement confirmé</h1><p class="subtitle">Vos fonds ont été réglés avec succès, ${d.recipientName}.</p><div class="amount-box"><div class="amount-value">${formatAmount(a)} $ CAD</div><div class="amount-label">Montant réglé</div></div><div class="details-card"><h3 class="details-title">Détails du règlement</h3><div class="detail-row"><span class="detail-label">ID de règlement :</span><span class="detail-value">${d.transferId || "SET-000000"}</span></div><div class="detail-row"><span class="detail-label">Destinataire :</span><span class="detail-value">${d.recipientName}</span></div><div class="detail-row"><span class="detail-label">Institution :</span><span class="detail-value">${d.bankName || d.institution || "Votre institution financière"}</span></div><div class="detail-row"><span class="detail-label">Réglé le :</span><span class="detail-value">${formatDate()}</span></div><div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#28a745;font-weight:600;">Complété</span></div></div><div class="alert-box alert-success"><strong>Fonds disponibles :</strong> Le montant réglé est maintenant disponible dans votre compte désigné. Veuillez prévoir jusqu&apos;à 2 heures ouvrables pour que votre solde soit mis à jour.</div><div class="security-section"><h4 class="security-title">Avis de conformité</h4><p style="color:#666666;font-size:14px;line-height:1.7;">Ce règlement a été traité conformément aux règlements du CANAFE et aux normes canadiennes de compensation des paiements. Conservez cette confirmation pour vos dossiers.</p></div><div class="button-section"><a href="https://interac.quantumyield.digital/deposit-portal/admin" class="action-button">Voir le rapport</a></div></div>${getFooter()}</div></body></html>`
}

export function generateSettlementDelayedFr(d: BaseEmailData): string {
  const a = d.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting" style="color:#856404;">Avis de retard de règlement</h1><p class="subtitle">Votre règlement en attente nécessite un délai de traitement supplémentaire.</p><div class="amount-box" style="background:linear-gradient(135deg,#ffc107 0%,#e0a800 100%);"><div class="amount-value">${formatAmount(a)} $ CAD</div><div class="amount-label">Règlement en attente</div></div><div class="alert-box alert-warning"><strong>Avis de retard :</strong> Votre règlement de ${formatAmount(a)} $ CAD a été retardé en raison d&apos;exigences de vérification supplémentaires.</div><div class="details-card"><h3 class="details-title">Détails du règlement</h3><div class="detail-row"><span class="detail-label">Référence :</span><span class="detail-value">${d.transferId || "SET-000000"}</span></div><div class="detail-row"><span class="detail-label">Date estimée :</span><span class="detail-value">1 à 3 jours ouvrables</span></div><div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#856404;font-weight:600;">En révision</span></div></div><div class="security-section"><h4 class="security-title">Prochaines étapes</h4><ol style="color:#666666;padding-left:20px;line-height:2;"><li>Notre équipe de conformité examine votre transaction</li><li>Vous recevrez un courriel une fois la révision terminée</li><li>Les fonds seront libérés ou vous serez contacté pour des documents</li></ol></div></div>${getFooter()}</div></body></html>`
}

export function generateRegulatoryHoldFr(d: BaseEmailData): string {
  const a = d.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting" style="color:#dc3545;">Avis de blocage réglementaire</h1><p class="subtitle">Un blocage réglementaire a été appliqué à votre transaction.</p><div class="alert-box alert-danger"><strong>Blocage appliqué :</strong> Un blocage réglementaire obligatoire a été appliqué à une transaction de ${formatAmount(a)} $ CAD associée à votre compte.</div><div class="details-card"><h3 class="details-title">Détails du blocage</h3><div class="detail-row"><span class="detail-label">ID de référence :</span><span class="detail-value">${d.transferId || "REG-000000"}</span></div><div class="detail-row"><span class="detail-label">Montant bloqué :</span><span class="detail-value">${formatAmount(a)} $ CAD</span></div><div class="detail-row"><span class="detail-label">Appliqué le :</span><span class="detail-value">${formatDate()}</span></div><div class="detail-row"><span class="detail-label">Organisme réglementaire :</span><span class="detail-value">CANAFE / Renseignement financier</span></div><div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#dc3545;font-weight:600;">Blocage actif</span></div></div><div class="security-section"><h4 class="security-title">Actions requises</h4><ol style="color:#666666;padding-left:20px;line-height:2;"><li>Ne tentez pas d&apos;annuler ce blocage</li><li>Rassemblez les documents justificatifs</li><li>Contactez notre équipe de conformité</li><li>Coopérez pleinement dans les 5 jours ouvrables</li></ol></div></div>${getFooter()}</div></body></html>`
}

export function generateComplianceDocumentRequestFr(d: BaseEmailData): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Soumission de documents requise</h1><p class="subtitle">Nous avons besoin de documents justificatifs pour traiter votre transaction, ${d.recipientName}.</p><div class="alert-box alert-warning"><strong>Action requise :</strong> Pour respecter les règlements canadiens contre le blanchiment d&apos;argent, nous avons besoin de documentation avant de libérer vos fonds. Veuillez soumettre les documents dans un délai de <strong>5 jours ouvrables</strong>.</div><div class="details-card"><h3 class="details-title">Documents requis</h3><div class="detail-row"><span class="detail-label">1. Source des fonds :</span><span class="detail-value">Relevé bancaire ou preuve de revenus</span></div><div class="detail-row"><span class="detail-label">2. Identité :</span><span class="detail-value">Pièce d&apos;identité gouvernementale avec photo</span></div><div class="detail-row"><span class="detail-label">3. Objet de la transaction :</span><span class="detail-value">Facture, contrat ou accord</span></div><div class="detail-row"><span class="detail-label">4. Preuve d&apos;adresse :</span><span class="detail-value">Facture de services ou relevé bancaire</span></div></div><div class="button-section"><a href="https://interac.quantumyield.digital/compliance/upload" class="action-button">Soumettre les documents</a></div><p style="color:#666666;font-size:13px;text-align:center;margin-top:16px;">Questions? <a href="mailto:compliance@quantumyield.digital" style="color:#FDB913;">compliance@quantumyield.digital</a></p></div>${getFooter()}</div></body></html>`
}

export function generateSettlementSummaryFr(d: BaseEmailData): string {
  const a = d.amount || 0
  const period = new Date().toLocaleDateString("fr-CA", { month: "long", year: "numeric" })
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Sommaire de règlement</h1><p class="subtitle">Votre rapport d&apos;activité de règlement pour ${period}.</p><div class="amount-box" style="background:linear-gradient(135deg,#495057 0%,#343a40 100%);color:#ffffff;"><div class="amount-value">${formatAmount(a)} $ CAD</div><div class="amount-label">Total réglé cette période</div></div><div class="details-card"><h3 class="details-title">Sommaire de la période</h3><div class="detail-row"><span class="detail-label">Période :</span><span class="detail-value">${period}</span></div><div class="detail-row"><span class="detail-label">Total réglé :</span><span class="detail-value">${formatAmount(a)} $ CAD</span></div><div class="detail-row"><span class="detail-label">En attente :</span><span class="detail-value">0,00 $ CAD</span></div><div class="detail-row"><span class="detail-label">Compte :</span><span class="detail-value">${d.recipientName}</span></div></div><div class="security-section"><h4 class="security-title">Déclaration de conformité</h4><p style="color:#666666;font-size:14px;line-height:1.7;">Toutes les transactions de ce rapport ont été traitées conformément aux exigences de déclaration du CANAFE. Ce relevé est généré à des fins d&apos;archivage et peut être requis pour la déclaration fiscale.</p></div><div class="alert-box alert-info"><strong>Conservation des dossiers :</strong> Veuillez conserver ce sommaire pendant un minimum de 5 ans tel que l&apos;exigent l&apos;ARC et le CANAFE.</div><div class="button-section"><a href="https://interac.quantumyield.digital/deposit-portal/admin" class="action-button">Voir le rapport complet</a></div></div>${getFooter()}</div></body></html>`
}

export function generateDisputeResolutionFr(d: BaseEmailData): string {
  const a = d.amount || 0
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${getEmailStyles()}</head><body><div class="container">${getHeader()}<div class="content"><h1 class="greeting">Mise à jour du dossier de litige</h1><p class="subtitle">Une mise à jour est disponible pour votre dossier de litige, ${d.recipientName}.</p><div class="details-card"><h3 class="details-title">Détails du dossier</h3><div class="detail-row"><span class="detail-label">ID du dossier :</span><span class="detail-value">${d.transferId || "DISP-000000"}</span></div><div class="detail-row"><span class="detail-label">Montant contesté :</span><span class="detail-value">${formatAmount(a)} $ CAD</span></div><div class="detail-row"><span class="detail-label">Déposé le :</span><span class="detail-value">${formatDate()}</span></div><div class="detail-row"><span class="detail-label">Statut :</span><span class="detail-value" style="color:#17a2b8;font-weight:600;">${d.message || "En cours d&apos;enquête"}</span></div></div><div class="alert-box alert-info"><strong>Mise à jour :</strong> Notre équipe de résolution des litiges a examiné votre dossier. Vous recevrez une décision finale dans les 10 jours ouvrables.</div><div class="security-section"><h4 class="security-title">Étapes d&apos;enquête</h4><ol style="color:#666666;padding-left:20px;line-height:2;"><li style="color:#28a745;">Révision initiale du dossier</li><li style="color:#28a745;">Analyse de l&apos;historique des transactions</li><li style="color:#ffc107;">Communication avec les institutions financières</li><li>Décision finale et libération ou récupération des fonds</li></ol></div><div class="button-section"><a href="https://interac.quantumyield.digital/compliance/dispute" class="action-button">Voir le statut du dossier</a></div></div>${getFooter()}</div></body></html>`
}

// ─── END SETTLEMENT & COMPLIANCE ──────────────────────────────────────────────

// Merge settlement & compliance keys into the main templateGenerators map
Object.assign(templateGenerators, {
  // Settlement & Compliance (34-39)
  "settlement-confirmation": generateSettlementConfirmation,
  "settlement-delayed": generateSettlementDelayed,
  "regulatory-hold": generateRegulatoryHold,
  "compliance-document-request": generateComplianceDocumentRequest,
  "settlement-summary": generateSettlementSummary,
  "dispute-resolution": generateDisputeResolution,
  // French variants — settlement
  "settlement-confirmation-fr": generateSettlementConfirmationFr,
  "settlement-delayed-fr": generateSettlementDelayedFr,
  "regulatory-hold-fr": generateRegulatoryHoldFr,
  "compliance-document-request-fr": generateComplianceDocumentRequestFr,
  "settlement-summary-fr": generateSettlementSummaryFr,
  "dispute-resolution-fr": generateDisputeResolutionFr,
  // French variants for all 33 templates
  "transfer-received-fr": generateTransferReceivedFr,
  "transfer-sent-fr": generateTransferSentFr,
  "transfer-pending-fr": generateTransferPendingFr,
  "transfer-cancelled-fr": generateTransferCancelledFr,
  "transfer-expired-fr": generateTransferExpiredFr,
  "deposit-completed-fr": generateDepositCompletedFr,
  "deposit-failed-fr": generateDepositFailedFr,
  "deposit-reminder-fr": generateDepositReminderFr,
  "deposit-instructions-fr": generateDepositInstructionsFr,
  "auto-deposit-enabled-fr": generateAutoDepositEnabledFr,
  "security-question-updated-fr": generateSecurityQuestionUpdatedFr,
  "suspicious-activity-fr": generateSuspiciousActivityFr,
  "password-reset-fr": generatePasswordResetFr,
  "two-factor-enabled-fr": generateTwoFactorEnabledFr,
  "login-notification-fr": generateLoginNotificationFr,
  "account-verified-fr": generateAccountVerifiedFr,
  "profile-updated-fr": generateProfileUpdatedFr,
  "bank-linked-fr": generateBankLinkedFr,
  "limit-increase-fr": generateLimitIncreaseFr,
  "money-request-fr": generateMoneyRequestFr,
  "request-accepted-fr": generateRequestAcceptedFr,
  "request-declined-fr": generateRequestDeclinedFr,
  "transfer-receipt-fr": generateTransferReceiptFr,
  "scheduled-transfer-fr": generateScheduledTransferFr,
  "deposit-on-hold-fr": generateDepositOnHoldFr,
  "two-factor-code-fr": generateTwoFactorCodeFr,
  "welcome-onboard-fr": generateWelcomeOnboardFr,
  "account-suspended-fr": generateAccountSuspendedFr,
  "referral-bonus-fr": generateReferralBonusFr,
  "kyc-verification-fr": generateKycVerificationFr,
  "aml-hold-fr": generateAmlHoldFr,
  "monthly-statement-fr": generateMonthlyStatementFr,
  "large-transaction-review-fr": generateLargeTransactionReviewFr,
})

export function generateEmailByTemplateId(templateId: string, data: BaseEmailData): string {
  const generator = templateGenerators[templateId]
  if (generator) {
    return generator(data)
  }
  // Fallback to transfer-received if template not found
  return generateTransferReceived(data)
}
