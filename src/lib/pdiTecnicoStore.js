import { useState, useEffect } from "react";

// Competências iniciais
const INITIAL_COMPETENCIAS = [
  // Técnicas Assistenciais
  {
    id: "punca_venosa",
    ordem: 1,
    categoria: "Competências Técnicas Assistenciais",
    nome: "Punção Venosa e Acesso Seguro",
    descricao: "Demonstra habilidade em acessos venosos periféricos, escolhendo o calibre adequado (jelco) para o fluxo da bomba injetora de contraste, minimizando múltiplas tentativas.",
    exemplos: "Realiza punção com sucesso na primeira tentativa, escolhe calibre 18-20G para bomba injetora",
    ativa: true,
  },
  {
    id: "contraste",
    ordem: 2,
    categoria: "Competências Técnicas Assistenciais",
    nome: "Preparo e Administração de Contraste",
    descricao: "Conhece os tipos de meios de contraste (iodo, gadolínio), vias de administração e os cuidados específicos no manuseio da bomba injetora.",
    exemplos: "Identifica corretamente contraste iodado vs gadolínio, opera bomba injetora conforme protocolo",
    ativa: true,
  },
  {
    id: "triagem_seguranca",
    ordem: 3,
    categoria: "Competências Técnicas Assistenciais",
    nome: "Triagem e Questionário de Segurança",
    descricao: "Aplica rigorosamente os questionários de segurança (anamnese), identificando alergias, função renal (creatinina) e contraindicações para Ressonância Magnética.",
    exemplos: "Questiona paciente sobre alergias, marca-passo, implantes metálicos antes de RM",
    ativa: true,
  },
  {
    id: "reacoes_adversas",
    ordem: 4,
    categoria: "Competências Técnicas Assistenciais",
    nome: "Manejo de Reações Adversas",
    descricao: "Sabe identificar precocemente sinais de reação alérgica leve a grave e extravasamento de contraste, atuando rapidamente nos primeiros socorros.",
    exemplos: "Identifica reação alérgica leve (prurido), distingue de grave (anafilaxia), aciona equipe médica",
    ativa: true,
  },
  // Qualidade e Segurança
  {
    id: "identificacao_dupla",
    ordem: 5,
    categoria: "Qualidade e Segurança do Paciente",
    nome: "Identificação e Dupla Checagem",
    descricao: "Confirma o nome completo e data de nascimento do paciente em todas as etapas (recepção na sala, antes da punção e antes da injeção).",
    exemplos: "Verifica pulseira do paciente, confirma nome em voz alta, registra em prontuário",
    ativa: true,
  },
  {
    id: "timeout",
    ordem: 6,
    categoria: "Qualidade e Segurança do Paciente",
    nome: "Execução do Time-Out",
    descricao: "Participa ativamente da pausa de segurança antes do início do exame, confirmando paciente correto, procedimento correto e lateralidade.",
    exemplos: "Participa do Time-Out formal antes de cada exame, confirma lateralidade em RM/Mamografia",
    ativa: true,
  },
  {
    id: "checagem_equipamentos",
    ordem: 7,
    categoria: "Qualidade e Segurança do Paciente",
    nome: "Checagem de Equipamentos e Insumos",
    descricao: "Realiza a conferência diária rigorosa do Carrinho de Emergência e rede de gases.",
    exemplos: "Verifica desfibrilador, lacre, validade de medicações, fluxo de oxigênio",
    ativa: true,
  },
  {
    id: "registros_prontuario",
    ordem: 8,
    categoria: "Qualidade e Segurança do Paciente",
    nome: "Registros no Prontuário",
    descricao: "Realiza anotações de enfermagem claras, legíveis e completas (lote do contraste, volume injetado, calibre do acesso), garantindo rastreabilidade.",
    exemplos: "Registra lote, volume, hora de injeção, calibre jelco, intercorrências",
    ativa: true,
  },
  // Proteção Radiológica
  {
    id: "epis_dosimetro",
    ordem: 9,
    categoria: "Proteção Radiológica e Biossegurança",
    nome: "Uso de EPIs e Dosímetro",
    descricao: "Utiliza corretamente os equipamentos de proteção individual plumbíferos (aventais de chumbo, protetor de tireoide) e usa o dosímetro de forma rigorosa.",
    exemplos: "Veste avental de chumbo e protetor tireoide, usa dosímetro em todas as sala de radiologia",
    ativa: true,
  },
  {
    id: "prevencao_infeccao",
    ordem: 10,
    categoria: "Proteção Radiológica e Biossegurança",
    nome: "Prevenção e Controle de Infecção",
    descricao: "Realiza a higienização correta das mãos, desinfecção de equipamentos entre pacientes.",
    exemplos: "Higieniza mãos com álcool gel, desinfeta bomba injetora, maca e bobinas entre pacientes",
    ativa: true,
  },
  // Comportamentais
  {
    id: "acolhimento",
    ordem: 11,
    categoria: "Competências Comportamentais",
    nome: "Acolhimento e Humanização",
    descricao: "Demonstra empatia e paciência para acalmar pacientes claustrofóbicos (comum na RM), ansiosos ou com dor.",
    exemplos: "Explica procedimento com clareza, acalma paciente claustrofóbico, demonstra paciência",
    ativa: true,
  },
  {
    id: "trabalho_equipe",
    ordem: 12,
    categoria: "Competências Comportamentais",
    nome: "Trabalho em Equipe e Fluxo (TAT)",
    descricao: "Mantém comunicação fluida com médicos radiologistas, tecnólogos e recepcionistas, garantindo o giro rápido da sala.",
    exemplos: "Comunica rapidamente com equipe, antecipa necessidades, mantém fluxo da agenda",
    ativa: true,
  },
  {
    id: "inteligencia_emocional",
    ordem: 13,
    categoria: "Competências Comportamentais",
    nome: "Inteligência Emocional",
    descricao: "Mantém a calma e a precisão técnica durante emergências médicas ou em dias de agenda superlotada.",
    exemplos: "Permanece calmo durante reação alérgica, executa protocolo com precisão em emergência",
    ativa: true,
  },
];

