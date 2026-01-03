import type { BankConnector } from "@/types/bankConnector"
import { getBankById } from "./bankService"

/**
 * Gets bank connector information for redirect flow
 * @param bankId - Bank identifier
 */
export const getBankConnector = async (bankId: string): Promise<BankConnector> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      const bank = await getBankById(bankId)

      if (!bank) {
        throw new Error(`Bank not found: ${bankId}`)
      }

      resolve({
        bankId,
        bankName: bank.name,
        loginUrl: bank.loginUrl,
        status: "online",
      })
    }, 300)
  })
}
