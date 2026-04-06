export type EmailLang = "en" | "fr"
export type EmailLangMode = EmailLang | "dual"

export const emailCopy = {
  en: {
    greetingPrefix: "Hi",
    mainHeading: "You've received a Zelle payment",
    description: (amount: string) =>
      `A Zelle payment of ${amount} has been sent to you. To deposit these funds, click the button below and follow the instructions. Funds are typically available within minutes.`,
    amountLabel: "Amount:",
    messageLabel: "Message (Optional):",
    transferDetailsHeading: "Transfer Details",
    dateLabel: "Date:",
    referenceNumberLabel: "Reference Number:",
    fromLabel: "From:",
    amountDetailLabel: "Amount:",
    depositCta: "Deposit Your Money",
    howToDepositHeading: "How to deposit with Zelle:",
    depositSteps: [
      'Click the "Deposit Your Money" button above',
      "Select your U.S. financial institution",
      "Sign in to your online banking",
      "Choose which account to deposit the money into",
      "Funds are typically available within minutes",
    ],
    complianceTitle: "Important regulatory information",
    complianceBody:
      "This message is a transactional notification. Zelle transfers money between enrolled bank accounts in the U.S. Funds availability is subject to your financial institution's policies and applicable U.S. banking regulations.",
  },
  fr: {
    greetingPrefix: "Bonjour",
    mainHeading: "Vous avez reçu un paiement Zelle",
    description: (amount: string) =>
      `Un paiement Zelle de ${amount} vous a été envoyé. Pour déposer ces fonds, cliquez sur le bouton ci-dessous et suivez les instructions. Les fonds sont généralement disponibles en quelques minutes.`,
    amountLabel: "Montant :",
    messageLabel: "Message (Facultatif) :",
    transferDetailsHeading: "Détails du virement",
    dateLabel: "Date :",
    referenceNumberLabel: "Numéro de référence :",
    fromLabel: "De :",
    amountDetailLabel: "Montant :",
    depositCta: "Déposer les fonds",
    howToDepositHeading: "Comment déposer avec Zelle :",
    depositSteps: [
      'Cliquez sur le bouton "Déposer les fonds" ci-dessus',
      "Sélectionnez votre institution financière américaine",
      "Connectez-vous à votre banque en ligne",
      "Choisissez le compte dans lequel déposer l'argent",
      "Les fonds sont généralement disponibles en quelques minutes",
    ],
    complianceTitle: "Informations réglementaires importantes",
    complianceBody:
      "Ce message est une notification transactionnelle. Zelle transfère de l'argent entre des comptes bancaires inscrits aux États-Unis. La disponibilité des fonds est soumise aux politiques de votre institution financière et aux réglementations bancaires américaines applicables.",
  },
} as const
