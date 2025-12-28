import { FaMapMarkerAlt, FaPhone, FaWhatsapp, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ContactSection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left - Contact Info */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4" style={{ color: '#2F1A0F' }}>
              Visit Our Showroom
            </h2>
            <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
              Experience our furniture collection in person at our Bommanahalli showroom
            </p>

            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#E6CDB1' }}
                >
                  <FaMapMarkerAlt className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" style={{ color: '#816047' }} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold mb-0.5 sm:mb-1" style={{ color: '#2F1A0F' }}>
                    Location
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                    Begur Road, Bommanahalli<br />
                    Bangalore, Karnataka
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#E6CDB1' }}
                >
                  <FaPhone className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" style={{ color: '#816047' }} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold mb-0.5 sm:mb-1" style={{ color: '#2F1A0F' }}>
                    Call Us
                  </h3>
                  <a
                    href="tel:+919876543210"
                    className="text-xs sm:text-sm font-semibold hover:underline"
                    style={{ color: '#816047' }}
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#E6CDB1' }}
                >
                  <FaClock className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" style={{ color: '#816047' }} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold mb-0.5 sm:mb-1" style={{ color: '#2F1A0F' }}>
                    Working Hours
                  </h3>
                  <p className="text-xs sm:text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                    Mon - Sat: 10:00 AM - 8:00 PM<br />
                    Sunday: 10:00 AM - 6:00 PM
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-white text-sm sm:text-base transition-all duration-300 hover:scale-105 shadow-lg"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" />
                  WhatsApp Us
                </a>

                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 shadow-md"
                  style={{ backgroundColor: '#816047', color: '#E6CDB1' }}
                >
                  Get Directions
                </Link>
              </div>
            </div>
          </div>

          {/* Right - Map or Image */}
          <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl h-[300px] sm:h-[350px] md:h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.0!2d77.6!3d12.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzAwLjAiTiA3N8KwMzYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Samrat Agencies Location"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
