const Cart = require('../Models/cart');
const Menu = require('../Models/menu');

// GET user's cart
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const cart = await Cart.findOne({ userId }).populate('items.menuItemId', 'name price');
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving cart', error: err.message });
  }
};

// POST add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, menuItemId, quantity, restaurantId } = req.body;
    
    if (!userId || !menuItemId || !quantity || !restaurantId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if menu item exists
    const menu = await Menu.findOne({ restaurantId });
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    const menuItem = menu.items.id(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId,
        restaurantId,
        items: [{
          menuItemId,
          quantity,
          price: menuItem.price
        }],
        totalAmount: menuItem.price * quantity
      });
    } else {
      // Check if cart is for same restaurant
      if (cart.restaurantId !== restaurantId) {
        return res.status(400).json({ 
          message: 'You can only order from one restaurant at a time. Clear your cart first.' 
        });
      }

      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.menuItemId.toString() === menuItemId
      );

      if (existingItemIndex > -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({
          menuItemId,
          quantity,
          price: menuItem.price
        });
      }

      // Recalculate total
      cart.totalAmount = cart.items.reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );
    }

    await cart.save();
    res.status(200).json({ message: 'Item added to cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error adding item to cart', error: err.message });
  }
};

// PUT update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { userId, menuItemId, quantity } = req.body;
    
    if (!userId || !menuItemId || quantity < 1) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.menuItemId.toString() === menuItemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    
    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );

    await cart.save();
    res.status(200).json({ message: 'Cart updated', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error updating cart', error: err.message });
  }
};

// DELETE remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, menuItemId } = req.body;
    
    if (!userId || !menuItemId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.menuItemId.toString() !== menuItemId
    );

    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );

    await cart.save();
    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error removing item from cart', error: err.message });
  }
};

// DELETE clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const cart = await Cart.findOneAndDelete({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing cart', error: err.message });
  }
};