import React, { useState } from "react";
import IconButton from "../atoms/IconButton";
import InfoModal from "../molecules/InfoModal";

export default function TopBar() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<header
				className="topbar"
				style={{
					position: "fixed",
					left: 0,
					right: 0,
					top: 0,
					zIndex: 50,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: 64,
					background: "#0f172a",
					color: "#fff",
					padding: "0 16px",
					boxShadow: "0 1px 0 rgba(255,255,255,0.03)"
				}}
			>
				<div style={{ position: "absolute", left: 16 }}>
					{/* espacio para balancear el título centrado */}
				</div>
				<h1 style={{ margin: 0, fontSize: 20 }}>Emotiolyzer</h1>
				<div style={{ position: "absolute", right: 16 }}>
					<IconButton ariaLabel="Ayuda" onClick={() => setOpen(true)}>?</IconButton>
				</div>
			</header>

			<InfoModal open={open} onClose={() => setOpen(false)} title="Emotiolyzer">
				<p style={{ marginTop: 0 }}>
					Emotiolyzer analyzes text to estimate emotions and displays a visualization by category.
				</p>
				<p>
					How to use:
					<ul style={{ margin: "6px 0 0 18px" }}>
						<li>Enter the review to analyze.</li>
						<li>Press analyze and review the emotion bars/percentages.</li>
					</ul>
				</p>
			</InfoModal>
		</>
	);
}