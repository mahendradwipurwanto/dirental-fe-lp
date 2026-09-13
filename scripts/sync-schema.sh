#!/usr/bin/env bash
# Vendors the storefront site-config schema from rental-api (source of truth).
# Usage: pnpm sync:schema            (copies from ../rental-api)
#        pnpm sync:schema --check    (fails if the vendored copy drifted)
set -euo pipefail
SRC="${SITE_SCHEMA_SRC:-../rental-api/src/modules/site-config/site-schema.ts}"
DST="src/lib/site-schema.ts"
if [[ "${1:-}" == "--check" ]]; then
  if ! cmp -s "$SRC" "$DST"; then echo "site-schema.ts is out of date. Run: pnpm sync:schema" >&2; exit 1; fi
  echo "site-schema.ts is in sync."; exit 0
fi
cp "$SRC" "$DST"; echo "Copied $SRC -> $DST"
