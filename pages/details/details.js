// Attendre que les éléments soient disponibles dans le DOM
function initializeCarousel() {
  // Vérifier que les éléments existent avant de continuer
  const imageSlides = document.getElementsByClassName("imageSlides");
  const circles = document.getElementsByClassName("circle");
  const leftArrow = document.getElementById("leftArrow");
  const rightArrow = document.getElementById("rightArrow");

  // Si les éléments ne sont pas encore disponibles, réessayer plus tard
  if (!imageSlides.length || !circles.length || !leftArrow || !rightArrow) {
    setTimeout(initializeCarousel, 100);
    return;
  }

  let counter = 0;
  let imageSlideshowInterval;

  // HIDE ALL IMAGES FUNCTION
  function hideImages() {
    for (let i = 0; i < imageSlides.length; i++) {
      imageSlides[i].classList.remove("visible");
    }
  }

  // REMOVE ALL DOTS FUNCTION
  function removeDots() {
    for (let i = 0; i < circles.length; i++) {
      circles[i].classList.remove("dot");
    }
  }

  // SINGLE IMAGE LOOP/CIRCLES FUNCTION
  function imageLoop() {
    const currentImage = imageSlides[counter];
    const currentDot = circles[counter];
    currentImage.classList.add("visible");
    removeDots();
    currentDot.classList.add("dot");
    counter++;
  }

  // LEFT & RIGHT ARROW FUNCTION & CLICK EVENT LISTENERS
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

  // IMAGE SLIDE FUNCTION
  function slideshow() {
    if (counter < imageSlides.length) {
      imageLoop();
    } else {
      counter = 0;
      hideImages();
      imageLoop();
    }
  }

  // SHOW FIRST IMAGE, & THEN SET & CALL SLIDE INTERVAL
  setTimeout(slideshow, 1000);
  imageSlideshowInterval = setInterval(slideshow, 10000);
}

// Démarrer l'initialisation du carousel
initializeCarousel();

