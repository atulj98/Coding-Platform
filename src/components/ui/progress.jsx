import React from 'react';

const Progress = ({ 
  value = 0, 
  max = 100, 
  className = "", 
  showLabel = true, 
  size = "default",
  variant = "default"
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  // Size variants
  const sizeClasses = {
    sm: "h-1",
    default: "h-2",
    lg: "h-3"
  };
  
  // Color variants
  const colorClasses = {
    default: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500"
  };
  
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div 
          className={`${colorClasses[variant]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Progress;