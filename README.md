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

- User authentication (register, login, JWT)
- Product catalog with filtering and search
- Shopping cart functionality
- Order management
- Admin panel for product/order management
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
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
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

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router for navigation
- Context API for state management
- Axios for API calls

## Next Steps

1. Add product images with Cloudinary integration
2. Implement payment gateway (Stripe/PayPal)
3. Add product reviews and ratings
4. Create admin dashboard
5. Add order tracking
6. Implement email notifications

## License

MIT
