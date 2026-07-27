// js/script.js â€“ Naresh Enterprises Complete Interactivity Engine
document.addEventListener('DOMContentLoaded', () => {

  // ---------- Toast Notification Utility ----------
  function showToast(message, iconClass = 'fas fa-circle-check') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ---------- Language Switcher Engine (English <-> Marathi) ----------
  const langSelect = document.getElementById('langSelect');

  function setLanguage(lang) {
    localStorage.setItem('userLanguage', lang);
    if (langSelect) langSelect.value = lang;

    // Translate innerHTML
    document.querySelectorAll('[data-en][data-mr]').forEach(el => {
      const translation = lang === 'mr' ? el.getAttribute('data-mr') : el.getAttribute('data-en');
      if (translation) {
        el.innerHTML = translation;
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-en-ph][data-mr-ph]').forEach(input => {
      const ph = lang === 'mr' ? input.getAttribute('data-mr-ph') : input.getAttribute('data-en-ph');
      if (ph) {
        input.placeholder = ph;
      }
    });

    const toastMsg = lang === 'mr' ? 'à¤µà¥‡à¤¬à¤¸à¤¾à¤‡à¤Ÿà¤šà¥€ à¤­à¤¾à¤·à¤¾ à¤®à¤°à¤¾à¤ à¥€à¤µà¤° à¤¬à¤¦à¤²à¤²à¥€!' : 'Language changed to English!';
    showToast(toastMsg, 'fas fa-globe');
  }

  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });

    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && (savedLang === 'mr' || savedLang === 'en')) {
      // Apply saved language silently on load
      localStorage.setItem('userLanguage', savedLang);
      langSelect.value = savedLang;
      document.querySelectorAll('[data-en][data-mr]').forEach(el => {
        const translation = savedLang === 'mr' ? el.getAttribute('data-mr') : el.getAttribute('data-en');
        if (translation) el.innerHTML = translation;
      });
      document.querySelectorAll('[data-en-ph][data-mr-ph]').forEach(input => {
        const ph = savedLang === 'mr' ? input.getAttribute('data-mr-ph') : input.getAttribute('data-en-ph');
        if (ph) input.placeholder = ph;
      });
    }
  }

  // ---------- Mobile Menu Toggle ----------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpening = !navLinks.classList.contains('active');
      navLinks.classList.toggle('active', isOpening);
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpening));
      document.body.classList.toggle('menu-open', isOpening);
      const icon = mobileMenuBtn.querySelector('i');
      if (isOpening) {
        icon.className = 'fas fa-xmark';
      } else {
        icon.className = 'fas fa-bars';
      }
    });

    // Close menu when clicking nav item
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        if (mobileMenuBtn.querySelector('i')) {
          mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        }
      });
    });
  }

  // ---------- Hero Slider ----------
  const heroSlides = document.querySelectorAll('#heroSlider .slide');
  const heroPrev = document.getElementById('heroPrev');
  const heroNext = document.getElementById('heroNext');
  const heroDots = document.getElementById('heroDots');
  let heroCurrent = 0;
  let heroTimer = null;

  function initHeroSlider() {
    if (!heroSlides.length) return;

    // Create pagination dots
    heroDots.innerHTML = '';
    heroSlides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToHeroSlide(index));
      heroDots.appendChild(dot);
    });

    if (heroPrev) heroPrev.addEventListener('click', prevHeroSlide);
    if (heroNext) heroNext.addEventListener('click', nextHeroSlide);

    startHeroTimer();
  }

  function goToHeroSlide(index) {
    heroSlides[heroCurrent].classList.remove('active');
    if (heroDots && heroDots.children[heroCurrent]) {
      heroDots.children[heroCurrent].classList.remove('active');
    }

    heroCurrent = (index + heroSlides.length) % heroSlides.length;

    heroSlides[heroCurrent].classList.add('active');
    if (heroDots && heroDots.children[heroCurrent]) {
      heroDots.children[heroCurrent].classList.add('active');
    }
  }

  function nextHeroSlide() {
    goToHeroSlide(heroCurrent + 1);
    resetHeroTimer();
  }

  function prevHeroSlide() {
    goToHeroSlide(heroCurrent - 1);
    resetHeroTimer();
  }

  function startHeroTimer() {
    heroTimer = setInterval(() => {
      goToHeroSlide(heroCurrent + 1);
    }, 5000);
  }

  function resetHeroTimer() {
    clearInterval(heroTimer);
    startHeroTimer();
  }

  initHeroSlider();

  // ---------- Best Selling Horizontal Scroll ----------
  const scrollContainer = document.getElementById('bestSellingScroll');
  const scrollLeftBtn = document.getElementById('scrollLeftBtn');
  const scrollRightBtn = document.getElementById('scrollRightBtn');

  if (scrollContainer && scrollLeftBtn && scrollRightBtn) {
    scrollLeftBtn.addEventListener('click', () => {
      scrollContainer.scrollBy({ left: -280, behavior: 'smooth' });
    });
    scrollRightBtn.addEventListener('click', () => {
      scrollContainer.scrollBy({ left: 280, behavior: 'smooth' });
    });
  }

  // ---------- Testimonial Slider ----------
  const testimonialCards = document.querySelectorAll('#testimonialSlider .testimonial-card');
  const testimonialPrev = document.getElementById('testimonialPrev');
  const testimonialNext = document.getElementById('testimonialNext');
  const testimonialDots = document.getElementById('testimonialDots');
  let testimonialCurrent = 0;
  let testimonialTimer = null;

  function initTestimonialSlider() {
    if (!testimonialCards.length) return;

    testimonialDots.innerHTML = '';
    testimonialCards.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToTestimonial(index));
      testimonialDots.appendChild(dot);
    });

    if (testimonialPrev) testimonialPrev.addEventListener('click', prevTestimonial);
    if (testimonialNext) testimonialNext.addEventListener('click', nextTestimonial);

    startTestimonialTimer();
  }

  function goToTestimonial(index) {
    testimonialCards[testimonialCurrent].classList.remove('active');
    if (testimonialDots && testimonialDots.children[testimonialCurrent]) {
      testimonialDots.children[testimonialCurrent].classList.remove('active');
    }

    testimonialCurrent = (index + testimonialCards.length) % testimonialCards.length;

    testimonialCards[testimonialCurrent].classList.add('active');
    if (testimonialDots && testimonialDots.children[testimonialCurrent]) {
      testimonialDots.children[testimonialCurrent].classList.add('active');
    }
  }

  function nextTestimonial() {
    goToTestimonial(testimonialCurrent + 1);
    resetTestimonialTimer();
  }

  function prevTestimonial() {
    goToTestimonial(testimonialCurrent - 1);
    resetTestimonialTimer();
  }

  function startTestimonialTimer() {
    testimonialTimer = setInterval(() => {
      goToTestimonial(testimonialCurrent + 1);
    }, 6000);
  }

  function resetTestimonialTimer() {
    clearInterval(testimonialTimer);
    startTestimonialTimer();
  }

  initTestimonialSlider();

  // ---------- FAQ Accordion ----------
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      accordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });

  if (accordionItems.length > 0) {
    accordionItems[0].classList.add('active');
  }


  // ---------- Newsletter Submit ----------
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('newsletterEmail');
      if (input && input.value.trim() !== '') {
        showToast('Thank you for subscribing! Check your inbox for updates.', 'fas fa-envelope-circle-check');
        input.value = '';
      }
    });
  }

  // ---------- Back To Top ----------
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Scroll Reveal Observer ----------
  const revealElements = document.querySelectorAll('.feature-card, .category-card, .product-card, .best-card');
  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- Contact Form Validation ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const nameField = document.getElementById('contactName');
    const phoneField = document.getElementById('contactPhone');
    const messageField = document.getElementById('contactMessage');

    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const messageError = document.getElementById('messageError');

    // Prevent non-numeric input for phone
    phoneField.addEventListener('input', function(e) {
      this.value = this.value.replace(/[^0-9]/g, '');
    });

    const validateName = () => {
      const val = nameField.value.trim();
      const regex = /^[A-Za-z\s]+$/;
      if (val.length < 3 || val.length > 50 || !regex.test(val)) {
        nameError.textContent = 'Please enter a valid name using letters only.';
        nameError.style.display = 'block';
        nameField.style.borderColor = '#ef4444';
        return false;
      } else {
        nameError.style.display = 'none';
        nameField.style.borderColor = '';
        return true;
      }
    };

    const validatePhone = () => {
      const val = phoneField.value.trim();
      const regex = /^[0-9]{10}$/;
      if (!regex.test(val)) {
        phoneError.textContent = 'Please enter a valid 10-digit mobile number.';
        phoneError.style.display = 'block';
        phoneField.style.borderColor = '#ef4444';
        return false;
      } else {
        phoneError.style.display = 'none';
        phoneField.style.borderColor = '';
        return true;
      }
    };

    const validateMessage = () => {
      const val = messageField.value.trim();
      if (val.length < 10 || val.length > 500) {
        messageError.textContent = 'Please enter your product requirement or message.';
        messageError.style.display = 'block';
        messageField.style.borderColor = '#ef4444';
        return false;
      } else {
        messageError.style.display = 'none';
        messageField.style.borderColor = '';
        return true;
      }
    };

    // Real-time validation events
    [nameField, phoneField, messageField].forEach(field => {
      field.addEventListener('blur', () => {
        if (field === nameField) validateName();
        if (field === phoneField) validatePhone();
        if (field === messageField) validateMessage();
      });
      field.addEventListener('input', () => {
        // Only re-validate on input if there is already an error shown
        if (field === nameField && nameError.style.display === 'block') validateName();
        if (field === phoneField && phoneError.style.display === 'block') validatePhone();
        if (field === messageField && messageError.style.display === 'block') validateMessage();
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const isNameValid = validateName();
      const isPhoneValid = validatePhone();
      const isMessageValid = validateMessage();

      if (isNameValid && isPhoneValid && isMessageValid) {
        // Form is valid
        if (typeof showToast === 'function') {
          showToast('Thank you! Your message has been sent to Naresh Enterprises. We will contact you shortly.', 'fas fa-paper-plane');
        } else {
          alert('Thank you! Your message has been submitted successfully.');
        }
        contactForm.reset();
        
        // Reset borders
        nameField.style.borderColor = '';
        phoneField.style.borderColor = '';
        messageField.style.borderColor = '';
      }
    });
  }

});
