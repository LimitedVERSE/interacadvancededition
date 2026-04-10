# Transaction & RBAC System Documentation

## Overview

This system implements:
1. **Transaction Management** — Daily spending limits with automatic deductions
2. **Real-Time Balance Tracking** — Live checking/savings balance display
3. **Role-Based Access Control (RBAC)** — Admin vs. Client portal separation
4. **Access Control Enforcement** — Client portal users cannot access admin features

## Architecture

### 1. Authentication & Authorization (`lib/auth/context.tsx`)

**User Roles:**
- `admin` — Full platform access (dashboard, send payments, admin panel)
- `user` — Limited access (deposit portal only)

**Login Logic:**
- Email: `admin@quantumyield.exchange` → Admin role → Routes to `/dashboard`
- Any other email → User role → Routes to `/deposit-portal/client`
- Access source is tracked (`admin` or `client`) to prevent browser history exploitation

**Key Functions:**
- `useAuth()` — Returns `user`, `isAdmin`, `isLoading`, `login`, `logout`, `setAccessSource`, `getAccessSource`
- Admin-only users have full platform access
- Non-admin users are prevented from accessing `/dashboard`, `/send`, `/admin` routes

### 2. RBAC Middleware (`lib/auth/rbac.ts`)

**Hooks:**
- `useRequireAdmin()` — Redirects non-admin users to `/deposit-portal/client`
- `useRequireClient()` — Redirects unauthenticated users to `/login`
- `usePreventAdminNavigation()` — Prevents client portal users from accessing admin features via browser history/URL

**Integration:**
```tsx
// In a protected route
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  // If requireAdmin=true and user.role !== "admin" → redirect to /deposit-portal/client
}
```

### 3. Transaction Service (`services/TransactionService.ts`)

**Core Responsibilities:**
- Manage daily spending limits per user
- Deduct transaction amounts from daily limit
- Track remaining balance
- Auto-reload from savings when balance falls below 20% threshold
- Maintain transaction audit trail

**Daily Limit State:**
```typescript
interface DailyLimitState {
  daily_limit: number           // $50,000 USD (default)
  spent_today: number           // Amount spent so far today
  remaining: number             // $50,000 - spent_today
  reset_at: string              // ISO timestamp for midnight reset
}
```

**Key Methods:**

- `getDailyLimitState(userId)` — Returns current daily limit (auto-resets at midnight UTC)
- `canDeduct(userId, amount)` — Checks if amount is within daily limit
- `deductFromDailyLimit(userId, amount, balances)` — Deducts from limit AND checking balance
- `autoReloadIfNeeded(userId, balances)` — Reloads from savings if below 20% threshold
- `createTransaction(...)` — Creates audit trail record
- `completeTransaction(transactionId)` — Marks transaction as completed

**Example Usage:**
```typescript
// Check if user can transfer $5,000
const check = await transactionService.canDeduct(userId, 500000) // amount in cents
if (check.allowed) {
  // Deduct from limit and balance
  const result = await transactionService.deductFromDailyLimit(
    userId,
    500000,
    { checking_balance: 7000000, savings_balance: 14250000, ... }
  )
  if (result.success) {
    console.log("New checking balance:", result.new_balance.checking_balance)
    console.log("Daily remaining:", result.new_balance.remaining)
  }
}
```

### 4. Real-Time Balance Hook (`hooks/useUserBalance.ts`)

**Purpose:**
- Subscribe to balance changes in real-time (polls localStorage every 2 seconds)
- Display live checking/savings balances
- Show daily limit spent/remaining

**Hook Signature:**
```typescript
const {
  balance,                 // { checking_balance, savings_balance, daily_limit, spent_today }
  dailyLimit,             // { daily_limit, spent_today, remaining, reset_at }
  isLoading,
  error,
  updateBalance,          // Update balance manually
  deductTransaction,      // Deduct transaction amount
  autoReload,             // Trigger auto-reload
  percentSpent,           // % of daily limit spent
  isLowBalance,           // true if below 20% threshold
} = useUserBalance(userId)
```

**Example:**
```tsx
function Dashboard() {
  const { balance, dailyLimit, isLowBalance, deductTransaction } = useUserBalance(user?.id)

  const handleSendPayment = async (amount: number) => {
    const result = await deductTransaction(amount)
    if (result.success) {
      console.log("Payment sent! New balance:", result.new_balance)
    } else {
      alert(result.error) // "Transaction exceeds daily limit..."
    }
  }

  return (
    <div>
      <h2>Checking: ${(balance.checking_balance / 100).toFixed(2)}</h2>
      <p>Daily Remaining: ${(dailyLimit?.remaining / 100).toFixed(2)}</p>
      {isLowBalance && <p>⚠️ Balance is low! Will auto-reload from savings.</p>}
    </div>
  )
}
```

### 5. Protected Route Component (`components/protected-route.tsx`)

**Props:**
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean  // Default: false
}
```

**Behavior:**
- If `requireAdmin=true` and user is not admin → redirect to `/deposit-portal/client`
- If user accessed via client portal (`getAccessSource() === "client"`) → prevent admin route access
- If not authenticated → redirect to `/login`

**Dashboard Usage:**
```tsx
export default function DashboardPage() {
  return (
    <ProtectedRoute requireAdmin={true}>  {/* Admin only */}
      <DashboardContent />
    </ProtectedRoute>
  )
}
```

## Flow Diagrams

### Login Flow
```
User Login (email)
    ↓
