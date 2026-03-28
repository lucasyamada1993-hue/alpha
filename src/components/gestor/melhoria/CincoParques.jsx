import { ArrowDown, Lightbulb } from "lucide-react";

export default function CincoParques({ porques, setPorques, problema }) {
  const handleChange = (index, value) => {
    const next = [...porques];
    next[index] = value;
    setPorques(next);
  };

  const causaRaiz = porques.filter(Boolean).at(-1);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="mb-5">
        <h3 className="font-bold text-gray-800">Método dos 5 Porquês</h3>
        <p className="text-xs text-gray-400 mt-0.5">Aprofunde cada resposta para chegar à causa raiz.</p>
      </div>

      <div className="space-y-3">
        {/* Problema disparador */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Problema</p>
          <p className="text-sm text-blue-800 font-medium">{problema || "Defina o problema acima antes de iniciar."}</p>
        </div>

        {porques.map((p, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-gray-300" />
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0D47A1] text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 mb-1">Por que isso ocorre?</p>
                <input
                  type="text"
                  value={p}
                  onChange={(e) => handleChange(i, e.target.value)}
                  placeholder={`Resposta ao ${i === 0 ? "problema" : `${i}º porquê`}...`}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder:text-gray-300 transition-all"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {causaRaiz && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-0.5">Causa Raiz Identificada</p>
            <p className="text-sm text-amber-800 font-medium">{causaRaiz}</p>
          </div>
        </div>
      )}
    </div>
  );
}