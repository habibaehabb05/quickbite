const Order = require('../Models/order');
const Cart = require('../Models/cart');
const User = require('../Models/user');

// POST create new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, deliveryAddress, paymentMethod, specialInstructions } = req.body;
    
    if (!userId || !deliveryAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate('items.menuItemId', 'name price');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Generate order ID
    const orderCount = await Order.countDocuments();
    const orderId = `ORD-${Date.now()}-${orderCount + 1}`;

    // Create order
    const order = new Order({
      orderId,
      userId,
      restaurantId: cart.restaurantId,
      items: cart.items.map(item => ({
        menuItemId: item.menuItemId._id,
        name: item.menuItemId.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: cart.totalAmount,
      deliveryAddress,
      paymentMethod,
      specialInstructions: specialInstructions || '',
      status: 'pending',
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000) // 45 minutes from now
    });

    await order.save();

    // Clear the cart after order creation
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ 
      message: 'Order created successfully', 
      order: {
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        status: order.status,
        estimatedDeliveryTime: order.estimatedDeliveryTime
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
};

// GET all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving orders', error: err.message });
  }
};

// GET user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });
    
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user orders', error: err.message });
  }
};

// GET order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ orderId })
      .populate('userId', 'email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving order', error: err.message });
  }
};

// PUT update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      { 
        status,
        ...(status === 'delivered' && { deliveredAt: new Date() })
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status', error: err.message });
  }
};

// GET orders by restaurant
exports.getOrdersByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    const orders = await Order.find({ restaurantId })
      .populate('userId', 'email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving restaurant orders', error: err.message });
  }
};

// GET order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.status(200).json({
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving order statistics', error: err.message });
  }
};