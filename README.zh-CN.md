# oh-my-openclaw

精选 [ClawHub](https://clawhub.ai) 技能集，为 [OpenClaw](https://openclaw.ai) 打造 Claude Code 级别体验，支持 GitHub Actions + Telegram 测试。

## 安装

**OpenClaw 插件安装（推荐）：**
```bash
openclaw plugins install @m4d3bug/oh-my-openclaw
```

**或一键脚本：**
```bash
curl -fsSL https://raw.githubusercontent.com/m4d3bug/oh-my-openclaw/master/install.sh | bash
```

## 包含技能 (44)

### 安全

| 技能 | 版本 | 安装量 | OpenClaw 扫描 | 功能 |
|------|------|--------|--------------|------|
| [skill-vetter](https://clawhub.ai/spclaudehome/skill-vetter) | 1.0.0 | 2,000 | ✅ 安全 | 安装前安全审查 |
| [agent-sentinel](https://clawhub.ai/skills/agent-sentinel) | 0.1.1 | 3 | ✅ 安全 | 预算限制、速率控制 |
| [arc-skill-scanner](https://clawskills.sh/skills/trypto1019-arc-skill-scanner) | 1.4.0 | 0 | ✅ 安全 | 漏洞自动扫描 |

### 记忆与持久化

| 技能 | 版本 | 安装量 | OpenClaw 扫描 | 功能 |
|------|------|--------|--------------|------|
| [self-improving-agent](https://clawhub.ai/pskoett/self-improving-agent) | 3.0.4 | 3,700 | ✅ 安全 | 跨会话记录错误、纠正和学习 |
| [agent-memory](https://clawhub.ai/skills/agent-memory) | 1.0.0 | 262 | ✅ 安全 | SQLite 持久记忆 — 存储、召回、追踪实体 |
| [ontology](https://clawhub.ai/oswalpalash/ontology) | 1.0.4 | 388 | ✅ 安全 | 类型化知识图谱 |
| [arc-wake-state](https://clawskills.sh/skills/trypto1019-arc-wake-state) | 1.0.0 | 0 | ✅ 安全 | 崩溃/重启后自动恢复状态 |
| [agent-wal](https://clawskills.sh/skills/bowen31337-agent-wal) | 1.0.1 | 5 | ✅ 安全 | Write-Ahead Log — 状态变更原子性保障 |

### Agent 行为

| 技能 | 版本 | 安装量 | OpenClaw 扫描 | 功能 |
|------|------|--------|--------------|------|
| [proactivity](https://clawhub.ai/ivangdavila/proactivity) | 1.0.1 | 18 | ✅ 安全 | 主动预判需求，持续改进 |
| [self-reflection](https://clawhub.ai/hopyky/self-reflection) | 1.1.1 | 106 | ✅ 安全 | 结构化反思，持续自我改进 |
| [agent-team-orchestration](https://clawhub.ai/arminnaimi/agent-team-orchestration) | 1.0.0 | 125 | ✅ 安全 | 多 Agent 团队协调 — 角色、交接、审查 |
| [reflection](https://clawhub.ai/ivangdavila/reflection) | 1.1.0 | 23 | ✅ 安全 | 回复前自我审查，减少修改轮次 |

### 会话管理

| 技能 | 版本 | 安装量 | OpenClaw 扫描 | 功能 |
|------|------|--------|--------------|------|
| [smart-context](https://clawskills.sh/skills/joe3112-smart-context) | 1.0.0 | 0 | ✅ 安全 | Token 高效上下文裁剪、响应控制 |
| [summarize](https://clawhub.ai/steipete/summarize) | 1.0.0 | 3,800 | ✅ 安全 | 总结对话、代码变更和会话 |
| [daily-digest](https://clawhub.ai/pmaeter/daily-digest) | 1.0.0 | 68 | ✅ 安全 | 从记忆文件生成每日摘要 |

### 代码智能

| 技能 | 版本 | 安装量 | OpenClaw 扫描 | 功能 |
|------|------|--------|--------------|------|
| [github](https://clawhub.ai/steipete/github) | 1.0.0 | 2,863 | ✅ 安全 | Git 工作流 — PR、Issue、CI（通过 gh CLI） |
| [test-runner](https://clawhub.ai/cmanfre7/test-runner) | 1.0.0 | 71 | ✅ 安全 | 运行测试 — Jest、pytest、Playwright、XCTest |
| [planning-with-files](https://clawhub.ai/OthmanAdi/planning-with-files) | 2.22.0 | 70 | ⚠️ 可疑 | 任务规划 — task_plan.md / findings.md / progress.md |
| [docsync](https://clawskills.sh/skills/suhteevah-docsync) | 1.0.1 | 0 | ✅ 安全 | 从代码自动生成文档，检测文档漂移 |
| [simplify-and-harden](https://clawhub.ai/pskoett/simplify-and-harden) | 1.0.1 | 6 | ✅ 安全 | 代码完成后自审 — 简化、加固、微文档 |
| [env-setup](https://clawhub.ai/Fratua/env-setup) | 1.0.0 | 2 | ✅ 安全 | 扫描环境变量，生成 .env.example |

### DevOps

| 技能 | 版本 | 安装量 | OpenClaw 扫描 | 功能 |
|------|------|--------|--------------|------|
| [cron-mastery](https://clawhub.ai/i-mw/cron-mastery) | 1.0.3 | 103 | ✅ 安全 | 定时任务调度与系统维护 |
| [docker-essentials](https://clawhub.ai/Arnarsson/docker-essentials) | 1.0.0 | 209 | ✅ 安全 | Docker 命令、容器管理、调试 |
| [cicd-pipeline](https://clawskills.sh/skills/gitgoodordietrying-cicd-pipeline) | 1.0.0 | 24 | ✅ 安全 | 管理 GitHub Actions CI/CD 流水线 |

### 上下文与搜索

| 技能 | 版本 | 安装量 | OpenClaw 扫描 | 功能 |
|------|------|--------|--------------|------|
| [multi-search-engine](https://clawhub.ai/gpyAngyoujun/multi-search-engine) | 2.0.1 | 796 | ✅ 安全 | 17 个搜索引擎（8 国内 + 9 国际），无需 API Key |
| [agent-reach](https://clawhub.ai/Panniantong/agent-reach) | 1.1.0 | 246 | ⚠️ 可疑 | 阅读 14+ 平台（Twitter、Reddit、YouTube、B站等） |
| [agent-browser](https://clawhub.ai/TheSethRose/agent-browser) | 0.2.0 | 2,588 | ✅ 安全 | 无头浏览器 — 导航、点击、输入、截图、录屏 |
| [cli-anything](https://github.com/HKUDS/CLI-Anything) | 2026-03-17 | — | GitHub | 自然语言转 CLI 命令 |
| [clawddocs](https://clawskills.sh/skills/nicholasspisak-clawddocs) | 1.2.2 | 413 | ✅ 安全 | OpenClaw 文档助手 |
| [humanizer](https://clawhub.ai/biostartechnology/humanizer) | 1.0.0 | 760 | ✅ 安全 | 去除 AI 写作痕迹，让文本更自然 |

### 创意与规划

| 技能 | 版本 | 安装量 | OpenClaw 扫描 | 功能 |
|------|------|--------|--------------|------|
| [brainstorming](https://clawhub.ai/zlc000190/brainstorming) | 0.1.0 | 88 | ✅ 安全 | 实现前探索意图、需求和设计 |
| [writing-plans](https://clawhub.ai/zlc000190/writing-plans) | 0.1.0 | 43 | ✅ 安全 | 从规格生成多步实施计划 |
| [copywriting](https://clawhub.ai/JK-0001/copywriting) | 0.1.0 | 124 | ✅ 安全 | 营销文案 — AIDA/PAS/FAB、标题、CTA |
| [content-strategy](https://clawhub.ai/JK-0001/content-strategy) | 0.1.0 | 45 | ✅ 安全 | 内容营销策略、日历、分发、指标 |

### 自主执行

| 技能 | 版本 | 安装量 | OpenClaw 扫描 | 功能 |
|------|------|--------|--------------|------|
| [better-ralph](https://clawskills.sh/skills/runeweaverstudios-better-ralph) | 1.0.0 | — | ✅ 安全 | PRD 驱动的自主编码迭代 |
| [agent-weave](https://clawskills.sh/skills/gl813788-byte-agent-weave) | 1.0.0 | — | ✅ 安全 | Master-Worker 并行任务执行集群 |
| [forge](https://clawskills.sh/skills/ikennaokpala-forge) | 1.0.0 | — | ✅ 安全 | 自主 QA 蜂群 — E2E 测试、自愈修复循环 |
| [agent-autonomy-kit](https://clawhub.ai/ryancampbell/agent-autonomy-kit) | 1.0.0 | 121 | ✅ 安全 | 不等待提示，持续自主工作 |
| [codebase-documenter](https://clawhub.ai/Veeramanikandanr48/codebase-documenter) | 0.1.0 | 5 | ✅ 安全 | 从代码库生成 README、架构文档、API 文档 |
| [debug-pro](https://clawhub.ai/cmanfre7/debug-pro) | 1.0.0 | 114 | ✅ 安全 | 7 步调试协议，多语言支持 |

> skill-vetter 最先安装，用于审计后续所有技能。

## 本地使用

### 1. 安装 OpenClaw + 插件

```bash
npm install -g openclaw
openclaw plugins install @m4d3bug/oh-my-openclaw
```

### 2. 配置模型 + Telegram

选择 **一个** 模型后端：

**OpenAI 兼容**（如阿里云 DashScope）：
```bash
openclaw config set models.providers.custom-openai.baseUrl "https://coding.dashscope.aliyuncs.com/v1"
openclaw config set models.providers.custom-openai.apiKey "你的密钥"
openclaw config set models.providers.custom-openai.api "openai-completions"
openclaw config set agents.defaults.model.primary "custom-openai/MiniMax-M2.5"
```

**Anthropic 兼容**（如硅基流动 SiliconFlow）：
```bash
openclaw config set models.providers.custom-anthropic.baseUrl "https://api.siliconflow.cn/v1"
openclaw config set models.providers.custom-anthropic.apiKey "你的密钥"
openclaw config set models.providers.custom-anthropic.api "anthropic-messages"
openclaw config set agents.defaults.model.primary "custom-anthropic/Pro/MiniMaxAI/MiniMax-M2.5"
```

**Telegram**（从 [@BotFather](https://t.me/BotFather) 获取 token）：
```bash
openclaw config set channels.telegram.enabled true
openclaw config set channels.telegram.dmPolicy open
openclaw config set channels.telegram.allowFrom '["*"]'   # 跳过配对，任何人都能聊
# 或限制为你自己的 Telegram ID：
# openclaw config set channels.telegram.allowFrom '["你的TELEGRAM_ID"]'
```

> 本地和 GitHub Actions 都使用 `dmPolicy: open` + `allowFrom: ["*"]` 跳过设备配对。生产环境建议改为你的 Telegram 用户 ID。

### 3. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 填入你的值
```

加载变量：

```bash
# 方式 A：一次性导出所有变量
export $(grep -v '^#' .env | xargs)

# 方式 B：单次命令附带变量
env $(grep -v '^#' .env | xargs) openclaw gateway run --verbose
```

### 4. 启用完整工具 + 启动

```bash
openclaw config set tools.profile full
openclaw gateway run --verbose
```

在 Telegram 上和你的 bot 聊天。技能从插件自动加载。

### Docker（本地）

```bash
cp .env.example .env
# 编辑 .env 填入你的值

docker run -d --name omocw \
  --env-file .env \
  -v "$PWD:/omocw:ro" \
  ghcr.io/openclaw/openclaw \
  bash /omocw/docker/entrypoint.sh
```

查看日志：`docker logs -f omocw`
停止：`docker rm -f omocw`

---

## GitHub Actions + Telegram

1. **Fork** 本仓库
2. **设置 Secrets**（Settings > Secrets > Actions）：

   | Secret | 获取方式 |
   |--------|---------|
   | `TELEGRAM_BOT_TOKEN` | [@BotFather](https://t.me/BotFather) > `/newbot` |

   选择 **一个** 模型后端（或两个都设 — OpenAI 优先）：

   **OpenAI 兼容**（如阿里云 DashScope）：
   | Secret | 示例 |
   |--------|-----|
   | `OPENAI_API_KEY` | 你的密钥 |
   | `OPENAI_BASE_URL` | `https://coding.dashscope.aliyuncs.com/v1` |
   | `OPENAI_MODEL` | `MiniMax-M2.5` |

   **Anthropic 兼容**（如硅基流动）：
   | Secret | 示例 |
   |--------|-----|
   | `ANTHROPIC_API_KEY` | 你的密钥 |
   | `ANTHROPIC_BASE_URL` | `https://api.siliconflow.cn/v1` |
   | `ANTHROPIC_MODEL` | `Pro/MiniMaxAI/MiniMax-M2.5` |

3. **Push** 任意 commit 或手动运行 workflow（Actions > Test Drive > Run workflow）
4. 在 **Telegram** 上和 bot 聊天

新 run 会自动取消前一个。

## 默认配置

```
tools.profile = full
```

## 管理技能

```bash
clawhub install <slug>       # 安装技能
clawhub search "关键词"       # 搜索 ClawHub
clawhub list                 # 列出已安装
clawhub update --all         # 更新全部
```

## 工作原理

```
Push / 手动触发
  └─ GitHub Actions
       ├─ docker pull ghcr.io/openclaw/openclaw
       ├─ clawhub install（从 skills.txt，失败自动切换 skillhub）
       ├─ docker run ... bash /omocw/docker/entrypoint.sh
       │    ├─ gen-config.py         → ~/.openclaw/openclaw.json
       │    ├─ 复制 skills/*/SKILL.md → ~/.openclaw/skills/
       │    ├─ 注册 20 个专业 agents
       │    ├─ 后台安装依赖（yt-dlp、pyright 等）
       │    ├─ openclaw config set tools.profile full
       │    └─ openclaw gateway run（Telegram 轮询）
       └─ 保持在线 350 分钟，然后清理
```

## 许可证

MIT
