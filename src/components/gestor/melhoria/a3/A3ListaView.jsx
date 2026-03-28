import { Plus, Eye, Edit2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const A3_MOCK_DATA = [
  {
    id: 1,
    titulo: "Reduzir Atraso de Laudos RM",
    dono: "Dr. Carlos Silva",
    tipo: "Não Conformidade",
    prioridade: "Alta",
    status_pdca: "DO",
    ciclo: 1,
    data_criacao: "2026-03-10",
    progresso: 60,
  },
  {
    id: 2,
    titulo: "Otimizar Fluxo de Recepção",
    dono: "Ana Paula Souza",
    tipo: "Oportunidade de Melhoria",
    prioridade: "Média",
    status_pdca: "PLAN",
    ciclo: 1,
    data_criacao: "2026-03-15",
    progresso: 30,
  },
  {
    id: 3,
    titulo: "Implementar Double-Check de Contraste",
    dono: "Fernanda Melo",
    tipo: "Não Conformidade",
    prioridade: "Alta",
    status_pdca: "CHECK",
    ciclo: 2,
    data_criacao: "2026-03-08",
    progresso: 75,
  },
];

const PDCA_COLORS = {
  PLAN: "bg-blue-50 text-blue-700 border-blue-200",
  DO: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CHECK: "bg-amber-50 text-amber-700 border-amber-200",
  ACT: "bg-purple-50 text-purple-700 border-purple-200",
  "Concluído": "bg-green-50 text-green-700 border-green-200",
};

const PRIORITY_COLORS = {
  Alta: "bg-red-100 text-red-800",
  Média: "bg-yellow-100 text-yellow-800",
  Baixa: "bg-green-100 text-green-800",
};

const TIPO_COLORS = {
  "Não Conformidade": "bg-red-50 text-red-700 border-red-200",
  "Oportunidade de Melhoria": "bg-blue-50 text-blue-700 border-blue-200",
  "Evento Adverso": "bg-orange-50 text-orange-700 border-orange-200",
  "Near Miss": "bg-yellow-50 text-yellow-700 border-yellow-200",
};

export default function A3ListaView({ onNovoA3, onSelect }) {
  const handleAbriNovoCiclo = (a3) => {
    const novoCiclo = {
      ...a3,
      id: Math.random(),
      ciclo: (a3.ciclo || 1) + 1,
      status_pdca: "PLAN",
      progresso: 0,
      data_criacao: new Date().toISOString().split("T")[0],
    };
    onSelect(novoCiclo);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Planos de Melhoria (A3 — PDCA)</h1>
          <p className="text-sm text-gray-500 mt-1">Gestão de Ações Corretivas e Melhorias Contínuas</p>
        </div>
        <button
          onClick={onNovoA3}
          className="flex items-center gap-2 px-4 py-2 bg-[#0D47A1] text-white rounded-lg hover:bg-[#0B3D91] font-semibold text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo A3
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total de A3s", value: "3", color: "bg-blue-50 text-blue-600 border-blue-200" },
          { label: "Em PLAN", value: "1", color: "bg-blue-50 text-blue-600 border-blue-200" },
          { label: "Em Andamento (DO/CHECK)", value: "2", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
          { label: "Concluídos", value: "0", color: "bg-green-50 text-green-600 border-green-200" },
        ].map((stat, i) => (
          <div key={i} className={cn("rounded-xl border-2 p-4", stat.color)}>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Cards View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {A3_MOCK_DATA.map((a3) => (
          <div key={a3.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
            {/* Card Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm">{a3.titulo}</h3>
                  <p className="text-xs text-gray-500 mt-1">Responsável: {a3.dono}</p>
                </div>
                <span className={cn("text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap", PRIORITY_COLORS[a3.prioridade])}>
                  {a3.prioridade}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className={cn("text-xs font-semibold px-2 py-1 rounded-full border", TIPO_COLORS[a3.tipo])}>
                  {a3.tipo}
                </span>
                <span className={cn("text-xs font-semibold px-2 py-1 rounded-full border", PDCA_COLORS[a3.status_pdca])}>
                  {a3.status_pdca}
                </span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-600">Progresso</p>
                  <p className="text-xs font-bold text-gray-700">{a3.progresso}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#0D47A1] h-2 rounded-full transition-all"
                    style={{ width: `${a3.progresso}%` }}
                  />
                </div>
              </div>

              {/* Date */}
              <p className="text-xs text-gray-500">Criado em: {a3.data_criacao}</p>
            </div>

            {/* Card Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => onSelect(a3)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                Editar
              </button>
              <button
                onClick={() => onSelect(a3)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Eye className="w-3 h-3" />
                Detalhes
              </button>
              <div className="relative group flex-1">
                <button className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                  <ChevronDown className="w-3 h-3" />
                  Ciclos
                </button>
                <div className="absolute right-0 bottom-full mb-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[9999]">
                  <button
                    onClick={() => handleAbriNovoCiclo(a3)}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 border-b border-gray-100"
                  >
                    ➕ Abrir Ciclo {(a3.ciclo || 1) + 1}
                  </button>
                  <div className="px-3 py-2 text-[10px] text-gray-500">
                    Atual: Ciclo {a3.ciclo || 1}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {A3_MOCK_DATA.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">Nenhum A3 criado ainda</p>
          <button
            onClick={onNovoA3}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D47A1] text-white rounded-lg hover:bg-[#0B3D91] font-semibold text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Criar o Primeiro A3
          </button>
        </div>
      )}
    </div>
  );
}