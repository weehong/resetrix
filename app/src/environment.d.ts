// TypeScript IntelliSense for VITE_ .env variables.
// VITE_ prefixed variables are exposed to the client while non-VITE_ variables aren't
// https://vitejs.dev/guide/env-and-mode.html

/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string;
	// HTTP API origin — validated at boot in src/features/api/env.ts
	readonly VITE_API_URL: string;
	// Auth0 SPA gate — validated at boot in src/features/auth/env.ts
	readonly VITE_AUTH0_DOMAIN: string;
	readonly VITE_AUTH0_CLIENT_ID: string;
	readonly VITE_AUTH0_AUDIENCE: string;
	readonly VITE_AUTH0_CALLBACK_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
