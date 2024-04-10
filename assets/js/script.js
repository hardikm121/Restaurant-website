'use strict';

// Preloader element ko select karna
const preloader = document.querySelector("[data-preaload]");

// Navbar ke elements ko select karna
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

// Header ke elements ko select karna
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

// Hero slider ke elements ko select karna
const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

// Parallax effect ke elements ko select karna
const parallaxItems = document.querySelectorAll("[data-parallax-item]");

// Variables ko initialize karna
let lastScrollPos = 0;
let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];
let autoSlideInterval;

// Elements pe event listeners add karne ka function
const addEventOnElements = function(elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}

// Reservation date input ke liye min aur max dates set karna
window.addEventListener("DOMContentLoaded", function() {
  const currentDate = new Date();
  const maxDate = new Date(currentDate.getTime() + (20 * 24 * 60 * 60 * 1000));
  const maxDateString = maxDate.toISOString().split('T')[0];
  const reservationDateInput = document.getElementById("reservationDate");
  reservationDateInput.setAttribute("min", currentDate.toISOString().split('T')[0]);
  reservationDateInput.setAttribute("max", maxDateString);
});

// Selected date ke basis pe available times set karna
window.addEventListener("DOMContentLoaded", function() {
  const currentDate = new Date();
  const reservationDateInput = document.querySelector('input[name="reservationDate"]');
  const timeSelect = document.querySelector('select[name="time"]');
  timeSelect.innerHTML = '';

  const availableTimes = [
    { hour: 10, minute: 0, label: '10:00 am' },
    { hour: 11, minute: 0, label: '11:00 am' },
    { hour: 12, minute: 0, label: '12:00 pm' },
    { hour: 13, minute: 0, label: '01:00 pm' },
    { hour: 14, minute: 0, label: '02:00 pm' },
    { hour: 15, minute: 0, label: '03:00 pm' },
    { hour: 16, minute: 0, label: '04:00 pm' },
    { hour: 17, minute: 0, label: '05:00 pm' },
    { hour: 18, minute: 0, label: '06:00 pm' },
    { hour: 19, minute: 0, label: '07:00 pm' },
    { hour: 20, minute: 0, label: '08:00 pm' },
    { hour: 21, minute: 0, label: '09:00 pm' },
    { hour: 22, minute: 0, label: '10:00 pm' }
  ];

  // Function to check if selected date is today
  function isToday(date) {
    const today = new Date();
    const inputDate = new Date(date);
    return inputDate.toDateString() === today.toDateString();
  }

  // Function to set time options
  function setOptions(selectedDate) {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    timeSelect.innerHTML = '';

    if (isToday(selectedDate)) {
      for (let i = 0; i < availableTimes.length; i++) {
        const { hour, minute, label } = availableTimes[i];
        if (hour > currentHour || (hour === currentHour && minute > currentMinute)) {
          const option = document.createElement('option');
          option.value = label;
          option.textContent = label;
          timeSelect.appendChild(option);
        }
      }
    } else {
      for (let i = 0; i < availableTimes.length; i++) {
        const { label } = availableTimes[i];
        const option = document.createElement('option');
        option.value = label;
        option.textContent = label;
        timeSelect.appendChild(option);
      }
    }
  }

  reservationDateInput.addEventListener('change', function() {
    const selectedDate = new Date(this.value);
    setOptions(selectedDate);
  });

  setOptions(currentDate);
});

// Navbar ko toggle karna
const toggleNavbar = function() {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

// Navbar toggler pe click event listener add karna
addEventOnElements(navTogglers, "click", toggleNavbar);

// Header ko hide karna
const hideHeader = function() {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }
  lastScrollPos = window.scrollY;
}

// Scroll pe header ko hide/show karne ka logic
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

// Slider position ko update karna
const updateSliderPos = function() {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
}

// Agla slide pe jaana
const slideNext = function() {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }
  updateSliderPos();
}

// Agla slide button pe click event listener add karna
heroSliderNextBtn.addEventListener("click", slideNext);

// Pichla slide pe jaana
const slidePrev = function() {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }
  updateSliderPos();
}

// Pichla slide button pe click event listener add karna
heroSliderPrevBtn.addEventListener("click", slidePrev);

// Reservation form ko validate karna
const validateReservationForm = function(event) {
  event.preventDefault();
  const name = document.querySelector('input[name="name"]').value;
  const phone = document.querySelector('input[name="phone"]').value;
  const email = document.querySelector('input[name="email_address"]').value;
  const person = document.querySelector('input[name="person"]').value;
  const reservationDate = document.querySelector('input[name="reservationDate"]').value;
  const time = document.querySelector('select[name="time"]').value;

  if (name.trim() === "" || phone.trim() === "" || email.trim() === "" || person.trim() === "" || reservationDate.trim() === "" || time.trim() === "") {
    alert("Please fill out all the fields.");
  } else {
    this.submit();
  }
}

// Form submission event listener add karna
const reservationForm = document.querySelector("form");
reservationForm.addEventListener("submit", validateReservationForm);

// Auto sliding control karna
const autoSlide = function() {
  autoSlideInterval = setInterval(function() {
    slideNext();
  }, 7000);
}

// Auto slide control ke liye mouse events pe event listeners add karna
addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function() {
  clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

// Page load hone par auto slide start karna
window.addEventListener("load", autoSlide);

// Page load hone par preloader ko hide karna
window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});

// Parallax effect ke liye mouse movement track karna
window.addEventListener("mousemove", function (event) {
  let x = (event.clientX / window.innerWidth * 10) - 5;
  let y = (event.clientY / window.innerHeight * 10) - 5;
  x = x - (x * 2);
  y = y - (y * 2);

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }
});
