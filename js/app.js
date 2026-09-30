// JalDrishti Platform Master Controller & SPA Router
import { initMap } from './map.js?v=2.2';
import { initEvidencePortal } from './evidence.js?v=2.2';
import { initAnalytics } from './analytics.js?v=2.2';
import { initTelemetry } from './telemetry.js?v=2.2';

document.addEventListener('DOMContentLoaded', () => {
  initLandingVideoScreen();
  initHeroOrbitVideo();
  initRouter();
  initThemeAndEdition();
  initBeforeAfterSlider();
  initMobileMenu();
});

// Satellite Earth Orbit Video Loop (Loops strictly 0s to 3s to only show Earth revolving without zooming into terrain)
function initHeroOrbitVideo() {
  const heroVideo = document.getElementById('hero-orbit-video');
  if (!heroVideo) return;

  heroVideo.muted = true;
  heroVideo.playsInline = true;
  heroVideo.currentTime = 0;

  const loopEndSeconds = 3.0;

  const handleLoop = () => {
    if (heroVideo.currentTime >= loopEndSeconds) {
      heroVideo.currentTime = 0.05;
      heroVideo.play().catch(() => {});
    }
  };

  heroVideo.addEventListener('timeupdate', handleLoop);

  // Precision frame-level check to ensure zero frame bleed past 3.0 seconds
  const frameLoopCheck = () => {
    if (heroVideo.currentTime >= loopEndSeconds) {
      heroVideo.currentTime = 0.05;
      heroVideo.play().catch(() => {});
    }
    requestAnimationFrame(frameLoopCheck);
  };
  requestAnimationFrame(frameLoopCheck);

  // Play immediately
  const playPromise = heroVideo.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      document.addEventListener('click', () => {
        heroVideo.play().catch(() => {});
      }, { once: true });
    });
  }
}

// Fullscreen Video Landing Screen (Plays first for 4 seconds, then smoothly reveals the platform)
function initLandingVideoScreen() {
  const screen = document.getElementById('landing-video-screen');
  const video = document.getElementById('landing-video-player');
  const skipBtn = document.getElementById('btn-skip-landing-video');

  if (!screen) return;

  let hasEnded = false;

  const revealWebsitePlatform = () => {
    if (hasEnded) return;
    hasEnded = true;

    // Smoothly fade out the video screen over 0.8s
    screen.classList.add('fade-out');

    setTimeout(() => {
      screen.style.display = 'none';
      if (video) video.pause();
    }, 800);
  };

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      revealWebsitePlatform();
    });
  }

  // Clicking anywhere on the landing video unlocks the platform
  screen.addEventListener('click', () => {
    revealWebsitePlatform();
  });

  // Ensure autoplay starts
  if (video) {
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy handled
      });
    }

    video.addEventListener('timeupdate', () => {
      if (video.currentTime >= 4.0) {
        revealWebsitePlatform();
      }
    });
  }

  // Guaranteed transition timer after 4.0 seconds
  setTimeout(revealWebsitePlatform, 4000);
}

// View Navigation & SPA Router
function initRouter() {
  const navLinks = document.querySelectorAll('[data-view-target]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetViewId = link.getAttribute('data-view-target');
      navigateToView(targetViewId);
    });
  });

  // Check URL hash on load
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && document.getElementById(initialHash)) {
    navigateToView(initialHash);
  } else {
    navigateToView('view-home');
  }
}

export function navigateToView(viewId) {
  const allViews = document.querySelectorAll('.view-container');
  allViews.forEach(v => {
    v.classList.remove('active');
  });

  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add('active');
    window.location.hash = viewId;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update active state in navbars
    document.querySelectorAll('[data-view-target]').forEach(el => {
      if (el.getAttribute('data-view-target') === viewId) {
        el.classList.add('text-primary', 'font-bold', 'border-b-2', 'border-primary');
        el.classList.remove('text-on-surface-variant');
      } else {
        el.classList.remove('text-primary', 'font-bold', 'border-b-2', 'border-primary');
        el.classList.add('text-on-surface-variant');
      }
    });

    // Lazy initialization of view modules
    if (viewId === 'view-home') {
      const heroVideo = document.getElementById('hero-orbit-video');
      if (heroVideo) {
        if (heroVideo.currentTime >= 3.0) heroVideo.currentTime = 0.05;
        heroVideo.play().catch(() => {});
      }
    } else if (viewId === 'view-map') {
      setTimeout(() => initMap(), 150);
    } else if (viewId === 'view-evidence') {
      setTimeout(() => initEvidencePortal(), 100);
    } else if (viewId === 'view-analytics') {
      setTimeout(() => initAnalytics(), 100);
    } else if (viewId === 'view-telemetry') {
      setTimeout(() => initTelemetry(), 100);
    }
  }
}

window.navigateToView = navigateToView;

window.navigateToMapAndSelectSite = function(siteId) {
  // Close any open modals
  const dossierModal = document.getElementById('case-study-dossier-modal');
  if (dossierModal) dossierModal.classList.add('hidden');
  const createModal = document.getElementById('create-case-study-modal');
  if (createModal) createModal.classList.add('hidden');
  const certModal = document.getElementById('audit-certificate-modal');
  if (certModal) certModal.classList.add('hidden');

  navigateToView('view-map');
  setTimeout(() => {
    if (window.selectDamById) {
      window.selectDamById(siteId);
    }
  }, 200);
};

window.navigateToMapAndSelectSensor = function(stationId) {
  const certModal = document.getElementById('audit-certificate-modal');
  if (certModal) certModal.classList.add('hidden');

  navigateToView('view-map');
  setTimeout(() => {
    if (window.showSensorInfoById) {
      window.showSensorInfoById(stationId);
    }
  }, 200);
};

// Dark/Light Theme Handler
function initThemeAndEdition() {
  const themeToggleBtn = document.getElementById('btn-toggle-dark-mode');
  const themeIcon = document.getElementById('dark-mode-icon');

  // Load saved theme preference
  const savedTheme = localStorage.getItem('jaldrishti_dark_mode') || 'light';

  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    if (themeIcon) themeIcon.textContent = 'light_mode';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      localStorage.setItem('jaldrishti_dark_mode', isDark ? 'dark' : 'light');
      if (themeIcon) themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
    });
  }
}

// Before & After Satellite Comparison Slider
function initBeforeAfterSlider() {
  const sliderContainer = document.getElementById('landing-slider-container');
  const beforeLayer = document.getElementById('landing-before-layer');
  const sliderHandle = document.getElementById('landing-slider-handle');

  if (!sliderContainer || !beforeLayer || !sliderHandle) return;

  let isDragging = false;

  const updateSlider = (clientX) => {
    const rect = sliderContainer.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    const percentage = (x / rect.width) * 100;
    beforeLayer.style.width = percentage + '%';
    sliderHandle.style.left = percentage + '%';
  };

  sliderContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  sliderContainer.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSlider(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSlider(e.touches[0].clientX);
  });
}

// Mobile Hamburger Menu
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-dropdown-menu');

  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.add('hidden');
      });
    });
  }
}
