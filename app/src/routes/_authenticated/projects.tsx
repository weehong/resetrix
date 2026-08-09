import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/pages/PlaceholderPage";

const ProjectsPage = (): React.JSX.Element => (
	<PlaceholderPage titleKey="nav.projects" />
);

export const Route = createFileRoute("/_authenticated/projects")({
	component: ProjectsPage,
});
