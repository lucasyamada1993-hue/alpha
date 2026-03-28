import { useState } from "react";
import { db } from "@/api/sheetsClient";
import { toast } from "sonner";

export default function A3Modal({ onClose, evento }) {
  const [form, setForm] = useState({
    origem: evento?.id || "",
    titulo: evento?.descricao || "",
    tipo: evento?.tipo === "Evento Adverso" ? "Evento Adverso" : "Não Conformidade",
    dono: evento?.notificado_por || "",
    prioridade: evento?.gravidade === "Alta" ? "Alta" : evento?.gravidade === "Moderada" ? "Média" : "Baixa",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!form.titulo || !form.dono) {
        toast.error("Preencha título e responsável");
        return;
      }

      setLoading(true);
      await db.entities.A3Relatorio.create({
        titulo: form.titulo,
        tipo: form.tipo,
        dono: form.dono,
        prioridade: form.prioridade,
        origem: `Evento #${evento?.id || "novo"}`,
        status_pdca: "PLAN",
      });

      if (evento?.id) {
        await db.entities.EventoAdverso.update(evento.id, {
          plano_acao_aberto: true,
        });
      }

      toast.success("A3 criado com sucesso!");
      onClose();
    } catch (error) {
      toast.error("Erro ao criar A3");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-2xl font-bold text-gray-800">Plano A3 {evento ? "do Evento" : "Novo"}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Origem
            </label>
            <input
              type="text"
              value={form.origem}
              disabled
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Tipo
              </label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="Evento Adverso">Evento Adverso</option>
                <option value="Não Conformidade">Não Conformidade</option>
                <option value="Oportunidade de Melhoria">Oportunidade de Melhoria</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Prioridade
              </label>
              <select
                value={form.prioridade}
                onChange={(e) => setForm({ ...form, prioridade: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Título do Problema
            </label>
            <textarea
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Descreva o problema..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Responsável
            </label>
            <input
              type="text"
              value={form.dono}
              onChange={(e) => setForm({ ...form, dono: e.target.value })}
              placeholder="Nome do responsável"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar A3"}
          </button>
        </div>
      </div>
    </div>
  );
}