import { ComputerDesktopIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "@/common/types";
import type { AppearancePreference } from "@/features/appearance";
import { useAppearance } from "@/features/appearance/useAppearance";

const ORDER: Array<AppearancePreference> = ["light", "dark", "system"];

const ICONS: Record<AppearancePreference, typeof SunIcon> = {
	light: SunIcon,
	dark: MoonIcon,
	system: ComputerDesktopIcon,
};

export const AppearanceSwitcher = (): FunctionComponent => {
	const { t } = useTranslation();
	const { preference, setPreference } = useAppearance();

	return (
		<div
			aria-label={t("appearance.label")}
			className="inline-flex rounded-md border border-line bg-bg-soft p-0.5"
			role="group"
		>
			{ORDER.map((option) => {
				const Icon = ICONS[option];
				const active = preference === option;
				return (
					<button
						key={option}
						aria-pressed={active}
						className={`inline-flex items-center justify-center rounded px-2 py-1.5 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${active ? "bg-bg text-ink shadow-xs" : "text-ink-dim hover:text-ink"}`}
						title={t(`appearance.${option}`)}
						type="button"
						onClick={() => {
							setPreference(option);
						}}
					>
						<Icon aria-hidden="true" className="size-4" />
						<span className="sr-only">{t(`appearance.${option}`)}</span>
					</button>
				);
			})}
		</div>
	);
};
