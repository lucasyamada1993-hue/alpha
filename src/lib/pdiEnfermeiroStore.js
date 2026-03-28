const COMPETENCIAS_PADRAO = {
  "Competências Clínicas e Assistenciais Avançadas (Hard Skills)": [
    {
      id: "enf_hsk_001",
      categoria: "Competências Clínicas e Assistenciais Avançadas (Hard Skills)",
      nome: "Manejo de Acessos Complexos",
      descricao: "Demonstra segurança no manuseio de acessos centrais, PICC e Port-a-Cath para administração de contrastes com bomba injetora",
      ordem: 1,
      ativa: true,
    },
    {
      id: "enf_hsk_002",
      categoria: "Competências Clínicas e Assistenciais Avançadas (Hard Skills)",
      nome: "Avaliação de Risco Clínico",
      descricao: "Avalia questionários de segurança críticos, analisa exames laboratoriais (TFG/Creatinina) e discute riscos de nefropatia ou alergias",
      ordem: 2,
      ativa: true,
    },
    {
      id: "enf_hsk_003",
      categoria: "Competências Clínicas e Assistenciais Avançadas (Hard Skills)",
      nome: "Liderança em Emergências Médicas",
      descricao: "Assume a liderança da equipe técnica durante reações adversas graves ou Parada Cardiorrespiratória (PCR)",
      ordem: 3,
      ativa: true,
    },
    {
      id: "enf_hsk_004",
      categoria: "Competências Clínicas e Assistenciais Avançadas (Hard Skills)",
      nome: "Supervisão de Protocolos Assistenciais",
      descricao: "Orienta e supervisiona a equipe técnica nos preparos complexos de exames (enterotomografia, sedações, exames infantis)",
      ordem: 4,
      ativa: true,
    },
  ],
  "Gestão da Qualidade e Segurança do Paciente (Padrão ONA)": [
    {
      id: "enf_qos_001",
      categoria: "Gestão da Qualidade e Segurança do Paciente (Padrão ONA)",
      nome: "Auditoria de Metas Internacionais",
      descricao: "Garante e audita se a equipe está cumprindo 100% da dupla checagem de identificação e Time-Out antes dos exames",
      ordem: 5,
      ativa: true,
    },
    {
      id: "enf_qos_002",
      categoria: "Gestão da Qualidade e Segurança do Paciente (Padrão ONA)",
      nome: "Gestão do Carrinho de Emergência e Insumos",
      descricao: "Audita o checklist diário, garante reposição de psicotrópicos, adrenalina, controle de validades de contrastes",
      ordem: 6,
      ativa: true,
    },
    {
      id: "enf_qos_003",
      categoria: "Gestão da Qualidade e Segurança do Paciente (Padrão ONA)",
      nome: "Notificação e Tratamento de Incidentes",
      descricao: "Incentiva cultura de segurança, notifica eventos adversos e participa da análise de causa raiz",
      ordem: 7,
      ativa: true,
    },
    {
      id: "enf_qos_004",
      categoria: "Gestão da Qualidade e Segurança do Paciente (Padrão ONA)",
      nome: "Qualidade dos Registros",
      descricao: "Audita prontuários e anotações da equipe, garantindo faturamento correto e respaldo legal",
      ordem: 8,
      ativa: true,
    },
  ],
  "Proteção Radiológica e Biossegurança": [
    {
      id: "enf_rad_001",
      categoria: "Proteção Radiológica e Biossegurança",
      nome: "Supervisão de Radioproteção",
      descricao: "Monitora utilização correta dos dosímetros e aventais de chumbo durante os procedimentos",
      ordem: 9,
      ativa: true,
    },
    {
      id: "enf_rad_002",
      categoria: "Proteção Radiológica e Biossegurança",
      nome: "Gestão de Ambiente e Infecção",
      descricao: "Assegura que os fluxos de desinfecção das salas (TC/RM/USG) e bombas injetoras ocorram rigorosamente entre pacientes",
      ordem: 10,
      ativa: true,
    },
  ],
  "Liderança, Comportamento e Experiência do Paciente (Soft Skills)": [
    {
      id: "enf_soft_001",
      categoria: "Liderança, Comportamento e Experiência do Paciente (Soft Skills)",
      nome: "Gestão de Equipe e Conflitos",
      descricao: "Conduz a equipe com respeito, fornece feedbacks assertivos, resolve conflitos internos e auxilia no PDI",
      ordem: 11,
      ativa: true,
    },
    {
      id: "enf_soft_002",
      categoria: "Liderança, Comportamento e Experiência do Paciente (Soft Skills)",
      nome: "Visão Sistêmica e Fluxo (TAT)",
      descricao: "Acompanha o painel de atendimento, gerencia gargalos no preparo e otimiza o giro de sala",
      ordem: 12,
      ativa: true,
    },
    {
      id: "enf_soft_003",
      categoria: "Liderança, Comportamento e Experiência do Paciente (Soft Skills)",
      nome: "Manejo de Crises com Pacientes",
      descricao: "Atua na linha de frente para acalmar pacientes ansiosos, claustrofóbicos ou familiares insatisfeitos",
      ordem: 13,
      ativa: true,
    },
    {
      id: "enf_soft_004",
      categoria: "Liderança, Comportamento e Experiência do Paciente (Soft Skills)",
      nome: "Comunicação Multidisciplinar",
      descricao: "Mantém alinhamento com recepção, equipe médica, staff, residentes e outras áreas do hospital",
      ordem: 14,
      ativa: true,
    },
  ],
};

let subscribers = [];
let competencias = { ...COMPETENCIAS_PADRAO };

export const pdiEnfermeiroStore = {
  getAll() {
    return { ...competencias };
  },

  getActiveByCategory() {
    const result = {};
    Object.entries(competencias).forEach(([categoria, items]) => {
      result[categoria] = items.filter((item) => item.ativa && !item.deleted);
    });
    return result;
  },

  add(competencia) {
    const categoria = competencia.categoria;
    if (!competencias[categoria]) {
      competencias[categoria] = [];
    }
    competencias[categoria].push(competencia);
    this.notify();
  },

  update(id, dados) {
    Object.values(competencias).forEach((items) => {
      const found = items.find((item) => item.id === id);
      if (found) {
        Object.assign(found, dados);
      }
    });
    this.notify();
  },

  delete(id) {
    Object.values(competencias).forEach((items) => {
      const found = items.find((item) => item.id === id);
      if (found) {
        found.deleted = true;
      }
    });
    this.notify();
  },

  toggleStatus(id) {
    Object.values(competencias).forEach((items) => {
      const found = items.find((item) => item.id === id);
      if (found) {
        found.ativa = !found.ativa;
      }
    });
    this.notify();
  },

  reorder(fromIndex, toIndex) {
    const allItems = Object.values(competencias).flat();
    const [item] = allItems.splice(fromIndex, 1);
    allItems.splice(toIndex, 0, item);
    this.notify();
  },

  subscribe(callback) {
    subscribers.push(callback);
    return () => {
      subscribers = subscribers.filter((sub) => sub !== callback);
    };
  },

  notify() {
    subscribers.forEach((cb) => cb(this.getActiveByCategory()));
  },
};

export function usePdiEnfermeiroStore() {
  const [state, setState] = React.useState(pdiEnfermeiroStore.getActiveByCategory());

  React.useEffect(() => {
    const unsubscribe = pdiEnfermeiroStore.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  return state;
}

import React from "react";