/// <reference types="vite/client" />

interface ImportMetaEnv {
	// The Stytch *public* token. Public by design — safe to ship in the client bundle.
	readonly VITE_STYTCH_PUBLIC_TOKEN: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
