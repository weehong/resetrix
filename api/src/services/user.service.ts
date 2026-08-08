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

/** Make Auth0 `sub` safe as the local-part of a placeholder email. */
function localPartFromSubject(subject: string): string {
	return subject.replace(/[^A-Za-z0-9._-]/g, "-");
}

function uniqueTargetIncludes(
	error: Prisma.PrismaClientKnownRequestError,
	field: string
): boolean {
	const target = error.meta?.["target"];
	if (Array.isArray(target)) {
		return target.some(
			(item) => typeof item === "string" && item.includes(field)
		);
	}
	return typeof target === "string" && target.includes(field);
}

async function upsertUser(auth: AuthContext): Promise<User> {
	return prisma.user.upsert({
		where: { auth0Sub: auth.subject },
		create: {
			auth0Sub: auth.subject,
			email: auth.email ?? `${localPartFromSubject(auth.subject)}@auth0.local`,
			name: auth.name ?? null,
		},
		update: {
			...(auth.email === undefined ? {} : { email: auth.email }),
			...(auth.name === undefined ? {} : { name: auth.name }),
		},
	});
}

export async function upsertUserFromAuth(auth: AuthContext): Promise<User> {
	try {
		return await upsertUser(auth);
	} catch (error) {
		if (
			!(error instanceof Prisma.PrismaClientKnownRequestError) ||
			error.code !== "P2002"
		) {
			throw error;
		}

		// Email is unique; another local User already owns it.
		if (uniqueTargetIncludes(error, "email")) {
			throw HttpError.conflict(
				"User profile conflicts with an existing record"
			);
		}

		// Rare race on auth0Sub create: retry the upsert once.
		if (uniqueTargetIncludes(error, "auth0Sub")) {
			try {
				return await upsertUser(auth);
			} catch (retryError) {
				if (
					retryError instanceof Prisma.PrismaClientKnownRequestError &&
					retryError.code === "P2002"
				) {
					throw HttpError.conflict(
						"User profile conflicts with an existing record"
					);
				}
				throw retryError;
			}
		}

		throw HttpError.conflict("User profile conflicts with an existing record");
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
