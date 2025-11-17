import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bannerAPI } from '../../services/api';

const PromotionalCards = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await bannerAPI.getAll('promotional');
      setBanners(response.data);
    } catch (err) {
      console.error('Failed to fetch promotional banners:', err);
    }
  };

  return (
    <>
      {/* Bajaj Finserv Banner - Always Hardcoded */}
      <section className="py-4" style={{ backgroundColor: '#E6CDB1' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-4 border" style={{ borderColor: '#816047' }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Logo */}
              <div className="flex items-center gap-4">
                <img
                  src="https://storage.googleapis.com/ck-prod/logo-2024-11-07-174515-e68da450-b76b-4e67-b2c5-88225fbd5a14.jpg"
                  alt="Bajaj Finserv"
                  className="h-8 object-contain"
                />
                <div className="h-8 w-px" style={{ backgroundColor: '#D7B790' }}></div>
                <div>
                  <p className="text-lg md:text-xl font-black" style={{ color: '#816047' }}>₹0 Down Payment</p>
                  <p className="text-xs" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>*T&C apply</p>
                </div>
              </div>

              {/* CTA */}
              <Link to="/products">
                <button className="px-6 py-2 text-sm font-bold rounded-full shadow-md transition-all duration-300 hover:scale-105 whitespace-nowrap" style={{ backgroundColor: '#816047', color: '#E6CDB1' }}>
                  Take It Home Today
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Promotional Banners Section */}
      {banners.length > 0 && (
        <section className="py-4 space-y-4" style={{ backgroundColor: '#f8fafc' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            {banners.map((banner) => (
              <Link key={banner._id} to={banner.link || '/products'}>
                <div className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer h-[200px] sm:h-[250px] md:h-[300px]">
                  <img
                    src={banner.image.url}
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center p-6 sm:p-8 md:p-12">
                    <div className="max-w-2xl">
                      {banner.title && (
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                          {banner.title}
                        </h2>
                      )}
                      {banner.description && (
                        <p className="text-white/90 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg max-w-xl">
                          {banner.description}
                        </p>
                      )}
                      {banner.buttonText && (
                        <button className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-bold transition-all duration-300 hover:scale-105 shadow-xl" style={{ backgroundColor: '#816047', color: '#FFFFFF' }}>
                          {banner.buttonText}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Default Promotional Cards if no banners */}
      {banners.length === 0 && (
        // Default fallback promotional cards if no banners in database
        <section className="py-8 sm:py-12 md:py-20" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Large Left Card */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg group cursor-pointer h-[400px] sm:h-[500px] md:h-[600px]">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=85"
                alt="Wooden classic table"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight">
                  Tables That Bring Everyone Together
                </h2>
                <Link to="/products?category=table">
                  <button className="px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 shadow-xl" style={{ backgroundColor: '#2F1A0F', color: '#E6CDB1' }}>
                    Shop Tables
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Side - Two Stacked Cards */}
            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
              {/* Top Card - Pottery Products */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg group cursor-pointer h-[200px] sm:h-[250px] md:h-[290px]" style={{ backgroundColor: '#E6CDB1' }}>
                <div className="grid grid-cols-2 h-full items-center">
                  <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-3 sm:mb-4 md:mb-6 leading-tight" style={{ color: '#2F1A0F' }}>
                      Add Your Personal Touch
                    </h3>
                    <Link to="/products">
                      <button className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 shadow-md" style={{ backgroundColor: '#2F1A0F', color: '#E6CDB1' }}>
                        Shop Decor
                      </button>
                    </Link>
                  </div>
                  <div className="h-full relative">
                    <img
                      src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=85"
                      alt="Pottery products"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Card - Florence Compact */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg group cursor-pointer h-[200px] sm:h-[250px] md:h-[290px]" style={{ backgroundColor: '#f5f5f4' }}>
                <div className="grid grid-cols-2 h-full items-center">
                  <div className="h-full relative">
                    <img
                      src="https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=85"
                      alt="Florence compact"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-3 sm:mb-4 md:mb-6 leading-tight" style={{ color: '#2F1A0F' }}>
                      Sleep Better, Live Better
                    </h3>
                    <Link to="/products?category=bed">
                      <button className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 shadow-md" style={{ backgroundColor: '#2F1A0F', color: '#E6CDB1' }}>
                        Shop Beds
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>
      )}
    </>
  );
};

export default PromotionalCards;
