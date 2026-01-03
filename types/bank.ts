export interface Bank {
  id: string
  name: string
  logo?: string
  loginUrl: string
}

export interface DepositInfo {
  amount: string
  currency: string
  sender: string
  expiryDate: string
  notice: string
}
