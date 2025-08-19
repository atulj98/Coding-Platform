import React from 'react';

const Card = ({ 
  children, 
  className = "",
  padding = "default",
  shadow = "default",
  border = true,
  ...props
}) => {
  // Base classes
  const baseClasses = "bg-white rounded-xl";
  
  // Padding variants
  const paddingClasses = {
    none: "",
    sm: "p-3 sm:p-4",
    default: "p-4 sm:p-6",
    lg: "p-6 sm:p-8"
  };
  
  // Shadow variants
  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    default: "shadow-sm",
    lg: "shadow-lg"
  };
  
  // Border classes
  const borderClasses = border ? "border border-gray-200" : "";
  
  return (
    <div 
      className={`${baseClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${borderClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Header Component
const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

// Card Content Component
const CardContent = ({ children, className = "" }) => {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
};

// Card Footer Component
const CardFooter = ({ children, className = "" }) => {
  return (
    <div className={`mt-4 ${className}`}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;