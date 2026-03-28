# Alphasonic — Gestão (Vite + React)

Painel e pesquisas com dados no **Google Sheets**, acesso via **Google Apps Script**.

## O que configurar (dois valores diferentes)

| O quê | Onde pegar | Onde colocar |
|--------|------------|----------------|
| **ID da planilha** | URL do Sheets: `https://docs.google.com/spreadsheets/d/ESTE_ID_AQUI/edit` | No **Apps Script**, variável `SPREADSHEET_ID` em `google-apps-script/Code.gs` (e o mesmo no projeto em script.google.com). |
| **URL do Web App** | Termina em `/exec` (Implantar → App da Web) | `VITE_SHEETS_API_URL` e/ou `APPS_SCRIPT_WEB_APP_URL` — veja `.env.example`. |

O front **não** grava o ID da planilha; só fala com o script via HTTP.

## Como rodar

```bash
npm install
cp .env.example .env
# Edite .env com a URL /exec ou use /api/sheets + proxy na Vercel
npm run dev
```

Build:

```bash
npm run build
```

## Variáveis de ambiente

Copie `.env.example` para `.env` (o `.env` não deve ir para o Git).

- **Desenvolvimento:** pode usar a URL `/exec` direta em `VITE_SHEETS_API_URL` (às vezes o navegador bloqueia por CORS) ou `npx vercel dev` com o proxy.
- **Produção (Vercel):** `VITE_SHEETS_API_URL=/api/sheets` e, nas variáveis do **servidor**, `APPS_SCRIPT_WEB_APP_URL` = URL `/exec` completa.

## Google Apps Script

Instruções detalhadas: [google-apps-script/README.md](google-apps-script/README.md).

## GitHub

Crie o repositório na conta desejada e:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USUARIO/NOME-DO-REPO.git
git push -u origin main
```

Não commite `.env` (já está no `.gitignore`).
