import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const { sendMock, verifyMock } = vi.hoisted(() => ({
	sendMock: vi.fn(),
	verifyMock: vi.fn(),
}));

import { POST } from "@/app/api/contact/route";

const submission = {
	"cf-turnstile-response": "test-verification-token",
	website: "",
	name: "Alex Tan",
	company: "Example Operations",
	role: "Operations",
	email: "alex@example.com",
	"team-size": "11-50",
	timeframe: "Within 3 months",
	workflow: "Quotation approvals",
	impact: "Two-day delays",
	systems: "ERP and spreadsheets",
	outcome: "Same-day quotes",
};

describe("POST /api/contact", () => {
	beforeEach(() => {
		vi.spyOn(console, "error").mockImplementation(() => {});
		vi.stubEnv("MAILJET_API_KEY", "mailjet-api-key");
		vi.stubEnv("MAILJET_SECRET_KEY", "mailjet-secret-key");
		vi.stubEnv("MAILJET_FROM_EMAIL", "hello@resetrix.com");
		vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
		vi.stubEnv("TURNSTILE_ALLOWED_HOSTNAMES", "");
		vi.stubEnv("VERCEL_ENV", "production");
		verifyMock.mockResolvedValue(
			Response.json({
				success: true,
				hostname: "resetrix.com",
				action: "contact",
			})
		);
		sendMock.mockResolvedValue(new Response(null, { status: 200 }));
		vi.stubGlobal("fetch", (url: string, options: RequestInit) =>
			url === "https://challenges.cloudflare.com/turnstile/v0/siteverify"
				? verifyMock(url, options)
				: sendMock(url, options)
		);
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
		vi.clearAllMocks();
		vi.restoreAllMocks();
	});

	test("sends a validated submission to the fixed Resetrix mailbox", async () => {
		const response = await POST(
			new Request("http://localhost/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(submission),
			})
		);

		expect(response.status).toBe(200);
		expect(verifyMock).toHaveBeenCalledWith(
			"https://challenges.cloudflare.com/turnstile/v0/siteverify",
			expect.objectContaining({
				method: "POST",
				body: new URLSearchParams({
					secret: "test-secret",
					response: "test-verification-token",
				}),
			})
		);
		expect(sendMock).toHaveBeenCalledWith(
			"https://api.mailjet.com/v3.1/send",
			expect.objectContaining({ method: "POST" })
		);
		const request = sendMock.mock.calls[0]?.[1] as RequestInit | undefined;
		const body = JSON.parse(String(request?.body)) as {
			Messages: Array<{
				From: { Email: string; Name: string };
				HTMLPart: string;
				ReplyTo: { Email: string };
				TextPart: string;
				To: Array<{ Email: string }>;
			}>;
		};
		const message = body.Messages[0];
		expect(message?.From).toStrictEqual({
			Email: "hello@resetrix.com",
			Name: "Resetrix Website",
		});
		expect(message?.To).toStrictEqual([{ Email: "hello@resetrix.com" }]);
		expect(message?.ReplyTo).toStrictEqual({ Email: "alex@example.com" });
		expect(message?.TextPart).toContain(
			"Workflow causing friction: Quotation approvals"
		);
		expect(message?.HTMLPart).toContain("Alex Tan · Operations");
		expect(message?.HTMLPart).toContain("Example Operations · 11-50 people");
		expect(message?.HTMLPart).toContain("mailto:alex%40example.com");
	});

	test("escapes client content before inserting it into the HTML email", async () => {
		const response = await POST(
			new Request("http://localhost/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...submission,
					name: "Alex <script>alert('x')</script>",
					workflow: "Approvals & quotes\nAcross <three> systems",
				}),
			})
		);

		expect(response.status).toBe(200);
		const request = sendMock.mock.calls[0]?.[1] as RequestInit | undefined;
		const body = JSON.parse(String(request?.body)) as {
			Messages: Array<{ HTMLPart: string }>;
		};
		const html = body.Messages[0]?.HTMLPart;
		expect(html).not.toContain("<script>");
		expect(html).toContain(
			"Alex &lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;"
		);
		expect(html).toContain(
			"Approvals &amp; quotes<br>Across &lt;three&gt; systems"
		);
	});

	test.each([undefined, "", "x".repeat(2049), 123])(
		"rejects invalid verification token %s",
		async (token) => {
			const response = await POST(
				new Request("https://resetrix.com/api/contact", {
					method: "POST",
					body: JSON.stringify({
						...submission,
						"cf-turnstile-response": token,
					}),
				})
			);
			expect(response.status).toBe(403);
			expect(verifyMock).not.toHaveBeenCalled();
			expect(sendMock).not.toHaveBeenCalled();
		}
	);

	test.each([
		{ success: false, "error-codes": ["timeout-or-duplicate"] },
		{ success: true, hostname: "attacker.example", action: "contact" },
		{ success: true, hostname: "resetrix.com", action: "login" },
		{ success: true },
	])("rejects unsuccessful or mismatched verification %#", async (result) => {
		verifyMock.mockResolvedValue(Response.json(result));
		const response = await POST(
			new Request("https://resetrix.com/api/contact", {
				method: "POST",
				body: JSON.stringify(submission),
				headers: {
					host: "attacker.example",
					"x-forwarded-host": "attacker.example",
				},
			})
		);
		expect(response.status).toBe(403);
		expect(sendMock).not.toHaveBeenCalled();
	});

	test("fails closed when verification is unavailable", async () => {
		verifyMock.mockRejectedValue(new Error("test-secret private-token"));
		const response = await POST(
			new Request("https://resetrix.com/api/contact", {
				method: "POST",
				body: JSON.stringify(submission),
			})
		);
		expect(response.status).toBe(503);
		expect(sendMock).not.toHaveBeenCalled();
		expect(console.error).not.toHaveBeenCalled();
	});

	test("fails closed when the secret is missing", async () => {
		vi.stubEnv("TURNSTILE_SECRET_KEY", "");
		const response = await POST(
			new Request("https://resetrix.com/api/contact", {
				method: "POST",
				body: JSON.stringify(submission),
			})
		);
		expect(response.status).toBe(503);
		expect(verifyMock).not.toHaveBeenCalled();
		expect(sendMock).not.toHaveBeenCalled();
	});

	test.each([
		new Response("upstream unavailable", { status: 502 }),
		new Response("invalid JSON", { status: 200 }),
		Response.json(null),
	])("fails closed on unusable verification responses %#", async (result) => {
		verifyMock.mockResolvedValue(result);
		const response = await POST(
			new Request("https://resetrix.com/api/contact", {
				method: "POST",
				body: JSON.stringify(submission),
			})
		);
		expect(response.status).toBe(503);
		expect(sendMock).not.toHaveBeenCalled();
	});

	test("silently discards honeypot submissions before external calls", async () => {
		const response = await POST(
			new Request("https://resetrix.com/api/contact", {
				method: "POST",
				body: JSON.stringify({
					...submission,
					website: "https://spam.example",
				}),
			})
		);
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ success: true });
		expect(verifyMock).not.toHaveBeenCalled();
		expect(sendMock).not.toHaveBeenCalled();
	});

	test.each([undefined, "1", "999999"])(
		"rejects oversized bodies with Content-Length %s",
		async (length) => {
			const response = await POST(
				new Request("https://resetrix.com/api/contact", {
					method: "POST",
					headers: length ? { "Content-Length": length } : {},
					body: JSON.stringify({ ...submission, extra: "é".repeat(40000) }),
				})
			);
			expect(response.status).toBe(413);
			expect(verifyMock).not.toHaveBeenCalled();
			expect(sendMock).not.toHaveBeenCalled();
		}
	);

	test("rejects malformed JSON before external calls", async () => {
		const response = await POST(
			new Request("https://resetrix.com/api/contact", {
				method: "POST",
				body: "{",
			})
		);
		expect(response.status).toBe(400);
		expect(verifyMock).not.toHaveBeenCalled();
		expect(sendMock).not.toHaveBeenCalled();
	});

	test.each(["deployment.vercel.app", "branch.vercel.app"])(
		"accepts a verified exact preview hostname %s",
		async (hostname) => {
			vi.stubEnv("VERCEL_ENV", "preview");
			vi.stubEnv("VERCEL_URL", "deployment.vercel.app");
			vi.stubEnv("VERCEL_BRANCH_URL", "branch.vercel.app");
			verifyMock.mockResolvedValue(
				Response.json({ success: true, hostname, action: "contact" })
			);
			const response = await POST(
				new Request("https://" + hostname + "/api/contact", {
					method: "POST",
					body: JSON.stringify(submission),
				})
			);
			expect(response.status).toBe(200);
			expect(sendMock).toHaveBeenCalledOnce();
		}
	);

	test("rejects other Vercel projects on previews", async () => {
		vi.stubEnv("VERCEL_ENV", "preview");
		vi.stubEnv("VERCEL_URL", "deployment.vercel.app");
		verifyMock.mockResolvedValue(
			Response.json({
				success: true,
				hostname: "unrelated.vercel.app",
				action: "contact",
			})
		);
		const response = await POST(
			new Request("https://unrelated.vercel.app/api/contact", {
				method: "POST",
				body: JSON.stringify(submission),
			})
		);
		expect(response.status).toBe(403);
		expect(sendMock).not.toHaveBeenCalled();
	});

	test("rejects incomplete submissions without calling Mailjet", async () => {
		const response = await POST(
			new Request("http://localhost/api/contact", {
				method: "POST",
				body: JSON.stringify({ ...submission, workflow: "" }),
			})
		);

		expect(response.status).toBe(400);
		expect(sendMock).not.toHaveBeenCalled();
	});

	test("returns a safe error when Mailjet delivery fails", async () => {
		sendMock.mockResolvedValue(new Response(null, { status: 500 }));

		const response = await POST(
			new Request("http://localhost/api/contact", {
				method: "POST",
				body: JSON.stringify(submission),
			})
		);

		expect(response.status).toBe(500);
		expect(await response.json()).toStrictEqual({
			error: "We could not send your enquiry. Please try again.",
		});
	});

	test("logs provider status and error codes without credentials or form content", async () => {
		sendMock.mockResolvedValue(
			Response.json(
				{
					Messages: [
						{
							Status: "error",
							Errors: [
								{
									ErrorCode: "send-0008",
									ErrorMessage: "mailjet-secret-key alex@example.com Alex Tan",
								},
								{ ErrorCode: "alex@example.com" },
							],
						},
					],
				},
				{ status: 400 }
			)
		);
		const response = await POST(
			new Request("http://localhost/api/contact", {
				method: "POST",
				body: JSON.stringify(submission),
			})
		);
		expect(response.status).toBe(500);
		expect(console.error).toHaveBeenCalledExactlyOnceWith(
			"Contact email delivery failed",
			{
				stage: "mailjet",
				httpStatus: 400,
				errorCodes: ["send-0008"],
			}
		);
		expect(await response.json()).toStrictEqual({
			error: "We could not send your enquiry. Please try again.",
		});
	});

	test("logs missing configuration without calling the provider", async () => {
		vi.stubEnv("MAILJET_SECRET_KEY", "");
		const response = await POST(
			new Request("http://localhost/api/contact", {
				method: "POST",
				body: JSON.stringify(submission),
			})
		);
		expect(response.status).toBe(500);
		expect(sendMock).not.toHaveBeenCalled();
		expect(console.error).toHaveBeenCalledExactlyOnceWith(
			"Contact email delivery failed",
			{
				stage: "configuration",
			}
		);
	});

	test("logs top-level Mailjet authentication errors", async () => {
		sendMock.mockResolvedValue(
			Response.json(
				{ ErrorCode: "mj-0001", ErrorMessage: "Private details" },
				{ status: 401 }
			)
		);
		const response = await POST(
			new Request("http://localhost/api/contact", {
				method: "POST",
				body: JSON.stringify(submission),
			})
		);
		expect(response.status).toBe(500);
		expect(console.error).toHaveBeenCalledExactlyOnceWith(
			"Contact email delivery failed",
			{
				stage: "mailjet",
				httpStatus: 401,
				errorCodes: ["mj-0001"],
			}
		);
	});

	test("handles non-JSON provider failures without logging the raw response", async () => {
		sendMock.mockResolvedValue(
			new Response("Sensitive upstream response", { status: 502 })
		);
		const response = await POST(
			new Request("http://localhost/api/contact", {
				method: "POST",
				body: JSON.stringify(submission),
			})
		);
		expect(response.status).toBe(500);
		expect(console.error).toHaveBeenCalledExactlyOnceWith(
			"Contact email delivery failed",
			{
				stage: "mailjet",
				httpStatus: 502,
				errorCodes: [],
			}
		);
	});

	test("logs transport failures without exposing the thrown error", async () => {
		sendMock.mockRejectedValue(
			new Error("mailjet-secret-key alex@example.com")
		);
		const response = await POST(
			new Request("http://localhost/api/contact", {
				method: "POST",
				body: JSON.stringify(submission),
			})
		);
		expect(response.status).toBe(500);
		expect(console.error).toHaveBeenCalledExactlyOnceWith(
			"Contact email delivery failed",
			{
				stage: "mailjet",
			}
		);
	});
});
