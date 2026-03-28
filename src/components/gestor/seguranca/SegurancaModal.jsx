import { useState } from "react";
import { X } from "lucide-react";

const SETORES = ["Raio-X", "Ultrassom", "Tomografia", "Ressonância", "Recepção", "Laboratório"];
const TIPOS = ["Queda", "Medicação", "Identificação do Paciente", "Contraste", "Falha de Equipamento", "Near Miss", "Outro"];
const GRAUS = ["Sem Dano", "Leve", "Moderado", "Grave"];

const EMPTY = {
  data: new Date().toISOString().slice(0, 16),
  setor: SETORES[0],
  tipo: TIPOS[0],
  grau: GRAUS[0],
  descricao: "",
  acao_imediata: "",
};

export default function SegurancaModal({ onClose, onRegistrar }) {
  const [form, setForm] = useState(EMPTY);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const [dataPart] = form.data.split("T");
    const [a, m, d] = dataPart.split("-");
    onRegistrar({
      data: `${d}/${m}/${a}`,
      setor: form.setor,
      categoria: form.tipo,
      grau: form.grau,
      status: "Em Investigação",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Notificar Evento ou Incidente</h2>
            <p className="text-xs text-gray-400 mt-0.5">Preencha todos os campos para registrar a ocorrência</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Data/Hora + Setor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Data / Hora do Evento
              </label>
              <input
                type="datetime-local"
                value={form.data}
                onChange={(e) => handleChange("data", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Setor
              </label>
              <select
                value={form.setor}
                onChange={(e) => handleChange("setor", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
              >
                {SETORES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Tipo de Evento + Grau */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Tipo de Evento
              </label>
              <select
                value={form.tipo}
                onChange={(e) => handleChange("tipo", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
              >
                {TIPOS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Grau do Dano
              </label>
              <select
                value={form.grau}
                onChange={(e) => handleChange("grau", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
              >
                {GRAUS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Descrição Detalhada
            </label>
            <textarea
              value={form.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
              placeholder="Descreva o evento com o máximo de detalhes possível..."
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all placeholder:text-gray-300"
              required
            />
          </div>

          {/* Ação Imediata */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Ação Imediata Tomada
            </label>
            <textarea
              value={form.acao_imediata}
              onChange={(e) => handleChange("acao_imediata", e.target.value)}
              placeholder="Descreva as ações imediatas realizadas para mitigar o evento..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all placeholder:text-gray-300"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#0D47A1] hover:bg-[#0B3D91] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm shadow-blue-200"
            >
              Registrar Notificação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}