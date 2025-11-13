import { useState } from 'react';
import { contactAPI } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await contactAPI.submitForm(formData);

      if (response.data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafaf9' }}>
      {/* Hero Section */}
      <section className="text-white py-20" style={{ backgroundColor: '#1F2D38' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#E5EFF3' }}>
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            {/* Phone */}
            <div className="bg-white border-2 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all" style={{ borderColor: '#BDD7EB' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#895F42' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#1F2D38' }}>Call Us</h3>
              <p className="mb-2" style={{ color: '#94A1AB' }}>+91 98809 14457</p>
              <p style={{ color: '#94A1AB' }}>+91 94492 70486</p>
              <p className="text-sm mt-3" style={{ color: '#94A1AB' }}>Mon-Sun: 8:00 AM - 10:30 PM</p>
            </div>

            {/* Location */}
            <div className="bg-white border-2 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all" style={{ borderColor: '#BDD7EB' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#895F42' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#1F2D38' }}>Visit Us</h3>
              <p style={{ color: '#94A1AB' }}>Babu Reddy Complex, 5</p>
              <p style={{ color: '#94A1AB' }}>Begur Main Road, Hongasandra</p>
              <p style={{ color: '#94A1AB' }}>Bommanahalli, Bengaluru</p>
              <p className="mb-3">Karnataka 560114</p>
              <a
                href="https://www.google.com/maps/place/Samrat+Agencies"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sm transition"
                style={{ color: '#895F42' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#9F8065'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#895F42'}
              >
                Get Directions →
              </a>
            </div>
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white border-2 rounded-2xl p-8 shadow-lg" style={{ borderColor: '#BDD7EB' }}>
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#1F2D38' }}>Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent" style={{ borderColor: '#BDD7EB' }}
                    placeholder="Your name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent" style={{ borderColor: '#BDD7EB' }}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent" style={{ borderColor: '#BDD7EB' }}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent" style={{ borderColor: '#BDD7EB' }}
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent" style={{ borderColor: '#BDD7EB' }}
                    placeholder="Tell us more about your needs..."
                  ></textarea>
                </div>

                {/* Success Message */}
                {success && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' }}>
                    <p className="font-semibold">✓ Message sent successfully!</p>
                    <p className="text-sm mt-1">Thank you for contacting us. We'll get back to you soon.</p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' }}>
                    <p className="font-semibold">✗ Error</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white px-6 py-4 rounded-lg font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#895F42' }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.opacity = '1')}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Info Section */}
            <div>
              <div className="rounded-2xl p-8 text-white shadow-lg mb-8" style={{ backgroundColor: '#895F42' }}>
                <h3 className="text-2xl font-bold mb-4">Visit Our Showroom</h3>
                <p className="mb-6 leading-relaxed" style={{ color: '#E5EFF3' }}>
                  Experience our extensive collection of furniture and Samsung products in person. Our knowledgeable staff will help you find the perfect items for your home.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#E5EFF3' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p style={{ color: '#E5EFF3' }}>Wide range of furniture styles and price points</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#E5EFF3' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p style={{ color: '#E5EFF3' }}>Authorized Samsung dealer with latest products</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#E5EFF3' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p style={{ color: '#E5EFF3' }}>Customization options available</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#E5EFF3' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p style={{ color: '#E5EFF3' }}>Flexible payment options including Bajaj Finance</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#E5EFF3' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p style={{ color: '#E5EFF3' }}>Free delivery on orders over ₹5000</p>
                  </div>
                </div>
              </div>

              {/* Online Platforms */}
              <div className="bg-white border-2 rounded-2xl p-8 shadow-lg" style={{ borderColor: '#BDD7EB' }}>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#1F2D38' }}>Find Us Online</h3>
                <p className="mb-4">Rated 5.0 ★ with 108+ reviews</p>
                <div className="space-y-3">
                  <a
                    href="https://www.google.com/maps/place/Samrat+Agencies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border rounded-lg transition-all group"
                    style={{ borderColor: '#BDD7EB' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0EAF0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <span className="font-medium" style={{ color: '#1F2D38' }}>Google My Business</span>
                    <svg className="w-5 h-5" style={{ color: '#94A1AB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>

                  <a
                    href="https://www.justdial.com/Bangalore/Samrat-Agencies-Near-Reliance-Fresh-Hongasandra/080P5169625_BZDET"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border rounded-lg transition-all group"
                    style={{ borderColor: '#BDD7EB' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0EAF0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <span className="font-medium" style={{ color: '#1F2D38' }}>JustDial</span>
                    <svg className="w-5 h-5" style={{ color: '#94A1AB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>

                  <a
                    href="https://magicpin.in/Bengaluru/Bommanahalli/Lifestyle/Samrat-Agencies-Dealer-Samsung-Furniture-Expert"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border rounded-lg transition-all group"
                    style={{ borderColor: '#BDD7EB' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0EAF0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <span className="font-medium" style={{ color: '#1F2D38' }}>MagicPIN</span>
                    <svg className="w-5 h-5" style={{ color: '#94A1AB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>

                  <a
                    href="https://www.facebook.com/SamratAgenciesHongasandra"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border rounded-lg transition-all group"
                    style={{ borderColor: '#BDD7EB' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0EAF0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <span className="font-medium" style={{ color: '#1F2D38' }}>Facebook</span>
                    <svg className="w-5 h-5" style={{ color: '#94A1AB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>

                  <a
                    href="https://www.indiamart.com/samrat-agencies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border rounded-lg transition-all group"
                    style={{ borderColor: '#BDD7EB' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0EAF0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <span className="font-medium" style={{ color: '#1F2D38' }}>IndiaMART</span>
                    <svg className="w-5 h-5" style={{ color: '#94A1AB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#1F2D38' }}>Find Us on the Map</h2>
            <p className="text-lg" style={{ color: '#94A1AB' }}>Located on Begur Main Road, Hongasandra</p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4" style={{ borderColor: '#BDD7EB' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.6182127385005!2d77.62370421048396!3d12.897791687358367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1916ceba133f%3A0xf0ae92158946e5c3!2sSamrat%20Agencies%20(Dealer)%20(Samsung)(furniture%20expert)!5e1!3m2!1sen!2sin!4v1762612477783!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Samrat Agencies Location"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
