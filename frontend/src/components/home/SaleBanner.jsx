import { Link } from 'react-router-dom';

const SaleBanner = () => {
  const products = [
    {
      id: 1,
      name: 'Premium Sofas',
      image: 'https://samrat-agencies.s3.ap-south-1.amazonaws.com/products/1763809712171-331417093.webp',
      price: '12,999',
      category: 'sofas-sofa-sets'
    },
    {
      id: 2,
      name: 'Beds',
      image: 'https://samrat-agencies.s3.ap-south-1.amazonaws.com/products/1763810241695-266581685.webp',
      price: '18,999',
      category: 'bedroom-furniture'
    },
    {
      id: 3,
      name: 'Dining Sets',
      image: 'https://samrat-agencies.s3.ap-south-1.amazonaws.com/products/1763810026187-318985211.webp',
      price: '24,999',
      category: 'dining-room-furniture'
    },
    {
      id: 4,
      name: 'Tv Units',
      image: 'https://samrat-agencies.s3.ap-south-1.amazonaws.com/products/1763810242169-804580908.webp',
      price: '15,999',
      category: 'living-room-furniture'
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FBF8F3] to-[#F5EFE6] py-16 md:py-20 lg:py-24">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E8D5C4] rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C9A88A] rounded-full opacity-10 blur-3xl"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-stretch">

          {/* Left Side - Premium Living Room with Sale */}
          <div className="relative group">
            <div className="relative rounded-[32px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] h-full min-h-[500px] lg:min-h-[650px]">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src="https://samrat-agencies.s3.ap-south-1.amazonaws.com/products/1763809363280-900445969.webp"
                  alt="Premium Living Room Setup"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-10 lg:p-12">
                {/* Main Content */}
                <div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 leading-[1.1]">
                    <span className="block text-white mb-2">Full House Fiesta</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E8D5C4] via-[#D4B896] to-[#C9A88A]">
                      Upto 70% Off
                    </span>
                  </h2>

                  <p className="text-white/95 text-lg md:text-xl max-w-lg font-medium leading-relaxed">
                    Quality furniture that fits your budget. Elevate every room with pieces your family will love for years.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Product Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-5">
            {products.map((product, index) => (
              <Link
                key={product.id}
                to={`/products?category=${product.category}`}
                className="group/card relative bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_15px_50px_rgb(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-2"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                  />

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>

                  {/* Hot Deal Badge */}
                  {index === 0 && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      HOT DEAL
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="font-bold text-[#2D2D2D] text-base md:text-lg mb-3 group-hover/card:text-[#6B4E31] transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  {/* Price Tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-medium">from</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-[#6B4E31] font-bold">₹</span>
                        <span className="text-[#6B4E31] font-black text-xl">{product.price}</span>
                      </div>
                    </div>

                    <svg className="w-5 h-5 text-[#C9A88A] group-hover/card:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#E8D5C4]/20 to-transparent rounded-bl-[40px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default SaleBanner;
