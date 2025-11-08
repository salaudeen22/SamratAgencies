import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto" style={{ backgroundColor: '#1F2D38' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#B29B87' }}>Samrat Agencies</h3>
            <p className="mb-4" style={{ color: '#E0EAF0' }}>
              Furniture Expert | Samsung Dealer
            </p>
            <p className="text-sm mb-2" style={{ color: '#E0EAF0' }}>
              Established in 1991
            </p>
            <p className="text-sm" style={{ color: '#E0EAF0' }}>
              Rated 5.0 ★ (108+ Reviews)
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#E5EFF3' }}>Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="transition" style={{ color: '#BDD7EB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#B29B87'} onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}>Home</Link></li>
              <li><Link to="/products" className="transition" style={{ color: '#BDD7EB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#B29B87'} onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}>Products</Link></li>
              <li><Link to="/about" className="transition" style={{ color: '#BDD7EB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#B29B87'} onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}>About Us</Link></li>
              <li><Link to="/contact" className="transition" style={{ color: '#BDD7EB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#B29B87'} onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}>Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#E5EFF3' }}>Find Us Online</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.google.com/maps/place/Samrat+Agencies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition"
                  style={{ color: '#BDD7EB' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#B29B87'}
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
                  onMouseEnter={(e) => e.currentTarget.style.color = '#B29B87'}
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
                  onMouseEnter={(e) => e.currentTarget.style.color = '#B29B87'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}
                >
                  MagicPIN
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/SamratAgenciesHongasandra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition"
                  style={{ color: '#BDD7EB' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#B29B87'}
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
                  onMouseEnter={(e) => e.currentTarget.style.color = '#B29B87'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#BDD7EB'}
                >
                  IndiaMART
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#E5EFF3' }}>Contact Info</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#E0EAF0' }}>
              <li className="font-semibold">Phone:</li>
              <li>+91 98809 14457</li>
              <li>+91 94492 70486</li>
              <li className="font-semibold mt-3">Address:</li>
              <li>Babu Reddy Complex, 5<br />Begur Main Road, Hongasandra<br />Bommanahalli, Bengaluru<br />Karnataka 560114</li>
              <li className="mt-3">
                <span className="font-semibold">Hours:</span> Mon-Sun 8:00 AM - 10:30 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 text-center" style={{ borderTop: '1px solid #94A1AB', color: '#BDD7EB' }}>
          <p>&copy; {new Date().getFullYear()} Samrat Agencies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
