var nickname = null;
var client = null;
var cooldown = true;

function conectar() {
  nickname = document.getElementById('nickname').value;

  if (nickname.length) {
    client = new Paho.Client('broker.emqx.io', 8083, nickname);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({ onSuccess: onConnect });

  } else {
    alert('Digite um nickname!');
  }
}

function onConnect() {
  console.log("onConnect");
  mostrarMensagemLog('Você foi conectado!');
  client.subscribe('senai_web_designer');
}

function mostrarMensagemLog(texto) {
  var mensagens = document.getElementById('messages');
  mensagens.innerHTML = mensagens.innerHTML + `
  <div class="message center">
    <div class="bg-message">
        <div class="user">Biston</div>
        <div class="content">${texto}</div>
    </div>
  </div>`;
}

function desconectar() {
  client.disconnect();
  console.log('Disconnect');
  mostrarMensagemLog('Você foi desconectado!');
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
    mostrarMensagemLog('Conexão perdida!');
  }
}

function onMessageArrived(message) {
  console.log("onMessageArrived:" + message.payloadString);
  var nick = message.payloadString.split(' @@ ')[0];
  var mensagem = message.payloadString.split(' @@ ')[1];
  mostrarMensagem(nick, mensagem);
}

function mostrarMensagem(nick, mensagem) {
  var mHtml = '';

  if (nick === nickname) {
    mHtml = `
     <div class="message right">
        <div class="bg-message">
            <div class="user">${nick}</div>
            <div class="content">${mensagem}</div>
        </div>
      </div>`;
  } else {
    mHtml = `
    <div class="message">
        <div class="bg-message">
          <div class="user">${nick}</div>
          <div class="content">${mensagem}</div>
      </div>
    </div>`;
  }

  var novaMensagem = document.getElementById('messages');
  novaMensagem.innerHTML = novaMensagem.innerHTML + mHtml;

  novaMensagem.scrollTop = novaMensagem.scrollTop + 1000;
}

const esperarSegundos = async (tempoEspera) => {
  cooldown = false;
  setTimeout(() => {
    cooldown = true;
  }, tempoEspera * 1000);
}

function enviarMensagem() {
  if (cooldown) {
    var texto = document.getElementById('text-area').value;
    texto = nickname + ' @@ ' + texto;
    message = new Paho.Message(texto);
    message.destinationName = "senai_web_designer";
    client.send(message);
    esperarSegundos(3);
  }
}
