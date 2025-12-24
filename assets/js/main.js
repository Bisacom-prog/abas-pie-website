/***********************
 * THEME (dark mode)
 ***********************/
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function applyTheme(mode) {
  const isDark = mode === 'dark';
  root.classList.toggle('dark', isDark);
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeIcon.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', mode);
}

(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) return applyTheme(saved);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
})();

themeToggle.addEventListener('click', () => {
  const isDark = root.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
});

/***********************
 * MOBILE MENU
 ***********************/
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

function setMobileMenu(open) {
  mobileMenu.classList.toggle('hidden', !open);
  mobileMenuBtn.setAttribute('aria-expanded', String(open));
}

mobileMenuBtn.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');
  setMobileMenu(!isOpen);
});

document.querySelectorAll('.mobilelink').forEach(a => {
  a.addEventListener('click', () => setMobileMenu(false));
});

/***********************
 * PRODUCTS + CART (localStorage)
 ***********************/
const products = [
  { id: 'Meat Pie', name: 'Meat Pie', desc: 'Classic Ghanaian meat pie with a flaky golden crust, filled with well-seasoned minced beef, onions, and warming local spices.',price: 3.00, img: 'assets/img/gh-meat-pie.webp', alt: 'Ghanaian meat pie'},
  { id: 'Crunchy Chips', name: 'Crunchy Chips', desc: 'Crispy golden chips fried to perfection, lightly salted and served hot—perfect as a snack or side.', price: 2.75, img: 'assets/img/gh-chips.webp', alt: 'Ghanaian chips'},
  { id: 'veggie-delight', name: 'Veggie Delight', desc: 'Mixed vegetables seasoned for rich flavour.', price: 3.25, img: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=80', alt: 'Fresh pastries and baked goods on a counter' },
  { id: 'curried-beef', name: 'Curried Beef', desc: 'A warming curry twist with deep, savory notes.', price: 3.95, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80', alt: 'Close-up of baked food on a tray' },
  { id: 'Doughnut(bofrot)', name: 'Doughnut (Bofrot)', desc: 'Soft and fluffy Ghanaian bofrot with a lightly crisp exterior—golden, slightly sweet, and irresistibly comforting.', price: 2.55, img: 'assets/img/gh-doughnut.webp', alt: 'Ghanaian doughnut (bofrot)'},
  { id: 'pepper-steak', name: 'Pepper Steak', desc: 'Bold peppery steak filling with a kick.', price: 4.10, img: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=1200&q=80', alt: 'Assorted pastries ready to serve' },
  { id: 'eggy-mince', name: 'Eggy Mince', desc: 'Mince with egg pieces—classic Ghana-style comfort.', price: 3.85, img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80', alt: 'Baked goods on a wooden board' },
  { id: 'mini-pack', name: 'Mini Pie Pack (6)', desc: 'Perfect for events—mixed selection of minis.', price: 12.00, img: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80', alt: 'Baked pastries on a tray with warm lighting' }
];

const menuGrid = document.getElementById('menuGrid');
const cartBadge = document.getElementById('cartBadge');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const CART_KEY = 'abaspie_cart_v1';

function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }catch{ return {}; } }
function setCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); renderCartBadge(); renderCartItems(); }
function cartCount(cart = getCart()){ return Object.values(cart).reduce((s,i)=>s+i.qty,0); }
function money(n){ return new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(n); }

function addToCart(productId){
  const cart = getCart();
  const product = products.find(p => p.id === productId);
  if (!product) return;
  cart[productId] ? cart[productId].qty++ : (cart[productId] = { id: productId, name: product.name, price: product.price, qty: 1 });
  setCart(cart);
  openCart();
}
function updateQty(productId, delta){
  const cart = getCart();
  if (!cart[productId]) return;
  cart[productId].qty += delta;
  if (cart[productId].qty <= 0) delete cart[productId];
  setCart(cart);
}
function removeItem(productId){
  const cart = getCart();
  delete cart[productId];
  setCart(cart);
}

function renderMenu(){
  menuGrid.innerHTML = products.map(p => `
    <article class="group rounded-3xl bg-white dark:bg-darkbg border border-black/5 dark:border-white/10 shadow-sm overflow-hidden hover:shadow-soft hover:-translate-y-1 transition-all duration-300">
      <div class="overflow-hidden">
        <img src="${p.img}" alt="${p.alt}" loading="lazy" class="h-48 w-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
      </div>
      <div class="p-5">
        <div class="flex items-start justify-between gap-3">
          <h3 class="font-heading text-xl font-extrabold tracking-tight">${p.name}</h3>
          <p class="font-heading font-extrabold text-lg">${money(p.price)}</p>
        </div>
        <p class="mt-2 text-sm text-brown/80 dark:text-darktext/80">${p.desc}</p>
        <button type="button" class="mt-5 w-full inline-flex items-center justify-center rounded-2xl bg-gold px-5 py-3 font-semibold text-black shadow-sm hover:bg-orange hover:scale-[1.01] transition-all duration-300" aria-label="Add ${p.name} to cart" data-add="${p.id}">Add to Cart</button>
      </div>
    </article>
  `).join('');
  menuGrid.querySelectorAll('[data-add]').forEach(btn => btn.addEventListener('click', () => addToCart(btn.getAttribute('data-add'))));
}

function renderCartBadge(){ cartBadge.textContent = String(cartCount()); }
let lastCartTotalGBP = 0;

function renderCartItems(){
  const cart = getCart();
  const items = Object.values(cart);
  if (!items.length){
    cartItemsEl.innerHTML = `
      <div class="rounded-2xl border border-black/10 dark:border-white/15 bg-cream/60 dark:bg-white/5 p-5">
        <p class="font-semibold">Your cart is empty</p>
        <p class="mt-1 text-sm text-brown/80 dark:text-darktext/80">Add items from the Menu Catalog.</p>
      </div>`;
    cartTotalEl.textContent = money(0);
    lastCartTotalGBP = 0;
    return;
  }
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  lastCartTotalGBP = total;

  cartItemsEl.innerHTML = items.map(it => `
    <div class="rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 p-4 mb-3">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="font-semibold">${it.name}</p>
          <p class="text-sm text-brown/80 dark:text-darktext/80">${money(it.price)} each</p>
        </div>
        <button type="button" class="rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-darkbg px-3 py-2 hover:shadow-soft transition" aria-label="Remove ${it.name} from cart" data-remove="${it.id}">Remove</button>
      </div>
      <div class="mt-3 flex items-center justify-between">
        <div class="inline-flex items-center gap-2">
          <button type="button" class="h-10 w-10 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-darkbg hover:shadow-soft transition" aria-label="Decrease quantity for ${it.name}" data-dec="${it.id}">−</button>
          <span class="min-w-[2rem] text-center font-semibold" aria-label="Quantity">${it.qty}</span>
          <button type="button" class="h-10 w-10 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-darkbg hover:shadow-soft transition" aria-label="Increase quantity for ${it.name}" data-inc="${it.id}">+</button>
        </div>
        <p class="font-heading font-extrabold">${money(it.price * it.qty)}</p>
      </div>
    </div>
  `).join('');
  cartTotalEl.textContent = money(total);

  cartItemsEl.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => updateQty(b.dataset.inc, +1)));
  cartItemsEl.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => updateQty(b.dataset.dec, -1)));
  cartItemsEl.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => removeItem(b.dataset.remove)));
}

