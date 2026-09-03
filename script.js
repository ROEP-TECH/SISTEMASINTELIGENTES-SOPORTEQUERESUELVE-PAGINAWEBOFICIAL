const body = document.body;
const progressBar = document.querySelector('.scroll-progress span');
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const themeToggle = document.querySelector('.theme-toggle');
const logos = document.querySelectorAll('.brand img, .site-footer img');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const speedItems = [...document.querySelectorAll('[data-speed]')];
let scenes = [...document.querySelectorAll('.scene')];
let scrollTicking = false;
body.classList.add('js-ready');

function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('visible', entry.isIntersecting));
  }, { threshold: .16, rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

function updateScroll() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progressBar.style.transform = `scaleX(${progress})`;
  header.classList.toggle('is-scrolled', window.scrollY > 30);
  speedItems.forEach((element) => {
    const distance = (window.innerHeight / 2 - element.getBoundingClientRect().top) * Number(element.dataset.speed);
    element.style.setProperty('--parallax-y', `${distance}px`);
  });
  scenes.forEach((scene) => {
    const bounds = scene.getBoundingClientRect();
    const centerDistance = (window.innerHeight / 2 - (bounds.top + bounds.height / 2)) / window.innerHeight;
    const sceneProgress = Math.max(0, Math.min(1, 1 - Math.abs(centerDistance) * 1.25));
    scene.style.setProperty('--scene-progress', sceneProgress.toFixed(3));
    scene.style.setProperty('--scene-shift', `${centerDistance * -55}px`);
  });
  scrollTicking = false;
}

function setMotion(enabled) {
  body.classList.toggle('motion-off', !enabled);
  localStorage.setItem('roep-motion', enabled ? 'on' : 'off');
}

function setTheme(mono) {
  body.classList.toggle('mono', mono);
  logos.forEach((logo) => {
    const source = mono ? logo.dataset.mono : logo.dataset.normal;
    if (source) logo.src = source;
  });
  themeToggle.setAttribute('aria-pressed', mono);
  themeToggle.setAttribute('aria-label', mono ? 'Activar modo claro' : 'Activar modo oscuro');
  themeToggle.textContent = mono ? 'CLARO' : 'OSCURO';
  localStorage.setItem('roep-theme', mono ? 'mono' : 'normal');
}


function addPortfolio() {
  const services = document.querySelector('.services');
  services.insertAdjacentHTML('beforebegin', `
    <section class="portfolio scene" id="portfolio">
      <div class="portfolio-heading reveal"><p class="eyebrow">01 / Portfolio</p><h2>Trabajo que<br><em>se nota.</em></h2><p>Soluciones creadas para resolver necesidades reales de negocios reales.</p></div>
      <div class="portfolio-grid">
        <article class="portfolio-card portfolio-route reveal"><div class="portfolio-visual route-visual"><span class="visual-tag">RUTA 18 / SAN SIMON ATZITZINTLA</span><div class="admin-screen"><div class="screen-bar"><b>R18</b><span>Panel de administracion</span><i></i></div><div class="screen-body"><div class="screen-sidebar"><i></i><i></i><i></i><i></i></div><div class="screen-main"><div class="screen-welcome">Resumen operativo <small>Datos de demostracion</small></div><div class="stat-row"><b>18 <small>Unidades activas</small></b><b>06 <small>Rutas en servicio</small></b><b>98% <small>Disponibilidad</small></b></div><div class="data-chart"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div></div><span class="visual-status">VISTA DEMO / DATOS FICTICIOS</span></div><div class="portfolio-meta"><div><small>TRANSPORTE PUBLICO</small><h3>Ruta 18</h3><p>Aplicacion web para administrar operaciones, rutas y control del transporte.</p></div><button class="portfolio-toggle" type="button" aria-expanded="false">Ver proyecto <span>+</span></button></div><div class="portfolio-details"><div class="project-carousel"><div class="carousel-track"><div class="carousel-slide"><img src="img/ruta18-01.png" alt="Captura 1 de Ruta 18"><span>CAPTURA 01</span></div><div class="carousel-slide"><img src="img/ruta18-02.png" alt="Captura 2 de Ruta 18"><span>CAPTURA 02</span></div><div class="carousel-slide"><img src="img/ruta18-03.png" alt="Captura 3 de Ruta 18"><span>CAPTURA 03</span></div><div class="carousel-slide"><img src="img/ruta18-04.png" alt="Captura 4 de Ruta 18"><span>CAPTURA 04</span></div></div><button class="carousel-prev" type="button" aria-label="Captura anterior">←</button><button class="carousel-next" type="button" aria-label="Captura siguiente">→</button><div class="carousel-dots"></div></div><div class="project-info"><div><small>REFERENCIA</small><p>Administracion digital para una ruta de transporte publico en San Simon Atzitzintla.</p></div><div><small>SE HIZO</small><p>Panel de control, gestion de unidades, rutas y seguimiento operativo.</p></div><div><small>PRIVACIDAD</small><p>Usa capturas con datos ocultos o ficticios.</p></div></div></div></article>
        <article class="portfolio-card portfolio-lobo reveal"><div class="portfolio-visual lobo-visual"><span class="visual-tag">GRUPO LOBO / DIGITAL</span><div class="shop-screen"><div class="shop-nav"><b>LOBO</b><span>Catalogo　 Carrito</span></div><div class="shop-hero">Encuentra<br><em>lo que buscas.</em></div><div class="shop-products"><i></i><i></i><i></i></div><div class="shop-price"><b>$ 1,249</b><span>Ver producto　→</span></div></div><span class="visual-status">TIENDA DIGITAL</span></div><div class="portfolio-meta"><div><small>COMERCIO DIGITAL</small><h3>Grupo Lobo</h3><p>App web tipo tienda digital para mostrar productos y facilitar pedidos.</p></div><button class="portfolio-toggle" type="button" aria-expanded="false">Ver proyecto <span>+</span></button></div><div class="portfolio-details"><div class="project-carousel"><div class="carousel-track"><div class="carousel-slide"><img src="img/grupo-lobo-01.png" alt="Captura 1 de Grupo Lobo"><span>CAPTURA 01</span></div><div class="carousel-slide"><img src="img/grupo-lobo-02.png" alt="Captura 2 de Grupo Lobo"><span>CAPTURA 02</span></div><div class="carousel-slide"><img src="img/grupo-lobo-03.png" alt="Captura 3 de Grupo Lobo"><span>CAPTURA 03</span></div><div class="carousel-slide"><img src="img/grupo-lobo-04.png" alt="Captura 4 de Grupo Lobo"><span>CAPTURA 04</span></div></div><button class="carousel-prev" type="button" aria-label="Captura anterior">←</button><button class="carousel-next" type="button" aria-label="Captura siguiente">→</button><div class="carousel-dots"></div></div><div class="project-info"><div><small>REFERENCIA</small><p>Experiencia de compra digital para Grupo Lobo.</p></div><div><small>SE HIZO</small><p>Catalogo, tarjetas de producto, precios y flujo de carrito para pedidos.</p></div><div><small>PRIVACIDAD</small><p>Usa imagenes y datos de demostracion.</p></div></div></div></article>
      </div>
    </section>`);
  const portfolioLink = document.querySelector('.main-nav a');
  const heroLink = document.querySelector('.hero-copy .action');
  portfolioLink.href = '#portfolio';
  portfolioLink.textContent = 'Portfolio';
  heroLink.href = '#portfolio';
  heroLink.firstChild.textContent = 'Ver portfolio ';
  services.querySelector('.eyebrow').textContent = '02 / Servicios';
  services.querySelector('h2').innerHTML = 'Soluciones para<br><em>avanzar mejor.</em>';
  scenes = [...document.querySelectorAll('.scene')];
}

