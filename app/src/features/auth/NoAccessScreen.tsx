import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "@/common/types";
import { AuthScreen } from "@/features/auth/AuthScreen";
import { auth0Env } from "@/features/auth/env";

/**
 * Signed in, but the API answered 403: the User's Auth0 identity lacks the
 * role/permission (e.g. `read:profile`) for the product. This is a stable
 * no-access state — not a login redirect — because signing in again with the
 * same identity would loop. Logging out lets a different User sign in.
 */
export const NoAccessScreen = (): FunctionComponent => {
	const { t } = useTranslation();
	const { logout } = useAuth0();

	const onLogoutClick = (): void => {
		void logout({ logoutParams: { returnTo: auth0Env.logoutReturnUrl } });
	};

	return (
		<AuthScreen message={t("auth.noAccessMessage")} title={t("auth.noAccess")}>
			<button
				className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:cursor-pointer hover:bg-slate-50"
				type="button"
				onClick={onLogoutClick}
			>
				{t("auth.logOut")}
			</button>
		</AuthScreen>
	);
};
