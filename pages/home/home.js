// Variables déclaratives initiales
let restaurants = [];
let filteredRestaurants = [];
let favorites = JSON.parse(localStorage.getItem("restaurantFavorites") || "[]");

// Initialisation
window.initializePage = function (page) {
  if (page === "home") {
    loadAndRender();
  }
};

// Initialisation automatique si on est sur la page home
document.addEventListener("DOMContentLoaded", function () {
  // Vérifier si on est sur la page home
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get("page") || "home";

  if (page === "home") {
    loadAndRender();
  }
});

// Chargement des données
async function loadAndRender() {
  try {
    const response = await fetch("/data/restaurants.json");
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des données");

    restaurants = await response.json();
    filteredRestaurants = [...restaurants]; // Copie pour les filtres

    populateFilters(); // Nouvelle fonction pour remplir les dropdowns
    setupSearchAndFilters();
    setupSpecialtyDropdown();
    setupCityDropdown();
    render(filteredRestaurants);
    initFavorites();
    initDetailButtons();
    updateResultsCount();
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// Fonction pour remplir les dropdowns avec les données du JSON
function populateFilters() {
  // Remplir le filtre des spécialités
  const specialtyDropdown = document.getElementById("specialtyFilter");
  if (specialtyDropdown) {
    const dropdownMenu = specialtyDropdown.querySelector(".dropdown-menu");
    // Extraire toutes les spécialités individuelles des tableaux specialties
    const allSpecialties = restaurants.flatMap((r) => r.specialties || []);
    const uniqueSpecialties = [...new Set(allSpecialties)].filter(Boolean);
    uniqueSpecialties.sort();

    dropdownMenu.innerHTML = uniqueSpecialties
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
  const cityDropdown = document.getElementById("cityFilter");
  if (cityDropdown) {
    const dropdownMenu = cityDropdown.querySelector(".dropdown-menu");
    const cities = [
      ...new Set(restaurants.map((r) => r.contact?.city).filter(Boolean)),
    ];
    cities.sort();

    dropdownMenu.innerHTML = cities
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

// Configuration de la recherche et des filtres
function setupSearchAndFilters() {
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearch");
  const ratingFilter = document.getElementById("ratingFilter");
  const specialtyFilter = document.getElementById("specialtyFilter");
  const cityFilter = document.getElementById("cityFilter");
  const resetBtn = document.getElementById("resetFilters");

  if (
    !searchInput ||
    !clearBtn ||
    !ratingFilter ||
    !specialtyFilter ||
    !cityFilter ||
    !resetBtn
  ) {
    console.error("Un ou plusieurs éléments de filtrage sont manquants");
    return;
  }

  // Recherche en temps réel avec debounce
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

  // Configuration du système de dropdown avec cases à cocher pour les notes
  setupRatingDropdown();
  // Reset
  resetBtn.addEventListener("click", resetAllFilters);
}

// Fonction debounce pour optimiser la recherche
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

// Configuration du système de dropdown avec cases à cocher pour les notes
function setupRatingDropdown() {
  const ratingDropdown = document.getElementById("ratingFilter");
  const dropdownToggle = ratingDropdown.querySelector(".dropdown-toggle");
  const dropdownMenu = ratingDropdown.querySelector(".dropdown-menu");
  const checkboxes = ratingDropdown.querySelectorAll('input[type="checkbox"]');
  const dropdownText = ratingDropdown.querySelector(".dropdown-text");

  // Gestion du clic sur le bouton dropdown
  dropdownToggle.addEventListener("click", (e) => {
    e.preventDefault();

    // En mobile, fermer tous les autres dropdowns d'abord
    if (isMobile()) {
      const wasOpen = dropdownMenu.classList.contains("show");
      closeAllDropdowns();

      // Si ce dropdown n'était pas ouvert, l'ouvrir
      if (!wasOpen) {
        dropdownMenu.classList.add("show");
        dropdownToggle.classList.add("active");
      }
    } else {
      // En desktop, comportement normal
      dropdownMenu.classList.toggle("show");
      dropdownToggle.classList.toggle("active");
    }
  });

  // Fermer le dropdown si on clique ailleurs
  document.addEventListener("click", (e) => {
    if (!ratingDropdown.contains(e.target)) {
      dropdownMenu.classList.remove("show");
      dropdownToggle.classList.remove("active");
    }
  });

  // Gestion des changements de checkboxes
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateDropdownText();
      applyFilters();
    });
  });

  // Fonction pour mettre à jour le texte du dropdown
  function updateDropdownText() {
    const checkedBoxes = Array.from(checkboxes).filter((cb) => cb.checked);
    if (checkedBoxes.length === 0) {
      dropdownText.textContent = "Sélectionner les notes";
    } else if (checkedBoxes.length === 1) {
      dropdownText.textContent = `${checkedBoxes[0].value} étoile${
        checkedBoxes[0].value > 1 ? "s" : ""
      }`;
    } else {
      dropdownText.textContent = `${checkedBoxes.length} notes sélectionnées`;
    }
  }

  // Fonction pour obtenir les notes sélectionnées
  ratingDropdown.getSelectedRatings = () => {
    return Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => parseInt(cb.value));
  };

  // Fonction pour réinitialiser les checkboxes
  ratingDropdown.resetRatings = () => {
    checkboxes.forEach((cb) => (cb.checked = false));
    updateDropdownText();
    dropdownMenu.classList.remove("show");
    dropdownToggle.classList.remove("active");
  };
}

