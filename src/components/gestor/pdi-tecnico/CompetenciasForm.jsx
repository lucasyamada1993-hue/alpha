import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
const CATEGORIAS_PADRAO = [
  "Competências Técnicas Assistenciais",
  "Qualidade e Segurança do Paciente",
  "Proteção Radiológica e Biossegurança",
  "Competências Comportamentais",
];

const makeEmpty = () => ({
  nome: "",
  descricao: "",
  exemplos: "",
  categoria: CATEGORIAS_PADRAO[0],
});

export default function CompetenciasForm({ onSave, editingItem, onCancelEdit }) {
  const [form, setForm] = useState(makeEmpty());

  useEffect(() => {
    if (editingItem) {
      setForm({
        nome: editingItem.nome,
        descricao: editingItem.descricao,
        exemplos: editingItem.exemplos,
        categoria: editingItem.categoria,
      });
    } else {
      setForm(makeEmpty());
    }
  }, [editingItem]);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.descricao.trim()) return;
    onSave(form);
    setForm(makeEmpty());
  };

  const isEditing = !!editingItem;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-800">
            {isEditing ? "Editar Competência" : "Adicionar Nova Competência"}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {isEditing ? "Altere os campos e salve." : "Configure competências para o PDI de Técnicos de Enfermagem."}
          </p>
        </div>
        {isEditing && (
          <button onClick={onCancelEdit} className="text-xs text-gray-400 hover:text-gray-600">
            <X className="w-3.5 h-3.5" /> Cancelar
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Categoria</label>
            <select
              value={form.categoria}
              onChange={(e) => handleChange("categoria", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {CATEGORIAS_PADRAO.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Nome da Competência</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              placeholder="Ex: Punção Venosa e Acesso Seguro"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Descrição</label>
          <textarea
            value={form.descricao}
            onChange={(e) => handleChange("descricao", e.target.value)}
            placeholder="Descrição detalhada da competência..."
            rows="3"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
            required
          />
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Exemplos de Comportamentos</label>
          <textarea
            value={form.exemplos}
            onChange={(e) => handleChange("exemplos", e.target.value)}
            placeholder="Exemplos: O que esperamos ver na prática..."
            rows="2"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#0D47A1] hover:bg-[#0B3D91] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" /> {isEditing ? "Salvar Alterações" : "Salvar Competência"}
          </button>
        </div>
      </form>
    </div>
  );
}