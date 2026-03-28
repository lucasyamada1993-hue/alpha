import { useState } from "react";
import { X, FileText } from "lucide-react";
import { db } from "@/api/sheetsClient";

const TIPOS = ["Não Conformidade", "Oportunidade de Melhoria", "Evento Adverso", "Near Miss"];
const PRIORIDADES = ["Alta", "Média", "Baixa"];
const DONOS = ["Coordenador de Qualidade", "Técnico Responsável", "Gerente de Operações", "Engenheiro Clínico", "Dir. Técnica", "Outro"];

export default function A3CreateModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ titulo: "", dono: DONOS[0], tipo: TIPOS[0], prioridade: "Alta", pop_referencia: "", origem: "", prazo_conclusao: "" });
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.titulo.trim()) { setErro("O título é obrigatório."); return; }
    if (!form.dono.trim()) { setErro("O responsável é obrigatório."); return; }
    setSaving(true);
    const novo = await db.entities.A3Relatorio.create({ ...form, status_pdca: "PLAN", deleted: false });
    onCreated(novo);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0D47A1] flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-sm">Novo Relatório A3</h2>
              <p className="text-xs text-gray-400">Iniciará na fase PLAN do ciclo PDCA</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {erro && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{erro}</p>}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Título do Problema *</label>
            <input type="text" value={form.titulo} onChange={(e) => set("titulo", e.target.value)}
              placeholder="Ex: Alta taxa de refação em tomografias"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tipo *</label>
              <select value={form.tipo} onChange={(e) => set("tipo", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all">
                {TIPOS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Prioridade</label>
              <select value={form.prioridade} onChange={(e) => set("prioridade", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all">
                {PRIORIDADES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Responsável (Dono) *</label>
              <select value={form.dono} onChange={(e) => set("dono", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all">
                {DONOS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Prazo Alvo</label>
              <input type="date" value={form.prazo_conclusao} onChange={(e) => set("prazo_conclusao", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">POP Relacionado</label>
              <input type="text" value={form.pop_referencia} onChange={(e) => set("pop_referencia", e.target.value)}
                placeholder="Ex: POP-TC-001"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Origem</label>
              <input type="text" value={form.origem} onChange={(e) => set("origem", e.target.value)}
                placeholder="Ex: Auditoria interna"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
            </div>
          </div>
        </div>

        <div className="px-6 pb-5 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">Cancelar</button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex items-center gap-2 bg-[#0D47A1] hover:bg-[#0B3D91] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm shadow-blue-200 disabled:opacity-50">
            {saving ? "Criando..." : "Criar A3 e iniciar PLAN →"}
          </button>
        </div>
      </div>
    </div>
  );
}