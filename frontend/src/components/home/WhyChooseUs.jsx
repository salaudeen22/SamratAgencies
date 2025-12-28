import { FaCheckCircle, FaMapMarkerAlt, FaUsers, FaCertificate } from 'react-icons/fa';

const WhyChooseUs = () => {
  const features = [
    {
      icon: FaCheckCircle,
      title: 'Quality Guaranteed',
      description: 'Only premium brands and certified materials for lasting durability',
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Bommanahalli, Bangalore',
      description: 'Visit our showroom on Begur Road. Free delivery across Bangalore',
    },
    {
      icon: FaUsers,
      title: '50,000+ Happy Families',
      description: 'Trusted furniture partner for homes across South India since 1996',
    },
    {
      icon: FaCertificate,
      title: 'Best Price Promise',
      description: 'Better prices than IKEA & Royaloak. EMI available with Bajaj Finserv',
    },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4" style={{ color: '#2F1A0F' }}>
            Why Choose Samrat Agencies
          </h2>
          <p className="text-sm sm:text-base md:text-lg" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
            Your trusted furniture destination since 1996
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 border-2"
                style={{ borderColor: '#E6CDB1' }}
              >
                <div
                  className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto"
                  style={{ backgroundColor: '#E6CDB1' }}
                >
                  <IconComponent className="w-6 h-6 sm:w-6.5 sm:h-6.5 md:w-7 md:h-7" style={{ color: '#816047' }} />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2 text-center" style={{ color: '#2F1A0F' }}>
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-center leading-relaxed" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
