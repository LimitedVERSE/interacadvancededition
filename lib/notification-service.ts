/**
 * Notification Service
 * Utility to send admin notifications via email to notify@quantumyield.digital
 * Can be used server-side from API routes, Server Actions, or Next.js functions
 */

export interface NotificationPayload {
  subject: string
  message?: string
  htmlContent?: string
  metadata?: Record<string, string | number | boolean>
}

/**
 * Send a notification email to the admin team
 * @param payload - Notification details
 * @returns Promise with the result
 */
export async function sendNotification(payload: NotificationPayload) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/send-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[notification-service] Failed to send notification:", data.error)
      return {
        success: false,
        error: data.error,
      }
    }

    return {
      success: true,
      emailId: data.emailId,
      recipient: data.recipient,
    }
  } catch (error) {
    console.error("[notification-service] Error sending notification:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Send a transaction notification (pre-formatted)
 */
export async function sendTransactionNotification(
  type: "success" | "pending" | "failed",
  details: {
    transferId: string
    amount: number
    recipientEmail: string
    recipientName: string
    timestamp?: Date
  }
) {
  const statusMap = {
    success: { label: "✅ Transfer Completed", color: "green" },
    pending: { label: "⏳ Transfer Pending", color: "blue" },
    failed: { label: "❌ Transfer Failed", color: "red" },
  }

  const status = statusMap[type]

  return sendNotification({
    subject: `${status.label} - Transfer ${details.transferId}`,
    message: `
A new Interac e-Transfer transaction has been processed.

Transfer ID: ${details.transferId}
Amount: $${details.amount.toFixed(2)} CAD
Recipient: ${details.recipientName} (${details.recipientEmail})
Status: ${status.label}
Timestamp: ${(details.timestamp || new Date()).toISOString()}
    `.trim(),
    metadata: {
      transferId: details.transferId,
      amount: details.amount,
      recipientEmail: details.recipientEmail,
      status: type,
    },
  })
}

/**
 * Send a system alert notification
 */
export async function sendSystemAlert(
  severity: "info" | "warning" | "critical",
  title: string,
  description: string,
  details?: Record<string, string | number | boolean>
) {
  const severityMap = {
    info: { emoji: "ℹ️", color: "blue" },
    warning: { emoji: "⚠️", color: "orange" },
    critical: { emoji: "🚨", color: "red" },
  }

  const sev = severityMap[severity]

  return sendNotification({
    subject: `${sev.emoji} [${severity.toUpperCase()}] ${title}`,
    message: description,
    metadata: details,
  })
}
