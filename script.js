const body = document.body;
const header = document.querySelector('.header');
const progress = document.querySelector('.progress');
const themeButton = document.querySelector('.theme-button');
const menuButton = document.querySelector('.menu-button');
const navMenu = document.querySelector('.nav-menu');
const animationToggle = document.querySelector('.animation-toggle');
const logos = document.querySelectorAll('.logo');
const heroArt = document.querySelector('.hero-art');
const parallaxItems = document.querySelectorAll('.hero-art, .statement-text, .project-image, .contact-signal');
let ticking = false;

function setupCinematicMotion() {
  if (!window.gsap || !window.ScrollTrigger) return;
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  gsap.killTweensOf('*');
  if (body.classList.contains('no-motion') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);
  const desktop = window.matchMedia('(min-width: 821px)').matches;
  const revealItems = gsap.utils.toArray('.reveal');

  revealItems.forEach((element, index) => {
    gsap.fromTo(element, { opacity: 0, y: 45, clipPath: 'inset(0 0 18% 0)' }, {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0 0 0% 0)',
      duration: 1,
      delay: (index % 3) * 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 86%', toggleActions: 'play none none reverse' }
    });
  });

  gsap.to('.hero-copy', { yPercent: -18, opacity: .22, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-art', { yPercent: 22, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.orbit-a', { rotation: 150, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 } });
  gsap.to('.orbit-b', { rotation: -120, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.8 } });
  gsap.to('.grid-overlay', { backgroundPosition: '0 180px', ease: 'none', scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: 1.5 } });

  if (desktop) {
    ScrollTrigger.create({ trigger: '.statement', start: 'top top', end: '+=560', pin: true, pinSpacing: true, scrub: true });
    gsap.fromTo('.statement-text', { xPercent: 12, scale: .86 }, { xPercent: -5, scale: 1.04, ease: 'none', scrollTrigger: { trigger: '.statement', start: 'top top', end: '+=560', scrub: true } });
  }

  gsap.to('.service-bento', { scale: .96, ease: 'none', scrollTrigger: { trigger: '.services', start: 'top 75%', end: 'bottom 20%', scrub: 1 } });
  gsap.utils.toArray('.section').forEach((section) => {
    const scene = section.querySelector('.service-bento, .project-list, .method-steps, .contact-box');
    gsap.fromTo(section, { clipPath: 'inset(5% 0 5% 0)' }, {
      clipPath: 'inset(0% 0 0% 0)',
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top 92%', end: 'top 38%', scrub: true }
    });
    if (scene) {
      gsap.fromTo(scene, { y: 70, scale: .94 }, {
        y: 0,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 88%', end: 'top 35%', scrub: 1.1 }
      });
    }
  });
  gsap.utils.toArray('.project-image').forEach((image, index) => {
    gsap.fromTo(image, { scale: .88, y: index % 2 ? 35 : -25 }, { scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: image, start: 'top 95%', end: 'top 35%', scrub: true } });
  });
  gsap.to('.contact-signal', { rotation: 180, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top', scrub: true } });
}

function setAnimations(enabled) {
  body.classList.toggle('no-motion', !enabled);
  animationToggle.setAttribute('aria-pressed', enabled);
  animationToggle.querySelector('span').textContent = `Animaciones: ${enabled ? 'ON' : 'OFF'}`;
  localStorage.setItem('roep-motion', enabled ? 'on' : 'off');
  if (!enabled) {
    parallaxItems.forEach((item) => {
      item.style.setProperty('--parallax-y', '0px');
      item.style.setProperty('--mouse-x', '0px');
      item.style.setProperty('--mouse-y', '0px');
    });
  }
  setupCinematicMotion();
}

function setTheme(isLight) {
  body.classList.toggle('light', isLight);
  logos.forEach((logo) => {
    logo.src = isLight ? logo.dataset.light : logo.dataset.dark;
  });
  themeButton.setAttribute('aria-label', isLight ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro');
  localStorage.setItem('roep-theme', isLight ? 'light' : 'dark');
}

setTheme(localStorage.getItem('roep-theme') === 'light');
setAnimations(localStorage.getItem('roep-motion') !== 'off');

body.classList.add('motion-ready');
const sceneObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.16 });

document.querySelectorAll('.section, .statement').forEach((section) => {
  section.classList.add('scroll-scene');
  sceneObserver.observe(section);
});

themeButton.addEventListener('click', () => {
  setTheme(!body.classList.contains('light'));
});

animationToggle.addEventListener('click', () => {
  setAnimations(body.classList.contains('no-motion'));
});

menuButton.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', isOpen);
  menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

document.querySelectorAll('.nav-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

function updateScrollState() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrollRatio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progress.style.transform = `scaleX(${scrollRatio})`;
  header.classList.toggle('scrolled', window.scrollY > 30);
  if (!body.classList.contains('no-motion') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    parallaxItems.forEach((item, index) => {
      const bounds = item.getBoundingClientRect();
      const distance = (window.innerHeight / 2 - (bounds.top + bounds.height / 2)) * (index % 2 ? 0.035 : -0.055);
      item.style.setProperty('--parallax-y', `${distance}px`);
    });
  }
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateScrollState();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
updateScrollState();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const nativeMotionStyles = document.createElement('style');
nativeMotionStyles.textContent = `
  .motion-ready:not(.no-motion) .scroll-scene { opacity: 0; transform: translateY(64px) scale(.96); filter: blur(7px); transition: opacity .95s ease, transform 1.1s cubic-bezier(.2,.8,.2,1), filter .95s ease; }
  .motion-ready:not(.no-motion) .scroll-scene.in-view { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
  .motion-ready:not(.no-motion) .scroll-scene.in-view .section-top { animation: scene-heading .9s both cubic-bezier(.2,.8,.2,1); }
  .motion-ready:not(.no-motion) .scroll-scene.in-view .service:nth-child(2), .motion-ready:not(.no-motion) .scroll-scene.in-view .project:nth-child(2), .motion-ready:not(.no-motion) .scroll-scene.in-view .method-step:nth-child(2) { transition-delay: .12s; }
  .motion-ready:not(.no-motion) .scroll-scene.in-view .service:nth-child(3), .motion-ready:not(.no-motion) .scroll-scene.in-view .project:nth-child(3), .motion-ready:not(.no-motion) .scroll-scene.in-view .method-step:nth-child(3) { transition-delay: .24s; }
  @keyframes scene-heading { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: translateX(0); } }
  @media (prefers-reduced-motion: reduce) { .motion-ready .scroll-scene { opacity: 1; transform: none; filter: none; } }
`;
document.head.appendChild(nativeMotionStyles);

if (heroArt && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroArt.addEventListener('pointermove', (event) => {
    if (body.classList.contains('no-motion')) return;
    const bounds = heroArt.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroArt.style.setProperty('--mouse-x', `${x * 8}px`);
    heroArt.style.setProperty('--mouse-y', `${y * 8}px`);
  });
  heroArt.addEventListener('pointerleave', () => {
    heroArt.style.setProperty('--mouse-x', '0px');
    heroArt.style.setProperty('--mouse-y', '0px');
  });
}

if (window.lucide) lucide.createIcons();
