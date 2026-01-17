// ===== AI CHATBOT SYSTEM =====

class MaroonReignChatbot {
    constructor() {
        this.isOpen = true;
        this.messages = [];
        this.products = products; // Access global products array from app.js
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.greetUser();
    }

    setupEventListeners() {
        const sendBtn = document.getElementById('chatSendBtn');
        const input = document.getElementById('chatInput');
        const toggle = document.getElementById('crownToggle');

        sendBtn?.addEventListener('click', () => this.sendMessage());
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        toggle?.addEventListener('click', () => this.toggleChat());
    }

    toggleChat() {
        const chatbot = document.querySelector('.crown-chatbot');
        this.isOpen = !this.isOpen;
        chatbot?.classList.toggle('closed');
    }

    greetUser() {
        this.addBotMessage(
            "👑 Welcome to Maroon Reign! I'm your personal style assistant. How can I help you today?",
            [
                "Show all products",
                "View my cart",
                "Best sellers",
                "Help me choose"
            ]
        );
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input?.value.trim();
        
        if (!message) return;

        this.addUserMessage(message);
        input.value = '';

        // Show typing indicator
        this.showTyping();

        // Process message after delay
        setTimeout(() => {
            this.hideTyping();
            this.processMessage(message);
        }, 800);
    }

