// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to get auth token
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Helper function to set auth headers
function getAuthHeaders() {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

// Helper function to handle API responses
async function handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }
    
    return data;
}

// Authentication API
const AuthAPI = {
    // Register new user
    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        const data = await handleResponse(response);
        
        // Store token and user info
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
        
        return data;
    },

    // Login user
    async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        
        const data = await handleResponse(response);
        
        // Store token and user info
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
        
        return data;
    },

    // Logout user
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
    },

    // Check if user is logged in
    isLoggedIn() {
        return !!getAuthToken();
    },

    // Get current user
    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }
};

// Menu API
const MenuAPI = {
    // Get all menu items
    async getMenuItems() {
        const response = await fetch(`${API_BASE_URL}/menu`);
        return await handleResponse(response);
    },

    // Add new menu item (Admin only)
    async addMenuItem(menuItem) {
        const response = await fetch(`${API_BASE_URL}/menu`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(menuItem)
        });
        
        return await handleResponse(response);
    },

    // Update menu item (Admin only)
    async updateMenuItem(id, updates) {
        const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updates)
        });
        
        return await handleResponse(response);
    },

    // Delete menu item (Admin only)
    async deleteMenuItem(id) {
        const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        return await handleResponse(response);
    }
};

// Orders API
const OrderAPI = {
    // Create new order
    async createOrder(orderData) {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(orderData)
        });
        
        return await handleResponse(response);
    },

    // Get user orders
    async getOrders() {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            headers: getAuthHeaders()
        });
        
        return await handleResponse(response);
    },

    // Update order status
    async updateOrderStatus(orderId, status) {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
        
        return await handleResponse(response);
    }
};

// Dashboard API (Admin only)
const DashboardAPI = {
    // Get dashboard statistics
    async getStats() {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
            headers: getAuthHeaders()
        });
        
        return await handleResponse(response);
    }
};

// Shopping Cart (Local Storage)
const CartAPI = {
    // Get cart items
    getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },

    // Add item to cart
    addToCart(item) {
        const cart = this.getCart();
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            cart.push({ ...item, quantity: item.quantity || 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartUI();
    },

    // Remove item from cart
    removeFromCart(itemId) {
        const cart = this.getCart();
        const updatedCart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        this.updateCartUI();
    },

    // Update item quantity
    updateQuantity(itemId, quantity) {
        const cart = this.getCart();
        const item = cart.find(cartItem => cartItem.id === itemId);
        
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = quantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                this.updateCartUI();
            }
        }
    },

    // Clear cart
    clearCart() {
        localStorage.removeItem('cart');
        this.updateCartUI();
    },

    // Get cart total
    getCartTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Get cart count
    getCartCount() {
        const cart = this.getCart();
        return cart.reduce((count, item) => count + item.quantity, 0);
    },

    // Update cart UI
    updateCartUI() {
        const cartCount = this.getCartCount();
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = cartCount;
            element.style.display = cartCount > 0 ? 'inline' : 'none';
        });
    }
};

// Utility functions
const Utils = {
    // Show loading spinner
    showLoading(element) {
        if (element) {
            element.innerHTML = '<div class="spinner">Loading...</div>';
        }
    },

    // Hide loading spinner
    hideLoading() {
        const spinners = document.querySelectorAll('.spinner');
        spinners.forEach(spinner => spinner.remove());
    },

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success');
    },

    // Show error message
    showError(message) {
        this.showNotification(message, 'error');
    },

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add some basic styling
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#4CAF50';
                break;
            case 'error':
                notification.style.backgroundColor = '#f44336';
                break;
            default:
                notification.style.backgroundColor = '#2196F3';
        }
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    },

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Format date
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Validate email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate phone number
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
};

// Initialize cart UI on page load
document.addEventListener('DOMContentLoaded', () => {
    CartAPI.updateCartUI();
    
    // Check if user is logged in and redirect if needed
    const currentPath = window.location.pathname;
    const protectedPaths = ['/dashboard', '/orders'];
    
    if (protectedPaths.includes(currentPath) && !AuthAPI.isLoggedIn()) {
        window.location.href = '/login';
    }
});

// Export APIs for global use
window.AuthAPI = AuthAPI;
window.MenuAPI = MenuAPI;
window.OrderAPI = OrderAPI;
window.DashboardAPI = DashboardAPI;
window.CartAPI = CartAPI;
window.Utils = Utils;