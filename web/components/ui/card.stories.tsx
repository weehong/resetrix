import type { Meta, StoryObj } from "@storybook/nextjs";
import { Card, CardBody, CardTitle } from "./card";

const meta = {
	title: "UI/Card",
	component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Raised: Story = {
	render: () => (
		<Card className="max-w-sm">
			<CardTitle>Raised</CardTitle>
			<CardBody>
				Sits on --bg-soft and lifts off the page. The default, and what most
				content should use.
			</CardBody>
		</Card>
	),
};

export const Inset: Story = {
	render: () => (
		<Card tone="inset" className="max-w-sm">
			<CardTitle>Inset</CardTitle>
			<CardBody>
				Recedes into the page on --bg-inset. For wells, asides and anything that
				should read as secondary.
			</CardBody>
		</Card>
	),
};

export const Accented: Story = {
	name: "Accent rule",
	render: () => (
		<Card accent className="max-w-sm">
			<CardTitle>Accented</CardTitle>
			<CardBody>
				A cyan rule along the top edge. This is one of the few places the raw
				brand accent is used as a fill, which is all it is safe for.
			</CardBody>
		</Card>
	),
};

export const Grid: Story = {
	render: () => (
		<ul className="grid max-w-3xl gap-4 sm:grid-cols-3">
			{["Tokens", "Primitives", "Stories"].map((title, index) => (
				<Card as="li" key={title} accent={index === 0}>
					<CardTitle>{title}</CardTitle>
					<CardBody>One of three, to check that the edges align.</CardBody>
				</Card>
			))}
		</ul>
	),
};