    processMessage(message) {
        const lowerMsg = message.toLowerCase();

        // Cart-related queries
        if (lowerMsg.includes('cart') || lowerMsg.includes('bag')) {
            this.showCart();
        }
        // Product listing queries
        else if (lowerMsg.includes('show') || lowerMsg.includes('all') || lowerMsg.includes('products') || lowerMsg.includes('collection')) {
            this.showProducts();
        }
        // Best sellers
        else if (lowerMsg.includes('best') || lowerMsg.includes('popular') || lowerMsg.includes('top')) {
            this.showBestSellers();
        }
        // Specific product search
        else if (lowerMsg.includes('classic') || lowerMsg.includes('dynasty') || lowerMsg.includes('afro') || 
                 lowerMsg.includes('urban') || lowerMsg.includes('reign') || lowerMsg.includes('heritage')) {
            this.searchProduct(message);
        }
        // Help and recommendations
        else if (lowerMsg.includes('help') || lowerMsg.includes('choose') || lowerMsg.includes('recommend')) {
            this.recommendProducts();
        }
        // Price queries
        else if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much')) {
            this.showPricing();
        }
        // Checkout
        else if (lowerMsg.includes('checkout') || lowerMsg.includes('buy') || lowerMsg.includes('purchase')) {
            this.initiateCheckout();
        }
        // Default response
        else {
            this.addBotMessage(
                "I can help you with:\n• Browsing our collection\n• Viewing your cart\n• Finding the perfect tee\n• Checking out\n\nWhat would you like to do?",
                ["Show all products", "View cart", "Help me choose"]
            );
        }
    }

    showCart() {
        const currentCart = JSON.parse(localStorage.getItem('maroonReignCart')) || [];
        
        if (currentCart.length === 0) {
            this.addBotMessage(
                "Your cart is empty! Let me show you our amazing collection. 👑",
                ["Show all products", "Best sellers"]
            );
            return;
        }

        const total = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        this.addBotMessage(
            `You have ${currentCart.length} item(s) in your cart:\n\nTotal: $${total}`,
            ["Checkout now", "Continue shopping", "Clear cart"]
        );

        // Show each cart item with image
        currentCart.forEach(item => {
            this.addProductCard(item, item.quantity);
        });
    }

    showProducts() {
        this.addBotMessage(
            `We have ${this.products.length} premium items in our 2026 collection:`,
            ["Show details", "Filter by category"]
        );

        this.products.forEach(product => {
            this.addProductCard(product);
        });
    }

    showBestSellers() {
        const featured = [this.products[1], this.products[2]]; // Golden Dynasty & Afro Futurism
        
        this.addBotMessage(
            "Here are our best sellers this month! 🔥",
            ["Add to cart", "Show all products"]
        );

        featured.forEach(product => {
            this.addProductCard(product);
        });
    }

    searchProduct(query) {
        const lowerQuery = query.toLowerCase();
        const found = this.products.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) || 
            p.category.toLowerCase().includes(lowerQuery)
        );

        if (found.length > 0) {
            this.addBotMessage(`I found ${found.length} match(es):`);
            found.forEach(product => {
                this.addProductCard(product);
            });
        } else {
            this.addBotMessage(
                "I couldn't find that specific item. Here's our full collection:",
                ["Show all products"]
            );
        }
    }

    recommendProducts() {
        const random = this.products[Math.floor(Math.random() * this.products.length)];
        
        this.addBotMessage(
            "Based on our premium collection, I recommend this piece:",
            ["Add to cart", "Show more", "Different style"]
        );

        this.addProductCard(random);
    }

    showPricing() {
        this.addBotMessage(
            "All our premium tees are priced at $27 each!\n\n✓ 100% Premium Cotton\n✓ Limited Edition Designs\n✓ Free Shipping over $50",
            ["Show collection", "Add to cart"]
        );
    }

    initiateCheckout() {
        const currentCart = JSON.parse(localStorage.getItem('maroonReignCart')) || [];
        
        if (currentCart.length === 0) {
            this.addBotMessage(
                "Your cart is empty! Add some items first. 🛍️",
                ["Show products"]
            );
            return;
        }

        this.addBotMessage(
            "Perfect! Click the checkout button to complete your purchase securely with Stripe. 👑",
            ["Open checkout"]
        );
    }

    addBotMessage(text, quickActions = []) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">👑</div>
            <div class="message-bubble">
                ${text.replace(/\n/g, '<br>')}
                ${quickActions.length > 0 ? `
                    <div class="quick-actions">
                        ${quickActions.map(action => `
                            <button class="quick-action-btn" onclick="chatbot.handleQuickAction('${action}')">
                                ${action}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addUserMessage(text) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">👤</div>
            <div class="message-bubble">${text}</div>
        `;

        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addProductCard(product, quantity = null) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">👑</div>
            <div class="message-bubble">
                <div class="product-preview">
                    <img src="${product.image}" alt="${product.name}" class="product-preview-image">
                    <div class="product-preview-info">
                        <div class="product-preview-name">${product.name}</div>
                        <div class="product-preview-price">
                            ${quantity ? `Quantity: ${quantity} × ` : ''}$${product.price}
                            ${quantity ? ` = $${product.price * quantity}` : ''}
                        </div>
                    </div>
                </div>
                ${!quantity ? `
                    <div class="quick-actions">
                        <button class="quick-action-btn" onclick="addToCart(${product.id}); chatbot.addBotMessage('Added to cart! 🎉', ['View cart', 'Continue shopping'])">
                            Add to Cart
                        </button>
                        <button class="quick-action-btn" onclick="chatbot.addBotMessage('${product.description}')">
                            Details
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    handleQuickAction(action) {
        this.addUserMessage(action);
        
        setTimeout(() => {
            if (action === "Show all products" || action === "Show collection" || action === "Continue shopping" || action === "Show products") {
                this.showProducts();
            } else if (action === "View cart" || action === "View my cart") {
                this.showCart();
            } else if (action === "Best sellers") {
                this.showBestSellers();
            } else if (action === "Help me choose" || action === "Different style") {
                this.recommendProducts();
            } else if (action === "Checkout now" || action === "Open checkout") {
                document.getElementById('cartBtn')?.click();
                setTimeout(() => {
                    document.getElementById('checkoutBtn')?.click();
                }, 500);
            } else if (action === "Clear cart") {
                localStorage.removeItem('maroonReignCart');
                updateCartUI();
                this.addBotMessage("Cart cleared! Ready for a fresh start? 🎨", ["Show products"]);
            } else if (action === "Show details" || action === "Filter by category") {
                this.showProducts();
            } else {
                this.processMessage(action);
            }
        }, 300);
    }

    showTyping() {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing-message';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">👑</div>
            <div class="message-bubble">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;

        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTyping() {
        const typingIndicator = document.getElementById('typingIndicator');
        typingIndicator?.remove();
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
}

// Initialize chatbot when DOM is ready
let chatbot;
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        chatbot = new MaroonReignChatbot();
    }, 500);
});
