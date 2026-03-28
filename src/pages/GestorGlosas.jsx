import { useState, useMemo } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Plus, ChevronDown, Calendar, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Dados simulados
const GLOSAS = [
  { id: 1, id_fatura: "FAT-2026-001", convenio: "Unimed", valor_original: 5000, valor_glosado: 800, motivo_glosa: "Reembolso reduzido por negociação", status: "Resolvida", data_glosa: "01/02/2026", data_resolucao: "15/02/2026", responsavel_resolucao: "Carlos Lima", dias_resolucao: 14 },
  { id: 2, id_fatura: "FAT-2026-002", convenio: "Bradesco Saúde", valor_original: 3200, valor_glosado: 320, motivo_glosa: "Procedimento fora da cobertura", status: "Em Recurso", data_glosa: "05/03/2026", data_resolucao: null, responsavel_resolucao: "—", dias_resolucao: null },
  { id: 3, id_fatura: "FAT-2026-003", convenio: "Unimed", valor_original: 7500, valor_glosado: 1500, motivo_glosa: "Documentação incompleta", status: "Aberta", data_glosa: "10/03/2026", data_resolucao: null, responsavel_resolucao: "—", dias_resolucao: null },
  { id: 4, id_fatura: "FAT-2026-004", convenio: "Amil", valor_original: 4200, valor_glosado: 420, motivo_glosa: "Valor excede tabela", status: "Resolvida", data_glosa: "12/03/2026", data_resolucao: "20/03/2026", responsavel_resolucao: "Fernanda Melo", dias_resolucao: 8 },
  { id: 5, id_fatura: "FAT-2026-005", convenio: "Sulamerica", valor_original: 2800, valor_glosado: 560, motivo_glosa: "Falta de autorização prévia", status: "Em Recurso", data_glosa: "15/03/2026", data_resolucao: null, responsavel_resolucao: "—", dias_resolucao: null },
  { id: 6, id_fatura: "FAT-2026-006", convenio: "Bradesco Saúde", valor_original: 6100, valor_glosado: 1220, motivo_glosa: "Procedimento fora da cobertura", status: "Resolvida", data_glosa: "18/03/2026", data_resolucao: "25/03/2026", responsavel_resolucao: "Ana Beatriz", dias_resolucao: 7 },
];

