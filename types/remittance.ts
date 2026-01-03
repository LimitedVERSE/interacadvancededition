/**
 * Remittance Class Domain Model
 * Defines the taxonomy for classifying money transfers in banking/finance
 */

/** Geographic scope of the transfer */
export type RemittanceScope = "domestic" | "international"

/** Type of entity initiating/receiving the transfer */
export type RemittanceEntityType = "personal" | "commercial" | "government" | "institutional"

/** Processing speed/settlement time */
export type RemittanceSpeed = "instant" | "same_day" | "batch" | "deferred"

/** Transfer rail/method used */
export type RemittanceMethod = "wire" | "ach_eft" | "card_rail" | "mobile_wallet" | "cash"

/** Direction of funds flow */
export type RemittanceDirection = "inbound" | "outbound"

/** Value bracket for the transfer */
export type RemittanceValueTier = "micro" | "retail" | "high_value"

/** Business purpose/use case */
export type RemittancePurpose = "payroll" | "vendor" | "settlement" | "escrow" | "refund"

/**
 * Complete classification of a remittance/transfer type
 */
export interface RemittanceClass {
  /** Unique stable identifier, e.g. 'domestic_personal_instant_wire' */
  id: string
  /** Human-readable label, e.g. 'Domestic • Personal • Instant Wire' */
  label: string
  /** Geographic scope */
  scope: RemittanceScope
  /** Entity type */
  entityType: RemittanceEntityType
  /** Processing speed */
  speed: RemittanceSpeed
  /** Transfer method/rail */
  method: RemittanceMethod
  /** Flow direction */
  direction: RemittanceDirection
  /** Value tier */
  valueTier: RemittanceValueTier
  /** Business purpose */
  purpose: RemittancePurpose
  /** Optional description for tooltips/help */
  description?: string
}

/**
 * Filter criteria for selecting remittance classes
 */
export interface RemittanceFilters {
  scope?: RemittanceScope
  entityType?: RemittanceEntityType
  speed?: RemittanceSpeed
  method?: RemittanceMethod
  direction?: RemittanceDirection
  valueTier?: RemittanceValueTier
  purpose?: RemittancePurpose
}
