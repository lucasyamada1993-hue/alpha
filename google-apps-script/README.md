# Google Apps Script (backend Sheets)

## 1. Dois IDs diferentes (não confundir)

- **ID da planilha (Sheets)** — fica na URL do Google Sheets, entre `/d/` e `/edit`.  
  Exemplo: `https://docs.google.com/spreadsheets/d/` **`1abc...xyz`** `/edit`  
  → Esse valor vai em **`SPREADSHEET_ID`** no `Code.gs` (linha com `var SPREADSHEET_ID = "..."`).

- **URL do Web App (`/exec`)** — aparece depois de **Implantar → App da Web**.  
  Termina com `/exec`.  
  → Esse endereço **não** entra no `Code.gs` do Google. Vai no **front** / **Vercel**: `VITE_SHEETS_API_URL` ou `APPS_SCRIPT_WEB_APP_URL` (veja `.env.example` na raiz do projeto).

## 2. Passo a passo no Google

1. Abra [script.google.com](https://script.google.com) e crie um projeto (ou use um vinculado à planilha: **Extensões → Apps Script**).
2. Cole o conteúdo de `Code.gs` no editor.
3. Ajuste **`SPREADSHEET_ID`** com o ID da **sua** planilha (copiado da URL do Sheets).
4. Na planilha, crie **uma aba por entidade** com nomes exatamente como em `TAB` no script (`GestorPerfil`, `Funcionario`, etc.).
5. Na **linha 1** de cada aba, use os cabeçalhos definidos em `SHEET_HEADERS` no `Code.gs` (mesma ordem).
6. **Implantar** → **Nova implantação** → tipo **App da Web**:
   - Executar como: você  
   - Quem tem acesso: **Qualquer pessoa** (para o app público enviar POST), a menos que use só o proxy na Vercel com outra estratégia de segurança.
7. Copie a URL que termina em **`/exec`** e configure o app (`.env` / Vercel).

## 3. Propriedades do script (opcional)

**Arquivo → Configurações do projeto → Propriedades do script**

- `OPENAI_API_KEY` — se preenchida, `InvokeLLM` no app usa a API OpenAI. Sem ela, o script devolve um texto/JSON de exemplo.

## 4. Front-end (Vercel)

- `APPS_SCRIPT_WEB_APP_URL` = URL `/exec` completa (variável de **servidor** na Vercel).
- `VITE_SHEETS_API_URL=/api/sheets` no build do Vite (usa o proxy `api/sheets.js`).

## 5. Primeira linha em `GestorPerfil`

Na coluna `funcoes`, use JSON de array, por exemplo:

`["Gerente Enfermagem"]`
