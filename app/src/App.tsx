import type { AppState } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import type { FunctionComponent } from "@/common/types";
import { TanStackDevelopmentTools } from "@/components/utils/development-tools/TanStackDevelopmentTools";
import { AuthProvider } from "@/features/auth/AuthProvider";
import type { TanstackRouter } from "@/main";

const queryClient = new QueryClient();

type AppProps = { router: TanstackRouter };

const App = ({ router }: AppProps): FunctionComponent => {
	const handleRedirectCallback = (appState: AppState | undefined): void => {
		// Return the User to the page the gate (or Log in CTA) asked for.
		router.history.replace(appState?.returnTo ?? "/home");
	};

	return (
		<AuthProvider onRedirectCallback={handleRedirectCallback}>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				<TanStackDevelopmentTools router={router} />
			</QueryClientProvider>
		</AuthProvider>
	);
};

export default App;
