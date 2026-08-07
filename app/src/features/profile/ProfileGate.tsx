import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "@/common/types";
import { ApiForbiddenError, ApiUnauthorizedError } from "@/features/api/client";
import { AuthScreen } from "@/features/auth/AuthScreen";
import { NoAccessScreen } from "@/features/auth/NoAccessScreen";
import { useProfile } from "@/features/profile/useProfile";

type ProfileGateProps = {
	children: ReactNode;
};

/**
 * Loads the User's Profile before any product UI renders. A 403 means the
 * User is signed in but not allowed: they get a stable no-access state and
 * are never bounced back into a login loop. A 401 means the session could
 * not be refreshed into a valid access token: the User is sent through
 * Auth0 login again, returning to where they were.
 */
export const ProfileGate = ({
	children,
}: ProfileGateProps): FunctionComponent => {
	const { t } = useTranslation();
	const { loginWithRedirect } = useAuth0();
	const href = useLocation({ select: (location) => location.href });
	const profileQuery = useProfile();

	const isUnauthorized = profileQuery.error instanceof ApiUnauthorizedError;

	useEffect(() => {
		if (isUnauthorized) {
			void loginWithRedirect({ appState: { returnTo: href } });
		}
	}, [href, isUnauthorized, loginWithRedirect]);

	if (profileQuery.isPending) {
		return <AuthScreen message={t("profile.loading")} />;
	}

	if (isUnauthorized) {
		return <AuthScreen message={t("auth.redirectingToLogin")} />;
	}

	if (profileQuery.error instanceof ApiForbiddenError) {
		return <NoAccessScreen />;
	}

	if (profileQuery.isError) {
		return (
			<AuthScreen
				message={t("profile.loadError")}
				title={t("profile.loadErrorTitle")}
			>
				<button
					className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:cursor-pointer hover:bg-slate-50"
					type="button"
					onClick={() => void profileQuery.refetch()}
				>
					{t("profile.retry")}
				</button>
			</AuthScreen>
		);
	}

	return <>{children}</>;
};
