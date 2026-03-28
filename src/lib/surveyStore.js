/**
 * surveyStore.js
 * Estado global compartilhado entre /gestor/pesquisas e /pesquisa
 * Perguntas iniciais derivadas de STEPS em surveyConfig.js (fonte única)
 */
import { useState, useEffect } from "react";
import { STEPS } from "./surveyConfig";

function buildInitialPerguntas() {
  const flat = [];
  for (const step of STEPS) {
    if (!step.questions?.length) continue;
    for (const q of step.questions) {
      flat.push({
        id: q.field,
        categoria: step.title,
        pergunta: q.question,
        tipo: "Escala Ótimo-Ruim",
        status: "Ativo",
      });
    }
  }
  return flat.map((p, i) => ({ ...p, ordem: i + 1 }));
}

const INITIAL_PERGUNTAS = buildInitialPerguntas();

// Store singleton com listeners (pub/sub simples)
let _perguntas = [...INITIAL_PERGUNTAS];
const _listeners = new Set();

function notify() {
  _listeners.forEach((fn) => fn([..._perguntas]));
}

export const surveyStore = {
  get: () => [..._perguntas],

  subscribe(fn) {
    _listeners.add(fn);
    return () => {
      _listeners.delete(fn);
    };
  },

  add(nova) {
    const newId = `custom_${Date.now()}`;
    const newOrdem = _perguntas.length + 1;
    _perguntas = [..._perguntas, { id: newId, ordem: newOrdem, status: "Ativo", ...nova }];
    notify();
  },

  update(id, updates) {
    _perguntas = _perguntas.map((p) => (p.id === id ? { ...p, ...updates } : p));
    notify();
  },

  delete(id) {
    _perguntas = _perguntas.filter((p) => p.id !== id).map((p, i) => ({ ...p, ordem: i + 1 }));
    notify();
  },

  toggleStatus(id) {
    _perguntas = _perguntas.map((p) =>
      p.id === id ? { ...p, status: p.status === "Ativo" ? "Inativo" : "Ativo" } : p
    );
    notify();
  },

  reorder(fromIndex, toIndex) {
    const updated = [..._perguntas];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    _perguntas = updated.map((p, i) => ({ ...p, ordem: i + 1 }));
    notify();
  },

  /** Retorna categorias únicas na ordem de aparição */
  getCategories() {
    const seen = new Set();
    return _perguntas.filter((p) => {
      if (seen.has(p.categoria)) return false;
      seen.add(p.categoria);
      return true;
    }).map((p) => p.categoria);
  },

  /** Retorna apenas perguntas ativas agrupadas por categoria */
  getActiveByCategory() {
    const active = _perguntas.filter((p) => p.status === "Ativo");
    const map = {};
    active.forEach((p) => {
      if (!map[p.categoria]) map[p.categoria] = [];
      map[p.categoria].push(p);
    });
    return map;
  },
};

/** Hook React para consumir o store */
export function useSurveyStore() {
  const [perguntas, setPerguntas] = useState(surveyStore.get());

  useEffect(() => {
    const unsub = surveyStore.subscribe(setPerguntas);
    return unsub;
  }, []);

  return perguntas;
}