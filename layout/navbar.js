let currentNavbar = null;

function initMobileMenu() {
  const burger = document.getElementById("burger-menu");
  const nav = document.getElementById("mobile-nav");
  const overlay = document.getElementById("mobile-navbar");
  const closeCross = document.getElementById("close-cross");

  if (!burger || !nav || !overlay) return;

  // Fonction pour ouvrir le menu
  function openMenu() {
    nav.classList.add("open");
    burger.classList.add("active");
    overlay.classList.add("open");
  }

  // Fonction pour fermer le menu
  function closeMenu() {
    nav.classList.remove("open");
    burger.classList.remove("active");
    overlay.classList.remove("open");
  }

  // Event listeners
  burger.addEventListener("click", () => {
    if (nav.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Clic sur l'overlay pour fermer
  overlay.addEventListener("click", closeMenu);

  // Clic sur la croix pour fermer
  if (closeCross) {
    closeCross.addEventListener("click", closeMenu);
  }

  // Touches clavier
  burger.addEventListener("keydown", (event) => {
    if (event.key === "Escape" || event.key === "Enter") {
      event.preventDefault();
      burger.click();
    }
  });

  // Fermer avec Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      closeMenu();
    }
  });
}

function initDesktopNavbar() {
  // Détection de la page active
  function setActivePage() {
    const params = new URLSearchParams(window.location.search);
    const currentPage = params.get("page") || "home";

    // Retirer la classe active de tous les liens
    document.querySelectorAll(".navbar-link").forEach((link) => {
      link.classList.remove("active");
    });

    // Ajouter la classe active au lien correspondant
    const activeLink = document.querySelector(`[data-page="${currentPage}"]`);
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }

  // Initialiser la page active
  setActivePage();

  // Réinitialiser la page active lors des changements d'URL
  window.addEventListener("popstate", setActivePage);
}

function loadNavbar() {
  const isMobile = window.innerWidth <= 768;
  const newNavbar = isMobile ? "mobile" : "desktop";

  if (currentNavbar === newNavbar) return;
  currentNavbar = newNavbar;

  const navContainer = document.getElementById("nav-container");
  const mobileNavContainer = document.getElementById("mobile-nav-container");

  if (navContainer) navContainer.innerHTML = "";
  if (mobileNavContainer) mobileNavContainer.innerHTML = "";

  if (isMobile) {
    loadHTML(
      "mobile-nav-container",
      "/layout/mobile-navbar/mobile-navbar.html",
      "/layout/mobile-navbar/mobile-navbar.css"
    ).then(() => initMobileMenu());
  } else {
    loadHTML(
      "nav-container",
      "/layout/navbar/navbar.html",
      "/layout/navbar/navbar.css"
    ).then(() => {
      setTimeout(initDesktopNavbar, 100);
    });
  }
}
