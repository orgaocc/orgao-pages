import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-webhook-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface LaunchPayload {
  lancamento_id: string;
  lancamento_nome: string;
  is_fallback: boolean;
  week_number?: number | null;
  week_start?: string | null;
  week_end?: string | null;
  sales_start?: string | null;
  sales_end?: string | null;
  link_ingresso: string;
  link_produto_principal?: string | null;
}

const isUuid = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Validate shared secret (orgaodash must send the same value)
  const expected = Deno.env.get("LAUNCH_WEBHOOK_SECRET");
  const provided = req.headers.get("x-webhook-secret");
  if (!expected || !provided || provided !== expected) {
    console.warn("Unauthorized webhook attempt");
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: LaunchPayload;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (
    !body?.lancamento_id ||
    !isUuid(body.lancamento_id) ||
    !body?.lancamento_nome ||
    !body?.link_ingresso
  ) {
    return new Response(
      JSON.stringify({ error: "Missing/invalid required fields" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const row = {
    id: 1,
    lancamento_id: body.lancamento_id,
    lancamento_nome: body.lancamento_nome,
    is_fallback: !!body.is_fallback,
    week_number: body.week_number ?? null,
    week_start: body.week_start ?? null,
    week_end: body.week_end ?? null,
    sales_start: body.sales_start ?? null,
    sales_end: body.sales_end ?? null,
    link_ingresso: body.link_ingresso,
    link_produto_principal: body.link_produto_principal ?? null,
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

  console.log(
    `launch_config updated: week=${row.week_number} fallback=${row.is_fallback}`
  );

  return new Response(
    JSON.stringify({ ok: true, received_at: row.received_at }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
