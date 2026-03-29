import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db } from "@/api/sheetsClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, ChevronDown, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { pdiTecnicoStore } from "@/lib/pdiTecnicoStore";
import { toast } from "sonner";

const ESCALA = {
  1: "Não Atende",
  2: "Em Desenvolvimento",
  3: "Atende Plenamente",
  4: "Supera Expectativas",
};

/** colaboradorInicial: nome igual ao colaborador_id / select. modoEmbutido: desde GestorPDI (select bloqueado). hideHeaderStats: oculta KPIs no topo (ex. modal). */
export default function AvaliacaoTecnico({
  colaboradorInicial: colaboradorInicialProp = "",
  hideHeaderStats = false,
  modoEmbutido = false,
}) {
  const location = useLocation();
  const colaboradorInicial = colaboradorInicialProp || (location.state?.colaboradorInicial ?? "");

  const queryClient = useQueryClient();
  const [gestorAuth] = useState(() => {
    const auth = localStorage.getItem("gestorAutenticado");
    return auth ? JSON.parse(auth).login : "";
  });

  const [colaborador, setColaborador] = useState(colaboradorInicial);
  const [form, setForm] = useState({
    colaborador_id: "",
    data_avaliacao: new Date().toISOString().split("T")[0],
    avaliador: gestorAuth,
    competencias: [],
    pontos_fortes: "",
    pontos_desenvolver: "",
    plano_acao: [],
    comentarios: "",
  });

  const [expandedHistorico, setExpandedHistorico] = useState(null);
  const [competencias] = useState(() => pdiTecnicoStore.getActiveByCategory());
  
  const TECNICOS = [
    "Carlos Lima",
    "Fernanda Melo",
    "Ricardo Neves",
    "Bruna Costa",
  ];

  useEffect(() => {
    if (colaboradorInicial) {
      setColaborador(colaboradorInicial);
    }
  }, [colaboradorInicial]);

  // Carrega avaliações anteriores
  const { data: historico = [] } = useQuery({
    queryKey: ["pdi_historico", colaborador],
    queryFn: () =>
      colaborador
        ? db.entities.PDITecnicoEnfermagem.filter(
            { colaborador_id: colaborador, deleted: false },
            "-created_date",
            20
          )
        : [],
  });

  // Inicializa formulário com competências vazias
  useEffect(() => {
    const competenciasVazias = Object.values(competencias)
      .flat()
      .map((c) => ({
        competencia_id: c.id,
        nota: 0,
        observacoes: "",
      }));

    setForm((prev) => ({
      ...prev,
      colaborador_id: colaborador,
      competencias: competenciasVazias,
    }));
  }, [competencias, colaborador]);

  const saveMutation = useMutation({
    mutationFn: (data) => db.entities.PDITecnicoEnfermagem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pdi_historico"] });
      toast.success("Avaliação salva com sucesso!");
      // Reset form
      setForm({
        colaborador_id: colaborador,
        data_avaliacao: new Date().toISOString().split("T")[0],
        avaliador: gestorAuth,
        competencias: form.competencias.map((c) => ({ ...c, nota: 0, observacoes: "" })),
        pontos_fortes: "",
        pontos_desenvolver: "",
        plano_acao: [],
        comentarios: "",
      });
    },
  });

  const handleNotaChange = (competenciaId, nota) => {
    setForm((prev) => ({
      ...prev,
      competencias: prev.competencias.map((c) =>
        c.competencia_id === competenciaId ? { ...c, nota } : c
      ),
    }));
  };

  const handleObservacaoChange = (competenciaId, observacoes) => {
    setForm((prev) => ({
      ...prev,
      competencias: prev.competencias.map((c) =>
        c.competencia_id === competenciaId ? { ...c, observacoes } : c
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!colaborador) {
      toast.error("Selecione um colaborador");
      return;
    }

    const competenciasPreenchidas = form.competencias.filter((c) => c.nota > 0);
    if (competenciasPreenchidas.length === 0) {
      toast.error("Avalie pelo menos uma competência");
      return;
    }

    // @ts-expect-error — payload alinhado a PDITecnicoEnfermagem.create; tipagem genérica do mutate
    saveMutation.mutate(form);
  };

  // Calcula estatísticas
  const calcularEstatisticas = (avaliacoes) => {
    if (avaliacoes.length === 0) return null;

    const mesAtual = avaliacoes[0];
    const mesAnterior = avaliacoes[1];

    const calcMedeia = (competencias) => {
      const notas = competencias.filter((c) => c.nota > 0).map((c) => c.nota);
      return notas.length > 0 ? (notas.reduce((a, b) => a + b) / notas.length).toFixed(1) : "0";
    };

    const calcPercentual = (competencias, minimo = 3) => {
      const notas = competencias.filter((c) => c.nota > 0);
      if (notas.length === 0) return 0;
      const alcancou = notas.filter((c) => c.nota >= minimo).length;
      return Math.round((alcancou / notas.length) * 100);
    };

    const mediaAtual = calcMedeia(mesAtual.competencias);
    const mediaAnterior = mesAnterior ? calcMedeia(mesAnterior.competencias) : mediaAtual;
    const alcancouAtual = calcPercentual(mesAtual.competencias);
    const alcancouAnterior = mesAnterior ? calcPercentual(mesAnterior.competencias) : alcancouAtual;

    const melhoria = parseFloat(mediaAtual) - parseFloat(mediaAnterior);
    const melhoriaPorcentagem = alcancouAtual - alcancouAnterior;

    return {
      mediaAtual,
      mediaAnterior,
      alcancouAtual,
      alcancouAnterior,
      melhoria,
      melhoriaPorcentagem,
    };
  };

  const stats = calcularEstatisticas(historico);

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      {stats && !hideHeaderStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Média Mês Atual</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.mediaAtual}</p>
            <p className="text-xs text-gray-400 mt-0.5">de 4.0</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Alcançou (%)</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.alcancouAtual}%</p>
            <p className="text-xs text-gray-400 mt-0.5">Metas ≥3</p>
          </div>

          <div className={cn("bg-white rounded-xl border border-gray-100 p-4 shadow-sm", stats.melhoria > 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50")}>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Melhoria Mês</p>
            <div className="flex items-center gap-2 mt-1">
              {stats.melhoria > 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <p className={cn("text-2xl font-bold", stats.melhoria > 0 ? "text-emerald-600" : "text-red-600")}>
                {stats.melhoria > 0 ? "+" : ""}{stats.melhoria.toFixed(1)}
              </p>
            </div>
          </div>

          <div className={cn("bg-white rounded-xl border border-gray-100 p-4 shadow-sm", stats.melhoriaPorcentagem > 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50")}>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Melhoria %</p>
            <div className="flex items-center gap-2 mt-1">
              {stats.melhoriaPorcentagem > 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <p className={cn("text-2xl font-bold", stats.melhoriaPorcentagem > 0 ? "text-emerald-600" : "text-red-600")}>
                {stats.melhoriaPorcentagem > 0 ? "+" : ""}{stats.melhoriaPorcentagem}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Histórico de Avaliações */}
      {historico.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Histórico de Avaliações</h3>
          </div>

          <div className="divide-y divide-gray-100">
            {historico.map((avaliacao, idx) => (
              <div key={avaliacao.id} className="border-t border-gray-100 first:border-t-0">
                <button
                  onClick={() => setExpandedHistorico(expandedHistorico === avaliacao.id ? null : avaliacao.id)}
                  className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(avaliacao.data_avaliacao).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Avaliador: {avaliacao.avaliador}</p>
                    </div>
                    {idx === 0 && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-semibold">Mais Recente</span>}
                  </div>
                  <ChevronDown
                    className={cn("w-4 h-4 text-gray-400 transition-transform", expandedHistorico === avaliacao.id && "rotate-180")}
                  />
                </button>

                {expandedHistorico === avaliacao.id && (
                  <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 text-sm">
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-gray-700 mb-2">Avaliações por Competência:</p>
                        <div className="space-y-2">
                          {avaliacao.competencias.filter((c) => c.nota > 0).map((c) => (
                            <div key={c.competencia_id} className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Competência {c.competencia_id}</span>
                              <span className={cn("px-2 py-1 rounded-full font-semibold", {
                                "bg-red-50 text-red-700": c.nota === 1,
                                "bg-amber-50 text-amber-700": c.nota === 2,
                                "bg-emerald-50 text-emerald-700": c.nota === 3,
                                "bg-blue-50 text-blue-700": c.nota === 4,
                              })}>
                                {c.nota} - {ESCALA[c.nota]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {avaliacao.comentarios && (
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Comentários:</p>
                          <p className="text-gray-600">{avaliacao.comentarios}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulário de Avaliação */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identificação */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Identificação</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Colaborador *</label>
              <select
                value={colaborador}
                onChange={(e) => setColaborador(e.target.value)}
                disabled={modoEmbutido && Boolean(colaboradorInicial)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white disabled:bg-gray-100 disabled:text-gray-700"
              >
                <option value="">Selecione um colaborador</option>
                {TECNICOS.map((tec) => (
                  <option key={tec} value={tec}>{tec}</option>
                ))}
              </select>
              {modoEmbutido && colaboradorInicial && (
                <p className="text-[10px] text-gray-500 mt-1">Colaborador definido pela lista de PDIs (cadastro único no futuro).</p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Data Avaliação</label>
              <input
                type="date"
                value={form.data_avaliacao}
                onChange={(e) => setForm({ ...form, data_avaliacao: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Avaliador</label>
              <input
                type="text"
                value={form.avaliador}
                disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Competências */}
        {Object.entries(competencias).map(([categoria, items]) => (
          <div key={categoria} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">{categoria}</h3>

            <div className="space-y-5">
              {items.map((comp) => {
                const avaliacao = form.competencias.find((a) => a.competencia_id === comp.id);
                return (
                  <div key={comp.id} className="pb-5 border-b border-gray-100 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{comp.nome}</p>
                        <p className="text-xs text-gray-600 mt-1">{comp.descricao}</p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4].map((nota) => (
                          <button
                            key={nota}
                            type="button"
                            onClick={() => handleNotaChange(comp.id, nota)}
                            className={cn(
                              "flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all border-2",
                              avaliacao?.nota === nota
                                ? {
                                    1: "bg-red-50 border-red-400 text-red-700",
                                    2: "bg-amber-50 border-amber-400 text-amber-700",
                                    3: "bg-emerald-50 border-emerald-400 text-emerald-700",
                                    4: "bg-blue-50 border-blue-400 text-blue-700",
                                  }[nota]
                                : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400"
                            )}
                          >
                            {nota}<br /><span className="text-[10px]">{ESCALA[nota]}</span>
                          </button>
                        ))}
                      </div>

                      <textarea
                        value={avaliacao?.observacoes || ""}
                        onChange={(e) => handleObservacaoChange(comp.id, e.target.value)}
                        placeholder="Observações e exemplos..."
                        rows={2}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Resumo e Plano */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-gray-800 mb-4">Resumo e Plano de Ação</h3>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Pontos Fortes</label>
            <textarea
              value={form.pontos_fortes}
              onChange={(e) => setForm({ ...form, pontos_fortes: e.target.value })}
              placeholder="Descreva as fortalezas..."
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Pontos a Desenvolver</label>
            <textarea
              value={form.pontos_desenvolver}
              onChange={(e) => setForm({ ...form, pontos_desenvolver: e.target.value })}
              placeholder="Competências que precisam melhoria..."
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Comentários Adicionais</label>
            <textarea
              value={form.comentarios}
              onChange={(e) => setForm({ ...form, comentarios: e.target.value })}
              placeholder="Comentários gerais..."
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>
        </div>

        {/* Botão */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 bg-[#0D47A1] hover:bg-[#0B3D91] disabled:opacity-50 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm shadow-blue-200"
          >
            <Save className="w-4 h-4" /> {saveMutation.isPending ? "Salvando..." : "Salvar Avaliação"}
          </button>
        </div>
      </form>
    </div>
  );
}