import Image from "next/image";
import Link from "next/link";

export function Brand({
	href = "/",
}: {
	readonly href?: string;
}): React.ReactElement {
	return (
		<Link className="brand" href={href} aria-label="Resetrix home">
			<Image
				unoptimized
				className="brand-logo"
				src="/brand/resetrix-wordmark.svg"
				alt="Resetrix"
				width={252}
				height={44}
			/>
		</Link>
	);
}
