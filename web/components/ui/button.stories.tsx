import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button } from "./button";

const meta = {
	title: "UI/Button",
	component: Button,
	args: { children: "Get started" },
	argTypes: {
		variant: {
			control: "select",
			options: ["accent", "solid", "outline", "ghost", "danger"],
		},
		size: { control: "inline-radio", options: ["sm", "md", "lg"] },
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Accent: Story = {};

export const AllVariants: Story = {
	name: "All variants",
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button variant="accent">Accent</Button>
			<Button variant="solid">Solid</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="danger">Danger</Button>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
		</div>
	),
};

export const Disabled: Story = {
	args: { disabled: true },
};

/**
 * The accent fill is the one variant where the ink choice is not obvious, so
 * it is worth being able to see the mistake next to the correct version.
 */
export const AccentInkContrast: Story = {
	name: "Why accent-ink is dark",
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button variant="accent">accent-ink · 9.33 AAA</Button>
			<button
				type="button"
				className="inline-flex h-11 items-center justify-center rounded-(--radius) bg-accent px-5 font-medium text-white"
			>
				white · 1.81 FAIL
			</button>
		</div>
	),
};
