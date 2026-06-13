// ===== MOBILE MENU TOGGLE =====
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// ===== NAVBAR SCROLL EFFECT =====
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });
});

// ===== PROJECTS SLIDER =====
let currentSlide = 0;
const slides = document.querySelectorAll(".project-slide");
const dotsContainer = document.getElementById("sliderDots");

function initSlider() {
  if (!slides.length) return;
  
  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = `slider-dot${index === 0 ? " active" : ""}`;
    dot.setAttribute("aria-label", `Go to project ${index + 1}`);
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
}

function updateSlider() {
  const slider = document.getElementById("projectsSlider");
  if (!slider) return;
  
  slider.scrollTo({
    left: currentSlide * slider.offsetWidth,
    behavior: "smooth"
  });
  
  // Update dots
  const dots = document.querySelectorAll(".slider-dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}

function moveSlider(direction) {
  currentSlide += direction;
  
  if (currentSlide < 0) {
    currentSlide = slides.length - 1;
  } else if (currentSlide >= slides.length) {
    currentSlide = 0;
  }
  
  updateSlider();
}

function goToSlide(index) {
  currentSlide = index;
  updateSlider();
}

// ===== IMAGE SLIDER WITHIN PROJECTS =====
function initImageSliders() {
  document.querySelectorAll(".project-img-wrapper").forEach((wrapper) => {
    const imagesAttr = wrapper.dataset.images;
    if (!imagesAttr) return;
    
    let imageList;
    try {
      imageList = JSON.parse(imagesAttr);
    } catch {
      return;
    }
    
    const imgElement = wrapper.querySelector(".project-img");
    const counter = wrapper.querySelector(".img-counter");
    const prevBtn = wrapper.querySelector(".prev-img");
    const nextBtn = wrapper.querySelector(".next-img");
    const imgNav = wrapper.querySelector(".img-nav");
    
    // Only show nav controls if there are 2+ images
    if (imageList.length < 2) {
      if (imgNav) imgNav.style.display = "none";
      return;
    }
    
    // Filter to only existing images by pre-loading
    let availableImages = [];
    let loadedCount = 0;
    
    function checkImageExists(src) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
      });
    }
    
    async function loadAvailableImages() {
      for (const imgName of imageList) {
        const exists = await checkImageExists(`./assets/${imgName}`);
        if (exists) {
          availableImages.push(imgName);
        }
      }
      
      // If only 1 or 0 images available, hide nav
      if (availableImages.length < 2) {
        if (imgNav) imgNav.style.display = "none";
        // Still show the first available image
        if (availableImages.length === 1 && imgElement) {
          imgElement.src = `./assets/${availableImages[0]}`;
        }
        return;
      }
      
      let currentImgIndex = 0;
      
      function updateImage() {
        if (imgElement && availableImages[currentImgIndex]) {
          imgElement.src = `./assets/${availableImages[currentImgIndex]}`;
        }
        if (counter) {
          counter.textContent = `${currentImgIndex + 1}/${availableImages.length}`;
        }
      }
      
      if (prevBtn) {
        prevBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          currentImgIndex = (currentImgIndex - 1 + availableImages.length) % availableImages.length;
          updateImage();
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          currentImgIndex = (currentImgIndex + 1) % availableImages.length;
          updateImage();
        });
      }
      
      // Update initial state
      updateImage();
    }
    
    loadAvailableImages();
  });
}

// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe glass cards and other elements
  document.querySelectorAll(".glass-card, .timeline-item, .skill-category, .project-card").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

// Add revealed class style dynamically
const revealStyle = document.createElement("style");
revealStyle.textContent = `
  .revealed {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  .timeline-item:nth-child(1) { transition-delay: 0.1s; }
  .timeline-item:nth-child(2) { transition-delay: 0.3s; }
  .skill-category:nth-child(1) { transition-delay: 0.1s; }
  .skill-category:nth-child(2) { transition-delay: 0.2s; }
  .skill-category:nth-child(3) { transition-delay: 0.3s; }
`;
document.head.appendChild(revealStyle);

// ===== PARTICLE BACKGROUND (Lightweight) =====
function initParticles() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  
  // We'll use CSS-based animated background instead of canvas for performance
  // The CSS is already set up with radial gradients
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  initSlider();
  initImageSliders();
  initScrollReveal();
  initParticles();
  
  // Handle window resize for slider
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateSlider();
    }, 100);
  });
});
