import { defineConfig } from "vite";

// GitHub Pages serves a *project* site under /<repo>/, so every asset URL has to resolve against
// that sub-path rather than the domain root. `import.meta.env.BASE_URL` picks this up at runtime
// too (used when fetching secret.txt), so the same build works locally and on Pages.
export default defineConfig({
	"base": "/stytch-sandbox/"
});
