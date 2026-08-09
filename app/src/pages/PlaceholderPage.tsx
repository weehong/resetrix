import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "@/common/types";

type PlaceholderPageProps = {
	titleKey: "nav.dashboard" | "nav.projects" | "nav.activity" | "nav.settings";
};

export const PlaceholderPage = ({
	titleKey,
}: PlaceholderPageProps): FunctionComponent => {
	const { t } = useTranslation();

	return (
		<div className="flex w-full flex-1 flex-col items-center bg-bg px-6 py-10">
			<div className="w-full max-w-2xl rounded-xl border border-line bg-bg-soft p-8 shadow-sm">
				<h1 className="text-2xl font-semibold text-ink">{t(titleKey)}</h1>
				<p className="mt-1 text-sm text-ink-dim">{t("placeholder.subtitle")}</p>
			</div>
		</div>
	);
};
