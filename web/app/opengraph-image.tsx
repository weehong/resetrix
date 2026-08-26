import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

// Generated social-share image (/opengraph-image), 1200x630.
// next/og supports flexbox + a subset of CSS only.
export const alt = siteConfig.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage(): ImageResponse {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				padding: "80px",
				background: siteConfig.themeColor.dark,
				color: "#edf0e4",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					fontSize: 28,
					fontWeight: 600,
				}}
			>
				{siteConfig.name}
				<span style={{ color: siteConfig.accentColor }}>.</span>
			</div>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div
					style={{
						fontSize: 76,
						fontWeight: 700,
						lineHeight: 1.08,
						maxWidth: 940,
					}}
				>
					Software that fits the way your business works.
				</div>
				<div style={{ display: "flex", marginTop: 42, gap: 12 }}>
					{["#8db6a1", "#abd4c7", "#d9de7b", "#dfcc28"].map((color) => (
						<div
							key={color}
							style={{
								width: 100,
								height: 12,
								borderRadius: 999,
								background: color,
							}}
						/>
					))}
				</div>
			</div>
		</div>,
		{ ...size }
	);
}
