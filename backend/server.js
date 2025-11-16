const dotenv = require('dotenv');

// Load env vars FIRST
dotenv.config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const passport = require('./src/config/passport');
const connectDB = require('./src/config/db');
const logger = require('./src/config/logger');
const requestLogger = require('./src/middleware/requestLogger');
const { apiLimiter, authLimiter, passwordResetLimiter, uploadLimiter, paymentLimiter, newsletterLimiter, contactLimiter } = require('./src/middleware/rateLimiter');

// Connect to database
connectDB();

const app = express();

// CORS - Must be first!
app.use(cors({
  origin: [
    'https://samratagencies.in',
    'https://www.samratagencies.in',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'sec-ch-ua', 'sec-ch-ua-mobile', 'sec-ch-ua-platform'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Sanitize data to prevent NoSQL injection
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// HTTP request logging
app.use(requestLogger);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply general rate limiting to all API routes
// app.use('/api/', apiLimiter);

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

// Routes with specific rate limiters
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/products', require('./src/routes/productRoutes'));
app.use('/api/categories', require('./src/routes/categoryRoutes'));
app.use('/api/cart', require('./src/routes/cartRoutes'));
app.use('/api/wishlist', require('./src/routes/wishlistRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/returns', require('./src/routes/returnRoutes'));
app.use('/api/payment', paymentLimiter, require('./src/routes/paymentRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/admin', require('./src/routes/attributeRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes'));
app.use('/api/contact', contactLimiter, require('./src/routes/contactRoutes'));
app.use('/api/coupons', require('./src/routes/couponRoutes'));
app.use('/api/delivery', require('./src/routes/deliveryRoutes'));
app.use('/api/recommendations', require('./src/routes/recommendationRoutes'));
app.use('/api/articles', require('./src/routes/articleRoutes'));
app.use('/api/reviews', require('./src/routes/reviewRoutes'));
app.use('/api/newsletter', newsletterLimiter, require('./src/routes/newsletterRoutes'));
app.use('/api/settings', require('./src/routes/settingsRoutes'));
app.use('/api/tickets', require('./src/routes/ticketRoutes'));
app.use('/api/bulk', require('./src/routes/bulkRoutes'));
app.use('/api/banners', require('./src/routes/bannerRoutes'));
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
      coupons: '/api/coupons',
      delivery: '/api/delivery'
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Furniture Ecommerce API' });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
    error: err.stack
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
