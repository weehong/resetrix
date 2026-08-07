import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "@/common/types";
import { AuthScreen } from "@/features/auth/AuthScreen";

type RequireAuthProps = {
	children: ReactNode;
};

/**
 * Gate for the product SPA (ADR-0005). Until the User is authenticated this
 * renders only a status screen — never product UI — and sends the User to
 * Auth0 Universal Login, remembering where they were headed. An expired or
 * failed refresh takes the same path so the User can regain access cleanly.
 */
export const RequireAuth = ({ children }: RequireAuthProps): FunctionComponent => {
	const { t } = useTranslation();
	const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
	const href = useLocation({ select: (location) => location.href });

	useEffect(() => {
		if (isLoading || isAuthenticated) {
			return;
		}
		void loginWithRedirect({ appState: { returnTo: href } });
	}, [href, isAuthenticated, isLoading, loginWithRedirect]);

	if (isLoading) {
		return <AuthScreen message={t("auth.checkingSession")} />;
	}

	if (!isAuthenticated) {
		return <AuthScreen message={t("auth.redirectingToLogin")} />;
	}

	return <>{children}</>;
};
