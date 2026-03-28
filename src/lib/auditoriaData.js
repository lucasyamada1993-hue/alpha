export const CHECKLISTS = [
  {
    id: "seguranca",
    label: "Segurança do Paciente",
    icon: "shield",
    cor: "blue",
    itens: [
      { id: "seg_01", pop: "POP-SEG-001", descricao: "Checklist de identificação do paciente aplicado antes de todo exame" },
      { id: "seg_02", pop: "POP-SEG-002", descricao: "Triagem de implantes metálicos realizada antes da RM" },
      { id: "seg_03", pop: "POP-SEG-003", descricao: "Protocolo de contraste documentado e disponível na sala" },
      { id: "seg_04", pop: "POP-SEG-004", descricao: "EPI adequados disponíveis e utilizados pela equipe" },
      { id: "seg_05", pop: "POP-SEG-005", descricao: "Registro de dose de radiação realizado no prontuário" },
      { id: "seg_06", pop: "POP-SEG-006", descricao: "Carro de emergência conferido e lacrado com registro vigente" },
    ],
  },
  {
    id: "documentos",
    label: "Controle de Documentos",
    icon: "file",
    cor: "violet",
    itens: [
      { id: "doc_01", pop: "POP-DOC-001", descricao: "POPs revisados e aprovados dentro do prazo de validade (2 anos)" },
      { id: "doc_02", pop: "POP-DOC-002", descricao: "Versões obsoletas retiradas de circulação e arquivadas" },
      { id: "doc_03", pop: "POP-DOC-003", descricao: "Lista mestre de documentos atualizada e acessível" },
      { id: "doc_04", pop: "POP-DOC-004", descricao: "Registros de qualidade armazenados conforme prazo legal" },
      { id: "doc_05", pop: "POP-DOC-005", descricao: "Assinaturas de ciência dos colaboradores registradas nos POPs" },
    ],
  },
  {
    id: "calibracao",
    label: "Calibração de Equipamentos",
    icon: "tool",
    cor: "amber",
    itens: [
      { id: "cal_01", pop: "POP-CAL-001", descricao: "Certificados de calibração válidos e acessíveis para todos os equipamentos" },
      { id: "cal_02", pop: "POP-CAL-002", descricao: "Controle de qualidade diário (CQ) do mamógrafo realizado" },
      { id: "cal_03", pop: "POP-CAL-003", descricao: "Dosímetro dos técnicos enviado para leitura dentro do prazo" },
      { id: "cal_04", pop: "POP-CAL-004", descricao: "Registro de manutenção preventiva em dia para todos os equipamentos" },
      { id: "cal_05", pop: "POP-CAL-005", descricao: "Phantoms de qualidade de imagem utilizados e resultados registrados" },
    ],
  },
  {
    id: "satisfacao",
    label: "Satisfação e Atendimento",
    icon: "smile",
    cor: "emerald",
    itens: [
      { id: "sat_01", pop: "POP-SAT-001", descricao: "Pesquisa de satisfação disponibilizada após cada atendimento" },
      { id: "sat_02", pop: "POP-SAT-002", descricao: "Reclamações registradas e tratadas dentro do prazo de 5 dias úteis" },
      { id: "sat_03", pop: "POP-SAT-003", descricao: "NPS monitorado mensalmente com análise de tendência" },
      { id: "sat_04", pop: "POP-SAT-004", descricao: "Tempo de espera monitorado e dentro da meta estabelecida" },
    ],
  },
];