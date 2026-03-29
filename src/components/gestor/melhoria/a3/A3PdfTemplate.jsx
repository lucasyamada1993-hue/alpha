import {
  Search,
  BarChart3,
  Target,
  GitBranch,
  Lightbulb,
  ListChecks,
  LineChart,
} from "lucide-react";

const FONT = "'Montserrat', system-ui, sans-serif";

/** Cores dos passos (pílulas): 1–7 */
const STEP_THEME = [
  { bg: "#1e3a5f", badge: "#3b82f6", letter: "P" },
  { bg: "#0f766e", badge: "#14b8a6", letter: "D" },
  { bg: "#166534", badge: "#22c55e", letter: "3" },
  { bg: "#14532d", badge: "#4ade80", letter: "4" },
  { bg: "#a16207", badge: "#eab308", letter: "C" },
  { bg: "#92400e", badge: "#d97706", letter: "6" },
  { bg: "#374151", badge: "#6b7280", letter: "7" },
];

function buildFutureState(data) {
  const parts = [];
  if (data.act_padronizacao?.trim()) {
    parts.push(`Padronização:\n${data.act_padronizacao.trim()}`);
  }
  if (data.check_resultados?.trim()) {
    parts.push(`Resultados:\n${data.check_resultados.trim()}`);
  }
  if (data.act_licoes_aprendidas?.trim()) {
    parts.push(`Lições aprendidas:\n${data.act_licoes_aprendidas.trim()}`);
  }
  if (parts.length) return parts.join("\n\n");
  if (data.plan_meta?.trim()) return `Meta definida: ${data.plan_meta.trim()}`;
  return "—";
}

function formatQuando(v) {
  if (!v || typeof v !== "string") return "—";
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) {
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d.toLocaleDateString("pt-BR");
  }
  return v;
}

const ISHIKAWA_KEYS = [
  { key: "mao_de_obra", label: "Mão de obra" },
  { key: "maquina", label: "Máquina" },
  { key: "metodo", label: "Método" },
  { key: "material", label: "Material" },
  { key: "medicao", label: "Medição" },
  { key: "meio_ambiente", label: "Meio ambiente" },
];

function hasIshikawaData(raw) {
  if (!raw || typeof raw !== "object") return false;
  return ISHIKAWA_KEYS.some(({ key }) => {
    const arr = raw[key];
    return Array.isArray(arr) && arr.some((s) => String(s ?? "").trim());
  });
}