// Configuration du système de dropdown avec cases à cocher pour les spécialités
function setupSpecialtyDropdown() {
  const specialtyDropdown = document.getElementById("specialtyFilter");
  const dropdownToggle = specialtyDropdown.querySelector(".dropdown-toggle");
  const dropdownMenu = specialtyDropdown.querySelector(".dropdown-menu");
  const checkboxes = specialtyDropdown.querySelectorAll(
    'input[type="checkbox"]'
  );
  const dropdownText = specialtyDropdown.querySelector(".dropdown-text");

  // Gestion du clic sur le bouton dropdown
  dropdownToggle.addEventListener("click", (e) => {
    e.preventDefault();

    // En mobile, fermer tous les autres dropdowns d'abord
    if (isMobile()) {
      const wasOpen = dropdownMenu.classList.contains("show");
      closeAllDropdowns();

      // Si ce dropdown n'était pas ouvert, l'ouvrir
      if (!wasOpen) {
        dropdownMenu.classList.add("show");
        dropdownToggle.classList.add("active");
      }
    } else {
      // En desktop, comportement normal
      dropdownMenu.classList.toggle("show");
      dropdownToggle.classList.toggle("active");
    }
  });

  // Fermer le dropdown si on clique ailleurs
  document.addEventListener("click", (e) => {
    if (!specialtyDropdown.contains(e.target)) {
      dropdownMenu.classList.remove("show");
      dropdownToggle.classList.remove("active");
    }
  });

  // Gestion des changements de checkboxes
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateDropdownText();
      applyFilters();
    });
  });

  // Fonction pour mettre à jour le texte du dropdown
  function updateDropdownText() {
    const checkedBoxes = Array.from(checkboxes).filter((cb) => cb.checked);
    if (checkedBoxes.length === 0) {
      dropdownText.textContent = "Tous les types";
    } else if (checkedBoxes.length === 1) {
      dropdownText.textContent = checkedBoxes[0].nextElementSibling.textContent;
    } else {
      dropdownText.textContent = `${checkedBoxes.length} types sélectionnés`;
    }
  }

  // Fonction pour obtenir les spécialités sélectionnées
  specialtyDropdown.getSelectedSpecialties = () => {
    return Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
  };

  // Fonction pour réinitialiser les checkboxes
  specialtyDropdown.resetSpecialties = () => {
    checkboxes.forEach((cb) => (cb.checked = false));
    updateDropdownText();
    dropdownMenu.classList.remove("show");
    dropdownToggle.classList.remove("active");
  };
}

