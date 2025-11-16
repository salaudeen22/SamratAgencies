import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

// Product APIs
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  search: (params) => api.get('/products/search', { params }),
};

// Cart APIs
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (productId, quantity, selectedVariants, calculatedPrice) =>
    api.post('/cart', { productId, quantity, selectedVariants, calculatedPrice }),
  updateItem: (productId, quantity, selectedVariants) =>
    api.put('/cart', { productId, quantity, selectedVariants }),
  removeItem: (productId, selectedVariants) =>
    api.delete(`/cart/${productId}`, { data: { selectedVariants } }),
  clearCart: () => api.delete('/cart'),
};

// Wishlist APIs
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addItem: (productId) => api.post('/wishlist', { productId }),
  removeItem: (productId) => api.delete(`/wishlist/${productId}`),
  clearWishlist: () => api.delete('/wishlist'),
  checkStatus: (productId) => api.get(`/wishlist/check/${productId}`),
};

// Order APIs
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancelOrder: (id, data) => api.put(`/orders/${id}/cancel`, data),
};

// Payment APIs
export const paymentAPI = {
  getRazorpayKey: () => api.get('/payment/razorpay/key'),
  createRazorpayOrder: (amount, currency, receipt) => api.post('/payment/razorpay/order', { amount, currency, receipt }),
  verifyRazorpayPayment: (paymentData) => api.post('/payment/razorpay/verify', paymentData),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getAddresses: () => api.get('/users/addresses'),
  addAddress: (address) => api.post('/users/addresses', address),
  updateAddress: (id, address) => api.put(`/users/addresses/${id}`, address),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
};

// Category APIs
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
};

// Admin APIs
export const adminAPI = {
  // Dashboard
  getStats: () => api.get('/admin/stats'),

  // Products
  getProducts: (params) => api.get('/admin/products', { params }),
  createProduct: (productData) => api.post('/admin/products', productData),
  updateProduct: (id, productData) => api.put(`/admin/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),

  // Orders
  getOrders: (params) => api.get('/admin/orders', { params }),
  getOrderById: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, statusData) => api.put(`/admin/orders/${id}/status`, statusData),
  cancelOrder: (id, data) => api.put(`/admin/orders/${id}/cancel`, data),
  togglePaymentStatus: (id) => api.put(`/admin/orders/${id}/payment`),

  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserAdmin: (id, isAdmin) => api.put(`/admin/users/${id}/admin`, { isAdmin }),

  // Categories
  getCategories: () => api.get('/categories/admin/all'),
  createCategory: (categoryData) => api.post('/categories/admin', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/admin/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/admin/${id}`),

  // Subcategories
  addSubcategory: (categoryId, subcategoryData) => api.post(`/categories/admin/${categoryId}/subcategories`, subcategoryData),
  updateSubcategory: (categoryId, subId, subcategoryData) => api.put(`/categories/admin/${categoryId}/subcategories/${subId}`, subcategoryData),
  deleteSubcategory: (categoryId, subId) => api.delete(`/categories/admin/${categoryId}/subcategories/${subId}`),

  // Attributes
  getAttributes: () => api.get('/admin/attributes'),
  createAttribute: (attributeData) => api.post('/admin/attributes', attributeData),
  updateAttribute: (id, attributeData) => api.put(`/admin/attributes/${id}`, attributeData),
  deleteAttribute: (id) => api.delete(`/admin/attributes/${id}`),

  // Attribute Sets
  getAttributeSets: () => api.get('/admin/attribute-sets'),
  getAttributeSet: (id) => api.get(`/admin/attribute-sets/${id}`),
  createAttributeSet: (setData) => api.post('/admin/attribute-sets', setData),
  updateAttributeSet: (id, setData) => api.put(`/admin/attribute-sets/${id}`, setData),
  deleteAttributeSet: (id) => api.delete(`/admin/attribute-sets/${id}`),
};

