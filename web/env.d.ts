// Type the build-time environment variables used by server-rendered SEO output.
declare namespace NodeJS {
	interface ProcessEnv {
		/** Absolute canonical HTTPS origin with no trailing slash. */
		readonly SITE_ORIGIN?: string;
		/** Set to preview or staging to block indexing outside production. */
		readonly APP_ENVIRONMENT?: string;
		/** Mailjet API key used by the contact form. */
		readonly MAILJET_API_KEY?: string;
		/** Mailjet secret key used by the contact form. */
		readonly MAILJET_SECRET_KEY?: string;
		/** Mailjet-verified mailbox shown as the sender. */
		readonly MAILJET_FROM_EMAIL?: string;
	}
}
