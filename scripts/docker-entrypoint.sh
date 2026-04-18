#!/bin/sh
set -eu

if [ -z "${REGISTRY_BASE_URL:-}" ]; then
  if [ -n "${COOLIFY_URL:-}" ]; then
    export REGISTRY_BASE_URL="${COOLIFY_URL}"
  elif [ -n "${NEXT_PUBLIC_SITE_URL:-}" ]; then
    export REGISTRY_BASE_URL="${NEXT_PUBLIC_SITE_URL}"
  elif [ -n "${SITE_URL:-}" ]; then
    export REGISTRY_BASE_URL="${SITE_URL}"
  elif [ -n "${COOLIFY_FQDN:-}" ]; then
    export REGISTRY_BASE_URL="https://${COOLIFY_FQDN}"
  fi
fi

if [ -n "${REGISTRY_BASE_URL:-}" ]; then
  export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-$REGISTRY_BASE_URL}"
  export NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL:-$REGISTRY_BASE_URL}"
  export SITE_URL="${SITE_URL:-$REGISTRY_BASE_URL}"
fi

echo "Runtime registry base URL: ${REGISTRY_BASE_URL:-<unset>}"

npm run registry:build

exec npm run start
