// ===== FUTURISTIC ENHANCEMENTS =====

// ===== 1. PARTICLE BACKGROUND SYSTEM =====
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = document.documentElement.scrollHeight;
    }

    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.y > this.canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = this.canvas.height;

            // Mouse interaction
            if (this.mouse.x != null && this.mouse.y != null) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    particle.x -= dx / distance * 2;
                    particle.y -= dy / distance * 2;
                }
            }

            // Draw particle
            this.ctx.fillStyle = `rgba(245, 197, 24, ${particle.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Connect nearby particles
            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    this.ctx.strokeStyle = `rgba(245, 197, 24, ${(1 - distance / 120) * 0.2})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ===== 2. CUSTOM CURSOR =====
class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');
        this.dot = document.querySelector('.cursor-dot');
        this.outline = document.querySelector('.cursor-outline');
        this.cursorVisible = false;
        this.cursorEnlarged = false;
        
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.cursorVisible = true;
            this.toggleCursorVisibility();
            
            this.dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            this.outline.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });

        document.addEventListener('mousedown', () => {
            this.dot.style.transform += ' scale(0.5)';
            this.outline.style.transform += ' scale(1.5)';
        });

        document.addEventListener('mouseup', () => {
            this.dot.style.transform = this.dot.style.transform.replace(' scale(0.5)', '');
            this.outline.style.transform = this.outline.style.transform.replace(' scale(1.5)', '');
        });

        // Enlarge on hover
        const hoverTargets = document.querySelectorAll('a, button, .product-card');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                this.outline.style.transform += ' scale(1.8)';
                this.dot.style.backgroundColor = '#F5C518';
            });
            target.addEventListener('mouseleave', () => {
                this.outline.style.transform = this.outline.style.transform.replace(' scale(1.8)', '');
                this.dot.style.backgroundColor = '#F5C518';
            });
        });
    }

    toggleCursorVisibility() {
        if (this.cursorVisible) {
            this.cursor.style.opacity = '1';
        } else {
            this.cursor.style.opacity = '0';
        }
    }
}

// ===== 3. GSAP SCROLL ANIMATIONS =====
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero elements fade in
    gsap.from('[data-scroll]', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Product cards stagger animation
    gsap.from('.product-card', {
        scrollTrigger: {
            trigger: '.products-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // About section parallax
    gsap.to('.about-section', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        y: -50,
        ease: 'none'
    });

    // Stats counter animation
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const value = stat.textContent;
        if (!isNaN(parseInt(value))) {
            gsap.from(stat, {
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 80%'
                },
                textContent: 0,
                duration: 2,
                ease: 'power1.out',
                snap: { textContent: 1 }
            });
        }
    });
}

// ===== 4. PARALLAX SCROLLING =====
function initParallax() {
    const layers = document.querySelectorAll('.parallax-layer');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        layers.forEach((layer, index) => {
            const speed = (index + 1) * 0.05;
            layer.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ===== 5. DARK MODE TOGGLE =====
function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const prefersDark = localStorage.getItem('darkMode') === 'true';
    
    if (prefersDark) {
        document.body.classList.add('dark-mode');
    }

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        
        // Animate toggle
        gsap.to(toggle, {
            rotation: 360,
            duration: 0.5,
            ease: 'back.out'
        });
    });
}

// ===== 6. INTERACTIVE COLOR SWATCHES =====
function addColorSwatches() {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach((product, index) => {
        const colors = ['#ffffff', '#800020'];
        const swatchContainer = document.createElement('div');
        swatchContainer.className = 'color-swatches';
        
        colors.forEach((color, colorIndex) => {
            const swatch = document.createElement('button');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.setAttribute('aria-label', `Color option ${colorIndex + 1}`);
            
            swatch.addEventListener('click', (e) => {
                e.stopPropagation();
                const img = product.querySelector('.product-image');
                
                // Animate color transition
                gsap.to(img, {
                    filter: `hue-rotate(${colorIndex * 45}deg)`,
                    duration: 0.5,
                    ease: 'power2.out'
                });

                // Active state
                swatchContainer.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
            });
            
            if (colorIndex === 0) swatch.classList.add('active');
            swatchContainer.appendChild(swatch);
        });
        
        const productContent = product.querySelector('.product-content');
        productContent.insertBefore(swatchContainer, productContent.firstChild);
    });
}

