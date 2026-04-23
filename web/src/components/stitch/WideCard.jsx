import React from "react";

const WideCard = ({ 
  children, 
  className = "", 
  variant = "default", 
  padding = "default" 
}) => {
  const baseClasses = "border-4 border-primary neo-shadow-lg rounded-2xl relative";
  
  const variantClasses = variant === "primary" 
    ? "bg-primary text-white" 
    : "bg-surface-container-lowest";
    
  let paddingClasses = "";
  if (padding === "default") paddingClasses = "p-8 md:p-16";
  else if (padding === "large") paddingClasses = "p-12 md:p-24";
  else if (padding === "small") paddingClasses = "p-8 md:p-12";
  else if (padding === "none") paddingClasses = "";

  return (
    <section className={`${baseClasses} ${variantClasses} ${paddingClasses} ${className}`.trim()}>
      {children}
    </section>
  );
};

export default WideCard;
