// ============================================================
// script.js - Versión Optimizada
// ============================================================

(function() {
  'use strict';

  // --- DOM References ---
  const $ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const $1 = (sel, ctx = document) => ctx.querySelector(sel);

  const body = document.body;
  const progressBar = $1('.scroll-progress span');
  const header = $1('.site-header');
  const menuToggle = $1('.menu-toggle');
  const mainNav = $1('.main-nav');
  const themeToggle = $1('.theme-toggle');
  const logos = $('img[data-normal][data-mono]');

  // --- State ---
  let scrollTicking = false;
  let observerInstances = [];

  // --- Helpers ---
  const isMobile = () => window.innerWidth < 900;

  // --- 1. Theme Management ---
  function setTheme(useMono) {
    const isMono = Boolean(useMono);
    body.classList.toggle('mono', isMono);
    
    logos.forEach(img => {
      const src = isMono ? img.dataset.mono : img.dataset.normal;
      if (src && img.src !== src) img.src = src;
    });

    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isMono));
      themeToggle.setAttribute('aria-label', isMono ? 'Activar modo claro' : 'Activar modo oscuro');
      themeToggle.textContent = isMono ? 'CLARO' : 'OSCURO';
    }

    try {
      localStorage.setItem('roep-theme', isMono ? 'mono' : 'normal');
    } catch (_) { /* ignore */ }
  }

  function toggleTheme() {
    setTheme(!body.classList.contains('mono'));
  }

  // --- 2. Scroll Progress & Header ---
  function updateScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    
    if (progressBar) {
      progressBar.style.transform = `scaleX(${Math.min(progress, 1)})`;
    }
    
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 30);
    }
    
    scrollTicking = false;
  }

  function handleScroll() {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScroll);
      scrollTicking = true;
    }
  }

  // --- 3. Intersection Observer (Reveal) ---
  function setupRevealObserver() {
    const elements = $('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('visible', entry.isIntersecting);
      });
    }, {
      threshold: 0.16,
      rootMargin: '0px 0px -10% 0px'
    });

    elements.forEach(el => observer.observe(el));
    observerInstances.push(observer);
  }

  // --- 4. Section Navigation (Active Link) ---
  function setupSectionNavigation() {
    const links = $('.main-nav a[href^="#"]');
    const sections = links
      .map(link => {
        try {
          return $1(link.getAttribute('href'));
        } catch (_) { return null; }
      })
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(link => {
            const isActive = link.getAttribute('href') === `#${entry.target.id}`;
            link.classList.toggle('is-active', isActive);
          });
        }
      });
    }, {
      rootMargin: '-35% 0px -55% 0px',
      threshold: 0
    });

    sections.forEach(section => observer.observe(section));
    observerInstances.push(observer);
  }

  // --- 5. Mobile Menu ---
  function closeMenu() {
    mainNav?.classList.remove('open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = 'Menu';
    }
  }

  function toggleMenu() {
    if (!mainNav || !menuToggle) return;
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? 'Cerrar' : 'Menu';
  }

  function setupMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener('click', toggleMenu);

    $('.main-nav a[href^="#"]').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (!isMobile()) closeMenu();
    });
  }

  // --- 6. Portfolio Cards ---
  function setupPortfolioCards() {
    $('.portfolio-toggle').forEach(button => {
      button.addEventListener('click', function() {
        const card = this.closest('.portfolio-card');
        if (!card) return;

        const isOpen = card.classList.toggle('is-open');
        this.setAttribute('aria-expanded', String(isOpen));
        this.firstChild.textContent = isOpen ? 'Ocultar proyecto ' : 'Ver proyecto ';

        // Close other open cards
        $('.portfolio-card.is-open').forEach(other => {
          if (other !== card) {
            other.classList.remove('is-open');
            const btn = other.querySelector('.portfolio-toggle');
            if (btn) {
              btn.setAttribute('aria-expanded', 'false');
              btn.firstChild.textContent = 'Ver proyecto ';
            }
          }
        });
      });
    });
  }

  // --- 7. Carousels ---
  function setupCarousels() {
    $('.project-carousel').forEach(carousel => {
      const track = carousel.querySelector('.carousel-track');
      const slides = [...carousel.querySelectorAll('.carousel-slide')];
      const dots = carousel.querySelector('.carousel-dots');
      const prevBtn = carousel.querySelector('.carousel-prev');
      const nextBtn = carousel.querySelector('.carousel-next');

      if (!track || !slides.length || !dots) return;

      let current = 0;

      // Create dots
      slides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.className = `carousel-dot${index === 0 ? ' is-current' : ''}`;
        dot.type = 'button';
        dot.setAttribute('aria-label', `Mostrar captura ${index + 1}`);
        dot.addEventListener('click', () => showSlide(index));
        dots.appendChild(dot);

        // Handle image load
        const img = slide.querySelector('img');
        if (img) {
          img.addEventListener('load', () => slide.classList.add('has-image'));
          img.addEventListener('error', () => slide.classList.remove('has-image'));
        }
      });

      function showSlide(index) {
        current = ((index % slides.length) + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        
        const dotsList = dots.querySelectorAll('.carousel-dot');
        dotsList.forEach((dot, i) => {
          dot.classList.toggle('is-current', i === current);
        });
      }

      if (prevBtn) prevBtn.addEventListener('click', () => showSlide(current - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => showSlide(current + 1));
    });
  }

  // --- 8. Portfolio Insertion ---
  function addPortfolio() {
    const services = $1('.services');
    if (!services) return;

    // Only insert if not already there
    if ($1('#portfolio')) return;

    const portfolioHTML = `
      <section class="portfolio scene" id="portfolio">
        <div class="portfolio-heading reveal">
          <p class="eyebrow">01 / Portfolio</p>
          <h2>Trabajo que<br><em>se nota.</em></h2>
          <p>Soluciones creadas para resolver necesidades reales de negocios reales.</p>
        </div>
        <div class="portfolio-grid">
          <!-- Ruta 18 Card -->
          <article class="portfolio-card portfolio-route reveal">
            <div class="portfolio-visual route-visual">
              <span class="visual-tag">RUTA 18 / SAN SIMON ATZITZINTLA</span>
              <div class="admin-screen">
                <div class="screen-bar"><b>R18</b><span>Panel de administracion</span><i></i></div>
                <div class="screen-body">
                  <div class="screen-sidebar"><i></i><i></i><i></i><i></i></div>
                  <div class="screen-main">
                    <div class="screen-welcome">Resumen operativo <small>Datos de demostracion</small></div>
                    <div class="stat-row"><b>18 <small>Unidades activas</small></b><b>06 <small>Rutas en servicio</small></b><b>98% <small>Disponibilidad</small></b></div>
                    <div class="data-chart"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
                  </div>
                </div>
              </div>
              <span class="visual-status">VISTA DEMO / DATOS FICTICIOS</span>
            </div>
            <div class="portfolio-meta">
              <div>
                <small>TRANSPORTE PUBLICO</small>
                <h3>Ruta 18</h3>
                <p>Aplicacion web para administrar operaciones, rutas y control del transporte.</p>
              </div>
              <button class="portfolio-toggle" type="button" aria-expanded="false">Ver proyecto <span>+</span></button>
            </div>
            <div class="portfolio-details">
              <div class="project-carousel">
                <div class="carousel-track">
                  ${[1,2,3,4].map(n => `
                    <div class="carousel-slide">
                      <img src="img/ruta18-0${n}.png" alt="Captura ${n} de Ruta 18" loading="lazy">
                      <span>CAPTURA 0${n}</span>
                    </div>
                  `).join('')}
                </div>
                <button class="carousel-prev" type="button" aria-label="Captura anterior">←</button>
                <button class="carousel-next" type="button" aria-label="Captura siguiente">→</button>
                <div class="carousel-dots"></div>
              </div>
              <div class="project-info">
                <div><small>REFERENCIA</small><p>Administracion digital para una ruta de transporte publico en San Simon Atzitzintla.</p></div>
                <div><small>SE HIZO</small><p>Panel de control, gestion de unidades, rutas y seguimiento operativo.</p></div>
                <div><small>PRIVACIDAD</small><p>Usa capturas con datos ocultos o ficticios.</p></div>
              </div>
            </div>
          </article>

          <!-- Grupo Lobo Card -->
          <article class="portfolio-card portfolio-lobo reveal">
            <div class="portfolio-visual lobo-visual">
              <span class="visual-tag">GRUPO LOBO / DIGITAL</span>
              <div class="shop-screen">
                <div class="shop-nav"><b>LOBO</b><span>Catalogo　 Carrito</span></div>
                <div class="shop-hero">Encuentra<br><em>lo que buscas.</em></div>
                <div class="shop-products"><i></i><i></i><i></i></div>
                <div class="shop-price"><b>$ 1,249</b><span>Ver producto　→</span></div>
              </div>
              <span class="visual-status">TIENDA DIGITAL</span>
            </div>
            <div class="portfolio-meta">
              <div>
                <small>COMERCIO DIGITAL</small>
                <h3>Grupo Lobo</h3>
                <p>App web tipo tienda digital para mostrar productos y facilitar pedidos.</p>
              </div>
              <button class="portfolio-toggle" type="button" aria-expanded="false">Ver proyecto <span>+</span></button>
            </div>
            <div class="portfolio-details">
              <div class="project-carousel">
                <div class="carousel-track">
                  ${[1,2,3,4].map(n => `
                    <div class="carousel-slide">
                      <img src="img/grupo-lobo-0${n}.png" alt="Captura ${n} de Grupo Lobo" loading="lazy">
                      <span>CAPTURA 0${n}</span>
                    </div>
                  `).join('')}
                </div>
                <button class="carousel-prev" type="button" aria-label="Captura anterior">←</button>
                <button class="carousel-next" type="button" aria-label="Captura siguiente">→</button>
                <div class="carousel-dots"></div>
              </div>
              <div class="project-info">
                <div><small>REFERENCIA</small><p>Experiencia de compra digital para Grupo Lobo.</p></div>
                <div><small>SE HIZO</small><p>Catalogo, tarjetas de producto, precios y flujo de carrito para pedidos.</p></div>
                <div><small>PRIVACIDAD</small><p>Usa imagenes y datos de demostracion.</p></div>
              </div>
            </div>
          </article>
        </div>
      </section>
    `;

    services.insertAdjacentHTML('beforebegin', portfolioHTML);

    // Update navigation links
    const portfolioLink = $1('.main-nav a[href="#portfolio"]');
    if (portfolioLink) {
      portfolioLink.textContent = 'Portfolio';
    }

    const heroLink = $1('.hero-copy .action');
    if (heroLink) {
      heroLink.href = '#portfolio';
      const textNode = heroLink.firstChild;
      if (textNode) textNode.textContent = 'Ver portfolio ';
    }

    // Update services heading
    const servicesEyebrow = $1('.services .eyebrow');
    if (servicesEyebrow) servicesEyebrow.textContent = '02 / Servicios';
    
    const servicesTitle = $1('.services h2');
    if (servicesTitle) servicesTitle.innerHTML = 'Soluciones para<br><em>avanzar mejor.</em>';
  }

  // --- 9. Cleanup ---
  function cleanupObservers() {
    observerInstances.forEach(observer => observer.disconnect());
    observerInstances = [];
  }

  // --- 10. Init ---
  function init() {
    // Load theme
    let savedTheme = 'normal';
    try {
      savedTheme = localStorage.getItem('roep-theme') || 'normal';
    } catch (_) { /* ignore */ }
    setTheme(savedTheme === 'mono');

    // Add JS-ready class
    body.classList.add('js-ready');

    // Setup all features
    addPortfolio();
    updateScroll();
    setupRevealObserver();
    setupSectionNavigation();
    setupPortfolioCards();
    setupCarousels();
    setupMenu();

    // Event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      // Update scroll progress on resize
      updateScroll();
    });

    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanupObservers);
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();