-- ── Users table with role support ───────────────────────────────────────────
-- Stores user account information including role (admin/user) for RBAC.

CREATE TABLE IF NOT EXISTS public.users (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email             text        NOT NULL UNIQUE,
  name              text,
  role              text        NOT NULL DEFAULT 'user'
    CHECK (role IN ('admin', 'user')),
  access_mode       text        NOT NULL DEFAULT 'full'
    CHECK (access_mode IN ('full', 'client')),
  last_login        timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_email_idx ON public.users (email);
CREATE INDEX IF NOT EXISTS users_role_idx ON public.users (role);

-- Auto-update updated_at on every row change
DROP TRIGGER IF EXISTS users_updated_at ON public.users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Daily limits table ───────────────────────────────────────────────────────
-- Tracks daily spending limits and usage per user.

CREATE TABLE IF NOT EXISTS public.daily_limits (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date              date        NOT NULL,
  limit_amount      numeric(15, 2) NOT NULL DEFAULT 100000,
  spent_amount      numeric(15, 2) NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, date)
);

CREATE INDEX IF NOT EXISTS daily_limits_user_id_idx ON public.daily_limits (user_id);
CREATE INDEX IF NOT EXISTS daily_limits_date_idx ON public.daily_limits (date);

DROP TRIGGER IF EXISTS daily_limits_updated_at ON public.daily_limits;
CREATE TRIGGER daily_limits_updated_at
  BEFORE UPDATE ON public.daily_limits
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── User ledger table ────────────────────────────────────────────────────────
-- Tracks real-time checking and savings balances.

CREATE TABLE IF NOT EXISTS public.user_ledger (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  checking_balance  numeric(15, 2) NOT NULL DEFAULT 250000,
  savings_balance   numeric(15, 2) NOT NULL DEFAULT 1000000,
  last_updated      timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_ledger_user_id_idx ON public.user_ledger (user_id);

DROP TRIGGER IF EXISTS user_ledger_updated_at ON public.user_ledger;
CREATE TRIGGER user_ledger_updated_at
  BEFORE UPDATE ON public.user_ledger
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Transaction history table ───────────────────────────────────────────────
-- Records all transfer transactions for audit trail.

CREATE TABLE IF NOT EXISTS public.transaction_history (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  transfer_id       text        NOT NULL REFERENCES public.transfers(transfer_id) ON DELETE CASCADE,
  amount            numeric(15, 2) NOT NULL,
  direction         text        NOT NULL DEFAULT 'outbound'
    CHECK (direction IN ('outbound', 'inbound', 'reload')),
  status            text        NOT NULL DEFAULT 'completed'
    CHECK (status IN ('completed', 'pending', 'failed', 'reversed')),
  balance_after     numeric(15, 2),
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS transaction_history_user_id_idx ON public.transaction_history (user_id);
CREATE INDEX IF NOT EXISTS transaction_history_transfer_id_idx ON public.transaction_history (transfer_id);
CREATE INDEX IF NOT EXISTS transaction_history_created_at_idx ON public.transaction_history (created_at DESC);

-- ── Row Level Security ───────────────────────────────────────────────────────
-- Service-role key (used in API routes) bypasses RLS automatically.

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_history ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (API routes use SUPABASE_SERVICE_ROLE_KEY)
CREATE POLICY "service_role_all_users" ON public.users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_daily_limits" ON public.daily_limits
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_user_ledger" ON public.user_ledger
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_transaction_history" ON public.transaction_history
  FOR ALL USING (true) WITH CHECK (true);
