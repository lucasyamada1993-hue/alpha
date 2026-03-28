import { useState } from "react";
import { Wrench, Gauge, ShieldCheck, Plus, AlertTriangle, CheckCircle2, Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "manutencoes", label: "Manutenções & Calibrações", icon: Wrench },
  { id: "dosimetria", label: "Controle de Dosimetria", icon: Gauge },
  { id: "epis", label: "Checklist de EPIs", icon: ShieldCheck },
];

const MANUTENCOES = [
  { id: 1, equipamento: "Tomógrafo Siemens SOMATOM", tipoEquip: "Tomografia", tipo: "Preventiva", data: "15/03/2026", executado: "Eng. Clínico João P.", validado: "Coord. Técnico Marcos", status: "ok", vencimento: "15/06/2026" },
  { id: 2, equipamento: "Mamógrafo Hologic", tipoEquip: "Mamografia", tipo: "Constância (QC)", data: "01/04/2026", executado: "—", validado: "—", status: "agendado", vencimento: "01/04/2026" },
  { id: 3, equipamento: "Raio-X Philips DigitalDiagnost", tipoEquip: "Raio-X", tipo: "Calibração", data: "20/02/2026", executado: "Técnico Fábio Lima", validado: "Coord. Técnico Marcos", status: "ok", vencimento: "20/08/2026" },
  { id: 4, equipamento: "Ressonância GE 3T", tipoEquip: "Ressonância", tipo: "Corretiva", data: "10/03/2026", executado: "Serv. GE Healthcare", validado: "Pendente", status: "pendente", vencimento: "—" },
];

const DOSIMETRIA = [
  { id: 1, profissional: "Carlos Lima (CRTR)", mes: "Mar/2026", dose_recebida: "0.12 mSv", limite_mensal: "4.17 mSv", limite_anual: "50 mSv", status: "ok" },
  { id: 2, profissional: "Fernanda Melo (CRTR)", mes: "Mar/2026", dose_recebida: "0.09 mSv", limite_mensal: "4.17 mSv", limite_anual: "50 mSv", status: "ok" },
  { id: 3, profissional: "Ricardo Neves (CRTR)", mes: "Mar/2026", dose_recebida: "3.98 mSv", limite_mensal: "4.17 mSv", limite_anual: "50 mSv", status: "alerta" },
  { id: 4, profissional: "Dra. Paula Teixeira (CRM)", mes: "Mar/2026", dose_recebida: "0.04 mSv", limite_mensal: "4.17 mSv", limite_anual: "50 mSv", status: "ok" },
];

const EPI_CHECKLISTS = [
  { id: 1, data: "28/03/2026", setor: "Tomografia", avental_chumbo_equipe: true, protetor_tireoide_paciente: true, avental_paciente: false, oculos_pb: true, responsavel: "Carlos Lima" },
  { id: 2, data: "28/03/2026", setor: "Raio-X Geral", avental_chumbo_equipe: true, protetor_tireoide_paciente: true, avental_paciente: true, oculos_pb: false, responsavel: "Fernanda Melo" },
  { id: 3, data: "27/03/2026", setor: "Mamografia", avental_chumbo_equipe: true, protetor_tireoide_paciente: true, avental_paciente: true, oculos_pb: true, responsavel: "Ana Beatriz" },
];

function StatusChip({ status }) {
  const map = {
    ok: { label: "✓ Conforme", cls: "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold" },
    pendente: { label: "⏳ Pendente", cls: "bg-amber-50 text-amber-700 border-amber-300 font-semibold" },
    agendado: { label: "📅 Agendado", cls: "bg-blue-50 text-blue-700 border-blue-300 font-semibold" },
    alerta: { label: "⚠ Próximo ao Limite", cls: "bg-orange-50 text-orange-700 border-orange-300 font-semibold" },
    excedido: { label: "🔴 EXCEDIDO", cls: "bg-red-50 text-red-700 border-red-300 font-bold" },
  };
  const c = map[status] || map.pendente;
  return <span className={cn("inline-block px-2.5 py-1 rounded-full text-xs border", c.cls)}>{c.label}</span>;
}

function BoolIcon({ val }) {
  return val
    ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
    : <AlertTriangle className="w-4 h-4 text-red-400 mx-auto" />;
}

