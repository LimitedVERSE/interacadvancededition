'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { 
  invalidateAccountCache,
  cacheAccountBalance,
} from '@/lib/upstash/cache'
import { transactionRateLimiter, getIdentifier } from '@/lib/upstash/rate-limit'
import { headers } from 'next/headers'
import type { Transaction, TransactionType } from '@/types/database'

export interface TransactionResult {
  error?: string
  data?: Transaction | Transaction[]
  rateLimited?: boolean
}

/**
 * Get transactions for an account with pagination
 */
export async function getTransactions(
  accountId: string,
  page = 1,
  limit = 20
): Promise<TransactionResult> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }
  
  // Verify account ownership
  const { data: account } = await supabase
    .from('accounts')
    .select('id')
    .eq('id', accountId)
    .eq('user_id', user.id)
    .single()
  
  if (!account) {
    return { error: 'Account not found' }
  }
  
  const offset = (page - 1) * limit
  
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) {
    return { error: error.message }
  }
  
  return { data: transactions as Transaction[] }
}

/**
 * Get all transactions for the current user across all accounts
 */
export async function getAllUserTransactions(
  page = 1,
  limit = 50
): Promise<TransactionResult> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }
  
  // Get all user accounts first
  const { data: accounts } = await supabase
    .from('accounts')
    .select('id')
    .eq('user_id', user.id)
  
  if (!accounts || accounts.length === 0) {
    return { data: [] }
  }
  
  const accountIds = accounts.map(a => a.id)
  const offset = (page - 1) * limit
  
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .in('account_id', accountIds)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) {
    return { error: error.message }
  }
  
  return { data: transactions as Transaction[] }
}

/**
 * Create a deposit transaction
 */
export async function createDeposit(
  accountId: string,
  amount: number,
  metadata: Record<string, unknown> = {}
): Promise<TransactionResult> {
  // Rate limiting
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const identifier = getIdentifier(new Request('http://localhost'), undefined)
  
  const { success } = await transactionRateLimiter.limit(identifier)
  if (!success) {
    return { error: 'Rate limit exceeded. Please try again later.', rateLimited: true }
  }
  
  if (amount <= 0) {
    return { error: 'Amount must be positive' }
  }
  
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }
  
  // Get current balance
  const { data: account } = await supabase
    .from('accounts')
    .select('balance, status')
    .eq('id', accountId)
    .eq('user_id', user.id)
    .single()
  
  if (!account) {
    return { error: 'Account not found' }
  }
  
  if (account.status !== 'active') {
    return { error: 'Account is not active' }
  }
  
  // Create transaction
  const { data: transaction, error: txError } = await supabase
    .from('transactions')
    .insert({
      account_id: accountId,
      amount: Math.round(amount * 100), // Convert to cents
      type: 'deposit' as TransactionType,
      status: 'completed',
      metadata,
    })
    .select()
    .single()
  
  if (txError) {
    return { error: txError.message }
  }
  
  // Update account balance
  const newBalance = account.balance + Math.round(amount * 100)
  const { error: updateError } = await supabase
    .from('accounts')
    .update({ balance: newBalance })
    .eq('id', accountId)
  
  if (updateError) {
    return { error: updateError.message }
  }
  
  // Update cache
  await invalidateAccountCache(accountId)
  await cacheAccountBalance(accountId, newBalance)
  
  revalidatePath('/dashboard')
  revalidatePath('/history')
  
  return { data: transaction as Transaction }
}

/**
 * Create a withdrawal transaction
 */
