const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const Cookies = require("universal-cookie");
const cookies = new Cookies();



router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    // Save user to database
    await user.save(); 
       console.log(process.env.JWT_SECRET);
    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, userId: user._id, name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});





// Log in
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    req.session.user = user;

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set the token as a cookie
    cookies.set("authToken", token, { path: "/", httpOnly: true, maxAge: 3600000 });

    res.json({ token, userId: user._id, name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});




router.get('/login', (req, res) => {
  // Handle the login route logic
  // For example, you can send a JSON response
  res.json({ message: 'Login page' });
});

router.get('/protected', (req, res) => {
  if (req.session && req.session.user) {
    // User is logged in
    const user = req.session.user;
    // Handle the protected route logic
    res.status(200).json({ user });
  } else {
    // User is not logged in
    res.status(401).json({ message: 'User is not logged in' });
  }
});


router.get('/checkLoginStatus', (req, res) => {
  const authToken = cookies.get("authToken");

  if (authToken) {
    try {
      // Verify and decode the token
      const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);

      // User is logged in
      // You can access user information from the decoded token
      const userId = decodedToken.userId;
      const email = decodedToken.email;

      res.status(200).json({ userId, email });
    } catch (error) {
      // Token is invalid or expired
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    // Token is not provided
    res.status(401).json({ message: 'Token is not provided' });
  }
});



router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong' });
    } else {
      // Clear the token by setting it to an empty string or null
      cookies.set("authToken", "", { expires: new Date(0) });
      res.redirect('http://localhost:5000/api/users/login');
    }
  });
});







module.exports = router