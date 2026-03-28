import { Users, Download } from "lucide-react";

const ESCALA_SIMULADA = [
  { setor: "Tomografia", profissional: "Carlos Lima", horario: "07:00-15:00" },
  { setor: "Ressonância", profissional: "Ana Souza", horario: "07:00-15:00" },
  { setor: "Punção/Preparo", profissional: "Fernanda Melo", horario: "15:00-23:00" },
  { setor: "Raio-X", profissional: "Ricardo Neves", horario: "07:00-15:00" },
  { setor: "Suporte", profissional: "Bruna Costa", horario: "15:00-23:00" },
];

export default function EscalaCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800 text-sm">Escala Diária - Setores</h3>
        </div>
        <button className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-semibold transition-colors">
          <Download className="w-3.5 h-3.5" /> Exportar
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Setor</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Profissional</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Horário</th>
            </tr>
          </thead>
          <tbody>
            {ESCALA_SIMULADA.map((row, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-700">{row.setor}</td>
                <td className="px-4 py-3 text-gray-600">{row.profissional}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{row.horario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}