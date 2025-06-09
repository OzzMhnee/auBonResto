let restaurants = [];
let currentSlide = 0;

function loadRestaurantsData() {
  return fetch("/data/restaurants.json")
    .then((response) => response.json())
    .then((data) => {
      restaurants = data;
    });
}

function showSlide(slideIndex, images) {
  images.forEach((img, i) => {
    img.classList.toggle("visible", i === slideIndex);
  });
}
let autoSlideInterval = null;

function initializeCarousel(restaurant) {
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

  const images = Array.from(carouselContainer.querySelectorAll(".imageSlides"));
  const leftArrow = carouselContainer.querySelector("#leftArrow");
  const rightArrow = carouselContainer.querySelector("#rightArrow");
  const circles = Array.from(carouselContainer.querySelectorAll(".circle"));

  let slide = 0;
  showSlide(slide, images);
  updateCircles(slide, circles);

  function updateCircles(idx, circles) {
    circles.forEach((c, i) => c.classList.toggle("dot", i === idx));
  }

  function goToSlide(idx) {
    slide = (idx + images.length) % images.length;
    showSlide(slide, images);
    updateCircles(slide, circles);
  }

  // Auto défilement
  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
      goToSlide(slide + 1);
    }, 4000); // 4 secondes
  }
  function stopAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
  }

  if (leftArrow)
    leftArrow.onclick = () => {
      goToSlide(slide - 1);
      startAutoSlide();
    };
  if (rightArrow)
    rightArrow.onclick = () => {
      goToSlide(slide + 1);
      startAutoSlide();
    };
  circles.forEach((circle, i) => {
    circle.onclick = () => {
      goToSlide(i);
      startAutoSlide();
    };
  });

  // Pause auto-défilement au survol
  carouselContainer.onmouseenter = stopAutoSlide;
  carouselContainer.onmouseleave = startAutoSlide;

  startAutoSlide();
}

function initializeRestaurantData() {
  const params = new URLSearchParams(window.location.search);
  const restaurantId = params.get("id") || "1";
  let restaurantIdNum = Number(restaurantId);
  if (isNaN(restaurantIdNum)) restaurantIdNum = 1;

  const restaurant = restaurants.find((r) => r.id === restaurantIdNum);
  if (!restaurant) return;

  // ===== CAROUSEL DYNAMIQUE =====
  initializeCarousel(restaurant);

  // ===== LOGOS =====
  const logoImg = document.getElementById("logoImg");
  if (logoImg) logoImg.src = restaurant.logo;

  const logoSiteImg = document.getElementById("logoSiteImg");
  if (logoSiteImg) logoSiteImg.src = "/images/general/logoSite.png";

  // ===== PRÉSENTATION =====
  const nameSpan = document.getElementById("restaurantName");
  if (nameSpan) nameSpan.textContent = restaurant.name;

  const descP = document.getElementById("restaurantDescription");
  if (descP) descP.textContent = restaurant.description;

  // ===== POPUP CONTACT =====
  const phoneStrong = document.getElementById("contactPhone");
  if (phoneStrong) phoneStrong.textContent = restaurant.contact?.phone || "";

  const openingP = document.getElementById("contactOpening");
  if (openingP) openingP.textContent = restaurant.contact?.openingHours || "";

  // ===== MENU CATÉGORIES DYNAMIQUES =====
  const menuCategories = document.getElementById("menuCategories");
  const menuDetails = document.getElementById("menuDetails");
  if (menuCategories && Array.isArray(restaurant.menu)) {
    // Génère les catégories avec le nouveau style
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

    // Génère les détails avec le style ardoise simplifié
    function renderMenuDetails(activeIdx) {
      console.log("=== DEBUG renderMenuDetails ===");
      console.log("activeIdx:", activeIdx);
      console.log("restaurant.menu length:", restaurant.menu?.length);
      console.log("restaurant.menu:", restaurant.menu);

      if (!restaurant.menu || !Array.isArray(restaurant.menu)) {
        console.error("Menu data is missing or invalid");
        menuDetails.innerHTML =
          '<div class="menuCategoryDetails"><p>Erreur: données du menu manquantes</p></div>';
        return;
      }

      if (activeIdx < 0 || activeIdx >= restaurant.menu.length) {
        console.error("Invalid menu index:", activeIdx);
        return;
      }

      const category = restaurant.menu[activeIdx];
      console.log(`Rendering category ${activeIdx}:`, category);
      console.log("Category name:", category?.name);
      console.log("Items array:", category?.items);
      console.log("Items length:", category?.items?.length);

      if (!category) {
        console.error("Category not found for index:", activeIdx);
        return;
      }

      let itemsHTML = "";
      if (Array.isArray(category.items) && category.items.length > 0) {
        console.log("Processing", category.items.length, "items");
        itemsHTML = category.items
          .map((item, itemIndex) => {
            console.log(`Processing item ${itemIndex}:`, item);
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
        console.log("No items found, showing placeholder");
        itemsHTML = `
          <div class="menu-item no-items">
            <h3>Menu en préparation</h3>
            <p class="item-description">Notre chef prépare actuellement une sélection exceptionnelle pour cette catégorie.</p>
            <span class="price">Prix sur demande</span>
          </div>
        `;
      }

      const finalHTML = `
        <div class="menuCategoryDetails active" id="menuDetailsCat${
          activeIdx + 1
        }">
          <div class="menu-header">
            <h1>${category.name || "Catégorie sans nom"}</h1>
          </div>
          <div class="menu-items-grid">
            ${itemsHTML}
          </div>
        </div>
      `;

      console.log("Setting menuDetails innerHTML");
      menuDetails.innerHTML = finalHTML;
      console.log(
        "Menu details rendered successfully for category:",
        category.name
      );
      console.log("=== END DEBUG ===");
    }

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

        // Affiche le détail correspondant avec animation
        renderMenuDetails(i);
        activeMenuIdx = i;
      });

      // Ajouter les effets hover améliorés
      catDiv.addEventListener("mouseenter", () => {
        if (!catDiv.classList.contains("active")) {
          catDiv.style.transform = "translateY(-5px)";
        }
      });

      catDiv.addEventListener("mouseleave", () => {
        if (!catDiv.classList.contains("active")) {
          catDiv.style.transform = "translateY(0)";
        }
      });
    });
  }

  // ===== SERVICES AMÉLIORÉS =====
  renderMoreInfo(restaurant.moreInfo);

  // ===== AVIS =====
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

  // ===== MAP ET ADRESSE =====
  const mapIframe = document.getElementById("mapIframe");
  if (mapIframe) mapIframe.src = restaurant.contact?.mapUrl || "";

  // Logo dans la carte de contact
  const logoMapImg = document.getElementById("logoMapImg");
  if (logoMapImg) logoMapImg.src = restaurant.logo;

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

  // Initialiser les améliorations visuelles
  initializeMinimalEnhancements(restaurant);

  // Initialiser la modale améliorée
  initializeModalSystem(restaurant);
}

