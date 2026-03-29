import { useState } from "react";

const DEFAULT_SRC = "/fachada-alphasonic.png";

/** Coluna esquerda com foto da fachada (public/fachada-alphasonic.png). Sem arquivo, usa gradiente. */
export default function BrandingFachadaColumn({ children, imageSrc = DEFAULT_SRC }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative flex min-h-[45vh] flex-col overflow-hidden md:min-h-screen md:w-1/2">
      {!imgError && (
        <img
          src={imageSrc}
          alt="Fachada Alphasonic"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
          onError={() => setImgError(true)}
        />
      )}
      {imgError && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#0d47a1] via-[#1565C0] to-[#0a3d91]"
          aria-hidden
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/60"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[45vh] flex-1 flex-col items-center justify-center px-10 py-10 md:min-h-screen md:py-12">
        {children}
      </div>
    </div>
  );
}
