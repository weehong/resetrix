import { createFileRoute } from "@tanstack/react-router";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";

export const Route = createFileRoute("/_authenticated")({
	component: AuthenticatedLayout,
});
