// Dados históricos simulados — 12 meses (Mar/25 → Mar/26)
export const MESES = ["Mar/25","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez","Jan/26","Fev","Mar"];

// 1. Experiência do Paciente
export const historicoNPS = [58, 61, 59, 63, 67, 65, 70, 72, 68, 74, 71, 73, 76];
export const historicoCsatAgendamento = [82, 84, 83, 85, 87, 86, 88, 90, 89, 91, 90, 92, 93];
export const historicoCsatRecepcao   = [78, 79, 80, 81, 83, 82, 84, 85, 84, 86, 85, 87, 88];
export const historicoCsatEquipe     = [88, 89, 90, 91, 92, 91, 93, 94, 93, 95, 94, 95, 96];

// 2. TAT / Eficiência Operacional
export const historicoTATEspera      = [18, 17, 19, 16, 15, 17, 14, 13, 15, 12, 14, 13, 12]; // min
export const historicoTATPreliminar  = [42, 40, 43, 38, 37, 39, 36, 35, 37, 34, 36, 33, 32]; // min
export const historicoTATValidacao   = [85, 88, 90, 82, 80, 84, 78, 76, 80, 74, 77, 72, 70]; // min
export const historicoOcupacaoRM     = [71, 73, 70, 74, 76, 75, 78, 79, 77, 81, 80, 82, 83]; // %
export const historicoOcupacaoTC     = [68, 70, 67, 72, 73, 71, 75, 76, 74, 78, 77, 79, 80]; // %

// 3. Qualidade Assistencial
export const historicoRefacao        = [5.2, 4.9, 5.1, 4.7, 4.5, 4.8, 4.3, 4.1, 4.4, 3.9, 4.2, 3.8, 3.6]; // %
export const historicoTimeOut        = [78, 80, 82, 84, 85, 86, 88, 89, 91, 92, 93, 94, 95]; // %
export const historicoIncidentes     = [3, 2, 4, 2, 3, 2, 1, 2, 1, 1, 2, 1, 1]; // qtd
export const historicoConformidade   = [72, 74, 75, 77, 79, 80, 82, 84, 83, 86, 87, 88, 90]; // %

// 4. Infraestrutura
export const historicoUptimeRM       = [95.2, 96.1, 94.8, 96.5, 97.0, 96.8, 97.3, 97.8, 97.1, 98.0, 97.6, 98.2, 98.5]; // %
export const historicoUptimeTC       = [93.5, 94.2, 92.8, 95.0, 95.5, 94.9, 96.1, 96.7, 95.8, 97.0, 96.4, 97.3, 97.8]; // %
export const historicoManutencao     = [80, 83, 78, 85, 86, 84, 88, 90, 87, 92, 91, 93, 94]; // %

// Helpers
export function last(arr) { return arr[arr.length - 1]; }
export function prev(arr) { return arr[arr.length - 2]; }
/** Último valor numérico válido (séries da API podem ter lacunas) */
export function safeLast(arr) {
  if (!arr?.length) return null;
  for (let i = arr.length - 1; i >= 0; i--) {
    const v = arr[i];
    if (v != null && !Number.isNaN(v)) return v;
  }
  return null;
}
export function delta(arr) {
  const a = safeLast(arr);
  const b = arr.length >= 2 ? safeLast(arr.slice(0, -1)) : null;
  if (a == null || b == null) return undefined;
  const d = a - b;
  return { value: Math.abs(d).toFixed(1), up: d >= 0 };
}