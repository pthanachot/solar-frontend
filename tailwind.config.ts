import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				title: "#2F2F2F",
				subtitle: "#858585",
				"input-border": "#D9D9D9",
				"input-background": "#FFFFFF",
				"input-placeholder": "#BCBCBC",
				border: "#D9D9D9",
				"sidebar-hover": "#E0E2FF",
				"sidebar-active": "#5726EB",
				"table-border": "#D6D6D6",
				"bg-g-top": "#DADCFF",
				"bg-g-bottom": "#EBECFF",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
