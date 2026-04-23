import React from "react";

const TinyButton = ({ text, icon, className = "", ...props }) => {
	return (
		<button
			className={`flex items-center gap-1.5 border-2 border-primary px-3 py-1.5 text-sm bg-surface-container-low font-label font-bold rounded-md active-press transition-transform ${className}`}
			{...props}
		>
			{icon && (
				<span className="material-symbols-outlined text-[18px]" data-icon={icon}>
					{icon}
				</span>
			)}
			{text && <span>{text}</span>}
		</button>
	);
};

export default TinyButton;
