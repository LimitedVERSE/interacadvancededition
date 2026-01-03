import { mockDeposit } from "./mockData"
import type { DepositInfo } from "@/types/bank"

/**
 * Fetches deposit details
 * Simulates API delay for realistic behavior
 */
export const getDepositDetails = async (): Promise<DepositInfo> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDeposit), 300)
  })
}

/**
 * Validates deposit token (mock implementation)
 * @param token - Deposit verification token
 */
export const validateDepositToken = async (token: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock validation - in production this would verify with backend
      resolve(token.length > 10)
    }, 500)
  })
}
