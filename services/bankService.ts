import { mockBanks } from "./mockData"
import type { Bank } from "@/types/bank"

/**
 * Fetches all available banks
 * Simulates API delay for realistic behavior
 */
export const getAllBanks = async (): Promise<Bank[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockBanks), 300)
  })
}

/**
 * Searches banks by name
 * @param query - Search term to filter banks
 */
export const searchBanks = async (query: string): Promise<Bank[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = query.toLowerCase().trim()
      if (!lower) {
        resolve(mockBanks)
        return
      }
      const results = mockBanks.filter((bank) => bank.name.toLowerCase().includes(lower))
      resolve(results)
    }, 300)
  })
}

/**
 * Gets a specific bank by ID
 * @param id - Bank identifier
 */
export const getBankById = async (id: string): Promise<Bank | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bank = mockBanks.find((b) => b.id === id)
      resolve(bank)
    }, 300)
  })
}
