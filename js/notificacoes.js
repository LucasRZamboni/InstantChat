function enviarNotificacao(titulo, mensagem, imagemUrl, linkParaChat) {
  Notification.requestPermission().then((perm) => {
    if (perm === "granted") {
      const notification = new Notification(titulo, {
        body: mensagem,
        icon: imagemUrl, // Defina a URL da imagem como ícone da notificação
        vibrate: [200, 100, 200],
      });

      notification.addEventListener("click", () => {
        window.open(linkParaChat, "https://lucasrzamboni.github.io/InstantChat/"); 
      });

      notification.addEventListener("error", (e) => {
        alert("Erro");
      });
    }
  });
}
