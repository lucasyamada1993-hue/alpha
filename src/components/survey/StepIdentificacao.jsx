import SelectionGrid from "./SelectionGrid";
import {
  TIPO_ATENDIMENTO_OPTIONS, TIPO_ICONS,
  PERFIL_OPTIONS, PERFIL_ICONS,
} from "@/lib/surveyConfig";

export default function StepIdentificacao({ data, onChange, errors }) {
  return (
    <div className="space-y-8">
      <SelectionGrid
        title="Qual exame ou serviço você realizou?"
        options={TIPO_ATENDIMENTO_OPTIONS}
        icons={TIPO_ICONS}
        value={data.tipo_atendimento}
        fieldName="tipo_atendimento"
        onChange={onChange}
        error={errors.tipo_atendimento}
      />
      <SelectionGrid
        title="Você é:"
        options={PERFIL_OPTIONS}
        icons={PERFIL_ICONS}
        value={data.perfil_respondente}
        fieldName="perfil_respondente"
        onChange={onChange}
        error={errors.perfil_respondente}
      />
    </div>
  );
}