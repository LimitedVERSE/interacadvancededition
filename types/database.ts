/**
 * Supabase Database Types
 * These types should be regenerated using Supabase CLI for production
 */

export type UserRole = 'user' | 'admin'
export type AccountType = 'checking' | 'savings'
export type AccountStatus = 'active' | 'frozen' | 'closed'
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out'
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Account {
  id: string
  user_id: string
  account_type: AccountType
  balance: number // Stored in cents
  currency: string
  status: AccountStatus
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  account_id: string
  amount: number // Positive for credit, negative for debit
  type: TransactionType
  status: TransactionStatus
  reference_id: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  resource_type: string
  resource_id: string | null
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export interface Recipient {
  id: string
  user_id: string
  name: string
  email: string
  phone: string | null
  bank_name: string | null
  created_at: string
  updated_at: string
}

// Database helper types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      accounts: {
        Row: Account
        Insert: Omit<Account, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Account, 'id' | 'user_id' | 'created_at'>>
      }
      transactions: {
        Row: Transaction
        Insert: Omit<Transaction, 'id' | 'created_at'>
        Update: Partial<Omit<Transaction, 'id' | 'account_id' | 'created_at'>>
      }
      audit_logs: {
        Row: AuditLog
        Insert: Omit<AuditLog, 'id' | 'created_at'>
        Update: never // Audit logs are immutable
      }
      recipients: {
        Row: Recipient
        Insert: Omit<Recipient, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Recipient, 'id' | 'user_id' | 'created_at'>>
      }
    }
  }
}
