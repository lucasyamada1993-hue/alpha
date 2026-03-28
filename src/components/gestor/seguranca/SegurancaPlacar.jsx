import { ShieldCheck } from "lucide-react";

export default function SegurancaPlacar({ dias }) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-600 px-8 py-6 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <div>
          <p className="text-emerald-100 text-sm font-medium uppercase tracking-widest mb-1">
            Registro de Segurança
          </p>
          <p className="text-white text-2xl font-extrabold leading-tight">
            Estamos há{" "}
            <span className="text-4xl">{dias}</span>{" "}
            Dias sem incidentes com dano ao paciente
          </p>
        </div>
      </div>
      <div className="hidden md:flex flex-col items-center bg-white/10 rounded-2xl px-6 py-4 border border-white/20">
        <span className="text-white/70 text-xs uppercase tracking-wider mb-1">Meta</span>
        <span className="text-white font-extrabold text-3xl">365</span>
        <span className="text-white/70 text-xs">dias</span>
      </div>
    </div>
  );
}