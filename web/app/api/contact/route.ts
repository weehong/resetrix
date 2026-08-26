const RECIPIENT = "hello@resetrix.com";
const SUBJECT = "System Fit Diagnostic - Fit Call Request";
const MAILJET_SEND_URL = "https://api.mailjet.com/v3.1/send";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD_LABELS = {
	name: "Name",
	company: "Company",
	role: "Role",
	email: "Email",
	"team-size": "Team size",
	timeframe: "Timeframe",
	workflow: "Workflow causing friction",
	impact: "Impact today",
	systems: "Systems involved",
	outcome: "Target outcome",
} as const;

type ContactField = keyof typeof FIELD_LABELS;
export type ContactSubmission = Record<ContactField, string>;

function escapeHtml(value: string): string {
	return value.replace(/[&<>'"]/g, (character) => {
		const entities: Record<string, string> = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			"'": "&#39;",
			'"': "&quot;",
		};
		return entities[character] ?? character;
	});
}

function formatHtmlValue(value: string): string {
	return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

function renderDetailRow(label: string, value: string): string {
	return `
		<tr>
			<td style="padding: 0 0 6px; color: #667066; font-family: Arial, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; line-height: 18px; text-transform: uppercase;">${label}</td>
		</tr>
		<tr>
			<td style="padding: 0 0 22px; color: #172a1f; font-family: Arial, sans-serif; font-size: 16px; line-height: 25px;">${formatHtmlValue(value)}</td>
		</tr>`;
}

export function renderContactEmail(submission: ContactSubmission): {
	readonly html: string;
	readonly text: string;
} {
	const text = (Object.keys(FIELD_LABELS) as Array<ContactField>)
		.map((field) => `${FIELD_LABELS[field]}: ${submission[field]}`)
		.join("\n\n");
	const replyHref = `mailto:${encodeURIComponent(submission.email)}`;
	const submittedAt = new Intl.DateTimeFormat("en-SG", {
		dateStyle: "medium",
		timeStyle: "short",
		timeZone: "Asia/Singapore",
	}).format(new Date());

	const html = `<!doctype html>
<html lang="en">
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="color-scheme" content="light only">
		<title>New fit call enquiry</title>
	</head>
	<body style="margin: 0; padding: 0; background: #f4f3e9; color: #172a1f;">
		<div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">New enquiry from ${escapeHtml(submission.name)} at ${escapeHtml(submission.company)}.</div>
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; background: #f4f3e9;">
			<tr>
				<td align="center" style="padding: 40px 16px;">
					<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; max-width: 640px; border-collapse: separate; border-spacing: 0; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 28px rgba(23, 42, 31, 0.10);">
						<tr>
							<td style="padding: 30px 36px; background: #244b37;">
								<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
									<tr>
										<td style="color: #ffffff; font-family: Georgia, serif; font-size: 25px; font-weight: 700; line-height: 30px;">Resetrix</td>
										<td align="right" style="color: #d8d5bb; font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 0.12em; line-height: 16px; text-transform: uppercase;">Operations, reset.</td>
									</tr>
								</table>
							</td>
						</tr>
						<tr>
							<td style="padding: 38px 36px 18px;">
								<div style="margin-bottom: 14px; color: #667066; font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; line-height: 16px; text-transform: uppercase;">New website enquiry</div>
								<h1 style="margin: 0 0 14px; color: #172a1f; font-family: Georgia, serif; font-size: 34px; line-height: 40px;">A new workflow needs clarity.</h1>
								<p style="margin: 0; color: #4f5c53; font-family: Arial, sans-serif; font-size: 16px; line-height: 25px;">${escapeHtml(submission.name)} from ${escapeHtml(submission.company)} has requested a fit call.</p>
							</td>
						</tr>
						<tr>
							<td style="padding: 10px 36px 32px;">
								<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; border-radius: 14px; background: #edf3ec;">
									<tr>
										<td style="padding: 22px 24px;">
											<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
												<tr>
													<td style="color: #667066; font-family: Arial, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; line-height: 18px; text-transform: uppercase;">Contact</td>
													<td align="right" style="color: #667066; font-family: Arial, sans-serif; font-size: 12px; line-height: 18px;">${submittedAt} SGT</td>
												</tr>
												<tr>
													<td colspan="2" style="padding-top: 8px; color: #172a1f; font-family: Arial, sans-serif; font-size: 18px; font-weight: 700; line-height: 26px;">${escapeHtml(submission.name)} · ${escapeHtml(submission.role)}</td>
												</tr>
												<tr>
													<td colspan="2" style="padding-top: 3px; color: #4f5c53; font-family: Arial, sans-serif; font-size: 14px; line-height: 22px;">${escapeHtml(submission.email)} · ${escapeHtml(submission.company)} · ${escapeHtml(submission["team-size"])} people</td>
												</tr>
											</table>
										</td>
									</tr>
								</table>
							</td>
						</tr>
						<tr>
							<td style="padding: 0 36px 10px;">
								<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
									${renderDetailRow("Target timeframe", submission.timeframe)}
									${renderDetailRow("Workflow causing friction", submission.workflow)}
									${renderDetailRow("Impact today", submission.impact)}
									${renderDetailRow("Systems involved", submission.systems)}
									${renderDetailRow("Target outcome", submission.outcome)}
								</table>
							</td>
						</tr>
						<tr>
							<td style="padding: 2px 36px 40px;">
								<a href="${replyHref}" style="display: inline-block; padding: 15px 24px; border-radius: 12px; background: #e5d315; color: #172a1f; font-family: Arial, sans-serif; font-size: 15px; font-weight: 700; line-height: 20px; text-decoration: none;">Reply to ${escapeHtml(submission.name)} →</a>
							</td>
						</tr>
						<tr>
							<td style="padding: 22px 36px; border-top: 1px solid #e3e5dc; color: #7a827b; font-family: Arial, sans-serif; font-size: 12px; line-height: 19px;">Sent securely from the enquiry form at resetrix.com.</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
</html>`;

	return { html, text };
}

function parseSubmission(value: unknown): ContactSubmission | null {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		return null;
	}

	const input = value as Record<string, unknown>;
	const submission = {} as ContactSubmission;
	for (const field of Object.keys(FIELD_LABELS) as Array<ContactField>) {
		const fieldValue = input[field];
		if (
			typeof fieldValue !== "string" ||
			fieldValue.trim().length === 0 ||
			fieldValue.length > 2_000
		) {
			return null;
		}
		submission[field] = fieldValue.trim();
	}

	if (
		submission.email.length > 254 ||
		!EMAIL_PATTERN.test(submission.email)
	) {
		return null;
	}

	return submission;
}

