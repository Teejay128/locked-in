import React from "react";

const Card = ({
  children,
  className = "",
  variant = "default",
  padding = "default",
  shadow = "default"
}) => {
  const baseClasses = "border-2 border-primary rounded-xl relative transition-all";
  
  const variantClasses = 
    variant === "primary" ? "bg-primary text-white" :
    variant === "low" ? "bg-surface-container-low" :
    variant === "surface" ? "bg-surface" :
    "bg-surface-container-lowest";
    
  let paddingClasses = "";
  if (padding === "default") paddingClasses = "p-6";
  else if (padding === "large") paddingClasses = "p-8 md:p-12";
  else if (padding === "small") paddingClasses = "p-4";
  else if (padding === "none") paddingClasses = "";

  let shadowClasses = "";
  if (shadow === "default") shadowClasses = "shadow-[4px_4px_0px_0px_#000000]";
  else if (shadow === "large") shadowClasses = "shadow-[8px_8px_0px_0px_#000000]";
  else if (shadow === "none") shadowClasses = "";

  return (
    <div className={`${baseClasses} ${variantClasses} ${paddingClasses} ${shadowClasses} ${className}`.trim()}>
      {children}
    </div>
  );
};

export default Card;
