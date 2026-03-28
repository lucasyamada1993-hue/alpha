import { useState, useEffect } from "react";
import { AlertTriangle, Plus, ChevronDown, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/api/sheetsClient";
import A3Modal from "@/components/gestor/qualidade/A3Modal";
import { toast } from "sonner";

function GravidadeBadge({ gravidade }) {
  const map = {
    "Leve": "bg-yellow-50 text-yellow-700 border-yellow-200",
    "Moderada": "bg-orange-50 text-orange-700 border-orange-200",
    "Grave": "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={cn("inline-block px-2.5 py-1 rounded-full text-xs font-semibold border", map[gravidade])}>
      {gravidade}
    </span>
  );
}

function TipoBadge({ tipo }) {
  const map = {
    "Evento Adverso": "bg-red-50 text-red-700 border-red-200",
    "Não Conformidade": "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span className={cn("inline-block px-2.5 py-1 rounded-full text-xs font-semibold border", map[tipo])}>
      {tipo === "Evento Adverso" ? "⚠️ Evento Adverso" : "❌ Não Conformidade"}
    </span>
  );
}

function PDCABadge({ status }) {
  const map = {
    "PLAN": { label: "📋 PLAN", color: "bg-blue-50 text-blue-700 border-blue-200" },
    "DO": { label: "⚙️ DO", color: "bg-amber-50 text-amber-700 border-amber-200" },
    "CHECK": { label: "✓ CHECK", color: "bg-purple-50 text-purple-700 border-purple-200" },
    "ACT": { label: "🎯 ACT", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    "Concluído": { label: "✅ Concluído", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  };
  const badge = map[status] || map["PLAN"];
  return (
    <span className={cn("inline-block px-2.5 py-1 rounded-full text-xs font-semibold border", badge.color)}>
      {badge.label}
    </span>
  );
}

export default function EventosNaoConformidades() {
  const [expandedId, setExpandedId] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [a3sVinculados, setA3sVinculados] = useState({});
  const [loading, setLoading] = useState(true);
  const [showA3Modal, setShowA3Modal] = useState(false);
  const [showNovoEventoModal, setShowNovoEventoModal] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const eventos = await db.entities.EventoAdverso.list();
      const a3s = await db.entities.A3Relatorio.list();
      
      // Mapear A3s por origem
      const a3Map = {};
      a3s.forEach(a3 => {
        if (a3.origem) {
          a3Map[a3.origem] = a3;
        }
      });
      
      setEventos(eventos || []);
      setA3sVinculados(a3Map);
    } catch (error) {
      toast.error("Erro ao carregar dados");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirA3 = (evento) => {
    setSelectedEvento(evento);
    setShowA3Modal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com botão */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-bold text-gray-800">Eventos Adversos & Não Conformidades</h3>
            <p className="text-xs text-gray-500 mt-0.5">Notificações e acompanhamento de ocorrências</p>
          </div>
        </div>
        <button 
          onClick={() => setShowNovoEventoModal(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Notificar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Notificado</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{eventos.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Eventos Adversos</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{eventos.filter(e => e.tipo === "Evento Adverso").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Abertos (com A3)</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{eventos.filter(e => e.plano_acao_aberto).length}</p>
        </div>
      </div>

      {/* Lista de Eventos */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Registro de Ocorrências</h3>
        </div>

        <div className="divide-y divide-gray-100">
           {eventos.length === 0 ? (
             <div className="px-6 py-8 text-center text-gray-500">
               <p>Nenhum evento registrado</p>
             </div>
           ) : (
             eventos.map((evento) => (
               <div key={evento.id} className="border-t border-gray-100 first:border-t-0">
                 <button
                   onClick={() => setExpandedId(expandedId === evento.id ? null : evento.id)}
                   className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                 >
                   <div className="flex-1">
                     <div className="flex items-center gap-3 mb-2">
                       <TipoBadge tipo={evento.tipo} />
                       <GravidadeBadge gravidade={evento.gravidade} />
                     </div>
                     <p className="font-semibold text-gray-800 text-sm">{evento.descricao || "Sem descrição"}</p>
                     <div className="flex gap-4 mt-2 text-xs text-gray-500">
                       <span>📍 {evento.setor || "N/A"}</span>
                       <span>📅 {new Date(evento.data).toLocaleDateString("pt-BR")}</span>
                       <span>👤 {evento.notificado_por || "N/A"}</span>
                     </div>
                   </div>
                   <ChevronDown
                     className={cn("w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-4", expandedId === evento.id && "rotate-180")}
                   />
                 </button>

                 {expandedId === evento.id && (
                   <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                     <div className="space-y-4">
                       <div>
                         <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Detalhes</p>
                         <p className="text-sm text-gray-700">{evento.descricao}</p>
                       </div>

                       <div className="grid grid-cols-2 gap-3">
                         <div className="bg-white rounded-lg p-3 border border-gray-200">
                           <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Data de Abertura</p>
                           <p className="text-sm font-bold text-gray-800">{new Date(evento.data).toLocaleDateString("pt-BR")}</p>
                         </div>
                         <div className="bg-white rounded-lg p-3 border border-gray-200">
                           <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Responsável</p>
                           <p className="text-sm font-bold text-gray-800">{evento.notificado_por || "N/A"}</p>
                         </div>
                       </div>

                       {a3sVinculados[`Evento #${evento.id}`] && (
                         <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                           <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">Plano A3 Vinculado</p>
                           <div className="space-y-2">
                             <p className="text-sm font-bold text-blue-900">{a3sVinculados[`Evento #${evento.id}`].titulo}</p>
                             <div className="flex items-center gap-2">
                               <span className="text-xs text-blue-700">Ciclo:</span>
                               <PDCABadge status={a3sVinculados[`Evento #${evento.id}`].status_pdca} />
                             </div>
                           </div>
                         </div>
                       )}

                       <button
                         onClick={() => handleAbrirA3(evento)}
                         className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                       >
                         <Plus className="w-4 h-4" />
                         {a3sVinculados[`Evento #${evento.id}`] ? "Editar Plano A3" : "Abrir Novo Plano A3"}
                       </button>
                     </div>
                   </div>
                 )}
               </div>
             ))
           )}
         </div>
      </div>

      {showA3Modal && (
        <A3Modal
          evento={selectedEvento}
          onClose={() => {
            setShowA3Modal(false);
            setSelectedEvento(null);
            carregarDados();
          }}
        />
      )}

      {showNovoEventoModal && (
        <NovoEventoModal
          onClose={() => {
            setShowNovoEventoModal(false);
            carregarDados();
          }}
        />
      )}
    </div>
  );
}

function NovoEventoModal({ onClose }) {
  const [formData, setFormData] = useState({
    tipo: "Evento Adverso",
    gravidade: "Leve",
    descricao: "",
    setor: "",
    notificado_por: "",
    data: new Date().toISOString().split("T")[0],
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.descricao || !formData.setor) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    try {
      setSaving(true);
      await db.entities.EventoAdverso.create({
        ...formData,
        plano_acao_aberto: false,
      });
      toast.success("Evento notificado com sucesso!");
      onClose();
    } catch (error) {
      toast.error("Erro ao notificar evento");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Notificar Novo Evento</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo *</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400"
              >
                <option>Evento Adverso</option>
                <option>Near Miss</option>
                <option>Não Conformidade</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Gravidade *</label>
              <select
                value={formData.gravidade}
                onChange={(e) => setFormData({ ...formData, gravidade: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400"
              >
                <option>Leve</option>
                <option>Moderada</option>
                <option>Grave</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição *</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva o evento..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Setor *</label>
              <input
                type="text"
                value={formData.setor}
                onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                placeholder="Ex: Radiologia"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Data</label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Notificado Por</label>
            <input
              type="text"
              value={formData.notificado_por}
              onChange={(e) => setFormData({ ...formData, notificado_por: e.target.value })}
              placeholder="Seu nome"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold text-sm transition-colors"
            >
              {saving ? "Salvando..." : "Notificar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}