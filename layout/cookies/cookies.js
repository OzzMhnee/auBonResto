// Gestion des cookies
function initCookies() {
  const banner = document.getElementById("cookieBanner");
  const acceptBtn = document.getElementById("acceptCookies");
  const rejectBtn = document.getElementById("rejectCookies");

  // Si pas de consentement, afficher la bannière
  if (!localStorage.getItem("cookieConsent")) {
    banner.classList.remove("hidden");
    setTimeout(() => banner.classList.add("show"), 500);
  }

  // Accepter
  acceptBtn.onclick = () => {
    localStorage.setItem("cookieConsent", "accepted");
    hideBanner();
  };

  // Refuser
  rejectBtn.onclick = () => {
    localStorage.setItem("cookieConsent", "rejected");
    hideBanner();
  };

  // Masquer bannière
  function hideBanner() {
    banner.classList.remove("show");
    setTimeout(() => banner.classList.add("hidden"), 400);
  }
}

// Initialisation des cookies
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCookies);
} else {
  initCookies();
}
