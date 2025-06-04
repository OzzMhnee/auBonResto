function loadRestaurantsData() {
  return new Promise((resolve, reject) => {
    // Vérifier si les données sont déjà chargées
    if (typeof restaurants !== "undefined") {
      resolve();
      return;
    }

    console.log("Chargement des données restaurants...");
    const script = document.createElement("script");
    script.src = "/pages/details/restaurants.js";
    script.onload = () => {
      if (typeof restaurants !== "undefined") {
        console.log(`✅ ${restaurants.length} restaurant(s) chargé(s)`);
        resolve();
      } else {
        reject(
          new Error("❌ Données restaurants non trouvées après chargement")
        );
      }
    };
    script.onerror = () => {
      reject(new Error("❌ Erreur lors du chargement de restaurants.js"));
    };
    document.head.appendChild(script);
  });
}

// ========== CAROUSEL FUNCTIONS (conservées) ==========
function initializeCarousel() {
  const imageSlides = document.getElementsByClassName("imageSlides");
  const circles = document.getElementsByClassName("circle");
  const leftArrow = document.getElementById("leftArrow");
  const rightArrow = document.getElementById("rightArrow");

  if (!imageSlides.length || !circles.length || !leftArrow || !rightArrow) {
    setTimeout(initializeCarousel, 100);
    return;
  }

  let counter = 0;
  let imageSlideshowInterval;

  function hideImages() {
    for (let i = 0; i < imageSlides.length; i++) {
      imageSlides[i].classList.remove("visible");
    }
  }

  function removeDots() {
    for (let i = 0; i < circles.length; i++) {
      circles[i].classList.remove("dot");
    }
  }

  function imageLoop() {
    const currentImage = imageSlides[counter];
    const currentDot = circles[counter];
    currentImage.classList.add("visible");
    removeDots();
    currentDot.classList.add("dot");
    counter++;
  }

  function arrowClick(e) {
    const target = e.target;
    if (target === leftArrow) {
      clearInterval(imageSlideshowInterval);
      hideImages();
      removeDots();
      if (counter === 1) {
        counter = imageSlides.length - 1;
        imageLoop();
        imageSlideshowInterval = setInterval(slideshow, 10000);
      } else {
        counter--;
        counter--;
        imageLoop();
        imageSlideshowInterval = setInterval(slideshow, 10000);
      }
    } else if (target === rightArrow) {
      clearInterval(imageSlideshowInterval);
      hideImages();
      removeDots();
      if (counter === imageSlides.length) {
        counter = 0;
        imageLoop();
        imageSlideshowInterval = setInterval(slideshow, 10000);
      } else {
        imageLoop();
        imageSlideshowInterval = setInterval(slideshow, 10000);
      }
    }
  }

  leftArrow.addEventListener("click", arrowClick);
  rightArrow.addEventListener("click", arrowClick);

  function slideshow() {
    if (counter < imageSlides.length) {
      imageLoop();
    } else {
      counter = 0;
      hideImages();
      imageLoop();
    }
  }

  setTimeout(slideshow, 1000);
  imageSlideshowInterval = setInterval(slideshow, 10000);
}

// ========== UTILITY FUNCTIONS ==========
function generateMenuItems(items) {
  let pricesColumn1 = "";
  let itemsColumn1 = "";
  let pricesColumn2 = "";
  let itemsColumn2 = "";

  const halfLength = Math.ceil(items.length / 2);

  for (let i = 0; i < halfLength; i++) {
    const item = items[i];
    pricesColumn1 += item.price + "<br>";
    itemsColumn1 += item.name;
    if (item.description) {
      itemsColumn1 += `<br><span>&nbsp;&nbsp;&nbsp;&nbsp;${item.description}</span>`;
    }
    itemsColumn1 += "<br>";
  }

  for (let i = halfLength; i < items.length; i++) {
    const item = items[i];
    pricesColumn2 += item.price + "<br>";
    itemsColumn2 += item.name;
    if (item.description) {
      itemsColumn2 += `<br><span>&nbsp;&nbsp;&nbsp;&nbsp;${item.description}</span>`;
    }
    itemsColumn2 += "<br>";
  }

  return { pricesColumn1, itemsColumn1, pricesColumn2, itemsColumn2 };
}