export async function createWithdrawal(
  accountId: string,
  amount: number,
  metadata: Record<string, unknown> = {}
): Promise<TransactionResult> {
  // Rate limiting
  const identifier = `ip:unknown` // Simplified for server action
  
  const { success } = await transactionRateLimiter.limit(identifier)
  if (!success) {
    return { error: 'Rate limit exceeded. Please try again later.', rateLimited: true }
  }
  
  if (amount <= 0) {
    return { error: 'Amount must be positive' }
  }
  
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }
  
  // Get current balance
  const { data: account } = await supabase
    .from('accounts')
    .select('balance, status')
    .eq('id', accountId)
    .eq('user_id', user.id)
    .single()
  
  if (!account) {
    return { error: 'Account not found' }
  }
  
  if (account.status !== 'active') {
    return { error: 'Account is not active' }
  }
  
  const amountInCents = Math.round(amount * 100)
  
  if (account.balance < amountInCents) {
    return { error: 'Insufficient funds' }
  }
  
  // Create transaction
  const { data: transaction, error: txError } = await supabase
    .from('transactions')
    .insert({
      account_id: accountId,
      amount: -amountInCents, // Negative for withdrawal
      type: 'withdrawal' as TransactionType,
      status: 'completed',
      metadata,
    })
    .select()
    .single()
  
  if (txError) {
    return { error: txError.message }
  }
  
  // Update account balance
  const newBalance = account.balance - amountInCents
  const { error: updateError } = await supabase
    .from('accounts')
    .update({ balance: newBalance })
    .eq('id', accountId)
  
  if (updateError) {
    return { error: updateError.message }
  }
  
  // Update cache
  await invalidateAccountCache(accountId)
  await cacheAccountBalance(accountId, newBalance)
  
  revalidatePath('/dashboard')
  revalidatePath('/history')
  
  return { data: transaction as Transaction }
}

/**
 * Create a transfer between accounts
 */
export async function createTransfer(
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  metadata: Record<string, unknown> = {}
): Promise<TransactionResult> {
  // Rate limiting
  const identifier = `transfer:${fromAccountId}`
  
  const { success } = await transactionRateLimiter.limit(identifier)
  if (!success) {
    return { error: 'Rate limit exceeded. Please try again later.', rateLimited: true }
  }
  
  if (amount <= 0) {
    return { error: 'Amount must be positive' }
  }
  
  if (fromAccountId === toAccountId) {
    return { error: 'Cannot transfer to the same account' }
  }
  
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }
  
  // Get source account
  const { data: fromAccount } = await supabase
    .from('accounts')
    .select('balance, status')
    .eq('id', fromAccountId)
    .eq('user_id', user.id)
    .single()
  
  if (!fromAccount) {
    return { error: 'Source account not found' }
  }
  
  if (fromAccount.status !== 'active') {
    return { error: 'Source account is not active' }
  }
  
  // Get destination account
  const { data: toAccount } = await supabase
    .from('accounts')
    .select('balance, status')
    .eq('id', toAccountId)
    .eq('user_id', user.id)
    .single()
  
  if (!toAccount) {
    return { error: 'Destination account not found' }
  }
  
  if (toAccount.status !== 'active') {
    return { error: 'Destination account is not active' }
  }
  
  const amountInCents = Math.round(amount * 100)
  
  if (fromAccount.balance < amountInCents) {
    return { error: 'Insufficient funds' }
  }
  
  const referenceId = `transfer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  // Create transfer out transaction
  const { error: txOutError } = await supabase
    .from('transactions')
    .insert({
      account_id: fromAccountId,
      amount: -amountInCents,
      type: 'transfer_out' as TransactionType,
      status: 'completed',
      reference_id: referenceId,
      metadata: { ...metadata, to_account: toAccountId },
    })
  
  if (txOutError) {
    return { error: txOutError.message }
  }
  
  // Create transfer in transaction
  const { data: transaction, error: txInError } = await supabase
    .from('transactions')
    .insert({
      account_id: toAccountId,
      amount: amountInCents,
      type: 'transfer_in' as TransactionType,
      status: 'completed',
      reference_id: referenceId,
      metadata: { ...metadata, from_account: fromAccountId },
    })
    .select()
    .single()
  
  if (txInError) {
    return { error: txInError.message }
  }
  
  // Update balances
  const newFromBalance = fromAccount.balance - amountInCents
  const newToBalance = toAccount.balance + amountInCents
  
  await supabase.from('accounts').update({ balance: newFromBalance }).eq('id', fromAccountId)
  await supabase.from('accounts').update({ balance: newToBalance }).eq('id', toAccountId)
  
  // Update cache
  await invalidateAccountCache(fromAccountId)
  await invalidateAccountCache(toAccountId)
  await cacheAccountBalance(fromAccountId, newFromBalance)
  await cacheAccountBalance(toAccountId, newToBalance)
  
  revalidatePath('/dashboard')
  revalidatePath('/history')
  
  return { data: transaction as Transaction }
}
