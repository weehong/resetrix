import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/pages/PlaceholderPage";

const ActivityPage = (): React.JSX.Element => (
	<PlaceholderPage titleKey="nav.activity" />
);

export const Route = createFileRoute("/_authenticated/activity")({
	component: ActivityPage,
});
