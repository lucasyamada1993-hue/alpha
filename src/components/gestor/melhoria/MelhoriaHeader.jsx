import { TrendingUp } from "lucide-react";

export default function MelhoriaHeader({ problema, setProblema }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#0D47A1] flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-gray-800 text-base">Definição do Problema</h2>
          <p className="text-xs text-gray-400 mt-0.5 mb-3">
            Descreva o processo com falha de forma clara e objetiva para iniciar a análise.
          </p>
          <input
            type="text"
            value={problema}
            onChange={(e) => setProblema(e.target.value)}
            placeholder="Ex: Alta taxa de refação em tomografias — 18% acima da meta de 5%"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder:text-gray-300 transition-all"
          />
        </div>
      </div>
    </div>
  );
}