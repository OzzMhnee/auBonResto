// Variables déclaratives initiales
let restaurants = [];
let filteredRestaurants = [];
let favorites = JSON.parse(localStorage.getItem("restaurantFavorites") || "[]");
let originalTemplate = null;

// Initialisation
window.initializePage = function (page) {
  if (page === "home") {
    loadAndRender();
  }
};

// Initialisation automatique si on est sur la page home
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get("page") || "home";
  if (page === "home") {
    loadAndRender();
  }
});

// Classe pour gérer les dropdowns de manière générique
class DropdownManager {
  constructor(id, config) {
    this.id = id;
    this.config = config;
    this.element = document.getElementById(id);
    this.toggle = this.element?.querySelector(".dropdown-toggle");
    this.menu = this.element?.querySelector(".dropdown-menu");
    this.textElement = this.element?.querySelector(".dropdown-text");
    this.checkboxes = this.element?.querySelectorAll('input[type="checkbox"]');

    this.init();
  }

  init() {
    if (!this.element) return;

    // Event listeners
    this.toggle?.addEventListener("click", (e) => this.handleToggle(e));
    this.checkboxes?.forEach((cb) => {
      cb.addEventListener("change", () => {
        this.updateText();
        applyFilters();
      });
    });

    // Fermer si clic ailleurs
    document.addEventListener("click", (e) => {
      if (!this.element.contains(e.target)) {
        this.close();
      }
    });
  }

  handleToggle(e) {
    e.preventDefault();

    if (this.isMobile()) {
      const wasOpen = this.menu.classList.contains("show");
      this.closeAllDropdowns();
      if (!wasOpen) this.open();
    } else {
      this.menu.classList.toggle("show");
      this.toggle.classList.toggle("active");
    }
  }

  open() {
    this.menu?.classList.add("show");
    this.toggle?.classList.add("active");
  }

  close() {
    this.menu?.classList.remove("show");
    this.toggle?.classList.remove("active");
  }

  updateText() {
    const checked = Array.from(this.checkboxes).filter((cb) => cb.checked);

    if (checked.length === 0) {
      this.textElement.textContent = this.config.defaultText;
    } else if (checked.length === 1) {
      this.textElement.textContent = this.config.singleText
        ? this.config.singleText(checked[0])
        : checked[0].nextElementSibling.textContent;
    } else {
      this.textElement.textContent = this.config.multipleText(checked.length);
    }
  }

  getSelected() {
    return Array.from(this.checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) =>
        this.config.getValue ? this.config.getValue(cb) : cb.value
      );
  }

  reset() {
    this.checkboxes.forEach((cb) => (cb.checked = false));
    this.updateText();
    this.close();
  }

  isMobile() {
    return window.innerWidth <= 768;
  }

  closeAllDropdowns() {
    // Cette méthode sera appelée par l'instance, mais agit globalement
    document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
      menu.classList.remove("show");
    });
    document.querySelectorAll(".dropdown-toggle.active").forEach((toggle) => {
      toggle.classList.remove("active");
    });
  }
}

// Configuration des dropdowns
const dropdownConfigs = {
  ratingFilter: {
    defaultText: "Sélectionner les notes",
    singleText: (cb) => `${cb.value} étoile${cb.value > 1 ? "s" : ""}`,
    multipleText: (count) => `${count} notes sélectionnées`,
    getValue: (cb) => parseInt(cb.value),
  },
  specialtyFilter: {
    defaultText: "Tous les types",
    multipleText: (count) => `${count} types sélectionnés`,
  },
  cityFilter: {
    defaultText: "Toutes les villes",
    multipleText: (count) => `${count} villes sélectionnées`,
  },
};

// Instances des dropdowns
let dropdowns = {};

