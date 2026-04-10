/**
 * US states and territories types
 */

export type StateCode =
  | "AL" | "AK" | "AZ" | "AR" | "CA" | "CO" | "CT" | "DE" | "FL" | "GA"
  | "HI" | "ID" | "IL" | "IN" | "IA" | "KS" | "KY" | "LA" | "ME" | "MD"
  | "MA" | "MI" | "MN" | "MS" | "MO" | "MT" | "NE" | "NV" | "NH" | "NJ"
  | "NM" | "NY" | "NC" | "ND" | "OH" | "OK" | "OR" | "PA" | "RI" | "SC"
  | "SD" | "TN" | "TX" | "UT" | "VT" | "VA" | "WA" | "WV" | "WI" | "WY"
  | "DC"

export interface State {
  code: StateCode
  name: string
  nameEn: string
}

export const states: State[] = [
  { code: "AL", name: "Alabama", nameEn: "Alabama" },
  { code: "AK", name: "Alaska", nameEn: "Alaska" },
  { code: "AZ", name: "Arizona", nameEn: "Arizona" },
  { code: "AR", name: "Arkansas", nameEn: "Arkansas" },
  { code: "CA", name: "California", nameEn: "California" },
  { code: "CO", name: "Colorado", nameEn: "Colorado" },
  { code: "CT", name: "Connecticut", nameEn: "Connecticut" },
  { code: "DE", name: "Delaware", nameEn: "Delaware" },
  { code: "FL", name: "Florida", nameEn: "Florida" },
  { code: "GA", name: "Georgia", nameEn: "Georgia" },
  { code: "HI", name: "Hawaii", nameEn: "Hawaii" },
  { code: "ID", name: "Idaho", nameEn: "Idaho" },
  { code: "IL", name: "Illinois", nameEn: "Illinois" },
  { code: "IN", name: "Indiana", nameEn: "Indiana" },
  { code: "IA", name: "Iowa", nameEn: "Iowa" },
  { code: "KS", name: "Kansas", nameEn: "Kansas" },
  { code: "KY", name: "Kentucky", nameEn: "Kentucky" },
  { code: "LA", name: "Louisiana", nameEn: "Louisiana" },
  { code: "ME", name: "Maine", nameEn: "Maine" },
  { code: "MD", name: "Maryland", nameEn: "Maryland" },
  { code: "MA", name: "Massachusetts", nameEn: "Massachusetts" },
  { code: "MI", name: "Michigan", nameEn: "Michigan" },
  { code: "MN", name: "Minnesota", nameEn: "Minnesota" },
  { code: "MS", name: "Mississippi", nameEn: "Mississippi" },
  { code: "MO", name: "Missouri", nameEn: "Missouri" },
  { code: "MT", name: "Montana", nameEn: "Montana" },
  { code: "NE", name: "Nebraska", nameEn: "Nebraska" },
  { code: "NV", name: "Nevada", nameEn: "Nevada" },
  { code: "NH", name: "New Hampshire", nameEn: "New Hampshire" },
  { code: "NJ", name: "New Jersey", nameEn: "New Jersey" },
  { code: "NM", name: "New Mexico", nameEn: "New Mexico" },
  { code: "NY", name: "New York", nameEn: "New York" },
  { code: "NC", name: "North Carolina", nameEn: "North Carolina" },
  { code: "ND", name: "North Dakota", nameEn: "North Dakota" },
  { code: "OH", name: "Ohio", nameEn: "Ohio" },
  { code: "OK", name: "Oklahoma", nameEn: "Oklahoma" },
  { code: "OR", name: "Oregon", nameEn: "Oregon" },
  { code: "PA", name: "Pennsylvania", nameEn: "Pennsylvania" },
  { code: "RI", name: "Rhode Island", nameEn: "Rhode Island" },
  { code: "SC", name: "South Carolina", nameEn: "South Carolina" },
  { code: "SD", name: "South Dakota", nameEn: "South Dakota" },
  { code: "TN", name: "Tennessee", nameEn: "Tennessee" },
  { code: "TX", name: "Texas", nameEn: "Texas" },
  { code: "UT", name: "Utah", nameEn: "Utah" },
  { code: "VT", name: "Vermont", nameEn: "Vermont" },
  { code: "VA", name: "Virginia", nameEn: "Virginia" },
  { code: "WA", name: "Washington", nameEn: "Washington" },
  { code: "WV", name: "West Virginia", nameEn: "West Virginia" },
  { code: "WI", name: "Wisconsin", nameEn: "Wisconsin" },
  { code: "WY", name: "Wyoming", nameEn: "Wyoming" },
  { code: "DC", name: "District of Columbia", nameEn: "District of Columbia" },
]
