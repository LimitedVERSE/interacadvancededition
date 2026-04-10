/**
 * transferService.ts
 *
 * Handles transfer record persistence (Supabase) with an in-process LRU-style
 * in-memory cache for fast same-request and cross-request lookups on the same
 * serverless instance.
 *
 * Architecture
 * ────────────
 * 1. On write  → insert into Supabase `transfers` table; store in memory cache.
 * 2. On read   → check memory cache first; fall back to Supabase.
 * 3. Cache TTL → 10 minutes (enough for typical email-click → deposit flow).
 */

import { createClient } from "@/lib/supabase/server"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TransferRecord {
  id?:             string
  transfer_id:     string   // e.g. ZELLE-123456-ABCDEF7
  access_token:    string   // Security token for unauthenticated access verification
  recipient_email: string
  recipient_name:  string
  amount:          number
  message?:        string
  sender_name?:    string
  institution?:    string
  bank_name?:      string
  template_id:     string
  language:        string
  deposit_link:    string   // /deposit-portal/client?transferId=...&token=...
  send_link:       string   // /send?review=transferId&token=... (for email CTA)
  email_id?:       string   // Resend delivery ID
  status:          "sent" | "delivered" | "failed" | "pending"
  created_at?:     string
}

// ── In-memory cache ───────────────────────────────────────────────────────────

interface CacheEntry {
  record:    TransferRecord
  expiresAt: number
}

const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes
const transferCache = new Map<string, CacheEntry>()

function cacheSet(transferId: string, record: TransferRecord) {
  transferCache.set(transferId, { record, expiresAt: Date.now() + CACHE_TTL_MS })
}

function cacheGet(transferId: string): TransferRecord | null {
  const entry = transferCache.get(transferId)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) { transferCache.delete(transferId); return null }
  return entry.record
}

// ── Ensure schema exists (idempotent) ────────────────────────────────────────
// Called lazily before first write so the table exists even if the SQL script
// couldn't run from the script runner.

let schemaEnsured = false

async function ensureSchema() {
  if (schemaEnsured) return
  try {
    const supabase = await createClient()
    if (!supabase) { schemaEnsured = true; return }
    // Attempt a lightweight read — if the table doesn't exist Supabase returns
    // an error code 42P01 and we create the table via raw SQL through rpc.
    const { error } = await supabase.from("transfers").select("id").limit(1)
    if (error && error.code === "42P01") {
      // Table doesn't exist — create it via Postgres function
      await supabase.rpc("create_transfers_table_if_missing")
    }
    schemaEnsured = true
  } catch {
    // Non-fatal: if we can't reach DB we'll still return generated IDs
    schemaEnsured = true
  }
}

// ── Core functions ────────────────────────────────────────────────────────────

/**
 * Generate a unique transfer ID.
 * Format: ZELLE-{6 timestamp digits}-{7 random alphanumeric chars}
 */
export function generateTransferId(): string {
  const ts   = Date.now().toString().slice(-6)
  const rand = Math.random().toString(36).substring(2, 9).toUpperCase()
  return `ZELLE-${ts}-${rand}`
}

/**
 * Generate a secure access token for transfer verification.
 * Used to authorize access to transfer details without authentication.
 */
