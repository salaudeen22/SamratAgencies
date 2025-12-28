import { FaTruck, FaCreditCard, FaShieldAlt, FaAward, FaHeadset } from 'react-icons/fa';

const TrustBadges = () => {
  const badges = [
    {
      icon: FaTruck,
      title: 'Free Delivery',
      subtitle: 'Across Bangalore',
    },
    {
      icon: FaCreditCard,
      title: 'Easy EMI',
      subtitle: '0% Down Payment',
    },
    {
      icon: FaShieldAlt,
      title: '29+ Years',
      subtitle: 'Trusted Since 1996',
    },
    {
      icon: FaAward,
      title: 'Quality Assured',
      subtitle: 'Premium Brands',
    },
    {
      icon: FaHeadset,
      title: '24/7 Support',
      subtitle: 'Expert Help',
    },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm border-y py-2 sm:py-3 md:py-4" style={{ borderColor: '#E6CDB1' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 md:gap-6">
          {badges.map((badge, index) => {
            const IconComponent = badge.icon;
            return (
              <div
                key={index}
                className={`flex items-center gap-1.5 sm:gap-2 md:gap-3 justify-start group ${
                  index >= 3 ? 'hidden md:flex' : ''
                } ${index === 2 ? 'hidden sm:flex' : ''}`}
              >
                <div
                  className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: '#E6CDB1' }}
                >
                  <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" style={{ color: '#816047' }} />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-[11px] sm:text-xs md:text-sm font-bold leading-tight truncate" style={{ color: '#2F1A0F' }}>
                    {badge.title}
                  </div>
                  <div className="text-[9px] sm:text-[10px] md:text-xs leading-tight truncate" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                    {badge.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
