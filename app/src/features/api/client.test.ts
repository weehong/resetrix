import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import {
	ApiForbiddenError,
	ApiRequestError,
	ApiUnauthorizedError,
	createApiClient,
} from "@/features/api/client";

const BASE_URL = "http://localhost:3000";
const MeSchema = z.object({ email: z.string() });

const fakeResponse = (status: number, body: unknown): Response => {
	const response: Pick<Response, "status" | "ok" | "json"> = {
		status,
		ok: status >= 200 && status < 300,
		json: () => Promise.resolve(body),
	};
	return response as Response;
};

const getToken = (): Promise<string> => Promise.resolve("access-token");

describe("createApiClient", () => {
	const fetchMock = vi.fn<typeof fetch>();

	beforeEach(() => {
		fetchMock.mockReset();
		vi.stubGlobal("fetch", fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("attaches the access token as a Bearer header and parses the envelope", async () => {
		fetchMock.mockResolvedValue(
			fakeResponse(200, { data: { email: "user@example.com" } })
		);
		const client = createApiClient(BASE_URL, getToken);

		const result = await client.get("/api/v1/me", MeSchema);

		expect(result).toStrictEqual({ email: "user@example.com" });
		expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/api/v1/me`, {
			headers: {
				Accept: "application/json",
				Authorization: "Bearer access-token",
			},
		});
	});

	it("throws ApiUnauthorizedError when the API answers 401", async () => {
		fetchMock.mockResolvedValue(
			fakeResponse(401, { error: { message: "nope" } })
		);
		const client = createApiClient(BASE_URL, getToken);

		await expect(client.get("/api/v1/me", MeSchema)).rejects.toBeInstanceOf(
			ApiUnauthorizedError
		);
	});

	it("throws ApiUnauthorizedError when no access token can be obtained", async () => {
		const failingToken = (): Promise<string> =>
			Promise.reject(new Error("login_required"));
		const client = createApiClient(BASE_URL, failingToken);

		await expect(client.get("/api/v1/me", MeSchema)).rejects.toBeInstanceOf(
			ApiUnauthorizedError
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("throws ApiForbiddenError when the API answers 403", async () => {
		fetchMock.mockResolvedValue(
			fakeResponse(403, { error: { message: "no" } })
		);
		const client = createApiClient(BASE_URL, getToken);

		await expect(client.get("/api/v1/me", MeSchema)).rejects.toBeInstanceOf(
			ApiForbiddenError
		);
	});

	it("throws ApiRequestError with the API's message on other failures", async () => {
		fetchMock.mockResolvedValue(
			fakeResponse(500, { error: { message: "Database unavailable" } })
		);
		const client = createApiClient(BASE_URL, getToken);

		const error = await client
			.get("/api/v1/me", MeSchema)
			.catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiRequestError);
		expect((error as ApiRequestError).status).toBe(500);
		expect((error as ApiRequestError).message).toBe("Database unavailable");
	});

	it("falls back to a status message when the error body is unreadable", async () => {
		fetchMock.mockResolvedValue(fakeResponse(502, "<html>bad gateway</html>"));
		const client = createApiClient(BASE_URL, getToken);

		await expect(client.get("/api/v1/me", MeSchema)).rejects.toThrow(
			"Request to /api/v1/me failed with status 502"
		);
	});

	it("rejects when the success body does not match the schema", async () => {
		fetchMock.mockResolvedValue(fakeResponse(200, { data: { nope: 1 } }));
		const client = createApiClient(BASE_URL, getToken);

		await expect(client.get("/api/v1/me", MeSchema)).rejects.toBeInstanceOf(
			z.ZodError
		);
	});
});
