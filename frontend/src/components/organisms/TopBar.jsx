import React, { useState } from "react";
import InfoModal from "../molecules/InfoModal";

export default function TopBar() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<header className="topbar">
				<div className="topbar-left">
					{/* espacio para balancear el título centrado */}
				</div>

				<h1>Emotiolyzer</h1>

				<div className="topbar-right">
					{/* reemplazado IconButton por un button nativo para controlar estilo/tooltip */}
					<button
						className="help-button"
						aria-label="Help"
						title="Help"
						onClick={() => setOpen(true)}
					>
						❓
					</button>
				</div>
			</header>

			<InfoModal open={open} onClose={() => setOpen(false)} title="Emotiolyzer">
				<p style={{ marginTop: 0 }}>
					Emotiolyzer analyzes text in a product review to estimate emotions and displays a visualization by category.
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