import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const WEBHOOK_URL =
  "https://hooks.grupoconceber.com/webhook/leads_captacao";
const MAX_RETRIES = 3;

async function sendWebhook(
  payload: Record<string, string>,
): Promise<{ ok: boolean; error?: string }> {
  const formBody = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) {
    formBody.append(key, value);
  }

  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody.toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    return { ok: false, error: `HTTP ${res.status}: ${text}` };
  }
  return { ok: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Build webhook payload
    const webhookPayload: Record<string, string> = {
      nome: body.nome || "",
      email: body.email || "",
      whatsapp: body.whatsapp || "",
      utm_campaign: body.utm_campaign || "",
      utm_source: body.utm_source || "direto_site",
      utm_medium: body.utm_medium || "direto_site",
      utm_content: body.utm_content || "direto_site",
      utm_term: body.utm_term || "direto_site",
      utm_page: body.utm_page || "",
      lancamento: body.lancamento || "PCT33",
      utm_id: body.utm_id || "",
      form: body.form || "lovable_jejum",
      source: body.source || "jep",
      precheckout: body.precheckout || "true",
      submission_date: body.submission_date || "",
      headline_test: body.headline_test || "Head0",
    };

    // 1. Store lead in database
    const { data: lead, error: insertError } = await supabase
      .from("leads")
      .insert({
        nome: webhookPayload.nome,
        email: webhookPayload.email,
        whatsapp: webhookPayload.whatsapp,
        utm_campaign: webhookPayload.utm_campaign,
        utm_source: webhookPayload.utm_source,
        utm_medium: webhookPayload.utm_medium,
        utm_content: webhookPayload.utm_content,
        utm_term: webhookPayload.utm_term,
        utm_page: webhookPayload.utm_page,
        lancamento: webhookPayload.lancamento,
        utm_id: webhookPayload.utm_id,
        form: webhookPayload.form,
        source: webhookPayload.source,
        precheckout: webhookPayload.precheckout,
        submission_date: webhookPayload.submission_date,
        headline_test: webhookPayload.headline_test,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Lead insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to store lead" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 2. Send webhook with up to 3 retries
    let lastError = "";
    let sent = false;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const result = await sendWebhook(webhookPayload);
      if (result.ok) {
        sent = true;
        break;
      }
      lastError = result.error || "Unknown error";
      console.warn(`Webhook attempt ${attempt}/${MAX_RETRIES} failed: ${lastError}`);

      if (attempt < MAX_RETRIES) {
        // Exponential backoff: 1s, 2s
        await new Promise((r) => setTimeout(r, attempt * 1000));
      }
    }

    if (sent) {
      // Mark lead as webhook sent
      await supabase
        .from("leads")
        .update({ webhook_sent: true, webhook_sent_at: new Date().toISOString() })
        .eq("id", lead.id);
    } else {
      // 3. After 3 failed retries, store in failed_webhooks queue
      console.error(`Webhook failed after ${MAX_RETRIES} retries for lead ${lead.id}`);
      await supabase.from("failed_webhooks").insert({
        lead_id: lead.id,
        payload: webhookPayload,
        error_message: lastError,
        retry_count: MAX_RETRIES,
      });
    }

    return new Response(
      JSON.stringify({ success: true, lead_id: lead.id, webhook_sent: sent }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("process-lead error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
