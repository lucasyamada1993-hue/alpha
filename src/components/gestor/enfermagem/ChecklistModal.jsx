import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function ChecklistModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    sala: "",
    hora: new Date().toTimeString().slice(0, 5),
    lacre: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.sala || !form.hora || !form.lacre) {
      toast.error("Preencha todos os campos");
      return;
    }
    onSave(form);
    setForm({ sala: "", hora: new Date().toTimeString().slice(0, 5), lacre: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Realizar Checagem de Segurança</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Conteúdo */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sala/Local *</label>
            <select
              value={form.sala}
              onChange={(e) => setForm({ ...form, sala: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 bg-white"
            >
              <option value="">Selecione a sala</option>
              <option value="Sala de RM">Sala de RM</option>
              <option value="Sala de TC">Sala de TC</option>
              <option value="Farmácia Satélite">Farmácia Satélite</option>
              <option value="Sala de Raio-X">Sala de Raio-X</option>
              <option value="Sala de Ultrassom">Sala de Ultrassom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hora da Checagem *</label>
            <input
              type="time"
              value={form.hora}
              onChange={(e) => setForm({ ...form, hora: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Número do Lacre *</label>
            <input
              type="text"
              placeholder="Ex: #4591"
              value={form.lacre}
              onChange={(e) => setForm({ ...form, lacre: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
            />
          </div>
        </form>

        {/* Rodapé */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold text-sm transition-colors"
          >
            Confirmar Checagem
          </button>
        </div>
      </div>
    </div>
  );
}