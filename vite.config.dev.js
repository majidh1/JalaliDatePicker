import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
	build: {
		emptyOutDir: false, // Keep this for consistency, though not strictly needed for dev
		minify: false
	},
	css: {
		preprocessorOptions: {
			scss: {
				// additionalData: `@import "src/styles/variables";` // if you have global scss variables
			}
		}
	},
	server: {
		open: "/test/index.html" // Open the test HTML file
	}
});
