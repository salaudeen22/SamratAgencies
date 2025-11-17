import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bannerAPI } from '../../services/api';

const BannerSection = ({ position }) => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchBanners();
  }, [position]);

  const fetchBanners = async () => {
    try {
      const response = await bannerAPI.getAll(position);
      setBanners(response.data);
    } catch (err) {
      console.error(`Failed to fetch ${position} banners:`, err);
    }
  };

  if (banners.length === 0) return null;

  return (
    <section className="py-4 space-y-4" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {banners.map((banner) => (
          <Link key={banner._id} to={banner.link || '/products'}>
            <div className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer h-[200px] sm:h-[250px] md:h-[300px]">
              <img
                src={banner.image.url}
                alt={banner.title || 'Banner'}
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
  );
};

export default BannerSection;