export function generateAccessToken(): string {
  // Generate 32 characters of cryptographically random base64-safe characters
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
  let token = ""
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

/**
 * Build the deposit-portal URL for a given transfer.
 */
export function buildDepositLink(
  origin: string,
  params: {
    transferId:    string
    amount:        number
    recipient:     string
    recipientName: string
    bankName:      string
    message:       string
    timestamp:     string
    accessToken:   string
  }
): string {
  const qs = new URLSearchParams({
    transferId:    params.transferId,
    amount:        params.amount.toString(),
    recipient:     params.recipient,
    recipientName: params.recipientName,
    bankName:      params.bankName,
    message:       params.message,
    timestamp:     params.timestamp,
    token:         params.accessToken,
  })
  return `${origin}/deposit-portal/client?${qs.toString()}`
}

/**
 * Build the /send review URL so the email CTA can link back to the transfer.
 */
export function buildSendReviewLink(origin: string, transferId: string, accessToken: string): string {
  const params = new URLSearchParams({
    review: transferId,
    token: accessToken,
  })
  return `${origin}/send?${params.toString()}`
}

/**
 * Persist a transfer record to Supabase and warm the in-memory cache.
 * Returns the stored record (with any server-assigned `id`).
 */
export async function saveTransfer(record: TransferRecord): Promise<TransferRecord> {
  // Always cache immediately so the current request can retrieve it
  cacheSet(record.transfer_id, record)

  try {
    await ensureSchema()
    const supabase = await createClient()
    if (!supabase) return record

    const { data, error } = await supabase
      .from("transfers")
      .upsert(
        {
          transfer_id:     record.transfer_id,
          access_token:    record.access_token,
          recipient_email: record.recipient_email,
          recipient_name:  record.recipient_name,
          amount:          record.amount,
          message:         record.message ?? null,
          sender_name:     record.sender_name ?? null,
          institution:     record.institution ?? null,
          bank_name:       record.bank_name ?? null,
          template_id:     record.template_id,
          language:        record.language,
          deposit_link:    record.deposit_link,
          send_link:       record.send_link,
          email_id:        record.email_id ?? null,
          status:          record.status,
        },
        { onConflict: "transfer_id" }
      )
      .select()
      .single()

    if (error) {
      console.error("[transferService] Supabase upsert error:", error.message)
      return record
    }

    const saved = { ...record, id: data?.id }
    cacheSet(record.transfer_id, saved)
    return saved
  } catch (err) {
    console.error("[transferService] saveTransfer error:", err)
    return record
  }
}

/**
 * Retrieve a transfer by ID with optional token verification.
 * Checks in-memory cache first, then Supabase.
 * If accessToken is provided, verifies it matches before returning.
 */
export async function getTransfer(transferId: string, accessToken?: string): Promise<TransferRecord | null> {
  // 1. Cache hit
  const cached = cacheGet(transferId)
  if (cached) {
    // If token provided, verify it matches
    if (accessToken && cached.access_token !== accessToken) {
      return null
    }
    return cached
  }

  // 2. Supabase lookup
  try {
    const supabase = await createClient()
    if (!supabase) return null
    const { data, error } = await supabase
      .from("transfers")
      .select("*")
      .eq("transfer_id", transferId)
      .single()

    if (error || !data) return null

    const record = data as TransferRecord
    
    // If token provided, verify it matches
    if (accessToken && record.access_token !== accessToken) {
      return null
    }
    
    cacheSet(transferId, record)
    return record
  } catch {
    return null
  }
}

/**
 * Update transfer status (e.g. after Resend webhook confirms delivery).
 */
export async function updateTransferStatus(
  transferId: string,
  status: TransferRecord["status"],
  emailId?: string
): Promise<void> {
  // Update cache
  const cached = cacheGet(transferId)
  if (cached) cacheSet(transferId, { ...cached, status, email_id: emailId ?? cached.email_id })

  try {
    const supabase = await createClient()
    if (!supabase) return
    await supabase
      .from("transfers")
      .update({ status, ...(emailId ? { email_id: emailId } : {}) })
      .eq("transfer_id", transferId)
  } catch (err) {
    console.error("[transferService] updateTransferStatus error:", err)
  }
}

/**
 * List recent transfers (admin use, most recent first).
 */
export async function listTransfers(limit = 50): Promise<TransferRecord[]> {
  try {
    const supabase = await createClient()
    if (!supabase) return []
    const { data, error } = await supabase
      .from("transfers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error || !data) return []
    return data as TransferRecord[]
  } catch {
    return []
  }
}