function activateScenes() {
  scenes.forEach((scene) => scene.classList.add('active'));
}

function setupSectionNavigation() {
  const links = [...document.querySelectorAll('.main-nav a')];
  const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}

function setupPortfolioCards() {
  document.querySelectorAll('.portfolio-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.portfolio-card');
      const isOpen = card.classList.toggle('is-open');
      button.setAttribute('aria-expanded', isOpen);
      button.firstChild.textContent = isOpen ? 'Ocultar proyecto ' : 'Ver proyecto ';
      document.querySelectorAll('.portfolio-card.is-open').forEach((otherCard) => {
        if (otherCard !== card) {
          otherCard.classList.remove('is-open');
          const otherButton = otherCard.querySelector('.portfolio-toggle');
          otherButton.setAttribute('aria-expanded', 'false');
          otherButton.firstChild.textContent = 'Ver proyecto ';
        }
      });
    });
  });
}

function setupCarousels() {
  document.querySelectorAll('.project-carousel').forEach((carousel) => {
    const track = carousel.querySelector('.carousel-track');
    const slides = [...carousel.querySelectorAll('.carousel-slide')];
    const dots = carousel.querySelector('.carousel-dots');
    let current = 0;
    slides.forEach((slide, index) => {
      const image = slide.querySelector('img');
      const dot = document.createElement('button');
      dot.className = `carousel-dot${index === 0 ? ' is-current' : ''}`;
      dot.type = 'button';
      dot.setAttribute('aria-label', `Mostrar captura ${index + 1}`);
      dot.addEventListener('click', () => showSlide(index));
      dots.appendChild(dot);
      image.addEventListener('load', () => slide.classList.add('has-image'));
      image.addEventListener('error', () => slide.classList.remove('has-image'));
    });
    const showSlide = (index) => {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.querySelectorAll('.carousel-dot').forEach((dot, dotIndex) => dot.classList.toggle('is-current', dotIndex === current));
    };
    carousel.querySelector('.carousel-prev').addEventListener('click', () => showSlide(current - 1));
    carousel.querySelector('.carousel-next').addEventListener('click', () => showSlide(current + 1));
  });
}

function closeMenu() {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = 'Menu';
}

menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
  menuToggle.textContent = open ? 'Cerrar' : 'Menu';
});
document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('click', (event) => {
  if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 800) closeMenu();
});
window.addEventListener('scroll', () => {
  if (!scrollTicking) { window.requestAnimationFrame(updateScroll); scrollTicking = true; }
}, { passive: true });

localStorage.removeItem('roep-motion');
setMotion(true);
body.classList.add('force-motion');
setTheme(localStorage.getItem('roep-theme') === 'mono');
addPortfolio();
activateScenes();
updateScroll();
revealOnScroll();
setupSectionNavigation();
setupPortfolioCards();
setupCarousels();

themeToggle.addEventListener('click', () => setTheme(!body.classList.contains('mono')));

if (!reduceMotion.matches) {
  const stage = document.querySelector('.hero-stage');
  stage.addEventListener('pointermove', (event) => {
    const bounds = stage.getBoundingClientRect();
    stage.style.setProperty('--mouse-x', `${(event.clientX - bounds.left - bounds.width / 2) * .04}px`);
    stage.style.setProperty('--mouse-y', `${(event.clientY - bounds.top - bounds.height / 2) * .04}px`);
  });
  stage.addEventListener('pointerleave', () => { stage.style.setProperty('--mouse-x', '0px'); stage.style.setProperty('--mouse-y', '0px'); });
}
