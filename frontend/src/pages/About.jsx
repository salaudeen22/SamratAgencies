const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">About Samrat Agencies</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Your trusted partner for premium furniture and Samsung products since 1991
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-indigo-900 mb-6">Our Story</h2>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                Established in 1991, Samrat Agencies has been serving the Bangalore community for over three decades. What started as a small furniture store has grown into a trusted destination for quality furniture and Samsung electronics.
              </p>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                Located in Hongasandra, Bommanahalli, we take pride in offering an extensive collection of furniture ranging from luxurious sofas and elegant dining sets to comfortable beds and stylish home decor. As an authorized Samsung dealer, we also provide the latest Samsung electronics and appliances.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our commitment to quality, competitive pricing, and exceptional customer service has earned us a 5.0-star rating with over 108 reviews across multiple platforms.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85"
                alt="Furniture Showroom"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 rounded-xl shadow-xl">
                <div className="text-4xl font-bold">30+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 mb-2">5.0</div>
              <div className="text-blue-100">Star Rating</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 mb-2">108+</div>
              <div className="text-blue-100">Customer Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 mb-2">5000+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 mb-2">500+</div>
              <div className="text-blue-100">Products</div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-indigo-900 mb-4">What We Offer</h2>
            <p className="text-gray-700 text-lg">Discover our wide range of products and services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-orange-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-indigo-900 mb-3">Premium Furniture</h3>
              <p className="text-gray-600 leading-relaxed">
                Wide selection of sofas, beds, dining tables, chairs, and home decor in various styles and price ranges.
              </p>
            </div>

            <div className="bg-white border-2 border-orange-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-indigo-900 mb-3">Samsung Products</h3>
              <p className="text-gray-600 leading-relaxed">
                Authorized dealer for Samsung electronics, appliances, and smart home devices.
              </p>
            </div>

            <div className="bg-white border-2 border-orange-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-indigo-900 mb-3">Custom Solutions</h3>
              <p className="text-gray-600 leading-relaxed">
                Customization options available to match your unique style, space requirements, and budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-indigo-900 mb-4">Why Choose Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-indigo-900 mb-2">Quality Products</h3>
                <p className="text-gray-600">Premium furniture and authentic Samsung products guaranteed.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-indigo-900 mb-2">Competitive Pricing</h3>
                <p className="text-gray-600">Best prices with flexible payment options including Bajaj Finance.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-indigo-900 mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Quick delivery and professional installation services.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-indigo-900 mb-2">Expert Guidance</h3>
                <p className="text-gray-600">Knowledgeable staff to help you choose the perfect products.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-indigo-900 mb-2">5-Star Service</h3>
                <p className="text-gray-600">Rated 5.0 stars with 108+ verified customer reviews.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-indigo-900 mb-2">Extended Hours</h3>
                <p className="text-gray-600">Open Mon-Sun from 8:00 AM to 10:30 PM for your convenience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-indigo-900 mb-4">Visit Our Showroom</h2>
            <p className="text-gray-700 text-lg">Come see our extensive collection in person</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h3 className="text-2xl font-bold text-indigo-900 mb-6">Location Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <svg className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">Address</p>
                      <p className="text-gray-600">Babu Reddy Complex, 5<br />Begur Main Road, Hongasandra<br />Bommanahalli, Bengaluru<br />Karnataka 560114</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <svg className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">Hours</p>
                      <p className="text-gray-600">Monday - Sunday<br />8:00 AM - 10:30 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <svg className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">Phone</p>
                      <p className="text-gray-600">+91 98809 14457<br />+91 94492 70486</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 p-8 md:p-12 text-white h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Get Directions</h3>
                  <p className="mb-6 text-blue-100">
                    We're conveniently located on Begur Main Road in Hongasandra, easily accessible from all parts of Bangalore.
                  </p>
                </div>
                <a
                  href="https://www.google.com/maps/place/Samrat+Agencies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all text-center"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-orange-100">
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

export default About;
