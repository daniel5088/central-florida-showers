/* ===================================
   Central Florida Showers LLC
   Website JavaScript
   ADA / WCAG 2.1 AA Compliant
   =================================== */

document.addEventListener('DOMContentLoaded', function () {

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
    // Move focus to top of page for screen readers
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
    // Focus the first nav link
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

  // Close mobile nav when clicking a link
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileNav();
    });
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', function (e) {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      closeMobileNav();
    }
  });

  // Close mobile nav on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMobileNav();
      navToggle.focus();
    }
  });

  // --- Active Nav Link on Scroll ---
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    var scrollPos = window.scrollY + 100;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // --- Gallery Filter with aria-pressed ---
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = this.getAttribute('data-filter');

      // Update aria-pressed on all buttons
      filterBtns.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');

      var visibleCount = 0;
      galleryItems.forEach(function (item) {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease';
          item.removeAttribute('aria-hidden');
          visibleCount++;
        } else {
          item.style.display = 'none';
          item.setAttribute('aria-hidden', 'true');
        }
      });
    });
  });

  // --- Lightbox with Focus Trapping ---
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
    // Focus the close button for keyboard users
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
    // Restore focus to the element that opened the lightbox
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  // Focus trap inside lightbox
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
    // Keyboard support for gallery items
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

  // Keyboard navigation for lightbox
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

  // Close lightbox on background click
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // --- Contact Form with Accessible Error Handling ---
  var contactForm = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');
  var formError = document.getElementById('formError');

  function showFormError(message) {
    formError.textContent = message;
    formError.classList.add('visible');
    formError.focus();
  }

  function hideFormError() {
    formError.textContent = '';
    formError.classList.remove('visible');
  }

  function setFieldInvalid(fieldId, invalid) {
    var field = document.getElementById(fieldId);
    if (field) {
      field.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    }
  }

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    hideFormError();

    // Reset field states
    ['firstName', 'lastName', 'email', 'phone'].forEach(function (id) {
      setFieldInvalid(id, false);
    });

    var firstName = document.getElementById('firstName').value.trim();
    var lastName = document.getElementById('lastName').value.trim();
    var email = document.getElementById('email').value.trim();
    var phone = document.getElementById('phone').value.trim();

    // Collect errors
    var errors = [];
    if (!firstName) { errors.push('First Name'); setFieldInvalid('firstName', true); }
    if (!lastName) { errors.push('Last Name'); setFieldInvalid('lastName', true); }
    if (!email) { errors.push('Email Address'); setFieldInvalid('email', true); }
    if (!phone) { errors.push('Phone Number'); setFieldInvalid('phone', true); }

    if (errors.length > 0) {
      showFormError('Please fill in the following required fields: ' + errors.join(', ') + '.');
      return;
    }

    // Email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFieldInvalid('email', true);
      showFormError('Please enter a valid email address.');
      return;
    }

    // Phone validation
    var phoneClean = phone.replace(/[\s\-\(\)\.]/g, '');
    if (phoneClean.length < 10 || !/^\d+$/.test(phoneClean)) {
      setFieldInvalid('phone', true);
      showFormError('Please enter a valid phone number (at least 10 digits).');
      return;
    }

    // Show success message (in production, this would submit to a server)
    contactForm.style.display = 'none';
    formSuccess.classList.add('visible');

    // Reset form after 5 seconds
    setTimeout(function () {
      contactForm.reset();
      contactForm.style.display = 'block';
      formSuccess.classList.remove('visible');
      hideFormError();
      ['firstName', 'lastName', 'email', 'phone'].forEach(function (id) {
        setFieldInvalid(id, false);
      });
    }, 5000);
  });

  // --- Scroll Animations (respects prefers-reduced-motion via CSS) ---
  var fadeElements = document.querySelectorAll(
    '.service-card, .testimonial-card, .info-card, .about-content, .about-image, .why-us-content, .why-us-image'
  );

  fadeElements.forEach(function (el) {
    el.classList.add('fade-in');
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  fadeElements.forEach(function (el) {
    observer.observe(el);
  });

  // --- Dynamic Copyright Year ---
  var yearEl = document.getElementById('copyrightYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        // Move focus to the target section for screen readers
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

});
