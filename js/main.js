/* TORFIX main.js */

/* PAGE TRANSITION */
const pageOverlay = document.getElementById('page-overlay');

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link || !pageOverlay) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('javascript')) return;
  if (link.target === '_blank') return;
  e.preventDefault();
  pageOverlay.classList.add('active');
  setTimeout(() => { window.location.href = href; }, 380);
});

/* SCROLL PROGRESS BAR */
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });
}

/* NAVBAR keep consistent */
const navbar = document.getElementById('navbar');
const heroSection = document.getElementById('hero');

function updateNavbar() {
  if (!navbar) return;
  navbar.classList.remove('nav-light');
  navbar.classList.remove('scrolled');
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* MOBILE MENU */
const burger = document.getElementById('burger');
const navMobile = document.getElementById('nav-mobile');

function closeMobile() {
  if (navMobile) navMobile.classList.remove('open');
  if (burger) burger.classList.remove('open');
  if (burger) burger.setAttribute('aria-expanded', 'false');
}
if (burger) {
  burger.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });
}

/* PARALLAX HERO DOT GRID */
const heroParallax = document.getElementById('hero-parallax');
if (heroParallax && heroSection) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.5) {
      heroParallax.style.transform = `translateY(${y * 0.18}px)`;
    }
  }, { passive: true });
}

/* SCROLL ANIMATIONS (Intersection Observer) */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-up').forEach((el, i) => {
  const siblings = el.parentElement.querySelectorAll('.fade-up');
  if (siblings.length > 1) {
    siblings.forEach((sib, idx) => {
      sib.style.transitionDelay = (idx * 0.09) + 's';
    });
  }
  observer.observe(el);
});

/* COUNTER ANIMATION */
function animateCounter(el, target, prefix, suffix, duration) {
  const startTime = performance.now();
  const update = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.counter);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (!isNaN(target)) animateCounter(el, target, prefix, suffix, 1600);
    counterObs.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-counter]').forEach(el => counterObs.observe(el));

/* NICHES */
const NICHES_BY_LANG = {
  fr: {
    b: { color: '#6C47FF', items: ['Coiffeur / coiffeuse','Institut de beaut\u00E9','Barbier','Nail artist','Spa & massage','Tatoueur','Esth\u00E9ticienne \u00E0 domicile'] },
    f: { color: '#F59E0B', items: ['Restaurant','Traiteur','Food truck','Boulangerie-p\u00E2tisserie','Caf\u00E9 & brunch','Chef \u00E0 domicile'] },
    c: { color: '#3B82F6', items: ['Coach sportif','Coach de vie','Formateur en ligne','Professeur particulier','Th\u00E9rapeute & psy','Nutritionniste'] },
    s: { color: '#10B981', items: ['Plombier','\u00C9lectricien','Menuisier','Photographe','Cleaner / m\u00E9nage','Jardinier & paysagiste'] }
  },
  en: {
    b: { color: '#6C47FF', items: ['Hair salon','Beauty studio','Barbershop','Nail artist','Spa & massage','Tattoo studio','Mobile esthetician'] },
    f: { color: '#F59E0B', items: ['Restaurant','Catering','Food truck','Bakery','Cafe & brunch','Private chef'] },
    c: { color: '#3B82F6', items: ['Fitness coach','Life coach','Online educator','Private tutor','Therapist','Nutrition coach'] },
    s: { color: '#10B981', items: ['Plumber','Electrician','Carpenter','Photographer','Cleaning service','Gardener & landscaping'] }
  }
};
const pageLang = document.documentElement.lang === 'en' ? 'en' : 'fr';
const NICHES = NICHES_BY_LANG[pageLang];

Object.entries(NICHES).forEach(([key, val]) => {
  const el = document.getElementById('lg-' + key);
  if (!el) return;
  el.innerHTML = val.items.map(item =>
    `<a class="nd-item" href="#">
      <div class="nd-dot" style="background:${val.color}"></div>
      <span class="nd-label">${item}</span>
      <span class="nd-arr">&#8250;</span>
    </a>`
  ).join('');
});

let currentNiche = 'b';

function toggleNiche(key) {
  if (currentNiche) {
    document.getElementById('nc-' + currentNiche)?.classList.remove('niche-open');
    document.getElementById('dp-' + currentNiche)?.classList.remove('niche-open');
    document.getElementById('nc-' + currentNiche)?.setAttribute('aria-expanded', 'false');
  }
  if (currentNiche === key) { currentNiche = null; return; }
  document.getElementById('nc-' + key)?.classList.add('niche-open');
  document.getElementById('dp-' + key)?.classList.add('niche-open');
  document.getElementById('nc-' + key)?.setAttribute('aria-expanded', 'true');
  currentNiche = key;
}

