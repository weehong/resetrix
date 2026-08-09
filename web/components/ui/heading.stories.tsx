import type { Meta, StoryObj } from "@storybook/nextjs";
import { Eyebrow, Heading } from "./heading";

const meta = {
	title: "UI/Heading",
	component: Heading,
	argTypes: {
		level: { control: "inline-radio", options: [1, 2, 3, 4] },
		size: {
			control: "select",
			options: ["display", "xl", "lg", "md", "sm"],
		},
	},
	args: { children: "A headline that has to hold its shape" },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Scale: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<Heading level={1} size="display">
				Display
			</Heading>
			<Heading level={1} size="xl">
				Extra large
			</Heading>
			<Heading level={2} size="lg">
				Large
			</Heading>
			<Heading level={3} size="md">
				Medium
			</Heading>
			<Heading level={4} size="sm">
				Small
			</Heading>
		</div>
	),
};

/**
 * `level` and `size` are separate on purpose: the document outline is a
 * structural decision and the type step is a visual one, and forcing them to
 * agree is how pages end up with an h3 where an h2 belongs.
 */
export const LevelIndependentOfSize: Story = {
	name: "Level ≠ size",
	render: () => (
		<div className="flex flex-col gap-4">
			<Eyebrow>Section label</Eyebrow>
			<Heading level={2} size="display">
				An h2 set at display size
			</Heading>
			<p className="max-w-prose leading-relaxed text-ink-dim">
				Renders as an h2 in the outline while reading as the largest step on the
				page.
			</p>
		</div>
	),
};
