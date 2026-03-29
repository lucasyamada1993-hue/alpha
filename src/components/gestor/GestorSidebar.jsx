import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Activity,
  UserCheck,
  Wrench,
  ShieldCheck,
  Lock,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  FileStack,
} from "lucide-react";

const NAV_GROUPS_MASTER = [
  {
    label: "Principal",
    items: [
      { id: "visao-geral", label: "Visão Geral", icon: LayoutDashboard, path: "/gestor-master" },
    ],
  },
  {
    label: "Pilares ISO 9001 & ONA",
    items: [
      { id: "jornada", label: "Jornada do Paciente", icon: UserCheck, path: "/gestor-master/jornada" },
      { id: "equipamentos", label: "Equipamentos & Radioproteção", icon: Wrench, path: "/gestor-master/equipamentos" },
      { id: "qualidade", label: "Qualidade & Não Conformidades", icon: ShieldCheck, path: "/gestor-master/qualidade" },
      { id: "documentos", label: "Controle de Documentos e POPs", icon: FileStack, path: "/gestor-master/documentos" },
      { id: "lgpd", label: "Segurança & LGPD", icon: Lock, path: "/gestor-master/lgpd" },
    ],
  },
  {
    label: "Desenvolvimento & Treinamento",
    items: [
      { id: "treinamentos", label: "Treinamentos & Competência", icon: GraduationCap, path: "/gestor-master/treinamentos" },
      { id: "pdi", label: "PDI — Plano de Desenvolvimento", icon: TrendingUp, path: "/gestor-master/pdi" },
    ],
  },
  {
    label: "Ferramentas",
    items: [
      { id: "funcionarios", label: "Perfil do Usuário", icon: UserCheck, path: "/gestor-master/funcionarios" },
      { id: "melhoria", label: "Melhoria Contínua", icon: TrendingUp, path: "/gestor-master/melhoria" },
      { id: "pesquisas", label: "Pesquisas", icon: Activity, path: "/gestor-master/pesquisas" },
      { id: "perfis", label: "Perfis de Login", icon: UserCheck, path: "/gestor-master/perfis" },
      { id: "carrinho", label: "Carrinho de Emergências", icon: AlertTriangle, path: "/gestor-master/carrinho" },
    ],
  },
];

const NAV_GROUPS_ENFERMAGEM = [
  {
    label: "Principal",
    items: [
      { id: "enfermagem", label: "Gestão Assistencial", icon: LayoutDashboard, path: "/gerente-enfermagem" },
      { id: "evento-adverso", label: "Eventos adversos & NC", icon: AlertTriangle, path: "/gerente-enfermagem/evento-adverso" },
      { id: "documentos", label: "POPs — consulta", icon: FileStack, path: "/gerente-enfermagem/documentos" },
    ],
  },
  {
    label: "Desenvolvimento & Treinamento",
    items: [
      { id: "pdi", label: "PDI — Plano de Desenvolvimento", icon: TrendingUp, path: "/gerente-enfermagem/pdi" },
    ],
  },
];

const NAV_GROUPS_QUALIDADE = [
  {
    label: "Principal",
    items: [
      { id: "qualidade", label: "Visão Geral", icon: ShieldCheck, path: "/gestor-qualidade" },
    ],
  },
  {
    label: "Pilares ISO 9001 & ONA",
    items: [
      { id: "jornada-qualidade", label: "Jornada do Paciente", icon: UserCheck, path: "/gestor-qualidade/jornada" },
      { id: "equipamentos", label: "Equipamentos & Radioproteção", icon: Wrench, path: "/gestor-qualidade/equipamentos" },
      { id: "qualidade-nc", label: "Qualidade & Não Conformidades", icon: AlertTriangle, path: "/gestor-qualidade/eventos-nao-conformidades" },
      { id: "documentos", label: "Controle de Documentos e POPs", icon: FileStack, path: "/gestor-qualidade/documentos" },
    ],
  },
  {
    label: "Desenvolvimento & Treinamento",
    items: [
      { id: "treinamentos", label: "Treinamentos & Competência", icon: GraduationCap, path: "/gestor-qualidade/treinamentos" },
      { id: "pdi", label: "Avaliações PDI - Todos os Perfis", icon: TrendingUp, path: "/gestor-qualidade/pdi" },
    ],
  },
  {
    label: "Ferramentas",
    items: [
      { id: "funcionarios", label: "Perfil do Usuário", icon: UserCheck, path: "/gestor-qualidade/funcionarios" },
      { id: "melhoria", label: "Melhoria Contínua", icon: TrendingUp, path: "/gestor-qualidade/melhoria" },
      { id: "pesquisas", label: "Pesquisas", icon: Activity, path: "/gestor-qualidade/pesquisas" },
      { id: "carrinho", label: "Carrinho de Emergências", icon: AlertTriangle, path: "/gestor-qualidade/carrinho" },
    ],
  },
];

export default function GestorSidebar({ activePage, gestorAuth }) {
  const isAdmin = gestorAuth?.funcoes?.includes("Admin");
  const isEnfermagem = gestorAuth?.funcoes?.includes("Gerente Enfermagem");
  const isQualidade = gestorAuth?.funcoes?.includes("Gerente Qualidade");

  const navGroups = isAdmin ? NAV_GROUPS_MASTER : (isQualidade ? NAV_GROUPS_QUALIDADE : (isEnfermagem ? NAV_GROUPS_ENFERMAGEM : NAV_GROUPS_MASTER));

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 shadow-sm">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0D47A1] flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm leading-tight">Alphasonic</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              {isAdmin ? "Master" : isEnfermagem ? "Enfermagem" : "Módulo"}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest px-3 mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ id, label, icon: Icon, path }) => {
                const isActive = activePage === id;
                return (
                  <Link
                    key={id}
                    to={path}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "bg-[#0D47A1] text-white shadow-md shadow-blue-200"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="leading-tight">{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 text-center">ONA & ISO 9001 · v1.0</p>
      </div>
    </aside>
  );
}