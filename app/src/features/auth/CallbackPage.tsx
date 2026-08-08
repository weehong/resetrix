import { useAuth0 } from "@auth0/auth0-react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "@/common/types";
import { AuthScreen } from "@/features/auth/AuthScreen";
import { auth0Env } from "@/features/auth/env";

/**
 * Auth0 Post-Login `api.access.deny(reason)` redirects here with
 * `error` / `error_description` (not `code`). Read those from the URL so we
 * can show the reason even before the SDK surfaces `useAuth0().error`.
 */
function readAuth0CallbackError(searchStr: string): string | null {
	const params = new URLSearchParams(
		searchStr.startsWith("?") ? searchStr.slice(1) : searchStr
	);
	const description = params.get("error_description");
	if (description) {
		return description;
	}
	return params.get("error");
}

/**
 * Target of the Auth0 redirect. The Auth0 SDK processes the `code`/`state`
 * response itself; this page only reports progress, surfaces a failed login
 * (including Post-Login deny reasons such as unverified email), and bounces
 * orphan visits without an Auth0 response. When the SDK clears the query
 * string after a successful exchange, prefer `/home` if the User is already
 * authenticated so we do not flash the public landing and retrigger login.
 */
export const CallbackPage = (): FunctionComponent => {
	const { t } = useTranslation();
	const { error, isAuthenticated, isLoading, logout } = useAuth0();
	const navigate = useNavigate();
	const searchStr = useLocation({ select: (location) => location.searchStr });
	const hasAuthResponse = useMemo(
		() => searchStr.includes("code=") && searchStr.includes("state="),
		[searchStr]
	);
	const urlError = useMemo(
		() => readAuth0CallbackError(searchStr),
		[searchStr]
	);
	const failureMessage = urlError ?? error?.message ?? null;

	useEffect(() => {
		if (isLoading || failureMessage || hasAuthResponse) {
			return;
		}
		void navigate({
			replace: true,
			to: isAuthenticated ? "/home" : "/",
		});
	}, [
		failureMessage,
		hasAuthResponse,
		isAuthenticated,
		isLoading,
		navigate,
	]);

	if (failureMessage) {
		return (
			<AuthScreen message={failureMessage} title={t("auth.signInFailed")}>
				<div className="flex flex-wrap items-center justify-center gap-2">
					<Link
						className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
						to="/"
					>
						{t("auth.backToSignIn")}
					</Link>
					<button
						className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:cursor-pointer hover:bg-slate-50"
						type="button"
						onClick={() => {
							void logout({
								logoutParams: { returnTo: auth0Env.logoutReturnUrl },
							});
						}}
					>
						{t("auth.logOut")}
					</button>
				</div>
			</AuthScreen>
		);
	}

	return <AuthScreen message={t("auth.completingSignIn")} />;
};
