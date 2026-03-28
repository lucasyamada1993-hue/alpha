// @ts-nocheck
import { useState } from "react";
import { Copy, Check, ArrowLeft, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { HTML_CODE, GAS_CODE, JORNADA_HTML } from "@/lib/gasHtmlCodes";

const TABS = [
  { id: "html",    label: "Index.html (Totem)",      code: HTML_CODE },
  { id: "jornada", label: "Jornada.html (Gestor)",   code: JORNADA_HTML },
  { id: "gas",     label: "Codigo.gs (GAS)",          code: GAS_CODE },
];

const INSTRUCOES = {
  html: {
    titulo: "Como usar o Index.html no GAS:",
    passos: [
      <>No editor do Apps Script, crie um arquivo <code>Index.html</code></>,
      <>Cole o conteúdo acima neste arquivo</>,
      <>No <code>Codigo.gs</code>, a função <code>doGet()</code> já está inclusa no código</>,
      <>Implante como <strong>Aplicativo da Web</strong> com acesso "Qualquer pessoa"</>,
      <>Substitua o <code>setTimeout</code> simulado pela chamada real: <code>google.script.run.withSuccessHandler(onSuccess).receberResposta(data)</code></>,
    ],
  },
  jornada: {
    titulo: "Como usar o Jornada.html no GAS:",
    passos: [
      <>No editor do Apps Script, crie um arquivo <code>Jornada.html</code></>,
      <>Cole o conteúdo acima neste arquivo</>,
      <>Para carregar: <code>{'HtmlService.createHtmlOutputFromFile("Jornada")'}</code></>,
      <>Substitua os dados estáticos via <code>google.script.run.getJornadaData()</code></>,
      <>O botão "Validar Time-Out" já tem o comentário para conectar ao GAS: <code>google.script.run.registrarTimeout(id)</code></>,
    ],
  },
  gas: null,
};

export default function GasReference() {
  const [activeTab, setActiveTab] = useState("jornada");
  const [copied, setCopied] = useState(false);

  const current = TABS.find(t => t.id === activeTab);
  const instrucao = INSTRUCOES[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    toast.success("Código copiado!");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Código-fonte GAS</h1>
          </div>
        </div>

        {/* Abas */}
        <div className="flex gap-2 mb-4">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Bloco de código */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-muted border-b border-border">
            <span className="text-sm font-medium text-muted-foreground">{current.label}</span>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copiado!" : "Copiar"}
            </Button>
          </div>
          <pre className="p-4 overflow-auto text-xs leading-relaxed font-mono text-foreground max-h-[65vh]">
            <code>{current.code}</code>
          </pre>
        </div>

        {/* Instruções de uso */}
        {instrucao && (
          <div className="mt-6 bg-accent/50 rounded-xl p-5 border border-border">
            <h3 className="font-semibold text-foreground mb-3">{instrucao.titulo}</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              {instrucao.passos.map((passo, i) => (
                <li key={i}>{passo}</li>
              ))}
            </ol>
          </div>
        )}

      </div>
    </div>
  );
}