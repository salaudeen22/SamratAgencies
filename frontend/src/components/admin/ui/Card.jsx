const Card = ({ title, subtitle, children, action, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`} style={{ borderColor: '#e2e8f0' }}>
      {(title || action) && (
        <div className="px-4 lg:px-6 py-4 lg:py-5 border-b flex items-center justify-between" style={{ borderColor: '#e2e8f0' }}>
          <div>
            {title && (
              <h3 className="text-base lg:text-lg font-semibold" style={{ color: '#1e293b' }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm mt-1" style={{ color: '#64748b' }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-4 lg:p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
