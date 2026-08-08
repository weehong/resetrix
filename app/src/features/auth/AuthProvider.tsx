import { Auth0Provider, type AppState } from "@auth0/auth0-react";
import type { ReactNode } from "react";
import type { FunctionComponent } from "@/common/types";
import { auth0Env } from "@/features/auth/env";

type AuthProviderProps = {
	children: ReactNode;
	onRedirectCallback: (appState: AppState | undefined) => void;
};

/**
 * Auth0 session for the SPA gate. Refresh tokens with rotation plus the
 * `localstorage` cache keep Users signed in across reloads for the Auth0-side
 * ~7-day lifetimes (ADRs 0007, 0008).
 */
export const AuthProvider = ({
	children,
	onRedirectCallback,
}: AuthProviderProps): FunctionComponent => {
	return (
		<Auth0Provider
			// Refresh tokens are required by ADR-0007 once Auth0 returns them.
			// Until the Application has the Refresh Token grant (and the API
			// allows offline access) Auth0 omits refresh_token even when
			// offline_access is requested; useRefreshTokens then makes
			// getAccessTokenSilently re-authorize through /u/consent forever.
			// Re-enable useRefreshTokens + offline_access after Auth0 returns
			// refresh_token in the /oauth/token response.
			cacheLocation="localstorage"
			clientId={auth0Env.clientId}
			domain={auth0Env.domain}
			authorizationParams={{
				audience: auth0Env.audience,
				// eslint-disable-next-line camelcase -- Auth0 SDK option name
				redirect_uri: auth0Env.callbackUrl,
				scope: "openid profile email",
			}}
			onRedirectCallback={onRedirectCallback}
		>
			{children}
		</Auth0Provider>
	);
};
