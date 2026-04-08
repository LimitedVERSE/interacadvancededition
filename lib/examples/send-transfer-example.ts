/**
 * Example API Route: Send Zelle Transfer with Transaction Deduction
 * This demonstrates how to integrate transaction service with API routes
 * for automatic daily limit checking and balance updates
 */

import { NextRequest, NextResponse } from "next/server"
import { transactionService } from "@/services/TransactionService"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, recipientEmail, amount, currency = "USD" } = body

    // Validate input
    if (!userId || !recipientEmail || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: userId, recipientEmail, amount" },
        { status: 400 }
      )
    }

    // Get current user balance
    const balanceKey = `user-balance-${userId}`
    const balanceData = localStorage.getItem(balanceKey)
    if (!balanceData) {
      return NextResponse.json(
        { error: "User balance not found" },
        { status: 404 }
      )
    }

    const currentBalance = JSON.parse(balanceData)

    // Check daily limit and deduct
    const deductResult = await transactionService.deductFromDailyLimit(
      userId,
      amount,
      currentBalance
    )

    if (!deductResult.success) {
      return NextResponse.json(
        { error: deductResult.error },
        { status: 429 } // Too Many Requests — daily limit exceeded
      )
    }

    // Create transaction record for audit trail
    const transaction = await transactionService.createTransaction(
      userId,
      recipientEmail,
      amount,
      currency
    )

    // Update user balance in localStorage
    const updatedBalance = {
      ...currentBalance,
      ...deductResult.new_balance,
    }
    localStorage.setItem(balanceKey, JSON.stringify(updatedBalance))

    console.log("[v0] Transfer initiated:", {
      transactionId: transaction.id,
      amount,
      newCheckingBalance: updatedBalance.checking_balance,
      dailyRemaining: deductResult.new_balance?.remaining,
    })

    // In production: send email via Resend, update database, notify via webhook
    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      status: "pending",
      amount,
      recipientEmail,
      newBalance: updatedBalance,
      dailyLimitRemaining: deductResult.new_balance?.remaining,
      message: "Transfer initiated. Checking balance updated.",
    })
  } catch (error) {
    console.error("[v0] Transfer error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Transfer failed" },
      { status: 500 }
    )
  }
}
