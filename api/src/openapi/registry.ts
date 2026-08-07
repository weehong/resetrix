import {
	extendZodWithOpenApi,
	OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

// Teach zod about `.openapi()` metadata. Must run before any schema uses it.
extendZodWithOpenApi(z);

export const registry: OpenAPIRegistry = new OpenAPIRegistry();

const HealthSchema = registry.register(
	"HealthStatus",
	z.object({
		status: z.literal("ok"),
		uptime: z.number().openapi({ example: 12.34 }),
		timestamp: z.string().datetime(),
		version: z.string().openapi({ example: "0.0.0" }),
	})
);

const ReadinessSchema = registry.register(
	"ReadinessStatus",
	z.object({
		status: z.enum(["ready", "not_ready"]),
		checks: z.object({
			database: z.enum(["up", "down"]),
		}),
	})
);

function dataEnvelope(schema: z.ZodTypeAny): z.ZodTypeAny {
	return z.object({ data: schema });
}

registry.registerComponent("securitySchemes", "bearerAuth", {
	type: "http",
	scheme: "bearer",
	bearerFormat: "JWT",
	description: "Auth0-issued access token for the Resetrix API audience.",
});

const ProfileSchema = registry.register(
	"Profile",
	z.object({
		id: z.string(),
		email: z.string().email(),
		name: z.string().nullable(),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
		roles: z.array(z.string()),
		permissions: z.array(z.string()),
	})
);

const ErrorSchema = registry.register(
	"ApiError",
	z.object({
		error: z.object({
			code: z.string(),
			message: z.string(),
			details: z.unknown().optional(),
		}),
	})
);

registry.registerPath({
	method: "get",
	path: "/health",
	summary: "Liveness probe",
	tags: ["Health"],
	responses: {
		200: {
			description: "The service is up.",
			content: {
				"application/json": { schema: dataEnvelope(HealthSchema) },
			},
		},
	},
});

registry.registerPath({
	method: "get",
	path: "/ready",
	summary: "Readiness probe",
	tags: ["Health"],
	responses: {
		200: {
			description: "The service and its dependencies are ready.",
			content: {
				"application/json": { schema: dataEnvelope(ReadinessSchema) },
			},
		},
		503: {
			description: "A dependency is unavailable.",
			content: {
				"application/json": { schema: dataEnvelope(ReadinessSchema) },
			},
		},
	},
});

registry.registerPath({
	method: "get",
	path: "/api/v1/me",
	summary: "Profile for the authenticated User",
	tags: ["Users"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "The signed-in User's Profile.",
			content: {
				"application/json": { schema: dataEnvelope(ProfileSchema) },
			},
		},
		401: {
			description: "Missing or invalid Bearer access token.",
			content: {
				"application/json": { schema: ErrorSchema },
			},
		},
		403: {
			description: "The token lacks the read:profile permission.",
			content: {
				"application/json": { schema: ErrorSchema },
			},
		},
	},
});
