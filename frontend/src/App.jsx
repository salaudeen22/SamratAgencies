import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CompareBar from './components/CompareBar';
import AdminRoute from './components/AdminRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorPage from './components/ErrorPage';
import AuthModal from './components/AuthModal';
import './App.css';

// Lazy load all page components
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Compare = lazy(() => import('./pages/Compare'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogArticle = lazy(() => import('./pages/BlogArticle'));
const GoogleAuthSuccess = lazy(() => import('./pages/GoogleAuthSuccess'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const ShippingAndDelivery = lazy(() => import('./pages/ShippingAndDelivery'));
const CancellationAndRefund = lazy(() => import('./pages/CancellationAndRefund'));
const Support = lazy(() => import('./pages/Support'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy load admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminCategories = lazy(() => import('./pages/admin/Categories'));
const AdminAttributes = lazy(() => import('./pages/admin/Attributes'));
const AdminAttributeSets = lazy(() => import('./pages/admin/AttributeSets'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminReturns = lazy(() => import('./pages/admin/Returns'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminCoupons = lazy(() => import('./pages/admin/Coupons'));
const AdminDeliveryZones = lazy(() => import('./pages/admin/DeliveryZones'));
const AdminArticles = lazy(() => import('./pages/admin/Articles'));
const AdminNewsletter = lazy(() => import('./pages/admin/Newsletter'));
const AdminReviews = lazy(() => import('./pages/admin/Reviews'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AdminContactMessages = lazy(() => import('./pages/admin/ContactMessages'));
const AdminReports = lazy(() => import('./pages/admin/Reports'));
const AdminMediaLibrary = lazy(() => import('./pages/admin/MediaLibrary'));
const AdminBulkOperations = lazy(() => import('./pages/admin/BulkOperations'));
const AdminSupportSystem = lazy(() => import('./pages/admin/SupportSystem'));
const AdminBanners = lazy(() => import('./pages/admin/Banners'));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fafaf9' }}>
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#816047' }}></div>
      <p className="mt-4 text-lg" style={{ color: '#2F1A0F' }}>Loading...</p>
    </div>
  </div>
);

// Error fallback for lazy loading failures
const LazyLoadErrorFallback = ({ error, resetErrorBoundary }) => (
  <ErrorPage error={error} resetErrorBoundary={resetErrorBoundary} />
);

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Auth Modal Wrapper
function AuthModalWrapper() {
  const { showAuthModal, setShowAuthModal } = useCart();
  return (
    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      defaultTab="login"
    />
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <Toaster position="top-right" />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <RecentlyViewedProvider>
                  <AuthModalWrapper />
                  <Suspense fallback={<LoadingFallback />}>
                <Routes>
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <AdminRoute>
                    <AdminCategories />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/attributes"
                element={
                  <AdminRoute>
                    <AdminAttributes />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/attribute-sets"
                element={
                  <AdminRoute>
                    <AdminAttributeSets />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/returns"
                element={
                  <AdminRoute>
                    <AdminReturns />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/coupons"
                element={
                  <AdminRoute>
                    <AdminCoupons />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/delivery-zones"
                element={
                  <AdminRoute>
                    <AdminDeliveryZones />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/articles"
                element={
                  <AdminRoute>
                    <AdminArticles />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/newsletter"
                element={
                  <AdminRoute>
                    <AdminNewsletter />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/reviews"
                element={
                  <AdminRoute>
                    <AdminReviews />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminRoute>
                    <AdminSettings />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/contact-messages"
                element={
                  <AdminRoute>
                    <AdminContactMessages />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <AdminRoute>
                    <AdminReports />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/media-library"
                element={
                  <AdminRoute>
                    <AdminMediaLibrary />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/bulk-operations"
                element={
                  <AdminRoute>
                    <AdminBulkOperations />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/support"
                element={
                  <AdminRoute>
                    <AdminSupportSystem />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/banners"
                element={
                  <AdminRoute>
                    <AdminBanners />
                  </AdminRoute>
                }
              />

              {/* Auth Routes (without Navbar/Footer) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />

              {/* Public Routes (with Navbar/Footer) */}
              <Route
                path="/*"
                element={
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="grow">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/compare" element={<Compare />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/blog/:slug" element={<BlogArticle />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                        <Route path="/shipping-and-delivery" element={<ShippingAndDelivery />} />
                        <Route path="/cancellation-and-refund" element={<CancellationAndRefund />} />
                        <Route path="/support" element={<Support />} />
                        {/* 404 Catch-all route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <CompareBar />
                    <Footer />
                  </div>
                }
              />
              </Routes>
            </Suspense>
                </RecentlyViewedProvider>
              </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
