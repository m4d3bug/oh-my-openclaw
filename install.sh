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

# 3. Install ClawHub skills from lock file
echo "[omocw] Installing ClawHub skills..."
mkdir -p "$SKILLS_DIR"
cd "$INSTALL_DIR"
if [ -f ".clawhub/lock.json" ]; then
  for slug in $(node -e "const l=require('./.clawhub/lock.json');Object.keys(l.skills||{}).forEach(s=>console.log(s))"); do
    if [ ! -d "skills/$slug" ]; then
      echo "[omocw]   Installing $slug..."
      clawhub install "$slug" --force 2>/dev/null || true
    else
      echo "[omocw]   $slug already installed"
    fi
    # Copy to OpenClaw skills dir
    if [ -f "skills/$slug/SKILL.md" ]; then
      cp -r "skills/$slug" "$SKILLS_DIR/$slug"
      echo "[omocw]   -> $SKILLS_DIR/$slug"
    fi
  done
fi

# 4. Create workspace learnings dir
mkdir -p "$HOME/.openclaw/workspace/.learnings"

echo ""
echo "[omocw] Done!"
echo ""
echo "  Installed to: $INSTALL_DIR"
echo "  Skills in:    $SKILLS_DIR"
echo ""
echo "  Installed skills:"
clawhub list --workdir "$INSTALL_DIR" 2>/dev/null || true
echo ""
echo "  To add more skills:  clawhub install <slug>"
echo "  To use with GitHub Actions: see $INSTALL_DIR/.github/workflows/"
echo ""
