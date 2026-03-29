import { Link } from "react-router-dom";
import { UserRound, Building2 } from "lucide-react";
import BrandingFachadaColumn from "@/components/BrandingFachadaColumn";

const heroTitleShadow =
  "[text-shadow:0_2px_20px_rgba(0,0,0,0.85),0_1px_4px_rgba(0,0,0,0.95)]";

export default function HomePortal() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <BrandingFachadaColumn>
        <h1
          className={`max-w-xl text-center text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl ${heroTitleShadow}`}
        >
          Bem-vindo à AlphaSonic
        </h1>
      </BrandingFachadaColumn>

      <div className="relative flex min-h-[50vh] flex-1 flex-col bg-white md:min-h-screen md:w-1/2">
        <div className="absolute right-5 top-5 z-10 flex items-center gap-2.5 md:right-8 md:top-8">
          <img
            src="/logo-cx-alphasonic.png"
            alt="Alphasonic"
            className="h-10 w-auto max-h-14 object-contain sm:h-12"
          />
          <span className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
            AlphaSonic
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8 pt-20 md:px-10 md:pb-10 md:pt-16">
          <div className="grid w-full max-w-md gap-4 sm:gap-5">
            <Link
              to="/pesquisa-inicial"
              className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-md transition hover:border-[#0D47A1]/20 hover:shadow-lg active:scale-[0.99] sm:p-7"
            >
              <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#0D47A1]/10 text-[#0D47A1] transition group-hover:bg-[#0D47A1]/15">
                <UserRound className="h-7 w-7" strokeWidth={2} />
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-lg font-bold text-gray-900">
                  Sua Experiência Alphasonic
                </span>
                <span className="text-sm leading-snug text-gray-500">
                  Queremos saber como foi o nosso cuidado com você
                </span>
              </span>
            </Link>

            <Link
              to="/gestor-inicial"
              className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-md transition hover:border-[#0D47A1]/20 hover:shadow-lg active:scale-[0.99] sm:p-7"
            >
              <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#0D47A1]/10 text-[#0D47A1] transition group-hover:bg-[#0D47A1]/15">
                <Building2 className="h-7 w-7" strokeWidth={2} />
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-lg font-bold text-gray-900">Equipe Alphasonic</span>
                <span className="text-sm leading-snug text-gray-500">
                  Área para colaboradores
                </span>
              </span>
            </Link>
          </div>
        </div>

        <footer className="border-t border-gray-100 bg-gray-50/80 py-4">
          <p className="px-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
            Alphasonic © 2026 — Sistema de gestão e qualidade
          </p>
        </footer>
      </div>
    </div>
  );
}
