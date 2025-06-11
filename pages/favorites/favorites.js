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
    const favoriteRestaurants = restaurants.filter((r) =>
      favorites.includes(r.id)
    );
    renderFavorites(favoriteRestaurants);
    initFavorites();
    initDetailButtons(); // Ajouter cette ligne
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

  // Si aucun favori, afficher un message
  if (favoriteRestaurants.length === 0) {
    container.innerHTML = `
      <div style="display: flex; flex-direction:column; align-items: center; justify-content:center; gap:10px; width: 100%; padding: 50px;">
        <h3 style="font-family:Roboto; display:flex; align-items:center; gap: 20px">Aucun restaurant en favori <span style="font-size: 2rem">😢</span></h3>
        <p>Ajoutez-en depuis la page d'accueil !</p>
      </div>
    `;
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

// Génération des étoiles (fonction ajoutée)
function generateStars(rating) {
  return Array.from(
    { length: 5 },
    (_, i) => `<i class="fa-${i < rating ? "solid" : "regular"} fa-star"></i>`
  ).join("");
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
      // Recharger la page des favoris après suppression
      setTimeout(() => loadAndRenderFavorites(), 100);
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
