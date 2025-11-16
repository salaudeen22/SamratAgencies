import { useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';

const CompareBar = () => {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare, getCompareCount } = useCompare();

  if (getCompareCount() === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 transform transition-transform duration-300">
      <div className="bg-white shadow-2xl border-t-4" style={{ borderColor: '#895F42' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Product Thumbnails */}
            <div className="flex items-center gap-3 flex-1 overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max">
                <svg className="w-5 h-5" style={{ color: '#895F42' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-bold text-sm sm:text-base" style={{ color: '#1F2D38' }}>
                  Compare ({getCompareCount()})
                </span>
              </div>

              {compareList.map((product) => (
                <div key={product._id} className="relative group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2" style={{ borderColor: '#BDD7EB' }}>
                    {product.images && product.images.length > 0 && product.images[0].url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#E0EAF0', color: '#94A1AB' }}>
                        <span className="text-xs">No Image</span>
                      </div>
                    )}
                  </div>
              
                  <button
                    onClick={() => removeFromCompare(product._id)}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                    title="Remove"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

      
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={clearCompare}
                className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm"
                style={{
                  backgroundColor: 'white',
                  color: '#ef4444',
                  border: '2px solid #ef4444'
                }}
              >
                Clear All
              </button>
              <button
                onClick={() => navigate('/compare')}
                className="px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-bold transition-all text-xs sm:text-sm shadow-lg hover:shadow-xl"
                style={{
                  backgroundColor: '#895F42',
                  color: 'white'
                }}
              >
                Compare Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
