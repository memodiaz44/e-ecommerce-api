const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/users');
const cartRoute = require('./routes/carts');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();
const crypto = require('crypto');
const sessionSecret = crypto.randomBytes(32).toString('hex');


const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use(cookieParser());

// Create a MongoDB session store
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});

store.on('error', (error) => {
  console.error('Session store error:', error);
});

// Define session middleware
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Define the routes
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoute);
app.use('/api/cart', cartRoute);


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
