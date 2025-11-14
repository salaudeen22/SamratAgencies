import { useState } from 'react';
import toast from 'react-hot-toast';
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
        toast.success('Message sent successfully! We\'ll get back to you soon.');

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send message. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafaf9' }}>
      {/* Hero Section */}
      <section className="relative text-white py-24 md:py-32 overflow-hidden" style={{
        backgroundImage: 'url(https://samrat-agencies.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-10-15+at+12.34.30.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black opacity-60"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(137, 95, 66, 0.7) 0%, rgba(31, 45, 56, 0.8) 100%)'
        }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight drop-shadow-lg">Get in Touch</h1>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed drop-shadow-md" style={{ color: '#E5EFF3' }}>
              Have questions about our furniture or Samsung products? We're here to help!
              Reach out to us and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 sm:py-20 -mt-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {/* Phone */}
            <div className="group bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style={{ border: '2px solid #BDD7EB' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: '#895F42' }}>
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#1F2D38' }}>Call Us</h3>
              <a href="tel:+919880914457" className="block mb-2 text-lg font-medium hover:underline" style={{ color: '#895F42' }}>+91 98809 14457</a>
              <a href="tel:+919448075801" className="block mb-4 text-lg font-medium hover:underline" style={{ color: '#895F42' }}>+91 94480 75801</a>
              <div className="pt-4 border-t" style={{ borderColor: '#E0EAF0' }}>
                <p className="text-sm font-semibold" style={{ color: '#1F2D38' }}>Business Hours</p>
                <p className="text-sm mt-1" style={{ color: '#94A1AB' }}>Mon-Sun: 8:00 AM - 10:30 PM</p>
              </div>
            </div>

            {/* Email */}
            <div className="group bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style={{ border: '2px solid #BDD7EB' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: '#895F42' }}>
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#1F2D38' }}>Email Us</h3>
              <a href="mailto:samratagencies2012@gmail.com" className="block mb-4 text-base font-medium hover:underline break-all" style={{ color: '#895F42' }}>
                samratagencies2012@gmail.com
              </a>
              <div className="pt-4 border-t" style={{ borderColor: '#E0EAF0' }}>
                <p className="text-sm font-semibold" style={{ color: '#1F2D38' }}>Response Time</p>
                <p className="text-sm mt-1" style={{ color: '#94A1AB' }}>Within 24 hours</p>
              </div>
            </div>

            {/* Location */}
            <div className="group bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style={{ border: '2px solid #BDD7EB' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: '#895F42' }}>
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#1F2D38' }}>Visit Showroom</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#94A1AB' }}>
                Babu Reddy Complex, 5<br />
                Begur Main Road, Hongasandra<br />
                Bommanahalli, Bengaluru<br />
                Karnataka 560114
              </p>
              <a
                href="https://www.google.com/maps/place/Samrat+Agencies"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-sm px-4 py-2 rounded-lg transition-all"
                style={{ color: '#895F42', backgroundColor: '#E0EAF0' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#BDD7EB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E0EAF0'}
              >
                Get Directions
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-xl" style={{ border: '2px solid #BDD7EB' }}>
              <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{ color: '#1F2D38' }}>Send a Message</h2>
                <p className="text-base" style={{ color: '#94A1AB' }}>Fill out the form below and we'll get back to you shortly.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2" style={{ color: '#1F2D38' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-offset-2 focus:border-transparent transition-all outline-none"
                    style={{ borderColor: '#E0EAF0', focusRing: '#895F42' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#895F42'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#E0EAF0'}
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: '#1F2D38' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-offset-2 focus:border-transparent transition-all outline-none"
                      style={{ borderColor: '#E0EAF0' }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#895F42'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#E0EAF0'}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold mb-2" style={{ color: '#1F2D38' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-offset-2 focus:border-transparent transition-all outline-none"
                      style={{ borderColor: '#E0EAF0' }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#895F42'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#E0EAF0'}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold mb-2" style={{ color: '#1F2D38' }}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-offset-2 focus:border-transparent transition-all outline-none"
                    style={{ borderColor: '#E0EAF0' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#895F42'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#E0EAF0'}
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-2" style={{ color: '#1F2D38' }}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-offset-2 focus:border-transparent transition-all outline-none resize-none"
                    style={{ borderColor: '#E0EAF0' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#895F42'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#E0EAF0'}
                    placeholder="Tell us more about your requirements..."
                  ></textarea>
                </div>

                {/* Success Message */}
                {success && (
                  <div className="p-5 rounded-xl flex items-start gap-3" style={{ backgroundColor: '#d4edda', border: '2px solid #28a745' }}>
                    <svg className="w-6 h-6 flex-shrink-0" style={{ color: '#155724' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-bold text-base" style={{ color: '#155724' }}>Message sent successfully!</p>
                      <p className="text-sm mt-1" style={{ color: '#155724' }}>Thank you for reaching out. We'll respond within 24 hours.</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="p-5 rounded-xl flex items-start gap-3" style={{ backgroundColor: '#f8d7da', border: '2px solid #dc3545' }}>
                    <svg className="w-6 h-6 flex-shrink-0" style={{ color: '#721c24' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-bold text-base" style={{ color: '#721c24' }}>Failed to send message</p>
                      <p className="text-sm mt-1" style={{ color: '#721c24' }}>{error}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  style={{ backgroundColor: '#895F42' }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#9F8065')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#895F42')}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info Section */}
            <div>
              <div className="rounded-2xl p-8 lg:p-10 text-white shadow-xl mb-8" style={{ backgroundColor: '#895F42' }}>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">Why Visit Us?</h3>
                <p className="mb-8 leading-relaxed text-base" style={{ color: '#E5EFF3' }}>
                  Experience our extensive collection of furniture and Samsung products in person. Our expert team is ready to help you create your dream space.
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
              <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-xl" style={{ border: '2px solid #BDD7EB' }}>
                <h3 className="text-2xl lg:text-3xl font-bold mb-3" style={{ color: '#1F2D38' }}>Find Us Online</h3>
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} className="w-5 h-5" style={{ color: '#fbbf24' }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-bold text-lg" style={{ color: '#1F2D38' }}>5.0</span>
                  <span style={{ color: '#94A1AB' }}>• 108+ reviews</span>
                </div>
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
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#1F2D38' }}>
              Visit Our Location
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: '#94A1AB' }}>
              Conveniently located on Begur Main Road, Hongasandra. Easy access and ample parking available.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: '3px solid #BDD7EB' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.6182127385005!2d77.62370421048396!3d12.897791687358367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1916ceba133f%3A0xf0ae92158946e5c3!2sSamrat%20Agencies%20(Dealer)%20(Samsung)(furniture%20expert)!5e1!3m2!1sen!2sin!4v1762612477783!5m2!1sen!2sin"
              width="100%"
              height="500"
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
