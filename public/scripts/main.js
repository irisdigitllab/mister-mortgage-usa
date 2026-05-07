/* ============================================================
   MISTER MORTGAGE USA — main.js
   ============================================================ */

// ─── NAVBAR SCROLL ───
(function() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

// ─── ACTIVE NAV LINK (based on current page URL) ───
(function() {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(function(link) {
    if (link.dataset.page === page) link.classList.add('active');
  });
})();

// ─── MOBILE MENU ───
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobile-menu');
var mobileClose = document.getElementById('mobile-close');
if (hamburger) hamburger.addEventListener('click', function() {
  mobileMenu.classList.add('open');
  document.body.classList.add('menu-open');
});
function closeMobileMenu() {
  if (mobileMenu) mobileMenu.classList.remove('open');
  document.body.classList.remove('menu-open');
}
if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

// ─── SCROLL REVEAL ───
function initReveal() {
  var reveals = document.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  reveals.forEach(function(el) {
    if (!el.classList.contains('visible')) observer.observe(el);
  });
}
window.addEventListener('load', initReveal);
window.addEventListener('scroll', initReveal, { passive: true });

// ─── GALLERY IN-VIEW ───
(function() {
  function initGallery() {
    var items = document.querySelectorAll('.gallery-item');
    if (!items.length) return;
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('in-view'); observer.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    items.forEach(function(el) { observer.observe(el); });
  }
  if (document.readyState === 'loading') window.addEventListener('load', initGallery);
  else initGallery();
})();

// ─── CUSTOM CURSOR ───
(function() {
  var dot = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  var mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
  document.querySelectorAll('a, button, .loan-card, .team-card, .loan-full-card').forEach(function(el) {
    el.addEventListener('mouseenter', function() { document.body.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', function() { document.body.classList.remove('cursor-hover'); });
  });
})();

// ─── CONTACT FORM ───
function handleFormSubmit(e) {
  e.preventDefault();
  var btn = e.target.querySelector('[type="submit"]');
  btn.textContent = 'Message Sent! ✓';
  btn.style.background = '#16a34a';
  setTimeout(function() {
    btn.innerHTML = 'Send Message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:middle;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}

// ─── FAQ ACCORDION ───
function toggleFaq(el) {
  var item = el.parentElement;
  var wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(i) { i.classList.remove('open'); });
  if (!wasOpen) item.classList.add('open');
}

// ─── GSAP ANIMATIONS ───
window.addEventListener('load', function() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero (only on home page)
  if (document.querySelector('.hero-h1')) {
    gsap.from('.hero-badge', { opacity: 0, y: 24, duration: 0.7, delay: 0.2, ease: 'power2.out' });
    gsap.from('.hero-h1',   { opacity: 0, y: 36, duration: 0.8, delay: 0.4, ease: 'power2.out' });
    gsap.from('.hero-sub',  { opacity: 0, y: 20, duration: 0.7, delay: 0.65, ease: 'power2.out' });
    gsap.from('.hero-actions', { opacity: 0, y: 20, duration: 0.7, delay: 0.85, ease: 'power2.out' });
    gsap.from('.hero-trust',   { opacity: 0, y: 16, duration: 0.7, delay: 1.0, ease: 'power2.out' });
    gsap.from('.hero-right',   { opacity: 0, x: 48, duration: 1.0, delay: 0.5, ease: 'power2.out' });
  }

  // Stats counter
  gsap.utils.toArray('.stat-num').forEach(function(el) {
    var text = el.textContent;
    var num = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(num) || num === 0) return;
    var prefix = text.match(/^[^0-9]*/)[0];
    var suffix = text.match(/[^0-9.]*$/)[0];
    gsap.fromTo(el, { innerText: 0 }, {
      innerText: num, duration: 1.8, ease: 'power2.out',
      snap: { innerText: num > 100 ? 1 : 0.1 },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: function() { el.textContent = prefix + Math.round(parseFloat(el.innerText || 0)) + suffix; }
    });
  });

  // Calculator entrance
  if (document.getElementById('calculator')) {
    gsap.from('#calculator .section-label', { opacity: 0, y: 20, duration: 0.6, scrollTrigger: { trigger: '#calculator', start: 'top 80%' } });
    gsap.from('#calculator .calc-controls', { opacity: 0, x: -40, duration: 0.8, delay: 0.2, scrollTrigger: { trigger: '#calculator .calc-grid', start: 'top 80%' } });
    gsap.from('#calculator .calc-results',  { opacity: 0, x: 40,  duration: 0.8, delay: 0.3, scrollTrigger: { trigger: '#calculator .calc-grid', start: 'top 80%' } });
  }
});

// ─── MORTGAGE CALCULATOR ───
var calcTerm = 30;

function setTerm(t) {
  calcTerm = t;
  document.getElementById('btn-30').classList.toggle('active', t === 30);
  document.getElementById('btn-15').classList.toggle('active', t === 15);
  updateCalc();
}

function fmtDollar(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function updateCalc() {
  var priceEl = document.getElementById('calc-price');
  if (!priceEl) return;
  var price = parseFloat(priceEl.value);
  var dpPct  = parseFloat(document.getElementById('calc-dp').value);
  var annualRate = parseFloat(document.getElementById('calc-rate').value);
  var n = calcTerm * 12;
  var dp = price * dpPct / 100;
  var principal = price - dp;
  var r = annualRate / 100 / 12;
  var monthly = r > 0 ? principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : principal / n;
  var totalCost = monthly * n;
  var totalInterest = totalCost - principal;
  document.getElementById('lbl-price').textContent = fmtDollar(price);
  document.getElementById('lbl-dp').textContent = dpPct.toFixed(1) + '%';
  document.getElementById('lbl-rate').textContent = annualRate.toFixed(1) + '%';
  document.getElementById('calc-monthly').textContent = fmtDollar(monthly);
  document.getElementById('calc-principal').textContent = fmtDollar(principal);
  document.getElementById('calc-dp-amt').textContent = fmtDollar(dp);
  document.getElementById('calc-interest').textContent = fmtDollar(totalInterest);
  document.getElementById('calc-total').textContent = fmtDollar(totalCost);
}

if (document.getElementById('calc-price')) updateCalc();

// ─── TRANSLATION HELPER ───
function tr(key) {
  var lang = document.documentElement.lang || 'en';
  return (window.I18N && window.I18N[lang] && window.I18N[lang][key] !== undefined)
    ? window.I18N[lang][key]
    : (window.I18N && window.I18N['en'] && window.I18N['en'][key]) || key;
}

// ─── PRE-QUAL MODAL ───
var modalStep = 1;
var modalAnswers = {};
var totalSteps = 7;

/* label = English value stored in modalAnswers (used for logic comparisons)
   qKey / subKey = i18n keys for display text */
var modalSteps = [
  { qKey: 'modal.q1', options: [
    { label: 'Purchase a Home',   key: 'modal.q1.opt1', subKey: 'modal.q1.opt1.sub' },
    { label: 'Refinance My Home', key: 'modal.q1.opt2', subKey: 'modal.q1.opt2.sub' }
  ]},
  { qKey: 'modal.q2', options: [
    { label: 'Primary Residence',   key: 'modal.q2.opt1', subKey: 'modal.q2.opt1.sub' },
    { label: 'Investment Property', key: 'modal.q2.opt2', subKey: 'modal.q2.opt2.sub' },
    { label: 'Vacation Home',       key: 'modal.q2.opt3', subKey: 'modal.q2.opt3.sub' },
    { label: 'Multi-Family',        key: 'modal.q2.opt4', subKey: 'modal.q2.opt4.sub' }
  ]},
  { qKey: 'modal.q3', options: [
    { label: 'Under $300K',    key: 'modal.q3.opt1', subKey: '' },
    { label: '$300K – $500K',  key: 'modal.q3.opt2', subKey: '' },
    { label: '$500K – $800K',  key: 'modal.q3.opt3', subKey: '' },
    { label: '$800K – $1.2M',  key: 'modal.q3.opt4', subKey: '' },
    { label: 'Over $1.2M',     key: 'modal.q3.opt5', subKey: '' }
  ]},
  { qKey: 'modal.q4', options: [
    { label: 'Less than 3.5%', key: 'modal.q4.opt1', subKey: 'modal.q4.opt1.sub' },
    { label: '3.5% – 10%',     key: 'modal.q4.opt2', subKey: 'modal.q4.opt2.sub' },
    { label: '10% – 20%',      key: 'modal.q4.opt3', subKey: 'modal.q4.opt3.sub' },
    { label: 'Over 20%',       key: 'modal.q4.opt4', subKey: 'modal.q4.opt4.sub' }
  ]},
  { qKey: 'modal.q5', options: [
    { label: 'Excellent',      key: 'modal.q5.opt1', subKey: 'modal.q5.opt1.sub' },
    { label: 'Good',           key: 'modal.q5.opt2', subKey: 'modal.q5.opt2.sub' },
    { label: 'Fair',           key: 'modal.q5.opt3', subKey: 'modal.q5.opt3.sub' },
    { label: 'Below Average',  key: 'modal.q5.opt4', subKey: 'modal.q5.opt4.sub' }
  ]},
  { qKey: 'modal.q6', options: [
    { label: 'Employed (W-2)',  key: 'modal.q6.opt1', subKey: 'modal.q6.opt1.sub' },
    { label: 'Self-Employed',   key: 'modal.q6.opt2', subKey: 'modal.q6.opt2.sub' },
    { label: 'Retired',         key: 'modal.q6.opt3', subKey: 'modal.q6.opt3.sub' },
    { label: 'Other',           key: 'modal.q6.opt4', subKey: 'modal.q6.opt4.sub' }
  ]},
  { qKey: 'contact' }
];

function openPrequalModal() {
  modalStep = 1; modalAnswers = {};
  document.getElementById('prequal-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderModalStep();
  if (typeof gsap !== 'undefined') gsap.from('#modal-box', { opacity: 0, y: 30, duration: 0.4, ease: 'power2.out' });
}

function closePrequalModal() {
  document.getElementById('prequal-modal').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function() {
  var overlay = document.getElementById('prequal-modal');
  if (overlay) overlay.addEventListener('click', function(e) { if (e.target === this) closePrequalModal(); });
  var loanOverlay = document.getElementById('loan-info-modal');
  if (loanOverlay) loanOverlay.addEventListener('click', function(e) { if (e.target === this) closeLoanModal(); });
});

function renderModalStep() {
  var pct = ((modalStep - 1) / totalSteps) * 100;
  document.getElementById('modal-progress').style.width = pct + '%';
  var data = modalSteps[modalStep - 1];
  var html = '';
  var stepLabel = tr('modal.step.label') + ' ' + modalStep + ' ' + tr('modal.step.of') + ' ' + totalSteps;
  if (data.qKey === 'contact') {
    html  = '<div class="modal-step-label">' + stepLabel + '</div>';
    html += '<div class="modal-question">' + tr('modal.contact.title') + '</div>';
    html += '<form class="modal-form" onsubmit="submitPrequal(event)">';
    html += '<div class="modal-form-row"><div class="form-group"><label>' + tr('modal.form.fname') + '</label><input type="text" name="fname" placeholder="' + tr('modal.form.fname.ph') + '" required /></div><div class="form-group"><label>' + tr('modal.form.lname') + '</label><input type="text" name="lname" placeholder="' + tr('modal.form.lname.ph') + '" required /></div></div>';
    html += '<div class="modal-form-row"><div class="form-group"><label>' + tr('modal.form.phone') + '</label><input type="tel" name="phone" placeholder="' + tr('modal.form.phone.ph') + '" required /></div><div class="form-group"><label>' + tr('modal.form.email') + '</label><input type="email" name="email" placeholder="' + tr('modal.form.email.ph') + '" required /></div></div>';
    html += '<div class="modal-nav" style="margin-top:1rem;"><button type="button" class="modal-btn-back" onclick="prevStep()">' + tr('modal.btn.back') + '</button><button type="submit" class="modal-btn-next">' + tr('modal.btn.submit') + '</button></div></form>';
  } else {
    html  = '<div class="modal-step-label">' + stepLabel + '</div>';
    html += '<div class="modal-question">' + tr(data.qKey) + '</div>';
    var cols = data.options.length > 3 ? '' : ' cols-1';
    html += '<div class="modal-options' + cols + '">';
    data.options.forEach(function(opt) {
      var sel = modalAnswers[modalStep] === opt.label ? ' selected' : '';
      var displayLabel = tr(opt.key);
      var displaySub   = opt.subKey ? tr(opt.subKey) : '';
      html += '<button class="modal-option' + sel + '" onclick="selectOption(this,\'' + opt.label.replace(/'/g, "\\'") + '\')">' + displayLabel;
      if (displaySub) html += '<span>' + displaySub + '</span>';
      html += '</button>';
    });
    html += '</div><div class="modal-nav">';
    if (modalStep > 1) html += '<button class="modal-btn-back" onclick="prevStep()">' + tr('modal.btn.back') + '</button>';
    else html += '<div></div>';
    html += '<button class="modal-btn-next" onclick="nextStep()">' + tr('modal.btn.next') + '</button></div>';
  }
  document.getElementById('modal-content').innerHTML = html;
  if (typeof gsap !== 'undefined') gsap.from('#modal-content', { opacity: 0, x: 20, duration: 0.3, ease: 'power2.out' });
}

function selectOption(el, val) {
  document.querySelectorAll('#modal-content .modal-option').forEach(function(b) { b.classList.remove('selected'); });
  el.classList.add('selected');
  modalAnswers[modalStep] = val;
}

function nextStep() {
  if (!modalAnswers[modalStep]) {
    if (typeof gsap !== 'undefined') gsap.to('#modal-content', { x: -6, duration: 0.05, yoyo: true, repeat: 5, ease: 'power2.inOut' });
    return;
  }
  if (modalStep === 3 && modalAnswers[1] === 'Refinance My Home') { modalStep = 5; }
  else { modalStep++; }
  renderModalStep();
}

function prevStep() {
  if (modalStep === 5 && modalAnswers[1] === 'Refinance My Home') { modalStep = 3; }
  else { modalStep--; }
  if (modalStep < 1) modalStep = 1;
  renderModalStep();
}

function submitPrequal(e) {
  e.preventDefault();
  document.getElementById('modal-progress').style.width = '100%';
  document.getElementById('modal-content').innerHTML = '<div class="modal-success"><div class="modal-success-icon"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div><h3>' + tr('modal.success.title') + '</h3><p>' + tr('modal.success.body') + '<br><br><strong>' + tr('modal.success.call') + ' <a href="tel:3056151515" style="color:var(--red)">(305) 615-1515</a></strong></p></div>';
  if (typeof gsap !== 'undefined') gsap.from('.modal-success', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
  setTimeout(closePrequalModal, 5000);
}

// ─── LOAN INFO MODAL ───
var loanCards = [
  { name: 'Fixed Rate Mortgage', img: '/images/loans/fixed-rate.jpg', page: '/fixed-rate-mortgage-miami', icon: '<path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>', desc: 'Lock in your interest rate for the life of your loan and enjoy the same predictable monthly payment for 15 or 30 years. Perfect for buyers who value stability, long-term planning, and protection from rising interest rates.', benefits: ['Consistent monthly payment — forever','Protection from market rate increases','15-year or 30-year term options','Build equity consistently over time','Competitive rates for qualified buyers'] },
  { name: 'FHA Home Loan', img: '/images/loans/fha.jpg', page: '/fha-home-loan-miami', icon: '<path d="M3 10.5L12 3l9 7.5V21H15v-6H9v6H3V10.5z"/>', desc: 'Government-backed financing designed to make homeownership accessible. With a down payment as low as 3.5% and flexible credit requirements starting at 580, FHA loans open the door for millions of buyers who may not qualify for conventional financing.', benefits: ['Down payment as low as 3.5%','Flexible credit score requirements (580+)','Gift funds accepted for down payment','Competitive government-backed rates','Ideal for first-time homebuyers'] },
  { name: 'VA Home Loan', img: '/images/loans/va.jpg', page: '/va-home-loan-miami', icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', desc: 'The ultimate homeownership benefit for those who served our country. VA loans offer eligible military borrowers zero down payment, no monthly PMI, and competitive rates.', benefits: ['Zero down payment required','No private mortgage insurance (PMI)','Below-market competitive rates','Flexible credit guidelines','Reusable benefit — use multiple times'] },
  { name: 'USDA Loan', img: '/images/loans/usda.jpg', page: '/usda-loan-florida', icon: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>', desc: '100% financing for eligible rural and suburban areas — no down payment required. USDA loans offer below-market rates and no PMI for qualifying buyers.', benefits: ['Zero down payment — 100% financing','No private mortgage insurance','Below-market interest rates','Closing costs can be rolled into loan','30-year fixed rate term'] },
  { name: 'Jumbo Loan', img: '/images/loans/jumbo.jpg', page: '/jumbo-loans-miami', icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', desc: 'Tailored financing for high-value properties exceeding conventional loan limits in South Florida\'s luxury market. With access to multiple jumbo lenders, we secure the most competitive rates for purchases up to $5M and beyond.', benefits: ['Loan amounts up to $5M+','Fixed and adjustable rate options','Primary, second home & investment','Flexible underwriting guidelines','Expert guidance in luxury market'] },
  { name: 'First-Time Homebuyer', img: '/images/loans/first-time-buyer.jpg', page: '/first-time-homebuyer-miami', icon: '<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>', desc: 'Buying your first home is one of life\'s most exciting milestones. We specialize in guiding first-time buyers through every step — from understanding your budget to finding down payment assistance programs to handing you the keys.', benefits: ['Down payment assistance programs','Free homebuyer education resources','Low down payment options (3%–3.5%)','Dedicated loan officer support','Connection to trusted real estate agents'] },
  { name: 'Low Down Payment', img: '/images/loans/low-down-payment.jpg', page: '/low-down-payment-mortgage', icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>', desc: 'Don\'t let a large down payment hold you back. Our low down payment programs let qualified buyers get into their home sooner — with conventional loans from 3% down and access to Florida\'s down payment assistance grants.', benefits: ['Conventional loans from 3% down','Florida down payment assistance grants','Gift funds accepted from family','Multiple programs to match your situation','Faster path to homeownership'] },
  { name: 'Rehab Loan (203k)', img: '/images/loans/rehab-203k.jpg', page: '/rehab-loan-203k', icon: '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>', desc: 'The FHA 203(k) Rehab Loan combines your home purchase price and renovation costs into one single mortgage — with just one closing, one payment, and one low interest rate.', benefits: ['Purchase + renovation in one loan','Down payment as low as 3.5%','Covers structural & cosmetic repairs','Single closing saves time & money','Instant equity potential'] },
  { name: 'Investment Property', img: '/images/loans/investment.jpg', page: '/investment-property-loans-miami', icon: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><path d="M8 21h8M12 17v4"/>', desc: 'South Florida is one of America\'s top real estate investment markets. Whether you\'re buying your first rental or expanding a portfolio, we offer competitive financing including DSCR loans that qualify on rental income rather than personal income.', benefits: ['Single & multi-family property options','DSCR loans — qualify on rental income','Vacation home financing available','Portfolio loan options','Expert investor-focused team'] },
  { name: 'Refinance', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80&fit=crop', page: '/mortgage-refinance-miami', icon: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.61"/>', desc: 'Refinancing can lower your monthly payment, reduce your interest rate, shorten your loan term, or unlock your home\'s equity. South Florida homeowners are sitting on significant equity — let us help you put it to work.', benefits: ['Lower your interest rate','Reduce your monthly payment','Cash-out equity for any purpose','Eliminate mortgage insurance (PMI)','Switch from ARM to fixed rate'] }
];

function openLoanModal(idx) {
  var loan = loanCards[idx];
  var bHTML = loan.benefits.map(function(b) {
    return '<div class="loan-info-benefit"><div class="loan-info-benefit-dot"></div>' + b + '</div>';
  }).join('');
  document.getElementById('loan-modal-content').innerHTML =
    '<div class="loan-info-img-wrap"><img src="' + loan.img + '" alt="' + loan.name + '" loading="lazy" /></div>' +
    '<div class="loan-info-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + loan.icon + '</svg></div>' +
    '<div class="loan-info-title">' + loan.name + '</div>' +
    '<div class="loan-info-desc">' + loan.desc + '</div>' +
    '<div class="loan-info-benefits">' + bHTML + '</div>' +
    '<div class="loan-info-actions">' +
      '<a class="btn btn-red" href="' + loan.page + '">' + tr('modal.loan.details') + '</a>' +
      '<a class="btn btn-outline" href="#" onclick="closeLoanModal();openPrequalModal();return false;">' + tr('modal.loan.apply') + '</a>' +
    '</div>';
  document.getElementById('loan-info-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof gsap !== 'undefined') gsap.from('#loan-info-box', { opacity: 0, y: 30, duration: 0.4, ease: 'power2.out' });
}

function closeLoanModal() {
  document.getElementById('loan-info-modal').classList.remove('open');
  document.body.style.overflow = '';
}

// ─── LOAN CAROUSEL ───
var carouselIndex = 0;
var carouselTotal = 10;
var carouselAutoPlay;

function getCarouselVisible() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}
function getMaxIndex() { return carouselTotal - getCarouselVisible(); }

function buildCarouselDots() {
  var dots = document.getElementById('carousel-dots');
  if (!dots) return;
  var max = getMaxIndex() + 1;
  var html = '';
  for (var i = 0; i < max; i++) {
    html += '<button class="carousel-dot' + (i === 0 ? ' active' : '') + '" onclick="carouselGoTo(' + i + ')"></button>';
  }
  dots.innerHTML = html;
}

function updateCarouselDots() {
  document.querySelectorAll('.carousel-dot').forEach(function(d, i) { d.classList.toggle('active', i === carouselIndex); });
}

function carouselGoTo(idx) {
  carouselIndex = Math.max(0, Math.min(idx, getMaxIndex()));
  var track = document.getElementById('loans-track');
  if (!track) return;
  var slide = track.querySelector('.loan-slide');
  if (!slide) return;
  var slideW = slide.offsetWidth + 24;
  var offset = carouselIndex * slideW;
  if (typeof gsap !== 'undefined') {
    gsap.to(track, { x: -offset, duration: 0.55, ease: 'power2.inOut' });
  } else {
    track.style.transform = 'translateX(-' + offset + 'px)';
  }
  updateCarouselDots();
}

function carouselNext() {
  if (carouselIndex >= getMaxIndex()) { carouselGoTo(0); } else { carouselGoTo(carouselIndex + 1); }
  resetAutoPlay();
}
function carouselPrev() {
  if (carouselIndex <= 0) { carouselGoTo(getMaxIndex()); } else { carouselGoTo(carouselIndex - 1); }
  resetAutoPlay();
}
function resetAutoPlay() {
  clearInterval(carouselAutoPlay);
  carouselAutoPlay = setInterval(carouselNext, 4500);
}
function initCarousel() {
  if (!document.getElementById('loans-track')) return;
  buildCarouselDots(); carouselGoTo(0); resetAutoPlay();
}

window.addEventListener('resize', function() { buildCarouselDots(); carouselGoTo(carouselIndex); });
window.addEventListener('load', initCarousel);

// Touch/swipe
(function() {
  var startX = 0;
  var track = document.getElementById('loans-track');
  if (!track) return;
  track.parentElement.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
  track.parentElement.addEventListener('touchend', function(e) {
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { if (diff > 0) { carouselNext(); } else { carouselPrev(); } }
  }, { passive: true });
})();

// ─── HERO SLIDESHOW ───
(function() {
  var slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  var current = 0;
  setInterval(function() {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 5000);
})();

// ─── TESTIMONIALS CAROUSEL (3 visible, advance 1 at a time) ───
(function() {
  var current = 0;
  var timer;
  var GAP = 24; // 1.5rem in px

  var track = document.getElementById('testimonials-track');
  if (!track) return;

  var total = track.children.length;

  function getVisible() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function getCardWidth() {
    var viewport = track.closest('.testimonials-carousel-viewport');
    var containerW = viewport ? viewport.offsetWidth : track.offsetWidth;
    var vis = getVisible();
    return (containerW - GAP * (vis - 1)) / vis;
  }

  function getMaxIndex() {
    return Math.max(0, total - getVisible());
  }

  function setCardWidths() {
    var w = getCardWidth();
    Array.prototype.forEach.call(track.children, function(c) {
      c.style.width    = w + 'px';
      c.style.minWidth = w + 'px';
      c.style.flexShrink = '0';
    });
  }

  function buildDots() {
    var dotsEl = document.getElementById('testimonials-dots');
    if (!dotsEl) return;
    var maxIdx = getMaxIndex();
    var html = '';
    for (var i = 0; i <= maxIdx; i++) {
      html += '<button class="testimonial-dot' + (i === current ? ' active' : '') + '" onclick="testimonialsGoTo(' + i + ')" aria-label="Testimonial ' + (i + 1) + '"></button>';
    }
    dotsEl.innerHTML = html;
  }

  function goTo(idx) {
    var maxIdx = getMaxIndex();
    current = ((idx % (maxIdx + 1)) + (maxIdx + 1)) % (maxIdx + 1);
    var cardW = getCardWidth();
    track.style.transform = 'translateX(-' + (current * (cardW + GAP)) + 'px)';
    document.querySelectorAll('.testimonial-dot').forEach(function(d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  window.testimonialsNext = function() { goTo(current + 1); };
  window.testimonialsPrev = function() { goTo(current - 1); };
  window.testimonialsGoTo = goTo;

  function startTimer() { timer = setInterval(function() { goTo(current + 1); }, 6000); }
  function stopTimer()  { clearInterval(timer); }

  var viewport = track.closest('.testimonials-carousel-viewport');
  if (viewport) {
    viewport.addEventListener('mouseenter', stopTimer);
    viewport.addEventListener('mouseleave', startTimer);
  }

  var startX = 0;
  track.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   function(e) {
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? testimonialsNext() : testimonialsPrev(); }
  }, { passive: true });

  function init() {
    setCardWidths();
    buildDots();
    goTo(0);
    startTimer();
  }

  if (document.readyState === 'loading') {
    window.addEventListener('load', init);
  } else {
    init();
  }

  window.addEventListener('resize', function() {
    setCardWidths();
    buildDots();
    goTo(current);
  });
})();

// ─── BRAND NAME NO-WRAP ───
// Ensures "Mister Mortgage USA" never wraps across lines
(function() {
  function wrapBrandName(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var nodes = [];
    var node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(function(n) {
      if (n.nodeValue && n.nodeValue.indexOf('Mister Mortgage USA') !== -1) {
        var span = document.createElement('span');
        span.style.whiteSpace = 'nowrap';
        var parts = n.nodeValue.split('Mister Mortgage USA');
        var frag = document.createDocumentFragment();
        parts.forEach(function(part, i) {
          if (i > 0) {
            var brand = document.createElement('span');
            brand.style.whiteSpace = 'nowrap';
            brand.textContent = 'Mister Mortgage USA';
            frag.appendChild(brand);
          }
          if (part) frag.appendChild(document.createTextNode(part));
        });
        n.parentNode.replaceChild(frag, n);
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { wrapBrandName(document.body); });
  } else {
    wrapBrandName(document.body);
  }
})();

// ─── AUTO-LINK PHONE & ADDRESS ───
(function() {
  var PHONE_RE = /\(305\)\s*615-1515/g;
  var ADDR_RE  = /6030 Bird Rd[,\s]*/g;
  var PHONE_HREF = 'tel:+13056151515';
  var MAPS_HREF  = 'https://maps.google.com/?q=6030+Bird+Rd,+Miami,+FL+33155';

  function linkifyNode(node) {
    if (node.nodeType === 3) { // text node
      var val = node.nodeValue;
      if (!PHONE_RE.test(val) && !ADDR_RE.test(val)) return;
      PHONE_RE.lastIndex = 0;
      ADDR_RE.lastIndex = 0;
      var span = document.createElement('span');
      var html = val
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(PHONE_RE, '<a href="' + PHONE_HREF + '" style="color:inherit;text-decoration:underline dotted;text-underline-offset:3px;">$&</a>')
        .replace(ADDR_RE, '<a href="' + MAPS_HREF + '" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline dotted;text-underline-offset:3px;">$&</a>');
      if (html !== val) {
        span.innerHTML = html;
        node.parentNode.replaceChild(span, node);
      }
    } else if (node.nodeType === 1 && node.tagName !== 'A' && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
      Array.from(node.childNodes).forEach(linkifyNode);
    }
  }

  function run() { linkifyNode(document.body); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  // Re-run after i18n updates the DOM
  document.addEventListener('i18nApplied', run);
})();

// ─── TICKER DUPLICATE FOR SEAMLESS LOOP ───
(function() {
  function initTicker() {
    var track = document.getElementById('ticker-track');
    if (!track) return;
    var clone = track.innerHTML;
    track.innerHTML = clone + clone; // duplicate for seamless loop
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initTicker);
  else initTicker();
})();
