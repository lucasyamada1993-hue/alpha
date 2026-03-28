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
    title: "Identificação",
    subtitle: "Conte-nos sobre você e o atendimento",
    fields: ["tipo_atendimento", "perfil_respondente"],
  },
  {
    id: "agendamento",
    title: "Agendamento",
    subtitle: "Avalie o processo de agendamento",
    questions: [
      { field: "agendamento_claro", question: "O agendamento foi claro e objetivo?" },
      { field: "agendamento_informacoes", question: "As informações sobre data, horário e local foram adequadas?" },
      { field: "agendamento_duvidas", question: "Suas dúvidas foram esclarecidas durante o agendamento?" },
    ],
  },
  {
    id: "preparo",
    title: "Preparo",
    subtitle: "Avalie as orientações de preparo",
    questions: [
      { field: "preparo_instrucoes", question: "As instruções de preparo foram claras e compreensíveis?" },
      { field: "preparo_orientacoes_risco", question: "Você recebeu orientações sobre riscos e contraindicações?" },
      { field: "preparo_acolhimento", question: "Como foi o acolhimento da equipe ao recebê-lo(a)?" },
    ],
  },
  {
    id: "exame",
    title: "Realização do Exame",
    subtitle: "Avalie a experiência durante o exame",
    questions: [
      { field: "exame_tempo_espera", question: "Como você avalia o tempo de espera até o atendimento?" },
      { field: "exame_empatia_equipe", question: "A equipe foi empática e atenciosa durante o exame?" },
      { field: "exame_explicacoes", question: "Os procedimentos foram explicados de forma clara?" },
      { field: "exame_seguranca", question: "Você se sentiu seguro(a) durante o exame?" },
    ],
  },
  {
    id: "posexame",
    title: "Pós-Exame",
    subtitle: "Avalie o atendimento após o exame",
    questions: [
      { field: "posexame_resultado", question: "A orientação sobre a entrega do resultado foi clara?" },
      { field: "posexame_cuidados", question: "Recebeu orientações sobre cuidados pós-exame?" },
      { field: "posexame_fluxo_saida", question: "O fluxo de saída foi organizado e eficiente?" },
    ],
  },
  {
    id: "avaliacao",
    title: "Avaliação Geral",
    subtitle: "Avaliação final e recomendação",
    questions: [
      { field: "avaliacao_geral", question: "Como você avalia a experiência geral no SADT?" },
    ],
  },
  {
    id: "nps",
    title: "Recomendação & Comentários",
    subtitle: "Nota final e espaço para sugestões",
    fields: ["nps_recomendacao", "comentarios_finais"],
  },
];