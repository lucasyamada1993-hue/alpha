import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  ChevronDown,
  FileText,
  FileType,
  History,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STORAGE_KEY = "gestor_documentos_pops_v1";

const CATEGORIAS = [
  "Administrativo",
  "Recepção",
  "Enfermagem",
  "Médico",
];

const SEED = [
  {
    id: "doc-1",
    codigo: "POP_ADM_REC_001",
    titulo: "Atendimento ao Paciente",
    categoria: "Recepção",
    versaoAtual: 2,
    dataCriacao: "2024-03-05",
    ultimaRevisao: "2026-03-29",
    proximaRevisao: "2028-03-29",
    urlWord: "#",
    urlPdf: "#",
    nomeArquivoWord: "POP_ADM_REC_001_v2.docx",
    nomeArquivoPdf: "POP_ADM_REC_001_v2.pdf",
    historico: [
      {
        versao: 1,
        dataRevisao: "2024-03-05",
        status: "Obsoleto",
        urlWord: "#",
        urlPdf: "#",
      },
    ],
  },
  {
    id: "doc-2",
    codigo: "POP_ENF_015",
    titulo: "Preparo e administração de contraste",
    categoria: "Enfermagem",
    versaoAtual: 1,
    dataCriacao: "2025-11-10",
    ultimaRevisao: "2025-11-10",
    proximaRevisao: "2024-06-01",
    urlWord: "#",
    urlPdf: "#",
    nomeArquivoWord: "POP_ENF_015_v1.docx",
    nomeArquivoPdf: "POP_ENF_015_v1.pdf",
    historico: [],
  },
];

function fmt(d) {
  if (!d) return "—";
  const x = new Date(d + "T12:00:00");
  if (Number.isNaN(x.getTime())) return d;
  return x.toLocaleDateString("pt-BR");
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addYearsISO(iso, years) {
  const d = new Date(iso + "T12:00:00");
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().slice(0, 10);
}

function isOverdue(iso) {
  const end = new Date(iso + "T23:59:59");
  return end < new Date();
}

function loadDocs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return SEED;
}

