const PageHeader = ({ title, subtitle, action, breadcrumbs }) => {
  return (
    <div className="mb-6 lg:mb-8">
      {breadcrumbs && (
        <div className="flex items-center gap-2 mb-3 text-sm" style={{ color: '#64748b' }}>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              {crumb.link ? (
                <a href={crumb.link} className="hover:underline" style={{ color: '#816047' }}>
                  {crumb.label}
                </a>
              ) : (
                <span className="font-medium" style={{ color: '#334155' }}>{crumb.label}</span>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: '#1e293b' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm lg:text-base" style={{ color: '#64748b' }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
