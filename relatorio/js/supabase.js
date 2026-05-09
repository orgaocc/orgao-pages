// =============================================================================
// SUPABASE CLIENT — chama a RPC get_lead_webhooks via REST
// =============================================================================

export const SUPABASE = {
  url: "https://mjzboolbdynbavxpounr.supabase.co",
  // anon key — mesma usada pelo JPE; segura para client-side (role: anon).
  // O acesso à cpl_inlead_hooks acontece via RPC SECURITY DEFINER.
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qemJvb2xiZHluYmF2eHBvdW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjYyMTAsImV4cCI6MjA5MDQ0MjIxMH0.Os0IHYXD1-5tF0rzxBWlupa8UwpaKnezjfyyofbAOdc",
};

export async function fetchLeadWebhooks(email) {
  const res = await fetch(`${SUPABASE.url}/rest/v1/rpc/get_lead_webhooks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE.key,
      Authorization: `Bearer ${SUPABASE.key}`,
    },
    body: JSON.stringify({ lead_email: email }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Supabase RPC falhou (${res.status}): ${txt}`);
  }
  return res.json();
}
