import { useState } from "react";
import { Plus, X } from "lucide-react";

const CATEGORIAS = [
  { key: "metodo", label: "Método", color: "bg-blue-50 border-blue-300 text-blue-700" },
  { key: "maquina", label: "Máquina", color: "bg-purple-50 border-purple-300 text-purple-700" },
  { key: "maoDeObra", label: "Mão de Obra", color: "bg-green-50 border-green-300 text-green-700" },
  { key: "material", label: "Material", color: "bg-orange-50 border-orange-300 text-orange-700" },
  { key: "medicao", label: "Medição", color: "bg-rose-50 border-rose-300 text-rose-700" },
  { key: "meioAmbiente", label: "Meio Ambiente", color: "bg-teal-50 border-teal-300 text-teal-700" },
];

export default function Ishikawa({ ishikawa, setIshikawa, problema }) {
  const [inputs, setInputs] = useState({ metodo: "", maquina: "", maoDeObra: "", material: "", medicao: "", meioAmbiente: "" });

  const addCausa = (key) => {
    const val = inputs[key].trim();
    if (!val) return;
    setIshikawa((prev) => ({ ...prev, [key]: [...prev[key], val] }));
    setInputs((prev) => ({ ...prev, [key]: "" }));
  };

  const removeCausa = (key, index) => {
    setIshikawa((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="mb-5">
        <h3 className="font-bold text-gray-800">Diagrama de Ishikawa — Espinha de Peixe</h3>
        <p className="text-xs text-gray-400 mt-0.5">Identifique as causas potenciais do problema em cada categoria.</p>
      </div>

      {/* Problema */}
      <div className="flex items-center justify-end mb-6">
        <div className="flex-1 h-0.5 bg-gray-200" />
        <div className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl ml-4 max-w-xs text-center">
          {problema || "Defina o problema"}
        </div>
      </div>

      {/* Grade de categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIAS.map(({ key, label, color }) => (
          <div key={key} className={`border-2 rounded-xl p-4 ${color}`}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3">{label}</p>
            <ul className="space-y-1.5 mb-3 min-h-[40px]">
              {ishikawa[key].map((causa, i) => (
                <li key={i} className="flex items-center justify-between gap-2 bg-white/70 rounded-lg px-2.5 py-1.5">
                  <span className="text-xs text-gray-700">{causa}</span>
                  <button onClick={() => removeCausa(key, i)}>
                    <X className="w-3 h-3 text-gray-400 hover:text-red-500" />
                  </button>
                </li>
              ))}
              {ishikawa[key].length === 0 && (
                <li className="text-xs text-gray-300 italic">Nenhuma causa adicionada</li>
              )}
            </ul>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputs[key]}
                onChange={(e) => setInputs((p) => ({ ...p, [key]: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && addCausa(key)}
                placeholder="Adicionar causa..."
                className="flex-1 border border-white/80 bg-white/80 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-gray-300"
              />
              <button
                onClick={() => addCausa(key)}
                className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}