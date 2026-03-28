import { ShieldPlus } from "lucide-react";

export default function SegurancaHeader({ onNova }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Gestão de Segurança e Riscos</h1>
        <p className="text-xs text-gray-400 mt-0.5">Monitoramento de eventos adversos e ações corretivas</p>
      </div>
      <button
        onClick={onNova}
        className="flex items-center gap-2 bg-[#0D47A1] hover:bg-[#0B3D91] text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-blue-200 transition-all text-sm whitespace-nowrap"
      >
        <ShieldPlus className="w-5 h-5" />
        Nova Notificação de Incidente
      </button>
    </div>
  );
}