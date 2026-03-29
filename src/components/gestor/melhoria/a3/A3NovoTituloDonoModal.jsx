import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function A3NovoTituloDonoModal({ onConfirm, onCancel, defaultTitulo = "", defaultDono = "" }) {
  const [titulo, setTitulo] = useState(defaultTitulo);
  const [dono, setDono] = useState(defaultDono);

  useEffect(() => {
    setTitulo(defaultTitulo);
    setDono(defaultDono);
  }, [defaultTitulo, defaultDono]);

  const submit = () => {
    if (!titulo.trim() || !dono.trim()) return;
    onConfirm({ titulo: titulo.trim(), dono: dono.trim() });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} aria-hidden />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-base">Novo A3 — identificação</h2>
          <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-xs text-gray-500">
            Informe o título e o responsável. Em seguida você preencherá o PLAN no editor (contexto, Ishikawa, 5 porquês).
          </p>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Título do A3 *</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Reduzir atraso na emissão de laudos"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Responsável (Dono) *</label>
            <input
              type="text"
              value={dono}
              onChange={(e) => setDono(e.target.value)}
              placeholder="Nome ou e-mail do responsável"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50 rounded-b-xl">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
            Cancelar
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!titulo.trim() || !dono.trim()}
            className="px-4 py-2 text-sm font-semibold bg-[#0D47A1] text-white rounded-lg hover:bg-[#0B3D91] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Criar e abrir editor
          </button>
        </div>
      </div>
    </div>
  );
}
