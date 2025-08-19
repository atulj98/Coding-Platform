import React from 'react';

const Badge = ({ 
  children, 
  variant = "default", 
  size = "default",
  className = ""
}) => {
  // Base classes
  const baseClasses = "inline-flex items-center font-medium rounded-full transition-colors";
  
  // Size variants
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm"
  };
  
  // Color variants
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    purple: "bg-purple-100 text-purple-800"
  };
  
  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;