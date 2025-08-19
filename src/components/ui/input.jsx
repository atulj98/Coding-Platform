import React from 'react';

const Input = ({ 
  type = "text",
  placeholder = "",
  className = "",
  leftIcon,
  rightIcon,
  value,
  onChange,
  disabled = false,
  error = false,
  ...props
}) => {
  // Base classes
  const baseClasses = "w-full border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // State classes
  const stateClasses = error 
    ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
    : "border-gray-300 text-gray-700";
  
  // Padding classes based on icons
  const paddingClasses = `${leftIcon ? 'pl-8 sm:pl-10' : 'pl-3 sm:pl-4'} ${rightIcon ? 'pr-8 sm:pr-10' : 'pr-3 sm:pr-4'} py-2 sm:py-3`;
  
  return (
    <div className="relative w-full">
      {leftIcon && (
        <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {leftIcon}
        </div>
      )}
      
      <input
        type={type}
        placeholder={placeholder}
        className={`${baseClasses} ${stateClasses} ${paddingClasses} ${className} text-sm sm:text-base`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      
      {rightIcon && (
        <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {rightIcon}
        </div>
      )}
    </div>
  );
};

export default Input;