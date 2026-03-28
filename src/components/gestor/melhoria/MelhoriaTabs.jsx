import { cn } from "@/lib/utils";
import { HelpCircle, GitBranch, Table2, FileText, Layers } from "lucide-react";

const TABS = [
  { id: "5porques", label: "5 Porquês", icon: HelpCircle, desc: "Causa raiz" },
  { id: "ishikawa", label: "Ishikawa", icon: GitBranch, desc: "Espinha de peixe" },
  { id: "5w3h", label: "Matriz 5W3H", icon: Table2, desc: "Plano de ação" },
  { id: "relatorio", label: "Relatório Executivo", icon: FileText, desc: "PDF para diretoria" },
  { id: "a3", label: "Plano A3", icon: Layers, desc: "Auditoria & IA" },
];

export default function MelhoriaTabs({ activeTab, setActiveTab }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {TABS.map(({ id, label, icon: Icon, desc }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all",
              active
                ? "bg-[#0D47A1] border-[#0D47A1] text-white shadow-md shadow-blue-200"
                : "bg-white border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50/40"
            )}
          >
            <Icon className={cn("w-5 h-5 flex-shrink-0", active ? "text-white" : "text-[#0D47A1]")} />
            <div>
              <p className={cn("text-sm font-semibold leading-tight", active ? "text-white" : "text-gray-800")}>{label}</p>
              <p className={cn("text-[11px] mt-0.5", active ? "text-blue-100" : "text-gray-400")}>{desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}