import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';
import SaleBanner from './SaleBanner';

const FeaturedProductsSection = ({ featuredProducts, newArrivals, loading }) => {
  return (
    <>
      {/* Featured Products - Best Sellers */}
      <section className="py-8 sm:py-12 md:py-20" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: '#2F1A0F' }}>Loved by Families Like Yours</h2>
              <p className="text-base sm:text-lg" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Quality pieces that make your house a home</p>
            </div>
            <Link to="/products">
              <button className="mt-4 sm:mt-0 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md" style={{ backgroundColor: '#816047', color: '#E6CDB1' }}>
                Browse All
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto" style={{ borderColor: '#816047' }}></div>
              <p className="mt-6 text-lg" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Finding your next favorite piece...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>No products available</p>
            </div>
          )}
        </div>
      </section>

      {/* Sale Banner */}
      <SaleBanner />

      {/* New Arrivals Section */}
      <section className="py-8 sm:py-12 md:py-20" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: '#2F1A0F' }}>Just Arrived</h2>
              <p className="text-base sm:text-lg" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Fresh styles for your home</p>
            </div>
            <Link to="/products?sort=newest">
              <button className="mt-4 sm:mt-0 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md" style={{ backgroundColor: '#816047', color: '#E6CDB1' }}>
                View All New
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto" style={{ borderColor: '#816047' }}></div>
              <p className="mt-6 text-lg" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Loading new arrivals...</p>
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>No new arrivals available</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default FeaturedProductsSection;
