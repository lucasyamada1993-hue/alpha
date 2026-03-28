import { useState } from "react";
import { cn } from "@/lib/utils";

const DADOS_COLABORADORES = [
  {
    id: 1,
    nome: "Carlos Lima",
    pdi15: { alcancou: 85, naoAlcancou: 15 },
    pdi30: { alcancou: 78, naoAlcancou: 22 },
    pdi60: { alcancou: 72, naoAlcancou: 28 },
    pdi90: { alcancou: 88, naoAlcancou: 12 },
  },
  {
    id: 2,
    nome: "Fernanda Melo",
    pdi15: { alcancou: 92, naoAlcancou: 8 },
    pdi30: { alcancou: 85, naoAlcancou: 15 },
    pdi60: { alcancou: 80, naoAlcancou: 20 },
    pdi90: { alcancou: 90, naoAlcancou: 10 },
  },
  {
    id: 3,
    nome: "Ana Souza",
    pdi15: { alcancou: 75, naoAlcancou: 25 },
    pdi30: { alcancou: 70, naoAlcancou: 30 },
    pdi60: { alcancou: 68, naoAlcancou: 32 },
    pdi90: { alcancou: 76, naoAlcancou: 24 },
  },
  {
    id: 4,
    nome: "Ricardo Neves",
    pdi15: { alcancou: 88, naoAlcancou: 12 },
    pdi30: { alcancou: 82, naoAlcancou: 18 },
    pdi60: { alcancou: 79, naoAlcancou: 21 },
    pdi90: { alcancou: 85, naoAlcancou: 15 },
  },
];

export default function EstatisticasTecnico() {
  const [filterPeriodo, setFilterPeriodo] = useState("todos");

  const calcularMedia = (periodo) => {
    const valores = DADOS_COLABORADORES.map((colab) => {
      if (periodo === "todos") {
        return (colab.pdi15.alcancou + colab.pdi30.alcancou + colab.pdi60.alcancou + colab.pdi90.alcancou) / 4;
      }
      return colab[`pdi${periodo}`].alcancou;
    });
    return Math.round(valores.reduce((a, b) => a + b) / valores.length);
  };

  const getData = (colaborador, periodo) => {
    if (periodo === "todos") {
      const media = (colaborador.pdi15.alcancou + colaborador.pdi30.alcancou + colaborador.pdi60.alcancou + colaborador.pdi90.alcancou) / 4;
      return Math.round(media);
    }
    return colaborador[`pdi${periodo}`].alcancou;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Estatísticas de PDI — Técnico de Enfermagem</h3>
      </div>

      {/* Filtro por período */}
      <div className="flex gap-1 px-6 py-4 border-b border-gray-100 bg-gray-50 flex-wrap">
        <button
          onClick={() => setFilterPeriodo("todos")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-semibold transition-all border",
            filterPeriodo === "todos"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
          )}
        >
          Todos os Períodos
        </button>
        {["15", "30", "60", "90"].map((periodo) => (
          <button
            key={periodo}
            onClick={() => setFilterPeriodo(periodo)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-all border",
              filterPeriodo === periodo
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
            )}
          >
            {periodo}D
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-left font-semibold text-gray-700">Colaborador</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700">Alcançou %</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700">Não Alcançou %</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {DADOS_COLABORADORES.map((colab) => {
              const alcancou = getData(colab, filterPeriodo);
              const naoAlcancou = 100 - alcancou;
              const status = alcancou >= 85 ? "Excelente" : alcancou >= 75 ? "Bom" : alcancou >= 65 ? "Regular" : "Baixo";
              const statusColor = 
                status === "Excelente" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                status === "Bom" ? "bg-blue-50 text-blue-700 border-blue-200" :
                status === "Regular" ? "bg-amber-50 text-amber-700 border-amber-200" :
                "bg-red-50 text-red-700 border-red-200";

              return (
                <tr key={colab.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-800">{colab.nome}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-bold text-emerald-600 bg-emerald-50">
                      {alcancou}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-bold text-red-600 bg-red-50">
                      {naoAlcancou}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-semibold border", statusColor)}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Resumo */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">Média Geral ({filterPeriodo === "todos" ? "Todos os Períodos" : `${filterPeriodo}D`}):</span>{" "}
          <span className="font-bold text-blue-600">{calcularMedia(filterPeriodo)}%</span>
        </p>
      </div>
    </div>
  );
}