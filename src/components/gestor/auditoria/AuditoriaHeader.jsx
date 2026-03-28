import { ClipboardList } from "lucide-react";

export default function AuditoriaHeader() {
  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Auditoria de Processos</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Conformidade ONA &amp; ISO 9001 · Auditoria realizada em {hoje}
        </p>
      </div>
      <div className="flex items-center gap-2 bg-[#0D47A1] text-white px-5 py-3 rounded-xl shadow-md shadow-blue-200 text-sm font-semibold">
        <ClipboardList className="w-4 h-4" />
        Nova Auditoria
      </div>
    </div>
  );
}