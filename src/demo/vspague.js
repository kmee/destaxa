var ln_font_size = 4;
var in_sequencial = 2;
var in_sequencial_executar = 0;
var io_connection = Conectar();
var io_tags;

io_connection.onopen = function () {
  Trace("Connection successful");
  io_tags = new Tags();
  io_tags.TagsInicializar();
};

io_connection.onerror = function (error) {
  Trace("Disconnected");
  Trace(error.data);
};

io_connection.onmessage = function (e) {
  Trace(e.data);
  io_tags.TagsInicializar();

  // Mosta as tag's recebidas.
  new ServicoDesmontar(e.data);

  // Se retorno não for de pacote ok...
  if (io_tags.retorno !== "0") {
    in_sequencial = io_tags.sequencial;

    document.getElementById("io_txt_sequencial").value = in_sequencial;
  }

  // Guarda o sequencial corrente da coleta.
  in_sequencial_executar = io_tags.automacao_coleta_sequencial;

  // Apresenta o comprovante..
  if (io_tags.transacao_comprovante_1via !== "") {
    alert(
      io_tags.transacao_comprovante_1via + io_tags.transacao_comprovante_2via
    );
  }
};

// Função para envio de pacotes.
function Send(as_buffer) {
  // Envia o pacote.
  io_connection.send(as_buffer);

  var obj = document.getElementById("output");
  obj.innerHTML =
    "<br> >>> SEND: <br>" +
    as_buffer.fontsize(ln_font_size) +
    "<br><br>" +
    obj.innerHTML;
}

// Função para visualização dos pacotes trocados.
function Trace(as_buffer) {
  var obj = document.getElementById("output");
  obj.innerHTML =
    "<br> <<< RECEIVE: <br>" +
    as_buffer.fontsize(ln_font_size) +
    "<br><br>" +
    obj.innerHTML;
}

