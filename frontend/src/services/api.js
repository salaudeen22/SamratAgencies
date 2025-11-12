import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

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
};

// Product APIs
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
};

// Cart APIs
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (productId, quantity) => api.post('/cart', { productId, quantity }),
  updateItem: (productId, quantity) => api.put('/cart', { productId, quantity }),
  removeItem: (productId) => api.delete(`/cart/${productId}`),
  clearCart: () => api.delete('/cart'),
};

// Order APIs
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
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

  // Delete image from S3
  deleteImage: (key) => api.delete('/upload/image', { data: { key } }),

  // Add images to product
  addProductImages: (productId, images) => api.post(`/products/${productId}/images`, { images }),

  // Remove image from product
  removeProductImage: (productId, imageKey) => api.delete(`/products/${productId}/images`, { data: { imageKey } }),
};

export default api;
