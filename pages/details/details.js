// === VARIABLES GLOBALES ===
let restaurants = [];
let restaurant = {};
let currentSlide = 0;
let autoSlideInterval = null;

// === INITIALISATION ===
async function loadRestaurantsData() {
  const response = await fetch("/data/restaurants.json");
  const data = await response.json();
  restaurants = data;
}

function initializeAllFeatures() {
  loadRestaurantsData().then(() => {
    initializeRestaurantData();
  });
}

function initializeRestaurantData() {
  const params = new URLSearchParams(window.location.search);
  const restaurantId = params.get("id") || "1";
  let restaurantIdNum = Number(restaurantId);
  if (isNaN(restaurantIdNum)) restaurantIdNum = 1;

  restaurant = restaurants.find((r) => r.id === restaurantIdNum);
  if (!restaurant) return;

  renderAll();
  setupEventListeners();
}

// Compatibilité avec le système de routing
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAllFeatures);
} else {
  initializeAllFeatures();
}

// === RENDU PRINCIPAL ===
function renderAll() {
  renderCarousel();
  renderRestaurantInfo();
  renderMenu();
  renderTestimonials();
  renderContact();
}

// === CAROUSEL ===
function renderCarousel() {
  const carouselContainer = document.getElementById("carouselContainer");
  if (!carouselContainer || !Array.isArray(restaurant.carousel)) return;

  carouselContainer.innerHTML =
    restaurant.carousel
      .map(
        (img, i) =>
          `<img class="imageSlides${
            i === 0 ? " visible" : ""
          }" src="${img}" alt="Image ${i + 1}" />`
      )
      .join("") +
    `
    <span id="leftArrow" class="slideshowArrow">&#8249;</span>
    <span id="rightArrow" class="slideshowArrow">&#8250;</span>
    <div class="slideshowCircles">
      ${restaurant.carousel
        .map(
          (_, i) =>
            `<span class="circle${
              i === 0 ? " dot" : ""
            }" data-index="${i}"></span>`
        )
        .join("")}
    </div>
    `;

  setupCarouselEvents();
  startAutoSlide();
}

function setupCarouselEvents() {
  const images = Array.from(document.querySelectorAll(".imageSlides"));
  const leftArrow = document.querySelector("#leftArrow");
  const rightArrow = document.querySelector("#rightArrow");
  const circles = Array.from(document.querySelectorAll(".circle"));
  const carouselContainer = document.getElementById("carouselContainer");

  if (!images.length) return;

  function updateCircles(idx, circles) {
    circles.forEach((c, i) => c.classList.toggle("dot", i === idx));
  }

  function goToSlide(idx) {
    currentSlide = (idx + images.length) % images.length;
    showSlide(currentSlide, images);
    updateCircles(currentSlide, circles);
  }

  if (leftArrow) {
    leftArrow.onclick = () => {
      goToSlide(currentSlide - 1);
      startAutoSlide();
    };
  }

  if (rightArrow) {
    rightArrow.onclick = () => {
      goToSlide(currentSlide + 1);
      startAutoSlide();
    };
  }

  circles.forEach((circle, i) => {
    circle.onclick = () => {
      goToSlide(i);
      startAutoSlide();
    };
  });

  // Pause auto-défilement au survol
  if (carouselContainer) {
    carouselContainer.onmouseenter = stopAutoSlide;
    carouselContainer.onmouseleave = startAutoSlide;
  }
}

function showSlide(slideIndex, images) {
  images.forEach((img, i) => {
    img.classList.toggle("visible", i === slideIndex);
  });
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlideInterval = setInterval(() => {
    const images = Array.from(document.querySelectorAll(".imageSlides"));
    const circles = Array.from(document.querySelectorAll(".circle"));
    if (images.length) {
      currentSlide = (currentSlide + 1) % images.length;
      showSlide(currentSlide, images);
      circles.forEach((c, i) => c.classList.toggle("dot", i === currentSlide));
    }
  }, 4000);
}

function stopAutoSlide() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
}

// === INFORMATIONS RESTAURANT ===
function renderRestaurantInfo() {
  // ===== PRÉSENTATION =====
  const nameSpan = document.getElementById("restaurantName");
  if (nameSpan) nameSpan.textContent = restaurant.name;

  const descP = document.getElementById("restaurantDescription");
  if (descP) descP.textContent = restaurant.description;

  // ===== POPUP CONTACT =====
  const phoneStrong = document.getElementById("contactPhone");
  if (phoneStrong) phoneStrong.textContent = restaurant.contact?.phone || "";

  const openingP = document.getElementById("contactOpening");
  if (openingP) {
    const span = openingP.querySelector("span");
    if (span) span.textContent = restaurant.contact?.openingHours || "";
  }
}

// === MENU ===
function renderMenu() {
  const menuCategories = document.getElementById("menuCategories");
  const menuDetails = document.getElementById("menuDetails");

  if (!menuCategories || !Array.isArray(restaurant.menu)) return;

  // Génère les catégories
  menuCategories.innerHTML = restaurant.menu
    .map(
      (cat, i) => `
      <div class="menuCategory${i === 0 ? " active" : ""}" data-index="${i}">
        <img src="${cat.image || ""}" alt="${cat.name || ""}" />
        <h3>${cat.name || ""}</h3>
      </div>
    `
    )
    .join("");

  // Affiche la première catégorie par défaut
  let activeMenuIdx = 0;
  renderMenuDetails(activeMenuIdx);

  // Ajoute les listeners pour le clic sur chaque catégorie
  Array.from(menuCategories.children).forEach((catDiv, i) => {
    catDiv.addEventListener("click", () => {
      // Change l'état actif visuel
      Array.from(menuCategories.children).forEach((el) =>
        el.classList.remove("active")
      );
      catDiv.classList.add("active");

      // Affiche le détail correspondant
      renderMenuDetails(i);
      activeMenuIdx = i;
    });
  });
}

function renderMenuDetails(activeIdx) {
  const menuDetails = document.getElementById("menuDetails");

  if (!restaurant.menu || !Array.isArray(restaurant.menu)) {
    console.error("Menu data is missing or invalid");
    if (menuDetails) {
      menuDetails.innerHTML =
        '<div class="menuCategoryDetails"><p>Erreur: données du menu manquantes</p></div>';
    }
    return;
  }

  if (activeIdx < 0 || activeIdx >= restaurant.menu.length) {
    console.error("Invalid menu index:", activeIdx);
    return;
  }

  const category = restaurant.menu[activeIdx];

  if (!category) {
    console.error("Category not found for index:", activeIdx);
    return;
  }

  let itemsHTML = "";
  if (Array.isArray(category.items) && category.items.length > 0) {
    itemsHTML = category.items
      .map((item) => {
        const hasDescription =
          item.description && item.description.trim() !== "";
        if (hasDescription) {
          return `
            <div class="menu-item has-description">
              <h3>${item.name || "Plat non spécifié"}</h3>
              <span class="price">${
                item.price ? item.price + "€" : "Prix sur demande"
              }</span>
              <p class="item-description">${item.description}</p>
            </div>
          `;
        } else {
          return `
            <div class="menu-item">
              <h3>${item.name || "Plat non spécifié"}</h3>
              <span class="price">${
                item.price ? item.price + "€" : "Prix sur demande"
              }</span>
            </div>
          `;
        }
      })
      .join("");
  } else {
    itemsHTML = `
      <div class="menu-item no-items">
        <h3>Menu en préparation</h3>
        <p class="item-description">Notre chef prépare actuellement une sélection exceptionnelle pour cette catégorie.</p>
        <span class="price">Prix sur demande</span>
      </div>
    `;
  }

  const finalHTML = `
    <div class="menuCategoryDetails active" id="menuDetailsCat${activeIdx + 1}">
      <div class="menu-header">
        <h1>${category.name || "Catégorie sans nom"}</h1>
      </div>
      <div class="menu-items-grid">
        ${itemsHTML}
      </div>
    </div>
  `;

  if (menuDetails) {
    menuDetails.innerHTML = finalHTML;
  }
}


// === TÉMOIGNAGES ===
function renderTestimonials() {
  const commentsContainer = document.querySelector(".comments");
  if (commentsContainer && restaurant.testimonials) {
    commentsContainer.innerHTML = restaurant.testimonials
      .map(
        (review) => `
      <div class="cardComment">
        <p>"${review.text || ""}"</p>
        <div class="avatarComment">
          <img src="${review.avatar || ""}" alt="Avatar">
          <p>${review.author || ""}</p>
        </div>
      </div>
    `
      )
      .join("");
  }
}

// === CONTACT ===
function renderContact() {
  // ===== MAP ET ADRESSE =====
  const mapIframe = document.getElementById("mapIframe");
  if (mapIframe) mapIframe.src = restaurant.contact?.mapUrl || "";

  // Nom du restaurant dans la carte de contact
  const restaurantNameMap = document.getElementById("restaurantNameMap");
  if (restaurantNameMap) restaurantNameMap.textContent = restaurant.name;

  // Adresse (sans le téléphone)
  const addressBlock = document.getElementById("addressBlock");
  if (addressBlock) {
    addressBlock.innerHTML = `${restaurant.contact?.address || ""}<br />${
      restaurant.contact?.city || ""
    }`;
  }

  // Numéro de téléphone dans sa propre section
  const phoneNumber = document.getElementById("phoneNumber");
  if (phoneNumber) phoneNumber.textContent = restaurant.contact?.phone || "";

  // Horaires d'ouverture complets
  const openingHours = document.getElementById("openingHours");
  if (openingHours)
    openingHours.textContent = restaurant.contact?.openingHours || "";

}


// === MODAL ===
function setupEventListeners() {
  const openBtn = document.getElementById("openReservationModal");
  const closeBtn = document.getElementById("closeReservationModal");
  const modal = document.getElementById("reservationModal");
  const phoneLink = document.getElementById("contactPhone");

  if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
      modal.classList.add("show");
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("show");
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
      }
    });
  }

  // Fermer avec Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("show")) {
      modal.classList.remove("show");
    }
  });

  // Lien téléphone cliquable
  if (phoneLink) {
    phoneLink.addEventListener("click", () => {
      if (restaurant.contact?.phone) {
        window.location.href = `tel:${restaurant.contact.phone.replace(
          /\s/g,
          ""
        )}`;
      }
    });
  }
}
