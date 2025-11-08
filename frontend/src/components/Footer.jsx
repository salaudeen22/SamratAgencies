import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Samrat Agencies</h3>
            <p className="text-gray-400">
              Your trusted partner for quality furniture and home essentials.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white transition">Products</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to="/profile" className="text-gray-400 hover:text-white transition">My Account</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-white transition">Shopping Cart</Link></li>
              <li><Link to="/orders" className="text-gray-400 hover:text-white transition">Order History</Link></li>
              <li><Link to="/help" className="text-gray-400 hover:text-white transition">Help & FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@samratagencies.com</li>
              <li>Phone: +91 1234567890</li>
              <li>Address: Your City, State</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Samrat Agencies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