function generateReviews(reviews) {
  return reviews
    .map(
      (review) => `
    <div class="cardComment">
      <p>"${review.text}"</p>
      <div class="avatarComment">
        <img src="${review.avatar}" alt="Avatar">
        <p>${review.author}</p>
      </div>
    </div>
  `
    )
    .join("");
}

// ========== MAIN RESTAURANT DATA MAPPING ==========
function initializeRestaurantData() {
  console.log("Initialisation des données restaurant...");

  const params = new URLSearchParams(window.location.search);
  const restaurantId = params.get("id") || "chezVincent";

  console.log("ID restaurant recherché:", restaurantId);

  const restaurant = restaurants.find((r) => r.id === restaurantId);

  if (!restaurant) {
    console.error("Restaurant non trouvé:", restaurantId);
    return;
  }

  console.log("Restaurant trouvé:", restaurant.name);

  // ===== CAROUSEL IMAGES =====
  const carouselImages = document.querySelectorAll(".imageSlides");
  restaurant.carousel.forEach((imageSrc, index) => {
    if (carouselImages[index]) {
      carouselImages[index].src = imageSrc;
      console.log(`Image carousel ${index} mise à jour:`, imageSrc);
    }
  });

  // ===== LOGOS =====
  const logoElements = [
    document.querySelector("#logo img"),
    document.querySelector(".adress img"),
  ];
  logoElements.forEach((logo) => {
    if (logo) {
      logo.src = restaurant.logo;
      console.log("Logo mis à jour:", restaurant.logo);
    }
  });

  // ===== PRESENTATION =====
  const presentationTitle = document.querySelector(".sectBookingVisi h1");
  const presentationDesc = document.querySelector(".sectBookingVisi p");

  if (presentationTitle) {
    presentationTitle.textContent = restaurant.presentation.title;
    console.log("Titre présentation mis à jour");
  }

  if (presentationDesc) {
    presentationDesc.textContent = restaurant.presentation.description;
    console.log("Description présentation mise à jour");
  }

  // ===== POPUP CONTACT =====
  const popupInfo = document.querySelector("#info");
  if (popupInfo) {
    popupInfo.innerHTML = `
      <h1>Informations de réservation</h1>
      <p>Pour réserver une table, veuillez nous contacter au :</p>
      <p><strong>${restaurant.contact.phone}</strong></p>
      <p>${restaurant.contact.openingHours}</p>
      <label for="close"><i class="fa fa-times-circle fa-lg"></i></label>
    `;
    console.log("Popup contact mis à jour");
  }

  // ===== MENU CATEGORIES ET DETAILS =====
  const allCategoryElements = document.querySelectorAll(".menuCategory");
  const allDetailElements = document.querySelectorAll(".menuCategoryDetails");

  console.log(
    `Trouvé ${allCategoryElements.length} catégories et ${allDetailElements.length} sections détails`
  );

  restaurant.menu.forEach((category, index) => {
    // Boutons des catégories
    if (allCategoryElements[index]) {
      const categoryElement = allCategoryElements[index];
      const img = categoryElement.querySelector("img");
      const h2 = categoryElement.querySelector("h2");

      if (img) {
        img.src = category.image;
        img.alt = category.name;
        if (index === 0) img.classList.add("selected");
        console.log(`✅ Image catégorie ${index} mise à jour:`, category.image);
      }

      if (h2) {
        h2.textContent = category.name;
        console.log(`✅ Nom catégorie ${index} mis à jour:`, category.name);
      }
    }

    // Sections de détails
    if (allDetailElements[index]) {
      const detailElement = allDetailElements[index];
      const title = detailElement.querySelector("h1");

      if (title) {
        title.textContent = category.name;
        console.log(`✅ Titre détail ${index} mis à jour:`, category.name);
      }

      const menuItems = generateMenuItems(category.items);
      const menuContainer = detailElement.querySelector("div");

      if (menuContainer) {
        menuContainer.innerHTML = `
          <p>${menuItems.pricesColumn1}</p>
          <p>${menuItems.itemsColumn1}</p>
          <p>${menuItems.pricesColumn2}</p>
          <p>${menuItems.itemsColumn2}</p>
        `;
        console.log(`✅ Menu détaillé catégorie ${index} mis à jour`);
      }

      // Afficher seulement la première catégorie
      detailElement.style.display = index === 0 ? "flex" : "none";
    }
  });

  // ===== MORE INFO SECTIONS =====
  const moreInfoPart1 = document.querySelector(".moreInfoPart1");
  if (moreInfoPart1) {
    const p = moreInfoPart1.querySelector("p");
    const img = moreInfoPart1.querySelector("img");
    if (p) p.innerHTML = restaurant.moreInfo.traiteur.text;
    if (img) img.src = restaurant.moreInfo.traiteur.image;
    console.log("Section traiteur mise à jour");
  }

  const moreInfoPart2 = document.querySelector(".moreInfoPart2");
  if (moreInfoPart2) {
    const p = moreInfoPart2.querySelector("p");
    const img = moreInfoPart2.querySelector("img");
    if (p) p.innerHTML = restaurant.moreInfo.vins.text;
    if (img) img.src = restaurant.moreInfo.vins.image;
    console.log("Section vins mise à jour");
  }

  // ===== REVIEWS =====
  const commentsContainer = document.querySelector(".comments");
  if (commentsContainer) {
    commentsContainer.innerHTML = generateReviews(restaurant.reviews);
    console.log("Avis clients mis à jour");
  }

  // ===== MAP AND ADDRESS =====
  const iframe = document.querySelector(".sectMaps iframe");
  if (iframe) {
    iframe.src = restaurant.contact.mapUrl;
    console.log("Carte mise à jour");
  }

  const addressP = document.querySelector(".adress p");
  if (addressP) {
    addressP.innerHTML = `${restaurant.contact.address}<br>${restaurant.contact.city}<br><br>${restaurant.contact.phone}`;
    console.log("Adresse mise à jour");
  }

  console.log("✅ Initialisation des données restaurant terminée");
}

