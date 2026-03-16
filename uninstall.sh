#!/usr/bin/env bash
# oh-my-openclaw uninstaller
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[uninstall] Stopping containers..."
docker compose -f "$ROOT/docker/docker-compose.yml" down --remove-orphans 2>/dev/null || true

echo "[uninstall] Removing Docker images..."
docker rmi oh-my-openclaw:full oh-my-openclaw:alpine 2>/dev/null || true

echo "[uninstall] Unlinking omc CLI..."
npm unlink --prefix "$ROOT" 2>/dev/null || true

echo "[uninstall] Done. Host openclaw was never touched."
