document.addEventListener('DOMContentLoaded', () => {
  let cart = JSON.parse(localStorage.getItem('cartData'))?.items || [];
  
  const cartCount = document.querySelector('.cart-count');
  const cartItemsContainer = document.querySelector('.cart-items');
  const totalPriceElement = document.querySelector('.total-price');
  const clearCartBtn = document.querySelector('.clear-cart-btn');
  const checkoutBtn = document.getElementById('checkout');
  const addToCartButtons = document.querySelectorAll('.add-to-cart');

  updateCart();

  addToCartButtons.forEach(button => button.addEventListener('click', addToCart));
  checkoutBtn.addEventListener('click', proceedToCheckout);
  clearCartBtn.addEventListener('click', clearCart);

  function addToCart() {
    const mealBox = this.closest('.meal-box');
    const item = {
      name: this.getAttribute('data-name'),
      price: parseFloat(this.getAttribute('data-price')),
      description: mealBox.querySelector('p').textContent,
      id: Date.now(),
      quantity: 1
    };

    const existingItem = cart.find(cartItem => 
      cartItem.name === item.name && cartItem.price === item.price
    );

    if (existingItem) {
      existingItem.quantity++;
      showNotification(`${item.name} quantity increased!`);
    } else {
      cart.push(item);
      showNotification(`${item.name} added to cart!`);
    }

    updateCart();
  }

  function proceedToCheckout() {
    if (cart.length === 0) {
      showNotification('Your cart is empty!');
      return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartData = {
      items: cart,
      total: total.toFixed(2),
      count: cart.reduce((sum, item) => sum + item.quantity, 0),
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('cartData', JSON.stringify(cartData));
    window.location.href = "http://127.0.0.1:5500/frontend/Pages/payment.html";
    showNotification('Proceeding to checkout...');
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
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems ? 'flex' : 'none';
    cartItemsContainer.innerHTML = '';

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cart.forEach(item => {
      const cartItemElement = document.createElement('div');
      cartItemElement.className = 'cart-item';
      cartItemElement.innerHTML = `
        <div class="cart-item-info">
          <h4 class="cart-item-name">${item.name}</h4>
          <p class="cart-item-desc">${item.description}</p>
          <p class="cart-item-price">${(item.price * item.quantity).toFixed(2)} EGP 
            <span class="item-quantity">(x${item.quantity})</span>
          </p>
        </div>
        <div class="cart-item-actions">
          <button class="cart-item-decrease" data-id="${item.id}">-</button>
          <button class="cart-item-remove" data-id="${item.id}">
            <i class="fas fa-trash"></i>
          </button>
          <button class="cart-item-increase" data-id="${item.id}">+</button>
        </div>
      `;

      cartItemsContainer.appendChild(cartItemElement);

      cartItemElement.querySelector('.cart-item-remove').addEventListener('click', () => removeFromCart(item.id));
      cartItemElement.querySelector('.cart-item-increase').addEventListener('click', () => adjustQuantity(item.id, 1));
      cartItemElement.querySelector('.cart-item-decrease').addEventListener('click', () => adjustQuantity(item.id, -1));
    });

    totalPriceElement.textContent = `${total.toFixed(2)} EGP`;
    localStorage.setItem('cartData', JSON.stringify({ items: cart }));
  }

  function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
    showNotification('Item removed from cart');
  }

  function adjustQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    updateCart();
    showNotification(`Quantity updated for ${item.name}`);
  }

  function showNotification(message) {
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('navbar-toggle');
  const menu = document.getElementById('navbar-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function() {
      menu.classList.toggle('active');
    });
  }
});