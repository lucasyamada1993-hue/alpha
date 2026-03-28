// @ts-nocheck
import { useState } from "react";
import {
  Smile, Activity, ShieldCheck, Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

import KPICard from "@/components/gestor/dashboard/KPICard";
import HistoricoChart from "@/components/gestor/dashboard/HistoricoChart";

import {
  last, delta, safeLast,
  historicoTATEspera, historicoTATPreliminar, historicoTATValidacao, historicoOcupacaoRM, historicoOcupacaoTC,
  historicoRefacao, historicoTimeOut, historicoIncidentes, historicoConformidade,
  historicoUptimeRM, historicoUptimeTC, historicoManutencao,
} from "@/lib/dashboardData";
import { useSurveyDashboardMetrics } from "@/hooks/useSurveyDashboardMetrics";

// ── Conteúdo de cada categoria ──────────────────────────────────────────────

function ExperienciaPaciente() {
  const {
    isLoading,
    useLive,
    responseCount,
    datedCount,
    monthLabels,
    historicoNPS: hNps,
    historicoCsatAgendamento: hAg,
    historicoCsatRecepcao: hRec,
    historicoCsatEquipe: hEq,
  } = useSurveyDashboardMetrics();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  const npsTarget = useLive ? 50 : 75;
  const npsDomain = useLive ? [-100, 100] : [50, 90];
  const npsDisplay = safeLast(hNps);
  const showNps = npsDisplay != null ? npsDisplay : "—";

  return (
    <div className="space-y-6">
      {useLive ? (
        <p className="text-xs text-slate-500 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
          Indicadores calculados a partir de <strong>{responseCount}</strong> resposta(s) da pesquisa.
          {datedCount === 0 && (
            <span className="block mt-1 text-slate-400">
              Nenhuma data registrada nas respostas: o gráfico repete o consolidado em todos os meses.
            </span>
          )}
        </p>
      ) : (
        <p className="text-xs text-amber-800 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
          Exibindo dados demonstrativos. Conecte a API e registre respostas na pesquisa para ver números reais.
        </p>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="NPS" value={showNps} target={npsTarget} targetLabel="Meta"
          delta={delta(hNps)} deltaGoodUp={true} sparkData={hNps} color="blue" />
        <KPICard label="CSAT Agendamento" value={safeLast(hAg) ?? "—"} unit="%" target={90}
          delta={delta(hAg)} deltaGoodUp={true} sparkData={hAg} color="blue" />
        <KPICard label="CSAT Recepção" value={safeLast(hRec) ?? "—"} unit="%" target={88}
          delta={delta(hRec)} deltaGoodUp={true} sparkData={hRec} color="blue" />
        <KPICard label="CSAT Equipe Técnica" value={safeLast(hEq) ?? "—"} unit="%" target={95}
          delta={delta(hEq)} deltaGoodUp={true} sparkData={hEq} color="blue" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HistoricoChart title="NPS — últimos 12 meses" subtitle={useLive ? "Promotores − Detratores (escala −100 a +100)" : "Promotores − Detratores"}
          series={[{ key: "nps", label: "NPS", data: hNps }]} yDomain={npsDomain} monthLabels={useLive ? monthLabels : undefined} />
        <HistoricoChart title="CSAT por etapa — últimos 12 meses" subtitle="% avaliações Ótimo/Bom" unit="%"
          series={[
            { key: "ag", label: "Agendamento", data: hAg },
            { key: "re", label: "Recepção (preparo)", data: hRec },
            { key: "eq", label: "Equipe (exame)", data: hEq },
          ]} yDomain={[70, 100]} monthLabels={useLive ? monthLabels : undefined} />
      </div>
    </div>
  );
}

function EficienciaOperacional() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Espera Recepção → Sala" value={last(historicoTATEspera)} unit=" min" target={15}
          delta={delta(historicoTATEspera)} deltaGoodUp={false} sparkData={historicoTATEspera} color="emerald" />
        <KPICard label="TAT Preliminar (Residente)" value={last(historicoTATPreliminar)} unit=" min" target={30}
          delta={delta(historicoTATPreliminar)} deltaGoodUp={false} sparkData={historicoTATPreliminar} color="emerald" />
        <KPICard label="TAT Validação (Preceptor)" value={last(historicoTATValidacao)} unit=" min" target={60}
          delta={delta(historicoTATValidacao)} deltaGoodUp={false} sparkData={historicoTATValidacao} color="emerald" />
        <KPICard label="Ocupação RM" value={last(historicoOcupacaoRM)} unit="%" target={85}
          delta={delta(historicoOcupacaoRM)} deltaGoodUp={true} sparkData={historicoOcupacaoRM} color="emerald" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HistoricoChart title="TAT por Etapa — Histórico Anual" subtitle="Minutos" unit=" min"
          series={[
            { key: "esp", label: "Espera",     data: historicoTATEspera },
            { key: "pre", label: "Preliminar", data: historicoTATPreliminar },
            { key: "val", label: "Validação",  data: historicoTATValidacao },
          ]} yDomain={[0, 110]} />
        <HistoricoChart title="Ocupação de Equipamentos — Histórico Anual" subtitle="% tempo produtivo" unit="%"
          series={[
            { key: "rm", label: "RM", data: historicoOcupacaoRM },
            { key: "tc", label: "TC", data: historicoOcupacaoTC },
          ]} yDomain={[60, 100]} />
      </div>
    </div>
  );
}

function QualidadeSeguranca() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Taxa de Refação" value={last(historicoRefacao)} unit="%" target={4.0}
          delta={delta(historicoRefacao)} deltaGoodUp={false} sparkData={historicoRefacao} color="amber" />
        <KPICard label="Adesão ao Time-Out" value={last(historicoTimeOut)} unit="%" target={98}
          delta={delta(historicoTimeOut)} deltaGoodUp={true} sparkData={historicoTimeOut} color="amber" />
        <KPICard label="Incidentes Adversos" value={last(historicoIncidentes)} unit="" target={0}
          delta={delta(historicoIncidentes)} deltaGoodUp={false} sparkData={historicoIncidentes} color="amber" />
        <KPICard label="Conformidade Auditoria" value={last(historicoConformidade)} unit="%" target={95}
          delta={delta(historicoConformidade)} deltaGoodUp={true} sparkData={historicoConformidade} color="amber" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HistoricoChart title="Taxa de Refação — Histórico Anual" subtitle="% exames repetidos" unit="%"
          series={[{ key: "ref", label: "Taxa de Refação", data: historicoRefacao }]} yDomain={[2, 7]} />
        <HistoricoChart title="Conformidade & Time-Out — Histórico Anual" subtitle="% aderência" unit="%"
          series={[
            { key: "to",  label: "Time-Out",     data: historicoTimeOut },
            { key: "con", label: "Conformidade", data: historicoConformidade },
          ]} yDomain={[60, 100]} />
        <HistoricoChart title="Incidentes Adversos — Histórico Anual" subtitle="Quantidade de ocorrências registradas"
          series={[{ key: "inc", label: "Incidentes", data: historicoIncidentes }]} yDomain={[0, 6]} />
      </div>
    </div>
  );
}

