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
      console.log(client);
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

async function Send(message) {
  return client
    .send(message)
    .then(() => {
      var obj = document.getElementById("output");
      obj.innerHTML =
        "<br> >>> SEND: <br>" + message + "<br><br>" + obj.innerHTML;
    })
    .catch((err) => {
      Trace(`Erro ao enviar mensagem: ${err}`);
    });
}

async function FluxoAbortar() {
  Send(
    'automacao_coleta_retorno="9"automacao_coleta_mensagem="Fluxo Abortado pelo operador!!"automacao_coleta_sequencial="' +
      client.in_sequencial_executar +
      '"'
  );
}

async function CartaoDigitar() {
  await Send(
    'automacao_coleta_retorno="9"automacao_coleta_sequencial="' +
      client.in_sequencial_executar +
      '"'
  );
}

async function Mostrar(ao_event) {
  let ls_tipo_servico = document.getElementById("io_lst_tipo_servico_mostrar")
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

async function Coletar() {
  var ls_tipo_servico = document.getElementById("io_lst_tipo_servico_coletar")
    .options[io_lst_tipo_servico_coletar.selectedIndex].text;

  await Send(
    'servico="coletar"retorno="1"sequencial="' +
      Sequencial() +
      '"mensagem="' +
      ls_tipo_servico +
      '"'
  );
}

async function Perguntar() {
  var ls_tipo_servico = document.getElementById("io_lst_tipo_servico_perguntar")
    .options[io_lst_tipo_servico_perguntar.selectedIndex].text;

  await Send(
    'servico="perguntar"retorno="1"sequencial="' +
      Sequencial() +
      '"mensagem="' +
      ls_tipo_servico +
      "+" +
      document.getElementById("io_txt_coleta_informacao").value +
      '"'
  );
}

async function Consultar() {
  const sequencial = Sequencial();
  console.log(sequencial);

  await Send('servico="consultar"retorno="0"sequencial="' + sequencial + '"')
    .then(() => {
      console.log(client);
      if (client.io_tags.servico && client.io_tags.servico === "consultar") {
        // Quebra no ; a lista que a automação recebeu
        var ls_valores = client.io_tags.transacao.split(";");

        // Pega o objeto lista
        var lo_lst_obj = document.getElementById("io_lst_transacao_tipo");

        // Limpa a lista antes de realimenta-la
        lo_lst_obj.innerHTML = "";

        // Adiciona os tipos de Transação
        for (ln_1 = 0; ln_1 < ls_valores.length; ln_1++) {
          var lo_option = document.createElement("option");

          lo_option.text = ls_valores[ln_1].replace('"', "").replace('"', "");
          lo_lst_obj.options.add(lo_option);
        }

        // Adiciona os Produto
        var ls_valores_produtos = client.io_tags.transacao_produto.split(";");

        var lo_lst_obj_produto = document.getElementById("io_lst_tipo_produto");

        for (ln_1 = 0; ln_1 < ls_valores_produtos.length; ln_1++) {
          var lo_option_produto = document.createElement("option");
          //Trace('Valores: '+ls_valores[ln_1]);
          lo_option_produto.text = ls_valores[ln_1]
            .replace('"', "")
            .replace('"', "");
          lo_lst_obj_produto.options.add(lo_option);
        }
      }
    })
    .catch((err) => {
      alert("Error interno: " + err.message);
      Trace("Erro interno: " + err.message);
    });
}

async function Coleta(ao_event) {
  if (ao_event == "" || ao_event.keyCode === 13) {
    await Send(
      'automacao_coleta_sequencial="' +
        client.in_sequencial_executar +
        '"automacao_coleta_retorno="0"automacao_coleta_informacao="' +
        document.getElementById("io_txt_coleta_informacao").value +
        '"'
    );

    document.getElementById("io_txt_coleta_informacao").value = "";
  }
}

async function Iniciar() {
  await Send(
    'servico="iniciar"sequencial="' +
      Sequencial() +
      '"retorno="1"versao="1.0.0"aplicacao_tela="VBIAutomationTest"aplicacao="V$PagueClient"'
  );
}

async function Finalizar() {
  await Send('servico="finalizar"sequencial="' + Sequencial() + '"retorno="1"');
}

async function Executar() {
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

  client
    .exec({
      ls_transacao_pagamento,
      ls_tipo_cartao,
      ls_tipo_produto,
      ls_tipo_transacao,
      ls_transacao_valor,
    })
    .then((res) => Trace(res));
}
