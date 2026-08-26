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

export const BotanicalLinkContrast: Story = {
	name: "Botanical link contrast",
	render: () => (
		<p className="max-w-prose leading-relaxed text-ink">
			The <Link href="/">aqua-800 link</Link> clears AAA on the light page
			ground and switches to aqua-300 on the dark forest ground.
		</p>
	),
};
