import { useState } from "react";
import { Users, Zap, ShieldCheck, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DADOS_ANUAIS = [
  { mes: "Jan", experiencia: 4.1, eficiencia: 87, qualidade: 96.0, infraestrutura: 2.8 },
  { mes: "Fev", experiencia: 4.2, eficiencia: 88, qualidade: 96.8, infraestrutura: 2.9 },
  { mes: "Mar", experiencia: 4.3, eficiencia: 89, qualidade: 97.2, infraestrutura: 3.0 },
  { mes: "Abr", experiencia: 4.2, eficiencia: 90, qualidade: 97.5, infraestrutura: 3.1 },
  { mes: "Mai", experiencia: 4.4, eficiencia: 91, qualidade: 98.0, infraestrutura: 3.0 },
  { mes: "Jun", experiencia: 4.5, eficiencia: 92, qualidade: 98.5, infraestrutura: 3.0 },
];

const PILARES_CONFIG = {
  experiencia: {
    titulo: "Experiência do Paciente",
    valor: "4.5/5.0",
    icon: Users,
    cor: "text-emerald-600",
    badge: "NPS: 78",
    badgeCor: "bg-emerald-50 text-emerald-700",
    dataKey: "experiencia",
    chartColor: "#10b981",
    domain: [0, 5],
    chartTitle: "Experiência do Paciente (NPS)",
    chartLabel: "NPS Score",
  },
  eficiencia: {
    titulo: "Eficiência Operacional",
    valor: "92%",
    icon: Zap,
    cor: "text-blue-600",
    badge: "TAT Conforme",
    badgeCor: "bg-blue-50 text-blue-700",
    dataKey: "eficiencia",
    chartColor: "#3b82f6",
    domain: [80, 100],
    chartTitle: "Eficiência Operacional (TAT %)",
    chartLabel: "Eficiência %",
  },
  qualidade: {
    titulo: "Qualidade e Segurança",
    valor: "98.5%",
    icon: ShieldCheck,
    cor: "text-amber-600",
    badge: "Dupla Checagem",
    badgeCor: "bg-amber-50 text-amber-700",
    dataKey: "qualidade",
    chartColor: "#f59e0b",
    domain: [95, 100],
    chartTitle: "Qualidade e Segurança (%)",
    chartLabel: "Qualidade %",
  },
  infraestrutura: {
    titulo: "Infraestrutura",
    valor: "3/5",
    icon: Wrench,
    cor: "text-purple-600",
    badge: "Equipamentos OK",
    badgeCor: "bg-purple-50 text-purple-700",
    dataKey: "infraestrutura",
    chartColor: "#a855f7",
    domain: [0, 5],
    chartTitle: "Infraestrutura (Score)",
    chartLabel: "Infraestrutura Score",
  },
};

function PilarCard({ config }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-600 font-semibold">{config.titulo}</p>
        <config.icon className={cn("w-5 h-5", config.cor)} />
      </div>
      <p className={cn("text-3xl font-bold", config.cor)}>{config.valor}</p>
      <div className={cn("mt-3 inline-block px-2.5 py-1 text-xs font-semibold rounded-full", config.badgeCor)}>
        {config.badge}
      </div>
    </div>
  );
}

function PilarChart({ config, ano }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{config.chartTitle} - {ano}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={DADOS_ANUAIS}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="mes" stroke="#888" />
          <YAxis domain={config.domain} stroke="#888" />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={config.dataKey} 
            stroke={config.chartColor} 
            strokeWidth={2} 
            name={config.chartLabel} 
            dot={{ r: 4 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function SubAbas() {
  const [activeSubAba, setActiveSubAba] = useState("experiencia");
  const [ano, setAno] = useState("2026");

  return (
    <div className="space-y-6">
      {/* Sub-abas de Pilares */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(PILARES_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveSubAba(key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all border",
              activeSubAba === key
                ? "bg-[#0D47A1] text-white border-[#0D47A1] shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            )}
          >
            <config.icon className="w-4 h-4" />
            {config.titulo}
          </button>
        ))}
      </div>

      {/* Seletor de Ano */}
      <div className="flex justify-end">
        <select
          value={ano}
          onChange={(e) => setAno(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400"
        >
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
      </div>

      {/* KPI Card do Pilar Selecionado */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <PilarCard config={PILARES_CONFIG[activeSubAba]} />
      </div>

      {/* Gráfico do Pilar Selecionado */}
      <PilarChart config={PILARES_CONFIG[activeSubAba]} ano={ano} />

      {/* Resumo Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Eventos & Conformidades</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600 text-sm">Eventos Adversos (Ano)</p>
              <span className="font-semibold text-red-600">12</span>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600 text-sm">Não Conformidades</p>
              <span className="font-semibold text-amber-600">8</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Melhorias em Andamento</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600 text-sm">Planos A3 Abertos</p>
              <span className="font-semibold text-blue-600">5</span>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600 text-sm">Em Implementação</p>
              <span className="font-semibold text-blue-600">3</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Avaliações Pendentes</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600 text-sm">PDIs a Avaliar</p>
              <span className="font-semibold text-purple-600">4</span>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600 text-sm">Auditorias Vencidas</p>
              <span className="font-semibold text-red-600">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QualidadeDashboard() {
  return <SubAbas />;
}