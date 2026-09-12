const MAX_BODY_BYTES = 64 * 1024;
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Bound the actual stream, including requests without an honest Content-Length. */
export async function readContactBody(request: Request): Promise<unknown> {
	if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) {
		throw new RangeError("Contact body too large");
	}
	const reader = request.body?.getReader();
	if (!reader) throw new SyntaxError("Missing contact body");
	const chunks: Array<Uint8Array> = [];
	let size = 0;
	try {
		while (true) {
			// Each read depends on the preceding chunk and the running size limit.
			// eslint-disable-next-line no-await-in-loop
			const { done, value } = await reader.read();
			if (done) break;
			size += value.byteLength;
			if (size > MAX_BODY_BYTES) {
				void reader.cancel().catch(() => {});
				throw new RangeError("Contact body too large");
			}
			chunks.push(value);
		}
	} finally {
		reader.releaseLock();
	}
	return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}

function allowedHostnames(): Set<string> {
	const hostnames = new Set(["resetrix.com", "www.resetrix.com"]);
	for (const hostname of (process.env.TURNSTILE_ALLOWED_HOSTNAMES ?? "").split(
		","
	)) {
		if (hostname.trim()) hostnames.add(hostname.trim().toLowerCase());
	}
	// Use deployment configuration, never a caller-controlled Host header.
	if (process.env["VERCEL_ENV"] === "preview") {
		for (const hostname of [
			process.env["VERCEL_URL"],
			process.env["VERCEL_BRANCH_URL"],
		]) {
			if (hostname) hostnames.add(hostname.toLowerCase());
		}
	}
	return hostnames;
}

/** A null response means verified; every other result must stop delivery. */
export async function verifyContactToken(
	token: unknown
): Promise<Response | null> {
	if (typeof token !== "string" || !token.trim() || token.length > 2048) {
		return Response.json(
			{ error: "Please complete the verification and try again." },
			{ status: 403 }
		);
	}
	const secret = process.env.TURNSTILE_SECRET_KEY;
	if (!secret) {
		return Response.json(
			{ error: "Verification is unavailable. Please try again later." },
			{ status: 503 }
		);
	}
	try {
		const response = await fetch(VERIFY_URL, {
			method: "POST",
			body: new URLSearchParams({ secret, response: token }),
			signal: AbortSignal.timeout(8000),
		});
		if (!response.ok) throw new Error("Verification unavailable");
		const result: unknown = await response.json();
		if (typeof result !== "object" || result === null)
			throw new Error("Invalid verification response");
		const verification = result as Record<string, unknown>;
		if (
			verification["success"] !== true ||
			verification["action"] !== "contact" ||
			typeof verification["hostname"] !== "string" ||
			!allowedHostnames().has(verification["hostname"].toLowerCase())
		) {
			return Response.json(
				{ error: "Verification failed. Please verify again." },
				{ status: 403 }
			);
		}
		return null;
	} catch {
		// Do not log tokens, secrets, or provider response bodies.
		return Response.json(
			{ error: "Verification is unavailable. Please try again later." },
			{ status: 503 }
		);
	}
}
