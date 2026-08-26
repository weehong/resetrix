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
		<div className="flex min-h-screen w-full flex-1 flex-col items-center bg-surface px-6 py-16 md:px-10">
			<div className="w-full max-w-2xl rounded-[20px] bg-surface-raised p-8 shadow-sm dark:border dark:border-hairline dark:shadow-none">
				<h1 className="font-display text-3xl leading-tight font-semibold text-ink">
					{t(titleKey)}
				</h1>
				<p className="mt-2 text-sm text-ink-soft">
					{t("placeholder.subtitle")}
				</p>
			</div>
		</div>
	);
};