/** Semiarco 0–100% — SVG puro (compatível com html2canvas). */
function SvgGauge({ pct, label, sub, color = "#1e40af" }) {
  const size = 62;
  const r = 22;
  const cx = size / 2;
  const cy = size / 2 + 2;
  const arcLen = Math.PI * r;
  const dash = Math.max(0, Math.min(100, pct)) / 100;

  return (
    <div style={{ textAlign: "center", fontFamily: FONT }}>
      <svg width={size} height={size - 4} viewBox={`0 0 ${size} ${size - 4}`} aria-hidden>
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${dash * arcLen} ${arcLen}`}
        />
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" fontFamily={FONT}>
          {Math.round(pct)}%
        </text>
      </svg>
      {label && (
        <div style={{ fontSize: "7px", fontWeight: 600, color: "#475569", marginTop: "-4px" }}>{label}</div>
      )}
      {sub && (
        <div style={{ fontSize: "6px", color: "#94a3b8" }}>{sub}</div>
      )}
    </div>
  );
}

function MiniBars({ active }) {
  const heights = active ? [42, 58, 72, 88] : [28, 32, 35, 30];
  return (
    <svg width="72" height="40" viewBox="0 0 72 40" aria-hidden>
      {heights.map((h, i) => (
        <rect
          key={i}
          x={4 + i * 17}
          y={36 - (h / 100) * 32}
          width="12"
          height={(h / 100) * 32}
          rx="2"
          fill={i >= 2 ? "#1e40af" : "#cbd5e1"}
        />
      ))}
    </svg>
  );
}

function IshikawaDiagram({ planIshikawa }) {
  const spineY = 58;
  const spineX0 = 28;
  const spineX1 = 380;
  const points = [75, 135, 195, 255, 315, 365];

  return (
    <svg viewBox="0 0 400 128" style={{ width: "100%", height: 118, display: "block" }} aria-hidden>
      <line x1={spineX0} y1={spineY} x2={spineX1} y1={spineY} stroke="#94a3b8" strokeWidth="2" />
      <polygon points={`${spineX1},${spineY - 6} ${spineX1 + 18},${spineY} ${spineX1},${spineY + 6}`} fill="#64748b" />
      {ISHIKAWA_KEYS.map(({ key, label }, i) => {
        const sx = points[i];
        const up = i % 2 === 0;
        const ex = sx + (up ? -8 : 8);
        const ey = up ? 22 : 94;
        const tx = sx + (up ? -36 : -28);
        const ty = up ? 14 : 108;
        const items = Array.isArray(planIshikawa[key]) ? planIshikawa[key].filter((s) => String(s ?? "").trim()) : [];
        let preview = items.slice(0, 2).join(" · ") || "—";
        if (preview.length > 52) preview = `${preview.slice(0, 49)}…`;

        return (
          <g key={key}>
            <line x1={sx} y1={spineY} x2={ex} y2={ey} stroke="#cbd5e1" strokeWidth="1.5" />
            <text x={tx} y={ty} fontSize="7" fontWeight="700" fill="#14532d" fontFamily="Arial, sans-serif">
              {label}
            </text>
            <text
              x={tx}
              y={up ? ty + 9 : ty - 6}
              fontSize="6"
              fill="#475569"
              fontFamily="Arial, sans-serif"
            >
              {preview}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function statusPillStyle(raw) {
  const s = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (s.includes("conclu") || s === "feito" || s === "done") {
    return { backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #86efac" };
  }
  if (s.includes("andament") || s.includes("progress") || s === "em andamento") {
    return { backgroundColor: "#fef9c3", color: "#854d0e", border: "1px solid #fde047" };
  }
  if (s.includes("pend") || s.includes("abert") || s === "todo") {
    return { backgroundColor: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1" };
  }
  return { backgroundColor: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" };
}

function FlowArrow() {
  return (
    <div
      style={{
        flexShrink: 0,
        alignSelf: "center",
        color: "#94a3b8",
        fontSize: "11px",
        fontWeight: 600,
        lineHeight: 1,
        padding: "2px 0",
        fontFamily: FONT,
      }}
      aria-hidden
    >
      ↓
    </div>
  );
}

function StepPill({ stepIndex, title, icon: Icon }) {
  const t = STEP_THEME[stepIndex] ?? STEP_THEME[0];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          backgroundColor: t.badge,
          color: "#fff",
          fontSize: "10px",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT,
          flexShrink: 0,
        }}
      >
        {t.letter}
      </span>
      <span
        style={{
          flex: 1,
          backgroundColor: t.bg,
          color: "#fff",
          fontSize: "8px",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          padding: "5px 10px",
          borderRadius: 999,
          fontFamily: FONT,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {Icon && (
          <Icon size={12} strokeWidth={2.5} color="#ffffff" style={{ flexShrink: 0, opacity: 0.95 }} />
        )}
        <span style={{ lineHeight: 1.2 }}>{title}</span>
      </span>
    </div>
  );
}

function Card({ children, flex }) {
  return (
    <div
      style={{
        borderRadius: 12,
        boxShadow: "0 2px 10px rgba(15, 23, 42, 0.07)",
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        flex: flex ?? "1 1 0",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

const textStyle = {
  fontSize: "8.5px",
  lineHeight: 1.4,
  color: "#1e293b",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  fontFamily: FONT,
  margin: 0,
};

export default function A3PdfTemplate({ data }) {
  const porques = Array.isArray(data.plan_5porques) ? data.plan_5porques : [];
  const acoes = Array.isArray(data.do_acoes_5w2h) ? data.do_acoes_5w2h : [];
  const planIshikawa = data.plan_ishikawa && typeof data.plan_ishikawa === "object" ? data.plan_ishikawa : {};
  const showFishbone = hasIshikawaData(planIshikawa);

  const problema =
    [data.titulo, data.plan_contexto?.trim() && `\n\n${data.plan_contexto.trim()}`]
      .filter(Boolean)
      .join("") || "—";

  let eficacia = "—";
  if (data.check_eficaz === true) eficacia = "Sim — ações eficazes.";
  else if (data.check_eficaz === false) eficacia = "Não — ajustes necessários.";

  const pdcaLabel = data.status_pdca ? `PDCA / ${data.status_pdca}` : "PDCA";

  const g1 = data.check_eficaz === true ? 85 : data.check_eficaz === false ? 42 : 62;
  const g2 = data.check_eficaz === true ? 78 : data.check_eficaz === false ? 38 : 55;
  const g3 = data.check_eficaz === true ? 72 : data.check_eficaz === false ? 35 : 48;
  const barsActive = !!(data.check_indicadores?.trim() || data.check_resultados?.trim());

  const outer = {
    position: "fixed",
    left: "-12000px",
    top: "0",
    width: "1200px",
    height: "848px",
    backgroundColor: "#eef2f7",
    boxSizing: "border-box",
    fontFamily: FONT,
    color: "#1e293b",
    zIndex: -1,
    padding: "14px 16px 16px",
  };

  const banner = {
    background: "linear-gradient(135deg, #0f2847 0%, #1e3a5f 55%, #1e40af 100%)",
    borderRadius: 12,
    padding: "14px 18px",
    marginBottom: 12,
    boxShadow: "0 4px 14px rgba(15, 40, 71, 0.35)",
  };

  const col = {
    flex: "1 1 50%",
    display: "flex",
    flexDirection: "column",
    gap: 0,
    minWidth: 0,
    minHeight: 0,
  };

  return (
    <div id="a3-pdf-template" style={outer}>
      <div style={banner}>
        <div style={{ fontSize: "20px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          {data.titulo || "Relatório A3"}
        </div>
        <div style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.88)", marginTop: 8, fontWeight: 500 }}>
          ID: {data.id ?? "—"} · Dono: {data.dono ?? "—"} · {pdcaLabel}
          {data.pop_referencia ? ` · POP: ${data.pop_referencia}` : ""}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", flex: "1 1 0", minHeight: 0, gap: 12, height: "calc(100% - 108px)" }}>
        {/* Coluna esquerda 1–4 */}
        <div style={col}>
          <Card flex="1 1 0">
            <StepPill stepIndex={0} title="Definição do problema" icon={Search} />
            <p style={textStyle}>{problema}</p>
          </Card>
          <FlowArrow />
          <Card flex="1 1 0">
            <StepPill stepIndex={1} title="Situação atual" icon={BarChart3} />
            <p style={textStyle}>{data.plan_condicao_atual?.trim() || "—"}</p>
          </Card>
          <FlowArrow />
          <Card flex="0.85 1 0">
            <StepPill stepIndex={2} title="Objetivo / meta" icon={Target} />
            <p style={textStyle}>{data.plan_meta?.trim() || "—"}</p>
          </Card>
          <FlowArrow />
          <Card flex="1.35 1 0">
            <StepPill stepIndex={3} title="Análise da causa raiz" icon={GitBranch} />
            {showFishbone ? (
              <div style={{ marginTop: 4 }}>
                <IshikawaDiagram planIshikawa={planIshikawa} />
              </div>
            ) : (
              <>
                {data.plan_causa_raiz?.trim() && (
                  <p style={{ ...textStyle, marginBottom: 8 }}>{data.plan_causa_raiz.trim()}</p>
                )}
                {porques.length > 0 && (
                  <ol style={{ ...textStyle, margin: "0 0 0 14px", padding: 0 }}>
                    {porques.map((p, i) => (
                      <li key={i} style={{ marginBottom: "4px" }}>
                        {p.pergunta ? `${p.pergunta} ` : ""}
                        {p.resposta ? <strong>{p.resposta}</strong> : "—"}
                      </li>
                    ))}
                  </ol>
                )}
                {!data.plan_causa_raiz?.trim() && porques.length === 0 && <p style={textStyle}>—</p>}
              </>
            )}
          </Card>
        </div>

        {/* Coluna direita 5–7 */}
        <div style={col}>
          <Card flex="1 1 0">
            <StepPill stepIndex={4} title="Proposta de melhoria / situação futura" icon={Lightbulb} />
            <p style={textStyle}>{buildFutureState(data)}</p>
          </Card>
          <FlowArrow />
          <Card flex="1.15 1 0">
            <StepPill stepIndex={5} title="Plano de ação (5W2H)" icon={ListChecks} />
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                fontSize: "8px",
                fontFamily: FONT,
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid #e2e8f0",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#e2e8f0" }}>
                  {["Ação", "Responsável", "Data", "Status"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "5px 6px",
                        textAlign: "left",
                        fontWeight: 700,
                        color: "#334155",
                        borderBottom: "1px solid #cbd5e1",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {acoes.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "8px", color: "#94a3b8", backgroundColor: "#fff" }}>
                      —
                    </td>
                  </tr>
                ) : (
                  acoes.map((a, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                      <td style={{ padding: "5px 6px", verticalAlign: "top", borderBottom: "1px solid #f1f5f9" }}>
                        {a.o_que?.trim() || "—"}
                      </td>
                      <td style={{ padding: "5px 6px", verticalAlign: "top", borderBottom: "1px solid #f1f5f9" }}>
                        {a.quem?.trim() || "—"}
                      </td>
                      <td style={{ padding: "5px 6px", verticalAlign: "top", borderBottom: "1px solid #f1f5f9" }}>
                        {formatQuando(a.quando)}
                      </td>
                      <td style={{ padding: "5px 6px", verticalAlign: "top", borderBottom: "1px solid #f1f5f9" }}>
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: "7px",
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 999,
                            fontFamily: FONT,
                            ...statusPillStyle(a.status),
                          }}
                        >
                          {a.status?.trim() || "—"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
          <FlowArrow />
          <Card flex="1 1 0">
            <StepPill stepIndex={6} title="Indicadores e resultados" icon={LineChart} />
            <div style={{ display: "flex", flexDirection: "row", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
              <SvgGauge pct={g1} label="Indicador A" sub="meta" />
              <SvgGauge pct={g2} label="Indicador B" sub="processo" color="#0d9488" />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <SvgGauge pct={g3} label="RSP" sub="consolidado" color="#7c3aed" />
              </div>
              <div style={{ marginLeft: 4 }}>
                <MiniBars active={barsActive} />
                <div style={{ fontSize: "6.5px", color: "#64748b", marginTop: 4, fontFamily: FONT }}>Evolução</div>
              </div>
            </div>
            <p style={{ ...textStyle, marginTop: 10, fontSize: "8px" }}>
              {data.check_resultados?.trim() && (
                <>
                  <strong style={{ color: "#334155" }}>Resultados:</strong>
                  {"\n"}
                  {data.check_resultados.trim()}
                  {"\n\n"}
                </>
              )}
              {data.check_indicadores?.trim() && (
                <>
                  <strong style={{ color: "#334155" }}>Indicadores:</strong>
                  {"\n"}
                  {data.check_indicadores.trim()}
                  {"\n\n"}
                </>
              )}
              <strong style={{ color: "#334155" }}>Eficácia:</strong> {eficacia}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
