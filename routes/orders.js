const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/order');

router.post('/', async (req, res) => {
  try {
    const { tokenId, amount, user, email, shippingAddress, items } = req.body;
    const charge = await stripe.charges.create({
      amount: amount,
      currency: 'usd',
      source: tokenId,
    });

    // Create a new order document in the database
    const order = new Order({
      user,
      email,
      shippingAddress,
      items,
      total: amount,
      paymentStatus: 'paid'
    });
    await order.save();

    res.json({ success: true, charge });
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: error.message });
  }
});

module.exports = router;