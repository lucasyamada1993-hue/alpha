import NPSScale from "./NPSScale";
import { Textarea } from "@/components/ui/textarea";

export default function StepNPS({ data, onChange, errors }) {
  return (
    <div className="space-y-8">
      <NPSScale
        value={data.nps_recomendacao}
        onChange={onChange}
        error={errors.nps_recomendacao}
      />
      <div className="space-y-3 max-w-lg mx-auto">
        <p className="text-base font-medium text-center text-foreground">
          Comentário ou sugestão{" "}
          <span className="text-muted-foreground text-sm">(opcional)</span>
        </p>
        <Textarea
          value={data.comentarios_finais || ""}
          onChange={(e) => onChange("comentarios_finais", e.target.value)}
          placeholder="Fique à vontade para deixar sua mensagem aqui"
          className="min-h-[120px] text-base resize-none rounded-xl"
        />
      </div>
    </div>
  );
}