document.querySelectorAll('.niche-card[role="button"]').forEach((card) => {
  card.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    toggleNiche(card.id.replace('nc-', ''));
  });
});

/* FAQ */
function toggleFaq(btn) {
  const item = btn.parentElement;
  const answer = item.querySelector('.faq-a');
  const icon = btn.querySelector('.faq-icon');
  const isOpen = item.classList.contains('faq-open');

  document.querySelectorAll('.faq-item').forEach(i => {
    i.classList.remove('faq-open');
    const a = i.querySelector('.faq-a');
    const ic = i.querySelector('.faq-icon');
    const q = i.querySelector('.faq-q');
    if (a) { a.style.maxHeight = '0'; a.style.opacity = '0'; }
    if (ic) ic.textContent = '+';
    if (q) q.setAttribute('aria-expanded', 'false');
  });

  if (!isOpen) {
    item.classList.add('faq-open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
    answer.style.opacity = '1';
    icon.textContent = '\u2212';
  }
}

// Init FAQ
document.querySelectorAll('.faq-item').forEach(item => {
  const a = item.querySelector('.faq-a');
  if (!a) return;
  if (item.classList.contains('faq-open')) {
    a.style.maxHeight = a.scrollHeight + 'px';
    a.style.opacity = '1';
    item.querySelector('.faq-q')?.setAttribute('aria-expanded', 'true');
  } else {
    a.style.maxHeight = '0';
    a.style.opacity = '0';
    a.style.display = '';
    item.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
  }
});

/* MODAL */
const modal = document.getElementById('modal');
const step1El = document.getElementById('step-1');
const step2El = document.getElementById('step-2');
const stepSuccessEl = document.getElementById('step-success');
const prog1 = document.getElementById('prog-1');
const prog2 = document.getElementById('prog-2');

function openModal() {
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  showStep(1);
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function handleOverlayClick(e) {
  if (e.target === modal) closeModal();
}

function showStep(n) {
  if (step1El) step1El.style.display = n === 1 ? 'block' : 'none';
  if (step2El) step2El.style.display = n === 2 ? 'block' : 'none';
  if (stepSuccessEl) stepSuccessEl.style.display = n === 3 ? 'block' : 'none';
  if (prog1) { prog1.classList.toggle('active', n === 1); prog1.classList.toggle('done', n > 1); }
  if (prog2) { prog2.classList.toggle('active', n === 2); prog2.classList.toggle('done', n === 3); }
}

function goStep2(e) {
  e.preventDefault();
  const form = document.getElementById('form-step1');
  if (!form || !validateStep1(form)) return;
  document.getElementById('h-prenom').value    = form.prenom.value.trim();
  document.getElementById('h-entreprise').value = form.entreprise.value.trim();
  document.getElementById('h-secteur').value   = form.secteur.value;
  document.getElementById('h-email').value     = form.email.value.trim();
  document.getElementById('h-tel').value       = form.tel.value.trim();
  showStep(2);
  document.querySelector('.modal-box')?.scrollTo(0, 0);
}

function goStep1() {
  showStep(1);
  document.querySelector('.modal-box')?.scrollTo(0, 0);
}

function validateStep1(form) {
  let valid = true;
  const required = form.querySelectorAll('[required]');
  required.forEach(field => {
    field.classList.remove('input-error');
    if (!field.value.trim()) {
      field.classList.add('input-error');
      field.style.borderColor = 'var(--red)';
      valid = false;
    } else {
      field.style.borderColor = '';
    }
  });
  return valid;
}

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const selectedFormula = form.querySelector('input[name="formule"]:checked');
  if (!selectedFormula) {
    form.querySelector('input[name="formule"]')?.focus();
    return;
  }
  const btn = form.querySelector('[type="submit"]');
  btn.textContent = pageLang === 'en' ? 'Sending...' : 'Envoi en cours...';
  btn.disabled = true;

  try {
    const data = new FormData(form);
    const res = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      showStep(3);
    } else {
      btn.textContent = pageLang === 'en' ? 'Error - please try again' : 'Erreur - réessayez';
      btn.disabled = false;
    }
  } catch {
    btn.textContent = pageLang === 'en' ? 'Error - please try again' : 'Erreur - réessayez';
    btn.disabled = false;
  }
}

/* KEYBOARD ESC closes modal */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
