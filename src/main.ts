import { stytch } from "./stytch";
import "./style.css";

// The secret lives in public/ and is served at the site base (e.g. /stytch-sandbox/secret.txt).
const SECRET_URL = `${import.meta.env.BASE_URL}secret.txt`;
const SESSION_DURATION_MINUTES = 60;

function byId<T extends HTMLElement>(id: string): T {
	const element = document.getElementById(id);

	if (element === null) {
		throw new Error(`Missing element #${id}`);
	}

	return element as T;
}

const els = {
	"status": byId("status"),
	"loading": byId("loading"),
	"loggedOut": byId("logged-out"),
	"loggedIn": byId("logged-in"),
	"loginForm": byId<HTMLFormElement>("login-form"),
	"email": byId<HTMLInputElement>("email"),
	"sentMessage": byId("sent-msg"),
	"userEmail": byId("user-email"),
	"secretBox": byId("secret-box"),
	"logout": byId<HTMLButtonElement>("logout")
};

function setStatus(message: string, kind: "info" | "error" = "info"): void {
	els.status.textContent = message;
	els.status.className = `status ${kind}`;
	els.status.hidden = false;
}

// Coming back from a magic link, the one-time token rides in on the query string. Exchange it for
// a session, then scrub it from the URL so a refresh can't try to reuse a spent token.
async function completeMagicLink(): Promise<void> {
	const params = new URLSearchParams(window.location.search);
	const token = params.get("token");

	if (token === null || params.get("stytch_token_type") !== "magic_links") {
		return;
	}

	try {
		await stytch.magicLinks.authenticate(token, { "session_duration_minutes": SESSION_DURATION_MINUTES });
	} catch (error) {
		setStatus(`Magic link authentication failed: ${String(error)}`, "error");
	} finally {
		window.history.replaceState({}, document.title, window.location.pathname);
	}
}

// The "gate": the secret is only fetched once Stytch reports a live session. NOTE this hides the
// secret in the UI — it does not protect the file, which is publicly reachable. See the README.
async function loadSecret(): Promise<void> {
	els.secretBox.textContent = "Loading secret…";

	try {
		const response = await fetch(SECRET_URL, { "cache": "no-store" });

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		els.secretBox.textContent = await response.text();
	} catch (error) {
		els.secretBox.textContent = `Could not load secret: ${String(error)}`;
	}
}

function render(): void {
	els.loading.hidden = true;

	const signedIn = stytch.session.getSync() !== null;

	els.loggedIn.hidden = !signedIn;
	els.loggedOut.hidden = signedIn;

	if (signedIn) {
		const user = stytch.user.getSync();
		els.userEmail.textContent = user?.emails[0]?.email ?? "unknown";
		void loadSecret();
	}
}

els.loginForm.addEventListener("submit", async (event) => {
	event.preventDefault();
	els.status.hidden = true;

	const email = els.email.value.trim();
	const button = els.loginForm.querySelector("button");

	if (button !== null) {
		button.disabled = true;
		button.textContent = "Sending…";
	}

	try {
		// Stytch emails the link; clicking it returns the user to this same URL with a token.
		const redirectUrl = window.location.origin + window.location.pathname;

		await stytch.magicLinks.email.loginOrCreate(email, {
			"login_magic_link_url": redirectUrl,
			"signup_magic_link_url": redirectUrl
		});

		els.sentMessage.hidden = false;
	} catch (error) {
		setStatus(`Could not send link: ${String(error)}`, "error");
	} finally {
		if (button !== null) {
			button.disabled = false;
			button.textContent = "Send magic link";
		}
	}
});

els.logout.addEventListener("click", async () => {
	await stytch.session.revoke().catch(() => undefined);
	render();
});

await completeMagicLink();
render();
