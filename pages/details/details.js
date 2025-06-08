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

  carouselContainer.innerHTML = restaurant.carousel
    .map(
      (img, i) =>
        `<img class="imageSlides${i === 0 ? " visible" : ""}" src="${img}" alt="Image ${i + 1}" />`
    )
    .join("") +
    `
    <span id="leftArrow" class="slideshowArrow">&#8249;</span>
    <span id="rightArrow" class="slideshowArrow">&#8250;</span>
    <div class="slideshowCircles">
      ${restaurant.carousel
        .map(
          (_, i) =>
            `<span class="circle${i === 0 ? " dot" : ""}" data-index="${i}"></span>`
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
    circles.forEach((c, i) =>
      c.classList.toggle("dot", i === idx)
    );
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

  if (leftArrow) leftArrow.onclick = () => { goToSlide(slide - 1); startAutoSlide(); };
  if (rightArrow) rightArrow.onclick = () => { goToSlide(slide + 1); startAutoSlide(); };
  circles.forEach((circle, i) => {
    circle.onclick = () => { goToSlide(i); startAutoSlide(); };
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
  renderMoreInfo(restaurant.moreInfo);

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
 // ===== MENU CATÉGORIES DYNAMIQUES =====
  const menuCategories = document.getElementById("menuCategories");
  const menuDetails = document.getElementById("menuDetails");
  if (menuCategories && Array.isArray(restaurant.menu)) {
    // Génère les catégories
    menuCategories.innerHTML = restaurant.menu
      .map(
        (cat, i) => `
        <div class="menuCategory${i === 0 ? " active" : ""}" data-index="${i}">
          <img src="${cat.image || ""}" alt="${cat.name || ""}" />
          <h2>${cat.name || ""}</h2>
        </div>
      `
      )
      .join("");

    // Génère les détails (un seul affiché)
    function renderMenuDetails(activeIdx) {
      menuDetails.innerHTML = `
        <div class="menuCategoryDetails active">
          <h1>${restaurant.menu[activeIdx].name || ""}</h1>
          <div class="menu-items">
            ${
              Array.isArray(restaurant.menu[activeIdx].items)
                ? restaurant.menu[activeIdx].items
                    .map(
                      (item) =>
                        `<div class="menu-item"><span>${item.name || ""}</span> <span>${item.price ? item.price + "€" : ""}</span></div>`
                    )
                    .join("")
                : ""
            }
          </div>
        </div>
      `;
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
        // Affiche le détail correspondant
        renderMenuDetails(i);
        activeMenuIdx = i;
      });
    });
  }


 

  // ===== MORE INFO =====
function renderMoreInfo(moreInfo) {
  const moreInfoSection = document.getElementById("moreInfoSection");
  if (!moreInfoSection || !moreInfo || typeof moreInfo !== "object") return;

  // Génère dynamiquement chaque bloc
  moreInfoSection.innerHTML = Object.entries(moreInfo)
    .map(([key, part]) => `
      <div class="moreInfoPart">
        <h3>${part.label || key}</h3>
        <p>${part.text || ""}</p>
        ${part.image ? `<img src="${part.image}" alt="${part.label || key}">` : ""}
      </div>
    `)
    .join("");
}
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

  const logoMapImg = document.getElementById("logoMapImg");
  if (logoMapImg) logoMapImg.src = restaurant.logo;

  const addressBlock = document.getElementById("addressBlock");
  if (addressBlock) {
    addressBlock.innerHTML = `${restaurant.contact?.address || ""}<br />${restaurant.contact?.city || ""}<br /><br />${restaurant.contact?.phone || ""}`;
  }
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