function Infraestrutura() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Uptime RM" value={last(historicoUptimeRM)} unit="%" target={98}
          delta={delta(historicoUptimeRM)} deltaGoodUp={true} sparkData={historicoUptimeRM} color="purple" />
        <KPICard label="Uptime TC" value={last(historicoUptimeTC)} unit="%" target={97}
          delta={delta(historicoUptimeTC)} deltaGoodUp={true} sparkData={historicoUptimeTC} color="purple" />
        <KPICard label="Manutenção Preventiva" value={last(historicoManutencao)} unit="%" target={95}
          delta={delta(historicoManutencao)} deltaGoodUp={true} sparkData={historicoManutencao} color="purple" />
      </div>
      <HistoricoChart title="Uptime & Manutenção — Histórico Anual" subtitle="% disponibilidade" unit="%"
        series={[
          { key: "rm",  label: "Uptime RM",            data: historicoUptimeRM },
          { key: "tc",  label: "Uptime TC",             data: historicoUptimeTC },
          { key: "man", label: "Manutenção Preventiva", data: historicoManutencao },
        ]} yDomain={[70, 100]} />
    </div>
  );
}

// ── Configuração das abas ────────────────────────────────────────────────────

const ABAS = [
  { id: "paciente",     label: "Experiência do Paciente",      icon: Smile,       cor: "blue",   comp: ExperienciaPaciente },
  { id: "eficiencia",   label: "Eficiência Operacional",        icon: Activity,    cor: "emerald",comp: EficienciaOperacional },
  { id: "qualidade",    label: "Qualidade & Segurança",         icon: ShieldCheck, cor: "amber",  comp: QualidadeSeguranca },
  { id: "infra",        label: "Infraestrutura",                icon: Cpu,         cor: "purple", comp: Infraestrutura },
];

const COR_ATIVA = {
  blue:   "bg-blue-600 text-white shadow-blue-200",
  emerald:"bg-emerald-600 text-white shadow-emerald-200",
  amber:  "bg-amber-500 text-white shadow-amber-200",
  purple: "bg-purple-600 text-white shadow-purple-200",
};

const COR_ICONE_ATIVA = {
  blue:   "text-white",
  emerald:"text-white",
  amber:  "text-white",
  purple: "text-white",
};

export default function GestorDashboard() {
  const [abaAtiva, setAbaAtiva] = useState("paciente");
  const aba = ABAS.find((a) => a.id === abaAtiva);
  const Comp = aba.comp;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Header Sticky */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h2 className="text-sm font-semibold text-primary text-center tracking-wide uppercase">
            Gestão de Qualidade - Alphasonic
          </h2>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 py-6">
        


        {/* Subabas das categorias */}
        <div className="flex flex-wrap gap-2 mb-6">
          {ABAS.map(({ id, label, icon: Icon, cor }) => {
            const isActive = abaAtiva === id;
            return (
              <button
                key={id}
                onClick={() => setAbaAtiva(id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all shadow-sm",
                  isActive
                    ? `${COR_ATIVA[cor]} shadow-md border-transparent`
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? COR_ICONE_ATIVA[cor] : "text-gray-400")} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Conteúdo da aba ativa */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex-1">
          <div className="flex items-center gap-2 mb-6">
            <aba.icon className="w-5 h-5 text-gray-500" />
            <h2 className="font-bold text-gray-800 text-base">{aba.label}</h2>
          </div>
          <Comp />
        </div>

      </div>
    </div>
  );
}