function initializeEachRestaurant() {
  const params = new URLSearchParams(window.location.search); // Récupérer l'ID du restaurant dans l'URL
  const id = params.get('id'); // Récupérer l'ID du restaurant dans l'URL
  const resto = restaurants.find(r => r.id === id);  // Trouver le restaurant correspondant
  if (resto) {   // Modifier dynamiquement l'image de la catégorie 1
    document.querySelector('#logo > img').src = resto.imgLogoAlpha;
    //Carrousel
    document.querySelector('#carrousel1').src = resto.imgCarrousel1;
    document.querySelector('#carrousel2').src = resto.imgCarrousel2;
    document.querySelector('#carrousel3').src = resto.imgCarrousel3;
    // Section Booking
    document.querySelector('.sectBookingVisi > h1').textContent = resto.titleBooking;
    document.querySelector('.sectBookingVisi > p').textContent = resto.pBooking;
    // popUp <-----------
    // Section Menu
    document.querySelector('#menuCategory1 > img').src = resto.imgCategory1;
    document.querySelector('#menuCategory1 > h2').textContent = resto.titreCategory1;
    document.querySelector('#menuCategory2 > img').src = resto.imgCategory2;
    document.querySelector('#menuCategory2 > h2').textContent = resto.titreCategory2;
    document.querySelector('#menuCategory3 > img').src = resto.imgCategory3;
    document.querySelector('#menuCategory3 > h2').textContent = resto.titreCategory3;
    document.querySelector('#menuCategory4 > img').src = resto.imgCategory4;
    document.querySelector('#menuCategory4 > h2').textContent = resto.titreCategory4;
    // Detail Menu Catégory 1
    document.querySelector('#menuDetailsCat1 > h1').textContent = resto.titreCategory1;
    document.querySelector('#menuDetailsCat1 > div > p:nth-of-type(1)').innerHTML = resto.cat1firstColumnPrice;
    document.querySelector('#menuDetailsCat1 > div > p:nth-of-type(2)').innerHTML = resto.cat1firstColumnPlat;
    document.querySelector('#menuDetailsCat1 > div > p:nth-of-type(3)').innerHTML = resto.cat1secondColumnPrice;
    document.querySelector('#menuDetailsCat1 > div > p:nth-of-type(4)').innerHTML = resto.cat1secondColumnPlat;
    // Detail Menu Catégory 2
    document.querySelector('#menuDetailsCat2 > h1').textContent = resto.titreCategory2;
    document.querySelector('#menuDetailsCat2 > div > p:nth-of-type(1)').innerHTML = resto.cat2firstColumnPrice;
    document.querySelector('#menuDetailsCat2 > div > p:nth-of-type(2)').innerHTML = resto.cat2firstColumnPlat;
    document.querySelector('#menuDetailsCat2 > div > p:nth-of-type(3)').innerHTML = resto.cat2secondColumnPrice;
    document.querySelector('#menuDetailsCat2 > div > p:nth-of-type(4)').innerHTML = resto.cat2secondColumnPlat;
    // Detail Menu Catégory 3
    document.querySelector('#menuDetailsCat3 > h1').textContent = resto.titreCategory3;
    document.querySelector('#menuDetailsCat3 > div > p:nth-of-type(1)').innerHTML = resto.cat3firstColumnPrice;
    document.querySelector('#menuDetailsCat3 > div > p:nth-of-type(2)').innerHTML = resto.cat3firstColumnPlat;
    document.querySelector('#menuDetailsCat3 > div > p:nth-of-type(3)').innerHTML = resto.cat3secondColumnPrice;
    document.querySelector('#menuDetailsCat3 > div > p:nth-of-type(4)').innerHTML = resto.cat3secondColumnPlat;
    // Detail Menu Catégory 4
    document.querySelector('#menuDetailsCat4 > h1').textContent = resto.titreCategory4;
    document.querySelector('#menuDetailsCat4 > div > p:nth-of-type(1)').innerHTML = resto.cat4firstColumnPrice;
    document.querySelector('#menuDetailsCat4 > div > p:nth-of-type(2)').innerHTML = resto.cat4firstColumnPlat;
    document.querySelector('#menuDetailsCat4 > div > p:nth-of-type(3)').innerHTML = resto.cat4secondColumnPrice;
    document.querySelector('#menuDetailsCat4 > div > p:nth-of-type(4)').innerHTML = resto.cat4secondColumnPlat;
    // Section More Info
    document.querySelector('#moreInfoPart1 > p').textContent = resto.titreMoreInfo1;
    document.querySelector('#moreInfoPart1 > img').src = resto.imgMoreInfo1;
    document.querySelector('#moreInfoPart2 > p').textContent = resto.titreMoreInfo2;
    document.querySelector('#moreInfoPart2 > img').src = resto.imgMoreInfo2;
    // Section Avis
    document.querySelector('#cardComment1 > p').textContent = resto.comment1;
    document.querySelector('#cardComment2 > p').textContent = resto.comment2;
    document.querySelector('#cardComment3 > p').textContent = resto.comment3;
    document.querySelector('#cardComment1 > div > p').textContent = resto.comment1autor;
    document.querySelector('#cardComment2 > div > p').textContent = resto.comment2autor;
    document.querySelector('#cardComment3 > div > p').textContent = resto.comment3autor;
    document.querySelector('#cardComment1 > div > img').src = resto.comment1autorImg;
    document.querySelector('#cardComment2 > div > img').src = resto.comment2autorImg;
    document.querySelector('#cardComment3 > div > img').src = resto.comment3autorImg;
    //section MAPS
    document.querySelector('#sectMaps > div > iframe').src = resto.map;
    document.querySelector('#adress > img').src = resto.imgLogoAlpha;
    document.querySelector('#adress > p').textContent = resto.contact;
    document.querySelector('#reseaux > img:nth-of-type(1)').src = resto.facebook;
    document.querySelector('#reseaux > img:nth-of-type(2)').src = resto.instagram;
    document.querySelector('#reseaux > img:nth-of-type(3)').src = resto.linkedin;
    document.querySelector('#reseaux > img:nth-of-type(4)').src = resto.youtube;

    //Toute la zone en dessous correspond au choix des catégory de Menu
    ['1','2','3','4'].forEach(num => {
      document.getElementById('menuCategory' + num).addEventListener('click', function() {
        // Cacher toutes les sections de détails
        document.querySelectorAll('.menuCategoryDetails').forEach(div => {
          div.style.display = 'none';
        });
        // Afficher la bonne section
        document.getElementById('menuDetailsCat' + num).style.display = 'flex';

        // Retirer la classe 'selected' de toutes les images
        document.querySelectorAll('.menuCategory img').forEach(img => {
          img.classList.remove('selected');
        });
        // Ajouter la classe 'selected' à l'image cliquée
        this.querySelector('img').classList.add('selected');
      });
    });} else {
      document.getElementById('restaurant-detail').innerHTML = `
      <p>Restaurant introuvable</p>`;
    }
}

initializeEachRestaurant();