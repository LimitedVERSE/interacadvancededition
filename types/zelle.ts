export type TransactionStatus = "COMPLETED" | "PENDING" | "FAILED"

export interface PayeeInfo {
  name: string
  email: string
  phone: string
}

export interface SenderBankInfo {
  bankName: string
  institution: string
  branch: string
  account: string
}

export interface DepositInfo {
  amount: number
  currency: string
  reference: string
  memo: string
}

export interface TransactionMeta {
  id: string
  type: string
  status: TransactionStatus
  timestamp: string
}

export interface UISettings {
  redirectSeconds: number
  showConfirmation: boolean
  autoRedirect: boolean
}

export interface BankVisuals {
  name: string
  logo: string
  login: string
}

export interface SystemSettings {
  environment: string
  debug: boolean
}

export interface ZelleMockPayload {
  meta: TransactionMeta
  payee: PayeeInfo
  sender: SenderBankInfo
  deposit: DepositInfo
  ui: UISettings
  bankVisuals: BankVisuals
  system: SystemSettings
}
