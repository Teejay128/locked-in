import React from "react";

const PopButton = ({
  children,
  text,
  icon,
  className = "",
  variant = "default",
  shadow = "default",
  ...props
}) => {
  let btnClass = "btn neo-btn";
  
  if (variant === "danger") {
    btnClass = "btn-danger neo-btn";
  } else if (variant === "primary" || variant === "dark") {
    btnClass = "btn-dark neo-btn";
  }

  return (
    <button
      className={`${btnClass} ${className}`.trim()}
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
