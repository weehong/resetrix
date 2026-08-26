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
			className="inline-flex rounded-[14px] border border-control bg-surface-raised p-1 dark:border-hairline"
			role="group"
		>
			{ORDER.map((option) => {
				const Icon = ICONS[option];
				const active = preference === option;
				return (
					<button
						key={option}
						aria-pressed={active}
						className={`inline-flex size-10 items-center justify-center rounded-[10px] text-xs font-medium transition-colors duration-200 ${active ? "bg-accent text-accent-ink shadow-xs" : "text-ink-muted hover:bg-surface-band hover:text-ink"}`}
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
