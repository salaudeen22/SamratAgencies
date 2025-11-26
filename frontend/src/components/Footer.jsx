import { Link } from 'react-router-dom';
import { useState } from 'react';
import { newsletterAPI } from '../services/api';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setSubscribing(true);
      await newsletterAPI.subscribe({ email });
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="mt-auto" style={{ backgroundColor: '#1F2D38' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8">
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ color: '#895F42' }}>Samrat Agencies</h3>
            <p className="text-xs sm:text-sm mb-3" style={{ color: '#E0EAF0' }}>
              Established in 1996
            </p>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#BDD7EB' }}>
              Babu Reddy Complex, 5<br />
              Begur Main Road, Hongasandra<br />
              Bommanahalli, Bengaluru<br />
              Karnataka 560114
            </p>
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4" style={{ color: '#E5EFF3' }}>Quick Links</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li><Link to="/" className="transition" style={{ color: '#BDD7EB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}>Home</Link></li>
              <li><Link to="/products" className="transition" style={{ color: '#BDD7EB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}>Products</Link></li>
              <li><Link to="/about" className="transition" style={{ color: '#BDD7EB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}>About Us</Link></li>
              <li><Link to="/blog" className="transition" style={{ color: '#BDD7EB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}>Blog</Link></li>
              <li><Link to="/contact" className="transition" style={{ color: '#BDD7EB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}>Contact</Link></li>
              <li><Link to="/support" className="transition" style={{ color: '#BDD7EB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}>Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4" style={{ color: '#E5EFF3' }}>Policies</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li><Link to="/privacy-policy" className="transition" style={{ color: '#BDD7EB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}>Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="transition" style={{ color: '#BDD7EB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}>Terms & Conditions</Link></li>
              <li><Link to="/shipping-and-delivery" className="transition" style={{ color: '#BDD7EB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}>Shipping & Delivery</Link></li>
              <li><Link to="/cancellation-and-refund" className="transition" style={{ color: '#BDD7EB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}>Cancellation & Refund</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4" style={{ color: '#E5EFF3' }}>Find Us Online</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>
                <a
                  href="https://www.google.com/maps/place/Samrat+Agencies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition"
                  style={{ color: '#BDD7EB' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}
                >
                  Google My Business
                </a>
              </li>
              <li>
                <a
                  href="https://www.justdial.com/Bangalore/Samrat-Agencies-Near-Reliance-Fresh-Hongasandra/080P5169625_BZDET"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition"
                  style={{ color: '#BDD7EB' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}
                >
                  JustDial
                </a>
              </li>
              <li>
                <a
                  href="https://magicpin.in/Bengaluru/Bommanahalli/Lifestyle/Samrat-Agencies-Dealer-Samsung-Furniture-Expert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition"
                  style={{ color: '#BDD7EB' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}
                >
                  MagicPIN
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/samratagencieshongasandra/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition"
                  style={{ color: '#BDD7EB' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.indiamart.com/samrat-agencies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition"
                  style={{ color: '#BDD7EB' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}
                >
                  IndiaMART
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/samrat_agencies/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition"
                  style={{ color: '#BDD7EB' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4" style={{ color: '#E5EFF3' }}>Contact</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm" style={{ color: '#E0EAF0' }}>
              <li className="font-semibold">Phone:</li>
              <li>+91 98809 14457</li>
              <li>+91 94480 75801</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Newsletter Section */}
      <div className="border-t" style={{ borderColor: '#334155' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#E5EFF3' }}>
              Stay in the Loop
            </h3>
            <p className="mb-6" style={{ color: '#BDD7EB' }}>
              Get exclusive deals, design tips, and new arrival alerts delivered to your inbox
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#2D3748', color: '#E0EAF0', borderColor: '#475569' }}
                required
              />
              <button
                type="submit"
                disabled={subscribing}
                className="px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#895F42', color: 'white' }}
                onMouseEnter={(e) => !subscribing && (e.currentTarget.style.backgroundColor = '#9F8065')}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#895F42'}
              >
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            <p className="text-xs mt-3" style={{ color: '#94A1AB' }}>
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t" style={{ borderColor: '#334155' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-3">
            <p className="text-xs sm:text-sm" style={{ color: '#BDD7EB' }}>
              &copy; {new Date().getFullYear()} Samrat Agencies. All rights reserved.
            </p>

            {/* Developer Credit */}
            <div className="flex items-center justify-center gap-2 text-xs" style={{ color: '#94A1AB' }}>
              <span>Developed & Built by</span>
              <a
                href="https://www.linkedin.com/company/the-pi-aerotech/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold transition-all hover:scale-105"
                style={{ color: '#895F42' }}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span>Piaerotech</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
