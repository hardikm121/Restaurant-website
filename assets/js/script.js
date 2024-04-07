'use strict';

// Select karte hain preloader element ko
const preloader = document.querySelector("[data-preaload]");

// Select karte hain navbar ke elements ko
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

// Select karte hain header ke elements ko
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

// Select karte hain hero slider ke elements ko
const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

// Select karte hain parallax effect ke elements ko
const parallaxItems = document.querySelectorAll("[data-parallax-item]");

// Variables ke initial values set karte hain
let lastScrollPos = 0;
let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];
let autoSlideInterval;

// Function define karte hain jo event listeners add karta hai elements pe
const addEventOnElements = function(elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}

// Navbar ko toggle karne ka function
const toggleNavbar = function() {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

// Har nav toggler pe click event ko sunta hai aur toggleNavbar function ko call karta hai
addEventOnElements(navTogglers, "click", toggleNavbar);

// Header ko hide karne ka function
const hideHeader = function() {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }
  lastScrollPos = window.scrollY;
}

// Scroll event pe header ko hide/show karne ka logic
window.addEventListener("scroll", function() {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

// Slider position ko update karne ka function
const updateSliderPos = function() {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
}

// Agla slide pe move karne ka function
const slideNext = function() {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }
  updateSliderPos();
}

// Agla slide button pe click event ko sunta hai aur slideNext function ko call karta hai
heroSliderNextBtn.addEventListener("click", slideNext);

// Pichla slide pe move karne ka function
const slidePrev = function() {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }
  updateSliderPos();
}

// Pichla slide button pe click event ko sunta hai aur slidePrev function ko call karta hai
heroSliderPrevBtn.addEventListener("click", slidePrev);

// Reservation form ko validate karne ka function
const validateReservationForm = function(event) {
  event.preventDefault(); // Default form submission ko rokta hai

  // Form ke fields ki values ko retrieve karta hai
  const name = document.querySelector('input[name="name"]').value;
  const phone = document.querySelector('input[name="phone"]').value;
  const email = document.querySelector('input[name="email_address"]').value;
  const person = document.querySelector('input[name="person"]').value;
  const reservationDate = document.querySelector('input[name="reservationDate"]').value;
  const time = document.querySelector('select[name="time"]').value;

  // Kya koi required field khali hai? Yadi haan, toh alert dikhata hai
  if (name.trim() === "" || phone.trim() === "" || email.trim() === "" || person.trim() === "" || reservationDate.trim() === "" || time.trim() === "") {
    alert("Please fill out all the fields.");
  } else {
    // Yadi sab required fields bhare gaye hain, toh form submit hota hai
    this.submit();
  }
}

// Form submit event pe reservation form ko validate karne ka function bind kiya jata hai
const reservationForm = document.querySelector("form");
reservationForm.addEventListener("submit", validateReservationForm);

// Auto sliding ko control karne ka function
const autoSlide = function() {
  autoSlideInterval = setInterval(function() {
    slideNext();
  }, 7000);
}

// Auto slide ko rokne aur restart karne ke liye mouse events pe event listeners add kiye gaye hain
addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function() {
  clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

// Pura page load hone par auto slide ko start karta hai
window.addEventListener("load", autoSlide);

// Pura page load hone par preloader ko hide karne ka logic
window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});

// Mouse ki movement ko track karne ka function
window.addEventListener("mousemove", function (event) {
  // Mouse ki position ko normalize karta hai
  let x = (event.clientX / window.innerWidth * 10) - 5;
  let y = (event.clientY / window.innerHeight * 10) - 5;

  // Mouse ki position ko reverse karta hai
  x = x - (x * 2);
  y = y - (y * 2);

  // Har parallax item ke liye
  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    // Mouse ki position ko parallax speed ke hisaab se adjust karta hai
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    
    // Parallax effect ko apply karta hai
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }
});
