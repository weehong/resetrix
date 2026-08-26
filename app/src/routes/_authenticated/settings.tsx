import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/pages/PlaceholderPage";

const SettingsPage = (): React.JSX.Element => (
	<PlaceholderPage titleKey="nav.settings" />
);

export const Route = createFileRoute("/_authenticated/settings")({
	component: SettingsPage,
});
