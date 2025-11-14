const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#f1f5f9' }}>
          <div style={{ color: '#94a3b8' }}>
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-lg lg:text-xl font-semibold mb-2" style={{ color: '#1e293b' }}>
        {title}
      </h3>
      {description && (
        <p className="text-sm lg:text-base mb-6 max-w-md" style={{ color: '#64748b' }}>
          {description}
        </p>
      )}
      {action && action}
    </div>
  );
};

export default EmptyState;