// ===== SERVICES AMÉLIORÉS =====
function renderMoreInfo(moreInfo) {
  const moreInfoSection = document.getElementById("moreInfoSection");
  if (!moreInfoSection || !moreInfo || typeof moreInfo !== "object") return;

  // Trouve le conteneur des services dans la nouvelle structure
  let servicesGrid = moreInfoSection.querySelector(".services-grid");

  // Si pas de structure moderne, crée la structure complète
  if (!servicesGrid) {
    moreInfoSection.innerHTML = `
      <div class="section-header">
        <h2>Nos Services</h2>
        <p class="section-subtitle">Une expérience complète pour tous vos besoins</p>
      </div>
      
      <div class="services-container">
        <div class="services-grid">
        </div>
      </div>
    `;
    servicesGrid = moreInfoSection.querySelector(".services-grid");
  }

  // Fonction pour déterminer l'icône selon le type de service
  function getServiceIcon(key) {
    const iconMap = {
      traiteur: "traiteur",
      vins: "vins",
      vin: "vins",
      wine: "vins",
      catering: "traiteur",
    };
    return iconMap[key.toLowerCase()] || "default";
  }

  // Fonction pour formater le titre
  function formatServiceTitle(key, part) {
    if (part.label) return part.label;

    const titleMap = {
      traiteur: "Service Traiteur",
      vins: "Cave à Vins",
      vin: "Cave à Vins",
      wine: "Cave à Vins",
      catering: "Service Traiteur",
    };

    return (
      titleMap[key.toLowerCase()] || key.charAt(0).toUpperCase() + key.slice(1)
    );
  }

  // Génère les cartes de services
  const servicesHTML = Object.entries(moreInfo)
    .map(([key, part], index) => {
      const iconClass = getServiceIcon(key);
      const title = formatServiceTitle(key, part);
      const hasImage = part.image && part.image.trim() !== "";

      return `
        <div class="service-card ${
          !hasImage ? "no-image" : ""
        }" style="animation-delay: ${index * 0.2}s">
          ${
            hasImage
              ? `
            <div class="service-image">
              <img src="${part.image}" alt="${title}" />
            </div>
          `
              : `
            <div class="service-icon ${iconClass}"></div>
          `
          }
          <div class="service-content">
            <h3 class="service-title">${title}</h3>
            <p class="service-description">${part.text || ""}</p>
          </div>
        </div>
      `;
    })
    .join("");

  servicesGrid.innerHTML = servicesHTML;

  // Ajouter l'animation d'apparition pour les services
  setTimeout(() => {
    initializeServicesAnimations();
  }, 100);
}

