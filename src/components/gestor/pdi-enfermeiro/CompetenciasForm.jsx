import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";

const CATEGORIAS = [
  "Competências Clínicas e Assistenciais Avançadas (Hard Skills)",
  "Gestão da Qualidade e Segurança do Paciente (Padrão ONA)",
  "Proteção Radiológica e Biossegurança",
  "Liderança, Comportamento e Experiência do Paciente (Soft Skills)",
];

export default function CompetenciasForm({ onSave, editingItem, onCancelEdit }) {
  const [form, setForm] = useState({
    categoria: "",
    nome: "",
    descricao: "",
    exemplos: "",
  });

  useEffect(() => {
    if (editingItem) {
      setForm(editingItem);
    } else {
      setForm({ categoria: "", nome: "", descricao: "", exemplos: "" });
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.categoria || !form.nome) {
      alert("Preencha categoria e nome da competência");
      return;
    }
    onSave(form);
    setForm({ categoria: "", nome: "", descricao: "", exemplos: "" });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {editingItem ? "Editar Competência" : "Adicionar Nova Competência"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Categoria *
            </label>
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 bg-white"
            >
              <option value="">Selecione uma categoria</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nome da Competência *
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Ex: Manejo de Reações Alérgicas a Contraste"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Descrição
          </label>
          <textarea
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            placeholder="Descreva a competência em detalhes..."
            rows="2"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Exemplos de Comportamentos Esperados
          </label>
          <textarea
            value={form.exemplos}
            onChange={(e) => setForm({ ...form, exemplos: e.target.value })}
            placeholder="Ex: Identifica sinais de reação alérgica, comunica ao médico imediatamente, assiste o paciente..."
            rows="2"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 resize-none"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            {editingItem ? "Atualizar" : "Adicionar"} Competência
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}