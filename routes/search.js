const express = require('express');
const router = express.Router();


const Product = require('../models/product');

router.get('/', async (req, res) => {
  const { query } = req.query;

  try {
    const searchResults = await Product.find({ $text: { $search: query } });
    res.status(200).json({ results: searchResults });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;