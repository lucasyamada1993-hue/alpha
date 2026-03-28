import { BookOpen, FilePlus } from "lucide-react";

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

export default function FaseAct({ data, onChange }) {
  return (
    <div className="space-y-5">
      {/* Lições Aprendidas e Padronização */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-6 rounded-full bg-emerald-500" />
          <h3 className="font-bold text-gray-800">Padronização & Lições Aprendidas</h3>
        </div>
        <Field label="Lições Aprendidas" value={data.act_licoes_aprendidas || ""} onChange={(v) => onChange("act_licoes_aprendidas", v)}
          multiline placeholder="O que aprendemos? O que deve ser compartilhado com toda a equipe?" required />
        <Field label="O que foi padronizado / alterado nos processos?" value={data.act_padronizacao || ""} onChange={(v) => onChange("act_padronizacao", v)}
          multiline placeholder="Descreva as mudanças permanentes incorporadas no processo, protocolo ou rotina..." required />
      </div>

      {/* Vinculação ao POP */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 rounded-full bg-emerald-500" />
          <div>
            <h3 className="font-bold text-gray-800">Vinculação ao POP</h3>
            <p className="text-xs text-gray-400 mt-0.5">Registre o POP que foi criado ou atualizado como resultado deste A3</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vincular POP existente */}
          <div
            onClick={() => onChange("act_criar_novo_pop", false)}
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${data.act_criar_novo_pop === false || data.act_criar_novo_pop === undefined ? "border-emerald-400 bg-emerald-50" : "border-gray-100 bg-white hover:border-emerald-200"}`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className={`w-5 h-5 ${data.act_criar_novo_pop === false || data.act_criar_novo_pop === undefined ? "text-emerald-600" : "text-gray-300"}`} />
              <div>
                <p className={`font-bold text-sm ${data.act_criar_novo_pop === false || data.act_criar_novo_pop === undefined ? "text-emerald-700" : "text-gray-400"}`}>Atualizar POP Existente</p>
                <p className="text-xs text-gray-400">Um POP já existe e foi atualizado</p>
              </div>
            </div>
          </div>

          {/* Criar novo POP */}
          <div
            onClick={() => onChange("act_criar_novo_pop", true)}
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${data.act_criar_novo_pop === true ? "border-blue-400 bg-blue-50" : "border-gray-100 bg-white hover:border-blue-200"}`}
          >
            <div className="flex items-center gap-3">
              <FilePlus className={`w-5 h-5 ${data.act_criar_novo_pop === true ? "text-blue-600" : "text-gray-300"}`} />
              <div>
                <p className={`font-bold text-sm ${data.act_criar_novo_pop === true ? "text-blue-700" : "text-gray-400"}`}>Criar Novo POP</p>
                <p className="text-xs text-gray-400">Este A3 origina um novo procedimento</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Field
            label={data.act_criar_novo_pop ? "Código / Título do Novo POP a Criar" : "Código do POP Atualizado"}
            value={data.act_pop_vinculado || ""}
            onChange={(v) => onChange("act_pop_vinculado", v)}
            placeholder={data.act_criar_novo_pop ? "Ex: POP-TC-008 — Novo protocolo de triagem" : "Ex: POP-TC-001 — atualizado em 28/03/2026"}
          />
        </div>
      </div>

      {/* Resumo Final */}
      <div className="bg-gradient-to-br from-[#0D47A1]/5 to-emerald-50 border border-emerald-200 rounded-xl p-5">
        <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">✓ Fase ACT Concluída</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Após salvar, este A3 poderá ser marcado como <strong>Concluído</strong>. O relatório ficará disponível na trilha de auditoria ONA/ISO 9001 com toda a rastreabilidade de fases, responsáveis e datas.
        </p>
      </div>
    </div>
  );
}