/***********************
 * CART DRAWER
 ***********************/
const cartOpenBtn = document.getElementById('cartOpen');
const cartCloseBtn = document.getElementById('cartClose');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');

function openCart(){
  cartOverlay.classList.remove('hidden');
  cartDrawer.classList.remove('translate-x-full');
  cartOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeCart(){
  cartOverlay.classList.add('hidden');
  cartDrawer.classList.add('translate-x-full');
  cartOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

cartOpenBtn.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape'){ closeCart(); closeCookieModal(); closePrivacyModal(); } });

/***********************
 * COOKIE CONSENT
 ***********************/
const cookieBanner = document.getElementById('cookieBanner');
const cookieModal = document.getElementById('cookieModal');
const cookieAcceptBtn = document.getElementById('cookieAcceptBtn');
const cookieRejectBtn = document.getElementById('cookieRejectBtn');
const cookieSettingsBtn = document.getElementById('cookieSettingsBtn');
const openCookieSettings = document.getElementById('openCookieSettings');
const cookieModalClose = document.getElementById('cookieModalClose');
const cookieAnalytics = document.getElementById('cookieAnalytics');
const cookieMarketing = document.getElementById('cookieMarketing');
const cookieSave = document.getElementById('cookieSave');
const openPrivacyFromCookie = document.getElementById('openPrivacyFromCookie');

const CONSENT_KEY = 'abaspie_cookie_consent_v1';
function getConsent(){ try{ return JSON.parse(localStorage.getItem(CONSENT_KEY)); }catch{ return null; } }
function setConsent(consent){ localStorage.setItem(CONSENT_KEY, JSON.stringify(consent)); }
function showCookieBannerIfNeeded(){ if (!getConsent()) cookieBanner.classList.remove('hidden'); }

function openCookieModal(){
  const consent = getConsent() || { essential: true, analytics: false, marketing: false };
  cookieAnalytics.checked = !!consent.analytics;
  cookieMarketing.checked = !!consent.marketing;
  cookieModal.classList.remove('hidden');
  cookieBanner.classList.add('hidden');
  document.body.style.overflow = 'hidden';
}
function closeCookieModal(){ cookieModal.classList.add('hidden'); document.body.style.overflow = ''; }

function acceptAllCookies(){ setConsent({ essential:true, analytics:true, marketing:true, timestamp:new Date().toISOString() }); cookieBanner.classList.add('hidden'); document.dispatchEvent(new Event('abaspie:consent:analytics')); }
function rejectNonEssentialCookies(){ setConsent({ essential:true, analytics:false, marketing:false, timestamp:new Date().toISOString() }); cookieBanner.classList.add('hidden'); }
function saveCookiePrefs(){
  const consent = { essential:true, analytics:cookieAnalytics.checked, marketing:cookieMarketing.checked, timestamp:new Date().toISOString() };
  setConsent(consent);
  closeCookieModal();
  if (consent.analytics) document.dispatchEvent(new Event('abaspie:consent:analytics'));
}

cookieAcceptBtn.addEventListener('click', acceptAllCookies);
cookieRejectBtn.addEventListener('click', rejectNonEssentialCookies);
cookieSettingsBtn.addEventListener('click', openCookieModal);
openCookieSettings.addEventListener('click', openCookieModal);
cookieModalClose.addEventListener('click', closeCookieModal);
cookieSave.addEventListener('click', saveCookiePrefs);

/***********************
 * PRIVACY MODAL
 ***********************/
const privacyModal = document.getElementById('privacyModal');
const openPrivacy = document.getElementById('openPrivacy');
const privacyClose = document.getElementById('privacyClose');

function openPrivacyModal(){ privacyModal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
function closePrivacyModal(){ privacyModal.classList.add('hidden'); document.body.style.overflow = ''; }

openPrivacy.addEventListener('click', openPrivacyModal);
privacyClose.addEventListener('click', closePrivacyModal);
openPrivacyFromCookie.addEventListener('click', () => { closeCookieModal(); openPrivacyModal(); });

privacyModal.addEventListener('click', (e) => { if (e.target === privacyModal.firstElementChild) closePrivacyModal(); });
cookieModal.addEventListener('click', (e) => { if (e.target === cookieModal.firstElementChild) closeCookieModal(); });

/***********************
 * CONTACT FORM VALIDATION
 ***********************/
const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');
const errName = document.getElementById('errName');
const errEmail = document.getElementById('errEmail');
const errMessage = document.getElementById('errMessage');
function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  errName.classList.toggle('hidden', !!name);
  errEmail.classList.toggle('hidden', isValidEmail(email));
  errMessage.classList.toggle('hidden', !!message);
  if (!name || !isValidEmail(email) || !message) return;
  contactSuccess.classList.remove('hidden');
  contactForm.reset();
  setTimeout(() => contactSuccess.classList.add('hidden'), 6000);
});

/***********************
 * PAYMENTS (Stripe/Paystack)
 ***********************/
const stripeBtn = document.getElementById('stripeCheckoutBtn');
const paystackBtn = document.getElementById('paystackCheckoutBtn');

async function getCheckoutPayload(){
  const cart = getCart();
  const items = Object.values(cart).map(it => ({ id: it.id, name: it.name, price: it.price, qty: it.qty }));
  return { currency:'GBP', total:lastCartTotalGBP, items };
}

if (stripeBtn) stripeBtn.addEventListener('click', async () => {
  try{
    const payload = await getCheckoutPayload();
    const data = await abaspieCreateStripeSession(payload);
    if (data?.url) window.location.href = data.url;
  }catch{ alert('Stripe checkout is not configured yet. See README for setup.'); }
});

if (paystackBtn) paystackBtn.addEventListener('click', async () => {
  try{
    const payload = await getCheckoutPayload();
    const data = await abaspieInitPaystack(payload);
    if (data?.authorization_url) window.location.href = data.authorization_url;
  }catch{ alert('Paystack checkout is not configured yet. See README for setup.'); }
});

/***********************
 * FOOTER YEAR / DATES
 ***********************/
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('privacyUpdated').textContent = new Date().toLocaleDateString('en-GB');

/***********************
 * INIT
 ***********************/
renderMenu();
renderCartBadge();
renderCartItems();
showCookieBannerIfNeeded();

const existingConsent = getConsent();
if (existingConsent?.analytics) document.dispatchEvent(new Event('abaspie:consent:analytics'));
