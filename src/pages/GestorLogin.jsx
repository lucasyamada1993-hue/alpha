import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/api/sheetsClient";
import BrandingFachadaColumn from "@/components/BrandingFachadaColumn";
import LogoCxCorner from "@/components/LogoCxCorner";

/** Acesso mestre ao painel /gestor-master (também útil se a aba GestorPerfil ainda não existir na planilha). */
const LOGIN_MASTER = "Gestaoalpha";
const SENHA_MASTER = "adm123";

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

    let perfis = [];
    try {
      perfis = await db.entities.GestorPerfil.filter({
        login: login.trim(),
        ativo: true,
      });
    } catch {
      perfis = [];
    }

    const loginNorm = login.trim().toLowerCase();
    const sheetOk =
      perfis.length > 0 && String(perfis[0].senha) === senha;

    const masterOk =
      loginNorm === LOGIN_MASTER.toLowerCase() && senha === SENHA_MASTER;

    if (sheetOk) {
      localStorage.setItem(
        "gestorAutenticado",
        JSON.stringify({
          login: perfis[0].login,
          funcoes: perfis[0].funcoes,
          timestamp: new Date().toISOString(),
        })
      );
      toast.success("Login realizado com sucesso!");
      setTimeout(() => {
        const userFunctions = perfis[0].funcoes || [];
        if (userFunctions.includes("Gerente Enfermagem")) {
          navigate("/gerente-enfermagem");
        } else {
          navigate("/gestor-master");
        }
      }, 300);
    } else if (masterOk) {
      localStorage.setItem(
        "gestorAutenticado",
        JSON.stringify({
          login: LOGIN_MASTER,
          funcoes: ["Gestor Master"],
          timestamp: new Date().toISOString(),
        })
      );
      toast.success("Login realizado com sucesso!");
      setTimeout(() => navigate("/gestor-master"), 300);
    } else {
      toast.error("Login ou senha incorretos");
      setSenha("");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <BrandingFachadaColumn>
        <h1 className="text-center text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-5xl [text-shadow:0_2px_20px_rgba(0,0,0,0.85),0_1px_4px_rgba(0,0,0,0.95)]">
          Painel de Gestão Alphasonic
        </h1>
      </BrandingFachadaColumn>

      {/* Coluna Direita */}
      <div className="relative flex flex-col bg-white md:w-1/2">
        <LogoCxCorner />
        <div className="flex flex-1 flex-col items-center justify-center px-8 pb-10 pt-16 md:py-0">
          <h2 className="mb-2 text-center text-3xl font-bold text-gray-800 md:text-4xl">
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