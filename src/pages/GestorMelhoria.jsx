import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { db } from "@/api/sheetsClient";
import { toast } from "sonner";
import MelhoriaPageHeader from "@/components/gestor/melhoria/MelhoriaPageHeader";
import A3Lista from "@/components/gestor/melhoria/a3/A3Lista";
import A3Editor from "@/components/gestor/melhoria/a3/A3Editor";
import OrigemA3Modal from "@/components/gestor/melhoria/a3/OrigemA3Modal";
import A3NovoTituloDonoModal from "@/components/gestor/melhoria/a3/A3NovoTituloDonoModal";
import { buildA3CreatePayloadFromOrigin } from "@/components/gestor/melhoria/a3/buildA3CreatePayload";

function defaultDonoFromStorage() {
  try {
    const raw = localStorage.getItem("gestorAutenticado");
    if (!raw) return "";
    const a = JSON.parse(raw);
    return (a.login || "").trim();
  } catch {
    return "";
  }
}

export default function GestorMelhoria() {
  const qc = useQueryClient();
  const location = useLocation();
  const a3Inicial = location.state?.a3Item || null;

  const [a3Selecionado, setA3Selecionado] = useState(null);
  const [showOrigemModal, setShowOrigemModal] = useState(false);
  const [pendingOrigin, setPendingOrigin] = useState(null);
  const [showTituloDonoModal, setShowTituloDonoModal] = useState(false);
  const [criando, setCriando] = useState(false);
  /** Após tentativa de create via state da auditoria (evita spinner ao voltar do editor). */
  const [auditResolved, setAuditResolved] = useState(() => !a3Inicial);

  useEffect(() => {
    if (!a3Inicial) return;
    let cancelled = false;
    (async () => {
      try {
        const novo = await db.entities.A3Relatorio.create({
          titulo: a3Inicial.pop || "Novo A3 via Auditoria",
          dono: "Coordenador de Qualidade",
          tipo: a3Inicial.avaliacao === "NC" ? "Não Conformidade" : "Oportunidade de Melhoria",
          prioridade: "Alta",
          pop_referencia: a3Inicial.pop || "",
          origem: "Auditoria de Processos",
          plan_condicao_atual: a3Inicial.descricao || "",
          plan_ishikawa: {},
          plan_5porques: [{ pergunta: "Por que o problema ocorre?", resposta: "" }],
          do_acoes_5w2h: [],
          check_evidencias_urls: [],
          status_pdca: "PLAN",
          deleted: false,
        });
        await qc.invalidateQueries({ queryKey: ["a3relatorios"] });
        if (!cancelled) setA3Selecionado(novo);
      } catch (e) {
        console.error(e);
        if (!cancelled) toast.error(e instanceof Error ? e.message : "Erro ao criar A3.");
      } finally {
        if (!cancelled) setAuditResolved(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [a3Inicial, qc]);

  const handleOrigemSelect = (origin) => {
    setPendingOrigin(origin);
    setShowOrigemModal(false);
    setShowTituloDonoModal(true);
  };

  const handleTituloDonoConfirm = async ({ titulo, dono }) => {
    if (!pendingOrigin) return;
    setCriando(true);
    try {
      const payload = buildA3CreatePayloadFromOrigin(pendingOrigin, titulo, dono);
      const novoA3 = await db.entities.A3Relatorio.create(payload);
      await qc.invalidateQueries({ queryKey: ["a3relatorios"] });
      toast.success("A3 criado. Preencha o PLAN no editor.");
      setShowTituloDonoModal(false);
      setPendingOrigin(null);
      setA3Selecionado(novoA3);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Erro ao criar o A3.");
    } finally {
      setCriando(false);
    }
  };

  const handleTituloDonoCancel = () => {
    setShowTituloDonoModal(false);
    setPendingOrigin(null);
  };

  const defaultTituloModal = pendingOrigin?.incident?.title ? String(pendingOrigin.incident.title) : "";
  const defaultDonoModal = defaultDonoFromStorage();

  if (a3Inicial && !a3Selecionado && !auditResolved) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-4 border-blue-200 border-t-[#0D47A1] rounded-full animate-spin" />
      </div>
    );
  }

  if (a3Selecionado) {
    return <A3Editor relatorio={a3Selecionado} onBack={() => setA3Selecionado(null)} />;
  }

  return (
    <div className="space-y-6 bg-gray-50 -mx-6 -mb-6 px-6 py-6">
      <MelhoriaPageHeader
        rightSlot={
          <button
            type="button"
            onClick={() => setShowOrigemModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0D47A1] text-white rounded-lg hover:bg-[#0B3D91] font-semibold text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo A3
          </button>
        }
      />

      <A3Lista onSelect={setA3Selecionado} hideNovoButton onNovoA3={() => setShowOrigemModal(true)} />

      {showOrigemModal && (
        <OrigemA3Modal onSelect={handleOrigemSelect} onCancel={() => setShowOrigemModal(false)} />
      )}

      {showTituloDonoModal && pendingOrigin && (
        <A3NovoTituloDonoModal
          defaultTitulo={defaultTituloModal}
          defaultDono={defaultDonoModal}
          onCancel={handleTituloDonoCancel}
          onConfirm={handleTituloDonoConfirm}
        />
      )}

      {criando && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/20 pointer-events-none">
          <div className="bg-white rounded-lg px-4 py-3 shadow-lg text-sm text-gray-600">A criar A3…</div>
        </div>
      )}
    </div>
  );
}
