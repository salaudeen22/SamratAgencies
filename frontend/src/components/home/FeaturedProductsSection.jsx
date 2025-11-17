import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';

const FeaturedProductsSection = ({ products, loading }) => {
  return (
    <>
      {/* Featured Products - Best Sellers */}
      <section className="py-8 sm:py-12 md:py-20" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: '#2F1A0F' }}>Loved by Thousands</h2>
              <p className="text-base sm:text-lg" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Pieces that make a house feel like home</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto" style={{ borderColor: '#816047' }}></div>
              <p className="mt-6 text-lg" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Finding your next favorite piece...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-8 sm:py-12 md:py-20" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: '#2F1A0F' }}>Just Arrived</h2>
              <p className="text-base sm:text-lg" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Fresh styles to refresh your space</p>
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default FeaturedProductsSection;
