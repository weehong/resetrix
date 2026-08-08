import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "@/common/types";
import { AuthScreen } from "@/features/auth/AuthScreen";

/**
 * Public entry for the product SPA. Signed-out Users see a Log in CTA that
 * sends them through Auth0 Universal Login and back to `/home`. Signed-in
 * Users are sent straight to `/home`.
 */
export const Landing = (): FunctionComponent => {
	const { t } = useTranslation();
	const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

	if (isLoading) {
		return <AuthScreen message={t("auth.checkingSession")} />;
	}

	if (isAuthenticated) {
		return <Navigate replace to="/home" />;
	}

	const onLoginClick = (): void => {
		void loginWithRedirect({ appState: { returnTo: "/home" } });
	};

	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 px-6 text-center">
			<div className="flex w-full max-w-md flex-col items-center gap-6">
				<h1 className="text-4xl font-semibold tracking-tight text-slate-900">
					{t("landing.brand")}
				</h1>
				<p className="text-base text-slate-600">{t("landing.tagline")}</p>
				<button
					className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:cursor-pointer hover:bg-slate-800"
					type="button"
					onClick={onLoginClick}
				>
					{t("landing.logIn")}
				</button>
				<p className="text-sm text-slate-500">{t("landing.inviteOnly")}</p>
			</div>
		</div>
	);
};
