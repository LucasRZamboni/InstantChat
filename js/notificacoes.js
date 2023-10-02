// function enviarNotificacao(titulo, mensagem, imagemUrl, linkParaChat) {
//   Notification.requestPermission().then((perm) => {
//     if (perm === "granted") {
//       const notification = new Notification(titulo, {
//         body: mensagem,
//         icon: imagemUrl, // Defina a URL da imagem como ícone da notificação
//         vibrate: [200, 100, 200],
//       });

//       notification.addEventListener("click", () => {
//         window.open(linkParaChat, "_blank"); // Abra a imagem em uma nova guia quando a notificação for clicada
//       });

//       notification.addEventListener("error", (e) => {
//         alert("Erro");
//       });
//     }
//   });
// }

function enviarNotificacao(playerID, titulo, mensagem, imagemUrl, linkParaChat) {
  // Verifique se todos os campos estão definidos
  if (playerID && titulo && mensagem && imagemUrl && linkParaChat) {
    // Configurar os dados da notificação
    const notificationData = {
      app_id: "a2728e04-e1de-4362-ba72-5986977b0fd5", // Substitua pelo seu app_id do OneSignal
      headings: { en: titulo },
      contents: { en: mensagem },
      data: { url: linkParaChat }, // Dados personalizados (URL do chat)
      include_player_ids: [playerID], // ID do jogador
      big_picture: imagemUrl,
    };

    // Enviar a notificação usando o OneSignal
    fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "MjQwNDA5YTMtY2E0OS00N2M4LWE1OTgtMDAxMjk1ZGNjNGRk", // Substitua pelo seu REST API Key do OneSignal
      },
      body: JSON.stringify(notificationData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Notificação enviada com sucesso
        console.log("Notificação enviada com sucesso:", data);

        // Agora, você pode usar o ID do jogador como chave no Firebase
        const database = firebase.database();
        const playerData = {
          // Use o ID do jogador como chave no Firebase
          [playerID]: {
            titulo: titulo,
            mensagem: mensagem,
            imagemUrl: imagemUrl,
            linkParaChat: linkParaChat,
          },
        };
        // Armazene os dados no Firebase
        database.ref("notificacoes").child(playerID).set(playerData[playerID]);
      })
      .catch((error) => {
        // Ocorreu um erro ao enviar a notificação
        console.error("Erro ao enviar notificação:", error);
      });
  } else {
    console.error("Campos indefinidos encontrados. Certifique-se de que todos os campos estejam definidos.");
  }
}
