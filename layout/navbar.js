let currentNavbar = null;

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
    );
  }
}
