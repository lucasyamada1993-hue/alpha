// ── HTML do Totem de Pesquisa (Index.html) ─────────────────────────────────
export const HTML_CODE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Alphasonic — Pesquisa de Satisfação</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
  <style>
    .radio-option input[type="radio"] { display: none; }
    .radio-btn { cursor: pointer; transition: all .2s; }
    .radio-option input[type="radio"]:checked + .radio-btn {
      background: white; border: 2px solid #1d4ed8;
      box-shadow: 0 4px 12px rgba(29,78,216,.18); color: #1d4ed8;
    }
    .nps-btn { transition: all .15s; }
    .nps-btn.selected { background: #1d4ed8; color: white; transform: scale(1.12); box-shadow: 0 4px 12px rgba(29,78,216,.3); }
    .perfil-option input[type="radio"], .exame-option input[type="radio"] { display: none; }
    .perfil-option input[type="radio"]:checked + .perfil-btn,
    .exame-option input[type="radio"]:checked + .exame-btn {
      background: #eff6ff; border-color: #1d4ed8; color: #1d4ed8; font-weight: 600;
    }
    .perfil-btn, .exame-btn { cursor: pointer; transition: all .2s; }
  </style>
</head>
<body class="font-sans antialiased">

<!-- TELA 1: INÍCIO -->
<div id="tela-inicio" class="h-screen w-full grid grid-cols-2">
  <div class="relative flex flex-col justify-between p-10 overflow-hidden"
       style="background: linear-gradient(rgba(15,40,100,0.72),rgba(15,40,100,0.72)), url('https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=900&q=80') center/cover no-repeat">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
        <i class="fa-solid fa-heart-pulse text-white text-lg"></i>
      </div>
      <span class="text-white font-bold text-xl tracking-wide">Alphasonic SADT</span>
    </div>
    <div>
      <p class="text-white/70 text-sm mb-3 uppercase tracking-widest font-medium">Pesquisa de Satisfação</p>
      <h2 class="text-white font-extrabold text-4xl leading-snug">Sua opinião nos ajuda a cuidar melhor de você!</h2>
    </div>
  </div>
  <div class="bg-white flex flex-col items-center justify-center p-16 relative">
    <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
      <i class="fa-solid fa-clipboard-list text-blue-700 text-2xl"></i>
    </div>
    <h1 class="text-4xl font-bold text-gray-800 text-center mb-4">Bem-vindo(a) à<br/>Alphasonic</h1>
    <p class="text-gray-500 text-center mb-10 text-lg leading-relaxed max-w-xs">
      Toque no botão abaixo para iniciar sua avaliação. Leva menos de 1 minuto.
    </p>
    <button onclick="iniciarPesquisa()"
      class="flex items-center gap-3 bg-blue-700 hover:bg-blue-800 text-white text-xl font-semibold px-10 py-5 rounded-full shadow-lg shadow-blue-200 transition-all">
      Iniciar Pesquisa
      <i class="fa-solid fa-circle-play text-2xl"></i>
    </button>
    <div class="flex gap-3 mt-6">
      <span class="bg-gray-100 text-gray-500 text-xs px-4 py-2 rounded-full">⏱️ Rápido</span>
      <span class="bg-gray-100 text-gray-500 text-xs px-4 py-2 rounded-full">🔒 Anônimo</span>
    </div>
    <p class="absolute bottom-5 text-[10px] text-gray-400 tracking-wide">🔒 SEUS DADOS ESTÃO SEGUROS E PROTEGIDOS PELA LGPD</p>
  </div>
</div>

<!-- TELA 2: FORMULÁRIO -->
<div id="tela-pesquisa" class="hidden h-screen bg-gray-50 overflow-y-auto">
  <main class="max-w-3xl mx-auto p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-blue-900 mb-1">Satisfação do Paciente</h1>
      <p class="text-gray-500">Sua opinião é fundamental para aprimorarmos nosso atendimento clínico.</p>
    </div>
    <form id="formPesquisa" onsubmit="enviarFormulario(event)">

      <!-- Identificação -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div class="flex items-center gap-2 mb-6">
          <div class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
            <i class="fa-solid fa-user text-blue-700"></i>
          </div>
          <h2 class="font-semibold text-gray-700 text-lg">Sobre o seu atendimento de hoje</h2>
        </div>
        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quem está respondendo?</p>
        <div class="flex gap-4 mb-6">
          <label class="perfil-option flex-1"><input type="radio" name="perfil_respondente" value="Paciente" required/>
            <div class="perfil-btn border-2 border-gray-200 rounded-xl p-4 text-center text-gray-600 text-sm">👤 Paciente</div></label>
          <label class="perfil-option flex-1"><input type="radio" name="perfil_respondente" value="Acompanhante"/>
            <div class="perfil-btn border-2 border-gray-200 rounded-xl p-4 text-center text-gray-600 text-sm">👥 Acompanhante / Familiar</div></label>
        </div>
        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Qual exame você realizou?</p>
        <div class="grid grid-cols-4 gap-3" id="exames-container"></div>
      </div>

      <!-- Avaliações -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div class="flex items-center gap-2 mb-6">
          <div class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
            <i class="fa-solid fa-star text-blue-700"></i>
          </div>
          <h2 class="font-semibold text-gray-700 text-lg">Avalie seu Atendimento</h2>
        </div>
        <div id="ratings-container"></div>

        <!-- NPS -->
        <div class="mt-6">
          <p class="font-medium text-gray-700 mb-4">Em uma escala de 0 a 10, o quanto você recomendaria este serviço?</p>
          <div class="flex gap-2 flex-wrap" id="nps-container"></div>
          <input type="hidden" id="nps_recomendacao" name="nps_recomendacao" required/>
        </div>

        <!-- Comentários -->
        <div class="mt-6">
          <p class="font-medium text-gray-700 mb-2">Comentários ou sugestões <span class="text-gray-400 text-sm font-normal">(opcional)</span></p>
          <textarea name="comentarios_finais" rows="4" placeholder="Escreva aqui..."
            class="w-full border border-gray-200 rounded-xl p-4 text-gray-700 text-sm resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"></textarea>
        </div>
      </div>

      <div class="text-center pb-8">
        <button type="submit"
          class="bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold px-14 py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all inline-flex items-center gap-3">
          <i class="fa-solid fa-paper-plane"></i> Enviar Avaliação
        </button>
      </div>
    </form>
  </main>
</div>

<!-- Modal de Envio -->
<div id="modal-enviando" class="hidden fixed inset-0 bg-black/40 items-center justify-center z-50">
  <div class="bg-white rounded-2xl p-10 text-center shadow-2xl max-w-sm mx-4">
    <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
      <i class="fa-solid fa-paper-plane text-blue-700 text-2xl"></i>
    </div>
    <h3 class="text-xl font-bold text-gray-800 mb-2">Enviando avaliação...</h3>
    <p class="text-gray-500 text-sm">Aguarde enquanto registramos sua resposta.</p>
    <div class="mt-5 flex justify-center">
      <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin"></div>
    </div>
  </div>
</div>

<script>
  var npsSelecionado = null;

  var PERGUNTAS = [
    ["agendamento_claro","O processo de agendamento foi claro e acessível?"],
    ["agendamento_informacoes","As informações sobre data, horário e local foram comunicadas adequadamente?"],
    ["agendamento_duvidas","Houve facilidade em esclarecer dúvidas sobre o preparo?"],
    ["preparo_acolhimento","Você se sentiu acolhido(a) pela equipe na recepção?"],
    ["preparo_instrucoes","As instruções de preparo foram compreensíveis?"],
    ["preparo_orientacoes_risco","A equipe orientou sobre desconfortos e cuidados pós-exame?"],
    ["exame_tempo_espera","O tempo de espera foi adequado?"],
    ["exame_empatia_equipe","A equipe técnica demonstrou empatia e profissionalismo?"],
    ["exame_explicacoes","Você recebeu explicações claras sobre o exame?"],
    ["exame_seguranca","Você se sentiu seguro(a) e confortável durante o exame?"],
    ["posexame_resultado","Você foi orientado(a) sobre como obter o resultado?"],
    ["posexame_cuidados","A equipe esclareceu cuidados específicos pós-exame?"],
    ["posexame_fluxo_saida","O fluxo de saída foi rápido e organizado?"],
    ["avaliacao_geral","De modo geral, como avalia a qualidade do atendimento?"]
  ];

  var EXAMES = ["Raio-X","Ultrassom","Tomografia","Ressonância","Endoscopia","Laboratório","Hemodinâmica"];
  var OPTS = [{val:'Ótimo',emoji:'🤩',label:'ÓTIMO'},{val:'Bom',emoji:'🙂',label:'BOM'},{val:'Regular',emoji:'😐',label:'REGULAR'},{val:'Ruim',emoji:'😞',label:'RUIM'}];

  // Renderiza exames
  var ec = document.getElementById('exames-container');
  EXAMES.forEach(function(e) {
    ec.innerHTML += '<label class="exame-option"><input type="radio" name="tipo_atendimento" value="'+e+'" required/><div class="exame-btn border-2 border-gray-200 rounded-xl p-3 text-center text-gray-600 text-sm">'+e+'</div></label>';
  });

  // Renderiza ratings
  var rc = document.getElementById('ratings-container');
  PERGUNTAS.forEach(function(p) {
    var btns = OPTS.map(function(o) {
      return '<label class="radio-option flex-1"><input type="radio" name="'+p[0]+'" value="'+o.val+'" required/><div class="radio-btn bg-gray-100 rounded-lg py-3 px-2 text-center border-2 border-transparent text-sm font-medium text-gray-600 cursor-pointer"><div class="text-2xl mb-1">'+o.emoji+'</div><div class="text-xs font-bold">'+o.label+'</div></div></label>';
    }).join('');
    rc.innerHTML += '<div class="mb-5"><p class="text-sm font-medium text-gray-700 mb-2">'+p[1]+'</p><div class="bg-gray-100 p-2 rounded-xl flex gap-2">'+btns+'</div></div>';
  });

  // Renderiza NPS
  var nc = document.getElementById('nps-container');
  for (var i = 0; i <= 10; i++) {
    nc.innerHTML += '<button type="button" onclick="selecionarNPS('+i+')" id="nps-'+i+'" class="nps-btn w-11 h-11 rounded-lg border-2 border-gray-200 font-bold text-gray-600 hover:border-blue-400 transition-all">'+i+'</button>';
  }

  function iniciarPesquisa() {
    document.getElementById('tela-inicio').classList.add('hidden');
    document.getElementById('tela-pesquisa').classList.remove('hidden');
  }

  function selecionarNPS(n) {
    npsSelecionado = n;
    document.getElementById('nps_recomendacao').value = n;
    for (var i = 0; i <= 10; i++) document.getElementById('nps-'+i).classList.remove('selected');
    document.getElementById('nps-'+n).classList.add('selected');
  }

  function enviarFormulario(e) {
    e.preventDefault();
    if (!document.getElementById('formPesquisa').checkValidity()) { document.getElementById('formPesquisa').reportValidity(); return; }
    if (npsSelecionado === null) { alert('Selecione uma nota NPS antes de continuar.'); return; }
    var modal = document.getElementById('modal-enviando');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    var data = Object.fromEntries(new FormData(document.getElementById('formPesquisa')).entries());
    data.nps_recomendacao = npsSelecionado;
    // google.script.run.withSuccessHandler(onSuccess).withFailureHandler(onError).receberResposta(data);
    setTimeout(function() {
      modal.innerHTML = '<div class="bg-white rounded-2xl p-10 text-center shadow-2xl max-w-sm mx-4"><div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fa-solid fa-circle-check text-green-600 text-2xl"></i></div><h3 class="text-xl font-bold text-gray-800 mb-2">Obrigado!</h3><p class="text-gray-500 text-sm">Sua avaliação foi registrada.</p><button onclick="location.reload()" class="mt-6 bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-all">Nova Pesquisa</button></div>';
    }, 2000);
  }
</script>
</body>
</html>`;

// ── Código GAS (Codigo.gs) ──────────────────────────────────────────────────
export const GAS_CODE = `// ========================================
// Codigo.gs — Totem de Pesquisa SADT
// ========================================

function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Respostas_SADT');
  if (!sheet) sheet = ss.insertSheet('Respostas_SADT');
  var headers = [
    'Data_Hora','Tipo_Atendimento','Perfil_Respondente',
    'Agendamento_Claro','Agendamento_Informacoes','Agendamento_Duvidas','Preparo_Acolhimento',
    'Preparo_Instrucoes','Preparo_Orientacoes_Risco',
    'Exame_Tempo_Espera','Exame_Empatia_Equipe','Exame_Explicacoes','Exame_Seguranca',
    'PosExame_Resultado','PosExame_Cuidados','PosExame_Fluxo_Saida','Avaliacao_Geral',
    'NPS_Recomendacao','Comentarios_Finais'
  ];
  sheet.getRange(1,1,1,headers.length).setValues([headers])
    .setFontWeight('bold').setBackground('#0284c7').setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  Logger.log('Aba configurada com sucesso!');
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var obrigatorios = [
      'tipo_atendimento','perfil_respondente',
      'agendamento_claro','agendamento_informacoes','agendamento_duvidas','preparo_acolhimento',
      'preparo_instrucoes','preparo_orientacoes_risco',
      'exame_tempo_espera','exame_empatia_equipe','exame_explicacoes','exame_seguranca',
      'posexame_resultado','posexame_cuidados','posexame_fluxo_saida','avaliacao_geral','nps_recomendacao'
    ];
    for (var i = 0; i < obrigatorios.length; i++) {
      var v = payload[obrigatorios[i]];
      if (v === undefined || v === null || v === '') return resp('error','Campo obrigatório ausente: ' + obrigatorios[i]);
    }
    var nps = Number(payload.nps_recomendacao);
    if (isNaN(nps) || nps < 0 || nps > 10) return resp('error','NPS inválido');
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Respostas_SADT');
    if (!sheet) return resp('error','Aba não encontrada. Execute setupSheet() primeiro.');
    sheet.appendRow([
      new Date(), payload.tipo_atendimento, payload.perfil_respondente,
      payload.agendamento_claro, payload.agendamento_informacoes, payload.agendamento_duvidas, payload.preparo_acolhimento,
      payload.preparo_instrucoes, payload.preparo_orientacoes_risco,
      payload.exame_tempo_espera, payload.exame_empatia_equipe, payload.exame_explicacoes, payload.exame_seguranca,
      payload.posexame_resultado, payload.posexame_cuidados, payload.posexame_fluxo_saida, payload.avaliacao_geral,
      nps, payload.comentarios_finais || ''
    ]);
    return resp('success','Pesquisa registrada com sucesso');
  } catch(err) {
    return resp('error','Erro: ' + err.message);
  }
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function resp(status, message) {
  return ContentService.createTextOutput(JSON.stringify({status:status,message:message}))
    .setMimeType(ContentService.MimeType.JSON);
}`;

// ── HTML do Painel de Jornada do Paciente (Jornada.html) ───────────────────
export const JORNADA_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Alphasonic SADT — Painel do Gestor</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
  <style>
    * { font-family:'Inter',sans-serif; box-sizing:border-box; }
    ::-webkit-scrollbar { width:5px; height:5px; }
    ::-webkit-scrollbar-track { background:#f1f5f9; }
    ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:10px; }
    .pill { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:6px; font-size:11px; font-weight:600; white-space:nowrap; }
    .pill-green  { background:#f0fdf4; color:#16a34a; }
    .pill-gray   { background:#f8fafc; color:#94a3b8; border:1px solid #e2e8f0; }
    .pill-yellow { background:#fefce8; color:#a16207; border:1px solid #fde047; }
    .pill-red    { background:#fef2f2; color:#dc2626; border:1px solid #fecaca; }
    .btn-validate { display:inline-flex; align-items:center; gap:5px; padding:5px 12px; border-radius:7px; font-size:11px; font-weight:700; background:#fef9c3; color:#92400e; border:1.5px solid #fcd34d; cursor:pointer; transition:all .2s; }
    .btn-validate:hover { background:#fef08a; transform:translateY(-1px); box-shadow:0 3px 10px rgba(251,191,36,.3); }
    .sidebar-link { display:flex; align-items:center; gap:10px; padding:9px 14px; border-radius:8px; font-size:13px; font-weight:500; color:#64748b; transition:all .15s; cursor:pointer; }
    .sidebar-link:hover { background:#eff6ff; color:#1d4ed8; }
    .sidebar-link.active { background:#1d4ed8; color:#fff; }
    .live-ring { width:8px; height:8px; border-radius:50%; background:#22c55e; animation:liveRing 2s ease infinite; }
    @keyframes liveRing { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.5)} 60%{box-shadow:0 0 0 6px rgba(34,197,94,0)} }
    .sparkline { display:flex; align-items:flex-end; gap:2px; height:28px; }
    .sparkline span { width:4px; border-radius:2px; background:#3b82f6; opacity:.7; }
    .row-critical { background:#fff8f8; border-left:3px solid #ef4444; }
    .kpi-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  </style>
</head>
<body class="bg-gray-50 h-screen flex flex-col overflow-hidden">

<!-- TOPBAR -->
<header class="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3 flex-shrink-0 z-10">
  <div class="flex items-center gap-3">
    <div class="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
    </div>
    <span class="font-bold text-gray-800 text-sm tracking-tight">ALPHASONIC SADT — <span class="text-blue-700">Painel do Gestor</span></span>
  </div>
  <div class="flex items-center gap-4">
    <div class="flex items-center gap-1.5">
      <div class="live-ring"></div>
      <span class="text-xs text-gray-400 font-medium" id="relogio"></span>
    </div>
    <button class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      <span class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
    </button>
    <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
    </button>
    <div class="flex items-center gap-2 pl-3 border-l border-gray-200">
      <div class="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">AD</div>
      <span class="text-xs font-semibold text-gray-700">Admin</span>
    </div>
  </div>
</header>

<!-- CORPO -->
<div class="flex flex-1 overflow-hidden">

  <!-- SIDEBAR -->
  <aside class="w-52 bg-white border-r border-gray-100 flex flex-col flex-shrink-0 py-4 px-3">
    <div class="space-y-0.5 flex-1">
      <div class="sidebar-link active">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        Dashboard
      </div>
      <div class="sidebar-link">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        Pacientes
      </div>
      <div class="sidebar-link">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        Histórico
      </div>
      <div class="sidebar-link">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
        Segurança
      </div>
      <div class="sidebar-link">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
        Configurações
      </div>
      <div class="sidebar-link">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        Alarmes
        <span class="ml-auto bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">6</span>
      </div>
    </div>
    <div class="pt-3 border-t border-gray-100">
      <div class="sidebar-link text-red-400 hover:bg-red-50 hover:text-red-600">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Logout
      </div>
    </div>
  </aside>

  <!-- MAIN -->
  <main class="flex-1 overflow-y-auto p-5 space-y-5">

    <!-- KPIs -->
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
        <div class="kpi-icon bg-blue-50">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div>
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Pacientes Hoje</p>
          <p class="text-2xl font-extrabold text-gray-800 mt-0.5">148</p>
          <p class="text-[10px] text-gray-400 mt-0.5">↑ 8% vs. ontem</p>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
        <div class="kpi-icon bg-emerald-50">
          <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div>
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">TAT Médio</p>
          <p class="text-2xl font-extrabold text-gray-800 mt-0.5">1h 22m</p>
          <span class="pill pill-green text-[10px]">🟢 8 min abaixo da meta</span>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
        <div class="kpi-icon bg-blue-50">
          <svg class="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
        </div>
        <div>
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Adesão Time-Out</p>
          <p class="text-2xl font-extrabold text-gray-800 mt-0.5">99,1%</p>
          <span class="pill pill-green text-[10px]">🟢 Conformidade</span>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-red-50 shadow-sm p-4 flex items-center gap-4">
        <div class="kpi-icon bg-red-50">
          <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div>
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Alertas (&gt;2h)</p>
          <p class="text-2xl font-extrabold text-red-600 mt-0.5">6</p>
          <span class="pill pill-red text-[10px]">🔴 Ação Necessária</span>
        </div>
      </div>
    </div>

    <!-- TABELA DE JORNADA -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 class="font-bold text-gray-800 text-sm">Rastreabilidade da Jornada em Tempo Real</h2>
          <p class="text-xs text-gray-400 mt-0.5">Recepção → Preparo → Sala → Laudo</p>
        </div>
        <div class="flex items-center gap-3 flex-shrink-0">
          <div class="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2 border border-gray-100">
            <div>
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">NPS</p>
              <p class="text-xl font-extrabold text-blue-700">76</p>
            </div>
            <div class="sparkline">
              <span style="height:40%"></span><span style="height:55%"></span><span style="height:45%"></span>
              <span style="height:65%"></span><span style="height:70%"></span><span style="height:80%"></span>
              <span style="height:75%"></span><span style="height:90%;opacity:1;background:#1d4ed8"></span>
            </div>
          </div>
          <select class="text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-600 bg-white outline-none focus:border-blue-400">
            <option>Modalidade</option><option>Tomografia</option><option>Ressonância</option><option>Raio-X</option>
          </select>
          <select class="text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-600 bg-white outline-none focus:border-blue-400">
            <option>Status</option><option>Em andamento</option><option>Concluído</option><option>Atrasado</option>
          </select>
        </div>
      </div>

      <div class="px-5 py-3 border-b border-gray-100 bg-gray-50">
        <div class="relative max-w-sm">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Buscar paciente ou ID..." oninput="filtrar(this.value)"
            class="pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 w-full transition-all"/>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-xs">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="text-left px-5 py-3 font-semibold text-gray-400 uppercase tracking-wider text-[10px] w-44">Paciente & ID</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Modalidade</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Recepção (ID OK)</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Preparo (Enferm.)</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Sala / Time-Out</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Laudo</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Status / TAT</th>
            </tr>
          </thead>
          <tbody>
            <!-- L1: Maria Luiza -->
            <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors patient-row" data-name="maria luiza">
              <td class="px-5 py-3.5"><p class="font-semibold text-gray-800">Maria Luiza</p><span class="pill pill-gray mt-1">TC-0041</span></td>
              <td class="px-4 py-3.5 text-gray-500">Tomografia</td>
              <td class="px-4 py-3.5"><span class="pill pill-green">✓ Confirmado</span><p class="text-[10px] text-gray-400 mt-0.5">08:14</p></td>
              <td class="px-4 py-3.5"><span class="pill pill-green">✓ Preparo OK</span><p class="text-[10px] text-gray-400 mt-0.5">08:28</p></td>
              <td class="px-4 py-3.5"><span class="pill pill-green">✓ Time-Out OK</span><p class="text-[10px] text-gray-400 mt-0.5">08:35</p></td>
              <td class="px-4 py-3.5"><span class="pill pill-green">✓ Assinado</span><p class="text-[10px] text-gray-400 mt-0.5">09:04</p></td>
              <td class="px-4 py-3.5"><span class="pill pill-green">🟢 Concluído</span><p class="text-[10px] text-gray-400 mt-0.5">50 min</p></td>
            </tr>
            <!-- L2: Roberto Ferreira -->
            <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors patient-row" data-name="roberto ferreira">
              <td class="px-5 py-3.5"><p class="font-semibold text-gray-800">Roberto Ferreira</p><span class="pill pill-gray mt-1">RM-0078</span></td>
              <td class="px-4 py-3.5 text-gray-500">Ressonância</td>
              <td class="px-4 py-3.5"><span class="pill pill-green">✓ Confirmado</span><p class="text-[10px] text-gray-400 mt-0.5">09:50</p></td>
              <td class="px-4 py-3.5"><span class="pill pill-green">✓ Acesso OK</span><p class="text-[10px] text-gray-400 mt-0.5">10:05</p></td>
              <td class="px-4 py-3.5"><span class="pill pill-yellow">⏳ Em Exame</span><p class="text-[10px] text-gray-400 mt-0.5">10:20</p></td>
              <td class="px-4 py-3.5"><span class="pill pill-gray">Aguardando</span></td>
              <td class="px-4 py-3.5"><span class="pill pill-yellow">🟡 Andamento</span><p class="text-[10px] text-gray-400 mt-0.5">45 min</p></td>
            </tr>
            <!-- L3: João Pedro — CRÍTICO -->
            <tr class="row-critical border-b border-red-100 hover:bg-red-50 transition-colors patient-row" data-name="joão pedro souza joao pedro" id="linha-joao">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-1.5">
                  <p class="font-semibold text-gray-800">João Pedro Souza</p>
                  <span class="pill pill-red" style="font-size:9px;" id="badge-critico">Crítico</span>
                </div>
                <span class="pill pill-gray mt-1">TC-0092</span>
              </td>
              <td class="px-4 py-3.5 text-gray-500">Tomografia</td>
              <td class="px-4 py-3.5"><span class="pill pill-green">✓ Confirmado</span><p class="text-[10px] text-gray-400 mt-0.5">10:30</p></td>
              <td class="px-4 py-3.5"><span class="pill pill-green">✓ Preparo OK</span><p class="text-[10px] text-gray-400 mt-0.5">10:45</p></td>
              <td class="px-4 py-3.5">
                <span class="pill pill-red" id="pill-sala-joao">🔴 Atrasado</span>
                <br class="mb-1"/>
                <button id="btn-timeout-joao" onclick="validarTimeout()" class="btn-validate mt-1">⚠️ Validar Time-Out</button>
              </td>
              <td class="px-4 py-3.5"><span class="pill pill-gray">Bloqueado</span></td>
              <td class="px-4 py-3.5" id="status-joao">
                <span class="pill pill-red">🔴 Alerta</span>
                <p class="text-[10px] text-red-400 font-semibold mt-0.5">1h 10min</p>
              </td>
            </tr>
            <!-- L4: Ana Clara -->
            <tr class="hover:bg-gray-50 transition-colors patient-row" data-name="ana clara">
              <td class="px-5 py-3.5"><p class="font-semibold text-gray-800">Ana Clara</p><span class="pill pill-gray mt-1">RX-0112</span></td>
              <td class="px-4 py-3.5 text-gray-500">Raio-X</td>
              <td class="px-4 py-3.5"><span class="pill pill-green">✓ Confirmado</span><p class="text-[10px] text-gray-400 mt-0.5">11:00</p></td>
              <td class="px-4 py-3.5"><span class="pill pill-gray">— N/A</span></td>
              <td class="px-4 py-3.5"><span class="pill pill-green">✓ Time-Out OK</span><p class="text-[10px] text-gray-400 mt-0.5">11:08</p></td>
              <td class="px-4 py-3.5"><span class="pill pill-green">✓ Assinado</span><p class="text-[10px] text-gray-400 mt-0.5">11:30</p></td>
              <td class="px-4 py-3.5"><span class="pill pill-green">🟢 Concluído</span><p class="text-[10px] text-gray-400 mt-0.5">30 min</p></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span class="text-[11px] text-gray-400">4 de 148 atendimentos · <span class="text-red-500 font-semibold">6 alertas ativos</span></span>
        <button class="text-[11px] text-blue-600 font-semibold hover:text-blue-800 transition-colors">Ver todos →</button>
      </div>
    </div>

  </main>
</div>

<script>
  (function tick() {
    document.getElementById('relogio').textContent = new Date().toLocaleTimeString('pt-BR');
    setTimeout(tick, 1000);
  })();

  function validarTimeout() {
    var btn   = document.getElementById('btn-timeout-joao');
    var linha = document.getElementById('linha-joao');
    var stat  = document.getElementById('status-joao');
    var sala  = document.getElementById('pill-sala-joao');
    var badge = document.getElementById('badge-critico');

    btn.className = 'pill pill-green mt-1';
    btn.textContent = '✓ Validado';
    btn.onclick = null;

    if (sala) { sala.className = 'pill pill-yellow'; sala.textContent = '⏳ Em Exame'; }
    if (badge) badge.remove();

    linha.classList.remove('row-critical');
    stat.innerHTML = '<span class="pill pill-green">🟢 Regularizado</span><p class="text-[10px] text-gray-400 mt-0.5">Time-Out OK</p>';

    linha.style.transition = 'background .5s';
    linha.style.background = '#f0fdf4';
    setTimeout(function(){ linha.style.background = ''; }, 1800);
    // google.script.run.registrarTimeout('TC-0092');
  }

  function filtrar(v) {
    var t = v.toLowerCase().trim();
    document.querySelectorAll('.patient-row').forEach(function(r) {
      r.style.display = (!t || (r.dataset.name||'').includes(t)) ? '' : 'none';
    });
  }
</script>
</body>
</html>`;