// Configuration du système de dropdown avec cases à cocher pour les villes
function setupCityDropdown() {
  const cityDropdown = document.getElementById("cityFilter");
  const dropdownToggle = cityDropdown.querySelector(".dropdown-toggle");
  const dropdownMenu = cityDropdown.querySelector(".dropdown-menu");
  const checkboxes = cityDropdown.querySelectorAll('input[type="checkbox"]');
  const dropdownText = cityDropdown.querySelector(".dropdown-text");

  // Gestion du clic sur le bouton dropdown
  dropdownToggle.addEventListener("click", (e) => {
    e.preventDefault();

    // En mobile, fermer tous les autres dropdowns d'abord
    if (isMobile()) {
      const wasOpen = dropdownMenu.classList.contains("show");
      closeAllDropdowns();

      // Si ce dropdown n'était pas ouvert, l'ouvrir
      if (!wasOpen) {
        dropdownMenu.classList.add("show");
        dropdownToggle.classList.add("active");
      }
    } else {
      // En desktop, comportement normal
      dropdownMenu.classList.toggle("show");
      dropdownToggle.classList.toggle("active");
    }
  });

  // Fermer le dropdown si on clique ailleurs
  document.addEventListener("click", (e) => {
    if (!cityDropdown.contains(e.target)) {
      dropdownMenu.classList.remove("show");
      dropdownToggle.classList.remove("active");
    }
  });

  // Gestion des changements de checkboxes
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateDropdownText();
      applyFilters();
    });
  });

  // Fonction pour mettre à jour le texte du dropdown
  function updateDropdownText() {
    const checkedBoxes = Array.from(checkboxes).filter((cb) => cb.checked);
    if (checkedBoxes.length === 0) {
      dropdownText.textContent = "Toutes les villes";
    } else if (checkedBoxes.length === 1) {
      dropdownText.textContent = checkedBoxes[0].nextElementSibling.textContent;
    } else {
      dropdownText.textContent = `${checkedBoxes.length} villes sélectionnées`;
    }
  }

  // Fonction pour obtenir les villes sélectionnées
  cityDropdown.getSelectedCities = () => {
    return Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
  };

  // Fonction pour réinitialiser les checkboxes
  cityDropdown.resetCities = () => {
    checkboxes.forEach((cb) => (cb.checked = false));
    updateDropdownText();
    dropdownMenu.classList.remove("show");
    dropdownToggle.classList.remove("active");
  };
}

// Fonction utilitaire pour fermer tous les dropdowns
function closeAllDropdowns() {
  const dropdowns = ["ratingFilter", "specialtyFilter", "cityFilter"];
  dropdowns.forEach((id) => {
    const dropdown = document.getElementById(id);
    if (dropdown) {
      const menu = dropdown.querySelector(".dropdown-menu");
      const toggle = dropdown.querySelector(".dropdown-toggle");
      if (menu && toggle) {
        menu.classList.remove("show");
        toggle.classList.remove("active");
      }
    }
  });
}

// Fonction pour vérifier si on est en mode mobile
function isMobile() {
  return window.innerWidth <= 768;
}

