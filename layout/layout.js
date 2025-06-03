function loadHTML(idContainer, urlHTML, urlCSS) {
  fetch(urlHTML)
    .then(res => res.text())
    .then(html => {
      document.getElementById(idContainer).innerHTML = html;
      if (urlCSS) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = urlCSS;
        document.head.appendChild(link);
      }
    })
    .catch(e => console.error(`Erreur chargement ${urlHTML} :`, e));
}

document.addEventListener('DOMContentLoaded', () => {
  loadHTML('nav-container', '/layout/navbar/navbar.html', '/layout/navbar/navbar.css');
  loadHTML('footer-container', '/layout/footer/footer.html', '/layout/footer/footer.css');
});

