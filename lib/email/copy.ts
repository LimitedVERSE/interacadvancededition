export type EmailLang = "en" | "fr"
export type EmailLangMode = EmailLang | "dual"

export const emailCopy = {
  en: {
    greetingPrefix: "Hi",
    mainHeading: "You've received an Interac e-Transfer",
    description: (amount: string) =>
      `A transfer of ${amount} has been sent to you. To deposit these funds, click the button below and follow the instructions.`,
    amountLabel: "Amount:",
    messageLabel: "Message (Optional):",
    transferDetailsHeading: "Transfer Details",
    dateLabel: "Date:",
    referenceNumberLabel: "Reference Number:",
    fromLabel: "From:",
    amountDetailLabel: "Amount:",
    securityQuestionHeading: "Security Question",
    securityAnswerLabel: "Answer:",
    securityNote:
      "You'll need to answer this security question when depositing your funds through your financial institution.",
    depositCta: "Deposit Your Money",
    howToDepositHeading: "How to deposit:",
    depositSteps: [
      'Click the "Deposit Your Money" button above',
      "Select your financial institution",
      "Sign in to your online banking",
      "Answer the security question",
      "Choose which account to deposit the money into",
    ],
    complianceTitle: "Important regulatory information",
    complianceBody:
      "This message is a transactional notification issued by QuantumYield Holdings. Funds availability is subject to verification, institutional controls, and applicable financial regulations.",
  },
  fr: {
    greetingPrefix: "Bonjour",
    mainHeading: "Vous avez reçu un virement Interac",
    description: (amount: string) =>
      `Un virement de ${amount} vous a été envoyé. Pour déposer ces fonds, cliquez sur le bouton ci-dessous et suivez les instructions.`,
    amountLabel: "Montant :",
    messageLabel: "Message (Facultatif) :",
    transferDetailsHeading: "Détails du virement",
    dateLabel: "Date :",
    referenceNumberLabel: "Numéro de référence :",
    fromLabel: "De :",
    amountDetailLabel: "Montant :",
    securityQuestionHeading: "Question de sécurité",
    securityAnswerLabel: "Réponse :",
    securityNote:
      "Vous devrez répondre à cette question de sécurité lors du dépôt de vos fonds via votre institution financière.",
    depositCta: "Déposer les fonds",
    howToDepositHeading: "Comment déposer :",
    depositSteps: [
      'Cliquez sur le bouton "Déposer les fonds" ci-dessus',
      "Sélectionnez votre institution financière",
      "Connectez-vous à votre banque en ligne",
      "Répondez à la question de sécurité",
      "Choisissez le compte dans lequel déposer l'argent",
    ],
    complianceTitle: "Informations réglementaires importantes",
    complianceBody:
      "Ce message est une notification transactionnelle émise par QuantumYield Holdings. La disponibilité des fonds est soumise à des vérifications, à des contrôles institutionnels et aux réglementations financières applicables.",
  },
} as const
