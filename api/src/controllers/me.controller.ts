import type { Request, Response } from "express";

import { getProfile, type Profile } from "@/services/user.service.js";
import type { ApiResponse } from "@/types/api.js";

/** GET /api/v1/me — Profile for the authenticated User. */
export function meController(
	request: Request,
	response: Response<ApiResponse<Profile>>
): void {
	if (!request.auth || !request.user) {
		throw new Error("requireAuth and ensureUser must run before meController");
	}

	response.status(200).json({ data: getProfile(request.user, request.auth) });
}
