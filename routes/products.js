const express = require('express');
const router = express.Router();
const Product = require('../models/product')

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(201).json({ message: 'found', products: products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
    const { products } = req.body;
  
    try {
      const savedProducts = await Promise.all(products.map(async product => {
        const newProduct = new Product(product);
        return await newProduct.save();
      }));
  
      res.status(200).json({ message: 'Products saved successfully!', savedProducts });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

router.delete('/:id', async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Not found' });
      }
      res.status(200).json({ message: 'Deleted', product: deletedProduct });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;