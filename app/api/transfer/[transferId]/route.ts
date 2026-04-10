import { NextResponse } from "next/server"
import { getTransfer } from "@/services/transferService"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ transferId: string }> }
) {
  const { transferId } = await params

  if (!transferId || typeof transferId !== "string") {
    return NextResponse.json({ error: "Missing transfer ID" }, { status: 400 })
  }

  const record = await getTransfer(transferId)

  if (!record) {
    return NextResponse.json({ error: "Transfer not found" }, { status: 404 })
  }

  // Strip sensitive fields before returning to client
  const { recipient_email, ...safeRecord } = record
  return NextResponse.json({ transfer: { ...safeRecord, recipient_email_masked: maskEmail(recipient_email) } })
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@")
  if (!domain) return email
  const visible = local.length > 2 ? local.slice(0, 2) : local.slice(0, 1)
  return `${visible}${"*".repeat(Math.max(0, local.length - 2))}@${domain}`
}
