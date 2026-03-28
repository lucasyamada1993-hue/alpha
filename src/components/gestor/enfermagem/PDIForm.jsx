import { X } from "lucide-react";
import { useState } from "react";

export default function PDIForm({ onClose }) {
  const [form, setForm] = useState({
    profissional: "",
    meta: "",
    dataInicio: "",
    dataPrevista: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Integrar com Google Sheets / API quando necessário
    console.log("Novo PDI:", form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Criar Novo PDI</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Profissional</label>
            <input
              type="text"
              placeholder="Digite o nome..."
              value={form.profissional}
              onChange={(e) => setForm({ ...form, profissional: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Meta de Desenvolvimento</label>
            <textarea
              placeholder="Descreva a meta..."
              value={form.meta}
              onChange={(e) => setForm({ ...form, meta: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-400 resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Data Início</label>
              <input
                type="date"
                value={form.dataInicio}
                onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Data Prevista</label>
              <input
                type="date"
                value={form.dataPrevista}
                onChange={(e) => setForm({ ...form, dataPrevista: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-sm"
            >
              Criar PDI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}