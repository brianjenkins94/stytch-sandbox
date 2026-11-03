import { StytchHeadlessClient } from "@stytch/vanilla-js/headless";

// The headless client is the whole SDK minus Stytch's prebuilt UI components — we drive the flow
// with our own markup, so this keeps the bundle small. The *public* token is injected at build
// time from a Vite env var (see .env.example); it's public by design, so baking it into the static
// bundle is expected.
const publicToken = import.meta.env.VITE_STYTCH_PUBLIC_TOKEN;

if (!publicToken) {
	throw new Error(
		"Missing VITE_STYTCH_PUBLIC_TOKEN. Copy .env.example to .env and set your Stytch public token."
	);
}

export const stytch = new StytchHeadlessClient(publicToken);