// ===== 7. STOCK COUNTER & URGENCY INDICATORS =====
function addStockIndicators() {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const stock = Math.floor(Math.random() * 20) + 1;
        const viewerCount = Math.floor(Math.random() * 50) + 5;
        
        const stockIndicator = document.createElement('div');
        stockIndicator.className = 'stock-indicator';
        
        if (stock < 5) {
            stockIndicator.innerHTML = `
                <div class="urgency-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    Only ${stock} left!
                </div>
            `;
        } else {
            stockIndicator.innerHTML = `
                <div class="stock-count">${stock} in stock</div>
            `;
        }
        
        stockIndicator.innerHTML += `
            <div class="viewer-count">
                <span class="viewer-dot"></span>
                ${viewerCount} viewing
            </div>
        `;
        
        const imageContainer = product.querySelector('.product-image-container');
        imageContainer.appendChild(stockIndicator);
        
        // Animate viewer count
        const dot = stockIndicator.querySelector('.viewer-dot');
        gsap.to(dot, {
            opacity: 0.3,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });
    });
}

// ===== 8. MAGNETIC HOVER EFFECTS =====
function initMagneticButtons() {
    const buttons = document.querySelectorAll('button, .product-card');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(button, {
                x: x * 0.1,
                y: y * 0.1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

// ===== 9. VIDEO CONTROLS =====
function initVideoControls() {
    const video = document.getElementById('heroVideo');
    const hero = document.getElementById('hero');
    
    if (video) {
        // Pause/play on click
        hero.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

        // Slow motion on hover
        hero.addEventListener('mouseenter', () => {
            gsap.to(video, {
                playbackRate: 0.5,
                duration: 1
            });
        });

        hero.addEventListener('mouseleave', () => {
            gsap.to(video, {
                playbackRate: 1,
                duration: 1
            });
        });
    }
}

// ===== 10. INFINITE SCROLL LOADER =====
let currentPage = 1;
let isLoading = false;

function initInfiniteScroll() {
    window.addEventListener('scroll', () => {
        if (isLoading) return;
        
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset;
        const clientHeight = window.innerHeight;
        
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            loadMoreProducts();
        }
    });
}

function loadMoreProducts() {
    isLoading = true;
    const grid = document.getElementById('productsGrid');
    
    // Show loading indicator
    const loader = document.createElement('div');
    loader.className = 'loading-indicator';
    loader.innerHTML = `
        <div class="loader-spinner"></div>
        <p>Loading more premium items...</p>
    `;
    grid.parentElement.appendChild(loader);
    
    setTimeout(() => {
        loader.remove();
        isLoading = false;
        currentPage++;
        // In production, fetch more products from API
    }, 1500);
}

// ===== ENHANCED PRODUCT HOVER EFFECTS =====
function enhanceProductCards() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        const img = card.querySelector('.product-image');
        const content = card.querySelector('.product-content');
        
        card.addEventListener('mouseenter', () => {
            gsap.to(img, {
                scale: 1.1,
                duration: 0.6,
                ease: 'power2.out'
            });
            
            gsap.to(content, {
                y: -10,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(img, {
                scale: 1,
                duration: 0.6,
                ease: 'power2.out'
            });
            
            gsap.to(content, {
                y: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });
}

// ===== Initialize All Features =====
document.addEventListener('DOMContentLoaded', () => {
    // Check if on desktop (some features work better on desktop)
    const isDesktop = window.innerWidth > 768;
    
    // Initialize particle system
    new ParticleSystem();
    
    // Initialize custom cursor (desktop only)
    if (isDesktop) {
        new CustomCursor();
    }
    
    // Initialize GSAP animations
    initScrollAnimations();
    
    // Initialize parallax
    initParallax();
    
    // Initialize dark mode
    initDarkMode();
    
    // Wait for products to render, then enhance
    setTimeout(() => {
        addColorSwatches();
        addStockIndicators();
        initMagneticButtons();
        enhanceProductCards();
    }, 100);
    
    // Initialize video controls
    initVideoControls();
    
    // Initialize infinite scroll
    initInfiniteScroll();
    
    console.log('🚀 Futuristic enhancements loaded!');
});
