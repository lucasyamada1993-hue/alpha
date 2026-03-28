import { useQuery } from "@tanstack/react-query";
import { db } from "@/api/sheetsClient";
import { buildSurveyDashboardSeries } from "@/lib/surveyAggregates";
import {
  historicoNPS as staticNPS,
  historicoCsatAgendamento as staticAg,
  historicoCsatRecepcao as staticRec,
  historicoCsatEquipe as staticEq,
} from "@/lib/dashboardData";

const QUERY_KEY = ["surveyResponses", "dashboard"];

export function useSurveyDashboardMetrics() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => db.entities.SurveyResponse.filter({}, undefined, 2000),
  });

  const rows = Array.isArray(data) ? data : [];
  const aggregated = !isError ? buildSurveyDashboardSeries(rows) : null;
  const useLive = aggregated != null && aggregated.responseCount > 0;

  return {
    isLoading,
    isError,
    error,
    refetch,
    useLive,
    responseCount: aggregated?.responseCount ?? 0,
    datedCount: aggregated?.datedCount ?? 0,
    monthLabels: useLive ? aggregated.monthLabels : null,
    historicoNPS: useLive ? aggregated.historicoNPS : staticNPS,
    historicoCsatAgendamento: useLive ? aggregated.historicoCsatAgendamento : staticAg,
    historicoCsatRecepcao: useLive ? aggregated.historicoCsatRecepcao : staticRec,
    historicoCsatEquipe: useLive ? aggregated.historicoCsatEquipe : staticEq,
  };
}

export { QUERY_KEY as SURVEY_DASHBOARD_QUERY_KEY };
