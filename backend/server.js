const dotenv = require('dotenv');

// Load env vars FIRST
dotenv.config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./src/config/passport');
const connectDB = require('./src/config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'https://samratagencies.netlify.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/products', require('./src/routes/productRoutes'));
app.use('/api/categories', require('./src/routes/categoryRoutes'));
app.use('/api/cart', require('./src/routes/cartRoutes'));
app.use('/api/wishlist', require('./src/routes/wishlistRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/payment', require('./src/routes/paymentRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/admin', require('./src/routes/attributeRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes'));
app.use('/api/contact', require('./src/routes/contactRoutes'));
app.use('/api/coupons', require('./src/routes/couponRoutes'));
app.use('/', require('./src/routes/sitemapRoutes'));

// API info route
app.get('/api', (req, res) => {
  res.json({
    message: 'Furniture Ecommerce API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      cart: '/api/cart',
      wishlist: '/api/wishlist',
      orders: '/api/orders',
      payment: '/api/payment',
      users: '/api/users',
      admin: '/api/admin',
      upload: '/api/upload',
      contact: '/api/contact',
      coupons: '/api/coupons'
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Furniture Ecommerce API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
