var io_tags,ln_font_size=4,in_sequencial=2,in_sequencial_executar=0,io_connection=Conectar();function Send(e){io_connection.send(e);var t=document.getElementById("output");t.innerHTML="<br> >>> SEND: <br>"+e.fontsize(ln_font_size)+"<br><br>"+t.innerHTML}function Trace(e){var t=document.getElementById("output");t.innerHTML="<br> <<< RECEIVE: <br>"+e.fontsize(ln_font_size)+"<br><br>"+t.innerHTML}function Sequencial(){return in_sequencial+=1,document.getElementById("io_txt_sequencial").value=in_sequencial,in_sequencial}function Coleta(e){""!=e&&13!==e.keyCode||(Send('automacao_coleta_sequencial="'+in_sequencial_executar+'"automacao_coleta_retorno="0"automacao_coleta_informacao="'+document.getElementById("io_txt_coleta_informacao").value+'"'),document.getElementById("io_txt_coleta_informacao").value="")}function Iniciar(){Send('servico="iniciar"sequencial="'+Sequencial()+'"retorno="1"versao="1.0.0"aplicacao_tela="VBIAutomationTest"aplicacao="V$PagueClient"')}function Finalizar(){Send('servico="finalizar"sequencial="'+Sequencial()+'"retorno="1"')}function Executar(){var e='servico="executar"retorno="1"sequencial="'+Sequencial()+'"',t=document.getElementById("io_lst_tipo_cartao").options[io_lst_tipo_cartao.selectedIndex].text,o=document.getElementById("io_lst_transacao_tipo").options[io_lst_transacao_tipo.selectedIndex].text,a=document.getElementById("io_lst_tipo_produto").options[io_lst_tipo_produto.selectedIndex].text,n=document.getElementById("io_lst_transacao_pagamento").options[io_lst_transacao_pagamento.selectedIndex].text,i=document.getElementById("io_txt_coleta_valor").value;""!==i&&(e+=i='transacao_valor="'+i+'"'),io_lst_transacao_tipo.selectedIndex>=0&&(e+=o='transacao="'+o+'"'),io_lst_tipo_cartao.selectedIndex>=0&&(e+=t='transacao_tipo_cartao="'+t+'"'),io_lst_transacao_pagamento.selectedIndex>=0&&(e+=n='transacao_pagamento="'+n+'"'),io_lst_tipo_produto.selectedIndex>=0&&(e+=a='transacao_produto="'+a+'"'),Send(e)}function Conectar(){return new WebSocket("ws://localhost:60906")}function Limpar(){document.getElementById("output").innerHTML=""}function SequencialAdicionar(){return in_sequencial=in_sequencial++,document.getElementById("io_txt_sequencial").value=in_sequencial,in_sequencial}function Confirmar(){var e=document.getElementById("io_lst_transacao_tipo").options[io_lst_transacao_tipo.selectedIndex].text,t='servico="executar"retorno="0"sequencial="'+document.getElementById("io_txt_sequencial").value+'"';io_lst_transacao_tipo.selectedIndex>=0&&(t+=e='transacao="'+e+'"'),Send(t)}function CartaoDigitar(){Send('automacao_coleta_retorno="9"automacao_coleta_sequencial="'+in_sequencial_executar+'"')}function FluxoAbortar(){Send('automacao_coleta_retorno="9"automacao_coleta_mensagem="Fluxo Abortado pelo operador!!"automacao_coleta_sequencial="'+in_sequencial_executar+'"')}function Mostrar(e){var t=document.getElementById("io_lst_tipo_servico_mostrar").options[io_lst_tipo_servico_mostrar.selectedIndex].text;""===t&&(t=document.getElementById("io_txt_servico_mostrar").text),""!==e&&13!==e.keyCode||Send('servico="mostrar"retorno="1"sequencial="'+Sequencial()+'"mensagem="'+t+'"')}function Coletar(){var e=document.getElementById("io_lst_tipo_servico_coletar").options[io_lst_tipo_servico_coletar.selectedIndex].text;Send('servico="coletar"retorno="1"sequencial="'+Sequencial()+'"mensagem="'+e+'"')}function Perguntar(){var e=document.getElementById("io_lst_tipo_servico_perguntar").options[io_lst_tipo_servico_perguntar.selectedIndex].text;Send('servico="perguntar"retorno="1"sequencial="'+Sequencial()+'"mensagem="'+e+"+"+document.getElementById("io_txt_coleta_informacao").value+'"')}function Consultar(){Send('servico="consultar"retorno="0"sequencial="'+Sequencial()+'"')}function Tags(){this.TagsAlimentar=function(e,t){"automacao_coleta_opcao"===e?t:"automacao_coleta_informacao"===e?t:"automacao_coleta_mensagem"===e?t:"automacao_coleta_retorno"===e?t:"automacao_coleta_sequencial"===e?this.automacao_coleta_sequencial=t:"transacao_comprovante_1via"===e?this.transacao_comprovante_1via=t:"transacao_comprovante_2via"===e?this.transacao_comprovante_2via=t:"transacao_comprovante_resumido"===e?this.transacao_comprovante_resumido=t:"servico"===e?this.servico=t:"transacao"===e?this.transacao=t:"transacao_produto"===e?this.transacao_produto=t:"retorno"===e?this.retorno=t:"sequencial"===e&&(this.sequencial=parseInt(t,0))},this.TagsInicializar=function(){this.transacao_comprovante_1via="",this.transacao_comprovante_2via="",this.transacao="",this.transacao_produto="",this.servico="",this.retorno=0,this.sequencial=0}}io_connection.onopen=function(){Trace("Connection successful"),(io_tags=new Tags).TagsInicializar()},io_connection.onerror=function(e){Trace("Disconnected"),Trace(e.data)},io_connection.onmessage=function(e){Trace(e.data),io_tags.TagsInicializar(),new ServicoDesmontar(e.data),"0"!==io_tags.retorno&&(in_sequencial=io_tags.sequencial,document.getElementById("io_txt_sequencial").value=in_sequencial),in_sequencial_executar=io_tags.automacao_coleta_sequencial,""!==io_tags.transacao_comprovante_1via&&alert(io_tags.transacao_comprovante_1via+io_tags.transacao_comprovante_2via)};var ServicoDesmontar=function(e){var t=0,o=e.toString().indexOf("\n\r\n\t\t\r\n\t\t\t\r\n\t\t\r\n\t"),a="",n="";try{for(;t<o;)t=t+(a=e.toString().substring(t,e.indexOf('="',t))).toString().length+2,n=e.toString().substring(t,t=e.toString().indexOf('"\n',t)),t+=2,io_tags.TagsAlimentar(a,n);if(""!==io_tags.servico&&"consultar"===io_tags.servico){var i=io_tags.transacao.split(";");for((c=document.getElementById("io_lst_transacao_tipo")).innerHTML="",ln_1=0;ln_1<i.length;ln_1++){(r=document.createElement("option")).text=i[ln_1].replace('"',"").replace('"',""),c.options.add(r)}i=io_tags.transacao_produto.split(";");var c=document.getElementById("io_lst_tipo_produto");for(ln_1=0;ln_1<i.length;ln_1++){var r;(r=document.createElement("option")).text=i[ln_1].replace('"',"").replace('"',""),c.options.add(r)}}}catch(e){alert("Error interno: "+e.message)}};