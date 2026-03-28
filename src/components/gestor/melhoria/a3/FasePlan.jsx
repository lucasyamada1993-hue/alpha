import { cn } from "@/lib/utils";
import { Plus, Trash2, Lightbulb } from "lucide-react";

const ISHIKAWA_CATS = [
  { key: "mao_de_obra", label: "Mão de Obra", color: "border-blue-400" },
  { key: "maquina", label: "Máquina / Equipamento", color: "border-red-400" },
  { key: "metodo", label: "Método", color: "border-amber-400" },
  { key: "material", label: "Material / Insumo", color: "border-emerald-400" },
  { key: "medicao", label: "Medição", color: "border-purple-400" },
  { key: "meio_ambiente", label: "Meio Ambiente", color: "border-gray-400" },
];

function Field({ label, value, onChange, multiline = false, placeholder, required = false }) {
  const cls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-gray-300";
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {multiline
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls} />
        : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  );
}

export default function FasePlan({ data, onChange }) {
  const ishikawa = data.plan_ishikawa || {};
  const porques = data.plan_5porques || [{ pergunta: "Por que o problema ocorre?", resposta: "" }];

  const setIsh = (cat, causas) => {
    onChange("plan_ishikawa", { ...ishikawa, [cat]: causas });
  };

  const addCausa = (cat) => {
    const atual = ishikawa[cat] || [];
    setIsh(cat, [...atual, ""]);
  };

  const setCausa = (cat, idx, val) => {
    const atual = [...(ishikawa[cat] || [])];
    atual[idx] = val;
    setIsh(cat, atual);
  };

  const removeCausa = (cat, idx) => {
    const atual = [...(ishikawa[cat] || [])];
    atual.splice(idx, 1);
    setIsh(cat, atual);
  };

  const setPorque = (idx, field, val) => {
    const arr = [...porques];
    arr[idx] = { ...arr[idx], [field]: val };
    onChange("plan_5porques", arr);
  };

  const addPorque = () => {
    if (porques.length >= 5) return;
    onChange("plan_5porques", [...porques, { pergunta: `Por que ${porques.at(-1)?.resposta || "..."}?`, resposta: "" }]);
  };

  const causaRaiz = porques.filter((p) => p.resposta.trim()).at(-1)?.resposta || "";

  return (
    <div className="space-y-5">
      {/* Contexto e Condição Atual */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-6 rounded-full bg-blue-500" />
          <h3 className="font-bold text-gray-800">Contexto & Condição Atual</h3>
        </div>
        <Field label="Contexto e Histórico" value={data.plan_contexto || ""} onChange={(v) => onChange("plan_contexto", v)}
          multiline placeholder="Descreva o contexto, histórico e relevância do problema..." required />
        <Field label="Condição Atual (com dados)" value={data.plan_condicao_atual || ""} onChange={(v) => onChange("plan_condicao_atual", v)}
          multiline placeholder="Ex: Taxa de refação em TC = 18% no último trimestre, meta é 5%..." required />
        <Field label="Meta / Condição Alvo" value={data.plan_meta || ""} onChange={(v) => onChange("plan_meta", v)}
          placeholder="Ex: Reduzir taxa de refação para < 5% em 90 dias" required />
      </div>

      {/* Diagrama de Ishikawa */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 rounded-full bg-red-400" />
          <div>
            <h3 className="font-bold text-gray-800">Diagrama de Ishikawa (Espinha de Peixe)</h3>
            <p className="text-xs text-gray-400 mt-0.5">Identifique as possíveis causas por categoria</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ISHIKAWA_CATS.map(({ key, label, color }) => {
            const causas = ishikawa[key] || [];
            return (
              <div key={key} className={cn("border-l-4 pl-4 py-2", color)}>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">{label}</p>
                <div className="space-y-1.5">
                  {causas.map((c, i) => (
                    <div key={i} className="flex gap-1.5">
                      <input
                        type="text"
                        value={c}
                        onChange={(e) => setCausa(key, i, e.target.value)}
                        placeholder="Descreva a causa..."
                        className="flex-1 border border-gray-200 rounded-md px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-400 transition-all"
                      />
                      <button onClick={() => removeCausa(key, i)} className="text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addCausa(key)}
                  className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Adicionar causa
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5 Porquês */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 rounded-full bg-amber-400" />
          <div>
            <h3 className="font-bold text-gray-800">Análise dos 5 Porquês</h3>
            <p className="text-xs text-gray-400 mt-0.5">Aprofunde para encontrar a causa raiz real</p>
          </div>
        </div>
        <div className="space-y-3">
          {porques.map((p, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-gray-100 rounded-xl p-3 bg-gray-50/50">
              <div>
                <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1 block">Porquê {i + 1} — Pergunta</label>
                <input type="text" value={p.pergunta} onChange={(e) => setPorque(i, "pergunta", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1 block">Resposta</label>
                <input type="text" value={p.resposta} onChange={(e) => setPorque(i, "resposta", e.target.value)}
                  placeholder="Responda para ir ao próximo..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" />
              </div>
            </div>
          ))}
        </div>
        {porques.length < 5 && (
          <button onClick={addPorque} disabled={!porques.at(-1)?.resposta?.trim()}
            className="mt-3 flex items-center gap-1.5 text-sm text-blue-600 hover:underline disabled:opacity-30 disabled:no-underline">
            <Plus className="w-3.5 h-3.5" /> Adicionar próximo porquê
          </button>
        )}
        {causaRaiz && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-0.5">Causa Raiz Identificada</p>
              <p className="text-sm text-amber-800 font-semibold">{causaRaiz}</p>
            </div>
          </div>
        )}
        <div className="mt-4">
          <Field label="Causa Raiz Consolidada" value={data.plan_causa_raiz || ""} onChange={(v) => onChange("plan_causa_raiz", v)}
            placeholder="Descreva a causa raiz final após a análise completa..." required />
        </div>
      </div>
    </div>
  );
}