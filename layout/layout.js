async function loadHTML(id, htmlURL, cssURL = null) {
  try {
    const res = await fetch(htmlURL);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

    const container = document.getElementById(id);
    if (!container) return console.error(`Container #${id} introuvable`);
    container.innerHTML = await res.text();

    if (cssURL && !document.head.querySelector(`link[href="${cssURL}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssURL;
      document.head.appendChild(link);
    }
  } catch (e) {
    console.error(`Erreur chargement ${htmlURL} :`, e);
  }
}

function initMobileMenu() {
  const burger = document.getElementById("burger-menu");
  const nav = document.getElementById("mobile-nav");
  const overlay = document.getElementById("mobile-navbar");

  if (!burger || !nav || !overlay) return;

  burger.addEventListener("click", () => {
    nav.classList.toggle("open");
    burger.classList.toggle("active");
    overlay.classList.toggle("open");
  });

  overlay.addEventListener("click", () => {
    nav.classList.remove("open");
    burger.classList.remove("active");
    overlay.classList.remove("open");
  });

  burger.addEventListener("keydown", (event) => {
    if (event.key === "Escape" || event.key === "Enter") {
      event.preventDefault();
      burger.click();
    }
  });
}

let currentNavbar = null;

async function loadNavbar() {
  const isMobile = window.innerWidth <= 768;
  const newNavbar = isMobile ? "mobile" : "desktop";

  if (currentNavbar === newNavbar) return;
  currentNavbar = newNavbar;

  const navContainer = document.getElementById("nav-container");
  const mobileNavContainer = document.getElementById("mobile-nav-container");

  if (navContainer) navContainer.innerHTML = "";
  if (mobileNavContainer) mobileNavContainer.innerHTML = "";

  if (isMobile) {
    await loadHTML(
      "mobile-nav-container",
      "/layout/mobile-navbar/mobile-navbar.html",
      "/layout/mobile-navbar/mobile-navbar.css"
    );
    initMobileMenu();
  } else {
    await loadHTML(
      "nav-container",
      "/layout/navbar/navbar.html",
      "/layout/navbar/navbar.css"
    );
  }
}

async function loadPageContent() {
  const params = new URLSearchParams(window.location.search);
  const page = params.get("page") || "accueil";

  const htmlPath = `/pages/${page}/${page}.html`;
  const cssPath = `/pages/${page}/${page}.css`;

  await loadHTML("page-content", htmlPath, cssPath);
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadNavbar();
  await loadHTML(
    "footer-container",
    "/layout/footer/footer.html",
    "/layout/footer/footer.css"
  );
  await loadPageContent();
});
