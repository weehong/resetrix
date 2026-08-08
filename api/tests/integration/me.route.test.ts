import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "@/app.js";
import { prisma } from "@/lib/prisma.js";
import { signAccessToken } from "../helpers/auth.js";

const app = createApp();

async function cleanupUsers(): Promise<void> {
	await prisma.user.deleteMany({
		where: { auth0Sub: { startsWith: "auth0|" } },
	});
}

describe("GET /api/v1/me", () => {
	it("returns 401 without a Bearer token", async () => {
		const response = await request(app).get("/api/v1/me");

		expect(response.status).toBe(401);
		expect(response.body).toMatchObject({
			error: { code: "UNAUTHORIZED" },
		});
	});

	it("returns 403 when the token lacks read:profile", async () => {
		await cleanupUsers();
		const token = await signAccessToken({
			sub: "auth0|no-permission",
			permissions: [],
		});

		const response = await request(app)
			.get("/api/v1/me")
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(403);
		expect(response.body).toMatchObject({
			error: { code: "FORBIDDEN" },
		});
	});

	it("returns 401 when the email is not verified", async () => {
		await cleanupUsers();
		const token = await signAccessToken({
			sub: "auth0|unverified",
			emailVerified: false,
			permissions: ["read:profile"],
		});

		const response = await request(app)
			.get("/api/v1/me")
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(401);
		expect(response.body).toMatchObject({
			error: {
				code: "UNAUTHORIZED",
				message: "Email address is not verified",
			},
		});
	});

	it("returns 200 with Profile and upserts the local User", async () => {
		await cleanupUsers();
		const token = await signAccessToken({
			sub: "auth0|alice",
			email: "alice@example.com",
			name: "Alice",
			permissions: ["read:profile"],
			roles: ["user"],
		});

		const response = await request(app)
			.get("/api/v1/me")
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject({
			data: {
				email: "alice@example.com",
				name: "Alice",
				roles: ["user"],
				permissions: ["read:profile"],
			},
		});
		expect(response.body.data.id).toBeTypeOf("string");

		const user = await prisma.user.findUnique({
			where: { auth0Sub: "auth0|alice" },
		});
		expect(user).not.toBeNull();
		expect(user?.email).toBe("alice@example.com");
		expect(user?.name).toBe("Alice");
	});
});
