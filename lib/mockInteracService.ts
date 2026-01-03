import type { InteracMockPayload } from "@/types/interac"
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

export function buildInteracMock(bankId?: string, bankName?: string, categoryId?: string): InteracMockPayload {
  // Use provided bank info or fall back to environment variables
  const finalBankName = bankName || getEnv("MOCK_SENDER_NAME", "Royal Bank of Canada")
  const bankLogo = bankId ? getBankLogoPath(bankId) : getEnv("MOCK_BANK_LOGO_URL", "/assets/banks/td.svg")

  console.log("[v0] Building mock data for bank:", finalBankName, "Logo:", bankLogo)

  return {
    meta: {
      id: getEnv("MOCK_TRANSACTION_ID", "txn_mock_001"),
      type: getEnv("MOCK_TRANSACTION_TYPE", "INTERAC_DEPOSIT"),
      status: getEnv("MOCK_TRANSACTION_STATUS", "COMPLETED") as any,
      timestamp: getEnv("MOCK_TRANSACTION_TIMESTAMP", new Date().toISOString()),
    },

    payee: {
      name: getEnv("MOCK_PAYEE_NAME", "John Doe"),
      email: getEnv("MOCK_PAYEE_EMAIL", "john.doe@example.com"),
      phone: getEnv("MOCK_PAYEE_PHONE", "+1-514-555-0199"),
    },

    sender: {
      bankName: finalBankName,
      institution: getEnv("MOCK_SENDER_INSTITUTION_NUMBER", "003"),
      branch: getEnv("MOCK_SENDER_BRANCH_NUMBER", "12345"),
      account: getEnv("MOCK_SENDER_ACCOUNT_NUMBER", "9876543"),
    },

    deposit: {
      amount: getNumber("MOCK_DEPOSIT_AMOUNT") || 1000.0,
      currency: getEnv("MOCK_DEPOSIT_CURRENCY", "CAD"),
      reference: getEnv("MOCK_DEPOSIT_REFERENCE", "REF-MOCK-2025-001"),
      memo: getEnv("MOCK_DEPOSIT_MEMO", "Interac e-Transfer Deposit"),
    },

    ui: {
      redirectSeconds: getNumber("MOCK_REDIRECT_SECONDS") || 5,
      showConfirmation: getBool("MOCK_SHOW_CONFIRMATION"),
      autoRedirect: getBool("MOCK_AUTO_REDIRECT"),
    },

    bankVisuals: {
      name: finalBankName,
      logo: bankLogo || "/assets/banks/td.svg",
      login: getEnv("MOCK_BANK_LOGIN_URL", "https://easyweb.td.com"),
    },

    system: {
      environment: getEnv("MOCK_ENVIRONMENT", "development"),
      debug: getBool("MOCK_DEBUG_MODE"),
    },
  }
}
