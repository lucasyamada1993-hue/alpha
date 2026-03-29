import { Link } from "react-router-dom";
import { UserRound, Building2 } from "lucide-react";

export default function HomePortal() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0d47a1] via-[#1565C0] to-[#0a3d91] px-6 py-12">
      <div className="w-full max-w-lg text-center space-y-10">
        <h1 className="text-white font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight">
          Bem-vindo à Alpha Sonic
        </h1>

        <div className="grid gap-4 sm:gap-5">
          <Link
            to="/pesquisa-inicial"
            className="group flex items-center gap-4 rounded-2xl bg-white p-6 sm:p-7 text-left shadow-lg transition hover:shadow-xl hover:scale-[1.02] active:scale-[0.99]"
          >
            <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#0D47A1]/10 text-[#0D47A1]">
              <UserRound className="h-7 w-7" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-lg font-bold text-gray-900">Sou cliente</span>
              <span className="text-sm text-gray-500">Avaliação e pesquisa de satisfação</span>
            </span>
          </Link>

          <Link
            to="/gestor-inicial"
            className="group flex items-center gap-4 rounded-2xl bg-white p-6 sm:p-7 text-left shadow-lg transition hover:shadow-xl hover:scale-[1.02] active:scale-[0.99]"
          >
            <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#0D47A1]/10 text-[#0D47A1]">
              <Building2 className="h-7 w-7" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-lg font-bold text-gray-900">Profissional Alphasonic</span>
              <span className="text-sm text-gray-500">Acesso ao painel de gestão</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
