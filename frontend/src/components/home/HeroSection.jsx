import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';
import { bannerAPI } from '../../services/api';

const HeroSection = () => {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      const response = await bannerAPI.getAll('hero');
      setBanners(response.data);
    } catch (err) {
      console.error('Failed to fetch banners:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fallback to default content if no banners
  if (loading || banners.length === 0) {
    return (
      <section className="relative overflow-hidden bg-[#f8fafc] md:bg-transparent h-[80vh] flex items-center">
        {/* Desktop only: Reversed Golden Ratio split (62:38) */}
        <div className="absolute inset-0 hidden md:block" style={{
          background: 'linear-gradient(to right, #1F2D38 0%, #1F2D38 62%, #f8fafc 62%, #f8fafc 100%)'
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center md:text-left">
              <span className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full mb-3 sm:mb-4 shadow-md" style={{ backgroundColor: '#895F42', color: '#FFFFFF' }}>Your Home Deserves This</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight text-black md:text-white">
                Furniture Made for <span className="font-black" style={{ color: '#C97B63' }}>Real Life</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed font-medium text-black md:text-white opacity-90">
                Beautiful pieces designed for the way you live. Thoughtfully crafted, honestly priced, and built to be part of your everyday moments.
              </p>
              <Link to="/products">
                <Button size="lg">Find Your Perfect Piece</Button>
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
                  alt="Premium Furniture"
                  className="w-full h-64 sm:h-80 md:h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentBannerIndex];

  return (
    <section className="relative overflow-hidden bg-[#f8fafc] md:bg-transparent h-[80vh] flex items-center">
      {/* Desktop only: Reversed Golden Ratio split (62:38) */}
      <div className="absolute inset-0 hidden md:block" style={{
        background: 'linear-gradient(to right, #1F2D38 0%, #1F2D38 62%, #f8fafc 62%, #f8fafc 100%)'
      }}></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="text-center md:text-left">
            <span className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full mb-3 sm:mb-4 shadow-md" style={{ backgroundColor: '#895F42', color: '#FFFFFF' }}>Your Home Deserves This</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight text-black md:text-white">
              {currentBanner.title}
            </h1>
            {currentBanner.description && (
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed font-medium text-black md:text-white opacity-90">
                {currentBanner.description}
              </p>
            )}
            <Link to={currentBanner.link || '/products'}>
              <Button size="lg">{currentBanner.buttonText || 'Shop Now'}</Button>
            </Link>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={currentBanner.image.url}
                alt={currentBanner.title}
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Banner indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentBannerIndex ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
