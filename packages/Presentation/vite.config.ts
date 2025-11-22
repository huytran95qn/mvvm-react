import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [
					["@babel/plugin-proposal-decorators", { legacy: true }]
				]
			}
		})
	],
	resolve: {
		alias: {
			"@Core": path.resolve(__dirname, "../Core/src"),
			"@Repositories": path.resolve(__dirname, "../Infrastructure/src/Repositories"),
			"@Entities": path.resolve(__dirname, "../Domain/Entities"),
			"@Application": path.resolve(__dirname, "../Application/src")
		}
	},
	server: {
		port: 3100,
		fs: {
			// Let Vite watch files from the workspace root so edits in the library hot-reload here.
			allow: [path.resolve(__dirname, "../../")]
		}
	},
	build: {
		outDir: "dist",
	}
})
