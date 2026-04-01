'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { 
  getCachedAccountBalance, 
  cacheAccountBalance,
  invalidateAccountCache,
  invalidateUserCache,
} from '@/lib/upstash/cache'
import type { Account, AccountType } from '@/types/database'

export interface AccountResult {
  error?: string
  data?: Account | Account[]
}

/**
 * Get all accounts for the current user
 */
export async function getAccounts(): Promise<AccountResult> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }
  
  const { data: accounts, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
  
  if (error) {
    return { error: error.message }
  }
  
  return { data: accounts as Account[] }
}

/**
 * Get a single account by ID
 */
export async function getAccount(accountId: string): Promise<AccountResult> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }
  
  const { data: account, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', accountId)
    .eq('user_id', user.id)
    .single()
  
  if (error) {
    return { error: error.message }
  }
  
  return { data: account as Account }
}

/**
 * Get account balance (with caching)
 */
export async function getAccountBalance(accountId: string): Promise<{ error?: string; balance?: number }> {
  // Try cache first
  const cached = await getCachedAccountBalance(accountId)
  if (cached !== null) {
    return { balance: cached }
  }
  
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }
  
  const { data: account, error } = await supabase
    .from('accounts')
    .select('balance')
    .eq('id', accountId)
    .eq('user_id', user.id)
    .single()
  
  if (error) {
    return { error: error.message }
  }
  
  // Cache the balance
  await cacheAccountBalance(accountId, account.balance)
  
  return { balance: account.balance }
}

/**
 * Create a new account
 */
export async function createAccount(
  accountType: AccountType,
  initialBalance = 0
): Promise<AccountResult> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }
  
  const { data: account, error } = await supabase
    .from('accounts')
    .insert({
      user_id: user.id,
      account_type: accountType,
      balance: initialBalance,
      currency: 'CAD',
      status: 'active',
    })
    .select()
    .single()
  
  if (error) {
    return { error: error.message }
  }
  
  // Invalidate user's account cache
  await invalidateUserCache(user.id)
  
  revalidatePath('/dashboard')
  revalidatePath('/accounts')
  
  return { data: account as Account }
}

/**
 * Update account balance (internal use)
 * Should be called within a transaction in production
 */
export async function updateAccountBalance(
  accountId: string,
  newBalance: number
): Promise<AccountResult> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }
  
  const { data: account, error } = await supabase
    .from('accounts')
    .update({ balance: newBalance })
    .eq('id', accountId)
    .eq('user_id', user.id)
    .select()
    .single()
  
  if (error) {
    return { error: error.message }
  }
  
  // Invalidate and update cache
  await invalidateAccountCache(accountId)
  await cacheAccountBalance(accountId, newBalance)
  
  revalidatePath('/dashboard')
  revalidatePath('/accounts')
  
  return { data: account as Account }
}

/**
 * Freeze an account
 */
export async function freezeAccount(accountId: string): Promise<AccountResult> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }
  
  const { data: account, error } = await supabase
    .from('accounts')
    .update({ status: 'frozen' })
    .eq('id', accountId)
    .eq('user_id', user.id)
    .select()
    .single()
  
  if (error) {
    return { error: error.message }
  }
  
  await invalidateAccountCache(accountId)
  revalidatePath('/dashboard')
  revalidatePath('/accounts')
  
  return { data: account as Account }
}

/**
 * Close an account (only if balance is 0)
 */
export async function closeAccount(accountId: string): Promise<AccountResult> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }
  
  // Check if balance is 0
  const { data: existingAccount } = await supabase
    .from('accounts')
    .select('balance')
    .eq('id', accountId)
    .eq('user_id', user.id)
    .single()
  
  if (existingAccount && existingAccount.balance !== 0) {
    return { error: 'Account balance must be 0 to close' }
  }
  
  const { data: account, error } = await supabase
    .from('accounts')
    .update({ status: 'closed' })
    .eq('id', accountId)
    .eq('user_id', user.id)
    .select()
    .single()
  
  if (error) {
    return { error: error.message }
  }
  
  await invalidateAccountCache(accountId)
  await invalidateUserCache(user.id)
  revalidatePath('/dashboard')
  revalidatePath('/accounts')
  
  return { data: account as Account }
}
