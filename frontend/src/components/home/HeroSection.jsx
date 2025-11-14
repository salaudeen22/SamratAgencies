import { Link } from 'react-router-dom';
import Button from '../Button';

const HeroSection = () => {
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight" style={{ color: '#FFFFFF' }}>
              Furniture Made for <span className="font-black" style={{ color: '#C97B63' }}>Real Life</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed font-medium" style={{ color: '#FFFFFF', opacity: 0.9 }}>
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
};

export default HeroSection;
