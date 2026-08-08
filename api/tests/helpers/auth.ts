import { SignJWT } from "jose";

import { env } from "@/config/env.js";

const secret = new TextEncoder().encode(env.AUTH0_TEST_JWT_SECRET);

export async function signAccessToken(
	claims: {
		sub?: string;
		email?: string;
		name?: string;
		emailVerified?: boolean;
		permissions?: Array<string>;
		roles?: Array<string>;
	} = {}
): Promise<string> {
	const issuer = env.AUTH0_ISSUER || "https://test.auth0.local/";
	const audience = env.AUTH0_AUDIENCE || "https://api.resetrix.test";
	const ns = env.AUTH0_ROLES_NAMESPACE;
	const emailVerified = claims.emailVerified ?? true;

	const token = new SignJWT({
		...(claims.email === undefined ? {} : { email: claims.email }),
		...(claims.name === undefined ? {} : { name: claims.name }),
		[`${ns}/email_verified`]: emailVerified,
		...(claims.permissions === undefined
			? {}
			: { permissions: claims.permissions }),
		...(claims.roles === undefined
			? {}
			: { [`${ns}/roles`]: claims.roles }),
	})
		.setProtectedHeader({ alg: "HS256" })
		.setSubject(claims.sub ?? "auth0|test-user")
		.setIssuer(issuer)
		.setAudience(audience)
		.setIssuedAt()
		.setExpirationTime("5m");

	return token.sign(secret);
}
