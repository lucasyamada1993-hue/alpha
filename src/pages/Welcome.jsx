import { Link } from "react-router-dom";
import { Timer, Lock, ShieldCheck } from "lucide-react";
import BrandingFachadaColumn from "@/components/BrandingFachadaColumn";
import LogoCxCorner from "@/components/LogoCxCorner";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <BrandingFachadaColumn>
        <div className="flex flex-col items-center gap-5 text-center max-w-lg mx-auto">
          <h1 className="text-white font-extrabold text-3xl md:text-4xl lg:text-5xl leading-tight [text-shadow:0_2px_20px_rgba(0,0,0,0.85),0_1px_4px_rgba(0,0,0,0.95)]">
            Cuidar de você é a nossa maior inspiração.
          </h1>
          <p className="text-white text-base md:text-lg font-medium leading-relaxed [text-shadow:0_2px_12px_rgba(0,0,0,0.8),0_1px_2px_rgba(0,0,0,0.9)]">
            Nos ajude a aperfeiçoar cada detalhe do nosso encontro.
          </p>
        </div>
      </BrandingFachadaColumn>

      <div className="relative flex min-h-[50vh] flex-col bg-white md:min-h-screen md:w-1/2">
        <LogoCxCorner />

        <div className="flex flex-1 flex-col items-center justify-center px-8 pb-10 pt-16 md:py-0">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4 leading-tight">
            Que bom ter você aqui.
          </h2>

          <p className="text-gray-500 text-center text-base md:text-lg mb-10 max-w-md leading-relaxed">
            Buscamos excelência em cada imagem. Avalie sua experiência e nos ajude a evoluir
          </p>

          <Link to="/pesquisa" className="w-full max-w-sm block">
            <button
              type="button"
              className="w-full flex items-center justify-center text-white text-lg font-semibold px-8 py-5 rounded-full shadow-lg transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#0D47A1" }}
            >
              Compartilhar minha experiência
            </button>
          </Link>

          <div className="flex flex-wrap gap-3 justify-center mt-6 w-full max-w-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2.5 text-sm text-gray-700">
              <Timer className="w-4 h-4 flex-shrink-0" style={{ color: "#0D47A1" }} />
              <span>Leva 1 minutinho</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2.5 text-sm text-gray-700">
              <Lock className="w-4 h-4 flex-shrink-0" style={{ color: "#0D47A1" }} />
              <span>100% Anônimo</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 py-5 px-6 border-t border-gray-100">
          <ShieldCheck className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <p className="text-[10px] text-gray-500 text-center leading-snug max-w-sm">
            Cuidamos dos seus dados com o mesmo carinho que cuidamos de você (Protegido pela LGPD)
          </p>
        </div>
      </div>
    </div>
  );
}
