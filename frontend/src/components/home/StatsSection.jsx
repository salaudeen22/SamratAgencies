const StatsSection = () => {
  return (
    <section className="py-6 sm:py-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #BDD7EB 0%, #E5EFF2 100%)' }}>
      {/* Decorative circles */}
      <div className="absolute top-3 left-3 w-16 h-16 rounded-full opacity-20" style={{ backgroundColor: '#895F42' }}></div>
      <div className="absolute bottom-3 right-3 w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: '#C97B63' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-0.5" style={{ color: '#1F2D38' }}>The Numbers Speak</h2>
          <p className="text-xs" style={{ color: '#1F2D38', opacity: 0.7 }}>Your trust is our greatest achievement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {/* Stat 1 */}
          <div className="text-center bg-white rounded-lg p-3 sm:p-4 shadow-md transform hover:scale-105 transition-all duration-300">
            <div className="text-xl sm:text-2xl md:text-3xl font-black mb-0.5" style={{ color: '#895F42' }}>30+</div>
            <div className="text-sm sm:text-base font-bold mb-0.5" style={{ color: '#1F2D38' }}>Years of Trust</div>
            <p className="text-xs" style={{ color: '#94A1AB' }}>Since 1991</p>
          </div>

          {/* Stat 2 */}
          <div className="text-center bg-white rounded-lg p-3 sm:p-4 shadow-md transform hover:scale-105 transition-all duration-300">
            <div className="text-xl sm:text-2xl md:text-3xl font-black mb-0.5" style={{ color: '#895F42' }}>5000+</div>
            <div className="text-sm sm:text-base font-bold mb-0.5" style={{ color: '#1F2D38' }}>Happy Customers</div>
            <p className="text-xs" style={{ color: '#94A1AB' }}>Homes beautiful</p>
          </div>

          {/* Stat 3 */}
          <div className="text-center bg-white rounded-lg p-3 sm:p-4 shadow-md transform hover:scale-105 transition-all duration-300">
            <div className="text-xl sm:text-2xl md:text-3xl font-black mb-0.5" style={{ color: '#895F42' }}>500+</div>
            <div className="text-sm sm:text-base font-bold mb-0.5" style={{ color: '#1F2D38' }}>Quality Products</div>
            <p className="text-xs" style={{ color: '#94A1AB' }}>Curated collection</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
