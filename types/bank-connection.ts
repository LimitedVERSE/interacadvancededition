import type { FinancialInstitution } from "./financial-institution"

/**
 * Represents the state of a bank connection flow
 */
export type ConnectionFlowState = "selection" | "confirmation" | "connecting" | "redirecting" | "completed" | "error"

/**
 * Bank connection session data
 */
export interface BankConnectionSession {
  /** Selected financial institution */
  institution: FinancialInstitution
  /** Current flow state */
  state: ConnectionFlowState
  /** Timestamp when connection was initiated */
  initiatedAt: Date
  /** Redirect URL for the bank */
  redirectUrl?: string
  /** Error message if connection failed */
  error?: string
  /** Connection attempt count */
  attempts: number
}

/**
 * Props for bank connection handlers
 */
export interface BankConnectionHandlers {
  onConnectionStart?: (institution: FinancialInstitution) => void
  onConnectionComplete?: (institution: FinancialInstitution) => void
  onConnectionError?: (institution: FinancialInstitution, error: string) => void
  onConnectionCancel?: () => void
}
