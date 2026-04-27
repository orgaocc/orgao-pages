-- Singleton table for active launch week config (pushed by orgaodash via webhook)
CREATE TABLE public.launch_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  lancamento_id UUID NOT NULL,
  lancamento_nome TEXT NOT NULL,
  is_fallback BOOLEAN NOT NULL DEFAULT false,
  week_number INTEGER,
  week_start DATE,
  week_end DATE,
  sales_start TIMESTAMPTZ,
  sales_end TIMESTAMPTZ,
  link_ingresso TEXT NOT NULL,
  link_produto_principal TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT singleton_check CHECK (id = 1)
);

ALTER TABLE public.launch_config ENABLE ROW LEVEL SECURITY;

-- Public read so the landing page can fetch without auth
CREATE POLICY "Public read launch_config"
ON public.launch_config
FOR SELECT
USING (true);

-- Only service role can write (via the receive-launch-config edge function)
CREATE POLICY "Service role full access on launch_config"
ON public.launch_config
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_launch_config_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_launch_config_updated_at
BEFORE UPDATE ON public.launch_config
FOR EACH ROW
EXECUTE FUNCTION public.update_launch_config_updated_at();