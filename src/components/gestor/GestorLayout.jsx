import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GestorSidebar from "@/components/gestor/GestorSidebar";
import GestorHeader from "@/components/gestor/GestorHeader";
import { Home } from "lucide-react";

const PATH_TO_PAGE = {
  "/gestor-master": "visao-geral",
  "/gestor-master/jornada": "jornada",
  "/gestor-master/equipamentos": "equipamentos",
  "/gestor-master/qualidade": "qualidade",
  "/gestor-master/lgpd": "lgpd",
  "/gestor-master/treinamentos": "treinamentos",
  "/gestor-master/melhoria": "melhoria",
  "/gestor-master/glosas": "glosas",
  "/gestor-master/pesquisas": "pesquisas",
  "/gestor-master/perfis": "perfis",
  "/gestor-master/funcionarios": "funcionarios",
  "/gestor-master/pdi": "pdi",
  "/gestor-master/carrinho": "carrinho",
  "/gestor-master/documentos": "documentos",
  "/gerente-enfermagem": "enfermagem",
  "/gerente-enfermagem/enfermagem": "enfermagem",
  "/gerente-enfermagem/pdi": "pdi",
  "/gerente-enfermagem/evento-adverso": "evento-adverso",
  "/gerente-enfermagem/documentos": "documentos",
  "/gestor-qualidade": "qualidade",
  "/gestor-qualidade/jornada": "jornada-qualidade",
  "/gestor-qualidade/equipamentos": "equipamentos",
  "/gestor-qualidade/eventos-nao-conformidades": "qualidade-nc",
  "/gestor-qualidade/documentos": "documentos",
  "/gestor-qualidade/treinamentos": "treinamentos",
  "/gestor-qualidade/pdi": "pdi",
  "/gestor-qualidade/funcionarios": "funcionarios",
  "/gestor-qualidade/melhoria": "melhoria",
  "/gestor-qualidade/pesquisas": "pesquisas",
  "/gestor-qualidade/carrinho": "carrinho",
};

const MODULO_POR_FUNCAO = {
  "Gerente Enfermagem": { modulo: "enfermagem", base: "/gerente-enfermagem" },
  "Gerente Administrativo": { modulo: "pesquisas", base: "/gestor-master" },
  "Gerente de Treinamentos/RH": { modulo: "treinamentos", base: "/gestor-master" },
  "Gerente Equipamentos": { modulo: "equipamentos", base: "/gestor-master" },
  "Gerente Qualidade": { modulo: "qualidade", base: "/gestor-qualidade" },
};

export default function GestorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [gestorAuth, setGestorAuth] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem("gestorAutenticado");
    if (auth) {
      const data = JSON.parse(auth);
      setGestorAuth(data);

      // Se tem funcoes e não é admin, redireciona para seu módulo
      if (data.funcoes && data.funcoes.length > 0 && !data.funcoes.includes("Admin")) {
        const moduloConfig = MODULO_POR_FUNCAO[data.funcoes[0]];
        if (moduloConfig) {
          const shouldRedirect = 
            (moduloConfig.base === "/gestor-master" && !location.pathname.startsWith("/gestor-master")) ||
            (moduloConfig.base === "/gerente-enfermagem" && !location.pathname.startsWith("/gerente-enfermagem")) ||
            (moduloConfig.base === "/gestor-qualidade" && !location.pathname.startsWith("/gestor-qualidade"));
          
          if (shouldRedirect) {
            navigate(`${moduloConfig.base}`);
          }
        }
      }
    }
  }, [location.pathname, navigate]);

  const activePage = PATH_TO_PAGE[location.pathname] || "visao-geral";

  return (
    <div className="flex h-screen bg-[#F4F7F6] overflow-hidden relative">
      <GestorSidebar activePage={activePage} gestorAuth={gestorAuth} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <GestorHeader activePage={activePage} />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <Outlet />
        </main>
      </div>
      <button onClick={() => {
        localStorage.removeItem("gestorAutenticado");
        navigate("/gestor-inicial");
      }} className="fixed bottom-6 left-6 flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md">
        <Home className="w-4 h-4" />
        <span className="text-sm font-medium">Sair</span>
      </button>
    </div>
  );
}