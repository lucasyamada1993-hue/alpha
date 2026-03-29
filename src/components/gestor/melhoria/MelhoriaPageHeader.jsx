/**
 * Cabeçalho da rota Melhoria Contínua — visível acima da lista e do formulário novo A3.
 */
export default function MelhoriaPageHeader({ rightSlot = null }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Planos de Melhoria (A3 — PDCA)</h1>
        <p className="text-sm text-gray-500 mt-1">Gestão de Ações Corretivas e Melhorias Contínuas</p>
      </div>
      {rightSlot ? <div className="flex-shrink-0">{rightSlot}</div> : null}
    </div>
  );
}
