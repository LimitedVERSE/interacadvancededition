/**
 * Test email sender — calls the /api/send-interac route with a real payload.
 * Run from the project root:  node scripts/send-test-email.mjs
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

const payload = {
  recipientEmail:    "limitedverse@gmail.com",
  recipientName:     "LimitedVerse",
  amount:            "250.00",
  message:           "Test transfer — header & template verification",
  securityQuestion:  "What is the test passphrase?",
  securityAnswer:    "QuantumYield2025",
  templateId:        "etransfer-notification",
  language:          "en",
}

console.log("[v0] Sending test email to:", payload.recipientEmail)
console.log("[v0] Base URL:", BASE_URL)
console.log("[v0] Payload:", JSON.stringify(payload, null, 2))

try {
  const res = await fetch(`${BASE_URL}/api/send-interac`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    console.error("[v0] FAILED — status:", res.status)
    console.error("[v0] Error:", data?.error || JSON.stringify(data))
    process.exit(1)
  }

  console.log("[v0] SUCCESS — status:", res.status)
  console.log("[v0] Response:", JSON.stringify(data, null, 2))
  process.exit(0)
} catch (err) {
  console.error("[v0] Network error:", err.message)
  process.exit(1)
}
