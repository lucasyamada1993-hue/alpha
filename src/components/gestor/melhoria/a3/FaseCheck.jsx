import { useState } from "react";
import { Upload, X, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { db } from "@/api/sheetsClient";

function Field({ label, value, onChange, multiline, placeholder, required }) {
  const cls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-gray-300";
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {multiline
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls} />
        : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  );
}

export default function FaseCheck({ data, onChange }) {
  const [uploading, setUploading] = useState(false);
  const evidencias = data.check_evidencias_urls || [];

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    onChange("check_evidencias_urls", [...evidencias, file_url]);
    setUploading(false);
  };

  const removeEvidencia = (idx) => {
    onChange("check_evidencias_urls", evidencias.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-5">
      {/* Resultados */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-6 rounded-full bg-purple-500" />
          <h3 className="font-bold text-gray-800">Verificação dos Resultados</h3>
        </div>
        <Field label="Resultados Observados" value={data.check_resultados || ""} onChange={(v) => onChange("check_resultados", v)}
          multiline placeholder="Descreva os resultados obtidos após a execução das ações..." required />
        <Field label="Indicadores de Qualidade Acompanhados" value={data.check_indicadores || ""} onChange={(v) => onChange("check_indicadores", v)}
          multiline placeholder="Ex: Taxa de refação reduziu de 18% para 4,2% em 60 dias..." required />
      </div>

      {/* Eficácia */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 rounded-full bg-purple-500" />
          <div>
            <h3 className="font-bold text-gray-800">Avaliação de Eficácia</h3>
            <p className="text-xs text-gray-400 mt-0.5">As ações executadas atingiram a meta definida na fase PLAN?</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => onChange("check_eficaz", true)}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all flex-1 ${data.check_eficaz === true ? "bg-emerald-50 border-emerald-400" : "bg-white border-gray-100 hover:border-emerald-200"}`}
          >
            <CheckCircle2 className={`w-6 h-6 ${data.check_eficaz === true ? "text-emerald-500" : "text-gray-300"}`} />
            <div className="text-left">
              <p className={`font-bold text-sm ${data.check_eficaz === true ? "text-emerald-700" : "text-gray-400"}`}>Eficaz</p>
              <p className="text-xs text-gray-400">Meta atingida — pode avançar para ACT</p>
            </div>
          </button>
          <button
            onClick={() => onChange("check_eficaz", false)}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all flex-1 ${data.check_eficaz === false ? "bg-red-50 border-red-400" : "bg-white border-gray-100 hover:border-red-200"}`}
          >
            <XCircle className={`w-6 h-6 ${data.check_eficaz === false ? "text-red-500" : "text-gray-300"}`} />
            <div className="text-left">
              <p className={`font-bold text-sm ${data.check_eficaz === false ? "text-red-700" : "text-gray-400"}`}>Não Eficaz</p>
              <p className="text-xs text-gray-400">Retornar ao PLAN com nova análise</p>
            </div>
          </button>
        </div>
      </div>

      {/* Evidências */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 rounded-full bg-purple-500" />
          <div>
            <h3 className="font-bold text-gray-800">Evidências Objetivas</h3>
            <p className="text-xs text-gray-400 mt-0.5">Anexe fotos, gráficos ou documentos que comprovem os resultados</p>
          </div>
        </div>

        {evidencias.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            {evidencias.map((url, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                {url.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                  ? <img src={url} alt={`Evidência ${idx + 1}`} className="w-full h-24 object-cover" />
                  : <div className="w-full h-24 flex items-center justify-center">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline px-2 text-center">
                        Evidência {idx + 1} — abrir arquivo
                      </a>
                    </div>
                }
                <button
                  onClick={() => removeEvidencia(idx)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                >
                  <X className="w-3 h-3 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className={`flex flex-col items-center gap-3 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${uploading ? "border-blue-200 bg-blue-50/50" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/30"}`}>
          {uploading
            ? <><Loader2 className="w-7 h-7 text-blue-400 animate-spin" /><p className="text-sm text-blue-500 font-medium">Enviando evidência...</p></>
            : <><Upload className="w-7 h-7 text-gray-300" /><p className="text-sm text-gray-400">Clique para anexar arquivo ou imagem</p><p className="text-xs text-gray-300">PNG, JPG, PDF, XLSX</p></>
          }
          <input type="file" className="hidden" onChange={handleUpload} accept="image/*,.pdf,.xlsx,.docx" disabled={uploading} />
        </label>
      </div>
    </div>
  );
}