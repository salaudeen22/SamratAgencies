const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'text-white hover:opacity-90 transition-opacity',
    secondary: 'text-white hover:opacity-90 transition-opacity',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    outline: 'border-2 text-white hover:opacity-80 transition-opacity',
  };

  const variantStyles = {
    primary: { backgroundColor: '#895F42' },
    secondary: { backgroundColor: '#1F2D38' },
    success: {},
    danger: {},
    outline: { borderColor: '#895F42', backgroundColor: 'transparent', color: '#895F42' },
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