// ========== MENU CATEGORIES INTERACTION ==========
function initializeMenuCategories() {
  console.log("Initialisation des catégories de menu...");

  const categoryElements = document.querySelectorAll(".menuCategory");
  const detailElements = document.querySelectorAll(".menuCategoryDetails");

  categoryElements.forEach((categoryElement, index) => {
    categoryElement.addEventListener("click", function () {
      console.log(`Catégorie ${index} cliquée`);

      // Cacher toutes les sections
      detailElements.forEach((div) => {
        div.style.display = "none";
      });

      // Afficher la section sélectionnée
      if (detailElements[index]) {
        detailElements[index].style.display = "flex";
        console.log(`✅ Section ${index} affichée`);
      }

      // Gérer les classes selected
      document.querySelectorAll(".menuCategory img").forEach((img) => {
        img.classList.remove("selected");
      });

      const clickedImg = this.querySelector("img");
      if (clickedImg) {
        clickedImg.classList.add("selected");
        console.log(`✅ Image ${index} sélectionnée`);
      }
    });
  });

  console.log(`✅ ${categoryElements.length} catégories de menu initialisées`);
}

// ========== MAIN INITIALIZATION ==========
function initializeAllFeatures() {
  console.log("🚀 Démarrage de l'initialisation complète...");

  // D'abord charger les données restaurants, puis initialiser
  loadRestaurantsData()
    .then(() => {
      console.log("📊 Données chargées, initialisation des fonctionnalités...");
      setTimeout(() => {
        initializeRestaurantData();
        initializeCarousel();
        initializeMenuCategories();
        console.log("✅ Initialisation complète terminée");
      }, 100);
    })
    .catch((error) => {
      console.error("❌ Erreur lors du chargement des données:", error);
      console.log(
        "💡 Vérifiez que le fichier restaurants.js existe dans /pages/details/"
      );
    });
}

// ========== INTEGRATION WITH LAYOUT SYSTEM ==========
window.initializePage = function (page) {
  console.log("initializePage appelée pour:", page);
  if (page === "details") {
    initializeAllFeatures();
  }
};

// Fallback pour le chargement direct
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAllFeatures);
} else {
  initializeAllFeatures();
}
