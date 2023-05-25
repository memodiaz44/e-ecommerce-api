const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Order = require('../models/order');

// Existing endpoints
router.get('/search', (req, res) => {
  const query = req.query.query;
  let results = [];

  if (query) {
    results = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
  }

  res.json({ results });
});

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/products/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: `Product with id ${id} not found.` });
      return;
    }

    res.json({ product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// New endpoints
router.post('/products', async (req, res) => {
  const { name, price, description } = req.body;

  try {
    const newProduct = new Product({ name, price, description });
    await newProduct.save();

    res.json({ message: 'Product created successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/products/:id', async (req, res) => {
  const id = req.params.id;
  const { name, price, description } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: `Product with id ${id} not found.` });
      return;
    }

    product.name = name;
    product.price = price;
    product.description = description;

    await product.save();

    res.json({ message: `Product with id ${id} updated successfully.` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/products/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: `Product with id ${id} not found.` });
      return;
    }

    await product.remove();

    res.json({ message: `Product with id ${id} deleted successfully.` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/orders', async (req, res) => {
    const { customerId, productId, quantity } = req.body;
  
    try {
      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).json({ message: `Product with id ${productId} not found.` });
        return;
      }
  
      // Create new order
      const newOrder = new Order({ customerId, productId, quantity });
      await newOrder.save();
  
      // Update product quantity
      product.quantity -= quantity;
      await product.save();
  
      res.json({ message: 'Order created successfully' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.delete('/orders/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const order = await Order.findById(id);
      if (!order) {
        res.status(404).json({ message: `Order with id ${id} not found.` });
        return;
      }
  
      // Update product quantity
      const product = await Product.findById(order.productId);
      product.quantity += order.quantity;
      await product.save();
  
      await order.remove();
  
      res.json({ message: `Order with id ${id} deleted successfully.` });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server error' });
    }
  });


 

  module.exports = router;