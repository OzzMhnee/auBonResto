// Variables initiales
let restaurants = [];
let favorites = JSON.parse(localStorage.getItem("restaurantFavorites") || "[]");

// Initialisation de la page Favoris
window.initializePage = function (page) {
  if (page === "favorites") {
    loadAndRenderFavorites();
  }
};

// Chargement et affichage des favoris
async function loadAndRenderFavorites() {
  try {
    const response = await fetch("/data/restaurants.json");
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des données");

    restaurants = await response.json();
    // Filtrer uniquement les restaurants favoris
    const favoriteRestaurants = restaurants.filter(r => favorites.includes(r.id));
    renderFavorites(favoriteRestaurants);
    initFavorites();
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// Affichage des cartes favoris
function renderFavorites(favoriteRestaurants) {
  const container = document.querySelector(".divCards");
  const templateCard = container.querySelector(".card");

  if (!container || !templateCard) {
    console.error("Container ou template non trouvé");
    return;
  }

  const template = templateCard.outerHTML;

  const html = favoriteRestaurants
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

// Initialisation des favoris (pour permettre de retirer un favori)
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
      loadAndRenderFavorites();
    };
  });
}

// Toggle favoris
function toggleFavorite(id, heart) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((fav) => fav !== id);
    heart.className = "fa-solid fa-heart inactive";
  } else {
    favorites.push(id);
    heart.className = "fa-solid fa-heart active";
  }
  localStorage.setItem("restaurantFavorites", JSON.stringify(favorites));
}