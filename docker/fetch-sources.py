#!/usr/bin/env python3
"""
fetch-sources.py — load openclaw configs (agents, skills, workspace files)
from external URLs or local fallbacks, then register openclaw agents.

Reads docker/sources.json (preferred) or docker/sources.yml (with PyYAML).
Override manifest path with OMOCW_SOURCES_MANIFEST env var.

Exit codes: 0 = all ok, 1 = partial (some fallbacks), 2 = fatal error.
"""
import json
import os
import subprocess
import sys
import urllib.request
import urllib.error

# Manifest search order
_DEFAULTS = [
    "/omocw/docker/sources.json",
    "/omocw/docker/sources.yml",
]
MANIFEST    = os.environ.get("OMOCW_SOURCES_MANIFEST") or next(
    (p for p in _DEFAULTS if os.path.isfile(p)), None
)
OC_HOME     = os.environ.get("OMOCW_OPENCLAW_HOME", "/home/node/.openclaw")
TIMEOUT     = int(os.environ.get("OMOCW_FETCH_TIMEOUT", "15"))
OC_REPO     = "/omocw"


# ---------------------------------------------------------------------------
# Manifest loading
# ---------------------------------------------------------------------------

def load_manifest(path):
    if not path or not os.path.isfile(path):
        return {}
    with open(path) as f:
        text = f.read()
    if path.endswith(".json"):
        data = json.loads(text)
        # Strip _comment fields
        return {k: v for k, v in data.items() if not k.startswith("_")}
    # YAML path — requires PyYAML
    try:
        import yaml
        return yaml.safe_load(text) or {}
    except ImportError:
        print("[sources] sources.yml found but PyYAML is not installed; "
              "rename to sources.json or install pyyaml", file=sys.stderr)
        return {}


# ---------------------------------------------------------------------------
# Fetch helpers
# ---------------------------------------------------------------------------

