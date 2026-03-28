import { useState } from "react";
import { Eye, UserCog, PenLine, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "logs", label: "Logs de Acesso", icon: Eye },
  { id: "permissoes", label: "Controle de Permissões", icon: UserCog },
  { id: "assinaturas", label: "Assinaturas Digitais", icon: PenLine },
];

const LOGS = [
  { id: 1, usuario: "Dra. Ana Teixeira (CRM-12345)", acao: "Visualizou laudo", recurso: "Paciente: Maria Silva — TC Tórax", ip: "192.168.1.10", data: "28/03/2026 08:55" },
  { id: 2, usuario: "Carlos Lima (CRTR-5678)", acao: "Exportou imagem PACS", recurso: "Paciente: João Pereira — RX Joelho", ip: "192.168.1.14", data: "28/03/2026 09:22" },
  { id: 3, usuario: "Admin (Coord. Marcos)", acao: "Alterou cadastro", recurso: "Paciente: Roberto Alves — dados pessoais", ip: "192.168.1.2", data: "27/03/2026 16:40" },
  { id: 4, usuario: "Fernanda Melo (CRTR-9012)", acao: "Visualizou prontuário", recurso: "Paciente: Carla Ramos — RM Ombro", ip: "192.168.1.15", data: "27/03/2026 14:12" },
];

const PERMISSOES = [
  { id: 1, usuario: "Dra. Ana Teixeira", perfil: "Médico Radiologista", concedido_por: "Admin Marcos", data: "01/01/2026", permissoes: "Assinar laudos, visualizar PACS, exportar relatórios", status: "ativo" },
  { id: 2, usuario: "Carlos Lima", perfil: "Tecnólogo Radiologia", concedido_por: "Admin Marcos", data: "01/01/2026", permissoes: "Registrar exames, acessar protocolos", status: "ativo" },
  { id: 3, usuario: "Bruna Costa", perfil: "Recepcionista", concedido_por: "Admin Marcos", data: "15/02/2026", permissoes: "Agendamento, cadastro de pacientes", status: "ativo" },
  { id: 4, usuario: "Dr. Fábio Ramos (ex-colaborador)", perfil: "Médico", concedido_por: "Admin Marcos", data: "10/03/2026", permissoes: "Todos os acessos revogados", status: "revogado" },
];

const ASSINATURAS = [
  { id: 1, medico: "Dra. Ana Teixeira (CRM-12345)", laudo: "TC de Tórax — Maria Silva", tipo: "ICP-Brasil A3", data: "28/03/2026 09:40", hash: "SHA256:a3f8...c9d1", status: "valido" },
  { id: 2, medico: "Dra. Ana Teixeira (CRM-12345)", laudo: "RX Joelho — João Pereira", tipo: "ICP-Brasil A3", data: "28/03/2026 09:55", hash: "SHA256:b71e...f4a2", status: "valido" },
  { id: 3, medico: "Dr. Paulo Mendes (CRM-54321)", laudo: "US Abdominal — Carla Ramos", tipo: "ICP-Brasil A3", data: "27/03/2026 11:30", hash: "SHA256:c55d...08b7", status: "valido" },
];

function StatusBadge({ status, map }) {
  const c = map[status] || map[Object.keys(map)[0]];
  return <span className={cn("inline-block px-2.5 py-1 rounded-full text-xs font-semibold border", c.cls)}>{c.label}</span>;
}

const STATUS_PERMISSAO = {
  ativo: { label: "Ativo", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  revogado: { label: "Revogado", cls: "bg-red-50 text-red-700 border-red-200" },
};

const STATUS_ASSINATURA = {
  valido: { label: "Válido (ICP-Brasil)", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  invalido: { label: "Inválido", cls: "bg-red-50 text-red-700 border-red-200" },
};

export default function GestorLGPD() {
  const [activeTab, setActiveTab] = useState("logs");

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Acessos Registrados Hoje", value: "47", sub: "4 usuários ativos", color: "border-l-blue-500" },
          { label: "Exportações de Dados", value: "3", sub: "Imagens PACS exportadas", color: "border-l-amber-500" },
          { label: "Permissões Ativas", value: "3", sub: "1 revogada hoje", color: "border-l-emerald-500" },
          { label: "Laudos Assinados ICP", value: "3", sub: "100% válidos", color: "border-l-purple-500" },
        ].map((k) => (
          <div key={k.label} className={cn("bg-white rounded-xl p-4 border border-gray-100 border-l-4 shadow-sm", k.color)}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 leading-tight">{k.label}</p>
            <p className="text-2xl font-extrabold text-gray-800">{k.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border",
              activeTab === id ? "bg-[#0D47A1] text-white border-[#0D47A1] shadow-md shadow-blue-200" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            )}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {activeTab === "logs" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">Trilha de Auditoria — Logs de Acesso ao Sistema</h3>
            <p className="text-xs text-gray-400 mt-0.5">Visualizações, alterações, exportações e exclusões de dados sensíveis</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Data / Hora</th>
                <th className="px-4 py-3 text-left">Usuário</th>
                <th className="px-4 py-3 text-left">Ação</th>
                <th className="px-4 py-3 text-left">Recurso Acessado</th>
                <th className="px-4 py-3 text-left">IP</th>
              </tr></thead>
              <tbody>
                {LOGS.map((r) => (
                  <tr key={r.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-gray-400">{r.data}</td>
                    <td className="px-4 py-3 font-medium text-gray-700 text-sm">{r.usuario}</td>
                    <td className="px-4 py-3"><span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200 font-medium">{r.acao}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.recurso}</td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-400">{r.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "permissoes" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Controle de Permissões de Acesso</h3>
              <p className="text-xs text-gray-400 mt-0.5">Auditoria de concessão e revogação de acessos</p>
            </div>
            <button className="flex items-center gap-1.5 bg-[#0D47A1] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#0B3D91] transition-colors">
              <Plus className="w-3.5 h-3.5" /> Conceder Acesso
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Usuário</th>
                <th className="px-4 py-3 text-left">Perfil</th>
                <th className="px-4 py-3 text-left">Concedido por</th>
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3 text-left">Permissões</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr></thead>
              <tbody>
                {PERMISSOES.map((r) => (
                  <tr key={r.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-700">{r.usuario}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.perfil}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.concedido_por}</td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-400">{r.data}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-[200px]">{r.permissoes}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} map={STATUS_PERMISSAO} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "assinaturas" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">Rastreabilidade de Assinaturas Digitais</h3>
            <p className="text-xs text-gray-400 mt-0.5">Assinaturas ICP-Brasil dos laudos radiológicos</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Médico (CRM)</th>
                <th className="px-4 py-3 text-left">Laudo</th>
                <th className="px-4 py-3 text-left">Tipo Cert.</th>
                <th className="px-4 py-3 text-left">Data / Hora</th>
                <th className="px-4 py-3 text-left">Hash</th>
                <th className="px-4 py-3 text-left">Validade</th>
              </tr></thead>
              <tbody>
                {ASSINATURAS.map((r) => (
                  <tr key={r.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-700">{r.medico}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.laudo}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-purple-700">{r.tipo}</td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-400">{r.data}</td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-400">{r.hash}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} map={STATUS_ASSINATURA} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}