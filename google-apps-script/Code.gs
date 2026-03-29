/**
 * Google Apps Script — backend da planilha (banco de dados).
 *
 * COMO USAR (obrigatório no Google, não só no Cursor):
 * 1) Cole este arquivo inteiro em script.google.com (projeto ligado à planilha ou com acesso a ela).
 * 2) Confira SPREADSHEET_ID abaixo = ID da URL da planilha:
 *    https://docs.google.com/spreadsheets/d/ESTE_ID/edit
 *    NÃO use o trecho AKfyc... da URL do Web App (/exec) — esse vai no .env do front (APPS_SCRIPT_WEB_APP_URL).
 * 3) Na planilha: crie as abas com nomes em TAB e linha 1 = cabeçalhos de SHEET_HEADERS.
 *    SurveyResponse: uma coluna por campo (ver lista em SHEET_HEADERS e README); sem colunas vazias no fim.
 * 4) Salvar → Implantar → App da Web → nova versão → copie a URL /exec para .env e Vercel.
 *
 * Guia: google-apps-script/README.md
 */

var SPREADSHEET_ID = "1h3H6TK6wSGxlsPKUVnkbHpooRMxWWB5KVLEvu8uL3GE";

/** Nomes exatos das abas */
var TAB = {
  GestorPerfil: "GestorPerfil",
  Funcionario: "Funcionario",
  EventoAdverso: "EventoAdverso",
  A3Relatorio: "A3Relatorio",
  PDITecnicoEnfermagem: "PDITecnicoEnfermagem",
  PDIEnfermeiro: "PDIEnfermeiro",
  SurveyResponse: "SurveyResponse",
};

/**
 * Linha 1 de cada aba deve conter EXATAMENTE estes cabeçalhos (nessa ordem).
 */
var SHEET_HEADERS = {
  GestorPerfil: ["id", "login", "senha", "funcoes", "ativo"],
  Funcionario: ["id", "nome", "cargo", "dataAdmissao", "ativo"],
  EventoAdverso: [
    "id",
    "tipo",
    "gravidade",
    "descricao",
    "setor",
    "notificado_por",
    "data",
    "plano_acao_aberto",
    "created_at",
  ],
  A3Relatorio: [
    "id",
    "titulo",
    "dono",
    "tipo",
    "prioridade",
    "pop_referencia",
    "origem",
    "prazo_conclusao",
    "status_pdca",
    "deleted",
    "deleted_by",
    "deleted_at",
    "updated_by",
    "created_at",
    "updated_at",
    "plan_contexto",
    "plan_condicao_atual",
    "plan_meta",
    "plan_causa_raiz",
    "plan_ishikawa",
    "plan_5porques",
    "do_acoes_5w2h",
    "check_resultados",
    "check_indicadores",
    "check_eficaz",
    "check_evidencias_urls",
    "act_licoes_aprendidas",
    "act_padronizacao",
    "act_criar_novo_pop",
    "act_pop_vinculado",
  ],
  PDITecnicoEnfermagem: [
    "id",
    "colaborador_id",
    "data_avaliacao",
    "avaliador",
    "competencias",
    "pontos_fortes",
    "pontos_desenvolver",
    "plano_acao",
    "comentarios",
    "deleted",
    "created_at",
  ],
  PDIEnfermeiro: [
    "id",
    "colaborador_id",
    "data_avaliacao",
    "avaliador",
    "competencias",
    "pontos_fortes",
    "pontos_desenvolver",
    "plano_acao",
    "comentarios",
    "deleted",
    "created_at",
  ],
  SurveyResponse: [
    "id",
    "tipo_atendimento",
    "perfil_respondente",
    "nps_recomendacao",
    "comentarios_finais",
    "respondido_em",
    "agendamento_claro",
    "agendamento_informacoes",
    "agendamento_duvidas",
    "preparo_instrucoes",
    "preparo_orientacoes_risco",
    "preparo_acolhimento",
    "exame_tempo_espera",
    "exame_empatia_equipe",
    "exame_explicacoes",
    "exame_seguranca",
    "posexame_resultado",
    "posexame_cuidados",
    "posexame_fluxo_saida",
    "avaliacao_geral",
    "payload_json",
  ],
};

/** Campos armazenados como JSON string na célula */
var JSON_FIELDS_BY_ENTITY = {
  GestorPerfil: ["funcoes"],
  Funcionario: [],
  EventoAdverso: [],
  A3Relatorio: [
    "plan_ishikawa",
    "plan_5porques",
    "do_acoes_5w2h",
    "check_evidencias_urls",
  ],
  PDITecnicoEnfermagem: ["competencias", "plano_acao"],
  PDIEnfermeiro: ["competencias", "plano_acao"],
  SurveyResponse: ["payload_json"],
};