// Application des filtres
function applyFilters() {
  const searchTerm = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  const ratingFilter = document.getElementById("ratingFilter");
  const selectedRatings = ratingFilter.getSelectedRatings
    ? ratingFilter.getSelectedRatings()
    : [];
  const specialtyFilter = document.getElementById("specialtyFilter");
  const selectedSpecialties = specialtyFilter.getSelectedSpecialties
    ? specialtyFilter.getSelectedSpecialties()
    : [];
  const cityFilter = document.getElementById("cityFilter");
  const selectedCities = cityFilter.getSelectedCities
    ? cityFilter.getSelectedCities()
    : [];

  filteredRestaurants = restaurants.filter((restaurant) => {
    // Recherche par nom ou spécialités (dans le tableau specialties)
    const matchesSearch =
      !searchTerm ||
      restaurant.name.toLowerCase().includes(searchTerm) ||
      (restaurant.specialties &&
        restaurant.specialties.some((s) =>
          s.toLowerCase().includes(searchTerm)
        )) ||
      restaurant.specialty.toLowerCase().includes(searchTerm);

    // Filtre par note (système de checkboxes multiples)
    const matchesRating =
      selectedRatings.length === 0 ||
      selectedRatings.includes(restaurant.rating);

    // Filtre par spécialité (système de checkboxes multiples)
    const matchesSpecialty =
      selectedSpecialties.length === 0 ||
      (restaurant.specialties &&
        restaurant.specialties.some((s) =>
          selectedSpecialties.includes(s.toLowerCase())
        )) ||
      selectedSpecialties.some((selected) =>
        restaurant.specialty.toLowerCase().includes(selected)
      );

    // Filtre par ville (système de checkboxes multiples)
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
  showNoResults(filteredRestaurants.length === 0);
}

// Réinitialisation des filtres
function resetAllFilters() {
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearch");
  const ratingFilter = document.getElementById("ratingFilter");
  const specialtyFilter = document.getElementById("specialtyFilter");
  const cityFilter = document.getElementById("cityFilter");

  if (searchInput) searchInput.value = "";
  if (clearBtn) clearBtn.style.display = "none";
  if (ratingFilter && ratingFilter.resetRatings) ratingFilter.resetRatings();
  if (specialtyFilter && specialtyFilter.resetSpecialties)
    specialtyFilter.resetSpecialties();
  if (cityFilter && cityFilter.resetCities) cityFilter.resetCities();

  filteredRestaurants = [...restaurants];
  render(filteredRestaurants);
  initFavorites();
  initDetailButtons();
  updateResultsCount();
  showNoResults(false);
}

// Fonction globale pour réinitialiser (appelée depuis le HTML)
window.resetAllFilters = resetAllFilters;

// Mise à jour du compteur de résultats
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

// Affichage du message "aucun résultat"
function showNoResults(show) {
  const noResults = document.getElementById("noResults");
  const divCards = document.querySelector(".divCards");

  if (noResults && divCards) {
    if (show) {
      noResults.style.display = "block";
      divCards.style.display = "none";
    } else {
      noResults.style.display = "none";
      divCards.style.display = "flex";
    }
  }
}

// Variable globale pour stocker le template original
let originalTemplate = null;

// Affichage des cards (modifié pour accepter un tableau filtré)
function render(restaurantsToRender = restaurants) {
  const container = document.querySelector(".divCards");

  if (!container) {
    console.error("Container non trouvé");
    return;
  }

  // Sauvegarder le template original au premier appel
  if (!originalTemplate) {
    const templateCard = container.querySelector(".card.template-card");
    if (!templateCard) {
      console.error("Template non trouvé");
      return;
    }
    originalTemplate = templateCard.outerHTML;
  }

  // Si aucun restaurant à afficher
  if (restaurantsToRender.length === 0) {
    container.innerHTML = originalTemplate; // Garder seulement le template
    return;
  }

  // Génération des cartes avec le template original
  const html = restaurantsToRender
    .map((restaurant) =>
      originalTemplate
        .replace(/template-card/g, "") // Retirer la classe template
        .replace(/style="display:\s*none;?"/g, "") // Retirer le style display:none du template
        .replace(/style="display:\s*none"/g, "") // Sans point-virgule aussi
        .replace(/{id}/g, restaurant.id)
        .replace(/{name}/g, restaurant.name)
        .replace(/{image}/g, restaurant.image_main)
        .replace(/{specialty}/g, restaurant.specialty)
        .replace(/{address}/g, restaurant.contact?.address || "")
        .replace(/{stars}/g, generateStars(restaurant.rating))
    )
    .join("");

  // Ajouter le template caché + les cartes générées
  container.innerHTML = originalTemplate + html;
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
