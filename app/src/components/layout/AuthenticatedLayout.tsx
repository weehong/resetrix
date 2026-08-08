import { useAuth0 } from "@auth0/auth0-react";
import { Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "@/common/types";
import { auth0Env } from "@/features/auth/env";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { ProfileGate } from "@/features/profile/ProfileGate";

/**
 * Shell for gated product routes: everything under the `_authenticated`
 * layout requires an Auth0 session and a successfully loaded Profile, then
 * gets the app header with the signed-in User and logout, which ends the
 * Auth0 session and returns to the public landing (`/`).
 */
export const AuthenticatedLayout = (): FunctionComponent => {
	const { t } = useTranslation();
	const { logout, user } = useAuth0();
	const displayName = user?.name ?? user?.email;

	const onLogoutClick = (): void => {
		void logout({ logoutParams: { returnTo: auth0Env.logoutReturnUrl } });
	};

	return (
		<RequireAuth>
			<ProfileGate>
				<div className="flex min-h-screen flex-col">
					<header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
						<span className="text-lg font-semibold text-slate-900">
							Resetrix
						</span>
						<div className="flex items-center gap-4">
							{displayName ? (
								<span className="text-sm text-slate-600">{displayName}</span>
							) : null}
							<button
								className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:cursor-pointer hover:bg-slate-50"
								type="button"
								onClick={onLogoutClick}
							>
								{t("auth.logOut")}
							</button>
						</div>
					</header>
					<main className="flex flex-1 flex-col">
						<Outlet />
					</main>
				</div>
			</ProfileGate>
		</RequireAuth>
	);
};
