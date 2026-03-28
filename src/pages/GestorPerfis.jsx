// @ts-nocheck
import { useState } from "react";
import { db } from "@/api/sheetsClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

const FUNCOES = [
  "Gerente Enfermagem",
  "Gerente Administrativo",
  "Gerente de Treinamentos/RH",
  "Gerente Equipamentos",
  "Gerente Qualidade",
];

export default function GestorPerfis() {
  const queryClient = useQueryClient();
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ login: "", senha: "", funcoes: [], ativo: true });

  const { data: perfis = [], isLoading } = useQuery({
    queryKey: ["gestorPerfis"],
    queryFn: () => db.entities.GestorPerfil.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => db.entities.GestorPerfil.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestorPerfis"] });
      resetForm();
      toast.success("Perfil criado com sucesso!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => db.entities.GestorPerfil.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestorPerfis"] });
      resetForm();
      toast.success("Perfil atualizado com sucesso!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.entities.GestorPerfil.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestorPerfis"] });
      toast.success("Perfil deletado com sucesso!");
    },
  });

  const resetForm = () => {
    setForm({ login: "", senha: "", funcoes: [], ativo: true });
    setEditando(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.login || !form.senha || form.funcoes.length === 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editando) {
      updateMutation.mutate({ id: editando.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleEdit = (perfil) => {
    setEditando(perfil);
    setForm({
      login: perfil.login,
      senha: perfil.senha,
      funcoes: perfil.funcoes,
      ativo: perfil.ativo,
    });
  };

  const handleToggleFuncao = (funcao) => {
    setForm((prev) => ({
      ...prev,
      funcoes: prev.funcoes.includes(funcao)
        ? prev.funcoes.filter((f) => f !== funcao)
        : [...prev.funcoes, funcao],
    }));
  };

  if (isLoading) return <div className="text-center py-10">Carregando...</div>;

  return (
    <div className="space-y-6">
      {/* Formulário */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 text-lg mb-4">
          {editando ? "Editar Perfil" : "Criar Novo Perfil"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Login
              </label>
              <input
                type="text"
                value={form.login}
                onChange={(e) => setForm({ ...form, login: e.target.value })}
                placeholder="Digite o login"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                placeholder="Digite a senha"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Funções do Perfil
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {FUNCOES.map((funcao) => (
                <label key={funcao} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.funcoes.includes(funcao)}
                    onChange={() => handleToggleFuncao(funcao)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-xs text-gray-600">{funcao}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="bg-[#0D47A1] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#0B3D91] transition-colors"
            >
              {editando ? "Atualizar" : "Criar Perfil"}
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

      {/* Tabela de Perfis */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Perfis de Login</h3>
            <p className="text-xs text-gray-400 mt-0.5">Gerenciamento de acessos por função</p>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {perfis.length} perfil{perfis.length !== 1 ? "is" : ""}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Login
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Funções
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
              {perfis.map((perfil) => (
                <tr key={perfil.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-800">{perfil.login}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {perfil.funcoes.map((funcao) => (
                        <span
                          key={funcao}
                          className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium"
                        >
                          {funcao}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perfil.ativo ? (
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
                        onClick={() => handleEdit(perfil)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Tem certeza que deseja deletar este perfil?")) {
                            deleteMutation.mutate(perfil.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {perfis.length === 0 && (
          <div className="px-5 py-8 text-center text-gray-500">
            <p>Nenhum perfil criado ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}