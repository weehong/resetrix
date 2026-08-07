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
			return <li className="text-sm text-slate-400">—</li>;
		}
		return values.map((value) => (
			<li
				key={value}
				className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
			>
				{value}
			</li>
		));
	};

	return (
		<div className="flex w-full flex-1 flex-col items-center bg-slate-50 px-6 py-10">
			<div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
				<h1 className="text-2xl font-semibold text-slate-900">
					{t("profile.title")}
				</h1>
				<p className="mt-1 text-sm text-slate-500">{t("profile.subtitle")}</p>

				<dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
					{fields.map((field) => (
						<div key={field.label}>
							<dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">
								{field.label}
							</dt>
							<dd className="mt-1 text-sm break-words text-slate-900">
								{field.value}
							</dd>
						</div>
					))}
				</dl>

				<div className="mt-8">
					<h2 className="text-xs font-medium tracking-wide text-slate-500 uppercase">
						{t("profile.roles")}
					</h2>
					<ul className="mt-2 flex flex-wrap gap-2">
						{renderChips(profile.roles)}
					</ul>
				</div>

				<div className="mt-6">
					<h2 className="text-xs font-medium tracking-wide text-slate-500 uppercase">
						{t("profile.permissions")}
					</h2>
					<ul className="mt-2 flex flex-wrap gap-2">
						{renderChips(profile.permissions)}
					</ul>
				</div>
			</div>

			<button
				className="mt-6 text-sm text-slate-500 hover:cursor-pointer hover:text-slate-700"
				type="button"
				onClick={onTranslateButtonClick}
			>
				{t("home.translate")}
			</button>
		</div>
	);
};
