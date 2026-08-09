import type { Meta, StoryObj } from "@storybook/nextjs";
import { Container } from "./container";

const meta = {
	title: "UI/Container",
	component: Container,
	parameters: { layout: "fullscreen" },
	argTypes: {
		width: {
			control: "inline-radio",
			options: ["narrow", "default", "wide", "full"],
		},
	},
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

const Ruler = ({ label }: { label: string }): React.ReactElement => (
	<div className="rounded-(--radius) bg-accent/15 py-8 text-center text-sm text-ink-dim">
		{label}
	</div>
);

export const Widths: Story = {
	render: () => (
		<div className="flex flex-col gap-4 py-8">
			<Container width="narrow">
				<Ruler label="narrow · max-w-2xl · reading measure" />
			</Container>
			<Container width="default">
				<Ruler label="default · max-w-5xl" />
			</Container>
			<Container width="wide">
				<Ruler label="wide · max-w-7xl" />
			</Container>
			<Container width="full">
				<Ruler label="full · gutter only" />
			</Container>
		</div>
	),
};

/**
 * The gutter is `--pad-x`, a clamp rather than a breakpoint step. Resize the
 * preview to see it move continuously.
 */
export const Gutter: Story = {
	render: () => (
		<div className="bg-bg-inset py-8">
			<Container>
				<Ruler label="--pad-x · clamp(1.25rem, 6vw, 7rem)" />
			</Container>
		</div>
	),
};