function StatusBadge({ status }) {
  const map = {
    "Aberta": { label: "Aberta", cls: "bg-red-50 text-red-700 border-red-200" },
    "Em Recurso": { label: "Em Recurso", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    "Resolvida": { label: "Resolvida", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  };
  const c = map[status] || map["Aberta"];
  return <span className={cn("inline-block px-2.5 py-1 rounded-full text-xs font-semibold border", c.cls)}>{c.label}</span>;
}

export default function GestorGlosas() {
  const [busca, setBusca] = useState("");
  const [filtroConvenio, setFiltroConvenio] = useState("Todos");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split("T")[0]);

  // Dados filtrados
  const filtrados = useMemo(() => {
    return GLOSAS.filter(g => {
      const matchBusca = g.id_fatura.toLowerCase().includes(busca.toLowerCase()) || g.convenio.toLowerCase().includes(busca.toLowerCase());
      const matchConvenio = filtroConvenio === "Todos" || g.convenio === filtroConvenio;
      const matchStatus = filtroStatus === "Todos" || g.status === filtroStatus;
      return matchBusca && matchConvenio && matchStatus;
    });
  }, [busca, filtroConvenio, filtroStatus]);

  // KPIs
  const totalGlosas = GLOSAS.reduce((sum, g) => sum + g.valor_glosado, 0);
  const glosasAbertas = GLOSAS.filter(g => g.status === "Aberta").length;
  const tempoMedioResolucao = GLOSAS.filter(g => g.dias_resolucao).length > 0
    ? Math.round(GLOSAS.filter(g => g.dias_resolucao).reduce((sum, g) => sum + g.dias_resolucao, 0) / GLOSAS.filter(g => g.dias_resolucao).length)
    : 0;

  // Gráfico por convênio
  const dataConvenio = GLOSAS.reduce((acc, g) => {
    const existing = acc.find(item => item.convenio === g.convenio);
    if (existing) {
      existing.valor += g.valor_glosado;
    } else {
      acc.push({ convenio: g.convenio, valor: g.valor_glosado });
    }
    return acc;
  }, []);

  // Gráfico por motivo
  const dataMotivo = GLOSAS.reduce((acc, g) => {
    const existing = acc.find(item => item.motivo === g.motivo_glosa);
    if (existing) {
      existing.quantidade += 1;
    } else {
      acc.push({ motivo: g.motivo_glosa, quantidade: 1 });
    }
    return acc;
  }, []);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#06b6d4"];

  const convenios = ["Todos", ...new Set(GLOSAS.map(g => g.convenio))];
  const statuses = ["Todos", "Aberta", "Em Recurso", "Resolvida"];

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Valor Total de Glosas", value: `R$ ${(totalGlosas / 1000).toFixed(1)}k`, sub: "Acumulado", color: "border-l-red-500" },
          { label: "Glosas Abertas", value: glosasAbertas, sub: "Requerem ação", color: "border-l-amber-500" },
          { label: "Tempo Médio de Resolução", value: `${tempoMedioResolucao} dias`, sub: "Média de resolução", color: "border-l-emerald-500" },
          { label: "Taxa de Resolução", value: `${Math.round((GLOSAS.filter(g => g.status === "Resolvida").length / GLOSAS.length) * 100)}%`, sub: "Glosas encerradas", color: "border-l-blue-500" },
        ].map((k) => (
            <div key={k.label} className={cn("bg-white rounded-xl p-4 border border-gray-100 border-l-4 shadow-sm", k.color)}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 leading-tight">{k.label}</p>
              <p className="text-2xl font-extrabold text-gray-800">{k.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
            </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Glosas por Convênio</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={dataConvenio}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="convenio" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={(v) => `R$ ${v}`} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} formatter={(v) => `R$ ${v}`} />
              <Bar dataKey="valor" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Distribuição por Motivo</h3>
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={dataMotivo}
                dataKey="quantidade"
                nameKey="motivo"
                cx="50%"
                cy="38%"
                outerRadius={85}
              >
                {dataMotivo.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} ocorrência(s)`} />
              <Legend verticalAlign="bottom" height={35} wrapperStyle={{ paddingTop: 5, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Gestão de Glosas Faturárias</h3>
            <p className="text-xs text-gray-400 mt-0.5">Rastreamento de reembolsos negados e em recurso</p>
          </div>
          <button className="flex items-center gap-1.5 bg-[#0D47A1] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#0B3D91] transition-colors">
            <Plus className="w-3.5 h-3.5" /> Nova Glosa
          </button>
        </div>

        {/* Filtros */}
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar fatura ou convênio..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 w-full transition-all"
            />
          </div>

          <div className="relative">
            <select
              value={filtroConvenio}
              onChange={e => setFiltroConvenio(e.target.value)}
              className="appearance-none text-xs bg-white border border-gray-200 rounded-lg pl-3 pr-7 py-2 text-gray-600 outline-none focus:border-blue-400 cursor-pointer transition-all"
            >
              {convenios.map(o => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filtroStatus}
              onChange={e => setFiltroStatus(e.target.value)}
              className="appearance-none text-xs bg-white border border-gray-200 rounded-lg pl-3 pr-7 py-2 text-gray-600 outline-none focus:border-blue-400 cursor-pointer transition-all"
            >
              {statuses.map(o => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>

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
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Fatura</th>
                <th className="px-4 py-3 text-left">Convênio</th>
                <th className="px-4 py-3 text-center">Valor Original</th>
                <th className="px-4 py-3 text-center">Valor Glosado</th>
                <th className="px-4 py-3 text-left">Motivo</th>
                <th className="px-4 py-3 text-left">Data Glosa</th>
                <th className="px-4 py-3 text-left">Data Resolução</th>
                <th className="px-4 py-3 text-left">Responsável</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((g) => {
                const rowColor = g.status === "Resolvida" ? "bg-emerald-50" : g.status === "Em Recurso" ? "bg-amber-50" : "bg-red-50";
                return (
                  <tr key={g.id} className={cn("border-t border-gray-50 hover:opacity-90 transition-colors", rowColor)}>
                    <td className="px-4 py-3 text-xs font-mono font-bold text-blue-700">{g.id_fatura}</td>
                    <td className="px-4 py-3 text-xs text-gray-700 font-semibold">{g.convenio}</td>
                    <td className="px-4 py-3 text-center text-xs font-semibold text-gray-700">R$ {g.valor_original.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center text-xs font-semibold text-red-700">R$ {g.valor_glosado.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-[200px]">{g.motivo_glosa}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">{g.data_glosa}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">{g.data_resolucao || "—"}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{g.responsavel_resolucao}</td>
                    <td className="px-4 py-3"><StatusBadge status={g.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
          Exibindo {filtrados.length} de {GLOSAS.length} glosas
        </div>
      </div>
    </div>
  );
}