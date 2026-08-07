import { useAuth0 } from "@auth0/auth0-react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "@/common/types";
import { AuthScreen } from "@/features/auth/AuthScreen";

/**
 * Target of the Auth0 redirect. The Auth0 SDK processes the `code`/`state`
 * response itself; this page only reports progress, surfaces a failed login,
 * and bounces anyone who lands here without an Auth0 response back to the
 * (gated) SPA root.
 */
export const CallbackPage = (): FunctionComponent => {
	const { t } = useTranslation();
	const { error, isLoading } = useAuth0();
	const navigate = useNavigate();
	const hasAuthResponse = useLocation({
		select: (location) =>
			location.searchStr.includes("code=") &&
			location.searchStr.includes("state="),
	});

	useEffect(() => {
		if (isLoading || error || hasAuthResponse) {
			return;
		}
		void navigate({ replace: true, to: "/" });
	}, [error, hasAuthResponse, isLoading, navigate]);

	if (error) {
		return (
			<AuthScreen message={error.message} title={t("auth.signInFailed")}>
				<Link
					className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
					to="/"
				>
					{t("auth.backToSignIn")}
				</Link>
			</AuthScreen>
		);
	}

	return <AuthScreen message={t("auth.completingSignIn")} />;
};
