/**
 * Proxy Vercel → Google Apps Script (evita CORS no navegador).
 * Variável de ambiente na Vercel: APPS_SCRIPT_WEB_APP_URL = URL completa da implantação (/exec)
 */
export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Use POST" });
  }

  const url = process.env.APPS_SCRIPT_WEB_APP_URL;
  if (!url) {
    return res.status(500).json({
      ok: false,
      error:
        "Configure APPS_SCRIPT_WEB_APP_URL nas variáveis de ambiente da Vercel",
    });
  }

  const body =
    typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});

  const r = await fetch(url, {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body,
  });

  const text = await r.text();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  return res.status(r.ok ? 200 : r.status).send(text);
}
