import { Link } from 'react-router-dom';

const ShopByBudget = () => {
  const budgetRanges = [
    {
      title: 'Under 5,000',
      description: 'Affordable essentials',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
      link: '/products?maxPrice=5000',
      bgColor: '#E6CDB1',
    },
    {
      title: 'Under 10,000',
      description: 'Quality on budget',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80',
      link: '/products?maxPrice=10000',
      bgColor: '#D7B790',
    },
    {
      title: 'Under 20,000',
      description: 'Premium selection',
      image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&q=80',
      link: '/products?maxPrice=20000',
      bgColor: '#CDAA82',
    },
    {
      title: 'Luxury Range',
      description: 'Best of the best',
      image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&q=80',
      link: '/products?minPrice=20000',
      bgColor: '#816047',
    },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4" style={{ color: '#2F1A0F' }}>
            Shop by Budget
          </h2>
          <p className="text-sm sm:text-base md:text-lg" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
            Quality furniture for every price range
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {budgetRanges.map((range, index) => (
            <Link
              key={index}
              to={range.link}
              className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2"
            >
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <img
                  src={range.image}
                  alt={range.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(to bottom, transparent 0%, ${range.bgColor}cc 100%)`,
                  }}
                ></div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 text-white">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-0.5 sm:mb-1">{range.title}</h3>
                <p className="text-xs sm:text-sm opacity-90">{range.description}</p>
                <div className="mt-2 sm:mt-3 flex items-center gap-2 text-xs sm:text-sm font-semibold">
                  <span>Shop Now</span>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByBudget;
