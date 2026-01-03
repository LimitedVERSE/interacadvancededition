import { Spinner } from "@/components/Spinner"

export default function BankConnectorLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center">
        <Spinner />
        <p className="text-gray-600 mt-4">Loading bank connector...</p>
      </div>
    </div>
  )
}
