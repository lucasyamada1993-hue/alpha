import { Bell, ChevronDown } from "lucide-react";

const PAGE_TITLES = {
  "visao-geral": "Visão Geral",
  "jornada": "Rastreabilidade da Jornada do Paciente",
  "equipamentos": "Equipamentos & Radioproteção",
  "qualidade": "Qualidade & Não Conformidades",
  "lgpd": "Segurança da Informação & LGPD",
  "treinamentos": "Treinamentos & Competência",
  "melhoria": "Melhoria Contínua",
  "pesquisas": "Gestão de Pesquisas",
};

const PAGE_SUBTITLES = {
  "visao-geral": "Painel de indicadores · Alphasonic",
  "jornada": "Auditoria ONA · Identificação, Time-out, TAT e Insumos",
  "equipamentos": "Manutenções, Calibrações, Dosimetria e EPIs",
  "qualidade": "PDCA · POPs, Eventos Adversos, CAPA e Near Miss",
  "lgpd": "Logs de acesso, Permissões e Assinatura Digital",
  "treinamentos": "Matriz de treinamentos, Habilitações e Vencimentos",
  "melhoria": "5 Porquês · Ishikawa · 5W3H · Plano A3",
  "pesquisas": "Gerencie as perguntas exibidas aos pacientes",
};

export default function GestorHeader({ activePage }) {
  const title = PAGE_TITLES[activePage] || "Dashboard";
  const subtitle = PAGE_SUBTITLES[activePage] || "Atualizado agora · Clínica de Radiologia";

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notificações */}
        <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Usuário */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-[#0D47A1] flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">Administrador</p>
            <p className="text-xs text-gray-400">Alphasonic</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
    </header>
  );
}