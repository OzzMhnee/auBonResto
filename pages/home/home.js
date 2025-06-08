// Variables déclaratives initiales
let restaurants = [];
let favorites = JSON.parse(localStorage.getItem("restaurantFavorites") || "[]");

// Initialisation
window.initializePage = function (page) {
  if (page === "home") {
    loadAndRender();
  }
};

// Chargement des données
async function loadAndRender() {
  try {
    const response = await fetch("/data/restaurants.json");
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des données");

    restaurants = await response.json();
    render();
    initFavorites();
    initDetailButtons();
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// Affichage des cards
function render() {
  const container = document.querySelector(".divCards");
  const templateCard = container.querySelector(".card");

  if (!container || !templateCard) {
    console.error("Container ou template non trouvé");
    return;
  }

  // Sauvegarde du template
  const template = templateCard.outerHTML;

  // Génération des cartes
  const html = restaurants
    .map((restaurant) =>
      template
        .replace(/{id}/g, restaurant.id)
        .replace(/{name}/g, restaurant.name)
        .replace(/{image}/g, restaurant.image_main)
        .replace(/{specialty}/g, restaurant.specialty)
        .replace(/{address}/g, restaurant.contact?.address || "")
        .replace(/{stars}/g, generateStars(restaurant.rating))
    )
    .join("");

  container.innerHTML = html;
}

// Génération des étoiles (selon rating du fichier restaurants.json)
function generateStars(rating) {
  return Array.from(
    { length: 5 },
    (_, i) => `<i class="fa-${i < rating ? "solid" : "regular"} fa-star"></i>`
  ).join("");
}

// Initialisation des favoris
function initFavorites() {
  document.querySelectorAll(".fa-heart").forEach((heart) => {
    const id = parseInt(heart.id.replace("fav", ""));
    heart.className = favorites.includes(id)
      ? "fa-solid fa-heart active"
      : "fa-solid fa-heart inactive";
    heart.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(id, heart);
    };
  });
}

// Initialisation des boutons de détail
function initDetailButtons() {
  document.querySelectorAll("#btn-fav[data-id]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-id");
      window.location.href = `/index.html?page=details&id=${id}`;
    });
  });
}

// Toggle "ajouter/supprimer" favoris
function toggleFavorite(id, heart) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((fav) => fav !== id);
    heart.className = "fa-solid fa-heart inactive";
  } else {
    favorites.push(id);
    heart.className = "fa-solid fa-heart active";
  }

  // Sauvegarde dans localStorage
  localStorage.setItem("restaurantFavorites", JSON.stringify(favorites));
}
