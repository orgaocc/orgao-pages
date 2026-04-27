// One-shot bootstrap: pulls active week from orgaodash and stores it locally.
// Called by the LP only when launch_config table is empty.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ORGAODASH_URL =
  "https://gitothfiepeyotfdwgry.supabase.co/functions/v1/public-launch-config";
const LANCAMENTO_ID = "c16d1a8a-d9de-455f-81d0-e5ff35756338";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // If we already have a row, do nothing (push will keep it fresh)
  const { data: existing } = await supabase
    .from("launch_config")
    .select("id")
    .eq("id", 1)
    .maybeSingle();

  if (existing) {
    return new Response(JSON.stringify({ ok: true, skipped: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const res = await fetch(
      `${ORGAODASH_URL}?lancamento_id=${LANCAMENTO_ID}`,
      { method: "GET" }
    );
    if (!res.ok) {
      const text = await res.text();
      console.error("Orgaodash fetch failed:", res.status, text);
      return new Response(
        JSON.stringify({ error: "Upstream error", status: res.status }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    const data = await res.json();

    const row = {
      id: 1,
      lancamento_id: data.lancamento_id,
      lancamento_nome: data.lancamento_nome,
      is_fallback: !!data.is_fallback,
      week_number: data.week_number ?? null,
      week_start: data.week_start ?? null,
      week_end: data.week_end ?? null,
      sales_start: data.sales_start ?? null,
      sales_end: data.sales_end ?? null,
      link_ingresso: data.link_ingresso,
      link_produto_principal: data.link_produto_principal ?? null,
      received_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("launch_config")
      .upsert(row, { onConflict: "id" });

    if (error) {
      console.error("Upsert error:", error);
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, bootstrapped: true, row }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Sync error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
