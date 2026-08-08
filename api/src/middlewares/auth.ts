import { createRemoteJWKSet, jwtVerify } from "jose";
import type { RequestHandler } from "express";

import { env } from "@/config/env.js";
import { HttpError } from "@/lib/http-error.js";

export interface AuthContext {
	readonly subject: string;
	readonly email?: string;
	readonly name?: string;
	readonly permissions: Array<string>;
	readonly roles: Array<string>;
}

function readBearerToken(authorization: string | undefined): string | null {
	if (!authorization) {
		return null;
	}
	const [scheme, token] = authorization.trim().split(/\s+/);
	if (scheme?.toLowerCase() !== "bearer" || !token) {
		return null;
	}
	return token;
}

function readStringClaim(value: unknown): string | undefined {
	return typeof value === "string" ? value : undefined;
}

function readStringArrayClaim(value: unknown): Array<string> {
	if (!Array.isArray(value)) {
		return [];
	}
	return value.filter((item): item is string => typeof item === "string");
}

const jwksUri = env.AUTH0_JWKS_URI || undefined;
const testSecret = env.AUTH0_TEST_JWT_SECRET || undefined;

const localKey =
	jwksUri || !testSecret ? null : new TextEncoder().encode(testSecret);

const jwks = jwksUri ? createRemoteJWKSet(new URL(jwksUri)) : null;

async function verifyAccessToken(token: string): Promise<AuthContext> {
	const key = jwks ?? localKey;
	if (!key) {
		throw HttpError.unauthorized("Bearer token validation is not configured");
	}

	const { payload } = await jwtVerify(token, key, {
		audience: env.AUTH0_AUDIENCE,
		issuer: env.AUTH0_ISSUER,
	});

	if (!payload.sub) {
		throw HttpError.unauthorized("Bearer token is missing a subject");
	}

	// Auth0 custom claims on API access tokens must be namespaced; bare
	// forms are a fallback for local HS256 test tokens. Login is denied in
	// Auth0 when email is unverified; the API also requires the claim so a
	// token cannot call protected routes without it.
	const ns = env.AUTH0_ROLES_NAMESPACE;
	const emailVerified =
		payload[`${ns}/email_verified`] === true ||
		payload["email_verified"] === true;
	if (!emailVerified) {
		throw HttpError.unauthorized("Email address is not verified");
	}

	return {
		subject: payload.sub,
		email:
			readStringClaim(payload[`${ns}/email`]) ??
			readStringClaim(payload["email"]),
		name:
			readStringClaim(payload[`${ns}/name`]) ??
			readStringClaim(payload["name"]),
		permissions: readStringArrayClaim(payload["permissions"]),
		roles: readStringArrayClaim(payload[`${ns}/roles`]),
	};
}

/** Require a valid Bearer access token and attach its claims to the request. */
export function requireAuth(): RequestHandler {
	return async (request, _response, next) => {
		let auth: AuthContext;
		try {
			const token = readBearerToken(request.headers.authorization);
			if (!token) {
				throw HttpError.unauthorized("Bearer token required");
			}
			auth = await verifyAccessToken(token);
		} catch (error) {
			next(
				error instanceof HttpError
					? error
					: HttpError.unauthorized("Invalid or expired Bearer token")
			);
			return;
		}
		// Assigning the verified claims onto the request is the intended mutation;
		// there is no second read of `request` between the await and this write.
		// eslint-disable-next-line require-atomic-updates
		request.auth = auth;
		next();
	};
}

/** Require a permission from the access token's RBAC claims. */
export function requirePermission(permission: string): RequestHandler {
	return (request, _response, next) => {
		if (!request.auth) {
			next(HttpError.unauthorized());
			return;
		}
		if (!request.auth.permissions.includes(permission)) {
			next(HttpError.forbidden(`Missing permission: ${permission}`));
			return;
		}
		next();
	};
}
