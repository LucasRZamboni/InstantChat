const firebaseConfig = {
  apiKey: "AIzaSyAhB8nvmZxDohdvkehG96kZoIRV7NSmDBA",
  authDomain: "instantmessage-11caa.firebaseapp.com",
  projectId: "instantmessage-11caa",
  storageBucket: "instantmessage-11caa.appspot.com",
  messagingSenderId: "914745148810",
  appId: "1:914745148810:web:44329b3989b01a4c34b473"
};

// Inicialize o Firebase
firebase.initializeApp(firebaseConfig);

// Referência para o banco de dados
const database = firebase.database();
// Referência para a seção de mensagens
const messagesRef = database.ref("mensagens");
// Referência para o Firebase Storage
const storageRef = firebase.storage().ref();

document.getElementById("enviar-mensagem").addEventListener("click", () => {
  enviarMensagem();
});

document.getElementById("enviarImagem").addEventListener("click", () => {
  enviarImagem();
});

function rolarParaUltimaMensagem() {
  const chatMessages = document.getElementById("chat-messages");
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
messagesRef.on("child_added", (snapshot) => {
  const mensagem = snapshot.val();
 
  // Verifique o tipo de mensagem
  if (mensagem.tipo === "texto" || mensagem.tipo === "imagem") {
    // Role para a última mensagem apenas para mensagens de texto ou imagens
    rolarParaUltimaMensagem();
  }
});


document
  .getElementById("mensagem")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      // Verifique se a tecla pressionada é "Enter" e não "Shift+Enter"
      event.preventDefault(); // Impede a quebra de linha padrão (Shift+Enter)
      enviarMensagem(); // Chama a função de envio de mensagem
    }
  });

function enviarMensagem() {
  const mensagem = document.getElementById("mensagem").value;
  if (mensagem.trim() !== "") {
    const mensagemData = {
      tipo: "texto",
      conteudo: mensagem,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    };
    messagesRef.push().set(mensagemData);

    enviarNotificacao("InstantChat","Nova Mensagem - " + mensagem, "https://lucasrzamboni.github.io/InstantChat/");

    document.getElementById("mensagem").value = "";
  }
}

function enviarImagem() {
  const inputImagem = document.getElementById("imagemInput");
  inputImagem.click(); // Abre o diálogo de seleção de arquivo

  // Configure um ouvinte para o evento 'change' do input de imagem
  inputImagem.addEventListener("change", () => {
    const imagem = inputImagem.files[0]; // Obtém o arquivo de imagem selecionado

    // Faça o upload da imagem para o Firebase Storage
    const imagemRef = storageRef.child(imagem.name); // Nome do arquivo é usado como referência

    imagemRef.put(imagem).then((snapshot) => {
      console.log("Imagem enviada com sucesso!");

      // Após o upload bem-sucedido, obtenha a URL real da imagem
      imagemRef.getDownloadURL().then((imageUrl) => {
        console.log("URL da imagem:", imageUrl);

        const mensagemData = {
          tipo: "imagem",
          conteudo: imageUrl,
        }; 
 
        messagesRef.push().set(mensagemData);

        inputImagem.value = "";

         // Adicione o código para enviar a notificação aqui
         enviarNotificacao("InstantChat","Nova imagem", imageUrl, "https://lucasrzamboni.github.io/InstantChat/");
      });
    });
  });
}




// Configurar ouvinte para mensagens do Firebase Realtime Database
firebase
  .database()
  .ref("mensagens")
  .on("child_added", (snapshot) => {
    const mensagem = snapshot.val();
    const mensagemKey = snapshot.key;

    if (mensagem.tipo === "texto") {
      displayMensagem(mensagem.conteudo, mensagemKey);
    } else if (mensagem.tipo === "imagem") {
      displayImagem(mensagem.conteudo, mensagemKey);
    }
  });

function displayMensagem(mensagem, mensagemKey) {
  // Manipule a exibição de mensagens de texto aqui
  const chatMessages = document.getElementById("chat-messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", "bg-dark");

  const messageText = document.createElement("div");
  messageText.classList.add("message-text");
  messageText.textContent = mensagem;

  messageElement.appendChild(messageText);
  chatMessages.appendChild(messageElement);

  // Adicione um contador de tempo
  const contadorTempo = document.createElement("div");
  contadorTempo.classList.add("contador-tempo", "text-secondary");
  messageElement.appendChild(contadorTempo);

  let tempoRestante = 20;

  const timerInterval = setInterval(() => {
    contadorTempo.textContent = tempoRestante;
    tempoRestante--;

    if (tempoRestante < 0) {
      clearInterval(timerInterval);
      excluirMensagem(mensagemKey);
      messageElement.remove();
    }
  }, 1000);
}

function displayImagem(imagemUrl, mensagemKey) {
  // Manipule a exibição de mensagens de imagem aqui
  const chatMessages = document.getElementById("chat-messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", "bg-dark");

  // Crie um elemento de imagem
  const imgElement = document.createElement("img");
  imgElement.src = imagemUrl;
  imgElement.style.width = "70%";
  imgElement.style.height = "70%";

  const messageImage = document.createElement("div");
  messageImage.classList.add("message-image");
  messageImage.appendChild(imgElement);

  messageElement.appendChild(messageImage);
  chatMessages.appendChild(messageElement);

  // Adicione um contador de tempo
  const contadorTempo = document.createElement("div");
  contadorTempo.classList.add("contador-tempo", "text-secondary");
  messageElement.appendChild(contadorTempo);

  let tempoRestante = 5;

  const timerInterval = setInterval(() => {
    contadorTempo.textContent = tempoRestante;
    tempoRestante--;

    if (tempoRestante < 0) {
      clearInterval(timerInterval);
      excluirMensagem(mensagemKey);
      messageElement.remove();
    }
  }, 1000);
}

function excluirMensagem(mensagemKey) {
  const messagesRef = firebase.database().ref("mensagens"); // Certifique-se de que a referência seja correta
  messagesRef.child(mensagemKey).remove(function (error) {
    if (error) {
      console.error("Erro ao excluir mensagem:", error);
    } else {
      console.log("Mensagem excluída com sucesso:", mensagemKey);
    }
  });
  console.clear();
}

