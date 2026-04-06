import { NextResponse } from "next/server"
import { buildZelleMock } from "@/lib/mockZelleService"

export async function GET() {
  const mock = buildZelleMock()
  return NextResponse.json(mock)
}
