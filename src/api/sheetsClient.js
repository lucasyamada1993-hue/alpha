/**
 * Cliente HTTP para Google Apps Script (planilha como banco).
 * URL: VITE_SHEETS_API_URL (ex.: /api/sheets na Vercel ou URL completa do Web App).
 */

function resolveSheetsApiUrl() {
  const raw = (import.meta.env.VITE_SHEETS_API_URL || "/api/sheets").trim();
  /** No dev, URL direta do Web App → CORS no navegador; força proxy local. */
  if (
    import.meta.env.DEV &&
    /^https?:\/\//i.test(raw) &&
    (raw.includes("script.google.com") || raw.includes("google.com/macros"))
  ) {
    console.info(
      "[sheetsClient] Evitando CORS: usando /api/sheets. Confirme APPS_SCRIPT_WEB_APP_URL no .env e reinicie o Vite."
    );
    return "/api/sheets";
  }
  return raw;
}

const API_URL = resolveSheetsApiUrl();

async function post(body) {
  let res;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (
      msg === "Failed to fetch" ||
      msg.includes("NetworkError") ||
      msg.includes("fetch")
    ) {
      throw new Error(
        "Sem resposta da API (rede ou CORS). Em desenvolvimento: no .env use VITE_SHEETS_API_URL=/api/sheets, APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/.../exec e reinicie npm run dev. Na Vercel, defina APPS_SCRIPT_WEB_APP_URL."
      );
    }
    throw e;
  }
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    const preview = text.slice(0, 160).trimStart();
    if (preview.startsWith("<!") || preview.toLowerCase().startsWith("<html")) {
      throw new Error(
        "A API retornou HTML em vez de JSON. Em desenvolvimento, defina APPS_SCRIPT_WEB_APP_URL no .env (proxy do Vite para /api/sheets). Em produção, confira Vercel e APPS_SCRIPT_WEB_APP_URL."
      );
    }
    throw new Error(text.slice(0, 200) || `HTTP ${res.status}`);
  }
  if (!res.ok) {
    throw new Error(data.error || data.message || `HTTP ${res.status}`);
  }
  if (data.ok === false) {
    throw new Error(data.error || data.message || "Erro na API");
  }
  return data.result !== undefined ? data.result : data;
}

function entityMethods(entityName) {
  return {
    list: () => post({ action: "entity", entity: entityName, method: "list" }),
    filter: (filterObj, sortField, limit) =>
      post({
        action: "entity",
        entity: entityName,
        method: "filter",
        filter: filterObj || {},
        sort: sortField,
        limit: limit ?? 500,
      }),
    create: (data) =>
      post({ action: "entity", entity: entityName, method: "create", data }),
    update: (id, data) =>
      post({ action: "entity", entity: entityName, method: "update", id, data }),
    delete: (id) =>
      post({ action: "entity", entity: entityName, method: "delete", id }),
  };
}

async function fileToBase64(file) {
  const buf = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const db = {
  entities: {
    GestorPerfil: entityMethods("GestorPerfil"),
    Funcionario: entityMethods("Funcionario"),
    EventoAdverso: entityMethods("EventoAdverso"),
    A3Relatorio: entityMethods("A3Relatorio"),
    PDITecnicoEnfermagem: entityMethods("PDITecnicoEnfermagem"),
    PDIEnfermeiro: entityMethods("PDIEnfermeiro"),
    SurveyResponse: entityMethods("SurveyResponse"),
  },

  integrations: {
    Core: {
      async UploadFile({ file }) {
        const base64 = await fileToBase64(file);
        return post({
          action: "uploadFile",
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          base64,
        });
      },

      async InvokeLLM(payload) {
        const raw = await post({ action: "invokeLLM", payload });
        const r = raw.response != null ? raw.response : raw;
        if (typeof r === "string") {
          try {
            return JSON.parse(r);
          } catch {
            return { texto_bruto: r };
          }
        }
        return r;
      },
    },
  },
};

export const sheetsClient = db;
