import { cn } from "@/lib/utils";

/**
 * Logo CX Alphasonic — canto superior direito (telas Welcome / Gestor login).
 * @param {{ className?: string }} [props]
 */
export default function LogoCxCorner(props = {}) {
  const { className } = props;
  return (
    <img
      src="/logo-cx-alphasonic.png"
      alt="Alphasonic"
      className={cn(
        "pointer-events-none absolute right-5 top-5 z-10 h-10 w-auto max-h-14 select-none object-contain object-right sm:h-12 md:right-8 md:top-8",
        className
      )}
    />
  );
}