function Coleta(ao_event) {
  if (ao_event == "" || ao_event.keyCode === 13) {
    Send(
      'automacao_coleta_sequencial="' +
        in_sequencial_executar +
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

/**
		Função responsável por montar e enviar o serviço "executar".
		*/
function Executar() {
  var ls_tags_executar =
    'servico="executar"retorno="1"sequencial="' + Sequencial() + '"';

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

  if (ls_transacao_valor !== "") {
    ls_transacao_valor = 'transacao_valor="' + ls_transacao_valor + '"';
    ls_tags_executar = ls_tags_executar + ls_transacao_valor;
  }

  if (io_lst_transacao_tipo.selectedIndex >= 0) {
    ls_tipo_transacao = 'transacao="' + ls_tipo_transacao + '"';
    ls_tags_executar = ls_tags_executar + ls_tipo_transacao;
  }

  if (io_lst_tipo_cartao.selectedIndex >= 0) {
    ls_tipo_cartao = 'transacao_tipo_cartao="' + ls_tipo_cartao + '"';
    ls_tags_executar = ls_tags_executar + ls_tipo_cartao;
  }

  if (io_lst_transacao_pagamento.selectedIndex >= 0) {
    ls_transacao_pagamento =
      'transacao_pagamento="' + ls_transacao_pagamento + '"';
    ls_tags_executar = ls_tags_executar + ls_transacao_pagamento;
  }

  if (io_lst_tipo_produto.selectedIndex >= 0) {
    ls_tipo_produto = 'transacao_produto="' + ls_tipo_produto + '"';
    ls_tags_executar = ls_tags_executar + ls_tipo_produto;
  }

  // Envia o pacote para o V$PagueClient.
  Send(ls_tags_executar);
}

function Conectar() {
  // Retorna a conexão estabelecida.
  return new WebSocket("ws://localhost:60906");
}

function Limpar() {
  document.getElementById("output").innerHTML = "";
}

function SequencialAdicionar() {
  in_sequencial++;
  document.getElementById("io_txt_sequencial").value = in_sequencial;
  return in_sequencial;
}

function Confirmar() {
  var ls_tipo_transacao = document.getElementById("io_lst_transacao_tipo")
    .options[io_lst_transacao_tipo.selectedIndex].text;

  var ls_tags_executar =
    'servico="executar"retorno="0"sequencial="' +
    document.getElementById("io_txt_sequencial").value +
    '"';

  if (io_lst_transacao_tipo.selectedIndex >= 0) {
    ls_tipo_transacao = 'transacao="' + ls_tipo_transacao + '"';
    ls_tags_executar = ls_tags_executar + ls_tipo_transacao;
  }

  Send(ls_tags_executar);
}

function CartaoDigitar() {
  Send(
    'automacao_coleta_retorno="9"automacao_coleta_sequencial="' +
      in_sequencial_executar +
      '"'
  );
}

function FluxoAbortar() {
  Send(
    'automacao_coleta_retorno="9"automacao_coleta_mensagem="Fluxo Abortado pelo operador!!"automacao_coleta_sequencial="' +
      in_sequencial_executar +
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
  Send('servico="consultar"retorno="0"sequencial="' + Sequencial() + '"');
}

// Tags nessessárias para a integração.
function Tags() {
  var aplicacao;
  var aplicacao_tela;
  var estado;
  var versao;
  var mensagem;
  var retorno;
  var sequencial;
  var servico;
  var transacao;
  var tipo_produto;
  var transacao_comprovante_1via;
  var transacao_comprovante_2via;
  var transacao_comprovante_resumido;
  var transacao_informacao;
  var transacao_opcao;
  var transacao_pagamento;
  var transacao_parcela;
  var transacao_produto;
  var transacao_rede;
  var transacao_tipo_cartao;
  var transacao_administracao_usuario;
  var transacao_administracao_senha;
  var transacao_valor;
  var automacao_coleta_sequencial;
  var automacao_coleta_retorno;
  var automacao_coleta_mensagem;
  var automacao_coleta_informacao;
  var automacao_coleta_opcao;

  this.TagsAlimentar = function (as_tag, as_value) {
    if ("automacao_coleta_opcao" === as_tag) {
      automacao_coleta_opcao = as_value;
    } else if ("automacao_coleta_informacao" === as_tag) {
      automacao_coleta_informacao = as_value;
    } else if ("automacao_coleta_mensagem" === as_tag) {
      automacao_coleta_mensagem = as_value;
    } else if ("automacao_coleta_retorno" === as_tag) {
      automacao_coleta_retorno = as_value;
    } else if ("automacao_coleta_sequencial" === as_tag) {
      this.automacao_coleta_sequencial = as_value;
    } else if ("transacao_comprovante_1via" === as_tag) {
      this.transacao_comprovante_1via = as_value;
    } else if ("transacao_comprovante_2via" === as_tag) {
      this.transacao_comprovante_2via = as_value;
    } else if ("transacao_comprovante_resumido" === as_tag) {
      this.transacao_comprovante_resumido = as_value;
    } else if ("servico" === as_tag) {
      this.servico = as_value;
    } else if ("transacao" === as_tag) {
      this.transacao = as_value;
    } else if ("transacao_produto" === as_tag) {
      this.transacao_produto = as_value;
    } else if ("retorno" === as_tag) {
      this.retorno = as_value;
    } else if ("sequencial" === as_tag) {
      this.sequencial = parseInt(as_value, 0);
    }
  };

  this.TagsInicializar = function () {
    this.transacao_comprovante_1via = "";
    this.transacao_comprovante_2via = "";
    this.transacao = "";
    this.transacao_produto = "";
    this.servico = "";
    this.retorno = 0;
    this.sequencial = 0;
  };
}

var ServicoDesmontar = function (ao_servico) {
  var ln_start = 0;

  var ln_end = ao_servico
    .toString()
    .indexOf("\n\r\n\t\t\r\n\t\t\t\r\n\t\t\r\n\t");

  var ls_tag = "";

  var ls_value = "";

  var ln_value_end = 0;

  try {
    // Enquanto não finalizou a leitura do pacote recebido...
    while (ln_start < ln_end) {
      // Recupera a TAG
      ls_tag = ao_servico
        .toString()
        .substring(ln_start, ao_servico.indexOf('="', ln_start));

      // Ignora o = e a primeira " (...="...).
      ln_start = ln_start + ls_tag.toString().length + 2;

      // Recupera o valor da tag.
      ls_value = ao_servico
        .toString()
        .substring(
          ln_start,
          (ln_start = ao_servico.toString().indexOf('"\n', ln_start))
        );

      //Aponta para a segunda aspa dupla + \n.
      ln_start += 2;

      // Alimenta com a tag recebida..
      io_tags.TagsAlimentar(ls_tag, ls_value);
    }

    if (io_tags.servico !== "") {
      // Se Recebeu um Serviço Executar..
      if ("consultar" === io_tags.servico) {
        // Quebra no ; a lista que a automação recebeu..
        var ls_valores = io_tags.transacao.split(";");

        // Pega o objeto lista..
        var lo_lst_obj = document.getElementById("io_lst_transacao_tipo");

        // Limpa a lista antes de realimenta-la..
        lo_lst_obj.innerHTML = "";

        // Adiciona os tipos de Transação..
        for (ln_1 = 0; ln_1 < ls_valores.length; ln_1++) {
          var lo_option = document.createElement("option");

          lo_option.text = ls_valores[ln_1].replace('"', "").replace('"', "");
          lo_lst_obj.options.add(lo_option);
        }

        // Adiciona os Produto..
        var ls_valores = io_tags.transacao_produto.split(";");

        var lo_lst_obj = document.getElementById("io_lst_tipo_produto");

        for (ln_1 = 0; ln_1 < ls_valores.length; ln_1++) {
          var lo_option = document.createElement("option");
          //Trace('Valores: '+ls_valores[ln_1]);
          lo_option.text = ls_valores[ln_1].replace('"', "").replace('"', "");
          lo_lst_obj.options.add(lo_option);
        }
      }
    }
  } catch (err) {
    alert("Error interno: " + err.message);
  }

  function JanelaFechar() {
    Trace("Disconnect...");
    io_connection.close();
  }

  function JanelaAbrir() {
    Trace("Iniciando Aplicação Comercial...");

    var loc = location.search.substring(1, location.search.length);

    Trace(loc);
  }
};
