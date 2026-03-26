export interface EmailTemplate {
  id: string
  name: string
  category: string
  description: string
  subject: string
  previewText: string
  icon: string
  color: string
}

export const emailTemplates: EmailTemplate[] = [
  // Transfer Notifications (1-5)
  {
    id: "transfer-received",
    name: "Transfer Received",
    category: "Transfer",
    description: "Notify recipient of incoming e-Transfer",
    subject: "You've received an Interac e-Transfer for {{amount}}",
    previewText: "{{senderName}} sent you money",
    icon: "ArrowDownCircle",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "transfer-sent",
    name: "Transfer Sent Confirmation",
    category: "Transfer",
    description: "Confirm outgoing transfer to sender",
    subject: "Your Interac e-Transfer of {{amount}} was sent",
    previewText: "Transfer to {{recipientName}} successful",
    icon: "ArrowUpCircle",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "transfer-pending",
    name: "Transfer Pending",
    category: "Transfer",
    description: "Notify about pending transfer status",
    subject: "Your e-Transfer is pending - Action required",
    previewText: "Complete your transfer within 30 days",
    icon: "Clock",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "transfer-cancelled",
    name: "Transfer Cancelled",
    category: "Transfer",
    description: "Notify about cancelled transfer",
    subject: "Your Interac e-Transfer has been cancelled",
    previewText: "Transfer of {{amount}} was cancelled",
    icon: "XCircle",
    color: "from-red-500 to-red-600",
  },
  {
    id: "transfer-expired",
    name: "Transfer Expired",
    category: "Transfer",
    description: "Notify about expired transfer",
    subject: "Your Interac e-Transfer has expired",
    previewText: "The transfer was not claimed in time",
    icon: "AlertTriangle",
    color: "from-gray-500 to-gray-600",
  },

  // Deposit Notifications (6-10)
  {
    id: "deposit-completed",
    name: "Deposit Completed",
    category: "Deposit",
    description: "Confirm successful deposit",
    subject: "Deposit of {{amount}} completed successfully",
    previewText: "Funds are now in your account",
    icon: "CheckCircle",
    color: "from-emerald-500 to-green-600",
  },
  {
    id: "deposit-failed",
    name: "Deposit Failed",
    category: "Deposit",
    description: "Notify about failed deposit attempt",
    subject: "Your e-Transfer deposit could not be completed",
    previewText: "Action required to complete deposit",
    icon: "XOctagon",
    color: "from-red-500 to-rose-600",
  },
  {
    id: "deposit-reminder",
    name: "Deposit Reminder",
    category: "Deposit",
    description: "Remind recipient to deposit funds",
    subject: "Reminder: You have an unclaimed e-Transfer",
    previewText: "Don't forget to deposit your {{amount}}",
    icon: "Bell",
    color: "from-yellow-500 to-amber-600",
  },
  {
    id: "deposit-instructions",
    name: "Deposit Instructions",
    category: "Deposit",
    description: "Step-by-step deposit guide",
    subject: "How to deposit your Interac e-Transfer",
    previewText: "Follow these simple steps",
    icon: "FileText",
    color: "from-indigo-500 to-violet-600",
  },
  {
    id: "auto-deposit-enabled",
    name: "Auto-Deposit Enabled",
    category: "Deposit",
    description: "Confirm auto-deposit registration",
    subject: "Interac e-Transfer Auto-Deposit is now active",
    previewText: "Transfers will deposit automatically",
    icon: "Zap",
    color: "from-cyan-500 to-teal-600",
  },

  // Security Notifications (11-15)
  {
    id: "security-question-updated",
    name: "Security Question Updated",
    category: "Security",
    description: "Confirm security question change",
    subject: "Your e-Transfer security settings were updated",
    previewText: "Security question successfully changed",
    icon: "Shield",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "suspicious-activity",
    name: "Suspicious Activity Alert",
    category: "Security",
    description: "Alert about unusual transfer activity",
    subject: "Important: Unusual activity detected",
    previewText: "Review your recent transactions",
    icon: "AlertOctagon",
    color: "from-red-600 to-red-700",
  },
  {
    id: "password-reset",
    name: "Password Reset",
    category: "Security",
    description: "Password reset instructions",
    subject: "Reset your password",
    previewText: "Click to reset your password",
    icon: "Key",
    color: "from-orange-500 to-red-600",
  },
  {
    id: "two-factor-enabled",
    name: "Two-Factor Authentication",
    category: "Security",
    description: "Confirm 2FA activation",
    subject: "Two-factor authentication is now enabled",
    previewText: "Your account is more secure",
    icon: "Lock",
    color: "from-green-600 to-emerald-700",
  },
  {
    id: "login-notification",
    name: "New Login Detected",
    category: "Security",
    description: "Alert about new device login",
    subject: "New sign-in to your account",
    previewText: "Was this you?",
    icon: "UserCheck",
    color: "from-blue-600 to-indigo-700",
  },

  // Account Notifications (16-19)
  {
    id: "account-verified",
    name: "Account Verified",
    category: "Account",
    description: "Confirm account verification",
    subject: "Your account has been verified",
    previewText: "You're all set to send and receive",
    icon: "BadgeCheck",
    color: "from-green-500 to-teal-600",
  },
  {
    id: "profile-updated",
    name: "Profile Updated",
    category: "Account",
    description: "Confirm profile changes",
    subject: "Your profile has been updated",
    previewText: "Changes saved successfully",
    icon: "UserCog",
    color: "from-slate-500 to-slate-600",
  },
  {
    id: "bank-linked",
    name: "Bank Account Linked",
    category: "Account",
    description: "Confirm bank connection",
    subject: "Bank account successfully linked",
    previewText: "You can now send and receive e-Transfers",
    icon: "Building",
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "limit-increase",
    name: "Transfer Limit Increased",
    category: "Account",
    description: "Notify about limit changes",
    subject: "Your e-Transfer limit has been increased",
    previewText: "You can now send up to {{limit}}",
    icon: "TrendingUp",
    color: "from-emerald-500 to-green-600",
  },

  // Request & Notification (20-22)
  {
    id: "money-request",
    name: "Money Request",
    category: "Request",
    description: "Request money from someone",
    subject: "{{senderName}} is requesting {{amount}}",
    previewText: "Tap to send the requested amount",
    icon: "HandCoins",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "request-accepted",
    name: "Request Accepted",
    category: "Request",
    description: "Notify that request was fulfilled",
    subject: "Your money request was accepted",
    previewText: "{{recipientName}} sent you {{amount}}",
    icon: "ThumbsUp",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "request-declined",
    name: "Request Declined",
    category: "Request",
    description: "Notify that request was declined",
    subject: "Your money request was declined",
    previewText: "{{recipientName}} couldn't fulfill your request",
    icon: "ThumbsDown",
    color: "from-gray-500 to-slate-600",
  },
]

export const templateCategories = [
  { id: "all", name: "All Templates", count: 22 },
  { id: "Transfer", name: "Transfer", count: 5 },
  { id: "Deposit", name: "Deposit", count: 5 },
  { id: "Security", name: "Security", count: 5 },
  { id: "Account", name: "Account", count: 4 },
  { id: "Request", name: "Request", count: 3 },
]

export function getTemplatesByCategory(category: string): EmailTemplate[] {
  if (category === "all") return emailTemplates
  return emailTemplates.filter((t) => t.category === category)
}

export function getTemplateById(id: string): EmailTemplate | undefined {
  return emailTemplates.find((t) => t.id === id)
}
