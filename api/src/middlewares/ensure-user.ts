import type { NextFunction, Request, RequestHandler, Response } from "express";

import { HttpError } from "@/lib/http-error.js";
import { upsertUserFromAuth } from "@/services/user.service.js";

/**
 * Attach the local User projection for an authenticated request. Protected
 * routes run this after `requireAuth` so application data can foreign-key to a
 * stable local User without callers needing to hit a dedicated sync route.
 */
export function ensureUser(): RequestHandler {
	return async (
		request: Request,
		_response: Response,
		next: NextFunction
	): Promise<void> => {
		if (!request.auth) {
			next(HttpError.unauthorized());
			return;
		}
		const user = await upsertUserFromAuth(request.auth).catch(
			(error: unknown) => {
				next(error);
				return null;
			}
		);
		if (user) {
			// The upsert result is assigned to the request exactly once, after the
			// await has settled.
			// eslint-disable-next-line require-atomic-updates
			request.user = user;
			next();
		}
	};
}
