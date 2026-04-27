import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LaunchConfig {
  lancamento_id: string;
  lancamento_nome: string;
  is_fallback: boolean;
  week_number: number | null;
  week_start: string | null;
  week_end: string | null;
  sales_start: string | null;
  sales_end: string | null;
  link_ingresso: string;
  link_produto_principal: string | null;
}

const FALLBACK: LaunchConfig = {
  lancamento_id: "c16d1a8a-d9de-455f-81d0-e5ff35756338",
  lancamento_nome: "Lançamento Pago Semana Abril",
  is_fallback: true,
  week_number: null,
  week_start: null,
  week_end: null,
  sales_start: null,
  sales_end: null,
  link_ingresso: "https://pay.hotmart.com/E104660930C",
  link_produto_principal: null,
};

let cached: LaunchConfig | null = null;
let inflight: Promise<LaunchConfig> | null = null;

async function fetchConfig(): Promise<LaunchConfig> {
  // Try local table first (populated by webhook push)
  const { data, error } = await supabase
    .from("launch_config")
    .select(
      "lancamento_id, lancamento_nome, is_fallback, week_number, week_start, week_end, sales_start, sales_end, link_ingresso, link_produto_principal"
    )
    .eq("id", 1)
    .maybeSingle();

  if (!error && data) return data as LaunchConfig;

  // Bootstrap: empty table → ask edge function to pull from orgaodash
  try {
    await supabase.functions.invoke("sync-launch-config", { body: {} });
    const retry = await supabase
      .from("launch_config")
      .select(
        "lancamento_id, lancamento_nome, is_fallback, week_number, week_start, week_end, sales_start, sales_end, link_ingresso, link_produto_principal"
      )
      .eq("id", 1)
      .maybeSingle();
    if (retry.data) return retry.data as LaunchConfig;
  } catch (e) {
    console.warn("sync-launch-config failed, using fallback", e);
  }

  return FALLBACK;
}

export function useLaunchConfig(): {
  config: LaunchConfig;
  loading: boolean;
} {
  const [config, setConfig] = useState<LaunchConfig>(cached ?? FALLBACK);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) return;
    if (!inflight) inflight = fetchConfig();
    inflight
      .then((c) => {
        cached = c;
        setConfig(c);
      })
      .finally(() => setLoading(false));
  }, []);

  return { config, loading };
}

export async function getLaunchConfigOnce(): Promise<LaunchConfig> {
  if (cached) return cached;
  if (!inflight) inflight = fetchConfig();
  cached = await inflight;
  return cached;
}
