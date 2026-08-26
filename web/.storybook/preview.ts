import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/nextjs";

// Next.js Tailwind entry. Adjust if you move your global styles.
import "../app/globals.css";

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
	},

	decorators: [
		// Match the production class strategy so both Botanical appearances can be
		// reviewed against the same semantic component tokens.
		withThemeByClassName({
			themes: {
				light: "",
				dark: "dark",
			},
			defaultTheme: "light",
		}),
	],

	tags: ["autodocs"],
};

export default preview;
