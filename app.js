// ===== Product Data =====
const products = [
    { id: 1, name: "Maroon Reign Classic", category: "classic", price: 27, description: "Premium cotton t-shirt with signature Maroon Reign emblem. Features 3D embroidered details and gold threading.", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop" },
    { id: 2, name: "Golden Dynasty Tee", category: "signature", price: 27, description: "Luxury oversized fit with geometric African patterns in metallic gold print on deep maroon base.", image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600&h=600&fit=crop" },
    { id: 3, name: "Afro Futurism Collection", category: "limited", price: 27, description: "Limited edition design merging traditional African art with cyberpunk aesthetics.", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=600&fit=crop" },
    { id: 4, name: "Urban Royalty", category: "streetwear", price: 27, description: "Streetwear meets luxury. Bold maroon with cascading gold patterns inspired by Kente cloth.", image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600&h=600&fit=crop" },
    { id: 5, name: "Reign Supreme", category: "premium", price: 27, description: "Premium heavyweight tee with 3D textured gold crown emblem. Ultra-soft fabric.", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop" },
    { id: 6, name: "Heritage 2026", category: "heritage", price: 27, description: "Contemporary fit featuring laser-etched African symbolism with reflective gold details.", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop" }
];

let cart = JSON.parse(localStorage.getItem('maroonReignCart')) || [];

const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const cartFooter = document.getElementById('cartFooter');
const checkoutBtn = document.getElementById('checkoutBtn');
const stripeModal = document.getElementById('stripeModal');
const modalClose = document.getElementById('modalClose');
const modalOrderItems = document.getElementById('modalOrderItems');
const modalTotal = document.getElementById('modalTotal');

function renderProducts() {
    productsGrid.innerHTML = products.map((product, index) => `
        <article class="product-card" style="animation-delay: ${index * 0.1}s">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                <div class="product-price"><span class="price-icon">👑</span><span>$${product.price}</span></div>
            </div>
            <div class="product-content">
                <span class="product-category category-${product.category}">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    Add to Cart
                </button>
            </div>
        </article>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) { existingItem.quantity += 1; } 
    else { cart.push({ ...product, quantity: 1 }); }
    saveCart(); updateCartUI(); openCart();
}

function removeFromCart(productId) { cart = cart.filter(item => item.id !== productId); saveCart(); updateCartUI(); }

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) { removeFromCart(productId); } 
    else { saveCart(); updateCartUI(); }
}

function saveCart() { localStorage.setItem('maroonReignCart', JSON.stringify(cart)); }

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">$${item.price}</p>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');
        cartFooter.style.display = 'block';
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total}`;
}

function openCart() { cartSidebar.classList.add('active'); cartOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeCartSidebar() { cartSidebar.classList.remove('active'); cartOverlay.classList.remove('active'); document.body.style.overflow = ''; }

cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartSidebar);
cartOverlay.addEventListener('click', closeCartSidebar);

function openStripeModal() {
    modalOrderItems.innerHTML = cart.map(item => `<div class="modal-order-item"><span>${item.name} × ${item.quantity}</span><span>$${item.price * item.quantity}</span></div>`).join('');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    modalTotal.textContent = `$${total}`;
    stripeModal.classList.add('active');
}

function closeStripeModal() { stripeModal.classList.remove('active'); if (!cartSidebar.classList.contains('active')) { document.body.style.overflow = ''; } }

checkoutBtn.addEventListener('click', openStripeModal);
modalClose.addEventListener('click', closeStripeModal);
stripeModal.addEventListener('click', (e) => { if (e.target === stripeModal) closeStripeModal(); });

document.addEventListener('DOMContentLoaded', () => { renderProducts(); updateCartUI(); });

// STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx | STRIPE_SECRET_KEY=sk_test_xxxxx | STRIPE_WEBHOOK_SECRET=whsec_xxxxx
