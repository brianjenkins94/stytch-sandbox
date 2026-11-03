#!/usr/bin/env bash
#
# Send a Stytch Email Magic Link via the backend API with curl.
#
# Credentials are read from the gitignored .env (Basic auth = PROJECT_ID:SECRET), so nothing
# secret is hard-coded here. Mirrors what the frontend does, but server-side.
#
# Usage (from Git Bash):
#   ./scripts/send-magic-link.sh                      # emails the default recipient
#   ./scripts/send-magic-link.sh someone@example.com  # override the recipient
#
# Reads from .env (or whatever's already exported in your shell):
#   STYTCH_PROJECT_ID   project-test-... / project-live-...
#   STYTCH_SECRET       secret-test-...  / secret-live-...
#   STYTCH_ENV          test | live   (default: test)
#
set -euo pipefail

# Resolve the project .env relative to this script (scripts/../.env), so the script is portable.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${STYTCH_ENV_FILE:-$SCRIPT_DIR/../.env}"

if [[ -f "$ENV_FILE" ]]; then
	# `set -a` auto-exports every var defined while sourcing; quotes are handled for us.
	set -a
	# shellcheck disable=SC1090
	source "$ENV_FILE"
	set +a
fi

# Fail early with a clear message if anything's missing.
: "${STYTCH_PROJECT_ID:?Set STYTCH_PROJECT_ID in .env (or export it)}"
: "${STYTCH_SECRET:?Set STYTCH_SECRET in .env (or export it)}"
STYTCH_ENV="${STYTCH_ENV:-test}"

case "$STYTCH_ENV" in
	test) HOST="https://test.stytch.com" ;;
	live) HOST="https://api.stytch.com" ;;
	*) echo "STYTCH_ENV must be 'test' or 'live' (got '$STYTCH_ENV')" >&2; exit 1 ;;
esac

EMAIL="${1:-brianjenkins94@gmail.com}"
REDIRECT_URL="http://localhost:5173/stytch-sandbox/"

echo "→ POST $HOST/v1/magic_links/email/login_or_create  ($STYTCH_ENV)  for $EMAIL"

# --user lets curl build the `Authorization: Basic <base64>` header from PROJECT_ID:SECRET,
# so we never base64-encode by hand. --write-out appends the HTTP status after the body.
curl --silent --show-error \
	--location "$HOST/v1/magic_links/email/login_or_create" \
	--user "$STYTCH_PROJECT_ID:$STYTCH_SECRET" \
	--header 'Content-Type: application/json' \
	--data "$(cat <<JSON
{
	"email": "$EMAIL",
	"login_magic_link_url": "$REDIRECT_URL",
	"signup_magic_link_url": "$REDIRECT_URL",
	"login_expiration_minutes": 30,
	"signup_expiration_minutes": 30
}
JSON
)" \
	--write-out $'\n\nHTTP %{http_code}\n'
