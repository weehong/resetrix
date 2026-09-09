import type { ImageResponse } from "next/og";
import { createSocialImage, SOCIAL_IMAGE_SIZE } from "@/lib/social-image";

export const alt = "Resetrix workflow digitalisation for Singapore SMEs";
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";

export default function OpengraphImage(): ImageResponse {
	return createSocialImage(
		"Workflow digitalisation",
		"Make the operational drag visible before changing it."
	);
}
