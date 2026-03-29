/**
 * Payload de create A3Relatorio alinhado ao Google Sheets (Code.gs / SHEET_HEADERS).
 */
export function buildA3CreatePayloadFromOrigin(origin, titulo, dono) {
  const t = (titulo || "").trim();
  const d = (dono || "").trim();

  const base = {
    titulo: t,
    dono: d,
    prioridade: "Alta",
    status_pdca: "PLAN",
    deleted: false,
    plan_ishikawa: {},
    plan_5porques: [{ pergunta: "Por que o problema ocorre?", resposta: "" }],
    do_acoes_5w2h: [],
    check_evidencias_urls: [],
  };

  if (!origin || origin.origin === "proativo" || !origin.incident) {
    return {
      ...base,
      tipo: "Oportunidade de Melhoria",
      origem: "Proativo",
      pop_referencia: "",
    };
  }

  const inc = origin.incident;
  const tipo = inc.tipo === "Evento Adverso" ? "Evento Adverso" : "Não Conformidade";
  const tituloFinal = t || String(inc.title || "").trim() || `A3 ${inc.id}`;

  return {
    ...base,
    titulo: tituloFinal,
    dono: d,
    tipo,
    origem: `${inc.id}: ${inc.title}`,
    pop_referencia: String(inc.id),
  };
}
