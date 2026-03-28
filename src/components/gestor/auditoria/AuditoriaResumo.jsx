import { cn } from "@/lib/utils";

const COR_BARRA = {
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
};

function calcularResumo(itens, avaliacoes) {
  const total = itens.length;
  const avaliados = itens.filter((i) => avaliacoes[i.id]).length;
  const conformes = itens.filter((i) => avaliacoes[i.id] === "C").length;
  const nc = itens.filter((i) => avaliacoes[i.id] === "NC").length;
  const om = itens.filter((i) => avaliacoes[i.id] === "OM").length;
  const pct = total > 0 ? Math.round((avaliados / total) * 100) : 0;
  const conformidade = avaliados > 0 ? Math.round((conformes / avaliados) * 100) : 0;
  return { total, avaliados, conformes, nc, om, pct, conformidade };
}

export default function AuditoriaResumo({ categorias, avaliacoes }) {
  const totais = categorias.flatMap((c) => c.itens);
  const global = calcularResumo(totais, avaliacoes);

  return (
    <div className="flex flex-col gap-5">
      {/* Resumo Global */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Resumo Geral</h3>

        <div className="flex flex-col gap-1 mb-4">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-medium">Progresso da Auditoria</span>
            <span className="font-bold text-gray-700">{global.pct}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0D47A1] rounded-full transition-all duration-500"
              style={{ width: `${global.pct}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {global.avaliados} de {global.total} POPs avaliados
          </p>
        </div>

        <div className="flex flex-col gap-1 mb-5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-medium">Taxa de Conformidade</span>
            <span className={cn("font-bold", global.conformidade >= 80 ? "text-emerald-600" : "text-red-600")}>
              {global.conformidade}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", global.conformidade >= 80 ? "bg-emerald-500" : "bg-red-500")}
              style={{ width: `${global.conformidade}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "C", valor: global.conformes, cor: "text-emerald-600 bg-emerald-50" },
            { label: "NC", valor: global.nc, cor: "text-red-600 bg-red-50" },
            { label: "OM", valor: global.om, cor: "text-amber-600 bg-amber-50" },
          ].map(({ label, valor, cor }) => (
            <div key={label} className={cn("rounded-lg py-2.5 px-1", cor)}>
              <p className="text-xl font-extrabold">{valor}</p>
              <p className="text-[10px] font-semibold mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Por Categoria */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Por Categoria</h3>
        <div className="flex flex-col gap-4">
          {categorias.map((cat) => {
            const { avaliados, total, conformidade } = calcularResumo(cat.itens, avaliacoes);
            const barCor = COR_BARRA[cat.cor] || "bg-blue-500";
            return (
              <div key={cat.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium truncate max-w-[130px]">{cat.label}</span>
                  <span className="text-gray-400 text-[10px]">{avaliados}/{total}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", barCor)}
                    style={{ width: total > 0 ? `${(avaliados / total) * 100}%` : "0%" }}
                  />
                </div>
                {avaliados > 0 && (
                  <p className="text-[10px] text-gray-400 mt-0.5">{conformidade}% conforme</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}