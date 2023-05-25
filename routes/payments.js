const stripe = require('stripe')(process.env.SECRET_KEY);
const router = require("express").Router();


router.post('/', async (req, res) => {
    try {
      const { tokenId, amount } = req.body;
      const charge = await stripe.charges.create({
        amount: amount,
        currency: 'usd',
        source: tokenId,
      });
      res.json({ success: true, charge });
    } catch (error) {
      console.error(error);
      res.json({ success: false, error: error.message });
    }
  });

  module.exports = router;