// Upload APIs
export const uploadAPI = {
  // Upload single image
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Upload multiple images
  uploadImages: (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    return api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // List all S3 files
  getFiles: () => api.get('/upload/files'),

  // Delete image from S3
  deleteImage: (key) => api.delete('/upload/image', { data: { key } }),

  // Add images to product
  addProductImages: (productId, images) => api.post(`/products/${productId}/images`, { images }),

  // Remove image from product
  removeProductImage: (productId, imageKey) => api.delete(`/products/${productId}/images`, { data: { imageKey } }),
};

// Contact API
export const contactAPI = {
  submitForm: (formData) => api.post('/contact', formData),
};

// Coupon APIs
export const couponAPI = {
  // Public/Customer
  getActiveCoupons: () => api.get('/coupons/active'),
  validateCoupon: (code, userId, cartTotal, cartItems) =>
    api.post('/coupons/validate', { code, userId, cartTotal, cartItems }),

  // Admin
  getAllCoupons: (params) => api.get('/coupons', { params }),
  getCouponById: (id) => api.get(`/coupons/${id}`),
  createCoupon: (couponData) => api.post('/coupons', couponData),
  updateCoupon: (id, couponData) => api.put(`/coupons/${id}`, couponData),
  deleteCoupon: (id) => api.delete(`/coupons/${id}`),
  getCouponStats: (id) => api.get(`/coupons/${id}/stats`),
  useCoupon: (id, userId, orderId, discountApplied) =>
    api.post(`/coupons/${id}/use`, { userId, orderId, discountApplied }),
};

// Delivery APIs
export const deliveryAPI = {
  // Public
  calculateDeliveryCharge: (pincode, cartTotal) =>
    api.post('/delivery/calculate', { pincode, cartTotal }),
  checkPincode: (pincode) => api.get(`/delivery/check/${pincode}`),

  // Admin
  getAllZones: () => api.get('/delivery/zones'),
  getZoneById: (id) => api.get(`/delivery/zones/${id}`),
  createZone: (zoneData) => api.post('/delivery/zones', zoneData),
  updateZone: (id, zoneData) => api.put(`/delivery/zones/${id}`, zoneData),
  deleteZone: (id) => api.delete(`/delivery/zones/${id}`),
};

// Recommendation APIs
export const recommendationAPI = {
  getSimilarProducts: (productId, limit = 6) =>
    api.get(`/recommendations/similar/${productId}`, { params: { limit } }),
  getFrequentlyBoughtTogether: (productId, limit = 3) =>
    api.get(`/recommendations/frequently-bought/${productId}`, { params: { limit } }),
  getCartBasedRecommendations: (cartItemIds, limit = 6) =>
    api.post('/recommendations/cart-based', { cartItemIds }, { params: { limit } }),
  getCompleteTheLook: (productId, limit = 4) =>
    api.get(`/recommendations/complete-look/${productId}`, { params: { limit } }),
  getTrendingProducts: (limit = 8) =>
    api.get('/recommendations/trending', { params: { limit } }),
  getNewArrivals: (limit = 8) =>
    api.get('/recommendations/new-arrivals', { params: { limit } }),
};

// Article/Blog APIs
export const articleAPI = {
  getAll: (params) => api.get('/articles', { params }),
  getBySlug: (slug) => api.get(`/articles/${slug}`),
  getFeatured: (limit = 3) => api.get('/articles/featured', { params: { limit } }),

  // Admin
  getAllAdmin: (params) => api.get('/articles/admin/all', { params }),
  create: (articleData) => api.post('/articles/admin', articleData),
  update: (id, articleData) => api.put(`/articles/admin/${id}`, articleData),
  delete: (id) => api.delete(`/articles/admin/${id}`),
  togglePublish: (id) => api.patch(`/articles/admin/${id}/toggle-publish`),
};

// Review APIs
export const reviewAPI = {
  getProductReviews: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  create: (reviewData) => api.post('/reviews', reviewData),
  update: (reviewId, reviewData) => api.put(`/reviews/${reviewId}`, reviewData),
  delete: (reviewId) => api.delete(`/reviews/${reviewId}`),

  // Admin
  getAllReviews: (params) => api.get('/reviews/admin/all', { params }),
  updateReviewStatus: (reviewId, isApproved) => api.patch(`/reviews/admin/${reviewId}/status`, { isApproved }),
  adminDelete: (reviewId) => api.delete(`/reviews/admin/${reviewId}`),
};

// Newsletter APIs
export const newsletterAPI = {
  subscribe: (data) => api.post('/newsletter/subscribe', data),
  unsubscribe: (email) => api.post('/newsletter/unsubscribe', { email }),

  // Admin
  getAll: (params) => api.get('/newsletter/admin/subscribers', { params }),
  getStats: () => api.get('/newsletter/admin/stats'),
  updateStatus: (id, status) => api.patch(`/newsletter/admin/subscribers/${id}/status`, { status }),
  delete: (id) => api.delete(`/newsletter/admin/subscribers/${id}`),
  export: () => api.get('/newsletter/admin/export'),
};

// Return APIs
export const returnAPI = {
  create: (returnData) => api.post('/returns', returnData),
  getUserReturns: () => api.get('/returns'),
  getById: (id) => api.get(`/returns/${id}`),
  cancel: (id) => api.put(`/returns/${id}/cancel`),

  // Admin
  getAllReturns: (params) => api.get('/returns/all', { params }),
  updateReturnStatus: (id, data) => api.put(`/returns/${id}/status`, data),
};

// Settings APIs
export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  updateSettings: (settingsData) => api.put('/settings', settingsData),
};

