import { Plus, Trash2 } from "lucide-react";

const COLUNAS = [
  { key: "o_que", label: "O Quê?", placeholder: "Ação a realizar", width: "w-52" },
  { key: "por_que", label: "Por Quê?", placeholder: "Justificativa", width: "w-40" },
  { key: "quem", label: "Quem?", placeholder: "Responsável", width: "w-32" },
  { key: "onde", label: "Onde?", placeholder: "Local", width: "w-28" },
  { key: "quando", label: "Quando?", placeholder: "Prazo", width: "w-28" },
  { key: "como", label: "Como?", placeholder: "Método", width: "w-40" },
  { key: "quanto", label: "Quanto?", placeholder: "Custo (R$)", width: "w-28" },
];

const emptyRow = () => ({ o_que: "", por_que: "", quem: "", onde: "", quando: "", como: "", quanto: "" });

export default function Matriz5W3H({ acoes, setAcoes }) {
  const handleChange = (index, field, value) => {
    const next = [...acoes];
    next[index] = { ...next[index], [field]: value };
    setAcoes(next);
  };

  const addRow = () => setAcoes((prev) => [...prev, emptyRow()]);
  const removeRow = (i) => setAcoes((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-800">Matriz 5W3H — Plano de Ação</h3>
          <p className="text-xs text-gray-400 mt-0.5">Defina cada ação corretiva com detalhamento completo.</p>
        </div>
        <button
          onClick={addRow}
          className="flex items-center gap-2 bg-[#0D47A1] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#0B3D91] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Adicionar Ação
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-3 py-3 text-left w-8">#</th>
              {COLUNAS.map((c) => (
                <th key={c.key} className={`px-3 py-3 text-left ${c.width}`}>{c.label}</th>
              ))}
              <th className="px-3 py-3 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {acoes.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/50">
                <td className="px-3 py-2.5 text-xs font-bold text-gray-300">{i + 1}</td>
                {COLUNAS.map((c) => (
                  <td key={c.key} className="px-2 py-2">
                    <input
                      type="text"
                      value={row[c.key]}
                      onChange={(e) => handleChange(i, c.key, e.target.value)}
                      placeholder={c.placeholder}
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder:text-gray-300 transition-all"
                    />
                  </td>
                ))}
                <td className="px-2 py-2">
                  {acoes.length > 1 && (
                    <button
                      onClick={() => removeRow(i)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totalizador */}
      <div className="mt-4 flex justify-end">
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 text-xs font-semibold text-blue-700">
          {acoes.length} ação(ões) · Custo total estimado: R${" "}
          {acoes
            .reduce((acc, a) => acc + (parseFloat(a.quanto?.replace(",", ".").replace(/[^0-9.]/g, "")) || 0), 0)
            .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
}