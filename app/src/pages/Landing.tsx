import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "@/common/types";
import { AppearanceSwitcher } from "@/features/appearance";
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
		<div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-surface px-6 py-20 text-center">
			<div className="absolute top-6 right-6 z-10 md:top-10 md:right-10">
				<AppearanceSwitcher />
			</div>
			<div
				aria-hidden="true"
				className="absolute -top-24 -left-24 size-80 rounded-full bg-forest-300/20 blur-3xl dark:bg-forest-700/30"
			/>
			<div
				aria-hidden="true"
				className="absolute -right-20 -bottom-20 size-72 rounded-full bg-gold-200/15 blur-3xl dark:bg-gold-400/15"
			/>
			<div className="relative flex w-full max-w-2xl flex-col items-center rounded-[40px] bg-surface-raised px-6 py-16 shadow-sm dark:border dark:border-hairline dark:shadow-none sm:px-12">
				<div className="mb-6 h-1 w-12 rounded-full bg-accent" />
				<h1 className="font-display text-5xl leading-[1.08] font-semibold tracking-[-0.02em] text-ink [font-variation-settings:'opsz'_60,'SOFT'_30] sm:text-6xl">
					{t("landing.brand")}
				</h1>
				<p className="mt-5 max-w-[56ch] text-lg text-ink-soft">
					{t("landing.tagline")}
				</p>
				<button
					className="mt-8 h-11 rounded-[14px] bg-accent px-6 text-sm font-medium text-accent-ink shadow-xs transition-colors duration-200 hover:bg-accent-hover"
					type="button"
					onClick={onLoginClick}
				>
					{t("landing.logIn")}
				</button>
				<p className="mt-5 text-[0.8125rem] text-ink-muted">
					{t("landing.inviteOnly")}
				</p>
			</div>
		</div>
	);
};
