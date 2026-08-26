import type { FunctionComponent } from "@/common/types";
import resetrixLogo from "@/assets/resetrix-logo.svg";

type BrandLogoProps = {
	className?: string;
	label: string;
};

export const BrandLogo = ({
	className,
	label,
}: BrandLogoProps): FunctionComponent => {
	return <img alt={label} className={className} src={resetrixLogo} />;
};
