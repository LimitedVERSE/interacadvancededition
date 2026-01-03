import { getBankConnector } from "@/services/bankConnectorService"
import BankConnectorScreen from "@/components/BankConnectorScreen"

interface BankConnectorPageProps {
  params: Promise<{
    bankId: string
  }>
}

export default async function BankConnectorPage({ params }: BankConnectorPageProps) {
  const { bankId } = await params
  const connector = await getBankConnector(bankId)

  return <BankConnectorScreen connector={connector} />
}

export function generateMetadata({ params }: { params: Promise<{ bankId: string }> }) {
  return {
    title: "Redirecting to Bank - Interac Money Transfer",
    description: "Securely connecting to your financial institution",
  }
}
