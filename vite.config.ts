import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	plugins: [
		viteReact({
			// https://react.dev/learn/react-compiler
			babel: {
				plugins: [
					[
						"babel-plugin-react-compiler",
						{
							target: "19",
						},
					],
				],
			},
		}),
		tailwindcss(),
	],
});
