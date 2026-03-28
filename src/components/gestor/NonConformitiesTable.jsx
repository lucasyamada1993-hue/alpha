import { cn } from "@/lib/utils";

const DATA = [
  { id: "NC-2024-041", data: "27/03/2026", modalidade: "Tomografia", descricao: "Protocolo de contraste não seguido corretamente", status: "Pendente" },
  { id: "NC-2024-040", data: "25/03/2026", modalidade: "Raio-X", descricao: "Laudo emitido fora do prazo estabelecido (TAT > 24h)", status: "Resolvido" },
  { id: "NC-2024-039", data: "22/03/2026", modalidade: "Ultrassom", descricao: "Ausência de checklist pré-exame preenchido", status: "Resolvido" },
  { id: "NC-2024-038", data: "18/03/2026", modalidade: "Ressonância", descricao: "Paciente sem triagem de implantes metálicos", status: "Pendente" },
  { id: "NC-2024-037", data: "15/03/2026", modalidade: "Raio-X", descricao: "Falha no registro de dose de radiação no prontuário", status: "Resolvido" },
];

export default function NonConformitiesTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Últimas Não Conformidades</h3>
          <p className="text-xs text-gray-400 mt-0.5">Registro de ocorrências do período</p>
        </div>
        <button className="text-xs text-[#0D47A1] font-medium hover:underline">Ver todas →</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-5 py-3 text-left font-semibold">ID</th>
              <th className="px-5 py-3 text-left font-semibold">Data</th>
              <th className="px-5 py-3 text-left font-semibold">Modalidade</th>
              <th className="px-5 py-3 text-left font-semibold">Descrição</th>
              <th className="px-5 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {DATA.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-gray-500 font-medium">{row.id}</td>
                <td className="px-5 py-3.5 text-gray-500 text-xs">{row.data}</td>
                <td className="px-5 py-3.5">
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                    {row.modalidade}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-gray-600 text-xs max-w-xs">{row.descricao}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-semibold",
                      row.status === "Pendente"
                        ? "bg-red-50 text-red-600"
                        : "bg-green-50 text-green-600"
                    )}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}