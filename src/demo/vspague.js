class VSPagueClient {
  constructor() {
    this.in_sequencial = 2;
    this.in_sequencial_executar = 0;
    this.io_connection = null;
    this.io_tags = null;
  }

  send(message) {
    this.io_connection.send(message);
    return message;
  }

  next() {
    this.in_sequencial = this.in_sequencial + 1;
    return this.in_sequencial;
  }

  init() {
    return this.send(
      'servico="iniciar"sequencial="' +
        this.next() +
        '"retorno="1"versao="1.0.0"aplicacao_tela="VBIAutomationTest"aplicacao="V$PagueClient"'
    );
  }

  end() {
    return this.send(
      'servico="finalizar"sequencial="' + this.next() + '"retorno="1"'
    );
  }

  abort() {
    return this.send(
      'automacao_coleta_retorno="9"automacao_coleta_mensagem="Fluxo Abortado pelo operador!!"automacao_coleta_sequencial="' +
        this.in_sequencial_executar +
        '"'
    );
  }

  confirm(transactionType) {
    let ls_tipo_transacao = 'transacao="' + transactionType + '"';

    let ls_tags_executar =
      'servico="executar"retorno="0"sequencial="' +
      this.in_sequencial +
      '"' +
      ls_tipo_transacao;

    return this.send(ls_tags_executar);
  }

  exec(opts) {
    let {
      ls_tipo_transacao,
      ls_tipo_cartao,
      ls_tipo_produto,
      ls_transacao_pagamento,
      ls_transacao_valor,
    } = opts;

    let ls_tags_executar =
      'servico="executar"retorno="1"sequencial="' + this.next() + '"';

    if (ls_transacao_valor !== "") {
      ls_transacao_valor = 'transacao_valor="' + ls_transacao_valor + '"';
      ls_tags_executar = ls_tags_executar + ls_transacao_valor;
    }

    if (ls_tipo_transacao !== "") {
      ls_tipo_transacao = 'transacao="' + ls_tipo_transacao + '"';
      ls_tags_executar = ls_tags_executar + ls_tipo_transacao;
    }

    if (ls_tipo_cartao !== "") {
      ls_tipo_cartao = 'transacao_tipo_cartao="' + ls_tipo_cartao + '"';
      ls_tags_executar = ls_tags_executar + ls_tipo_cartao;
    }

    if (ls_tipo_produto !== "") {
      ls_transacao_pagamento =
        'transacao_pagamento="' + ls_transacao_pagamento + '"';
      ls_tags_executar = ls_tags_executar + ls_transacao_pagamento;
    }

    if (ls_transacao_pagamento !== "") {
      ls_tipo_produto = 'transacao_produto="' + ls_tipo_produto + '"';
      ls_tags_executar = ls_tags_executar + ls_tipo_produto;
    }

    return this.send(ls_tags_executar);
  }

  connect({ onOpen, onMessage, onError, onClose, onSequencial }) {
    this.io_connection = new WebSocket("ws://localhost:60906");

    this.io_connection.onopen = function () {
      this.io_tags = new Tags();
      this.io_tags.init();

      onOpen();
    };

    this.io_connection.onclose = function () {
      onClose();
    };

    this.io_connection.onerror = function (error) {
      console.error(error.message);
      onError(error);
    };

    this.io_connection.onmessage = function (e) {
      onMessage({ body: e.data });
      this.io_tags.init();

      // Mosta as tag's recebidas.
      new ServicoDesmontar(this.io_tags, e.data);

      // Se retorno não for de pacote ok...
      if (this.io_tags.retorno !== "0") {
        this.in_sequencial = this.io_tags.sequencial;
        onSequencial(this.in_sequencial);
      }

      // Guarda o sequencial corrente da coleta.
      this.in_sequencial = this.io_tags.sequencial;

      // Apresenta o comprovante..
      if (this.io_tags.transacao_comprovante_1via !== "") {
        const comprovante =
          this.io_tags.transacao_comprovante_1via +
          this.io_tags.transacao_comprovante_2via;
        alert(comprovante);
      }
    };
  }
}

// Tags nessessárias para a integração.
class Tags {
  aplicacao;
  aplicacao_tela;
  estado;
  versao;
  mensagem;
  retorno;
  sequencial;
  servico;
  transacao;
  tipo_produto;
  transacao_comprovante_1via;
  transacao_comprovante_2via;
  transacao_comprovante_resumido;
  transacao_informacao;
  transacao_opcao;
  transacao_pagamento;
  transacao_parcela;
  transacao_produto;
  transacao_rede;
  transacao_tipo_cartao;
  transacao_administracao_usuario;
  transacao_administracao_senha;
  transacao_valor;
  automacao_coleta_opcao;

  constructor() {
    this.transacao_comprovante_1via = "";
    this.transacao_comprovante_2via = "";
    this.transacao = "";
    this.transacao_produto = "";
    this.servico = "";
    this.retorno = 0;
    this.sequencial = 0;
  }

  init() {
    this.transacao_comprovante_1via = "";
    this.transacao_comprovante_2via = "";
    this.transacao = "";
    this.transacao_produto = "";
    this.servico = "";
    this.retorno = 0;
    this.sequencial = 0;
  }

  fill(as_tag, as_value) {
    if ("automacao_coleta_opcao" === as_tag) {
      this.automacao_coleta_opcao = as_value;
    } else if ("automacao_coleta_informacao" === as_tag) {
      this.automacao_coleta_informacao = as_value;
    } else if ("automacao_coleta_mensagem" === as_tag) {
      this.automacao_coleta_mensagem = as_value;
    } else if ("automacao_coleta_retorno" === as_tag) {
      this.automacao_coleta_retorno = as_value;
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
  }
}

var ServicoDesmontar = function (io_tags, ao_servico) {
  var ln_start = 0;
  var ln_end = ao_servico
    .toString()
    .indexOf("\n\r\n\t\t\r\n\t\t\t\r\n\t\t\r\n\t");

  var ls_tag = "";

  var ls_value = "";

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
      io_tags.fill(ls_tag, ls_value);
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
};
