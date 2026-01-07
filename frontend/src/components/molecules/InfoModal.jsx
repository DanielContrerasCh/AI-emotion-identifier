import React, { useEffect } from "react";

export default function InfoModal({ open, onClose, title = "Información", children }) {
	useEffect(() => {
		if (!open) return;
		function onKey(e) {
			if (e.key === "Escape") onClose?.();
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	if (!open) return null;
	return (
		<div
			role="dialog"
			aria-modal="true"
			style={{
				position: "fixed",
				inset: 0,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 1000
			}}
		>
			<div
				onClick={onClose}
				style={{
					position: "absolute",
					inset: 0,
					background: "rgba(0,0,0,0.5)"
				}}
			/>
			<div
				style={{
					position: "relative",
					background: "#fff",
					color: "#111",
					padding: 20,
					borderRadius: 8,
					maxWidth: 600,
					width: "90%",
					boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
				}}
			>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
					<h3 style={{ margin: 0 }}>{title}</h3>
					<button onClick={onClose} aria-label="Cerrar" style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 18 }}>
						✕
					</button>
				</div>
				<div style={{ fontSize: 14, lineHeight: 1.4 }}>
					{children}
				</div>
			</div>
		</div>
	);
}