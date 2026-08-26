import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "@/common/types";
import { useProfile } from "@/features/profile/useProfile";

export const Home = (): FunctionComponent => {
	const { t, i18n } = useTranslation();
	// The ProfileGate only renders children once the Profile has loaded.
	const { data: profile } = useProfile();

	const onTranslateButtonClick = async (): Promise<void> => {
		if (i18n.resolvedLanguage === "en") {
			await i18n.changeLanguage("es");
		} else {
			await i18n.changeLanguage("en");
		}
	};

	if (!profile) {
		return null;
	}

	const memberSince = new Date(profile.createdAt).toLocaleDateString(
		i18n.resolvedLanguage,
		{ year: "numeric", month: "long", day: "numeric" }
	);

	const fields: Array<{ label: string; value: string }> = [
		{ label: t("profile.name"), value: profile.name ?? "—" },
		{ label: t("profile.email"), value: profile.email },
		{ label: t("profile.userId"), value: profile.id },
		{ label: t("profile.memberSince"), value: memberSince },
	];

	const renderChips = (values: Array<string>): React.ReactNode => {
		if (values.length === 0) {
			return <li className="text-sm text-ink-muted">—</li>;
		}
		return values.map((value) => (
			<li
				key={value}
				className="rounded-full bg-chip px-3 py-1 text-[0.8125rem] font-medium text-chip-ink"
			>
				{value}
			</li>
		));
	};

	return (
		<div className="flex min-h-screen w-full flex-1 flex-col items-center bg-surface px-6 py-16 md:px-10">
			<div className="w-full max-w-2xl rounded-[20px] bg-surface-raised p-8 shadow-sm dark:border dark:border-hairline dark:shadow-none">
				<h1 className="font-display text-3xl leading-tight font-semibold text-ink">
					{t("profile.title")}
				</h1>
				<p className="mt-2 text-sm text-ink-soft">{t("profile.subtitle")}</p>

				<dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
					{fields.map((field) => (
						<div key={field.label}>
							<dt className="font-mono text-xs font-medium tracking-[0.16em] text-ink-muted uppercase">
								{field.label}
							</dt>
							<dd className="mt-1 text-sm break-words text-ink">
								{field.value}
							</dd>
						</div>
					))}
				</dl>

				<div className="mt-8">
					<h2 className="font-mono text-xs font-medium tracking-[0.16em] text-ink-muted uppercase">
						{t("profile.roles")}
					</h2>
					<ul className="mt-2 flex flex-wrap gap-2">
						{renderChips(profile.roles)}
					</ul>
				</div>

				<div className="mt-6">
					<h2 className="font-mono text-xs font-medium tracking-[0.16em] text-ink-muted uppercase">
						{t("profile.permissions")}
					</h2>
					<ul className="mt-2 flex flex-wrap gap-2">
						{renderChips(profile.permissions)}
					</ul>
				</div>
			</div>

			<button
				className="mt-8 rounded-[10px] px-3 py-2 text-sm font-medium text-ink-link underline decoration-[1.5px] underline-offset-4 transition-colors duration-200 hover:text-aqua-700 dark:hover:text-aqua-200"
				type="button"
				onClick={onTranslateButtonClick}
			>
				{t("home.translate")}
			</button>
		</div>
	);
};
