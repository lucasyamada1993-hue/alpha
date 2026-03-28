/**
 * Agrega respostas da pesquisa (SurveyResponse) para KPIs do dashboard.
 * Campos alinhados a surveyConfig.js / payload enviado em Survey.jsx.
 */

const POSITIVE = new Set(["Ótimo", "Bom"]);

const AGENDAMENTO_KEYS = ["agendamento_claro", "agendamento_informacoes", "agendamento_duvidas"];
/** Mapeado à etapa Preparo (acolhimento / recepção) */
const RECEPCAO_KEYS = ["preparo_instrucoes", "preparo_orientacoes_risco", "preparo_acolhimento"];
const EQUIPE_KEYS = ["exame_tempo_espera", "exame_empatia_equipe", "exame_explicacoes", "exame_seguranca"];

function monthKeyFromDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Últimos 12 meses (mais antigo → mais recente), mesmo formato YYYY-MM */
export function getLast12MonthKeys() {
  const out = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(monthKeyFromDate(d));
  }
  return out;
}

const MESES_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function monthKeyToLabel(key) {
  const [y, m] = key.split("-");
  const mi = parseInt(m, 10) - 1;
  if (mi < 0 || mi > 11) return key;
  return `${MESES_PT[mi]}/${y.slice(2)}`;
}

export function parseRespondentDate(row) {
  const raw =
    row.created_at ??
    row.createdAt ??
    row.Data_Hora ??
    row.data_hora ??
    row.timestamp ??
    row.data;
  if (raw == null || raw === "") return null;
  if (raw instanceof Date) return Number.isNaN(+raw) ? null : raw;
  const parsed = new Date(raw);
  return Number.isNaN(+parsed) ? null : parsed;
}

/** NPS clássico: % promotores (9–10) − % detratores (0–6), −100 … +100 */
export function npsFromScores(scores) {
  const valid = scores.filter((n) => typeof n === "number" && !Number.isNaN(n) && n >= 0 && n <= 10);
  if (!valid.length) return null;
  const n = valid.length;
  const promoters = (valid.filter((s) => s >= 9).length / n) * 100;
  const detractors = (valid.filter((s) => s <= 6).length / n) * 100;
  return Math.round(promoters - detractors);
}

function npsFromRows(rows) {
  const scores = rows.map((r) => Number(r.nps_recomendacao));
  return npsFromScores(scores);
}

/** % médio de respostas Ótimo/Bom entre as chaves informadas (por respondente, depois média do grupo) */
function avgPositivePct(rows, keys) {
  if (!rows.length) return null;
  const vals = [];
  for (const row of rows) {
    let ok = 0;
    let count = 0;
    for (const k of keys) {
      const v = row[k];
      if (v == null || v === "") continue;
      count += 1;
      if (POSITIVE.has(String(v))) ok += 1;
    }
    if (count === 0) continue;
    vals.push((ok / count) * 100);
  }
  if (!vals.length) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function forwardFill(arr) {
  let last = null;
  return arr.map((v) => {
    if (v != null && !Number.isNaN(v)) {
      last = v;
      return v;
    }
    return last;
  });
}

/** Preenche nulos no início/fim repetindo o vizinho mais próximo */
function fillTemporal(arr) {
  const fw = forwardFill(arr);
  const rev = forwardFill([...fw].reverse());
  return rev.reverse();
}

/**
 * @param {object[]} rows - retorno de SurveyResponse.list/filter
 * @returns {null | {
 *   monthKeys: string[],
 *   monthLabels: string[],
 *   historicoNPS: number[],
 *   historicoCsatAgendamento: number[],
 *   historicoCsatRecepcao: number[],
 *   historicoCsatEquipe: number[],
 *   responseCount: number,
 *   datedCount: number
 * }}
 */
export function buildSurveyDashboardSeries(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const monthKeys = getLast12MonthKeys();
  const monthLabels = monthKeys.map(monthKeyToLabel);

  const byMonth = new Map();
  for (const k of monthKeys) byMonth.set(k, []);

  let datedCount = 0;
  for (const row of rows) {
    const d = parseRespondentDate(row);
    if (d) {
      datedCount += 1;
      const mk = monthKeyFromDate(d);
      if (byMonth.has(mk)) byMonth.get(mk).push(row);
      else {
        // Fora da janela de 12 meses: ignora para séries mensais
      }
    }
  }

  const buildSeries = (picker) =>
    monthKeys.map((mk) => {
      const bucket = byMonth.get(mk) || [];
      const v = picker(bucket);
      return v;
    });

  let historicoNPS = buildSeries((bucket) => npsFromRows(bucket));
  let historicoCsatAgendamento = buildSeries((bucket) => avgPositivePct(bucket, AGENDAMENTO_KEYS));
  let historicoCsatRecepcao = buildSeries((bucket) => avgPositivePct(bucket, RECEPCAO_KEYS));
  let historicoCsatEquipe = buildSeries((bucket) => avgPositivePct(bucket, EQUIPE_KEYS));

  if (datedCount === 0) {
    const all = rows;
    const flatNps = npsFromRows(all);
    const flatA = avgPositivePct(all, AGENDAMENTO_KEYS);
    const flatR = avgPositivePct(all, RECEPCAO_KEYS);
    const flatE = avgPositivePct(all, EQUIPE_KEYS);
    historicoNPS = monthKeys.map(() => flatNps);
    historicoCsatAgendamento = monthKeys.map(() => flatA);
    historicoCsatRecepcao = monthKeys.map(() => flatR);
    historicoCsatEquipe = monthKeys.map(() => flatE);
  } else {
    historicoNPS = fillTemporal(historicoNPS);
    historicoCsatAgendamento = fillTemporal(historicoCsatAgendamento);
    historicoCsatRecepcao = fillTemporal(historicoCsatRecepcao);
    historicoCsatEquipe = fillTemporal(historicoCsatEquipe);
  }

  return {
    monthKeys,
    monthLabels,
    historicoNPS,
    historicoCsatAgendamento,
    historicoCsatRecepcao,
    historicoCsatEquipe,
    responseCount: rows.length,
    datedCount,
  };
}
