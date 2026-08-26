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
				className="h-11 rounded-[14px] border border-secondary-line bg-secondary px-6 text-sm font-medium text-secondary-ink shadow-xs transition-colors duration-200 hover:bg-secondary-hover"
				type="button"
				onClick={onLogoutClick}
			>
				{t("auth.logOut")}
			</button>
		</AuthScreen>
	);
};
