// State quản lý Giỏ hàng mẫu ban đầu
let cart = [
    {
        id: 1,
        name: "Súp Rau Xanh",
        price: 35000,
        image: "images/hero_soup.png",
        qty: 1
    },
    {
        id: 2,
        name: "Súp Bí Đỏ",
        price: 35000,
        image: "images/pumpkin_soup.png",
        qty: 1
    }
];

// Danh sách tất cả các sản phẩm để truy xuất khi thêm mới
const productsList = [
    { id: 1, name: "Súp Rau Xanh", price: 35000, image: "images/hero_soup.png" },
    { id: 2, name: "Súp Bí Đỏ", price: 35000, image: "images/pumpkin_soup.png" },
    { id: 3, name: "Súp Bông Cải", price: 35000, image: "images/hero_soup.png" },
    { id: 4, name: "Súp Nấm Kem", price: 35000, image: "images/mushroom_soup.png" }
];

document.addEventListener('DOMContentLoaded', () => {
    initCart();
    initMobileMenu();
    setupCartInteractions();
});

// === QUẢN LÝ GIỎ HÀNG ===

function initCart() {
    renderCart();
    
    // Đăng ký sự kiện nút "Thêm vào giỏ hàng" của các thẻ sản phẩm
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            if (card) {
                const prodId = parseInt(card.dataset.id);
                addToCart(prodId);
            }
        });
    });
}

