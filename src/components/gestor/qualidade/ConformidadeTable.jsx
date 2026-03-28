const AUDITORIAS = [
  {
    setor: "Carrinho de Emergência (TC)",
    status: "conforme",
    acao: "-",
    responsavel: "Enf. Chefe",
  },
  {
    setor: "Tempo de Laudo (Ressonância)",
    status: "nao_conforme",
    acao: "Plano A3 #042",
    responsavel: "Coord. Médica",
  },
  {
    setor: "Treinamento PDI (Punção)",
    status: "em_andamento",
    acao: "-",
    responsavel: "RH/Qualidade",
  },
];

export default function ConformidadeTable() {
  const handleA3Click = (a3Ref) => {
    alert(`Abrindo detalhes do Plano de Ação ${a3Ref} (5W3H)...`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Painel de Conformidade e Ações Corretivas</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Setor/Processo</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status da Auditoria</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Ação Aberta (PDCA)</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Responsável</th>
            </tr>
          </thead>
          <tbody>
            {AUDITORIAS.map((audit, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-gray-800">{audit.setor}</td>
                <td className="px-4 py-3">
                  {audit.status === "conforme" && (
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                      ✓ Conforme
                    </span>
                  )}
                  {audit.status === "nao_conforme" && (
                    <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
                      ✗ Não Conforme (SLA Estourado)
                    </span>
                  )}
                  {audit.status === "em_andamento" && (
                    <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full">
                      ⏳ Em andamento
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {audit.acao !== "-" ? (
                    <button
                      onClick={() => handleA3Click(audit.acao)}
                      className="text-blue-600 hover:text-blue-800 font-semibold underline"
                    >
                      {audit.acao} - Redução de Gargalo
                    </button>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{audit.responsavel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}