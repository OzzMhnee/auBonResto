// Gestion des onglets
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const formContainer = document.getElementById('form-container');

    loginTab.addEventListener('click', () => {
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
      loginForm.style.display = '';
      registerForm.style.display = 'none';
    });

    registerTab.addEventListener('click', () => {
      registerTab.classList.add('active');
      loginTab.classList.remove('active');
      loginForm.style.display = 'none';
      registerForm.style.display = '';
    });

    // Gestion du submit Connexion
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (this.checkValidity()) {
        formContainer.innerHTML = `
          <div class="confirmation-message">
            <h2>Connexion réussie !</h2>
            <p>Bienvenue sur votre espace membre.</p>
          </div>
        `;
      } else {
        this.reportValidity();
      }
    });

    // Gestion du submit Inscription
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (this.checkValidity()) {
        // Vérification des mots de passe identiques
        const pwd = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        if (pwd !== confirm) {
          alert("Les mots de passe ne correspondent pas.");
          return;
        }
        formContainer.innerHTML = `
          <div class="confirmation-message">
            <h2>Inscription réussie !</h2>
            <p>Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.</p>
          </div>
        `;
      } else {
        this.reportValidity();
      }
    });

    // Mot de passe oublié (exemple d'action)
    document.getElementById('forgot-password').addEventListener('click', function(e) {
      e.preventDefault();
      formContainer.innerHTML = `
        <div class="confirmation-message">
          <h2>Mot de passe oublié</h2>
          <p>Un lien de réinitialisation vous sera envoyé si votre adresse e-mail est enregistrée.</p>
        </div>
      `;
    });

    // visibilité mot de passe
    document.querySelectorAll('.toggle-password').forEach(function(eye) {
        eye.addEventListener('click', function() {
            const input = document.getElementById(this.dataset.target);
            if (input.type === "password") {
            input.type = "text";
            this.textContent = "👁️"; // Icône œil barré
            } else {
            input.type = "password";
            this.textContent = "🤞"; // Icône œil
            }
        });
    });