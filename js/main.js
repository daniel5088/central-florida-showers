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
