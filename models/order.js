const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  shippingAddress: {
    type: String,
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;