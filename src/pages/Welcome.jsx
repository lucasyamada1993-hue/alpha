import { Link } from "react-router-dom";
import { Play, Timer, Lock, ShieldCheck } from "lucide-react";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ── Coluna Esquerda: Branding ── */}
      <div className="relative flex flex-col justify-between md:w-1/2 min-h-[45vh] md:min-h-screen bg-gradient-to-br from-[#0d47a1] via-[#1565C0] to-[#0a3d91]">
        <div className="absolute inset-0 bg-[#0D47A1]/20" />

        <div className="relative z-10 p-8" />

        {/* Headline central */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-10 py-8">
          <h1 className="text-white font-extrabold text-3xl md:text-4xl lg:text-5xl text-center leading-tight">
            Sua opinião nos ajuda a cuidar melhor de você!
          </h1>
        </div>

        {/* Spacer bottom */}
        <div className="relative z-10 p-8 hidden md:block" />
      </div>

      {/* ── Coluna Direita: Interação ── */}
      <div className="relative flex flex-col md:w-1/2 bg-white">

        {/* Conteúdo centralizado */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-14 md:py-0">

          {/* Ícone decorativo */}
          {/* Título */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4 leading-tight">
            Bem-vindo(a) à<br />Alphasonic
          </h2>

          {/* Subtítulo */}
          <p className="text-gray-500 text-center text-base md:text-lg mb-10 max-w-xs leading-relaxed">
            Toque no botão abaixo para iniciar sua avaliação. Leva menos de 1 minuto.
          </p>

          {/* Botão CTA */}
          <Link to="/pesquisa" className="w-full max-w-sm block">
            <button
              className="w-full flex items-center justify-between text-white text-lg font-semibold px-8 py-5 rounded-full shadow-lg transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#0D47A1" }}
            >
              <span>Iniciar Pesquisa</span>
              <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ml-4 flex-shrink-0">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </span>
            </button>
          </Link>

          {/* Cards info */}
          <div className="flex gap-3 mt-6 w-full max-w-sm">
            <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-2xl px-5 py-4">
              <Timer className="w-5 h-5 flex-shrink-0" style={{ color: "#0D47A1" }} />
              <span className="text-sm font-medium text-gray-600">Rápido</span>
            </div>
            <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-2xl px-5 py-4">
              <Lock className="w-5 h-5 flex-shrink-0" style={{ color: "#0D47A1" }} />
              <span className="text-sm font-medium text-gray-600">Anônimo</span>
            </div>
          </div>
        </div>

        {/* Rodapé fixo */}
        <div className="flex items-center justify-center gap-2 py-5 px-6 border-t border-gray-100">
          <ShieldCheck className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center">
            Seus dados estão seguros e protegidos pela LGPD.
          </p>
        </div>
      </div>

    </div>
  );
}