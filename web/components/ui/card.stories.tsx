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
				A white surface in light appearance and a forest-900 surface in dark.
			</CardBody>
		</Card>
	),
};

export const Inset: Story = {
	render: () => (
		<Card tone="inset" className="max-w-sm">
			<CardTitle>Inset</CardTitle>
			<CardBody>
				Uses the alternating Botanical band for quieter supporting content.
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
				A gold signal along the top edge marks the one card that needs emphasis.
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
