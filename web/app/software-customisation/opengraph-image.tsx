import type { ImageResponse } from "next/og";
import { createSocialImage, SOCIAL_IMAGE_SIZE } from "@/lib/social-image";

export const alt = "Resetrix software customisation and integration for SMEs";
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";

export default function OpengraphImage(): ImageResponse {
	return createSocialImage(
		"Software customisation & integration",
		"Keep the tools that work. Close the gaps that do not."
	);
}
