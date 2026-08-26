import type { ReactNode } from "react";
import type { FunctionComponent } from "@/common/types";

type AuthScreenProps = {
	children?: ReactNode;
	message: string;
	title?: string;
};

/** Full-screen status shown while the auth gate is resolving or redirecting. */
export const AuthScreen = ({
	children,
	message,
	title,
}: AuthScreenProps): FunctionComponent => {
	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-surface px-6 py-16 text-center">
			<div className="flex w-full max-w-lg flex-col items-center gap-4 rounded-[20px] bg-surface-raised p-8 shadow-sm dark:border dark:border-hairline dark:shadow-none">
				{title ? (
					<h1 className="font-display text-2xl leading-tight font-semibold text-ink">
						{title}
					</h1>
				) : null}
				<p className="max-w-md text-sm break-words text-ink-soft">{message}</p>
				{children}
			</div>
		</div>
	);
};
