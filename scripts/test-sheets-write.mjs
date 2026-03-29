/**
 * Testa se o Web App do Apps Script grava na aba SurveyResponse.
 * Uso: npm run test:sheets
 * Requer APPS_SCRIPT_WEB_APP_URL no .env (URL /exec) ou na variável de ambiente.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadDotEnv() {
  const p = resolve(process.cwd(), ".env");
  if (!existsSync(p)) return {};
  const out = {};
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const env = { ...loadDotEnv(), ...process.env };
const url = env.APPS_SCRIPT_WEB_APP_URL?.trim();

if (!url) {
  console.error(
    "Defina APPS_SCRIPT_WEB_APP_URL no .env (URL completa do Web App, terminando em /exec)."
  );
  process.exit(1);
}

const payload = {
  action: "entity",
  entity: "SurveyResponse",
  method: "create",
  data: {
    tipo_atendimento: "Teste script",
    perfil_respondente: "Paciente",
    nps_recomendacao: 10,
    comentarios_finais: `[test:sheets] ${new Date().toISOString()} — pode apagar esta linha.`,
    _origem_teste: "scripts/test-sheets-write.mjs",
  },
};

console.log("POST →", url.replace(/\/exec.*$/, "/exec…"));

const res = await fetch(url, {
  method: "POST",
  redirect: "follow",
  headers: { "Content-Type": "application/json;charset=utf-8" },
  body: JSON.stringify(payload),
});

const text = await res.text();
let json;
try {
  json = JSON.parse(text);
} catch {
  console.error("Resposta não é JSON:", text.slice(0, 500));
  process.exit(1);
}

if (!res.ok || json.ok === false) {
  console.error("Falha:", json.error || json.message || res.status, json);
  process.exit(1);
}

console.log("OK — API respondeu:", JSON.stringify(json, null, 2));
console.log(
  "\nAbra a planilha → aba SurveyResponse → deve aparecer uma nova linha com payload_json contendo o teste."
);
