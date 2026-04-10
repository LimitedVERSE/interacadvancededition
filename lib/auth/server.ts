import { NextRequest } from "next/server"

interface User {
  id: string
  email: string
  name: string
  isAdmin?: boolean
}

/**
 * Verifies admin authentication from a NextRequest.
 * Expects an Authorization header with a Bearer token containing a Base64-encoded user object.
 * Returns the user object if valid admin, null otherwise.
 */
export function verifyAdminAuth(request: NextRequest): User | null {
  try {
    // Extract the Authorization header
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return null
    }

    // Parse the Bearer token
    const parts = authHeader.split(" ")
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return null
    }

    const token = parts[1]

    // Decode the Base64-encoded user object
    const decodedUser = JSON.parse(Buffer.from(token, "base64").toString("utf-8")) as User

    // Verify it's an admin
    if (decodedUser.email === "admin@quantumyield.exchange") {
      return decodedUser
    }

    return null
  } catch (error) {
    // Log error for debugging
    console.error("[verifyAdminAuth] Error verifying authentication:", error)
    return null
  }
}
