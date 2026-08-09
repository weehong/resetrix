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
		// The `dark` variant is defined in app/globals.css as
		// `&:where(html.dark, html.dark *)`, so light is the *absence* of a class,
		// not a `.light` class. Mapping light to "" is what makes the switcher
		// agree with the CSS. The site is light-only today (ADR 0011) — the dark
		// entry is here so the switcher keeps working the moment a dark block is
		// added to app/tokens.css.
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
