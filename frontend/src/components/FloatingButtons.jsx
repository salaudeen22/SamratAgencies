import { useState } from 'react';
import { FaWhatsapp, FaPhone, FaTimes } from 'react-icons/fa';

const FloatingButtons = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Main Floating Button */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        {/* WhatsApp and Call buttons - show when open */}
        {isOpen && (
          <div className="flex flex-col gap-2 sm:gap-3 mb-2 sm:mb-3 animate-fade-in-up">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#25D366', color: 'white' }}
            >
              <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-semibold">WhatsApp</span>
            </a>

            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#816047', color: 'white' }}
            >
              <FaPhone className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-semibold">Call Now</span>
            </a>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ml-auto"
          style={{ backgroundColor: isOpen ? '#ef4444' : '#816047', color: 'white' }}
        >
          {isOpen ? (
            <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <FaPhone className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          )}
        </button>
      </div>
    </>
  );
};

export default FloatingButtons;
