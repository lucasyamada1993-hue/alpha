import { useState } from "react";
import { cn } from "@/lib/utils";

const DADOS_PERIODOS = {
  "15": {
    nome: "15 Dias",
    alcancou: 85,
    naoAlcancou: 15,
    total: 20,
  },
  "30": {
    nome: "30 Dias",
    alcancou: 78,
    naoAlcancou: 22,
    total: 18,
  },
  "60": {
    nome: "60 Dias",
    alcancou: 72,
    naoAlcancou: 28,
    total: 25,
  },
  "90": {
    nome: "90 Dias",
    alcancou: 88,
    naoAlcancou: 12,
    total: 17,
  },
};

export default function EstatisticasPDI() {
  const [activePeriodo, setActivePeriodo] = useState("todos");

  const calcularTotal = () => {
    const valores = Object.values(DADOS_PERIODOS);
    const totalAlcancou = valores.reduce((sum, p) => sum + p.alcancou * p.total, 0);
    const totalNaoAlcancou = valores.reduce((sum, p) => sum + p.naoAlcancou * p.total, 0);
    const totalEvals = valores.reduce((sum, p) => sum + p.total, 0);

    return {
      alcancou: Math.round(totalAlcancou / totalEvals),
      naoAlcancou: Math.round(totalNaoAlcancou / totalEvals),
      total: totalEvals,
    };
  };

  const dadosExibir =
    activePeriodo === "todos"
      ? calcularTotal()
      : DADOS_PERIODOS[activePeriodo];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Estatísticas de PDI</h3>
      </div>

      {/* Sub-abas */}
      <div className="flex gap-1 px-6 py-4 border-b border-gray-100 bg-gray-50 flex-wrap">
        <button
          onClick={() => setActivePeriodo("todos")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-semibold transition-all border",
            activePeriodo === "todos"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
          )}
        >
          Todos os Períodos
        </button>
        {["15", "30", "60", "90"].map((periodo) => (
          <button
            key={periodo}
            onClick={() => setActivePeriodo(periodo)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-all border",
              activePeriodo === periodo
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
            )}
          >
            {periodo}D
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-4 text-center">
            <p className="text-xs text-gray-600 uppercase font-semibold tracking-wider">Alcançou</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">{dadosExibir.alcancou}%</p>
            <p className="text-xs text-gray-500 mt-1">Atingiu as metas</p>
          </div>

          <div className="bg-red-50 rounded-lg border border-red-200 p-4 text-center">
            <p className="text-xs text-gray-600 uppercase font-semibold tracking-wider">Não Alcançou</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{dadosExibir.naoAlcancou}%</p>
            <p className="text-xs text-gray-500 mt-1">Requer acompanhamento</p>
          </div>

          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 text-center">
            <p className="text-xs text-gray-600 uppercase font-semibold tracking-wider">Total</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{dadosExibir.total}</p>
            <p className="text-xs text-gray-500 mt-1">Avaliações</p>
          </div>
        </div>

        {/* Gráfico de barras visual */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Distribuição</p>
          <div className="flex items-end gap-2 h-20">
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-emerald-500 rounded-t-lg transition-all"
                style={{ height: `${(dadosExibir.alcancou / 100) * 80}px` }}
              />
              <p className="text-xs font-semibold text-gray-700 mt-2">{dadosExibir.alcancou}%</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-red-500 rounded-t-lg transition-all"
                style={{ height: `${(dadosExibir.naoAlcancou / 100) * 80}px` }}
              />
              <p className="text-xs font-semibold text-gray-700 mt-2">{dadosExibir.naoAlcancou}%</p>
            </div>
          </div>
        </div>

        {/* Detalhes por período */}
        {activePeriodo !== "todos" && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Resumo do período {DADOS_PERIODOS[activePeriodo].nome}</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-gray-500">Total de avaliações</p>
                <p className="text-lg font-bold text-gray-800">{DADOS_PERIODOS[activePeriodo].total}</p>
              </div>
              <div>
                <p className="text-gray-500">Taxa de sucesso</p>
                <p className="text-lg font-bold text-emerald-600">{DADOS_PERIODOS[activePeriodo].alcancou}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}