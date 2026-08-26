import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const { sendMock } = vi.hoisted(() => ({
	sendMock: vi.fn(),
}));

import { POST } from "@/app/api/contact/route";

const submission = {
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
		vi.stubEnv("MAILJET_API_KEY", "mailjet-api-key");
		vi.stubEnv("MAILJET_SECRET_KEY", "mailjet-secret-key");
		vi.stubEnv("MAILJET_FROM_EMAIL", "hello@resetrix.com");
		sendMock.mockResolvedValue(new Response(null, { status: 200 }));
		vi.stubGlobal("fetch", sendMock);
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
		vi.clearAllMocks();
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
});