function saveDocs(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function readGestorAuth() {
  try {
    const raw = localStorage.getItem("gestorAutenticado");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Gestão completa de POPs: Admin / Gestor Master (login mestre) / Gerente Qualidade.
 * Outros perfis (ex. Gerente Enfermagem) usam a mesma rota em vista só leitura (PDF vigente).
 */
function canManageDocuments(auth) {
  if (!auth?.funcoes || !Array.isArray(auth.funcoes)) return false;
  const f = auth.funcoes;
  return (
    f.includes("Admin") ||
    f.includes("Gestor Master") ||
    f.includes("Gerente Qualidade")
  );
}

export default function GestorDocumentos() {
  const [docs, setDocs] = useState(() => loadDocs());
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [expanded, setExpanded] = useState(() => new Set());

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingId, setEditingId] = useState(null);

  const [formCategoria, setFormCategoria] = useState("Recepção");
  const [formCodigo, setFormCodigo] = useState("");
  const [formTitulo, setFormTitulo] = useState("");
  const [formRevisao, setFormRevisao] = useState(todayISO);
  const [formProxima, setFormProxima] = useState(() => addYearsISO(todayISO(), 2));
  const [formMotivo, setFormMotivo] = useState("");
  const [formFile, setFormFile] = useState(null);

  useEffect(() => {
    saveDocs(docs);
  }, [docs]);

  const filtered = useMemo(() => {
    if (categoriaFiltro === "todas") return docs;
    return docs.filter((d) => d.categoria === categoriaFiltro);
  }, [docs, categoriaFiltro]);

  const openNovo = () => {
    setModalMode("create");
    setEditingId(null);
    setFormCategoria("Recepção");
    setFormCodigo("");
    setFormTitulo("");
    const hoje = todayISO();
    setFormRevisao(hoje);
    setFormProxima(addYearsISO(hoje, 2));
    setFormMotivo("");
    setFormFile(null);
    setModalOpen(true);
  };

  const openAtualizar = (doc) => {
    setModalMode("update");
    setEditingId(doc.id);
    setFormCategoria(doc.categoria);
    setFormCodigo(doc.codigo);
    setFormTitulo(doc.titulo);
    const hoje = todayISO();
    setFormRevisao(hoje);
    setFormProxima(addYearsISO(hoje, 2));
    setFormMotivo("");
    setFormFile(null);
    setModalOpen(true);
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onRevisaoChange = useCallback((v) => {
    setFormRevisao(v);
    setFormProxima(addYearsISO(v, 2));
  }, []);

  const auth = readGestorAuth();
  const canManage = canManageDocuments(auth);

  const submitModal = () => {
    if (!formCodigo.trim() || !formTitulo.trim()) return;

    if (modalMode === "create") {
      const id = `doc-${Date.now()}`;
      const row = {
        id,
        codigo: formCodigo.trim(),
        titulo: formTitulo.trim(),
        categoria: formCategoria,
        versaoAtual: 1,
        dataCriacao: formRevisao,
        ultimaRevisao: formRevisao,
        proximaRevisao: formProxima,
        urlWord: "#",
        urlPdf: "#",
        nomeArquivoWord: formFile ? formFile.name.replace(/\.[^.]+$/, "") + "_v1.docx" : "documento_v1.docx",
        nomeArquivoPdf: formFile ? formFile.name.replace(/\.[^.]+$/, "") + "_v1.pdf" : "documento_v1.pdf",
        historico: [],
      };
      setDocs((d) => [...d, row]);
    } else if (editingId) {
      setDocs((list) =>
        list.map((d) => {
          if (d.id !== editingId) return d;
          const vAnt = d.versaoAtual;
          const novoHist = [
            {
              versao: vAnt,
              dataRevisao: d.ultimaRevisao,
              status: "Obsoleto",
              urlWord: d.urlWord,
              urlPdf: d.urlPdf,
              nomeArquivoWord: d.nomeArquivoWord,
              nomeArquivoPdf: d.nomeArquivoPdf,
            },
            ...(d.historico || []),
          ];
          return {
            ...d,
            versaoAtual: vAnt + 1,
            titulo: formTitulo.trim(),
            categoria: formCategoria,
            ultimaRevisao: formRevisao,
            proximaRevisao: formProxima,
            nomeArquivoWord: formFile
              ? formFile.name.replace(/\.[^.]+$/, "") + `_v${vAnt + 1}.docx`
              : d.nomeArquivoWord,
            nomeArquivoPdf: formFile
              ? formFile.name.replace(/\.[^.]+$/, "") + `_v${vAnt + 1}.pdf`
              : d.nomeArquivoPdf,
            historico: novoHist,
            motivoUltimaAtualizacao: formMotivo.trim() || undefined,
          };
        })
      );
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-5 max-w-[1400px]">
      <div
        className={cn(
          "rounded-xl px-4 py-3 flex gap-3 items-start border",
          canManage
            ? "bg-[#E8F4FD] border-blue-100"
            : "bg-slate-50 border-slate-200"
        )}
      >
        <Shield
          className={cn(
            "w-5 h-5 flex-shrink-0 mt-0.5",
            canManage ? "text-[#0D47A1]" : "text-slate-500"
          )}
        />
        <p className="text-sm text-gray-700 leading-relaxed">
          {canManage ? (
            <>
              <span className="font-semibold text-[#0D47A1]">Fonte única da verdade.</span>{" "}
              Centralize POPs aprovados aqui para atender ONA/ISO: evite cópias locais desatualizadas
              (ex.: na área de trabalho da recepção). A versão vigente é sempre a listada com o selo
              mais recente.
            </>
          ) : (
            <>
              <span className="font-semibold text-gray-800">Consulta de POPs (somente leitura).</span>{" "}
              Visualize o PDF da versão vigente aprovada. Alterações e histórico administrativo são
              restritos à Gestão Master / Qualidade.
            </>
          )}
        </p>
      </div>

      <div
        className={cn(
          "flex flex-col gap-4",
          canManage ? "sm:flex-row sm:items-center sm:justify-between" : "sm:flex-row sm:items-center"
        )}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Categoria
          </span>
          <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {CATEGORIAS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {canManage && (
          <Button
            onClick={openNovo}
            className="bg-[#0D47A1] hover:bg-[#0B3D91] shadow-md shadow-blue-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Documento
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {canManage ? (
            <table className="w-full text-sm min-w-[960px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-4 py-3 text-left font-semibold">Código &amp; Título</th>
                  <th className="px-4 py-3 text-left font-semibold">Versão</th>
                  <th className="px-4 py-3 text-left font-semibold">Arquivos</th>
                  <th className="px-4 py-3 text-left font-semibold">Data criação</th>
                  <th className="px-4 py-3 text-left font-semibold">Última revisão</th>
                  <th className="px-4 py-3 text-left font-semibold">Próxima revisão</th>
                  <th className="px-4 py-3 text-left font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => {
                  const open = expanded.has(doc.id);
                  const overdue = isOverdue(doc.proximaRevisao);
                  return (
                    <Fragment key={doc.id}>
                      <tr className="border-t border-gray-100 hover:bg-gray-50/80 transition-colors">
                        <td className="px-4 py-3 align-top">
                          <p className="font-mono text-xs text-[#0D47A1] font-semibold">
                            {doc.codigo}
                          </p>
                          <p className="text-gray-800 font-medium mt-0.5 leading-snug">{doc.titulo}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{doc.categoria}</p>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-800 border-slate-200 font-mono"
                          >
                            V{doc.versaoAtual}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <div className="flex items-center gap-2">
                            <a
                              href={doc.urlWord}
                              title={doc.nomeArquivoWord || "Word"}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#2B579A]/10 text-[#2B579A] hover:bg-[#2B579A]/20 transition-colors"
                              onClick={(e) => doc.urlWord === "#" && e.preventDefault()}
                            >
                              <FileText className="w-5 h-5" />
                            </a>
                            <a
                              href={doc.urlPdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={doc.nomeArquivoPdf || "PDF"}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              onClick={(e) => doc.urlPdf === "#" && e.preventDefault()}
                            >
                              <FileType className="w-5 h-5" />
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top text-xs font-mono text-gray-600">
                          {fmt(doc.dataCriacao)}
                        </td>
                        <td className="px-4 py-3 align-top text-xs font-mono text-gray-600">
                          {fmt(doc.ultimaRevisao)}
                        </td>
                        <td className="px-4 py-3 align-top">
                          <span
                            className={cn(
                              "text-xs font-mono font-medium",
                              overdue ? "text-red-600" : "text-gray-700"
                            )}
                          >
                            {fmt(doc.proximaRevisao)}
                          </span>
                          {overdue && (
                            <span className="block text-[10px] text-red-500 font-semibold mt-0.5">
                              Vencido
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 align-top">
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-8"
                              onClick={() => openAtualizar(doc)}
                            >
                              Atualizar versão
                            </Button>
                            <button
                              type="button"
                              onClick={() => toggleExpand(doc.id)}
                              className={cn(
                                "flex items-center gap-1 text-xs font-medium text-[#0D47A1] hover:underline",
                                open && "font-semibold"
                              )}
                            >
                              <History className="w-3.5 h-3.5" />
                              Expandir histórico
                              <ChevronDown
                                className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {open && (doc.historico || []).length > 0 && (
                        <tr className="bg-slate-50/90">
                          <td colSpan={7} className="px-4 py-3 border-t border-gray-100">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                              Versões anteriores (obsoletas)
                            </p>
                            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-gray-50 text-gray-500">
                                    <th className="px-3 py-2 text-left">Versão</th>
                                    <th className="px-3 py-2 text-left">Data revisão</th>
                                    <th className="px-3 py-2 text-left">Status</th>
                                    <th className="px-3 py-2 text-left">Arquivos</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {doc.historico.map((h) => (
                                    <tr key={h.versao} className="border-t border-gray-100">
                                      <td className="px-3 py-2 font-mono font-semibold text-gray-700">
                                        V{h.versao}
                                      </td>
                                      <td className="px-3 py-2 font-mono text-gray-600">
                                        {fmt(h.dataRevisao)}
                                      </td>
                                      <td className="px-3 py-2">
                                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                          {h.status}
                                        </span>
                                      </td>
                                      <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                          <a
                                            href={h.urlWord}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded bg-[#2B579A]/10 text-[#2B579A]"
                                            onClick={(e) => h.urlWord === "#" && e.preventDefault()}
                                          >
                                            <FileText className="w-4 h-4" />
                                          </a>
                                          <a
                                            href={h.urlPdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded bg-red-50 text-red-600"
                                            onClick={(e) => h.urlPdf === "#" && e.preventDefault()}
                                          >
                                            <FileType className="w-4 h-4" />
                                          </a>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-4 py-3 text-left font-semibold">Código &amp; Título</th>
                  <th className="px-4 py-3 text-left font-semibold">Versão atual</th>
                  <th className="px-4 py-3 text-left font-semibold">Visualizar documento</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-t border-gray-100 hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-4 py-3 align-top">
                      <p className="font-mono text-xs text-[#0D47A1] font-semibold">{doc.codigo}</p>
                      <p className="text-gray-800 font-medium mt-0.5 leading-snug">{doc.titulo}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{doc.categoria}</p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-800 border-slate-200 font-mono"
                      >
                        V{doc.versaoAtual}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <a
                        href={doc.urlPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={doc.nomeArquivoPdf || "Abrir PDF"}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white shadow-md shadow-red-200 hover:bg-red-700 transition-colors"
                        onClick={(e) => doc.urlPdf === "#" && e.preventDefault()}
                        aria-label="Abrir PDF em novo separador"
                      >
                        <FileType className="w-5 h-5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-gray-500">
            Nenhum documento nesta categoria.
          </p>
        )}
      </div>

      {canManage && (
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "create" ? "Novo documento / POP" : "Atualizar versão do POP"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={formCategoria} onValueChange={setFormCategoria}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pop-codigo">Código do POP</Label>
                <Input
                  id="pop-codigo"
                  value={formCodigo}
                  onChange={(e) => setFormCodigo(e.target.value)}
                  placeholder="ex.: POP_ADM_REC_001"
                  disabled={modalMode === "update"}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pop-titulo">Título do documento</Label>
              <Input
                id="pop-titulo"
                value={formTitulo}
                onChange={(e) => setFormTitulo(e.target.value)}
                placeholder="Nome completo do procedimento"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pop-file">Arquivo (Word / Excel)</Label>
              <Input
                id="pop-file"
                type="file"
                accept=".doc,.docx,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(e) => setFormFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pop-revisao">Data de revisão</Label>
                <Input
                  id="pop-revisao"
                  type="date"
                  value={formRevisao}
                  onChange={(e) => onRevisaoChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pop-prox">Próxima revisão</Label>
                <Input
                  id="pop-prox"
                  type="date"
                  value={formProxima}
                  onChange={(e) => setFormProxima(e.target.value)}
                />
              </div>
            </div>
            {modalMode === "update" && (
              <div className="space-y-2">
                <Label htmlFor="pop-motivo">Motivo da atualização</Label>
                <Textarea
                  id="pop-motivo"
                  value={formMotivo}
                  onChange={(e) => setFormMotivo(e.target.value)}
                  placeholder="Ex.: adequação à nova norma, correção de etapas, inclusão de fluxograma…"
                  rows={3}
                />
              </div>
            )}
            <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
              O sistema gerará automaticamente a versão em PDF após o envio.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#0D47A1] hover:bg-[#0B3D91]" onClick={submitModal}>
              {modalMode === "create" ? "Registrar documento" : "Publicar nova versão"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}
    </div>
  );
}
