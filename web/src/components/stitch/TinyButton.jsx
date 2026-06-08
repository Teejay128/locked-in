import React from "react";

const TinyButton = ({ text, icon, className = "", ...props }) => {
	return (
		<button
			className={`btn-light-blue flex items-center gap-1.5 text-xs ${className}`}
			{...props}
		>
			{icon && (
				<span className="material-symbols-outlined text-[16px]" data-icon={icon}>
					{icon}
				</span>
			)}
			{text && <span>{text}</span>}
		</button>
	);
};

export default TinyButton;
