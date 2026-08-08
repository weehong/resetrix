import { useAuth0 } from "@auth0/auth0-react";
import { useMemo } from "react";
import { z, type ZodType } from "zod";
import { apiEnv } from "@/features/api/env";

/**
 * Thrown when the API rejects the access token (401) or the SDK cannot
 * produce one at all — the session is unrecoverable and the User must sign
 * in again.
 */
export class ApiUnauthorizedError extends Error {
	public constructor(message = "Unauthorized") {
		super(message);
		this.name = "ApiUnauthorizedError";
	}
}

/**
 * Thrown when the API answers 403: the User is authenticated but lacks the
 * permission. Callers must show a no-access state, never a login redirect —
 * signing in again with the same identity would loop.
 */
export class ApiForbiddenError extends Error {
	public constructor(message = "Forbidden") {
		super(message);
		this.name = "ApiForbiddenError";
	}
}

/** Any other failed API call: a non-OK status or an unreadable response. */
export class ApiRequestError extends Error {
	public readonly status: number;

	public constructor(status: number, message: string) {
		super(message);
		this.name = "ApiRequestError";
		this.status = status;
	}
}

/** Supplies a fresh access token, refreshing via the SDK when needed. */
export type GetAccessToken = () => Promise<string>;

export type ApiClient = {
	/** GET a JSON endpoint and validate its `{ data }` envelope with zod. */
	get: <T>(path: string, schema: ZodType<T>) => Promise<T>;
};

/** Best-effort read of the API's error envelope for a useful message. */
async function readErrorMessage(response: Response): Promise<string | null> {
	try {
		const body: unknown = await response.json();
		const parsed = z
			.object({ error: z.object({ message: z.string() }) })
			.safeParse(body);
		return parsed.success ? parsed.data.error.message : null;
	} catch {
		return null;
	}
}

/**
 * Fetch wrapper for the Resetrix API (ADR-0001): every call asks the SDK for
 * a fresh access token (renewed via refresh token inside the session window)
 * and attaches it as `Authorization: Bearer`, so cross-origin calls stay
 * cookieless. 401 and 403 surface as distinct errors because they need
 * opposite UI responses — sign-in again vs. a stable no-access state.
 */
export function createApiClient(
	baseUrl: string,
	getAccessToken: GetAccessToken
): ApiClient {
	const get = async <T>(path: string, schema: ZodType<T>): Promise<T> => {
		let token: string;
		try {
			token = await getAccessToken();
		} catch {
			// Refresh failed too — nothing short of a new login will help.
			throw new ApiUnauthorizedError(
				"Could not obtain an access token for the API call"
			);
		}

		const response = await fetch(`${baseUrl}${path}`, {
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.status === 401) {
			const message = await readErrorMessage(response);
			throw new ApiUnauthorizedError(
				message ?? "Unauthorized"
			);
		}
		if (response.status === 403) {
			throw new ApiForbiddenError();
		}
		if (!response.ok) {
			const message = await readErrorMessage(response);
			throw new ApiRequestError(
				response.status,
				message ?? `Request to ${path} failed with status ${response.status}`
			);
		}

		const body: unknown = await response.json();
		const envelope = z.object({ data: z.unknown() }).parse(body);
		return schema.parse(envelope.data);
	};

	return { get };
}

/**
 * Use the cached access token first. Auth0 is currently issuing API tokens
 * without a refresh_token even when `offline_access` is requested; calling
 * getAccessTokenSilently() in that state triggers authorize/consent and loops.
 * Fall back to the normal silent path only when the cache has no usable token.
 */
async function getAccessTokenForApi(
	getAccessTokenSilently: ReturnType<
		typeof useAuth0
	>["getAccessTokenSilently"]
): Promise<string> {
	try {
		return await getAccessTokenSilently({ cacheMode: "cache-only" });
	} catch {
		return getAccessTokenSilently();
	}
}

/** API client bound to the signed-in User's Auth0 token source. */
export function useApiClient(): ApiClient {
	const { getAccessTokenSilently } = useAuth0();
	return useMemo(
		() =>
			createApiClient(apiEnv.baseUrl, () =>
				getAccessTokenForApi(getAccessTokenSilently)
			),
		[getAccessTokenSilently]
	);
}
