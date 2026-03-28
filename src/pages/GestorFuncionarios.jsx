// @ts-nocheck
import { useState } from "react";
import { db } from "@/api/sheetsClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

function formatData(isoOrDate) {
  if (!isoOrDate) return "—";
  const d = new Date(isoOrDate);
  if (Number.isNaN(d.getTime())) return String(isoOrDate);
  return d.toLocaleDateString("pt-BR");
}

export default function GestorFuncionarios() {
  const queryClient = useQueryClient();
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nome: "", cargo: "", dataAdmissao: "", ativo: true });

  const { data: funcionarios = [], isLoading } = useQuery({
    queryKey: ["funcionarios"],
    queryFn: () => db.entities.Funcionario.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => db.entities.Funcionario.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      resetForm();
      toast.success("Funcionário registrado.");
    },
    onError: (e) => toast.error(e.message || "Erro ao salvar"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => db.entities.Funcionario.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      resetForm();
      toast.success("Funcionário atualizado.");
    },
    onError: (e) => toast.error(e.message || "Erro ao atualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.entities.Funcionario.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      toast.success("Removido.");
    },
    onError: (e) => toast.error(e.message || "Erro ao remover"),
  });

  const resetForm = () => {
    setForm({ nome: "", cargo: "", dataAdmissao: "", ativo: true });
    setEditando(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nome || !form.cargo || !form.dataAdmissao) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    if (editando) {
      updateMutation.mutate({ id: editando.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleEdit = (funcionario) => {
    setEditando(funcionario);
    setForm({
      nome: funcionario.nome,
      cargo: funcionario.cargo,
      dataAdmissao: funcionario.dataAdmissao || "",
      ativo: funcionario.ativo !== false,
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Excluir este funcionário?")) return;
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 text-lg mb-4">
          {editando ? "Editar Perfil de Funcionário" : "Registrar Novo Funcionário"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Digite o nome completo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cargo</label>
              <select
                value={form.cargo}
                onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 bg-white"
              >
                <option value="">Selecione o cargo</option>
                <option value="Enfermeiro">Enfermeiro</option>
                <option value="Técnico de Enfermagem">Técnico de Enfermagem</option>
                <option value="Auxiliar de Enfermagem">Auxiliar de Enfermagem</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Admissão</label>
              <input
                type="date"
                value={form.dataAdmissao}
                onChange={(e) => setForm({ ...form, dataAdmissao: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-[#0D47A1] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#0B3D91] transition-colors disabled:opacity-50"
            >
              {editando ? "Atualizar" : "Registrar Funcionário"}
            </button>
            {editando && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Funcionários Cadastrados</h3>
            <p className="text-xs text-gray-400 mt-0.5">Equipe de enfermagem e suporte</p>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {funcionarios.length} funcionário{funcionarios.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Data Admissão
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Nenhum funcionário cadastrado.
                  </td>
                </tr>
              ) : (
                funcionarios.map((func) => (
                  <tr key={func.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{func.nome}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-600 text-xs">{func.cargo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-600 font-mono text-xs">{formatData(func.dataAdmissao)}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {func.ativo !== false ? (
                        <span className="flex items-center justify-center gap-1 text-emerald-600 text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4" /> Ativo
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1 text-red-600 text-xs font-semibold">
                          <XCircle className="w-4 h-4" /> Inativo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(func)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(func.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