admin@quantumyield.exchange? 
    ├─ YES → role = "admin" → accessSource = "admin" → /dashboard
    └─ NO  → role = "user" → accessSource = "client" → /deposit-portal/client
```

### Transaction Flow
```
User clicks "Send Payment"
    ↓
deductTransaction(amount)
    ↓
getDailyLimitState() — auto-reset at midnight?
    ↓
canDeduct(userId, amount)
    ├─ NO (exceeds limit) → error: "Transaction exceeds daily limit. Available: $X, Requested: $Y"
    └─ YES
        ↓
        deductFromDailyLimit()
        ├─ Deduct from spent_today
        ├─ Calculate remaining
        ├─ Deduct from checking_balance
        ├─ Check if below 20% threshold
        └─ Auto-reload from savings if needed
```

### Access Control Flow
```
User tries to navigate to /dashboard from /deposit-portal/client
    ↓
ProtectedRoute checks: requireAdmin=true?
    ↓
YES → Check user.role === "admin" AND getAccessSource() === "admin"
    ├─ YES → Allow access
    └─ NO  → Redirect to /deposit-portal/client
```

## Data Storage (Current Implementation)

**localStorage Keys:**
- `interac-user` — Logged-in user object with `{ id, email, name, role }`
- `access-source` — "admin" or "client"
- `daily-limit-{userId}` — DailyLimitState object
- `user-balance-{userId}` — UserBalance object
- `transaction-{transactionId}` — Transaction record for audit trail

**Production Migration:**
Replace all `localStorage` references with database calls:
- Users table → Role, email, created_at
- daily_limits table → user_id, date, limit_amount, spent_amount, reset_at
- user_ledger table → user_id, checking_balance, savings_balance, updated_at
- transaction_history table → user_id, recipient_email, amount, status, created_at, transferred_at

## Integration with API Routes

**Example: `/app/api/send-zelle/route.ts`**

```typescript
export async function POST(request: NextRequest) {
  const { userId, recipientEmail, amount } = await request.json()

  // 1. Check RBAC
  const user = await auth.getUser(userId) // or from JWT
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  // 2. Check daily limit
  const currentBalance = await db.query('SELECT * FROM user_ledger WHERE user_id = ?', userId)
  const deductResult = await transactionService.deductFromDailyLimit(
    userId,
    amount,
    currentBalance
  )

  if (!deductResult.success) {
    return NextResponse.json({ error: deductResult.error }, { status: 429 })
  }

  // 3. Create transaction
  const tx = await transactionService.createTransaction(userId, recipientEmail, amount)

  // 4. Update database
  await db.execute('UPDATE user_ledger SET checking_balance = ? WHERE user_id = ?', 
    [deductResult.new_balance.checking_balance, userId]
  )

  // 5. Send email
  await resend.emails.send({
    from: "network@payments.quantumyield.digital",
    to: recipientEmail,
    subject: `Payment received from ${user.name}`,
    // ... email template
  })

  return NextResponse.json({
    success: true,
    transactionId: tx.id,
    newBalance: deductResult.new_balance,
  })
}
```

## Testing Scenarios

### Scenario 1: Admin Transfer at Daily Limit
1. Admin logs in → `/dashboard` (✓ full access)
2. Admin initiates $45,000 transfer
3. Daily limit check: remaining = $50,000 → allowed
4. After transfer: remaining = $5,000
5. Next transfer attempt with $6,000 → rejected (exceeds remaining)

### Scenario 2: Client Portal User Attempts Admin Route
1. Non-admin user logs in → `/deposit-portal/client` (accessSource = "client")
2. User manually navigates to `/dashboard` via browser address bar
3. ProtectedRoute detects: `!isAdmin && accessSource === "client"` → redirect to `/deposit-portal/client` (✓ blocked)

### Scenario 3: Low Balance Auto-Reload
1. Checking balance: $9,000 (below $10,000 threshold)
2. Auto-reload triggers: transfers $25,000 from savings to checking
3. New state: checking = $34,000, savings = $75,000

## Security Considerations

1. **Client Portal Users Cannot Access Admin Features** — Multiple checks prevent escalation:
   - Route-level: `ProtectedRoute requireAdmin={true}`
   - Session-level: `getAccessSource()` prevents history manipulation
   - API-level: Check `user.role === "admin"` on every request

2. **Daily Limits Prevent Over-Spending** — Cannot exceed limit even if balance allows:
   - Real-time validation before deduction
   - Automatic reset at midnight UTC
   - Clear error messages show available vs. requested amount

3. **Audit Trail** — All transactions recorded:
   - Transaction records with timestamps
   - Manual transaction creation via `createTransaction()`
   - Database integration for compliance reports

4. **Auto-Reload Threshold** — Prevents account from running dry:
   - Automatic transfer from savings when below 20%
   - Configurable threshold and reload amount
   - Prevents failed transactions mid-process

## Future Enhancements

1. **Database Integration** — Replace localStorage with Supabase/Postgres
2. **Real-Time Sync** — WebSocket updates instead of polling
3. **Role Management** — Admin UI to manage user roles and limits
4. **Transaction Webhooks** — Notify external systems on payment events
5. **Multi-Currency Support** — Handle USD, EUR, GBP, etc.
6. **IP Whitelisting** — Additional security layer for admin access
7. **Two-Factor Authentication** — MFA for admin logins
8. **Rate Limiting** — API throttling to prevent abuse