export default function GestorEquipamentos() {
  const [activeTab, setActiveTab] = useState("manutencoes");
  const [filtroTipoEquip, setFiltroTipoEquip] = useState("Todos");
  const [filtroStatusManu, setFiltroStatusManu] = useState("Todos");
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split("T")[0]);
  const [filtroTipoEquipDosimetria, setFiltroTipoEquipDosimetria] = useState("Todos");

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Equipamentos Conformes", value: "6/8", sub: "Calibrações em dia", color: "border-l-emerald-500" },
          { label: "Manutenções Vencendo", value: "1", sub: "Nos próximos 7 dias", color: "border-l-amber-500" },
          { label: "Dosímetros com Alerta", value: "1", sub: "Ricardo Neves", color: "border-l-orange-500" },
          { label: "Checklists EPIs Hoje", value: "3", sub: "Setores auditados", color: "border-l-blue-500" },
        ].map((k) => (
          <div key={k.label} className={cn("bg-white rounded-xl p-4 border border-gray-100 border-l-4 shadow-sm", k.color)}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 leading-tight">{k.label}</p>
            <p className="text-2xl font-extrabold text-gray-800">{k.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
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

      {activeTab === "manutencoes" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Registro de Manutenções, Calibrações e Testes de Constância</h3>
              <p className="text-xs text-gray-400 mt-0.5">Raio-X, TC, RM, Mamógrafo</p>
            </div>
            <button className="flex items-center gap-1.5 bg-[#0D47A1] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#0B3D91] transition-colors">
              <Plus className="w-3.5 h-3.5" /> Novo Registro
            </button>
          </div>

          {/* Filtros */}
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex flex-wrap items-center gap-3">
            {/* Tipo de Equipamento */}
            <div className="relative">
              <select
                value={filtroTipoEquip}
                onChange={e => setFiltroTipoEquip(e.target.value)}
                className="appearance-none text-xs bg-white border border-gray-200 rounded-lg pl-3 pr-7 py-2 text-gray-600 outline-none focus:border-blue-400 cursor-pointer transition-all"
              >
                {["Todos", "Tomografia", "Raio-X", "Ressonância", "Mamografia", "Ultrassom"].map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>

            {/* Status */}
            <div className="relative">
              <select
                value={filtroStatusManu}
                onChange={e => setFiltroStatusManu(e.target.value)}
                className="appearance-none text-xs bg-white border border-gray-200 rounded-lg pl-3 pr-7 py-2 text-gray-600 outline-none focus:border-blue-400 cursor-pointer transition-all"
              >
                <option>Todos</option>
                <option value="ok">Conforme</option>
                <option value="agendado">Agendado</option>
                <option value="pendente">Pendente</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>

            {/* Calendário */}
            <div className="relative flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg pl-3 pr-3 py-2 text-xs text-gray-600 focus-within:border-blue-400 transition-all">
              <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input
                type="date"
                value={dataSelecionada}
                onChange={e => setDataSelecionada(e.target.value)}
                className="outline-none bg-transparent text-xs text-gray-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Equipamento</th>
                <th className="px-4 py-3 text-left">Tipo Equip.</th>
                <th className="px-4 py-3 text-left">Tipo Manuten.</th>
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3 text-left">Executado por</th>
                <th className="px-4 py-3 text-left">Validado por</th>
                <th className="px-4 py-3 text-left">Próxima</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr></thead>
              <tbody>
                {MANUTENCOES.filter(r => 
                  (filtroTipoEquip === "Todos" || r.tipoEquip === filtroTipoEquip) &&
                  (filtroStatusManu === "Todos" || r.status === filtroStatusManu)
                ).map((r) => {
                  const rowColor = r.status === "pendente" ? "bg-amber-50" : r.status === "agendado" ? "bg-blue-50" : "";
                  return (
                  <tr key={r.id} className={cn("border-t border-gray-50 hover:opacity-90 transition-colors", rowColor)}>
                    <td className="px-4 py-3 font-medium text-gray-700 text-sm">{r.equipamento}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 font-semibold">{r.tipoEquip}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.tipo}</td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">{r.data}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.executado}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.validado}</td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">{r.vencimento}</td>
                    <td className="px-4 py-3"><StatusChip status={r.status} /></td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "dosimetria" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Controle Mensal de Dosimetria</h3>
              <p className="text-xs text-gray-400 mt-0.5">Limite anual: 50 mSv · Limite mensal: 4,17 mSv</p>
            </div>
            <button className="flex items-center gap-1.5 bg-[#0D47A1] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#0B3D91] transition-colors">
              <Plus className="w-3.5 h-3.5" /> Novo Lançamento
            </button>
          </div>

          {/* Filtros */}
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex flex-wrap items-center gap-3">
            {/* Tipo de Equipamento */}
            <div className="relative">
              <select
                value={filtroTipoEquipDosimetria}
                onChange={e => setFiltroTipoEquipDosimetria(e.target.value)}
                className="appearance-none text-xs bg-white border border-gray-200 rounded-lg pl-3 pr-7 py-2 text-gray-600 outline-none focus:border-blue-400 cursor-pointer transition-all"
              >
                {["Todos", "Tomografia", "Raio-X", "Ressonância", "Mamografia"].map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Profissional</th>
                <th className="px-4 py-3 text-left">Mês</th>
                <th className="px-4 py-3 text-center">Dose Recebida</th>
                <th className="px-4 py-3 text-center">Limite Mensal</th>
                <th className="px-4 py-3 text-center">Limite Anual</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr></thead>
              <tbody>
                {DOSIMETRIA.filter(() => filtroTipoEquipDosimetria === "Todos").map((r) => {
                  const rowColor = r.status === "alerta" ? "bg-orange-50" : r.status === "ok" ? "bg-emerald-50" : "";
                  return (
                  <tr key={r.id} className={cn("border-t border-gray-50 hover:opacity-90 transition-colors", rowColor)}>
                    <td className="px-4 py-3 font-medium text-gray-700">{r.profissional}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.mes}</td>
                    <td className="px-4 py-3 text-center text-xs font-mono font-semibold text-gray-700">{r.dose_recebida}</td>
                    <td className="px-4 py-3 text-center text-xs text-gray-400">{r.limite_mensal}</td>
                    <td className="px-4 py-3 text-center text-xs text-gray-400">{r.limite_anual}</td>
                    <td className="px-4 py-3"><StatusChip status={r.status} /></td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "epis" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Checklist Auditável de EPIs</h3>
              <p className="text-xs text-gray-400 mt-0.5">Coletes de chumbo, protetores de tireoide e óculos Pb</p>
            </div>
            <button className="flex items-center gap-1.5 bg-[#0D47A1] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#0B3D91] transition-colors">
              <Plus className="w-3.5 h-3.5" /> Novo Checklist
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3 text-left">Setor</th>
                <th className="px-4 py-3 text-center">Avental Pb (Equipe)</th>
                <th className="px-4 py-3 text-center">Protetor Tireoide (Pac.)</th>
                <th className="px-4 py-3 text-center">Avental (Pac.)</th>
                <th className="px-4 py-3 text-center">Óculos Pb</th>
                <th className="px-4 py-3 text-left">Responsável</th>
              </tr></thead>
              <tbody>
                {EPI_CHECKLISTS.map((r) => {
                  const hasAllEPIs = r.avental_chumbo_equipe && r.protetor_tireoide_paciente && r.avental_paciente && r.oculos_pb;
                  const rowColor = hasAllEPIs ? "bg-emerald-50" : "bg-orange-50";
                  return (
                  <tr key={r.id} className={cn("border-t border-gray-50 hover:opacity-90 transition-colors", rowColor)}>
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">{r.data}</td>
                    <td className="px-4 py-3 font-medium text-gray-700">{r.setor}</td>
                    <td className="px-4 py-3 text-center"><BoolIcon val={r.avental_chumbo_equipe} /></td>
                    <td className="px-4 py-3 text-center"><BoolIcon val={r.protetor_tireoide_paciente} /></td>
                    <td className="px-4 py-3 text-center"><BoolIcon val={r.avental_paciente} /></td>
                    <td className="px-4 py-3 text-center"><BoolIcon val={r.oculos_pb} /></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.responsavel}</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}