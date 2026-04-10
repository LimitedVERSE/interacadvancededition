import { NextResponse } from "next/server"
import { getTransfer } from "@/services/transferService"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ transferId: string }> }
) {
  const { transferId } = await params

  if (!transferId || typeof transferId !== "string") {
    return NextResponse.json({ error: "Missing transfer ID" }, { status: 400 })
  }

  // Extract and validate access token from query parameters
  const url = new URL(request.url)
  const accessToken = url.searchParams.get("token")

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token required" },
      { status: 401 }
    )
  }

  const record = await getTransfer(transferId, accessToken)

  if (!record) {
    return NextResponse.json({ error: "Transfer not found or invalid access token" }, { status: 404 })
  }

  // Strip sensitive fields before returning to client
  const { recipient_email, access_token, ...safeRecord } = record
  return NextResponse.json({ transfer: { ...safeRecord, recipient_email_masked: maskEmail(recipient_email) } })
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@")
  if (!domain) return email
  const visible = local.length > 2 ? local.slice(0, 2) : local.slice(0, 1)
  return `${visible}${"*".repeat(Math.max(0, local.length - 2))}@${domain}`
}