function getMailjetConfig(): {
	readonly apiKey: string;
	readonly secretKey: string;
	readonly fromEmail: string;
} {
	const apiKey = process.env.MAILJET_API_KEY;
	const secretKey = process.env.MAILJET_SECRET_KEY;
	const fromEmail = process.env.MAILJET_FROM_EMAIL;

	if (!apiKey || !secretKey || !fromEmail) {
		throw new Error("Missing Mailjet credentials or sender configuration");
	}

	return { apiKey, secretKey, fromEmail };
}

export async function POST(request: Request): Promise<Response> {
	let submission: ContactSubmission | null = null;
	try {
		submission = parseSubmission(await request.json());
	} catch {
		return Response.json({ error: "Invalid form submission." }, { status: 400 });
	}

	if (!submission) {
		return Response.json({ error: "Invalid form submission." }, { status: 400 });
	}

	try {
		const config = getMailjetConfig();
		const email = renderContactEmail(submission);

		const response = await fetch(MAILJET_SEND_URL, {
			method: "POST",
			headers: {
				Authorization: `Basic ${Buffer.from(`${config.apiKey}:${config.secretKey}`).toString("base64")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				Messages: [
					{
						From: {
							Email: config.fromEmail,
							Name: "Resetrix Website",
						},
						To: [{ Email: RECIPIENT }],
						ReplyTo: { Email: submission.email },
						Subject: SUBJECT,
						HTMLPart: email.html,
						TextPart: email.text,
					},
				],
			}),
		});
		if (!response.ok) {
			throw new Error(`Mailjet delivery failed with status ${response.status}`);
		}

		return Response.json({ success: true });
	} catch {
		return Response.json(
			{ error: "We could not send your enquiry. Please try again." },
			{ status: 500 }
		);
	}
}
