const form = document.getElementById('contactForm');

form.addEventListener('submit', function (e) {
  e.preventDefault(); // Empêche le rechargement de la page
 if (form.checkValidity()) {    
    form.innerHTML = `
          <div class="confirmation-message">
            <h2>Message bien reçu !</h2>
            <p>Votre message a été transmis avec succès.<br/>On finit de manger et on revient vers vous dans les plus brefs délais !</p>
            <button onclick="location.reload()">Envoyer un autre message</button></a>
          </div>
        `;
      } else {
        this.reportValidity();
      }
  });