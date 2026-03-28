import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Activity } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/api/sheetsClient";

export default function GestorLogin() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!login || !senha) {
      toast.error("Por favor, preencha login e senha");
      return;
    }

    setLoading(true);

    const perfis = await db.entities.GestorPerfil.filter({
      login: login,
      ativo: true,
    });

    if (perfis.length > 0 && perfis[0].senha === senha) {
      localStorage.setItem("gestorAutenticado", JSON.stringify({
        login: perfis[0].login,
        funcoes: perfis[0].funcoes,
        timestamp: new Date().toISOString(),
      }));
      toast.success("Login realizado com sucesso!");
      setTimeout(() => {
        const userFunctions = perfis[0].funcoes;
        if (userFunctions.includes("Gerente Enfermagem")) {
          navigate("/gerente-enfermagem");
        } else {
          navigate("/gestor-master");
        }
      }, 300);
    } else {
      toast.error("Login ou senha incorretos");
      setSenha("");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Coluna Esquerda */}
      <div className="relative flex flex-col justify-between md:w-1/2 min-h-[45vh] md:min-h-screen bg-gradient-to-br from-[#0d47a1] via-[#1565C0] to-[#0a3d91]">
        <div className="absolute inset-0 bg-[#0D47A1]/20" />

        <div className="relative z-10 p-8" />

        <div className="relative z-10 flex-1 flex items-center justify-center px-10 py-8">
          <h1 className="text-white font-extrabold text-3xl md:text-4xl lg:text-5xl text-center leading-tight">
            Painel de Gestão Alphasonic
          </h1>
        </div>

        <div className="relative z-10 p-8 hidden md:block" />
      </div>

      {/* Coluna Direita */}
      <div className="relative flex flex-col md:w-1/2 bg-white">
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-14 md:py-0">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#0D47A1] flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-lg">Alphasonic</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Gestor</p>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-2">
            Acesso do Gestor
          </h2>
          <p className="text-gray-500 text-center text-sm mb-8 max-w-xs">
            Faça login para acessar o painel de gestão
          </p>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Login
              </label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Digite seu login"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 outline-none focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 outline-none focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-between text-white text-base font-semibold px-6 py-3 rounded-lg shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ background: "#0D47A1" }}
            >
              <span>{loading ? "Entrando..." : "Entrar"}</span>
              <Lock className="w-4 h-4" />
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-6 text-center max-w-xs">
            Este é o painel exclusivo para gestores. Use suas credenciais de acesso.
          </p>
        </div>

        <div className="flex items-center justify-center py-5 px-6 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center">
            Alphasonic © 2026 — Sistema de Gestão de Qualidade
          </p>
        </div>
      </div>
    </div>
  );
}