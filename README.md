# Furniture Ecommerce - MERN Stack

A full-stack furniture ecommerce application built with MongoDB, Express.js, React, and Node.js.

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth middleware
│   │   ├── models/       # MongoDB schemas
│   │   └── routes/       # API routes
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── context/      # React context for state management
    │   ├── pages/        # Page components
    │   ├── services/     # API service functions
    │   ├── hooks/        # Custom hooks
    │   └── utils/        # Utility functions
    ├── public/
    └── package.json
```

## Features

- User authentication (register, login, JWT, Google OAuth)
- Product catalog with categories, filtering and search
- Shopping cart functionality
- Multiple payment methods (Cash on Delivery, Razorpay)
- Order management and tracking
- Admin panel for product/order/user management
- Image upload with AWS S3
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   SESSION_SECRET=your_session_secret

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback
   FRONTEND_URL=http://localhost:5173

   # AWS S3 (for image uploads)
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET_NAME=your_bucket_name

   # Razorpay (for payment processing)
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the React app:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order to paid
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `GET /api/orders/all` - Get all orders (Admin)

### Payment
- `GET /api/payment/razorpay/key` - Get Razorpay public key
- `POST /api/payment/razorpay/order` - Create Razorpay order
- `POST /api/payment/razorpay/verify` - Verify Razorpay payment

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Passport.js for Google OAuth
- Razorpay for payment processing
- AWS S3 for image storage
- Multer for file uploads

### Frontend
- React 18
- React Router for navigation
- Context API for state management
- Axios for API calls

## Setup Razorpay

1. Create a Razorpay account at [https://razorpay.com](https://razorpay.com)
2. Go to Settings → API Keys
3. Generate API keys (Key ID and Key Secret)
4. Add these keys to your backend `.env` file:
   ```
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```
5. For testing, use Razorpay's test mode credentials
6. Test card details:
   - Card: 4111 1111 1111 1111
   - CVV: Any 3 digits
   - Expiry: Any future date

## License

MIT
