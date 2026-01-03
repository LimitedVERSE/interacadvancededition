/**
 * Canadian provinces and territories types
 */

export type ProvinceCode = "AB" | "BC" | "MB" | "NB" | "NL" | "NT" | "NS" | "NU" | "ON" | "PE" | "QC" | "SK" | "YT"

export interface Province {
  code: ProvinceCode
  name: string
  nameEn: string
  nameFr: string
}

export const provinces: Province[] = [
  { code: "AB", name: "Alberta", nameEn: "Alberta", nameFr: "Alberta" },
  { code: "BC", name: "British Columbia", nameEn: "British Columbia", nameFr: "Colombie-Britannique" },
  { code: "MB", name: "Manitoba", nameEn: "Manitoba", nameFr: "Manitoba" },
  { code: "NB", name: "New Brunswick", nameEn: "New Brunswick", nameFr: "Nouveau-Brunswick" },
  {
    code: "NL",
    name: "Newfoundland and Labrador",
    nameEn: "Newfoundland and Labrador",
    nameFr: "Terre-Neuve-et-Labrador",
  },
  { code: "NT", name: "Northwest Territories", nameEn: "Northwest Territories", nameFr: "Territoires du Nord-Ouest" },
  { code: "NS", name: "Nova Scotia", nameEn: "Nova Scotia", nameFr: "Nouvelle-Écosse" },
  { code: "NU", name: "Nunavut", nameEn: "Nunavut", nameFr: "Nunavut" },
  { code: "ON", name: "Ontario", nameEn: "Ontario", nameFr: "Ontario" },
  { code: "PE", name: "Prince Edward Island", nameEn: "Prince Edward Island", nameFr: "Île-du-Prince-Édouard" },
  { code: "QC", name: "Quebec", nameEn: "Quebec", nameFr: "Québec" },
  { code: "SK", name: "Saskatchewan", nameEn: "Saskatchewan", nameFr: "Saskatchewan" },
  { code: "YT", name: "Yukon", nameEn: "Yukon", nameFr: "Yukon" },
]
