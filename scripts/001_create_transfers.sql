-- ── Transfer records table ──────────────────────────────────────────────────
-- Stores every outbound Zelle transfer with its unique deposit-portal link.
-- Indexed for fast lookup by transfer_id (used in email links and portal URLs).

CREATE TABLE IF NOT EXISTS public.transfers (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id       text        NOT NULL UNIQUE,          -- e.g. ZELLE-123456-ABCDEF7
  recipient_email   text        NOT NULL,
  recipient_name    text        NOT NULL,
  amount            numeric(15, 2) NOT NULL CHECK (amount > 0),
  message           text,
  sender_name       text,
  institution       text,
  bank_name         text,
  template_id       text        NOT NULL DEFAULT 'transfer-received',
  language          text        NOT NULL DEFAULT 'en',
  deposit_link      text        NOT NULL,                 -- full /deposit-portal/client?... URL
  send_link         text        NOT NULL,                 -- full /send?prefill=transferId URL
  email_id          text,                                  -- Resend email ID for delivery tracking
  status            text        NOT NULL DEFAULT 'sent'  -- sent | delivered | failed | pending
    CHECK (status IN ('sent','delivered','failed','pending')),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- Index for fast transfer_id lookups (deposit portal, email links)
CREATE INDEX IF NOT EXISTS transfers_transfer_id_idx ON public.transfers (transfer_id);
CREATE INDEX IF NOT EXISTS transfers_recipient_email_idx ON public.transfers (recipient_email);
CREATE INDEX IF NOT EXISTS transfers_created_at_idx ON public.transfers (created_at DESC);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS transfers_updated_at ON public.transfers;
CREATE TRIGGER transfers_updated_at
  BEFORE UPDATE ON public.transfers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────
-- Service-role key (used in API routes) bypasses RLS automatically.
-- Anon/public reads are disabled — portal reads go through the API route.
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (API routes use SUPABASE_SERVICE_ROLE_KEY)
CREATE POLICY "service_role_all" ON public.transfers
  FOR ALL USING (true) WITH CHECK (true);

-- ── Connected bank accounts table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.connected_banks (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_id        text        NOT NULL,
  bank_name      text        NOT NULL,
  bank_category  text        NOT NULL,
  routing_number text,
  account_number_last4 text,
  account_type   text        DEFAULT 'checking',
  status         text        NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','inactive','pending','error')),
  connected_at   timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS connected_banks_bank_id_idx ON public.connected_banks (bank_id);

DROP TRIGGER IF EXISTS connected_banks_updated_at ON public.connected_banks;
CREATE TRIGGER connected_banks_updated_at
  BEFORE UPDATE ON public.connected_banks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.connected_banks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_banks" ON public.connected_banks
  FOR ALL USING (true) WITH CHECK (true);
