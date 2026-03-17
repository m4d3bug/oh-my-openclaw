#!/usr/bin/env bash
# oh-my-openclaw — one-line installer
# curl -fsSL https://raw.githubusercontent.com/m4d3bug/oh-my-openclaw/master/install.sh | bash
set -e

REPO="m4d3bug/oh-my-openclaw"
INSTALL_DIR="${OMOCW_HOME:-$HOME/.oh-my-openclaw}"
SKILLS_DIR="$HOME/.openclaw/skills"

echo ""
echo "  oh-my-openclaw (omocw) installer"
echo "  ================================="
echo ""

# 1. Clone or update repo
if [ -d "$INSTALL_DIR/.git" ]; then
  echo "[omocw] Updating existing installation..."
  git -C "$INSTALL_DIR" pull --ff-only origin master 2>/dev/null || true
else
  echo "[omocw] Cloning oh-my-openclaw..."
  git clone --depth 1 https://github.com/$REPO.git "$INSTALL_DIR"
fi

# 2. Install clawhub if not present
if ! command -v clawhub &>/dev/null; then
  echo "[omocw] Installing clawhub CLI..."
  npm install -g clawhub 2>/dev/null || sudo npm install -g clawhub
fi

# 3. Copy bundled skills to OpenClaw skills dir
echo "[omocw] Installing skills..."
mkdir -p "$SKILLS_DIR"
count=0
for skill_dir in "$INSTALL_DIR"/skills/*/; do
  [ -f "$skill_dir/SKILL.md" ] || continue
  slug=$(basename "$skill_dir")
  cp -r "$skill_dir" "$SKILLS_DIR/$slug"
  echo "[omocw]   -> $slug"
  count=$((count + 1))
done
echo "[omocw] $count skill(s) installed"

# 4. Create workspace learnings dir
mkdir -p "$HOME/.openclaw/workspace/.learnings"

echo ""
echo "[omocw] Done!"
echo ""
echo "  Installed to: $INSTALL_DIR"
echo "  Skills in:    $SKILLS_DIR"
echo "  Total skills: $count"
echo ""
echo "  To add more skills:  clawhub install <slug>"
echo "  To use with GitHub Actions: see $INSTALL_DIR/.github/workflows/"
echo ""