// Chargement des données
async function loadAndRender() {
  try {
    const response = await fetch("/data/restaurants.json");
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des données");

    restaurants = await response.json();
    filteredRestaurants = [...restaurants];

    populateFilters();
    setupSearchAndFilters();
    initializeDropdowns();
    render(filteredRestaurants);
    initFavorites();
    initDetailButtons();
    updateResultsCount();
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// Initialisation des dropdowns avec la classe générique
function initializeDropdowns() {
  Object.keys(dropdownConfigs).forEach((id) => {
    dropdowns[id] = new DropdownManager(id, dropdownConfigs[id]);
  });
}

// Fonction pour remplir les dropdowns avec les données du JSON
function populateFilters() {
  // Remplir le filtre des spécialités
  const specialtyMenu = document.querySelector(
    "#specialtyFilter .dropdown-menu"
  );
  if (specialtyMenu) {
    const allSpecialties = restaurants.flatMap((r) => r.specialties || []);
    const uniqueSpecialties = [...new Set(allSpecialties)]
      .filter(Boolean)
      .sort();

    specialtyMenu.innerHTML = uniqueSpecialties
      .map(
        (specialty) => `
        <label class="checkbox-item">
          <input type="checkbox" value="${specialty.toLowerCase()}" />
          <span>${specialty.charAt(0).toUpperCase() + specialty.slice(1)}</span>
        </label>
      `
      )
      .join("");
  }

  // Remplir le filtre des villes
  const cityMenu = document.querySelector("#cityFilter .dropdown-menu");
  if (cityMenu) {
    const cities = [
      ...new Set(restaurants.map((r) => r.contact?.city).filter(Boolean)),
    ].sort();

    cityMenu.innerHTML = cities
      .map(
        (city) => `
        <label class="checkbox-item">
          <input type="checkbox" value="${city}" />
          <span>${city}</span>
        </label>
      `
      )
      .join("");
  }
}

// Configuration de la recherche et des filtres (simplifiée)
function setupSearchAndFilters() {
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearch");
  const resetBtn = document.getElementById("resetFilters");

  if (!searchInput || !clearBtn || !resetBtn) {
    console.error("Éléments de filtrage manquants");
    return;
  }

  // Recherche avec debounce
  searchInput.addEventListener(
    "input",
    debounce((e) => {
      const value = e.target.value.trim();
      clearBtn.style.display = value ? "flex" : "none";
      applyFilters();
    }, 300)
  );

  // Bouton clear
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearBtn.style.display = "none";
    searchInput.focus();
    applyFilters();
  });

  // Reset
  resetBtn.addEventListener("click", resetAllFilters);
}

// Application des filtres (simplifiée)
function applyFilters() {
  const searchTerm = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  const selectedRatings = dropdowns.ratingFilter?.getSelected() || [];
  const selectedSpecialties = dropdowns.specialtyFilter?.getSelected() || [];
  const selectedCities = dropdowns.cityFilter?.getSelected() || [];

  filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      !searchTerm ||
      restaurant.name.toLowerCase().includes(searchTerm) ||
      restaurant.specialties?.some((s) =>
        s.toLowerCase().includes(searchTerm)
      ) ||
      restaurant.specialty.toLowerCase().includes(searchTerm);

    const matchesRating =
      selectedRatings.length === 0 ||
      selectedRatings.includes(restaurant.rating);

    const matchesSpecialty =
      selectedSpecialties.length === 0 ||
      restaurant.specialties?.some((s) =>
        selectedSpecialties.includes(s.toLowerCase())
      ) ||
      selectedSpecialties.some((selected) =>
        restaurant.specialty.toLowerCase().includes(selected)
      );

    const matchesCity =
      selectedCities.length === 0 ||
      (restaurant.contact?.city &&
        selectedCities.includes(restaurant.contact.city));

    return matchesSearch && matchesRating && matchesSpecialty && matchesCity;
  });

  render(filteredRestaurants);
  initFavorites();
  initDetailButtons();
  updateResultsCount();
}

// Réinitialisation des filtres
function resetAllFilters() {
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearch");

  if (searchInput) searchInput.value = "";
  if (clearBtn) clearBtn.style.display = "none";

  Object.values(dropdowns).forEach((dropdown) => dropdown?.reset());

  filteredRestaurants = [...restaurants];
  render(filteredRestaurants);
  initFavorites();
  initDetailButtons();
  updateResultsCount();
}

// Affichage des cards (optimisé)
function render(restaurantsToRender = restaurants) {
  const container = document.querySelector(".divCards");
  if (!container) return;

  // Sauvegarder le template au premier appel
  if (!originalTemplate) {
    const templateCard = container.querySelector(".card.template-card");
    if (!templateCard) return;
    originalTemplate = templateCard.outerHTML;
  }

  if (restaurantsToRender.length === 0) {
    container.innerHTML = originalTemplate;
    return;
  }

  const html = restaurantsToRender
    .map((restaurant) =>
      originalTemplate
        .replace(/template-card/g, "")
        .replace(/style="display:\s*none;?"/g, "")
        .replace(/{(\w+)}/g, (match, key) => {
          switch (key) {
            case "id":
              return restaurant.id;
            case "name":
              return restaurant.name;
            case "image":
              return restaurant.image_main;
            case "specialty":
              return restaurant.specialty;
            case "address":
              return restaurant.contact?.address || "";
            case "stars":
              return generateStars(restaurant.rating);
            default:
              return match;
          }
        })
    )
    .join("");

  container.innerHTML = originalTemplate + html;
}

// Fonctions utilitaires
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function generateStars(rating) {
  return Array.from(
    { length: 5 },
    (_, i) => `<i class="fa-${i < rating ? "solid" : "regular"} fa-star"></i>`
  ).join("");
}

function updateResultsCount() {
  const resultsCountElement = document.getElementById("resultsCount");
  if (!resultsCountElement) return;

  const count = filteredRestaurants.length;
  const resultText =
    count === 0
      ? "Aucun restaurant trouvé"
      : count === 1
      ? "1 restaurant trouvé"
      : `${count} restaurants trouvés`;

  resultsCountElement.textContent = resultText;
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
