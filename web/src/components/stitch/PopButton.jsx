import React from "react";

const PopButton = ({
  children,
  text,
  icon,
  className = "",
  variant = "default",
  ...props
}) => {
  const baseClasses = "py-3 px-5 flex items-center justify-center gap-2 font-headline font-extrabold text-sm uppercase tracking-wide border-2 border-primary rounded-md transition-all cursor-pointer select-none";

  // Signature hover popping up effect:
  // Default is shadow 4px, hovers to 8px and translates -1px, active closes to 0px
  const variantClasses = 
    variant === "primary" 
      ? "bg-primary text-surface-container-lowest hover:bg-primary/90" 
      : variant === "danger"
      ? "bg-surface text-error border-error shadow-[4px_4px_0px_0px_#ba1a1a] hover:shadow-[8px_8px_0px_0px_#ba1a1a] hover:-translate-y-1 hover:-translate-x-1 active:shadow-[0px_0px_0px_0px_#ba1a1a] active:translate-y-1 active:translate-x-1"
      : "bg-surface text-primary hover:bg-surface-container-low";

  const shadowClasses = variant !== "danger"
    ? "shadow-[4px_4px_0px_0px_#000000] hover:shadow-[8px_8px_0px_0px_#000000] hover:-translate-y-1 hover:-translate-x-1 active:shadow-[0px_0px_0px_0px_#000000] active:translate-y-1 active:translate-x-1"
    : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${shadowClasses} ${className}`.trim()}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined text-[20px] font-normal" data-icon={icon}>
          {icon}
        </span>
      )}
      {text && <span>{text}</span>}
      {children}
    </button>
  );
};

export default PopButton;
