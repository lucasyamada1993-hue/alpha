import { useState, useEffect } from "react";
import { ShieldAlert, Lock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MEDICACOES_PADRAO = [
  { id: 1, nome: "Adrenalina 1mg/ml (Ampola)", qtdPadrao: 10, categoria: "Cardiovascular" },
  { id: 2, nome: "Hidrocortisona 500mg (Alergia a Contraste)", qtdPadrao: 5, categoria: "Alergia" },
  { id: 3, nome: "Prometazina 50mg/2ml", qtdPadrao: 5, categoria: "Anti-histamínico" },
  { id: 4, nome: "Amiodarona 150mg/3ml (Arritmia)", qtdPadrao: 6, categoria: "Cardiovascular" },
  { id: 5, nome: "Atropina 0,25mg/ml", qtdPadrao: 10, categoria: "Cardiovascular" },
  { id: 6, nome: "Flumazenil 0,1mg/ml (Reversão Sedação)", qtdPadrao: 5, categoria: "Sedação" },
];

export default function ChecklistMedicamentos({ onClose }) {
  const [carrinho, setCarrinho] = useState("");
  const [medicamentos, setMedicamentos] = useState({});
  const [confirmacao, setConfirmacao] = useState(false);
  const [novoLacre, setNovoLacre] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [resumo, setResumo] = useState({ total: 0, conformes: 0, alertas: 0, avisos: 0 });

  useEffect(() => {
    // Inicializar medicamentos
    const inicial = {};
    MEDICACOES_PADRAO.forEach(med => {
      inicial[med.id] = { qtdAtual: 0, validade: "", status: "pendente" };
    });
    setMedicamentos(inicial);
  }, []);

  const validarMedicamento = (medId) => {
    const med = MEDICACOES_PADRAO.find(m => m.id === medId);
    const dados = medicamentos[medId];

    let status = "ok";

    if (dados.qtdAtual < med.qtdPadrao) {
      status = "alerta";
    }

    if (dados.validade) {
      const dataValidade = new Date(dados.validade + "-01");
      const hoje = new Date();
      const diasAteVencimento = Math.floor(
        (dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diasAteVencimento < 0) {
        status = "vencido";
      } else if (diasAteVencimento <= 30) {
        if (status !== "alerta") status = "aviso";
      }
    }

    setMedicamentos(prev => ({
      ...prev,
      [medId]: { ...prev[medId], status }
    }));
  };

  useEffect(() => {
    const valores = Object.values(medicamentos);
    const conformes = valores.filter(v => v.status === "ok").length;
    const alertas = valores.filter(v => v.status === "alerta" || v.status === "vencido").length;
    const avisos = valores.filter(v => v.status === "aviso").length;

    setResumo({
      total: valores.length,
      conformes,
      alertas,
      avisos,
    });
  }, [medicamentos]);

  const handleLacrar = () => {
    if (!carrinho) {
      toast.error("Selecione um carrinho");
      return;
    }
    if (!confirmacao) {
      toast.error("Você deve confirmar a auditoria");
      return;
    }
    if (!novoLacre.trim()) {
      toast.error("Informe o número do novo lacre");
      return;
    }
    if (Object.values(medicamentos).some(v => v.status === "vencido")) {
      toast.error("Não é possível lacrar com medicações vencidas");
      return;
    }

    toast.success(`Carrinho ${carrinho} lacrado com sucesso!`);
    setConfirmacao(false);
    setNovoLacre("");
    setObservacoes("");
    if (onClose) {
      setTimeout(() => onClose(), 1000);
    }
  };

  const handleLimpar = () => {
    if (confirm("Deseja limpar o formulário?")) {
      const inicial = {};
      MEDICACOES_PADRAO.forEach(med => {
        inicial[med.id] = { qtdAtual: 0, validade: "", status: "pendente" };
      });
      setMedicamentos(inicial);
      setCarrinho("");
    }
  };

  return (
    <div className="space-y-6">
      {/* SELEÇÃO E DATA */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Selecione o Carrinho</label>
            <select
              value={carrinho}
              onChange={(e) => setCarrinho(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 bg-white"
            >
              <option value="">-- Escolha um carrinho --</option>
              <option value="RM 01">Ressonância Magnética 01</option>
              <option value="TC 01">Tomografia 01</option>
              <option value="Sala Preparo">Sala de Preparo 01</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Data da Auditoria</label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              disabled
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* TABELA DE MEDICAMENTOS */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
          <h3 className="text-lg font-bold text-gray-800">Medicações Críticas (ACLS)</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-3 text-left font-semibold text-gray-700 text-xs">Medicação</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700 text-xs">Qtd. Padrão</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700 text-xs">Qtd. Atual</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700 text-xs">Validade</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700 text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {MEDICACOES_PADRAO.map(med => {
                const dados = medicamentos[med.id];
                const isAlerta = dados?.status === "alerta";
                const isVencido = dados?.status === "vencido";
                const isAviso = dados?.status === "aviso";

                return (
                  <tr
                    key={med.id}
                    className={cn(
                      "border-b hover:bg-gray-50 transition-colors",
                      isVencido ? "bg-red-50" : isAlerta ? "bg-red-50" : isAviso ? "bg-amber-50" : ""
                    )}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-800">{med.nome}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 font-mono font-bold rounded text-sm flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {med.qtdPadrao}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        min="0"
                        value={dados?.qtdAtual || ""}
                        onChange={(e) => {
                          const novoVal = parseInt(e.target.value) || 0;
                          setMedicamentos(prev => ({
                            ...prev,
                            [med.id]: { ...prev[med.id], qtdAtual: novoVal }
                          }));
                          setTimeout(() => validarMedicamento(med.id), 0);
                        }}
                        className="w-20 px-2 py-2 border border-gray-300 rounded text-center text-sm font-semibold outline-none focus:border-blue-400"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="month"
                        value={dados?.validade || ""}
                        onChange={(e) => {
                          setMedicamentos(prev => ({
                            ...prev,
                            [med.id]: { ...prev[med.id], validade: e.target.value }
                          }));
                          setTimeout(() => validarMedicamento(med.id), 0);
                        }}
                        className="w-28 px-2 py-2 border border-gray-300 rounded text-center text-sm outline-none focus:border-blue-400"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      {dados?.status === "ok" && (
                        <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                          ✓ OK
                        </span>
                      )}
                      {dados?.status === "alerta" && (
                        <span className="inline-block px-2 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Repor
                        </span>
                      )}
                      {dados?.status === "aviso" && (
                        <span className="inline-block px-2 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full">
                          ⏰ Vence
                        </span>
                      )}
                      {dados?.status === "vencido" && (
                        <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                          🔴 VENCIDO
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* RESUMO */}
        <div className="px-6 py-4 bg-gray-50 border-t flex gap-6">
          <div>
            <p className="text-xs text-gray-500 font-semibold">Total</p>
            <p className="text-2xl font-bold text-gray-800">{resumo.total}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold">Conformes</p>
            <p className="text-2xl font-bold text-emerald-600">{resumo.conformes}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold">Reposição</p>
            <p className="text-2xl font-bold text-red-600">{resumo.alertas}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold">Vencimento</p>
            <p className="text-2xl font-bold text-amber-600">{resumo.avisos}</p>
          </div>
        </div>
      </div>

      {/* FECHAMENTO */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Finalização</h3>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Observações Gerais</label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Descreva qualquer ocorrência..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 resize-none"
          />
        </div>

        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <input
            type="checkbox"
            id="confirmacao"
            checked={confirmacao}
            onChange={(e) => setConfirmacao(e.target.checked)}
            className="w-5 h-5 mt-1 cursor-pointer accent-amber-600"
          />
          <label htmlFor="confirmacao" className="text-sm text-gray-700 cursor-pointer">
            <span className="font-semibold">Declaro que conferi todos os itens</span> e rompi o lacre anterior
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Número do Novo Lacre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={novoLacre}
            onChange={(e) => setNovoLacre(e.target.value)}
            placeholder="Ex: #4591"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 font-mono text-lg"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleLimpar}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
          >
            Limpar
          </button>
          <button
            onClick={handleLacrar}
            disabled={Object.values(medicamentos).some(v => v.status === "vencido") || !confirmacao || !novoLacre}
            className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShieldAlert className="w-4 h-4 inline mr-2" />
            Lacrar Carrinho
          </button>
        </div>
      </div>
    </div>
  );
}