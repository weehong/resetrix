import type { Meta, StoryObj } from "@storybook/nextjs";
import { Link } from "./link";

const meta = {
	title: "UI/Link",
	component: Link,
	args: { href: "/", children: "Go back home" },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Accent: Story = {};

export const Quiet: Story = {
	args: { tone: "quiet", children: "Quiet link in a nav" },
};

export const External: Story = {
	args: {
		href: "https://nextjs.org/docs",
		children: "Next.js documentation",
	},
};

/**
 * The distinction this component exists to enforce. `--accent` is the brand
 * cyan and is 1.69:1 on the page background; `--accent-text` is its AA-safe
 * counterpart at 5.01:1 and is what links actually use.
 */
export const WhyNotTheBrandCyan: Story = {
	name: "accent-text vs accent",
	render: () => (
		<p className="max-w-prose leading-relaxed text-ink">
			A correct <Link href="/">link in body copy</Link> against{" "}
			<span className="text-accent">text set in the raw brand cyan</span>, which
			is unreadable at this size and should never appear as type.
		</p>
	),
};
