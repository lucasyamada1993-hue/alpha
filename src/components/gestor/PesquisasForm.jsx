import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import { surveyStore } from "@/lib/surveyStore";

const TIPOS = ["Escala Ótimo-Ruim", "Múltipla Escolha", "NPS 0-10", "Texto Aberto"];

const makeEmpty = () => ({ pergunta: "", categoria: surveyStore.getCategories()[0] || "Agendamento", tipo: "Escala Ótimo-Ruim" });

export default function PesquisasForm({ onSave, editingItem, onCancelEdit }) {
  const [form, setForm] = useState(makeEmpty());
  const [categorias, setCategorias] = useState(surveyStore.getCategories());
  const [newCat, setNewCat] = useState("");
  const [showNewCat, setShowNewCat] = useState(false);

  // Sincroniza categorias quando o store muda
  useEffect(() => {
    const unsub = surveyStore.subscribe(() => {
      setCategorias(surveyStore.getCategories());
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (editingItem) {
      setForm({ pergunta: editingItem.pergunta, categoria: editingItem.categoria, tipo: editingItem.tipo });
    } else {
      setForm(makeEmpty());
    }
    setShowNewCat(false);
    setNewCat("");
  }, [editingItem]);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleAddCategory = () => {
    const cat = newCat.trim();
    if (!cat) return;
    setForm((prev) => ({ ...prev, categoria: cat }));
    setNewCat("");
    setShowNewCat(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.pergunta.trim()) return;
    onSave(form);
    setForm(makeEmpty());
    setShowNewCat(false);
    setNewCat("");
  };

  const isEditing = !!editingItem;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-800">
            {isEditing ? "Editar Pergunta" : "Adicionar Nova Pergunta"}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {isEditing
              ? "Altere os campos e salve as mudanças."
              : "Preencha os campos abaixo para adicionar uma nova pergunta à pesquisa."}
          </p>
        </div>
        {isEditing && (
          <button
            onClick={onCancelEdit}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Cancelar edição
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {/* Enunciado */}
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Enunciado da Pergunta
            </label>
            <input
              type="text"
              value={form.pergunta}
              onChange={(e) => handleChange("pergunta", e.target.value)}
              placeholder="Ex: Como você avalia o tempo de espera?"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder:text-gray-300 transition-all"
              required
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Categoria
            </label>
            {showNewCat ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  placeholder="Nome da nova categoria"
                  className="flex-1 border border-blue-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-3 py-2.5 bg-[#0D47A1] text-white text-xs font-semibold rounded-lg hover:bg-[#0B3D91] transition-colors"
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => { setShowNewCat(false); setNewCat(""); }}
                  className="px-3 py-2.5 bg-gray-100 text-gray-500 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  value={form.categoria}
                  onChange={(e) => handleChange("categoria", e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-white"
                >
                  {categorias.map((c) => <option key={c}>{c}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCat(true)}
                  className="px-3 py-2.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                  title="Adicionar nova categoria"
                >
                  + Nova
                </button>
              </div>
            )}
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Tipo de Resposta
            </label>
            <select
              value={form.tipo}
              onChange={(e) => handleChange("tipo", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-white"
            >
              {TIPOS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#0D47A1] hover:bg-[#0B3D91] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm shadow-blue-200"
          >
            <Save className="w-4 h-4" />
            {isEditing ? "Salvar Alterações" : "Salvar Pergunta"}
          </button>
        </div>
      </form>
    </div>
  );
}