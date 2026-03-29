import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname);

export default defineConfig(({ mode }) => {
  /** .env na mesma pasta do vite.config.js (evita cwd errado ao abrir o projeto por outro diretório) */
  const env = loadEnv(mode, rootDir, "");
  /** Suporta nome alternativo para o mesmo valor (alguns ambientes só expõem VITE_*). */
  const gasUrl = (
    env.APPS_SCRIPT_WEB_APP_URL ||
    env.VITE_APPS_SCRIPT_WEB_APP_URL ||
    ""
  ).trim();
  const sheetsApi = (env.VITE_SHEETS_API_URL || "/api/sheets").trim();

  const server = {};
  let proxyConfigured = false;

  if (gasUrl && sheetsApi.startsWith("/")) {
    try {
      const u = new URL(gasUrl);
      const target = `${u.protocol}//${u.host}`;
      const execPath = u.pathname + (u.search || "");
      server.proxy = {
        [sheetsApi]: {
          target,
          changeOrigin: true,
          secure: true,
          rewrite: () => execPath,
        },
      };
      proxyConfigured = true;
      if (mode === "development") {
        const idPreview = execPath.split("/").filter(Boolean).slice(-2).join("/") || "exec";
        console.info(`[vite] Proxy ${sheetsApi} → script.google.com/.../${idPreview} (OK)`);
      }
    } catch (e) {
      console.warn("[vite] URL do Apps Script inválida:", e?.message || e);
    }
  }

  if (!proxyConfigured && mode === "development" && sheetsApi.startsWith("/")) {
    console.warn(
      "[vite] Sem proxy para a planilha. Adicione no .env (na pasta do projeto): APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/.../exec e reinicie o Vite."
    );
  }

  /** Sem proxy: responde JSON (evita 404 “mudo” no /api/sheets) — enforce pre para rodar cedo */
  const sheetsApiGuard =
    !proxyConfigured && sheetsApi.startsWith("/")
      ? {
          name: "sheets-api-guard",
          enforce: "pre",
          configureServer(viteServer) {
            viteServer.middlewares.use((req, res, next) => {
              const p = req.url?.split("?")[0] || "";
              if (p !== sheetsApi && !p.startsWith(`${sheetsApi}/`)) {
                return next();
              }
              const hint = gasUrl
                ? "APPS_SCRIPT_WEB_APP_URL (ou VITE_APPS_SCRIPT_WEB_APP_URL) parece inválida."
                : "Crie .env na raiz do projeto com APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/.../exec e reinicie npm run dev.";
              res.statusCode = 503;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(
                JSON.stringify({
                  ok: false,
                  error: `Proxy do Vite não configurado. ${hint}`,
                })
              );
            });
          },
        }
      : null;

  return {
    envDir: rootDir,
    logLevel: "error",
    plugins: [sheetsApiGuard, react()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server,
  };
});