function renderCart() {
    const cartCountEl = document.getElementById('cart-count');
    const cartContainer = document.getElementById('cart-items-container');
    const cartTotalEl = document.getElementById('cart-total-price');
    
    // Cập nhật số lượng trên badge
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    cartCountEl.textContent = totalQty;
    
    // Render danh sách trong Drawer
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="cart-empty-msg" style="text-align: center; padding: 40px 0; color: var(--color-text-light);">
                <i class="fa-solid fa-basket-shopping" style="font-size: 3rem; color: var(--color-border); margin-bottom: 12px;"></i>
                <p>Giỏ hàng của bạn đang trống</p>
            </div>
        `;
        cartTotalEl.textContent = '0đ';
        return;
    }
    
    let cartHtml = '';
    let totalPrice = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        totalPrice += itemTotal;
        
        cartHtml += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <span class="cart-item-price">${item.price.toLocaleString('vi-VN')}đ</span>
                    <div class="cart-item-qty">
                        <button class="qty-btn dec-qty-btn" aria-label="Giảm số lượng">-</button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="qty-btn inc-qty-btn" aria-label="Tăng số lượng">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" aria-label="Xóa sản phẩm">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    });
    
    cartContainer.innerHTML = cartHtml;
    cartTotalEl.textContent = totalPrice.toLocaleString('vi-VN') + 'đ';
    
    // Đăng ký các sự kiện tăng giảm số lượng & xóa
    setupCartItemActions();
}

function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        const product = productsList.find(p => p.id === productId);
        if (product) {
            cart.push({
                ...product,
                qty: 1
            });
        }
    }
    
    renderCart();
    showToast(`Đã thêm ${productsList.find(p => p.id === productId).name} vào giỏ hàng!`);
}

function setupCartItemActions() {
    const cartItems = document.querySelectorAll('.cart-item');
    
    cartItems.forEach(itemEl => {
        const id = parseInt(itemEl.dataset.id);
        
        // Nút tăng
        itemEl.querySelector('.inc-qty-btn').addEventListener('click', () => {
            const item = cart.find(i => i.id === id);
            if (item) {
                item.qty += 1;
                renderCart();
            }
        });
        
        // Nút giảm
        itemEl.querySelector('.dec-qty-btn').addEventListener('click', () => {
            const item = cart.find(i => i.id === id);
            if (item && item.qty > 1) {
                item.qty -= 1;
                renderCart();
            } else if (item && item.qty === 1) {
                // Xoá nếu giảm về 0
                cart = cart.filter(i => i.id !== id);
                renderCart();
            }
        });
        
        // Nút xoá hoàn toàn
        itemEl.querySelector('.cart-item-remove').addEventListener('click', () => {
            cart = cart.filter(i => i.id !== id);
            renderCart();
            showToast("Đã xóa sản phẩm khỏi giỏ hàng");
        });
    });
}

// Setup đóng mở Drawer Giỏ Hàng
function setupCartInteractions() {
    const cartTrigger = document.getElementById('cart-trigger');
    const cartClose = document.getElementById('cart-close');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    
    const openCart = () => {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
    };
    
    const closeCart = () => {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
    };
    
    cartTrigger.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
}

// === TOAST NOTIFICATION ===

function showToast(message) {
    const toast = document.getElementById('toast-notif');
    const toastMsg = document.getElementById('toast-message');
    
    toastMsg.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// === MOBILE NAVIGATION MENU ===

function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileClose = document.getElementById('mobile-close');
    const mobilePanel = document.getElementById('mobile-panel');
    const mobileOverlay = document.getElementById('mobile-overlay');
    
    const openMenu = () => {
        mobilePanel.classList.add('active');
        mobileOverlay.classList.add('active');
    };
    
    const closeMenu = () => {
        mobilePanel.classList.remove('active');
        mobileOverlay.classList.remove('active');
    };
    
    mobileToggle.addEventListener('click', openMenu);
    mobileClose.addEventListener('click', closeMenu);
    mobileOverlay.addEventListener('click', closeMenu);
    
    // Đóng menu khi bấm vào link điều hướng di động
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            closeMenu();
        });
    });
}

// === QUẢN LÝ THANH TOÁN (CHECKOUT) ===

document.addEventListener('DOMContentLoaded', () => {
    initCheckout();
});

function initCheckout() {
    const checkoutTrigger = document.getElementById('checkout-trigger');
    const checkoutClose = document.getElementById('checkout-close');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutOverlay = document.getElementById('checkout-overlay');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const checkoutForm = document.getElementById('checkout-form');
    
    const openCheckout = () => {
        if (cart.length === 0) {
            showToast("Giỏ hàng của bạn đang trống!");
            return;
        }
        
        // Đóng giỏ hàng trước
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        
        // Mở checkout
        checkoutModal.classList.add('active');
        checkoutOverlay.classList.add('active');
        
        // Cập nhật thông tin QR động
        updateQRInformation();
    };
    
    const closeCheckout = () => {
        checkoutModal.classList.remove('active');
        checkoutOverlay.classList.remove('active');
    };
    
    if (checkoutTrigger) checkoutTrigger.addEventListener('click', openCheckout);
    if (checkoutClose) checkoutClose.addEventListener('click', closeCheckout);
    if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeCheckout);
    
    // Xử lý chuyển đổi phương thức thanh toán
    const paymentOptions = document.querySelectorAll('.payment-option');
    const qrArea = document.getElementById('qr-payment-area');
    
    paymentOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            paymentOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            
            const radioInput = opt.querySelector('input[type="radio"]');
            radioInput.checked = true;
            
            if (radioInput.value === 'qr') {
                if (qrArea) qrArea.style.display = 'block';
            } else {
                if (qrArea) qrArea.style.display = 'none';
            }
        });
    });
    
    // Xử lý gửi biểu mẫu đặt hàng
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('customer-name').value;
            const phone = document.getElementById('customer-phone').value;
            const address = document.getElementById('customer-address').value;
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
            
            const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
            
            // Giả lập gửi lên server
            console.log("Đơn hàng mới:", {
                name, phone, address, paymentMethod, totalAmount, items: cart
            });
            
            // Hiển thị thông báo thành công
            closeCheckout();
            cart = []; // Reset giỏ hàng
            renderCart();
            
            alert(`🎉 ĐẶT HÀNG THÀNH CÔNG!\n\nCảm ơn ${name} đã ủng hộ GreenSoup.\nĐơn hàng trị giá ${totalAmount.toLocaleString('vi-VN')}đ đang được chuẩn bị và giao tới địa chỉ:\n📍 ${address}.\nSĐT: ${phone}.`);
        });
    }
}

function updateQRInformation() {
    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const amountText = document.getElementById('qr-amount-text');
    const descText = document.getElementById('qr-desc-text');
    const qrImg = document.getElementById('vietqr-img');
    
    if (!amountText || !descText || !qrImg) return;
    
    // Tạo nội dung chuyển khoản ngẫu nhiên nhưng dễ nhớ
    const orderCode = 'SOUP' + Math.floor(1000 + Math.random() * 9000);
    
    amountText.textContent = totalAmount.toLocaleString('vi-VN') + 'đ';
    descText.textContent = orderCode;
    
    // API tạo mã VietQR miễn phí (VietinBank: ICB, STK: 102873491299)
    const bankId = 'ICB'; 
    const accountNo = '102873491299';
    const accountName = 'NGUYEN VAN A';
    
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact.png?amount=${totalAmount}&addInfo=${encodeURIComponent(orderCode)}&accountName=${encodeURIComponent(accountName)}`;
    
    qrImg.src = qrUrl;
}
