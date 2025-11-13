import century from '../../assets/brand/centuray.png';
import godrej from '../../assets/brand/Gemini_Generated_Image_81baro81baro81ba-removebg-preview.png';
import duroflex from '../../assets/brand/duroflex.png';
import kurlon from '../../assets/brand/kurlon.png';
import restolex from '../../assets/brand/restolex.png';
import sleepwell from '../../assets/brand/sleepweel.png';
import wakefit from '../../assets/brand/wakefir.png';

const BrandLogosSection = () => {
  const brands = [
    { name: 'Duroflex', logo: duroflex },
    { name: 'Century', logo: century },
    { name: 'Restolex', logo: restolex },
    { name: 'Sleepwell', logo: sleepwell },
    { name: 'Godrej', logo: godrej },
    { name: 'Kurlon', logo: kurlon },
    { name: 'Wakefit', logo: wakefit },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 overflow-hidden" style={{ backgroundColor: '#E0EAF0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1F2D38' }}>Brands You Know & Love</h2>
          <p className="text-base sm:text-lg" style={{ color: '#94A1AB' }}>Quality names you can trust, all in one place</p>
        </div>

        {/* Auto-scrolling carousel */}
        <div className="relative">
          <style>{`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll {
              animation: scroll 30s linear infinite;
            }
            .animate-scroll:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="flex animate-scroll">
            {/* First set of logos */}
            <div className="flex gap-12 px-6">
              {brands.map((brand) => (
                <div key={brand.name} className="flex items-center justify-center h-32 w-52 shrink-0 bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <img src={brand.logo} alt={brand.name} loading="lazy" className="h-24 w-44 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
              ))}
            </div>

            {/* Duplicate set for seamless loop */}
            <div className="flex gap-12 px-6">
              {brands.map((brand) => (
                <div key={`${brand.name}-duplicate`} className="flex items-center justify-center h-32 w-52 shrink-0 bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <img src={brand.logo} alt={brand.name} loading="lazy" className="h-24 w-44 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandLogosSection;
