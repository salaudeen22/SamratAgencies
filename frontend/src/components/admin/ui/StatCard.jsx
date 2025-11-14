const StatCard = ({ label, value, icon, color = '#895F42', trend, trendValue }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 lg:p-6 border" style={{ borderColor: '#e2e8f0' }}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium mb-1" style={{ color: '#64748b' }}>
            {label}
          </p>
          <p className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: '#1e293b' }}>
            {value}
          </p>
          {trend && trendValue && (
            <div className="flex items-center gap-1">
              <svg
                className={`w-4 h-4 ${trend === 'up' ? 'rotate-0' : 'rotate-180'}`}
                style={{ color: trend === 'up' ? '#10b981' : '#ef4444' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span
                className="text-xs font-semibold"
                style={{ color: trend === 'up' ? '#10b981' : '#ef4444' }}
              >
                {trendValue}
              </span>
              <span className="text-xs" style={{ color: '#94a3b8' }}>vs last month</span>
            </div>
          )}
        </div>
        <div
          className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
