import type { ImageResponse } from "next/og";
import { createSocialImage, SOCIAL_IMAGE_SIZE } from "@/lib/social-image";

export const alt = "Resetrix operational transformation for Singapore SMEs";
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";

export default function OpengraphImage(): ImageResponse {
	return createSocialImage(
		"Operational transformation",
		"Make the operational drag visible before changing it."
	);
}
