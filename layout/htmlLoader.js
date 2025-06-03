function loadHTML(id, htmlURL, cssURL = null) {
  return fetch(htmlURL)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return res.text();
    })
    .then(html => {
      const container = document.getElementById(id);
      if (!container) {
        console.error(`Container #${id} introuvable`);
        return;
      }

      container.innerHTML = html;

      if (cssURL && !document.head.querySelector(`link[href="${cssURL}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssURL;
        document.head.appendChild(link);
      }
    })
    .catch(err => {
      console.error(`Erreur chargement ${htmlURL} :`, err);
    });
}
