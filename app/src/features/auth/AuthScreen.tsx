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
		<div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center">
			{title ? (
				<p className="text-lg font-semibold text-ink">{title}</p>
			) : null}
			<p className="max-w-md text-sm break-words text-ink-dim">{message}</p>
			{children}
		</div>
	);
};
