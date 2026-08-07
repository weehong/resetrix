import { Prisma, type User } from "@prisma/client";

import { HttpError } from "@/lib/http-error.js";
import { prisma } from "@/lib/prisma.js";
import type { AuthContext } from "@/middlewares/auth.js";

export interface Profile {
	readonly id: string;
	readonly email: string;
	readonly name: string | null;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly roles: Array<string>;
	readonly permissions: Array<string>;
}

export async function upsertUserFromAuth(auth: AuthContext): Promise<User> {
	try {
		return await prisma.user.upsert({
			where: { auth0Sub: auth.subject },
			create: {
				auth0Sub: auth.subject,
				email: auth.email ?? `${auth.subject}@auth0.local`,
				name: auth.name ?? null,
			},
			update: {
				...(auth.email === undefined ? {} : { email: auth.email }),
				...(auth.name === undefined ? {} : { name: auth.name }),
			},
		});
	} catch (error) {
		// Another local User already owns this email; Auth0 subject is the stable
		// key, so a clashing email means the local projection conflicts.
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P2002"
		) {
			throw HttpError.internal("User profile conflicts with an existing record");
		}
		throw error;
	}
}

export function getProfile(user: User, auth: AuthContext): Profile {
	return {
		id: user.id,
		email: user.email,
		name: user.name,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		roles: auth.roles,
		permissions: auth.permissions,
	};
}
