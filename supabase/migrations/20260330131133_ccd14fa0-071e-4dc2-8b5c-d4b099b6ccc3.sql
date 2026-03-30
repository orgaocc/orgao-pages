-- Create leads table matching webhook payload
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  utm_campaign TEXT DEFAULT '',
  utm_source TEXT DEFAULT 'direto_site',
  utm_medium TEXT DEFAULT 'direto_site',
  utm_content TEXT DEFAULT 'direto_site',
  utm_term TEXT DEFAULT 'direto_site',
  utm_page TEXT DEFAULT '',
  lancamento TEXT DEFAULT 'PCT33',
  utm_id TEXT DEFAULT '',
  form TEXT DEFAULT 'lovable_jejum',
  source TEXT DEFAULT 'jep',
  precheckout TEXT DEFAULT 'true',
  submission_date TEXT NOT NULL,
  webhook_sent BOOLEAN DEFAULT false,
  webhook_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create failed webhooks table for dead-letter queue
CREATE TABLE public.failed_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  payload JSONB NOT NULL,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failed_webhooks ENABLE ROW LEVEL SECURITY;

-- Leads: allow anonymous inserts (no auth required for lead capture)
CREATE POLICY "Allow anonymous lead inserts"
  ON public.leads FOR INSERT
  TO anon
  WITH CHECK (true);

-- Leads: allow service role full access (for edge functions)
CREATE POLICY "Service role full access on leads"
  ON public.leads FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Failed webhooks: service role only
CREATE POLICY "Service role full access on failed_webhooks"
  ON public.failed_webhooks FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Index for webhook retry queries
CREATE INDEX idx_failed_webhooks_unresolved ON public.failed_webhooks (resolved, created_at) WHERE resolved = false;
CREATE INDEX idx_leads_webhook_not_sent ON public.leads (webhook_sent, created_at) WHERE webhook_sent = false;