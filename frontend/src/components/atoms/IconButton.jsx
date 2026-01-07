import React from "react";

export default function IconButton({ onClick, ariaLabel = "button", children }) {
	return (
		<button
			type="button"
			aria-label={ariaLabel}
			onClick={onClick}
			style={{
				background: "transparent",
				border: "none",
				cursor: "pointer",
				fontSize: 20,
				padding: 8,
				borderRadius: 6,
				color: "inherit"
			}}
		>
			{children}
		</button>
	);
}