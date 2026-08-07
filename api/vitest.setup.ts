// Vitest runs in a Node environment (no jsdom). Pin the runtime to "test" so the
// app and config layers pick safe, deterministic defaults during unit and
// integration runs.
process.env["NODE_ENV"] = "test";
process.env["LOG_LEVEL"] ??= "silent";
// Default to a dedicated test database so unit/integration runs never touch the
// development data. Override via DATABASE_URL when pointing at a real instance.
process.env["DATABASE_URL"] ??=
	"postgresql://vernon:password@localhost:5432/resetrix_test?schema=public";
// Auth0 test config: local HS256 secret + expected issuer/audience so signed
// test JWTs exercise the real verification path without a live tenant.
process.env["AUTH0_TEST_JWT_SECRET"] ??= "test-only-auth0-secret";
process.env["AUTH0_ISSUER"] ??= "https://test.auth0.local/";
process.env["AUTH0_AUDIENCE"] ??= "https://api.resetrix.test";
