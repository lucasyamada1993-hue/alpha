/**
 * Testa todas as abas do "banco" (entidades do Code.gs) com method: list.
 * Não grava dados — só verifica se a aba existe e a API responde.
 *
 * Uso: npm run test:sheets:all
 * Requer APPS_SCRIPT_WEB_APP_URL no .env (URL /exec).
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

/** Nomes de entidade = chaves de TAB em google-apps-script/Code.gs */
const ENTITIES = [
  "GestorPerfil",
  "Funcionario",
  "EventoAdverso",
  "A3Relatorio",
  "PDITecnicoEnfermagem",
  "PDIEnfermeiro",
  "SurveyResponse",
];

const env = { ...loadDotEnv(), ...process.env };
const url = env.APPS_SCRIPT_WEB_APP_URL?.trim();

if (!url) {
  console.error(
    "Defina APPS_SCRIPT_WEB_APP_URL no .env (URL completa do Web App, terminando em /exec)."
  );
  process.exit(1);
}

async function postEntity(entity, method, data) {
  const res = await fetch(url, {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "application/json;charset=utf-8" },
    body: JSON.stringify({
      action: "entity",
      entity,
      method,
      ...(data || {}),
    }),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, parseError: true, raw: text.slice(0, 300), status: res.status };
  }
  return { ok: res.ok && json.ok !== false, json, status: res.status };
}

console.log("GET (list) em cada aba →", url.replace(/\/exec.*$/, "/exec…\n"));

let failed = 0;
for (const entity of ENTITIES) {
  const r = await postEntity(entity, "list");
  if (r.parseError) {
    console.log(`  ✗ ${entity} — resposta não é JSON (HTTP ${r.status})`);
    console.log(`    ${r.raw}`);
    failed++;
    continue;
  }
  const { json } = r;
  if (!r.ok) {
    console.log(`  ✗ ${entity} — ${json.error || json.message || `HTTP ${r.status}`}`);
    failed++;
    continue;
  }
  const rows = json.result;
  if (!Array.isArray(rows)) {
    console.log(`  ✗ ${entity} — result não é array`);
    failed++;
    continue;
  }
  console.log(`  ✓ ${entity} — OK (${rows.length} linha(s) de dados)`);
}

if (failed > 0) {
  console.error(`\nFalhou em ${failed} aba(s). Confira nomes das abas e linha 1 = SHEET_HEADERS no Code.gs.`);
  process.exit(1);
}

console.log("\nTodas as abas responderam OK.");
