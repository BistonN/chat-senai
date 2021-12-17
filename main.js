var nickname = null;
var client = null;

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
  client.subscribe("senai_web_designer");
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
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
}

function enviarMensagem() {
  var texto = document.getElementById('text-area').value;
  texto = nickname + ' @@ ' + texto;
  message = new Paho.Message(texto);
  message.destinationName = "senai_web_designer";
  client.send(message);
}
