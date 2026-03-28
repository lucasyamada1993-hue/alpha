import { useState } from "react";
import { BookOpen, BadgeCheck, Plus, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "matriz", label: "Matriz de Treinamentos", icon: BookOpen },
  { id: "habilitacoes", label: "Habilitações & Vencimentos", icon: BadgeCheck },
];

const TREINAMENTOS = [
  { id: 1, nome: "Protocolo de Emergência e RCP", colaborador: "Carlos Lima", carga: "8h", data: "15/01/2026", validade: "15/01/2027", eficacia: "Aprovado (≥70%)", status: "vigente" },
  { id: 2, nome: "Protocolo de Emergência e RCP", colaborador: "Fernanda Melo", carga: "8h", data: "15/01/2026", validade: "15/01/2027", eficacia: "Aprovado (≥70%)", status: "vigente" },
  { id: 3, nome: "Operação Novo RM 3T — GE Healthcare", colaborador: "Carlos Lima", carga: "16h", data: "10/02/2026", validade: "10/02/2028", eficacia: "Certificado GE", status: "vigente" },
  { id: 4, nome: "Protocolo de Contraste IV", colaborador: "Fernanda Melo", carga: "4h", data: "20/03/2025", validade: "20/03/2026", eficacia: "Aprovado (≥70%)", status: "vencido" },
  { id: 5, nome: "LGPD e Segurança da Informação", colaborador: "Bruna Costa", carga: "4h", data: "05/03/2026", validade: "05/03/2027", eficacia: "Pendente avaliação", status: "pendente_avaliacao" },
];

const HABILITACOES = [
  { id: 1, profissional: "Dra. Ana Teixeira", conselho: "CRM-SP 123456", especialidade: "Radiologia e Diagnóstico por Imagem", validade: "31/12/2026", status: "vigente" },
  { id: 2, profissional: "Dr. Paulo Mendes", conselho: "CRM-SP 543210", especialidade: "Radiologia Intervencionista", validade: "31/12/2026", status: "vigente" },
  { id: 3, profissional: "Carlos Lima", conselho: "CRTR-SP 5678", especialidade: "Tecnólogo em Radiologia", validade: "30/06/2026", status: "vencendo" },
  { id: 4, profissional: "Fernanda Melo", conselho: "CRTR-SP 9012", especialidade: "Tecnólogo em Radiologia", validade: "31/12/2026", status: "vigente" },
  { id: 5, profissional: "Ricardo Neves", conselho: "CRTR-SP 3456", especialidade: "Tecnólogo em Radiologia", validade: "28/02/2026", status: "vencido" },
];

function StatusBadge({ status }) {
  const map = {
    vigente: "bg-emerald-50 text-emerald-700 border-emerald-200",
    vencido: "bg-red-50 text-red-700 border-red-200",
    vencendo: "bg-amber-50 text-amber-700 border-amber-200",
    pendente_avaliacao: "bg-blue-50 text-blue-700 border-blue-200",
  };
  const label = {
    vigente: "Vigente", vencido: "Vencido", vencendo: "Vencendo (< 90 dias)", pendente_avaliacao: "Pend. Avaliação",
  };
  return <span className={cn("inline-block px-2.5 py-1 rounded-full text-xs font-semibold border", map[status] || map.vigente)}>{label[status]}</span>;
}

export default function GestorTreinamentos() {
  const [activeTab, setActiveTab] = useState("matriz");

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Treinamentos Vigentes", value: "3/5", sub: "2 requerem atenção", color: "border-l-emerald-500" },
          { label: "Habilitações Vigentes", value: "3/5", sub: "1 vencida, 1 vencendo", color: "border-l-blue-500" },
          { label: "Vencimentos em 90 dias", value: "1", sub: "Carlos Lima — CRTR", color: "border-l-amber-500" },
          { label: "Alertas Críticos", value: "2", sub: "Ação imediata necessária", color: "border-l-red-500" },
        ].map((k) => (
          <div key={k.label} className={cn("bg-white rounded-xl p-4 border border-gray-100 border-l-4 shadow-sm", k.color)}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 leading-tight">{k.label}</p>
            <p className="text-2xl font-extrabold text-gray-800">{k.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Alerta */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Atenção: Ricardo Neves (CRTR-SP 3456) com habilitação vencida desde 28/02/2026.</p>
          <p className="text-xs text-amber-600 mt-0.5">Este profissional não pode operar equipamentos de radiologia até a renovação do registro.</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border",
              activeTab === id ? "bg-[#0D47A1] text-white border-[#0D47A1] shadow-md shadow-blue-200" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            )}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {activeTab === "matriz" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Matriz de Treinamentos da Equipe</h3>
              <p className="text-xs text-gray-400 mt-0.5">Presença, carga horária e eficácia dos treinamentos</p>
            </div>
            <button className="flex items-center gap-1.5 bg-[#0D47A1] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#0B3D91] transition-colors">
              <Plus className="w-3.5 h-3.5" /> Registrar Treinamento
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Treinamento</th>
                <th className="px-4 py-3 text-left">Colaborador</th>
                <th className="px-4 py-3 text-left">Carga</th>
                <th className="px-4 py-3 text-left">Realizado em</th>
                <th className="px-4 py-3 text-left">Válido até</th>
                <th className="px-4 py-3 text-left">Eficácia</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr></thead>
              <tbody>
                {TREINAMENTOS.map((r) => {
                  const rowColor = r.status === "vigente" ? "bg-emerald-50" : r.status === "vencido" ? "bg-red-50" : r.status === "vencendo" ? "bg-amber-50" : "bg-blue-50";
                  return (
                  <tr key={r.id} className={cn("border-t border-gray-50 hover:opacity-90 transition-colors", rowColor)}>
                    <td className="px-4 py-3 font-medium text-gray-700 text-sm max-w-[200px] leading-snug">{r.nome}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.colaborador}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.carga}</td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-400">{r.data}</td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-400">{r.validade}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.eficacia}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "habilitacoes" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Controle de Habilitações Profissionais</h3>
              <p className="text-xs text-gray-400 mt-0.5">CRM (médicos) e CRTR (tecnólogos/técnicos) — alertas de vencimento</p>
            </div>
            <button className="flex items-center gap-1.5 bg-[#0D47A1] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#0B3D91] transition-colors">
              <Plus className="w-3.5 h-3.5" /> Adicionar Habilitação
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Profissional</th>
                <th className="px-4 py-3 text-left">Conselho / Registro</th>
                <th className="px-4 py-3 text-left">Especialidade</th>
                <th className="px-4 py-3 text-left">Válido até</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr></thead>
              <tbody>
                {HABILITACOES.map((r) => {
                  const rowColor = r.status === "vigente" ? "bg-emerald-50" : r.status === "vencido" ? "bg-red-50" : r.status === "vencendo" ? "bg-amber-50" : "";
                  return (
                  <tr key={r.id} className={cn("border-t border-gray-50 hover:opacity-90 transition-colors", rowColor)}>
                    <td className="px-4 py-3 font-medium text-gray-700">{r.profissional}</td>
                    <td className="px-4 py-3 text-xs font-mono font-bold text-blue-700">{r.conselho}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.especialidade}</td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-400">{r.validade}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}