// Animation d'apparition simplifiée des services au scroll
function initializeServicesAnimations() {
  const serviceCards = document.querySelectorAll(".service-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  serviceCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    observer.observe(card);
  });
}

// ========== AMÉLIORATIONS VISUELLES ==========

// Animation d'apparition simplifiée des cartes de commentaires
function animateCommentsOnScroll() {
  const comments = document.querySelectorAll(".cardComment");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  comments.forEach((comment) => {
    comment.style.opacity = "0";
    comment.style.transform = "translateY(15px)";
    comment.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    observer.observe(comment);
  });
}

// Animation simplifiée pour la section map
function animateMapSection() {
  const mapSection = document.querySelector(".sectMaps");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  if (mapSection) {
    mapSection.style.opacity = "0";
    mapSection.style.transform = "translateY(20px)";
    mapSection.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(mapSection);
  }
}

// Configuration des liens des réseaux sociaux
function setupSocialLinks(restaurantName) {
  const socialLinks = {
    facebook: `https://www.facebook.com/search/top/?q=${encodeURIComponent(
      restaurantName
    )}`,
    instagram: `https://www.instagram.com/explore/tags/${encodeURIComponent(
      restaurantName.replace(/\s+/g, "").toLowerCase()
    )}/`,
    linkedin: `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(
      restaurantName
    )}`,
    youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(
      restaurantName
    )}`,
  };

  Object.keys(socialLinks).forEach((platform) => {
    const socialIcon = document.querySelector(`.social-icon.${platform}`);
    if (socialIcon) {
      socialIcon.href = socialLinks[platform];
      socialIcon.target = "_blank";
      socialIcon.rel = "noopener noreferrer";
    }
  });
}

// Effet hover subtil simplifié pour les cartes de commentaires
function setupCommentHovers() {
  const comments = document.querySelectorAll(".cardComment");

  comments.forEach((comment) => {
    comment.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px)";
    });

    comment.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });
}

// Minimal styles - removed complex animations
function addMinimalAnimationStyles() {
  // Function kept for compatibility but no longer adds complex animations
}

// ========== SYSTÈME DE MODAL SIMPLIFIÉ ==========

// Initialiser la modal avec des sélecteurs cohérents
function initializeModalSystem(restaurant) {
  const modalOverlay = document.getElementById("overlay");
  const closeModalBtn = document.getElementById("close");
  const openModalBtn = document.getElementById("open");
  const modalContent = document.getElementById("info");

  // Fermer la modal en cliquant sur l'overlay
  if (modalOverlay) {
    modalOverlay.addEventListener("click", function () {
      if (closeModalBtn) {
        closeModalBtn.checked = true;
      }
    });
  }

  // Empêcher la fermeture en cliquant sur le contenu de la modal
  if (modalContent) {
    modalContent.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  // Fermer avec la touche Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && openModalBtn && openModalBtn.checked) {
      if (closeModalBtn) {
        closeModalBtn.checked = true;
      }
    }
  });

  // Remplir les données de contact si disponibles
  if (restaurant) {
    populateContactInfo(restaurant);
  }
}

// Remplir les informations de contact dans la modal
function populateContactInfo(restaurant) {
  const phoneElement = document.getElementById("contactPhone");
  const hoursElement = document.getElementById("contactOpening");

  if (phoneElement && restaurant.contact?.phone) {
    // Simplement remplacer le texte du numéro
    phoneElement.textContent = formatPhoneNumber(restaurant.contact.phone);

    // Rendre le numéro cliquable
    phoneElement.addEventListener("click", function () {
      window.location.href = `tel:${restaurant.contact.phone.replace(
        /\s/g,
        ""
      )}`;
    });
  }

  if (hoursElement && restaurant.contact?.openingHours) {
    // Nettoyer l'élément et ajouter les horaires
    hoursElement.innerHTML = `
      <div class="contact-icon"></div>
      <span>${restaurant.contact.openingHours}</span>
    `;
  }
}

// Formater le numéro de téléphone avec des espaces
function formatPhoneNumber(phone) {
  return phone.replace(/(\d{2})(?=\d)/g, "$1 ");
}

// Fonction principale d'initialisation des améliorations
function initializeMinimalEnhancements(restaurant) {
  // Attendre que les éléments soient chargés
  setTimeout(() => {
    animateCommentsOnScroll();
    animateMapSection();
    setupCommentHovers();
    addMinimalAnimationStyles();

    // Initialiser les animations des services
    initializeServicesAnimations();

    if (restaurant && restaurant.name) {
      setupSocialLinks(restaurant.name);
    }
  }, 300);
}

// ========== INITIALISATION ==========
function initializeAllFeatures() {
  loadRestaurantsData().then(() => {
    initializeRestaurantData();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAllFeatures);
} else {
  initializeAllFeatures();
}
