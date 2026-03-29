import {
  Scan, CircleDot, MonitorDot, Magnet, FlaskConical,
  User, Users, HelpCircle
} from "lucide-react";

export const TIPO_ATENDIMENTO_OPTIONS = [
  "Raio-X", "Ultrassom", "Tomografia", "Ressonância Magnética", "Exames Laboratoriais"
];

export const TIPO_ICONS = [Scan, CircleDot, MonitorDot, Magnet, FlaskConical];

export const PERFIL_OPTIONS = ["Paciente", "Acompanhante", "Outro"];
export const PERFIL_ICONS = [User, Users, HelpCircle];

export const STEPS = [
  {
    id: "inicio",
    title: "Boas-Vindas",
    subtitle: "Conte-nos sobre você e o atendimento",
    fields: ["tipo_atendimento", "perfil_respondente"],
  },
  {
    id: "agendamento",
    title: "Primeiro Contato",
    subtitle: "Queremos saber se você se sentiu acolhido desde o início",
    questions: [
      { field: "agendamento_claro", question: "Sentiu que o agendamento foi simples e tranquilo para você?" },
      {
        field: "agendamento_informacoes",
        question: "Sente que as orientações de dia e lugar foram passadas com todo o cuidado?",
      },
      {
        field: "agendamento_duvidas",
        question: "Sentiu que suas dúvidas foram ouvidas e respondidas com atenção?",
      },
    ],
  },
  {
    id: "preparo",
    title: "Cuidado Prévio",
    subtitle: "Queremos saber se você se sentiu bem cuidado antes mesmo do seu exame",
    questions: [
      {
        field: "preparo_instrucoes",
        question: "Nossas orientações de preparo foram simples e fáceis de seguir?",
      },
      {
        field: "preparo_orientacoes_risco",
        question:
          "Nossa equipe teve o cuidado de explicar tudo o que você precisava saber sobre o seu procedimento?",
      },
      {
        field: "preparo_acolhimento",
        question: "Como você se sentiu ao ser recebido(a) por nossa equipe?",
      },
    ],
  },
  {
    id: "exame",
    title: "Sua Jornada Conosco",
    subtitle: "Nosso compromisso é fazer você se sentir bem em cada segundo aqui.",
    questions: [
      {
        field: "exame_tempo_espera",
        question: "Como você sentiu o tempo em nossa recepção antes de ser chamado(a)?",
      },
      {
        field: "exame_empatia_equipe",
        question: "Nossa equipe tratou você com o acolhimento e empatia?",
      },
      {
        field: "exame_explicacoes",
        question: "Nossos profissionais explicaram cada passo do exame com paciência e clareza?",
      },
      {
        field: "exame_seguranca",
        question: "Em algum momento você deixou de se sentir seguro(a) e amparado(a) por nós?",
      },
    ],
  },
  {
    id: "posexame",
    title: "Até Logo",
    subtitle: "Nosso cuidado acompanha você até a sua volta para casa.",
    questions: [
      {
        field: "posexame_resultado",
        question: "Você se sente tranquilo(a) sobre como e quando receberá seus resultados?",
      },
      {
        field: "posexame_cuidados",
        question: "Ficou claro como você deve se cuidar após o procedimento de hoje?",
      },
      {
        field: "posexame_fluxo_saida",
        question: "O encerramento do seu atendimento foi prático e atencioso?",
      },
    ],
  },
  {
    id: "avaliacao",
    title: "Seu Olhar sobre Nós",
    subtitle: "Sua percepção completa é o que nos ajuda a cuidar melhor.",
    questions: [
      {
        field: "avaliacao_geral",
        question: "De forma geral, como você avalia sua experiência na Alphasonic?",
      },
    ],
  },
  {
    id: "nps",
    title: "Fim da jornada",
    subtitle: "Nota final e espaço para sugestões",
    fields: ["nps_recomendacao", "comentarios_finais"],
  },
];

/** Subtítulo por categoria (etapas com perguntas) — usado na pesquisa dinâmica */
export const RATING_SUBTITLE_BY_CATEGORY = Object.fromEntries(
  STEPS.filter((s) => s.questions?.length).map((s) => [s.title, s.subtitle])
);