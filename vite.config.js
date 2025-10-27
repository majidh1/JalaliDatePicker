import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => ({
	build: {
		emptyOutDir: false,
		lib: {
			entry: resolve(__dirname, "src/index.js"),
			name: "JalaliDatePicker",
			formats: ["iife"], // Only UMD for the main output
			fileName: () => `jalalidatepicker${mode === "minified" ? ".min" : ""}.js`
		},
		rollupOptions: {
			output: {
				assetFileNames: (assetInfo) => {
					if (assetInfo.name.endsWith(".css")) {
						return `jalalidatepicker${mode === "minified" ? ".min" : ""}.css`;
					}
					return assetInfo.name;
				}
			}
		},
		minify: mode === "minified" // Disable Vite's default minification
	},
	css: {
		preprocessorOptions: {
			scss: {
				// additionalData: `@import "src/styles/variables.scss";` // if you have global scss variables
			}
		}
	}
}));
