import { Link } from 'react-router-dom';

const PromotionalCards = () => {
  return (
    <>
      {/* Bajaj Finserv Banner */}
      <section className="py-4" style={{ backgroundColor: '#E0EAF0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-4 border" style={{ borderColor: '#895F42' }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Logo */}
              <div className="flex items-center gap-4">
                <img
                  src="https://storage.googleapis.com/ck-prod/logo-2024-11-07-174515-e68da450-b76b-4e67-b2c5-88225fbd5a14.jpg"
                  alt="Bajaj Finserv"
                  className="h-8 object-contain"
                />
                <div className="h-8 w-px" style={{ backgroundColor: '#BDD7EB' }}></div>
                <div>
                  <p className="text-lg md:text-xl font-black" style={{ color: '#895F42' }}>₹0 Down Payment</p>
                  <p className="text-xs" style={{ color: '#94A1AB' }}>*T&C apply</p>
                </div>
              </div>

              {/* CTA */}
              <Link to="/products">
                <button className="px-6 py-2 text-sm font-bold rounded-full shadow-md transition-all duration-300 hover:scale-105 whitespace-nowrap" style={{ backgroundColor: '#895F42', color: '#E5EFF3' }}>
                  Take It Home Today
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Card Layout Section */}
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
                  <button className="px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 shadow-xl" style={{ backgroundColor: '#1F2D38', color: '#E5EFF3' }}>
                    Shop Tables
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Side - Two Stacked Cards */}
            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
              {/* Top Card - Pottery Products */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg group cursor-pointer h-[200px] sm:h-[250px] md:h-[290px]" style={{ backgroundColor: '#E0EAF0' }}>
                <div className="grid grid-cols-2 h-full items-center">
                  <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-3 sm:mb-4 md:mb-6 leading-tight" style={{ color: '#1F2D38' }}>
                      Add Your Personal Touch
                    </h3>
                    <Link to="/products">
                      <button className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 shadow-md" style={{ backgroundColor: '#1F2D38', color: '#E5EFF3' }}>
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
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-3 sm:mb-4 md:mb-6 leading-tight" style={{ color: '#1F2D38' }}>
                      Sleep Better, Live Better
                    </h3>
                    <Link to="/products?category=bed">
                      <button className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 shadow-md" style={{ backgroundColor: '#1F2D38', color: '#E5EFF3' }}>
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
    </>
  );
};

export default PromotionalCards;
