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
