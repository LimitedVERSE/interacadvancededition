import type { ZelleMockPayload } from "@/types/zelle"
import { getBankLogoPath } from "./bank-logo-mapper"

export function getEnv(key: string, fallback = ""): string {
  const value = process.env[key]
  return value !== undefined ? value : fallback
}

export function getBool(key: string): boolean {
  return getEnv(key).toLowerCase() === "true"
}

export function getNumber(key: string): number {
  const v = Number(getEnv(key))
  return isNaN(v) ? 0 : v
}

interface TransferData {
  transferId: string
  amount: string
  recipient: string
  recipientName: string
  senderBank: string
  message: string
  timestamp: string
}

export function buildZelleMock(bankId?: string, bankName?: string, categoryId?: string, transferData?: TransferData | null): ZelleMockPayload {
  // Use provided bank info or fall back to environment variables
  const finalBankName = bankName || getEnv("MOCK_SENDER_NAME", "Chase Bank")
  const bankLogo = bankId ? getBankLogoPath(bankId) : getEnv("MOCK_BANK_LOGO_URL", "/assets/banks/chase.svg")

  // Use transfer data if provided, otherwise fall back to environment variables
  const amount = transferData ? parseFloat(transferData.amount) : (getNumber("MOCK_DEPOSIT_AMOUNT") || 1000.0)
  const reference = transferData?.transferId || getEnv("MOCK_DEPOSIT_REFERENCE", "ZELLE-MOCK-2025-001")
  const payeeName = transferData?.recipientName || getEnv("MOCK_PAYEE_NAME", "John Doe")
  const payeeEmail = transferData?.recipient || getEnv("MOCK_PAYEE_EMAIL", "john.doe@example.com")
  const memo = transferData?.message || getEnv("MOCK_DEPOSIT_MEMO", "Zelle Transfer")
  const timestamp = transferData?.timestamp || getEnv("MOCK_TRANSACTION_TIMESTAMP", new Date().toISOString())
  const senderBankName = transferData?.senderBank || finalBankName

  return {
    meta: {
      id: reference,
      type: getEnv("MOCK_TRANSACTION_TYPE", "ZELLE_DEPOSIT"),
      status: "PENDING" as any,
      timestamp: timestamp,
    },

    payee: {
      name: payeeName,
      email: payeeEmail,
      phone: getEnv("MOCK_PAYEE_PHONE", "+1-212-555-0199"),
    },

    sender: {
      bankName: senderBankName,
      institution: getEnv("MOCK_SENDER_INSTITUTION_NUMBER", "021"),
      branch: getEnv("MOCK_SENDER_BRANCH_NUMBER", "00021"),
      account: getEnv("MOCK_SENDER_ACCOUNT_NUMBER", "9876543"),
    },

    deposit: {
      amount: amount,
      currency: getEnv("MOCK_DEPOSIT_CURRENCY", "USD"),
      reference: reference,
      memo: memo,
    },

    ui: {
      redirectSeconds: getNumber("MOCK_REDIRECT_SECONDS") || 5,
      showConfirmation: getBool("MOCK_SHOW_CONFIRMATION"),
      autoRedirect: getBool("MOCK_AUTO_REDIRECT"),
    },

    bankVisuals: {
      name: finalBankName,
      logo: bankLogo || "/assets/banks/chase.svg",
      login: getEnv("MOCK_BANK_LOGIN_URL", "https://www.chase.com"),
    },

    system: {
      environment: getEnv("MOCK_ENVIRONMENT", "development"),
      debug: getBool("MOCK_DEBUG_MODE"),
    },
  }
}
