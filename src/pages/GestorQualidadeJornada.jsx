import { useState } from "react";
import { Users, Clock, ShieldCheck, AlertTriangle, Search, Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Sparkline simples ──────────────────────────────────────────────────────
function Sparkline({ data }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-7">
      {data.map((v, i) => (
        <div
          key={i}
          className={cn("w-1 rounded-sm", i === data.length - 1 ? "bg-blue-600" : "bg-blue-200")}
          style={{ height: `${Math.round((v / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

// ── Status Pill ────────────────────────────────────────────────────────────
function Pill({ color, children }) {
  const colors = {
    green:  "bg-green-50 text-green-700 border border-green-200",
    yellow: "bg-yellow-50 text-yellow-700 border border-yellow-300",
    red:    "bg-red-50 text-red-700 border border-red-200",
    gray:   "bg-gray-100 text-gray-400 border border-gray-200",
    blue:   "bg-blue-50 text-blue-700 border border-blue-200",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap", colors[color])}>
      {children}
    </span>
  );
}

// ── Botão Validar Time-Out ──────────────────────────────────────────────────────────
function ValidarBtn({ onValidate }) {
  return (
    <button
      onClick={onValidate}
      className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-yellow-100 text-yellow-800 border border-yellow-400 hover:bg-yellow-200 transition-colors"
    >
      ⚠️ Validar Time-Out
    </button>
  );
}

// ── KPI Card ───────────────────────────────────────────────────────────────
function KPICard({ icon: Icon, iconBg, iconColor, title, value, badge, badgeColor }) {
  const badgeColors = {
    green: "bg-green-50 text-green-700",
    red:   "bg-red-50 text-red-700",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", iconBg)}>
        <Icon className={cn("w-5 h-5", iconColor)} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-tight">{title}</p>
        <p className="text-2xl font-extrabold text-gray-800 mt-0.5 leading-tight">{value}</p>
        {badge && (
          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block", badgeColors[badgeColor])}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Dados dos pacientes ────────────────────────────────────────────────────
const PACIENTES_INICIAIS = [
  {
    id: "TC-0041", nome: "Maria Luiza", modalidade: "Tomografia",
    recepcao: { status: "green", label: "✓ Confirmado", hora: "08:14" },
    preparo:  { status: "green", label: "✓ Preparo OK", hora: "08:28" },
    sala:     { status: "green", label: "✓ Time-Out OK", hora: "08:35", validar: false },
    laudo:    { status: "green", label: "✓ Assinado",   hora: "09:04" },
    statusFinal: { color: "green", label: "🟢 Concluído", tat: "50 min" },
    critico: false,
  },
  {
    id: "RM-0078", nome: "Roberto Ferreira", modalidade: "Ressonância",
    recepcao: { status: "green",  label: "✓ Confirmado", hora: "09:50" },
    preparo:  { status: "green",  label: "✓ Acesso OK",  hora: "10:05" },
    sala:     { status: "yellow", label: "⏳ Em Exame",  hora: "10:20", validar: false },
    laudo:    { status: "gray",   label: "Aguardando",   hora: "" },
    statusFinal: { color: "yellow", label: "🟡 Andamento", tat: "45 min" },
    critico: false,
  },
  {
    id: "TC-0092", nome: "João Pedro Souza", modalidade: "Tomografia",
    recepcao: { status: "green", label: "✓ Confirmado", hora: "10:30" },
    preparo:  { status: "green", label: "✓ Preparo OK", hora: "10:45" },
    sala:     { status: "red",   label: "🔴 Atrasado",  hora: "",      validar: true },
    laudo:    { status: "gray",  label: "Bloqueado",    hora: "" },
    statusFinal: { color: "red", label: "🔴 Alerta", tat: "1h 10min" },
    critico: true,
  },
  {
    id: "RX-0112", nome: "Ana Clara", modalidade: "Raio-X",
    recepcao: { status: "green", label: "✓ Confirmado", hora: "11:00" },
    preparo:  { status: "gray",  label: "— N/A",        hora: "" },
    sala:     { status: "green", label: "✓ Time-Out OK", hora: "11:08", validar: false },
    laudo:    { status: "green", label: "✓ Assinado",   hora: "11:30" },
    statusFinal: { color: "green", label: "🟢 Concluído", tat: "30 min" },
    critico: false,
  },
];

// ── Página Principal (Versão Qualidade) ───────────────────────────────────────────────────────
export default function GestorQualidadeJornada() {
  const [pacientes, setPacientes] = useState(PACIENTES_INICIAIS);
  const [busca, setBusca] = useState("");
  const [filtroModalidade, setFiltroModalidade] = useState("Todas");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroAlerta, setFiltroAlerta] = useState("Todos");
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split("T")[0]);

  const validarTimeout = (id) => {
    setPacientes(prev => prev.map(p => {
      if (p.id !== id) return p;
      return {
        ...p,
        critico: false,
        sala: { status: "green", label: "✓ Time-Out OK", hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), validar: false },
        statusFinal: { color: "green", label: "🟢 Regularizado", tat: p.statusFinal.tat },
      };
    }));
  };

  const filtrados = pacientes.filter(p => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase()) || p.id.toLowerCase().includes(busca.toLowerCase());
    const matchModalidade = filtroModalidade === "Todas" || p.modalidade === filtroModalidade;
    const matchStatus = filtroStatus === "Todos" || p.statusFinal.color === filtroStatus;
    const matchAlerta = filtroAlerta === "Todos" || (filtroAlerta === "Crítico" ? p.critico : !p.critico);
    return matchBusca && matchModalidade && matchStatus && matchAlerta;
  });

  return (
    <div className="space-y-5">

      {/* KPI Cards — Visão de Qualidade */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          icon={Users} iconBg="bg-blue-50" iconColor="text-blue-600"
          title="Pacientes Hoje" value="148"
          badge="↑ 8% vs. ontem" badgeColor="green"
        />
        <KPICard
          icon={Clock} iconBg="bg-emerald-50" iconColor="text-emerald-600"
          title="TAT Médio (Chegada → Laudo)" value="1h 22m"
          badge="🟢 8 min abaixo da meta" badgeColor="green"
        />
        <KPICard
          icon={ShieldCheck} iconBg="bg-blue-50" iconColor="text-blue-700"
          title="Adesão ao Time-Out" value="99,1%"
          badge="🟢 Conformidade" badgeColor="green"
        />
        <KPICard
          icon={AlertTriangle} iconBg="bg-red-50" iconColor="text-red-500"
          title="Alertas de Atraso (>2h)" value="6"
          badge="🔴 Ação Necessária" badgeColor="red"
        />
      </div>

      {/* Tabela de Rastreabilidade */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Cabeçalho da seção */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-bold text-gray-800 text-sm">Rastreabilidade da Jornada (Visão Qualidade)</h2>
            <p className="text-xs text-gray-400 mt-0.5">Monitoramento de Conformidade: Recepção → Preparo → Sala → Laudo</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
            {/* NPS mini card */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2 border border-gray-100">
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">NPS</p>
                <p className="text-xl font-extrabold text-blue-700">76</p>
              </div>
              <Sparkline data={[58, 61, 65, 67, 70, 72, 74, 76]} />
            </div>
          </div>
        </div>

        {/* Filtros + Busca + Data */}
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex flex-wrap items-center gap-3">
          {/* Busca */}
          <div className="relative min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar paciente ou ID..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 w-full transition-all"
            />
          </div>

          {/* Modalidade */}
          <div className="relative">
            <select
              value={filtroModalidade}
              onChange={e => setFiltroModalidade(e.target.value)}
              className="appearance-none text-xs bg-white border border-gray-200 rounded-lg pl-3 pr-7 py-2 text-gray-600 outline-none focus:border-blue-400 cursor-pointer transition-all"
            >
              {["Todas", "Tomografia", "Ressonância", "Raio-X", "Ultrassom", "Mamografia"].map(o => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={filtroStatus}
              onChange={e => setFiltroStatus(e.target.value)}
              className="appearance-none text-xs bg-white border border-gray-200 rounded-lg pl-3 pr-7 py-2 text-gray-600 outline-none focus:border-blue-400 cursor-pointer transition-all"
            >
              {[["Todos","Todos"],["Concluído","green"],["Em Andamento","yellow"],["Alerta","red"]].map(([label, val]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>

          {/* Alertas */}
          <div className="relative">
            <select
              value={filtroAlerta}
              onChange={e => setFiltroAlerta(e.target.value)}
              className="appearance-none text-xs bg-white border border-gray-200 rounded-lg pl-3 pr-7 py-2 text-gray-600 outline-none focus:border-blue-400 cursor-pointer transition-all"
            >
              <option>Todos</option>
              <option>Crítico</option>
              <option>Sem Alerta</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>

          {/* Calendário / Data */}
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

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Paciente & ID", "Modalidade", "Chegada / Recepção (ID OK)", "Preparo / Acesso (Enferm.)", "Sala / Exame (Time-Out)", "Laudo (Resid/Staff)", "Status / TAT Total"].map(col => (
                  <th key={col} className="text-left px-4 py-3 font-semibold text-gray-400 uppercase tracking-wider text-[10px] whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(p => (
                <tr
                  key={p.id}
                  className={cn(
                    "border-b border-gray-50 transition-colors",
                    p.critico ? "bg-red-50 hover:bg-red-100" : "hover:bg-gray-50"
                  )}
                >
                  {/* Paciente */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-semibold text-gray-800">{p.nome}</p>
                      {p.critico && <Pill color="red">Crítico</Pill>}
                    </div>
                    <Pill color="gray">{p.id}</Pill>
                  </td>

                  {/* Modalidade */}
                  <td className="px-4 py-3.5 text-gray-500 font-medium">{p.modalidade}</td>

                  {/* Recepção */}
                  <td className="px-4 py-3.5">
                    <Pill color={p.recepcao.status}>{p.recepcao.label}</Pill>
                    {p.recepcao.hora && <p className="text-[10px] text-gray-400 mt-0.5">{p.recepcao.hora}</p>}
                  </td>

                  {/* Preparo */}
                  <td className="px-4 py-3.5">
                    <Pill color={p.preparo.status}>{p.preparo.label}</Pill>
                    {p.preparo.hora && <p className="text-[10px] text-gray-400 mt-0.5">{p.preparo.hora}</p>}
                  </td>

                  {/* Sala */}
                  <td className="px-4 py-3.5">
                    <Pill color={p.sala.status}>{p.sala.label}</Pill>
                    {p.sala.hora && <p className="text-[10px] text-gray-400 mt-0.5">{p.sala.hora}</p>}
                    {p.sala.validar && <ValidarBtn onValidate={() => validarTimeout(p.id)} />}
                  </td>

                  {/* Laudo */}
                  <td className="px-4 py-3.5">
                    <Pill color={p.laudo.status}>{p.laudo.label}</Pill>
                    {p.laudo.hora && <p className="text-[10px] text-gray-400 mt-0.5">{p.laudo.hora}</p>}
                  </td>

                  {/* Status Final */}
                  <td className="px-4 py-3.5">
                    <Pill color={p.statusFinal.color}>{p.statusFinal.label}</Pill>
                    <p className={cn("text-[11px] font-semibold mt-0.5",
                      p.statusFinal.color === "red" ? "text-red-500" :
                      p.statusFinal.color === "yellow" ? "text-yellow-600" : "text-gray-400"
                    )}>
                      {p.statusFinal.tat}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rodapé */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            Exibindo {filtrados.length} de 148 atendimentos ·{" "}
            <span className="text-red-500 font-semibold">
              {pacientes.filter(p => p.critico).length} alerta{pacientes.filter(p => p.critico).length !== 1 ? "s" : ""} ativo{pacientes.filter(p => p.critico).length !== 1 ? "s" : ""}
            </span>
          </span>
        </div>
      </div>

    </div>
  );
}