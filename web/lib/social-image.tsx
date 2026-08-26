import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export function createSocialImage(
	kicker: string,
	headline: string
): ImageResponse {
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
					justifyContent: "space-between",
					fontSize: 28,
					fontWeight: 600,
				}}
			>
				<div style={{ display: "flex" }}>
					{siteConfig.name}
					<span style={{ color: siteConfig.accentColor }}>.</span>
				</div>
				<span style={{ color: "#abd4c7", fontSize: 23 }}>{kicker}</span>
			</div>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div
					style={{
						fontSize: 70,
						fontWeight: 700,
						lineHeight: 1.08,
						maxWidth: 990,
					}}
				>
					{headline}
				</div>
				<div style={{ display: "flex", marginTop: 42, gap: 12 }}>
					{["#8db6a1", "#abd4c7", "#d9de7b", "#dfcc28"].map(
						(color) => (
							<div
								key={color}
								style={{
									width: 100,
									height: 12,
									borderRadius: 999,
									background: color,
								}}
							/>
						)
					)}
				</div>
			</div>
		</div>,
		{ ...SOCIAL_IMAGE_SIZE }
	);
}
