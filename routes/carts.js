// cartRoutes.js (or wherever you define your routes)

const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

// Get cart for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await Cart.findOne({ userId });
    res.json(cart.products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving cart data' });
  }
});

// Add product to cart
router.post('/', async (req, res) => {
  try {
    const { userId, product } = req.body;
    const cart = await Cart.findOne({ userId });

    if (cart) {
      // If the cart already exists, add the product to the products array
      cart.products.push(product);
      await cart.save();
      res.json(cart.products);
    } else {
      // If the cart doesn't exist, create a new cart with the product
      const newCart = new Cart({ userId, products: [product] });
      await newCart.save();
      res.json(newCart.products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding product to cart' });
  }
});

module.exports = router;
