// ==========================================================================
// PDF MASTER — INTERACTIVE JAVASCRIPT & ANIMATIONS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.ranaharis.pdfmaster';

  // ------------------------------------------------------------------------
  // 1. NAVBAR SCROLL EFFECT (Light Glass Elevation)
  // ------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (navbar) {
      if (scrollY > 24) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ------------------------------------------------------------------------
  // 2. 3D MOUSE TILT & SPECULAR REFLECTION (HERO PHONE MOCKUP)
  // ------------------------------------------------------------------------
  const phoneCard = document.getElementById('hero-phone-card');

  if (phoneCard) {
    const handleMove = (e) => {
      const rect = phoneCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate tilt angles (limit to -10 to +10 degrees)
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      phoneCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Update light reflection position
      const mousePercentX = ((x / rect.width) * 100).toFixed(1);
      const mousePercentY = ((y / rect.height) * 100).toFixed(1);
      phoneCard.style.setProperty('--mouse-x', `${mousePercentX}%`);
      phoneCard.style.setProperty('--mouse-y', `${mousePercentY}%`);
    };

    const handleLeave = () => {
      phoneCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      phoneCard.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    };

    const handleEnter = () => {
      phoneCard.style.transition = 'transform 0.1s ease-out';
    };

    phoneCard.addEventListener('mousemove', handleMove);
    phoneCard.addEventListener('mouseleave', handleLeave);
    phoneCard.addEventListener('mouseenter', handleEnter);
  }

  // ------------------------------------------------------------------------
  // 3. INTERSECTION OBSERVER FOR SCROLL REVEALS
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
  }

  // ------------------------------------------------------------------------
  // 4. ANIMATED STATS COUNTER (COUNT UP FROM 0)
  // ------------------------------------------------------------------------
  const trustNumbers = document.querySelectorAll('.trust-number');
  let hasAnimatedCounters = false;

  const animateCounters = () => {
    if (hasAnimatedCounters) return;
    hasAnimatedCounters = true;

    trustNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      
      if (isNaN(target)) return;

      const duration = 1600; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Cubic ease out
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        counter.textContent = `${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = `${target}${suffix}`;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const trustBar = document.querySelector('.trust-bar');
  if (trustBar && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        counterObserver.disconnect();
      }
    }, { threshold: 0.3 });

    counterObserver.observe(trustBar);
  } else {
    animateCounters();
  }



  // ------------------------------------------------------------------------
  // 6. APP GALLERY 3D MULTI-CARD SHOWCASE CONTROLLER
  // ------------------------------------------------------------------------
  const galleryStage = document.getElementById('gallery-stage');
  const galleryTrack = document.getElementById('gallery-track');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryTabBtns = document.querySelectorAll('.gallery-tab-btn');
  const galleryPrevBtn = document.getElementById('gallery-prev-btn');
  const galleryNextBtn = document.getElementById('gallery-next-btn');
  const galleryDots = document.querySelectorAll('.gallery-dot');
  const galleryCurrentNum = document.getElementById('gallery-current-num');
  const galleryShowcase = document.querySelector('.gallery-showcase');

  if (galleryTrack && galleryItems.length > 0) {
    let activeIndex = 0;
    const totalItems = galleryItems.length;
    let autoplayTimer = null;

    const updateGalleryPosition = (index) => {
      activeIndex = (index + totalItems) % totalItems;

      // Center the active card in the stage
      const activeItem = galleryItems[activeIndex];
      const stageWidth = galleryStage.clientWidth;
      
      // Calculate offset to place center of active item at center of stage
      const itemCenter = activeItem.offsetLeft + (activeItem.offsetWidth / 2);
      const targetTranslateX = (stageWidth / 2) - itemCenter;

      galleryTrack.style.transform = `translateX(${targetTranslateX}px)`;

      // Update active states
      galleryItems.forEach((item, i) => {
        item.classList.toggle('active', i === activeIndex);
      });

      // Update tabs
      galleryTabBtns.forEach((btn, i) => {
        const isActive = i === activeIndex;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Update dots
      galleryDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
      });

      // Update counter
      if (galleryCurrentNum) {
        galleryCurrentNum.textContent = `0${activeIndex + 1}`;
      }
    };

    const nextCard = () => updateGalleryPosition(activeIndex + 1);
    const prevCard = () => updateGalleryPosition(activeIndex - 1);

    if (galleryNextBtn) {
      galleryNextBtn.addEventListener('click', () => {
        nextCard();
        resetAutoplay();
      });
    }

    if (galleryPrevBtn) {
      galleryPrevBtn.addEventListener('click', () => {
        prevCard();
        resetAutoplay();
      });
    }

    galleryTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const slideIdx = parseInt(btn.getAttribute('data-slide'), 10);
        if (!isNaN(slideIdx)) {
          updateGalleryPosition(slideIdx);
          resetAutoplay();
        }
      });
    });

    galleryDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const slideIdx = parseInt(dot.getAttribute('data-slide'), 10);
        if (!isNaN(slideIdx)) {
          updateGalleryPosition(slideIdx);
          resetAutoplay();
        }
      });
    });

    // Clicking any item: if not active, center it; if active, open lightbox!
    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => {
        if (i !== activeIndex) {
          updateGalleryPosition(i);
          resetAutoplay();
        } else {
          // Open lightbox on active card
          const src = item.getAttribute('data-img') || item.querySelector('img')?.src;
          const title = item.getAttribute('data-title') || 'PDF Master Preview';
          if (src && lightboxImg) {
            lightboxImg.src = src;
            if (lightboxCaption) lightboxCaption.textContent = title;
            lightbox.classList.add('open');
          }
        }
      });
    });

    // Autoplay (every 4.5s)
    const startAutoplay = () => {
      if (!autoplayTimer) {
        autoplayTimer = setInterval(nextCard, 4500);
      }
    };

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    if (galleryShowcase) {
      galleryShowcase.addEventListener('mouseenter', stopAutoplay);
      galleryShowcase.addEventListener('mouseleave', startAutoplay);
    }

    // Touch Swipe Navigation for Mobile
    if (galleryStage) {
      let touchStartX = 0;
      let touchEndX = 0;

      galleryStage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
      }, { passive: true });

      galleryStage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          if (diff < 0) {
            nextCard();
          } else {
            prevCard();
          }
        }
        startAutoplay();
      }, { passive: true });
    }

    // Keyboard navigation when gallery is in view
    document.addEventListener('keydown', (e) => {
      if (galleryShowcase) {
        const rect = galleryShowcase.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
          if (e.key === 'ArrowRight') {
            nextCard();
            resetAutoplay();
          } else if (e.key === 'ArrowLeft') {
            prevCard();
            resetAutoplay();
          }
        }
      }
    });

    // Keep active item centered on window resize
    window.addEventListener('resize', () => {
      updateGalleryPosition(activeIndex);
    });

    // Initialize layout after DOM ready
    setTimeout(() => {
      updateGalleryPosition(0);
      startAutoplay();
    }, 150);
  }

  // ------------------------------------------------------------------------
  // 7. SCREENSHOT LIGHTBOX MODAL (EXPAND PREVIEWS)
  // ------------------------------------------------------------------------
  const zoomableCards = document.querySelectorAll('.gallery-card, .carousel-phone-card');

  // Create Lightbox DOM dynamically
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox-modal';
  lightbox.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <div class="lightbox-dialog">
      <button class="lightbox-close-btn" aria-label="Close modal">&times;</button>
      <img src="" alt="Screenshot" class="lightbox-image">
      <div class="lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(lightbox);

  // Inject Lightbox styles
  const lightboxStyles = document.createElement('style');
  lightboxStyles.textContent = `
    .lightbox-modal {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      padding: 24px;
    }
    .lightbox-modal.open {
      opacity: 1;
      visibility: visible;
    }
    .lightbox-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
    .lightbox-dialog {
      position: relative;
      z-index: 10;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: scale(0.92);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .lightbox-modal.open .lightbox-dialog {
      transform: scale(1);
    }
    .lightbox-image {
      max-width: 100%;
      max-height: 84vh;
      filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 25px rgba(37, 99, 235, 0.3));
      object-fit: contain;
    }
    .lightbox-caption {
      margin-top: 14px;
      color: #FFFFFF;
      font-weight: 700;
      font-size: 1.05rem;
      text-align: center;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }
    .lightbox-close-btn {
      position: absolute;
      top: -46px;
      right: 0;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.4);
      color: #FFFFFF;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      font-size: 24px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s ease, transform 0.2s ease;
    }
    .lightbox-close-btn:hover {
      background: rgba(255, 255, 255, 0.4);
      transform: scale(1.1);
    }
  `;
  document.head.appendChild(lightboxStyles);

  const lightboxImg = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxCloseBtn = lightbox.querySelector('.lightbox-close-btn');
  const lightboxBackdrop = lightbox.querySelector('.lightbox-backdrop');

  const closeLightbox = () => {
    lightbox.classList.remove('open');
  };

  zoomableCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Avoid opening if clicked on interactive elements
      if (e.target.closest('a') || e.target.closest('button')) return;
      const src = card.getAttribute('data-img') || card.querySelector('img')?.src;
      const title = card.getAttribute('data-title') || card.querySelector('img')?.alt;
      if (src) {
        lightboxImg.src = src;
        lightboxCaption.textContent = title || 'App Screenshot';
        lightbox.classList.add('open');
      }
    });
  });

  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  // ------------------------------------------------------------------------
  // 6. FAQ ACCORDION
  // ------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');

      // Close all items
      faqItems.forEach(i => {
        i.classList.remove('open');
        const qBtn = i.querySelector('.faq-question');
        if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
      });

      // If it wasn't open, open it
      if (!wasOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ------------------------------------------------------------------------
  // 8. SHARE APP LINK & TOAST NOTICE
  // ------------------------------------------------------------------------
  const shareBtn = document.getElementById('share-app-btn');
  const toastNotice = document.getElementById('toast-notice');
  const toastMsg = document.getElementById('toast-msg');

  const showToast = (message) => {
    if (!toastNotice) return;
    if (toastMsg) toastMsg.textContent = message;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  };

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(PLAY_STORE_URL);
          showToast('Google Play link copied to clipboard! ✓');
          return;
        } catch (err) {
          // fallback
        }
      }
      showToast('Opening Google Play store...');
      window.open(PLAY_STORE_URL, '_blank', 'noopener');
    });
  }
});
