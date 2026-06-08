import React from "react";

const Card = ({
  children,
  className = "",
  variant = "default",
  padding = "default",
  shadow = "default"
}) => {
  let baseClasses = "";
  
  if (variant === "container") {
    // card-container: thick dark border (2px), white bg, light-gray shadow.
    // Hover: no hover effects
    baseClasses = "border-2 border-primary rounded-xl bg-surface-container-lowest shadow-[8px_8px_0px_0px_#cbd5e1]";
  } else if (variant === "naked") {
    // card-naked: thin dark border, body background, no shadows or animations.
    baseClasses = "border border-primary rounded-xl bg-background";
  } else if (variant === "dark") {
    // card-dark: thick black background, no hover animations, no borders.
    baseClasses = "bg-primary text-surface-container-lowest rounded-xl";
  } else {
    // card (default): border-2, body background, no shadow.
    // Hover: pops up with smooth transition and black shadow.
    baseClasses = "border-2 border-primary rounded-xl bg-background shadow-none transition-all duration-300 hover:shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 hover:-translate-x-1";
  }

  // If a custom shadow is requested, add its class and strip base shadows to avoid conflicts
  let shadowClass = "";
  if (shadow !== "default") {
    shadowClass = `neo-shadow-${shadow}`;
  }

  let paddingClasses = "";
  if (padding === "default") paddingClasses = "p-6";
  else if (padding === "large") paddingClasses = "p-8 md:p-12";
  else if (padding === "small") paddingClasses = "p-4";
  else if (padding === "none") paddingClasses = "";

  let finalClasses = `${baseClasses} ${shadowClass} ${paddingClasses} ${className}`.trim();
  if (shadowClass) {
    // Strip default inline shadow and shadow-none when a custom shadow is provided
    finalClasses = finalClasses.replace(/shadow-\[[^\]]+\]/g, "").replace(/shadow-none/g, "");
  }

  return (
    <div className={finalClasses}>
      {children}
    </div>
  );
};

export default Card;
