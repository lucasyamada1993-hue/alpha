// @ts-nocheck
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { db } from "@/api/sheetsClient";

import SurveyStepIndicator from "@/components/survey/SurveyStepIndicator";
import StepIdentificacao from "@/components/survey/StepIdentificacao";
import StepRatings from "@/components/survey/StepRatings";
import StepNPS from "@/components/survey/StepNPS";
import { useSurveyStore } from "@/lib/surveyStore";
import { STEPS, RATING_SUBTITLE_BY_CATEGORY } from "@/lib/surveyConfig";
import { SURVEY_DASHBOARD_QUERY_KEY } from "@/hooks/useSurveyDashboardMetrics";

const STEP_INICIO = STEPS.find((s) => s.id === "inicio");
const STEP_NPS = STEPS.find((s) => s.id === "nps");

function getRequiredFieldsForStep(step) {
  if (!step) return [];
  if (step.type === "identificacao") return ["tipo_atendimento", "perfil_respondente"];
  if (step.type === "nps") return ["nps_recomendacao"];
  if (step.type === "ratings") return step.questions.map((q) => q.field);
  return [];
}

export default function Survey() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const allPerguntas = useSurveyStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Constrói os steps dinamicamente a partir das perguntas ativas agrupadas por categoria
  const steps = useMemo(() => {
    const activePerguntas = allPerguntas.filter((p) => p.status === "Ativo");

    const categorias = [];
    const grouped = {};
    activePerguntas.forEach((p) => {
      if (!grouped[p.categoria]) {
        grouped[p.categoria] = [];
        categorias.push(p.categoria);
      }
      grouped[p.categoria].push(p);
    });

    const dynamicSteps = [
      {
        id: "inicio",
        title: STEP_INICIO?.title ?? "Boas-Vindas",
        subtitle: STEP_INICIO?.subtitle ?? "Conte-nos sobre você e o atendimento",
        type: "identificacao",
        fields: ["tipo_atendimento", "perfil_respondente"],
      },
      ...categorias.map((cat) => ({
        id: cat,
        title: cat,
        subtitle: RATING_SUBTITLE_BY_CATEGORY[cat] ?? `Avalie ${cat.toLowerCase()}`,
        type: "ratings",
        questions: grouped[cat].map((p) => ({ field: p.id, question: p.pergunta })),
      })),
      {
        id: "nps",
        title: STEP_NPS?.title ?? "Fim da jornada",
        subtitle: STEP_NPS?.subtitle ?? "Nota final e espaço para sugestões",
        type: "nps",
        fields: ["nps_recomendacao", "comentarios_finais"],
      },
    ];

    return dynamicSteps;
  }, [allPerguntas]);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const getStepRequiredFields = (stepIndex) => getRequiredFieldsForStep(steps[stepIndex]);

  const validateCurrentStep = () => {
    const fields = getStepRequiredFields(currentStep);
    const newErrors = {};
    let valid = true;
    fields.forEach((field) => {
      const val = data[field];
      if (val === "" || val === null || val === undefined) {
        newErrors[field] = true;
        valid = false;
      }
    });
    setErrors(newErrors);
    if (!valid) toast.error("Por favor, responda todas as perguntas antes de continuar.");
    return valid;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    const allRequired = steps.flatMap(getRequiredFieldsForStep);

    const allErrors = {};
    let valid = true;
    allRequired.forEach((field) => {
      const val = data[field];
      if (val === "" || val === null || val === undefined) {
        allErrors[field] = true;
        valid = false;
      }
    });

    if (!valid) {
      setErrors(allErrors);
      toast.error("Existem campos obrigatórios não preenchidos.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...data };
      if (!payload.comentarios_finais) payload.comentarios_finais = "";
      await db.entities.SurveyResponse.create(payload);
      queryClient.invalidateQueries({ queryKey: SURVEY_DASHBOARD_QUERY_KEY });
      toast.success("Pesquisa registrada com sucesso!");
      navigate("/obrigado");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(
        msg ||
          "Não foi possível enviar a pesquisa. Verifique a conexão e a configuração da API (planilha)."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!steps.length) return null;
  const step = steps[currentStep] || steps[0];
  const isLastStep = currentStep === steps.length - 1;

  const renderStepContent = () => {
    if (step.type === "identificacao") {
      return <StepIdentificacao data={data} onChange={handleChange} errors={errors} />;
    }
    if (step.type === "nps") {
      return <StepNPS data={data} onChange={handleChange} errors={errors} />;
    }
    if (step.type === "ratings") {
      return <StepRatings questions={step.questions} data={data} onChange={handleChange} errors={errors} />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex flex-col">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <h2 className="text-sm font-semibold text-primary text-center tracking-wide uppercase">
            Pesquisa de Satisfação do Usuário - Alphasonic
          </h2>
          <SurveyStepIndicator currentStep={currentStep} labels={steps.map((s) => s.title)} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
              <p className="text-muted-foreground mt-1">{step.subtitle}</p>
            </div>
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="text-base px-6 py-5 rounded-xl"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>

          <span className="text-sm text-muted-foreground font-medium">
            {currentStep + 1} de {steps.length}
          </span>

          {isLastStep ? (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="text-base px-8 py-5 rounded-xl font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg"
            >
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Enviar
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="text-base px-8 py-5 rounded-xl font-semibold shadow-lg"
            >
              Próximo
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}