def fetch_url(url):
    req = urllib.request.Request(url, headers={"User-Agent": "oh-my-openclaw/1.0"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
        return resp.read().decode("utf-8")


def read_local(rel_path):
    if not rel_path:
        return None
    full = os.path.join(OC_REPO, rel_path)
    if os.path.isfile(full):
        with open(full) as f:
            return f.read()
    return None


def resolve(entry, label):
    """Try URL first, fall back to local.
    Returns (content, source_label, used_fallback)."""
    url   = (entry.get("url") or "").strip()
    local = (entry.get("local") or "").strip()

    if url:
        try:
            content = fetch_url(url)
            print(f"[sources] {label}: fetched from {url}")
            return content, f"url", False
        except Exception as e:
            print(f"[sources] {label}: fetch failed ({type(e).__name__}: {e}), trying local")

    if local:
        content = read_local(local)
        if content:
            fallback = bool(url)
            flag = " (fallback)" if fallback else ""
            print(f"[sources] {label}: using local {local}{flag}")
            return content, "local", fallback

    print(f"[sources] {label}: no content (url={url!r}, local={local!r}), skipping")
    return None, None, True


def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content)


# ---------------------------------------------------------------------------
# OpenClaw agent registration
# ---------------------------------------------------------------------------

def detect_model_id():
    if os.environ.get("OPENAI_API_KEY") and os.environ.get("OPENAI_BASE_URL"):
        m = os.environ.get("OPENAI_MODEL", "")
        if m:
            return f"custom-openai/{m}"
    if os.environ.get("ANTHROPIC_API_KEY") and os.environ.get("ANTHROPIC_BASE_URL"):
        m = os.environ.get("ANTHROPIC_MODEL", "")
        if m:
            return f"custom-anthropic/{m}"
    return ""


def oc_agents_add(name, workspace, model_id):
    cmd = ["openclaw", "agents", "add", name, "--workspace", workspace, "--non-interactive"]
    if model_id:
        cmd += ["--model", model_id]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        stderr = r.stderr.strip()
        if any(x in stderr.lower() for x in ("already exists", "duplicate", "exists")):
            print(f"[sources]   agent '{name}': already registered")
        else:
            print(f"[sources]   agent '{name}': register warning — {stderr[:200]}")
    else:
        print(f"[sources]   agent '{name}': registered  workspace={workspace}")


def oc_set_identity(name, workspace, emoji):
    if not emoji:
        return
    subprocess.run(
        ["openclaw", "agents", "set-identity", "--agent", name,
         "--workspace", workspace, "--emoji", emoji],
        capture_output=True, text=True
    )


# ---------------------------------------------------------------------------
# Section handlers
# ---------------------------------------------------------------------------

def handle_agents(entries, model_id):
    if not entries:
        return False
    partial = False
    print(f"[sources] agents: {len(entries)} entries")

    for entry in entries:
        name  = (entry.get("name") or "").strip()
        if not name:
            continue
        emoji = (entry.get("emoji") or "").strip()
        files = entry.get("files") or {}  # dict: filename → {url, local}

        workspace = os.path.join(OC_HOME, f"agents/{name}/agent")

        for filename, src in files.items():
            if not src:
                continue
            label   = f"agent:{name}/{filename}"
            content, _, was_fallback = resolve(src, label)
            if content is None:
                partial = True
                continue
            write_file(os.path.join(workspace, filename), content)
            if was_fallback:
                partial = True

        oc_agents_add(name, workspace, model_id)
        oc_set_identity(name, workspace, emoji)

    return partial


def handle_skills(entries):
    if not entries:
        return False
    partial   = False
    skills_dir = os.path.join(OC_HOME, "skills")
    os.makedirs(skills_dir, exist_ok=True)
    print(f"[sources] skills: {len(entries)} entries")

    for entry in entries:
        name  = (entry.get("name") or "").strip()
        if not name:
            continue
        label   = f"skill:{name}"
        content, _, was_fallback = resolve(entry, label)
        if content is None:
            partial = True
            continue
        write_file(os.path.join(skills_dir, name), content)
        if was_fallback:
            partial = True

    return partial


def handle_workspace(entries):
    if not entries:
        return False
    partial = False
    ws_dir  = os.path.join(OC_HOME, "workspace")
    os.makedirs(ws_dir, exist_ok=True)
    print(f"[sources] workspace: {len(entries)} entries")

    for entry in entries:
        filename = (entry.get("file") or "").strip()
        if not filename:
            continue
        label   = f"workspace:{filename}"
        content, _, was_fallback = resolve(entry, label)
        if content is None:
            partial = True
            continue
        write_file(os.path.join(ws_dir, filename), content)
        if was_fallback:
            partial = True

    return partial


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def load_subproject_manifest():
    """Load agents/skills from subprojects/manifest.yml if present."""
    sub_manifest = os.path.join(OC_REPO, "subprojects", "manifest.yml")
    if not os.path.isfile(sub_manifest):
        return [], []

    try:
        import yaml
    except ImportError:
        print("[sources] subprojects/manifest.yml found but PyYAML not installed, skipping")
        return [], []

    with open(sub_manifest) as f:
        data = yaml.safe_load(f) or {}

    agents = []
    skills = []
    for sp in data.get("subprojects", []):
        if not sp.get("enabled", True):
            continue
        name = sp.get("name", "")
        sp_dir = os.path.join(OC_REPO, "subprojects", name)
        if not os.path.isdir(sp_dir):
            continue

        for agent in sp.get("agents", []):
            agents.append({
                "name": agent.get("as", ""),
                "emoji": "",
                "files": {
                    "BOOTSTRAP.md": {
                        "local": os.path.join("subprojects", name, agent["path"])
                    }
                }
            })
        for skill in sp.get("skills", []):
            skills.append({
                "name": skill.get("as", ""),
                "local": os.path.join("subprojects", name, skill["path"])
            })

    return agents, skills


def main():
    if not MANIFEST:
        print("[sources] no manifest found (sources.json / sources.yml), skipping")
        return 0

    print(f"[sources] manifest: {MANIFEST}")
    manifest = load_manifest(MANIFEST)
    if not manifest:
        print("[sources] manifest empty, nothing to do")
        return 0

    model_id = detect_model_id()
    partial  = False

    all_agents = list(manifest.get("agents") or [])
    all_skills = list(manifest.get("skills") or [])

    # Merge subproject agents/skills if subprojects are cloned
    sub_agents, sub_skills = load_subproject_manifest()
    if sub_agents or sub_skills:
        print(f"[sources] subprojects: {len(sub_agents)} agents, {len(sub_skills)} skills")
        all_agents.extend(sub_agents)
        all_skills.extend(sub_skills)

    partial |= handle_agents(all_agents, model_id)
    partial |= handle_skills(all_skills)
    partial |= handle_workspace(manifest.get("workspace") or [])

    return 1 if partial else 0


if __name__ == "__main__":
    sys.exit(main())
