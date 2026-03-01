/* ===================================
   Central Florida Showers LLC
   Gallery Page JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', function () {

  // --- Category Names Map ---
  var categoryNames = {
    'barn-door': 'Barn Door',
    '90-degree': '90 Degree Enclosures',
    'neo': 'NEO Enclosures',
    'inline': 'INLINE Enclosures',
    'single-door': 'Single Door and Panel',
    'bypass': 'Bypass',
    'wine-room': 'Wine Room',
    'steam-shower': 'Steam Shower',
    'header': 'Header Enclosures',
    'framed': 'Framed Enclosures',
    'misc': 'Miscellaneous'
  };

  // --- Read Category from URL ---
  var params = new URLSearchParams(window.location.search);
  var category = params.get('category');
  var titleEl = document.getElementById('categoryTitle');

  if (category && categoryNames[category]) {
    titleEl.textContent = categoryNames[category];
    document.title = categoryNames[category] + ' | Central Florida Showers LLC';
  } else {
    titleEl.textContent = 'All Projects';
    category = null;
  }

  // --- Filter Gallery Items ---
  var galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(function (item) {
    if (category && item.getAttribute('data-category') !== category) {
      item.style.display = 'none';
      item.setAttribute('aria-hidden', 'true');
    }
  });

  // --- Navbar Scroll Effect ---
  var navbar = document.getElementById('navbar');
  var backToTop = document.getElementById('backToTop');

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // --- Back to Top ---
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('main-content').focus();
  });

  // --- Mobile Navigation ---
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  function openMobileNav() {
    navMenu.classList.add('open');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close navigation menu');
    var firstLink = navMenu.querySelector('.nav-link');
    if (firstLink) firstLink.focus();
  }

  function closeMobileNav() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
  }

  navToggle.addEventListener('click', function () {
    if (navMenu.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileNav();
    });
  });

  document.addEventListener('click', function (e) {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      closeMobileNav();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMobileNav();
      navToggle.focus();
    }
  });

  // --- Lightbox ---
  var lightbox = document.getElementById('lightbox');
  var lightboxContent = document.getElementById('lightboxContent');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var currentIndex = 0;
  var visibleItems = [];
  var lastFocusedElement = null;

  function getVisibleGalleryItems() {
    visibleItems = [];
    galleryItems.forEach(function (item) {
      if (item.style.display !== 'none') {
        visibleItems.push(item);
      }
    });
    return visibleItems;
  }

  function openLightbox(index) {
    lastFocusedElement = document.activeElement;
    getVisibleGalleryItems();
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function updateLightbox() {
    if (visibleItems.length === 0) return;
    var item = visibleItems[currentIndex];
    var img = item.querySelector('img');
    var overlay = item.querySelector('.gallery-overlay p');

    lightboxContent.innerHTML = '';
    if (img) {
      var lightboxImg = document.createElement('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxContent.appendChild(lightboxImg);
    }
    lightboxCaption.textContent = overlay ? overlay.textContent : '';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  // Focus trap
  var lightboxFocusableElements = [lightboxClose, lightboxPrev, lightboxNext];

  lightbox.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      var focusable = lightboxFocusableElements;
      var firstFocusable = focusable[0];
      var lastFocusable = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      getVisibleGalleryItems();
      var visibleIndex = visibleItems.indexOf(item);
      if (visibleIndex !== -1) {
        openLightbox(visibleIndex);
      }
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightboxPrev.addEventListener('click', function () {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightbox();
  });

  lightboxNext.addEventListener('click', function () {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      lightboxPrev.click();
      e.preventDefault();
    }
    if (e.key === 'ArrowRight') {
      lightboxNext.click();
      e.preventDefault();
    }
  });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // --- Dynamic Copyright Year ---
  var yearEl = document.getElementById('copyrightYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
