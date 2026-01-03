export interface FinancialInstitution {
  id: string
  name: string
  category: InstitutionCategory
}

export type InstitutionCategory = "big-6" | "online-only" | "schedule-i-ii" | "credit-unions" | "digital-hybrid"

export interface InstitutionGroup {
  id: InstitutionCategory
  title: string
  institutions: FinancialInstitution[]
}
