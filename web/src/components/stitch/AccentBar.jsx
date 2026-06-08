import React from "react";

const AccentBar = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`border border-primary bg-background text-primary font-mono rounded-lg px-4 py-3 text-sm md:text-base flex items-center gap-3 transition-all duration-200 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};

export default AccentBar;
