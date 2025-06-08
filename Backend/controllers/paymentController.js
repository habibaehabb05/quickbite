const Payment = require('../Models/payment');
const Order = require('../Models/order');

// POST process payment
exports.processPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, amount, cardDetails } = req.body;
    
    if (!orderId || !paymentMethod || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify order exists
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if payment already exists for this order
    const existingPayment = await Payment.findOne({ orderId });
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment already processed for this order' });
    }

    // Generate payment ID
    const paymentCount = await Payment.countDocuments();
    const paymentId = `PAY-${Date.now()}-${paymentCount + 1}`;

    // Simulate payment processing
    let paymentStatus = 'completed';
    let transactionId = `TXN-${Date.now()}`;
    
    // For demonstration - simulate some payment failures
    if (Math.random() < 0.05) { // 5% failure rate
      paymentStatus = 'failed';
      transactionId = null;
    }

    // Create payment record
    const payment = new Payment({
      paymentId,
      orderId,
      userId: order.userId,
      amount,
      paymentMethod,
      status: paymentStatus,
      transactionId,
      ...(cardDetails && paymentMethod === 'card' && {
        cardDetails: {
          lastFourDigits: cardDetails.cardNumber.slice(-4),
          cardType: cardDetails.cardType
        }
      })
    });

    await payment.save();

    // Update order status based on payment result
    if (paymentStatus === 'completed') {
      await Order.findOneAndUpdate(
        { orderId },
        { status: 'confirmed' }
      );
    }

    res.status(201).json({
      message: paymentStatus === 'completed' ? 'Payment successful' : 'Payment failed',
      payment: {
        paymentId: payment.paymentId,
        status: payment.status,
        amount: payment.amount,
        transactionId: payment.transactionId
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error processing payment', error: err.message });
  }
};

// GET payment by order ID
exports.getPaymentByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const payment = await Payment.findOne({ orderId })
      .populate('userId', 'email')
      .populate('orderId', 'orderId totalAmount');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving payment', error: err.message });
  }
};

// GET payment by payment ID
exports.getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await Payment.findOne({ paymentId })
      .populate('userId', 'email')
      .populate('orderId', 'orderId totalAmount');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving payment', error: err.message });
  }
};

// GET user's payment history
exports.getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const payments = await Payment.find({ userId })
      .populate('orderId', 'orderId totalAmount')
      .sort({ createdAt: -1 });
    
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user payments', error: err.message });
  }
};

// GET all payments (admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'email')
      .populate('orderId', 'orderId totalAmount')
      .sort({ createdAt: -1 });
    
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving payments', error: err.message });
  }
};

// POST refund payment
exports.refundPayment = async (req, res) => {
  try {
    const { paymentId, refundReason } = req.body;
    
    if (!paymentId || !refundReason) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Can only refund completed payments' });
    }

    if (payment.status === 'refunded') {
      return res.status(400).json({ message: 'Payment already refunded' });
    }

    // Process refund (simulation)
    payment.status = 'refunded';
    payment.refundReason = refundReason;
    payment.refundedAt = new Date();
    
    await payment.save();

    // Update order status
    await Order.findOneAndUpdate(
      { orderId: payment.orderId },
      { status: 'cancelled' }
    );

    res.status(200).json({
      message: 'Payment refunded successfully',
      payment: {
        paymentId: payment.paymentId,
        status: payment.status,
        refundedAt: payment.refundedAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error processing refund', error: err.message });
  }
};

// GET payment statistics
exports.getPaymentStats = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments();
    const completedPayments = await Payment.countDocuments({ status: 'completed' });
    const failedPayments = await Payment.countDocuments({ status: 'failed' });
    const refundedPayments = await Payment.countDocuments({ status: 'refunded' });
    
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const paymentMethods = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, total: { $sum: '$amount' } } }
    ]);

    res.status(200).json({
      totalPayments,
      completedPayments,
      failedPayments,
      refundedPayments,
      totalRevenue: totalRevenue[0]?.total || 0,
      paymentMethods
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving payment statistics', error: err.message });
  }
};