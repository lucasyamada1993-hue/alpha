/**
 * Cliente HTTP para Google Apps Script (planilha como banco).
 * URL: VITE_SHEETS_API_URL (ex.: /api/sheets na Vercel ou URL completa do Web App).
 */

const API_URL = import.meta.env.VITE_SHEETS_API_URL || "/api/sheets";

async function post(body) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(text || `HTTP ${res.status}`);
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
