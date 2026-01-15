// ===== Admin Portal JavaScript =====

// Sample Data
const products = [
    { id: 1, name: "Maroon Reign Classic", category: "classic", price: 27, stock: 150, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop" },
    { id: 2, name: "Golden Dynasty Tee", category: "signature", price: 27, stock: 85, image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=100&h=100&fit=crop" },
    { id: 3, name: "Afro Futurism Collection", category: "limited", price: 27, stock: 25, image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=100&h=100&fit=crop" },
    { id: 4, name: "Urban Royalty", category: "streetwear", price: 27, stock: 120, image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=100&h=100&fit=crop" },
    { id: 5, name: "Reign Supreme", category: "premium", price: 27, stock: 95, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&h=100&fit=crop" },
    { id: 6, name: "Heritage 2026", category: "heritage", price: 27, stock: 60, image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=100&h=100&fit=crop" }
];

const orders = [
    { id: "MR-2026-001", customer: "Marcus Johnson", email: "marcus@email.com", items: [{ name: "Maroon Reign Classic", qty: 2 }], total: 54, status: "delivered", date: "2026-01-15" },
    { id: "MR-2026-002", customer: "Aaliyah Williams", email: "aaliyah@email.com", items: [{ name: "Golden Dynasty Tee", qty: 1 }, { name: "Urban Royalty", qty: 1 }], total: 54, status: "shipped", date: "2026-01-14" },
    { id: "MR-2026-003", customer: "Devon Carter", email: "devon@email.com", items: [{ name: "Afro Futurism Collection", qty: 1 }], total: 27, status: "processing", date: "2026-01-14" },
    { id: "MR-2026-004", customer: "Zara Thompson", email: "zara@email.com", items: [{ name: "Reign Supreme", qty: 3 }], total: 81, status: "pending", date: "2026-01-15" }
];

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');
const pageTitle = document.getElementById('pageTitle');
const dateDisplay = document.getElementById('dateDisplay');
const productModal = document.getElementById('productModal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    renderProducts();
    renderOrders();
    updateDashboard();
    setupNavigation();
});

// Date Display
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString('en-US', options);
}

// Navigation
function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.dataset.tab;
            switchTab(tab);
        });
    });
}

function switchTab(tabId) {
    navItems.forEach(item => item.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    const activeNav = document.querySelector(`[data-tab="${tabId}"]`);
    const activeTab = document.getElementById(tabId);
    
    if (activeNav) activeNav.classList.add('active');
    if (activeTab) activeTab.classList.add('active');
    
    const titles = { dashboard: 'Dashboard', products: 'Products', orders: 'Orders', stripe: 'Stripe Integration', settings: 'Settings' };
    pageTitle.textContent = titles[tabId] || 'Dashboard';
}

// Dashboard
function updateDashboard() {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toLocaleString()}`;
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalProducts').textContent = products.length;
    
    const recentOrdersList = document.getElementById('recentOrdersList');
    if (orders.length === 0) {
        recentOrdersList.innerHTML = '<p class="empty-state">No orders yet</p>';
    } else {
        recentOrdersList.innerHTML = orders.slice(0, 5).map(order => `
            <div style="display:flex;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                <div><strong style="font-size:0.9rem;">${order.id}</strong><br><span style="font-size:0.8rem;color:#6B7280;">${order.customer}</span></div>
                <div style="text-align:right;"><span style="color:#F5C518;font-weight:600;">$${order.total}</span><br><span class="status-badge ${order.status}">${order.status}</span></div>
            </div>
        `).join('');
    }
}

// Products Table
function renderProducts() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" class="table-img"></td>
            <td><strong>${product.name}</strong></td>
            <td><span style="text-transform:capitalize;">${product.category}</span></td>
            <td>$${product.price}</td>
            <td><span style="color:${product.stock < 30 ? '#EF4444' : '#10B981'}">${product.stock}</span></td>
            <td><div class="table-actions">
                <button class="table-btn" onclick="editProduct(${product.id})" title="Edit"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                <button class="table-btn delete" onclick="deleteProduct(${product.id})" title="Delete"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
            </div></td>
        </tr>
    `).join('');
}

// Orders Table
function renderOrders(filter = 'all') {
    const tbody = document.getElementById('ordersTableBody');
    const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);
    
    if (filteredOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#6B7280;padding:2rem;">No orders found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}<br><span style="font-size:0.8rem;color:#6B7280;">${order.email}</span></td>
            <td>${order.items.map(i => `${i.name} x${i.qty}`).join('<br>')}</td>
            <td style="color:#F5C518;font-weight:600;">$${order.total}</td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
            <td>${order.date}</td>
            <td><div class="table-actions">
                <button class="table-btn" onclick="viewOrder('${order.id}')" title="View"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                <button class="table-btn" onclick="updateOrderStatus('${order.id}')" title="Update"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></button>
            </div></td>
        </tr>
    `).join('');
}

// Order filter
document.getElementById('orderFilter')?.addEventListener('change', (e) => {
    renderOrders(e.target.value);
});

// Product Modal
function openProductModal(productId = null) {
    document.getElementById('modalTitle').textContent = productId ? 'Edit Product' : 'Add New Product';
    document.getElementById('productForm').reset();
    
    if (productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productCategory').value = product.category;
        }
    }
    productModal.classList.add('active');
}

function closeProductModal() {
    productModal.classList.remove('active');
}

function editProduct(id) { openProductModal(id); }
function deleteProduct(id) { if (confirm('Delete this product?')) { alert('Product deleted (demo)'); } }
function viewOrder(id) { alert(`Viewing order ${id} (demo)`); }
function updateOrderStatus(id) { alert(`Update status for ${id} (demo)`); }

// Copy functions
function copyKey(inputId) {
    const input = document.getElementById(inputId);
    navigator.clipboard.writeText(input.value).then(() => alert('Copied to clipboard!'));
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
}

// Form submission
document.getElementById('productForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Product saved (demo mode)');
    closeProductModal();
});

// Make functions globally available
window.switchTab = switchTab;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.viewOrder = viewOrder;
window.updateOrderStatus = updateOrderStatus;
window.copyKey = copyKey;
window.copyText = copyText;
