document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('cartData'))?.items || [];
    const cartCount = document.querySelector('.cart-count');
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.querySelector('.total-price');
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout');
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    updateCart();
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
document.getElementById('checkout').addEventListener('click', function() {
    const totalPrice = document.querySelector('.total-price').textContent;
    
    localStorage.setItem('cartTotal', totalPrice);
    
    window.location.href = "payment form.html";
    });
    checkoutBtn.addEventListener('click', proceedToCheckout);
    clearCartBtn.addEventListener('click', clearCart);
    
    function addToCart() {
        const mealBox = this.closest('.meal-box');
        const item = {
            name: this.getAttribute('data-name'),
            price: parseFloat(this.getAttribute('data-price')),
            description: mealBox.querySelector('p').textContent,
            id: Date.now()
        };
        
        cart.push(item);
        updateCart();
        showNotification(`${item.name} added to cart!`);
    }
    
    function proceedToCheckout() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const cartData = {
            items: cart,
            total: total.toFixed(2),
            count: cart.length,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('cartData', JSON.stringify(cartData));
        window.location.href ="salma\payment\payment.html";
    }
    
    function clearCart() {
        if (cart.length === 0) {
            showNotification('Cart is already empty');
            return;
        }
        
        cart = [];
        localStorage.removeItem('cartData');
        updateCart();
        showNotification('Cart cleared successfully');
    }
    
    function updateCart() {
        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length ? 'flex' : 'none';
        
        cartItemsContainer.innerHTML = '';
        
        let total = 0;
        
        cart.forEach(item => {
            total += item.price;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-desc">${item.description}</p>
                    <p class="cart-item-price">${item.price.toFixed(2)} EGP</p>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
            
            cartItemElement.querySelector('.cart-item-remove').addEventListener('click', () => {
                removeFromCart(item.id);
            });
        });
        
        totalPriceElement.textContent = `${total.toFixed(2)} EGP`;
    }
    
    function removeFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cartData', JSON.stringify({ items: cart }));
        updateCart();
        showNotification('Item removed from cart');
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function displayMenu(menuItems) {
    const menuContainer = document.getElementById('menu-container');
    menuItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.price}</p>
        `;
        menuContainer.appendChild(itemElement);
    });
}

    // Fetch menu items from the server
    fetch('http://localhost:3000/api/menu')
        .then(response => response.json())
        .then(data => {
            displayMenu(data);
        })
        .catch(error => {
            console.error('Error fetching menu:', error);
        });
});