// Contact Messages APIs
export const contactMessagesAPI = {
  getAll: (params) => api.get('/contact/admin/messages', { params }),
  getById: (id) => api.get(`/contact/admin/messages/${id}`),
  markAsRead: (id) => api.patch(`/contact/admin/messages/${id}/read`),
  delete: (id) => api.delete(`/contact/admin/messages/${id}`),
};

// Ticket APIs (Support System)
export const ticketAPI = {
  // Customer
  create: (data) => api.post('/tickets', data),
  getMyTickets: (params) => api.get('/tickets', { params }),
  getById: (id) => api.get(`/tickets/${id}`),
  addMessage: (id, message) => api.post(`/tickets/${id}/messages`, { message }),

  // Admin
  getAllTickets: (params) => api.get('/tickets/admin/all', { params }),
  updateStatus: (id, status) => api.put(`/tickets/admin/${id}/status`, { status }),
  updatePriority: (id, priority) => api.put(`/tickets/admin/${id}/priority`, { priority }),
  assign: (id, assignedTo) => api.put(`/tickets/admin/${id}/assign`, { assignedTo }),
  delete: (id) => api.delete(`/tickets/admin/${id}`),
};

// Bulk Operations APIs
export const bulkAPI = {
  // Import
  importProducts: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/bulk/import/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  importUsers: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/bulk/import/users', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Export
  exportProducts: () => api.get('/bulk/export/products', { responseType: 'blob' }),
  exportUsers: () => api.get('/bulk/export/users', { responseType: 'blob' }),
  exportOrders: () => api.get('/bulk/export/orders', { responseType: 'blob' }),

  // Templates
  downloadTemplate: (type) => api.get(`/bulk/template/${type}`, { responseType: 'blob' }),
};

// Banner APIs
export const bannerAPI = {
  getAll: (position) => api.get('/banners', { params: { position } }),

  // Admin
  getAllAdmin: () => api.get('/banners/admin/all'),
  create: (bannerData) => api.post('/banners/admin', bannerData),
  update: (id, bannerData) => api.put(`/banners/admin/${id}`, bannerData),
  delete: (id) => api.delete(`/banners/admin/${id}`),
};

export default api;