let _competencias = [...INITIAL_COMPETENCIAS];
const _listeners = new Set();

function notify() {
  _listeners.forEach((fn) => fn([..._competencias]));
}

export const pdiTecnicoStore = {
  get: () => [..._competencias],

  subscribe(fn) {
    _listeners.add(fn);
    return () => {
      _listeners.delete(fn);
    };
  },

  add(nova) {
    const newId = `custom_${Date.now()}`;
    const newOrdem = _competencias.length + 1;
    _competencias = [..._competencias, { id: newId, ordem: newOrdem, ativa: true, ...nova }];
    notify();
  },

  update(id, updates) {
    _competencias = _competencias.map((c) => (c.id === id ? { ...c, ...updates } : c));
    notify();
  },

  delete(id) {
    _competencias = _competencias.filter((c) => c.id !== id).map((c, i) => ({ ...c, ordem: i + 1 }));
    notify();
  },

  toggleStatus(id) {
    _competencias = _competencias.map((c) =>
      c.id === id ? { ...c, ativa: !c.ativa } : c
    );
    notify();
  },

  reorder(fromIndex, toIndex) {
    const updated = [..._competencias];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    _competencias = updated.map((c, i) => ({ ...c, ordem: i + 1 }));
    notify();
  },

  getCategories() {
    const seen = new Set();
    return _competencias.filter((c) => {
      if (seen.has(c.categoria)) return false;
      seen.add(c.categoria);
      return true;
    }).map((c) => c.categoria);
  },

  getActiveByCategory() {
    const active = _competencias.filter((c) => c.ativa);
    const map = {};
    active.forEach((c) => {
      if (!map[c.categoria]) map[c.categoria] = [];
      map[c.categoria].push(c);
    });
    return map;
  },
};

export function usePdiTecnicoStore() {
  const [competencias, setCompetencias] = useState(pdiTecnicoStore.get());

  useEffect(() => {
    const unsub = pdiTecnicoStore.subscribe(setCompetencias);
    return unsub;
  }, []);

  return competencias;
}