function doPost(e) {
  var out = { ok: true };
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;

    if (action === "entity") {
      out.result = handleEntity(body);
    } else if (action === "uploadFile") {
      out.result = handleUpload(body);
    } else if (action === "invokeLLM") {
      out.result = handleInvokeLLM(body);
    } else {
      throw new Error("Ação desconhecida: " + action);
    }
  } catch (err) {
    out.ok = false;
    out.error = err.message || String(err);
  }
  return jsonResponse(out);
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, message: "Sheets API ativa. Use POST JSON." })
  ).setMimeType(ContentService.MimeType.JSON);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function ss() {
  if (
    !SPREADSHEET_ID ||
    SPREADSHEET_ID.indexOf("COLE_AQUI") !== -1 ||
    SPREADSHEET_ID.indexOf("PLACEHOLDER") !== -1
  ) {
    throw new Error(
      "Defina SPREADSHEET_ID com o ID real da planilha em Code.gs, salve e implante uma NOVA versão do Web App."
    );
  }
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function handleEntity(body) {
  var entity = body.entity;
  var method = body.method;
  var tabName = TAB[entity];
  if (!tabName) throw new Error("Entidade inválida: " + entity);

  var headers = SHEET_HEADERS[entity];
  if (!headers) throw new Error("Sem cabeçalhos para " + entity);

  if (method === "list") return listRows(entity, tabName, headers);
  if (method === "filter") {
    return filterRows(
      entity,
      tabName,
      headers,
      body.filter || {},
      body.sort,
      body.limit
    );
  }
  if (method === "create") return createRow(entity, tabName, headers, body.data || {});
  if (method === "update") return updateRow(entity, tabName, headers, body.id, body.data || {});
  if (method === "delete") return deleteRow(entity, tabName, headers, body.id);
  throw new Error("Método inválido: " + method);
}

function getSheet(tabName) {
  var sh = ss().getSheetByName(tabName);
  if (!sh) throw new Error('Aba não encontrada: "' + tabName + '"');
  return sh;
}

function listRows(entity, tabName, headers) {
  var sh = getSheet(tabName);
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  var rows = [];
  for (var r = 1; r < values.length; r++) {
    var obj = rowToObject(entity, headers, values[r]);
    if (obj && obj.id) rows.push(obj);
  }
  return rows;
}

function filterRows(entity, tabName, headers, filterObj, sortField, limit) {
  var all = listRows(entity, tabName, headers);
  var filtered = all.filter(function (row) {
    for (var k in filterObj) {
      if (filterObj[k] === undefined || filterObj[k] === "") continue;
      if (row[k] !== filterObj[k]) return false;
    }
    return true;
  });

  if (sortField) {
    var desc = sortField.indexOf("-") === 0;
    var field = desc ? sortField.substring(1) : sortField;
    if (field === "created_date") field = "created_at";
    filtered.sort(function (a, b) {
      var va = a[field];
      var vb = b[field];
      if (va === undefined) return 1;
      if (vb === undefined) return -1;
      if (va < vb) return desc ? 1 : -1;
      if (va > vb) return desc ? -1 : 1;
      return 0;
    });
  }

  if (limit && limit > 0) filtered = filtered.slice(0, limit);
  return filtered;
}

function createRow(entity, tabName, headers, data) {
  var sh = getSheet(tabName);
  var id = data.id || Utilities.getUuid();
  var now = new Date().toISOString();
  var rowObj = {};
  for (var i = 0; i < headers.length; i++) {
    var h = headers[i];
    rowObj[h] = data[h];
  }
  rowObj.id = id;
  if (headers.indexOf("created_at") >= 0 && !rowObj.created_at) rowObj.created_at = now;
  if (headers.indexOf("updated_at") >= 0 && !rowObj.updated_at) rowObj.updated_at = now;
  if (headers.indexOf("deleted") >= 0 && rowObj.deleted === undefined) rowObj.deleted = false;
  if (entity === "SurveyResponse") {
    rowObj.respondido_em = rowObj.respondido_em || now;
    if (!rowObj.payload_json && data) {
      var copy = {};
      for (var k in data) {
        if (k !== "id" && k !== "respondido_em" && k !== "payload_json") copy[k] = data[k];
      }
      rowObj.payload_json = JSON.stringify(copy);
    }
  } else if (headers.indexOf("respondido_em") >= 0 && !rowObj.respondido_em) {
    rowObj.respondido_em = now;
  }

  var row = objectToRow(entity, headers, rowObj);
  sh.appendRow(row);
  return rowToObject(entity, headers, row);
}

function updateRow(entity, tabName, headers, id, data) {
  var sh = getSheet(tabName);
  var values = sh.getDataRange().getValues();
  if (values.length < 2) throw new Error("Sem dados");
  var idCol = headers.indexOf("id");
  var rowIndex = -1;
  for (var r = 1; r < values.length; r++) {
    if (String(values[r][idCol]) === String(id)) {
      rowIndex = r + 1;
      break;
    }
  }
  if (rowIndex < 0) throw new Error("Registro não encontrado: " + id);

  var existing = rowToObject(entity, headers, values[rowIndex - 1]);
  var merged = {};
  for (var k in existing) merged[k] = existing[k];
  for (var k2 in data) merged[k2] = data[k2];
  if (headers.indexOf("updated_at") >= 0) merged.updated_at = new Date().toISOString();

  var newRow = objectToRow(entity, headers, merged);
  // Sheet.getRange(row, col, numRows, numColumns) — o 3.º argumento é Nº de linhas, não a última linha.
  sh.getRange(rowIndex, 1, 1, headers.length).setValues([newRow]);
  return rowToObject(entity, headers, newRow);
}

function deleteRow(entity, tabName, headers, id) {
  var sh = getSheet(tabName);
  var values = sh.getDataRange().getValues();
  if (values.length < 2) throw new Error("Sem dados");
  var idCol = headers.indexOf("id");
  for (var r = 1; r < values.length; r++) {
    if (String(values[r][idCol]) === String(id)) {
      sh.deleteRow(r + 1);
      return { id: id, deleted: true };
    }
  }
  throw new Error("Registro não encontrado: " + id);
}

function rowToObject(entity, headers, row) {
  var jsonFields = JSON_FIELDS_BY_ENTITY[entity] || [];
  var obj = {};
  for (var i = 0; i < headers.length; i++) {
    var h = headers[i];
    var v = row[i];
    if (jsonFields.indexOf(h) >= 0 && v && typeof v === "string") {
      try {
        obj[h] = JSON.parse(v);
      } catch (e) {
        obj[h] = v;
      }
    } else if (h === "ativo" || h === "deleted" || h === "plano_acao_aberto" || h === "check_eficaz" || h === "act_criar_novo_pop") {
      if (v === "" || v === undefined) {
        if (h === "deleted") obj[h] = false;
        else obj[h] = v;
      } else if (v === true || v === false) obj[h] = v;
      else if (v === "TRUE" || v === "true") obj[h] = true;
      else if (v === "FALSE" || v === "false") obj[h] = false;
      else obj[h] = v;
    } else {
      obj[h] = v;
    }
  }
  if (obj.created_at && obj.created_date === undefined) obj.created_date = obj.created_at;

  if (entity === "SurveyResponse" && obj.payload_json && typeof obj.payload_json === "object") {
    var pj = obj.payload_json;
    for (var pk in pj) {
      if (Object.prototype.hasOwnProperty.call(pj, pk)) {
        if (obj[pk] === undefined || obj[pk] === null || obj[pk] === "") {
          obj[pk] = pj[pk];
        }
      }
    }
  }

  return obj;
}

function objectToRow(entity, headers, obj) {
  var jsonFields = JSON_FIELDS_BY_ENTITY[entity] || [];
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var h = headers[i];
    var v = obj[h];
    if (jsonFields.indexOf(h) >= 0 && v !== undefined && v !== null && typeof v !== "string") {
      v = JSON.stringify(v);
    }
    if (v === undefined || v === null) v = "";
    row.push(v);
  }
  return row;
}

