export interface BankConnector {
  bankId: string
  bankName: string
  loginUrl: string
  status: "online" | "offline" | "maintenance"
}
