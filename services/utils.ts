/**
 * Utility functions for service layer
 */

/**
 * Simulates network delay for realistic API behavior
 * @param ms - Milliseconds to delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Formats currency for display
 * @param amount - Numeric amount
 * @param currency - Currency code (default: USD)
 */
export const formatCurrency = (amount: number | string, currency = "USD"): string => {
  const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount
  return `$${numAmount.toFixed(2)} ${currency}`
}

/**
 * Formats date for display
 * @param date - Date string or Date object
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Validates Canadian province codes
 * @param code - Province/territory code
 */
export const isValidProvinceCode = (code: string): boolean => {
  const validCodes = ["AB", "BC", "MB", "NB", "NL", "NT", "NS", "NU", "ON", "PE", "QC", "SK", "YT"]
  return validCodes.includes(code.toUpperCase())
}

/**
 * Sanitizes search input
 * @param query - User search input
 */
export const sanitizeSearchQuery = (query: string): string => {
  return query
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, "")
}
