import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-amber-400">Samrat Agencies</h3>
            <p className="text-blue-100">
              Your trusted partner for quality furniture and home essentials.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-blue-100 hover:text-amber-400 transition">Home</Link></li>
              <li><Link to="/products" className="text-blue-100 hover:text-amber-400 transition">Products</Link></li>
              <li><Link to="/about" className="text-blue-100 hover:text-amber-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="text-blue-100 hover:text-amber-400 transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to="/profile" className="text-blue-100 hover:text-amber-400 transition">My Account</Link></li>
              <li><Link to="/cart" className="text-blue-100 hover:text-amber-400 transition">Shopping Cart</Link></li>
              <li><Link to="/orders" className="text-blue-100 hover:text-amber-400 transition">Order History</Link></li>
              <li><Link to="/help" className="text-blue-100 hover:text-amber-400 transition">Help & FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-blue-100">
              <li>Email: info@samratagencies.com</li>
              <li>Phone: +91 1234567890</li>
              <li>Address: Your City, State</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-indigo-700 mt-8 pt-8 text-center text-blue-100">
          <p>&copy; {new Date().getFullYear()} Samrat Agencies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
