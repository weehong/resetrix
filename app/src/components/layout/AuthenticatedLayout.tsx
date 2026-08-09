import { useAuth0 } from "@auth0/auth0-react";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	TransitionChild,
} from "@headlessui/react";
import {
	ArrowRightStartOnRectangleIcon,
	Bars3Icon,
	BookOpenIcon,
	BoltIcon,
	FolderIcon,
	HomeIcon,
	Cog6ToothIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { FunctionComponent, Heroicon } from "@/common/types";
import { AppearanceSwitcher } from "@/features/appearance";
import { auth0Env } from "@/features/auth/env";
import { RequireAuth } from "@/features/auth/RequireAuth";
import type { Profile } from "@/features/profile/profile";
import { ProfileGate } from "@/features/profile/ProfileGate";
import { useProfile } from "@/features/profile/useProfile";

type NavItem = {
	nameKey: "nav.dashboard" | "nav.projects" | "nav.activity" | "nav.settings";
	to: "/home" | "/projects" | "/activity" | "/settings";
	icon: Heroicon;
};

const navigation: Array<NavItem> = [
	{ nameKey: "nav.dashboard", to: "/home", icon: HomeIcon },
	{ nameKey: "nav.projects", to: "/projects", icon: FolderIcon },
	{ nameKey: "nav.activity", to: "/activity", icon: BoltIcon },
	{ nameKey: "nav.settings", to: "/settings", icon: Cog6ToothIcon },
];

function classNames(...classes: Array<string | false | null | undefined>): string {
	return classes.filter(Boolean).join(" ");
}

function profileInitials(profile: Profile): string {
	const name = profile.name?.trim();
	if (name) {
		const parts = name.split(/\s+/);
		const first = parts[0]?.[0];
		const second = parts[1]?.[0];
		if (first && second) {
			return `${first}${second}`.toUpperCase();
		}
		return name.slice(0, 2).toUpperCase();
	}
	return profile.email.slice(0, 2).toUpperCase();
}

type SidebarProps = {
	profile: Profile;
	onNavigate?: () => void;
	showProfileFooter: boolean;
};

const Sidebar = ({
	profile,
	onNavigate,
	showProfileFooter,
}: SidebarProps): FunctionComponent => {
	const { t } = useTranslation();
	const { logout } = useAuth0();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	const onLogoutClick = (): void => {
		void logout({ logoutParams: { returnTo: auth0Env.logoutReturnUrl } });
	};

	const displayName = profile.name ?? profile.email;

	return (
		<div className="relative flex grow flex-col gap-y-5 overflow-y-auto border-r border-line bg-bg px-6">
			<div className="relative flex h-16 shrink-0 items-center justify-between gap-4">
				<span className="truncate text-lg font-semibold text-ink">
					{t("landing.brand")}
				</span>
				<a
					className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-ink-dim hover:text-ink"
					href="#"
					onClick={(event) => {
						event.preventDefault();
					}}
				>
					<BookOpenIcon aria-hidden="true" className="size-4" />
					{t("shell.goToDocs")}
				</a>
			</div>
			<nav className="relative flex flex-1 flex-col">
				<ul className="flex flex-1 flex-col" role="list">
					<li className="flex flex-1 items-center">
						<ul className="-mx-2 w-full space-y-1" role="list">
							{navigation.map((item) => {
								const current = pathname === item.to;
								return (
									<li key={item.to}>
										<Link
											to={item.to}
											className={classNames(
												current
													? "bg-bg-soft text-ink"
													: "text-ink-dim hover:bg-bg-soft hover:text-ink",
												"group flex items-center gap-x-3 rounded-md px-3 py-2.5 text-sm font-semibold"
											)}
											onClick={onNavigate}
										>
											<item.icon
												aria-hidden="true"
												className={classNames(
													current
														? "text-ink"
														: "text-ink-dim group-hover:text-ink",
													"size-5 shrink-0"
												)}
											/>
											{t(item.nameKey)}
										</Link>
									</li>
								);
							})}
						</ul>
					</li>
					{showProfileFooter ? (
						<li className="-mx-6 mt-auto border-t border-line">
							<div className="flex items-center gap-x-3 px-6 py-4">
								<AppearanceSwitcher />
								<span
									aria-hidden="true"
									className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-bg-soft text-xs font-semibold text-ink-dim"
								>
									{profileInitials(profile)}
								</span>
								<span className="sr-only">{t("shell.yourProfile")}</span>
								<span
									aria-hidden="true"
									className="min-w-0 flex-1 truncate text-sm/6 font-semibold text-ink"
								>
									{displayName}
								</span>
								<button
									aria-label={t("auth.logOut")}
									className="shrink-0 rounded-md p-2 text-ink-dim hover:text-ink"
									title={t("auth.logOut")}
									type="button"
									onClick={onLogoutClick}
								>
									<ArrowRightStartOnRectangleIcon
										aria-hidden="true"
										className="size-5"
									/>
								</button>
							</div>
						</li>
					) : null}
				</ul>
			</nav>
		</div>
	);
};

/**
 * Product chrome rendered only after ProfileGate has a Profile. Shows the
 * responsive sidebar, Profile identity, and Auth0 logout.
 */
const AuthenticatedShell = (): FunctionComponent => {
	const { t } = useTranslation();
	const { logout } = useAuth0();
	// ProfileGate only renders children once the Profile has loaded.
	const { data: profile } = useProfile();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	if (!profile) {
		return null;
	}

	const activeNavItem = navigation.find((item) => item.to === pathname);
	const mobileTitle = activeNavItem
		? t(activeNavItem.nameKey)
		: t("landing.brand");

	const onLogoutClick = (): void => {
		void logout({ logoutParams: { returnTo: auth0Env.logoutReturnUrl } });
	};

	const closeSidebar = (): void => {
		setSidebarOpen(false);
	};

	return (
		<div>
			<Dialog
				className="relative z-50 lg:hidden"
				open={sidebarOpen}
				onClose={setSidebarOpen}
			>
				<DialogBackdrop
					transition
					className="fixed inset-0 bg-black/70 transition-opacity duration-300 ease-linear data-closed:opacity-0"
				/>

				<div className="fixed inset-0 flex">
					<DialogPanel
						transition
						className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
					>
						<TransitionChild>
							<div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
								<button
									className="-m-2.5 p-2.5"
									type="button"
									onClick={closeSidebar}
								>
									<span className="sr-only">{t("shell.closeSidebar")}</span>
									<XMarkIcon
										aria-hidden="true"
										className="size-6 text-white"
									/>
								</button>
							</div>
						</TransitionChild>

						<Sidebar
							profile={profile}
							showProfileFooter={false}
							onNavigate={closeSidebar}
						/>
					</DialogPanel>
				</div>
			</Dialog>

			{/* Static sidebar for desktop */}
			<div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
				<Sidebar showProfileFooter profile={profile} />
			</div>

			<div className="sticky top-0 z-40 flex items-center gap-x-6 border-b border-line bg-bg px-4 py-4 shadow-xs sm:px-6 lg:hidden">
				<button
					className="-m-2.5 p-2.5 text-ink-dim hover:text-ink"
					type="button"
					onClick={() => {
						setSidebarOpen(true);
					}}
				>
					<span className="sr-only">{t("shell.openSidebar")}</span>
					<Bars3Icon aria-hidden="true" className="size-6" />
				</button>
				<div className="flex-1 text-sm/6 font-semibold text-ink">
					{mobileTitle}
				</div>
				<div className="flex items-center gap-3">
					<AppearanceSwitcher />
					<span
						aria-hidden="true"
						className="flex size-8 items-center justify-center rounded-full border border-line bg-bg-soft text-xs font-semibold text-ink-dim"
					>
						{profileInitials(profile)}
					</span>
					<button
						aria-label={t("auth.logOut")}
						className="rounded-md p-2 text-ink-dim hover:text-ink"
						title={t("auth.logOut")}
						type="button"
						onClick={onLogoutClick}
					>
						<ArrowRightStartOnRectangleIcon
							aria-hidden="true"
							className="size-5"
						/>
					</button>
				</div>
			</div>

			<main className="lg:pl-72">
				<Outlet />
			</main>
		</div>
	);
};

/**
 * Shell for gated product routes: everything under the `_authenticated`
 * layout requires an Auth0 session and a successfully loaded Profile, then
 * gets the app sidebar with navigation for the signed-in User and logout,
 * which ends the Auth0 session and returns to the public landing (`/`).
 */
export const AuthenticatedLayout = (): FunctionComponent => {
	return (
		<RequireAuth>
			<ProfileGate>
				<AuthenticatedShell />
			</ProfileGate>
		</RequireAuth>
	);
};
