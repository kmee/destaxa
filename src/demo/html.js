var client = new VSPagueClient();

function Limpar() {
  document.getElementById("output").innerHTML = "";
}

function Conectar() {
  client.connect({
    onOpen: () => {
      Trace("Conexao realizada com sucesso");
    },
    onMessage: (message) => {
      Trace(message.body);
    },
    onSequencial: (value) => {
      document.getElementById("io_txt_sequencial").value = value;
    },
    onError: (error) => {
      Trace(`Erro ao conectar ao servidor: ${error}`);
    },
    onClose: () => {
      Trace("Desconectado");
    },
  });
}

function Sequencial() {
  const value = client.next();
  document.getElementById("io_txt_sequencial").value = value;
  return value;
}

// Função para visualização dos pacotes trocados.
function Trace(message) {
  var obj = document.getElementById("output");
  obj.innerHTML =
    "<br> <<< RECEIVE: <br>" + message + "<br><br>" + obj.innerHTML;
}

function Send(message) {
  client.send(message);
  var obj = document.getElementById("output");
  obj.innerHTML = "<br> >>> SEND: <br>" + message + "<br><br>" + obj.innerHTML;
}

function FluxoAbortar() {
  Send(
    'automacao_coleta_retorno="9"automacao_coleta_mensagem="Fluxo Abortado pelo operador!!"automacao_coleta_sequencial="' +
      client.in_sequencial_executar +
      '"'
  );
}

function CartaoDigitar() {
  Send(
    'automacao_coleta_retorno="9"automacao_coleta_sequencial="' +
      client.in_sequencial_executar +
      '"'
  );
}

function Mostrar(ao_event) {
  var ls_tipo_servico = document.getElementById("io_lst_tipo_servico_mostrar")
    .options[io_lst_tipo_servico_mostrar.selectedIndex].text;

  if (ls_tipo_servico === "") {
    ls_tipo_servico = document.getElementById("io_txt_servico_mostrar").text;
  }

  if (ao_event === "" || ao_event.keyCode === 13) {
    Send(
      'servico="mostrar"retorno="1"sequencial="' +
        Sequencial() +
        '"mensagem="' +
        ls_tipo_servico +
        '"'
    );
  }
}

function Coletar() {
  var ls_tipo_servico = document.getElementById("io_lst_tipo_servico_coletar")
    .options[io_lst_tipo_servico_coletar.selectedIndex].text;

  Send(
    'servico="coletar"retorno="1"sequencial="' +
      Sequencial() +
      '"mensagem="' +
      ls_tipo_servico +
      '"'
  );
}

function Perguntar() {
  var ls_tipo_servico = document.getElementById("io_lst_tipo_servico_perguntar")
    .options[io_lst_tipo_servico_perguntar.selectedIndex].text;

  Send(
    'servico="perguntar"retorno="1"sequencial="' +
      Sequencial() +
      '"mensagem="' +
      ls_tipo_servico +
      "+" +
      document.getElementById("io_txt_coleta_informacao").value +
      '"'
  );
}

function Consultar() {
  Send('servico="consultar"retorno="0"sequencial="' + client.next() + '"');
}

function Coleta(ao_event) {
  if (ao_event == "" || ao_event.keyCode === 13) {
    Send(
      'automacao_coleta_sequencial="' +
        client.in_sequencial_executar +
        '"automacao_coleta_retorno="0"automacao_coleta_informacao="' +
        document.getElementById("io_txt_coleta_informacao").value +
        '"'
    );

    document.getElementById("io_txt_coleta_informacao").value = "";
  }
}
function Iniciar() {
  Send(
    'servico="iniciar"sequencial="' +
      Sequencial() +
      '"retorno="1"versao="1.0.0"aplicacao_tela="VBIAutomationTest"aplicacao="V$PagueClient"'
  );
}

function Finalizar() {
  Send('servico="finalizar"sequencial="' + Sequencial() + '"retorno="1"');
}

function Executar() {
  var ls_tipo_cartao =
    document.getElementById("io_lst_tipo_cartao").options[
      io_lst_tipo_cartao.selectedIndex
    ].text;

  var ls_tipo_transacao = document.getElementById("io_lst_transacao_tipo")
    .options[io_lst_transacao_tipo.selectedIndex].text;

  var ls_tipo_produto = document.getElementById("io_lst_tipo_produto").options[
    io_lst_tipo_produto.selectedIndex
  ].text;

  var ls_transacao_pagamento = document.getElementById(
    "io_lst_transacao_pagamento"
  ).options[io_lst_transacao_pagamento.selectedIndex].text;

  var ls_transacao_valor = document.getElementById("io_txt_coleta_valor").value;

  client.exec({
    ls_transacao_pagamento,
    ls_tipo_cartao,
    ls_tipo_produto,
    ls_tipo_transacao,
    ls_transacao_valor,
  });
}
