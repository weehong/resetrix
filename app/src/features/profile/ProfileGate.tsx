import { useAuth0 } from "@auth0/auth0-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "@/common/types";
import { ApiForbiddenError, ApiUnauthorizedError } from "@/features/api/client";
import { AuthScreen } from "@/features/auth/AuthScreen";
import { auth0Env } from "@/features/auth/env";
import { NoAccessScreen } from "@/features/auth/NoAccessScreen";
import { useProfile } from "@/features/profile/useProfile";

type ProfileGateProps = {
	children: ReactNode;
};

/**
 * Loads the User's Profile before any product UI renders. A 403 means the
 * User is signed in but not allowed: stable no-access, never a login loop.
 * A 401 while Auth0 still considers the User signed in (e.g. missing
 * verified-email claim) must also stay stable — calling loginWithRedirect
 * would reuse the Auth0 SSO session and redirect forever.
 */
export const ProfileGate = ({
	children,
}: ProfileGateProps): FunctionComponent => {
	const { t } = useTranslation();
	const { logout } = useAuth0();
	const profileQuery = useProfile();

	const isUnauthorized = profileQuery.error instanceof ApiUnauthorizedError;

	if (profileQuery.isPending) {
		return <AuthScreen message={t("profile.loading")} />;
	}

	if (isUnauthorized) {
		const detail =
			profileQuery.error instanceof Error && profileQuery.error.message
				? profileQuery.error.message
				: t("auth.sessionRejectedMessage");
		return (
			<AuthScreen message={detail} title={t("auth.sessionRejected")}>
				<button
					className="h-11 rounded-[14px] border border-secondary-line bg-secondary px-6 text-sm font-medium text-secondary-ink shadow-xs transition-colors duration-200 hover:bg-secondary-hover"
					type="button"
					onClick={() => {
						void logout({
							logoutParams: { returnTo: auth0Env.logoutReturnUrl },
						});
					}}
				>
					{t("auth.logOut")}
				</button>
			</AuthScreen>
		);
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
					className="h-11 rounded-[14px] bg-cta px-6 text-sm font-medium text-cta-label shadow-xs transition-colors duration-200 hover:bg-cta-hover"
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
