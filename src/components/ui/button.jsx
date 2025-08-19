import React from 'react';

const Button = ({ 
  children, 
  variant = "primary", 
  size = "default",
  className = "",
  onClick,
  disabled = false,
  icon,
  ...props
}) => {
  // Base classes
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Size variants
  const sizeClasses = {
    sm: "px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm gap-1 sm:gap-1.5",
    default: "px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm gap-1.5 sm:gap-2",
    lg: "px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base gap-2"
  };
  
  // Color variants
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500"
  };
  
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;