/* =============================================
   GREENSOUP – SCRIPT.JS
   ============================================= */

/* -------- Banner upload -------- */
function loadBannerImage(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('bannerRealImg').src = e.target.result;
    document.getElementById('bannerPlaceholder').style.display  = 'none';
    document.getElementById('bannerImageWrap').style.display    = 'block';
    // reset border style to solid once image loaded
    document.querySelector('.banner-wrapper').style.border = 'none';
    showToast('🖼️ Banner đã được tải lên thành công!');
  };
  reader.readAsDataURL(file);
}

function changeBanner() {
  document.getElementById('bannerChangeInput').click();
}

function removeBanner() {
  document.getElementById('bannerRealImg').src               = '';
  document.getElementById('bannerPlaceholder').style.display = 'flex';
  document.getElementById('bannerImageWrap').style.display   = 'none';
  document.querySelector('.banner-wrapper').style.border     = '';
  showToast('🗑️ Banner đã được xóa');
}

/* Drag & drop support for banner */
function initBannerDragDrop() {
  const wrapper = document.querySelector('.banner-wrapper');
  if (!wrapper) return;

  ['dragenter','dragover'].forEach(ev => {
    wrapper.addEventListener(ev, e => {
      e.preventDefault();
      wrapper.classList.add('drag-over');
    });
  });
  ['dragleave','drop'].forEach(ev => {
    wrapper.addEventListener(ev, e => {
      e.preventDefault();
      wrapper.classList.remove('drag-over');
      if (ev === 'drop' && e.dataTransfer.files.length) {
        const fakeInput = { files: e.dataTransfer.files };
        loadBannerImage(fakeInput);
      }
    });
  });
}

'use strict';

/* -------- Cart State -------- */
const PRODUCTS = {
  1: { name: 'Viên Canh Cải Xoong Thịt Bằm',  emoji: '🥬' },
  2: { name: 'Viên Canh Kim Chi Gà Cay',       emoji: '🌶' },
  3: { name: 'Viên Canh Chua Cay',             emoji: '🍋' },
};

let cart = {};  // { productId: quantity }

/* -------- Header scroll -------- */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 300);
}, { passive: true });

/* -------- Hamburger menu -------- */
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// close menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

/* -------- AOS-like scroll animations -------- */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('aos-animate'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* -------- Cart functions -------- */
function addToCart(productId) {
  cart[productId] = (cart[productId] || 0) + 1;
  updateCartUI();
  const p = PRODUCTS[productId];
  showToast(`${p.emoji} Đã thêm "${p.name}" vào giỏ!`);
  bumpBadge();
}

function removeFromCart(productId) {
  delete cart[productId];
  updateCartUI();
  renderCartItems();
}

function updateCartUI() {
  const total = Object.values(cart).reduce((s, q) => s + q, 0);
  const badge = document.getElementById('cartBadge');
  badge.textContent = total;
  renderCartItems();
}

function renderCartItems() {
  const itemsEl   = document.getElementById('cartItems');
  const emptyEl   = document.getElementById('cartEmpty');
  const footerEl  = document.getElementById('cartFooter');
  const totalEl   = document.getElementById('cartTotal');

  const entries = Object.entries(cart);

  if (entries.length === 0) {
    emptyEl.style.display  = 'block';
    itemsEl.innerHTML      = '';
    footerEl.style.display = 'none';
    return;
  }

  emptyEl.style.display  = 'none';
  footerEl.style.display = 'block';

  itemsEl.innerHTML = entries.map(([id, qty]) => {
    const p = PRODUCTS[id];
    return `
      <div class="cart-item">
        <span style="font-size:1.5rem">${p.emoji}</span>
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-qty">Số lượng: ${qty}</div>
        </div>
        <button class="cart-item-del" onclick="removeFromCart(${id})" title="Xóa">✕</button>
      </div>
    `;
  }).join('');

  totalEl.textContent = 'Liên hệ báo giá';
}

function toggleCart() {
  const overlay = document.getElementById('cartOverlay');
  const drawer  = document.getElementById('cartDrawer');
  overlay.classList.toggle('open');
  drawer.classList.toggle('open');
}

document.getElementById('cartBtn').addEventListener('click', toggleCart);

function checkout() {
  const names = Object.keys(cart).map(id => PRODUCTS[id].name).join(', ');
  showToast('📞 Vui lòng liên hệ hotline để đặt hàng!');
  toggleCart();
  setTimeout(() => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('fmsg').value = `Tôi muốn đặt hàng: ${names}`;
  }, 400);
}

function bumpBadge() {
  const badge = document.getElementById('cartBadge');
  badge.classList.remove('bump');
  void badge.offsetWidth; // reflow
  badge.classList.add('bump');
  setTimeout(() => badge.classList.remove('bump'), 300);
}

/* -------- Toast -------- */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* -------- Product image upload -------- */
function loadProductImage(input, containerId) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const container = document.getElementById(containerId);
    container.classList.add('has-image');
    container.innerHTML = `<img src="${e.target.result}" alt="Ảnh sản phẩm" class="product-real-img" />`;
  };
  reader.readAsDataURL(file);
}

/* -------- Contact form -------- */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.textContent = '⏳ Đang gửi...';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Gửi Ngay 🚀';
    btn.disabled = false;
    document.getElementById('formSuccess').classList.add('show');
    document.getElementById('contactForm').reset();
    setTimeout(() => document.getElementById('formSuccess').classList.remove('show'), 5000);
  }, 1500);
}

/* -------- Smooth back to top -------- */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* -------- Active nav link on scroll -------- */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  const scrollY  = window.scrollY + 100;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      links.forEach(l => l.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

/* -------- Typing effect for hero subtitle -------- */
function initTypingEffect() {
  const el = document.querySelector('.hero-sub');
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  el.style.opacity = 1;
  let i = 0;
  const type = () => {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, 50);
    }
  };
  setTimeout(type, 800);
}

/* -------- Parallax blobs -------- */
function initParallax() {
  const blobs = document.querySelectorAll('.blob');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - .5) * 30;
    const y = (e.clientY / window.innerHeight - .5) * 30;
    blobs.forEach((b, i) => {
      const factor = (i + 1) * .5;
      b.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  }, { passive: true });
}

/* -------- Counter animation -------- */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseFloat(el.textContent);
    if (isNaN(target)) return;
    const suffix = el.textContent.replace(/[0-9.]/g, '');
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = (Number.isInteger(target) ? Math.floor(start) : start.toFixed(0)) + suffix;
      if (start >= target) clearInterval(timer);
    }, 30);
  });
}

const counterObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    animateCounters();
    counterObserver.disconnect();
  }
}, { threshold: .5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) counterObserver.observe(statsEl);

/* -------- INIT -------- */
document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initTypingEffect();
  initParallax();
  initBannerDragDrop();
  updateCartUI();
});