function handleUpload(body) {
  var name = body.fileName || "upload";
  var mime = body.mimeType || "application/octet-stream";
  var base64 = body.base64;
  if (!base64) throw new Error("base64 ausente");

  var bytes = Utilities.base64Decode(base64);
  var blob = Utilities.newBlob(bytes, mime, name);
  var file = DriveApp.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  var url = file.getDownloadUrl().replace("&export=download", "");
  return { file_url: url };
}

function handleInvokeLLM(body) {
  var key = PropertiesService.getScriptProperties().getProperty("OPENAI_API_KEY");
  var payload = body.payload || {};
  var prompt = payload.prompt || "";
  if (!key) {
    return {
      response: JSON.stringify({
        titulo: "Relatório (modo offline)",
        data: new Date().toLocaleDateString("pt-BR"),
        resumo_executivo:
          "Configure OPENAI_API_KEY nas propriedades do script para gerar texto com IA.",
        situacao_atual: prompt.substring(0, 400),
        causa_raiz: "—",
        acoes: [],
      }),
    };
  }
  var schema = payload.response_json_schema;
  var url = "https://api.openai.com/v1/chat/completions";
  var req = {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt + (schema ? "\nResponda apenas JSON válido." : "") }],
    temperature: 0.3,
  };
  var res = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + key },
    payload: JSON.stringify(req),
    muteHttpExceptions: true,
  });
  var code = res.getResponseCode();
  var txt = res.getContentText();
  if (code !== 200) throw new Error("OpenAI: " + txt);
  var j = JSON.parse(txt);
  var content = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
  return { response: content || "{}" };
}
