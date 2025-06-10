<footer class="footer">
  <div class="footer-container">
    <div class="footer-logo">
        <img id="logo2" src="/images/logo/LogoNoir.png" alt="">
      <h2>AuBonResto</h2>
      <p>Explorez les meilleures tables de la ville</p>
    </div>

    <div class="footer-links">
      <a href="/mentions-legales">Mentions légales</a>
      <a href="/cgu">CGU</a>
      <a href="/contact">Contact</a>
      <a href="/a-propos">À propos</a>
    </div>

    <div class="footer-social">
      <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
      <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
      <a href="#" aria-label="Twitter"><i class="fab fa-x-twitter"></i></a>
    </div>
  </div>

  <div class="footer-bottom">
    <p>&copy; 2025 Squad Afpa. Tous droits réservés.</p>
  </div>
</footer>





/*----------------- FOOTER  ------------*/

.footer {
  background-color: rgba(52, 50, 50, 0.176);

  padding: 2rem 0 1rem 0;
  color: #333;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
}

.footer-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: end;
  justify-items: center;
}

.footer-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  gap: 8px;
}

.footer-logo h2 {
  font-size: 1.5rem;
  font-family: Inspiration, sans-serif;
}

#logo2 {
  width: 10%;
}

.footer-logo p {
  font-size: 0.9rem;
  color: #666;
}

.footer-links {
  display: flex;
  gap: 1rem
}

.footer-links a {
  text-decoration: none;
  color: #555;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: black;
  text-decoration: underline;
}

.footer-social {
  display: flex;
  font-size: 1.2rem;
  gap:1rem;
}

.footer-social a {
  color: #666;
  transition: color 0.3s ease, transform 0.3s ease;
}

.footer-social a:hover {
  color: orange;
  transform: scale(1.2);
}

.footer-bottom {
  text-align: center;
  font-size: 0.8rem;
  color: #888;
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}
