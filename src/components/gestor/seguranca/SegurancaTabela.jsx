import { cn } from "@/lib/utils";

const GRAU_STYLES = {
  "Sem Dano": "bg-gray-100 text-gray-600",
  "Leve": "bg-amber-100 text-amber-700",
  "Moderado": "bg-orange-100 text-orange-700",
  "Grave": "bg-red-100 text-red-700",
};

const STATUS_STYLES = {
  "Em Investigação": "bg-amber-50 text-amber-700",
  "Ação Corretiva Aberta": "bg-blue-50 text-blue-700",
  "Investigação Concluída": "bg-green-50 text-green-700",
};

export default function SegurancaTabela({ eventos }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800 text-sm">
          Registro de Eventos Adversos e Quase Falhas (Near Miss)
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{eventos.length} eventos registrados no sistema</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-5 py-3 text-left font-semibold">Data</th>
              <th className="px-5 py-3 text-left font-semibold">Setor</th>
              <th className="px-5 py-3 text-left font-semibold">Categoria</th>
              <th className="px-5 py-3 text-left font-semibold">Grau do Dano</th>
              <th className="px-5 py-3 text-left font-semibold">Status da Investigação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {eventos.map((ev) => (
              <tr key={ev.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-3.5 text-xs text-gray-500 font-medium">{ev.data}</td>
                <td className="px-5 py-3.5">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
                    {ev.setor}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs text-gray-700">{ev.categoria}</td>
                <td className="px-5 py-3.5">
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", GRAU_STYLES[ev.grau] || "bg-gray-100 text-gray-600")}>
                    {ev.grau}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", STATUS_STYLES[ev.status] || "bg-gray-100 text-gray-600")}>
                    {ev.status}
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