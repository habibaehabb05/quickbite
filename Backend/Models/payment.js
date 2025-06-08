const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    method: {
        type: String,
        enum: ['cash', 'card', 'digital_wallet'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    transactionId: String, // للدفع الإلكتروني
    cardDetails: {
        cardholderName: String,
        last4Digits: String,
        expiryMonth: Number,
        expiryYear: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    processedAt: Date
});

module.exports = mongoose.model('Payment', PaymentSchema);