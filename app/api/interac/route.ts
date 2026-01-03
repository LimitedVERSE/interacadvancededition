import { NextResponse } from "next/server"
import { buildInteracMock } from "@/lib/mockInteracService"

export async function GET() {
  const mock = buildInteracMock()
  return NextResponse.json(mock)
}
