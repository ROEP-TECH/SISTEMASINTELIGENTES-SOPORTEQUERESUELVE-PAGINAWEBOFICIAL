const body = document.body;
const progressBar = document.querySelector('.scroll-progress span');
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let scrollTicking = false;

function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .14 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

function updateScroll() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progressBar.style.transform = `scaleX(${progress})`;
  header.classList.toggle('is-scrolled', window.scrollY > 30);
  document.querySelectorAll('[data-speed]').forEach((element) => {
    const distance = (window.innerHeight / 2 - element.getBoundingClientRect().top) * Number(element.dataset.speed);
    element.style.setProperty('--parallax-y', `${distance}px`);
  });
  scrollTicking = false;
}

function setMotion(enabled) {
  body.classList.toggle('motion-off', !enabled);
  localStorage.setItem('roep-motion', enabled ? 'on' : 'off');
}

menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => mainNav.classList.remove('open')));
window.addEventListener('scroll', () => {
  if (!scrollTicking) { window.requestAnimationFrame(updateScroll); scrollTicking = true; }
}, { passive: true });

setMotion(localStorage.getItem('roep-motion') !== 'off' && !reduceMotion.matches);
revealOnScroll();
updateScroll();

if (!reduceMotion.matches) {
  const stage = document.querySelector('.hero-stage');
  stage.addEventListener('pointermove', (event) => {
    const bounds = stage.getBoundingClientRect();
    stage.style.setProperty('--mouse-x', `${(event.clientX - bounds.left - bounds.width / 2) * .04}px`);
    stage.style.setProperty('--mouse-y', `${(event.clientY - bounds.top - bounds.height / 2) * .04}px`);
  });
  stage.addEventListener('pointerleave', () => { stage.style.setProperty('--mouse-x', '0px'); stage.style.setProperty('--mouse-y', '0px'); });
}
