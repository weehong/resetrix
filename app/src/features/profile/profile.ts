import { z } from "zod";

/**
 * The User's product-facing identity as returned by `GET /api/v1/me`: the
 * local User fields plus the roles and permissions from the access token
 * (see CONTEXT.md). Timestamps arrive as ISO strings over JSON.
 */
export const ProfileSchema = z.object({
	id: z.string(),
	email: z.string(),
	name: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
	roles: z.array(z.string()),
	permissions: z.array(z.string()),
});

export type Profile = z.infer<typeof ProfileSchema>;
