import { cn } from "@/lib/utils";
import React from "react";

export default function SecaoKPIs({ titulo, icone: Icon, cor = "blue", children }) {
  const colorMap = {
    blue:   "border-blue-200 bg-blue-50 text-blue-700",
    emerald:"border-emerald-200 bg-emerald-50 text-emerald-700",
    amber:  "border-amber-200 bg-amber-50 text-amber-700",
    rose:   "border-rose-200 bg-rose-50 text-rose-700",
    purple: "border-purple-200 bg-purple-50 text-purple-700",
    slate:  "border-slate-200 bg-slate-50 text-slate-700",
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className={cn("w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0", colorMap[cor])}>
          <Icon className="w-4 h-4" />
        </div>
        <h2 className="font-bold text-gray-700 text-sm tracking-wide">{titulo}</h2>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      {children}
    </div>
  );
}