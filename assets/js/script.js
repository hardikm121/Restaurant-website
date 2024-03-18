'use strict';
// Strict mode ko enable karta hai.

const preloader = document.querySelector("[data-preaload]");
// Preloader ko select karta hai.

window.addEventListener("load", function () {
  // Jab pura page load ho jata hai, toh:
  preloader.classList.add("loaded");
  // Preloader ko hide karne ke liye "loaded" class ko add karta hai.
  document.body.classList.add("loaded");
  // Document body ko "loaded" class se mark karta hai.
});

const addEventOnElements = function (elements, eventType, callback) {
  // Har element pe event listener add karne ke liye ek function define kiya gaya hai.
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
    // Har ek element pe eventType event ko sunta hai aur callback function ko call karta hai.
  }
}

// Navbar control ke liye elements select kiye gaye hain.
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

// Navbar ko toggle karne ka function.
const toggleNavbar = function () {
  navbar.classList.toggle("active");
  // Navbar pe "active" class ko toggle karta hai.
  overlay.classList.toggle("active");
  // Overlay pe "active" class ko toggle karta hai.
  document.body.classList.toggle("nav-active");
  // Document body pe "nav-active" class ko toggle karta hai.
}

addEventOnElements(navTogglers, "click", toggleNavbar);
// Har nav toggler pe click event ko sunta hai aur toggleNavbar function ko call karta hai.

// Header ko hide karne ka function.
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
    // Header ko hide karne ke liye "hide" class ko add karta hai.
  } else {
    header.classList.remove("hide");
    // Header ko dikhane ke liye "hide" class ko remove karta hai.
  }

  lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
  // Scroll event ko sunta hai.
  if (window.scrollY >= 50) {
    header.classList.add("active");
    // Agar scroll position 50 se zyada hai, toh "active" class ko header pe add karta hai.
    backTopBtn.classList.add("active");
    // Back to top button ko dikhane ke liye "active" class ko add karta hai.
    hideHeader();
    // Header ko hide karne ka function call karta hai.
  } else {
    header.classList.remove("active");
    // Agar scroll position 50 se kam hai, toh "active" class ko header se hata deta hai.
    backTopBtn.classList.remove("active");
    // Back to top button ko chhupane ke liye "active" class ko hata deta hai.
  }
});

// Hero slider ke liye elements select kiye gaye hain.
const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

// Slider position ko update karne ka function.
const updateSliderPos = function () {
  lastActiveSliderItem.classList.remove("active");
  // Pichla active slider item se "active" class ko hata deta hai.
  heroSliderItems[currentSlidePos].classList.add("active");
  // Current slide position pe "active" class ko add karta hai.
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
  // Last active slider item ko current slide pe set karta hai.
}

// Agla slide pe move karne ka function.
const slideNext = function () {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
    // Agar current slide position last slide hai, toh first slide pe move karta hai.
  } else {
    currentSlidePos++;
    // Nahi toh agle slide pe move karta hai.
  }

  updateSliderPos();
  // Slider position ko update karne ka function call karta hai.
}

heroSliderNextBtn.addEventListener("click", slideNext);
// Agla slide button pe click event ko sunta hai aur slideNext function ko call karta hai.

// Pichla slide pe move karne ka function.
const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
    // Agar current slide position first slide hai, toh last slide pe move karta hai.
  } else {
    currentSlidePos--;
    // Nahi toh pichle slide pe move karta hai.
  }

  updateSliderPos();
  // Slider position ko update karne ka function call karta hai.
}

heroSliderPrevBtn.addEventListener("click", slidePrev);
// Pichla slide button pe click event ko sunta hai aur slidePrev function ko call karta hai.

let autoSlideInterval;

// Hero slider ko automatically agle slide pe le jaane ka function.
const autoSlide = function () {
  autoSlideInterval = setInterval(function () {
    slideNext();
    // SlideNext function ko 7000 milliseconds ke interval pe call karta hai.
  }, 7000);
}

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
  clearInterval(autoSlideInterval);
  // Mouse over event pe auto slide ko rok deta hai.
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);
// Mouse out event pe auto slide ko restart karta hai.

window.addEventListener("load", autoSlide);
// Jab pura page load ho jata hai, toh auto slide ko start karta hai.

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {
  // Mouse ki movement ko track karta hai.
  x = (event.clientX / window.innerWidth * 10) - 5;
  // Mouse ki x position ko normalize karta hai.
  y = (event.clientY / window.innerHeight * 10) - 5;
  // Mouse ki y position ko normalize karta hai.

  x = x - (x * 2);
  y = y - (y * 2);
  // Mouse ki position ko reverse karta hai.

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    // Har parallax item ke liye:
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    // Mouse ki x position ko parallax speed ke hisaab se adjust karta hai.
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    // Mouse ki y position ko parallax speed ke hisaab se adjust karta hai.
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
    // Parallax effect ko apply karta hai.
  }

});
