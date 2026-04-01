# Full-featured OpenClaw image (official GitHub Container Registry)
FROM ghcr.io/openclaw/openclaw AS base

WORKDIR /omocw

# Install Node.js 22+ for oh-my-openclaw scripts
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY package.json ./
COPY scripts/ ./scripts/
COPY agents/ ./agents/
COPY skills/ ./skills/
COPY config/ ./config/
COPY .openclaw/ ./.openclaw/

# Install oh-my-openclaw dependencies (includes @goplus/agentguard)
RUN npm install

# Validate all skills through AgentGuard before baking into image
RUN node scripts/validate.js --all --strict

# Mount point for user's workspace
VOLUME ["/workspace"]

# Mount point for user config (read-only, never modified)
VOLUME ["/host-config:ro"]

WORKDIR /workspace

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
