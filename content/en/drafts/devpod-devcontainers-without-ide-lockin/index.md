---
title: "DevPod: Using Devcontainers Without the IDE Lock-in"
date: 2025-11-01
draft: true
description: "A terminal-first developer's journey with DevPod - SSH-based workflow, worktree management, and the honest reality of ditching VSCode/Cursor for devcontainers."
tags:
  - devcontainers
  - terminal
  - workflow
  - docker
  - neovim
  - devpod
  - git-worktrees
---

## The Problem

Our Rails team uses devcontainers. They're great for consistency - everyone gets the same Ruby version, Postgres, Chrome for system tests, the works. New developers run one command and they're productive.

But there's a catch: devcontainers basically require VSCode or Cursor. Sure, you can technically use them without an IDE, but the tooling assumes you want a GUI editor. For a terminal-first developer (nvim, zellij, Claude Code CLI), this is... awkward.

I've been using Cursor for devcontainers, but it felt wrong. I didn't want the IDE - I just wanted to SSH into a container and use my tools. DevPod promised exactly that.

## What is DevPod?

[DevPod](https://devpod.sh/) is an open-source tool that treats devcontainers as remote machines you SSH into. No IDE required. It reads your `.devcontainer` configuration, spins up the containers, and gives you SSH access.

The workflow:
1. `devpod up` - starts your devcontainer
2. `ssh workspace-name.devpod` - SSH in
3. Use your terminal tools (nvim, zellij, whatever)

Simple concept. But does it actually work for daily development?

### Why Not the Official Dev Containers CLI?

The [official `@devcontainers/cli`](https://github.com/devcontainers/cli) exists, but it's designed for VS Code integration and CI/CD. For terminal-first development, it's awkward:

```bash
# Official CLI workflow
devcontainer up --workspace-folder .
devcontainer exec --workspace-folder . bash
# Each command needs devcontainer exec...
```

**Issues:**
- No SSH support - must wrap every command in `devcontainer exec`
- No persistent shell - each exec is a new process
- Verbose - always specify `--workspace-folder`
- Not built for daily terminal use

**DevPod difference:**
- SSH-based - standard SSH workflow with persistent sessions
- Terminal multiplexers (zellij/tmux) work naturally
- Feels like SSH to a remote dev machine, not Docker exec wrapper

Both read the same `.devcontainer.json` format. DevPod just prioritizes terminal workflow.

## Setting It Up

### Installation

```bash
# Install DevPod
brew install devpod

# Set default provider to Docker
devpod provider use docker

# Configure context options
devpod context set-options -o DOTFILES_URL=https://github.com/yourusername/dotfiles
devpod context set-options -o EXIT_AFTER_TIMEOUT=false
```

### The Workspace Inference Problem

DevPod has a quirk: `devpod up .` doesn't remember your workspace. Every time you run it from your project directory, it tries to create a NEW workspace.

**Solution:** Create a wrapper script that remembers the workspace ID.

```bash
#!/bin/bash
# bin/dpod - DevPod wrapper

WORKSPACE_ID="${DEVPOD_WORKSPACE_ID:-my-app}"
IDE="${DEVPOD_IDE:-none}"

case "${1:-up}" in
  up)
    if devpod list 2>/dev/null | grep -q "^$WORKSPACE_ID"; then
      devpod up "$WORKSPACE_ID"
    else
      devpod up . --id "$WORKSPACE_ID" --ide "$IDE"
    fi
    ;;
  ssh)
    ssh "$WORKSPACE_ID.devpod"
    ;;
  stop)
    devpod stop "$WORKSPACE_ID"
    ;;
  # ... other commands
esac
```

Now `bin/dpod up` just works.

### Port Mapping & Config Mounts (Cross-Platform)

For worktree workflows with multiple branches running simultaneously, use port ranges (works on Linux, macOS, Windows):

```yaml
# .devcontainer/compose.devpod.yaml
services:
  rails-app:
    # Port ranges support main + up to 9 worktrees
    ports:
      - "3000-3009:3000-3009"   # Rails (main: 3000, worktrees: 3001-3009)
      - "3036-3045:3036-3045"   # Vite  (main: 3036, worktrees: 3037-3045)
    volumes:
      - ~/.ssh:/home/vscode/.ssh
      - ~/.claude/CLAUDE.md:/home/vscode/.claude/CLAUDE.md
      - ~/.claude/settings.json:/home/vscode/.claude/settings.json
      - ~/agent-os:/home/vscode/agent-os
      # Centralized configs shared across all DevPod projects
      - ../../devpod-data/nvim:/home/vscode/.config/nvim
      - ../../devpod-data/zellij:/home/vscode/.config/zellij
  postgres-db:
    ports:
      - "5432:5432"
  chrome:
    ports:
      - "4444:4444"
```

**Port mapping approach:**
- Cross-platform (works on Linux, macOS, Windows)
- Main project: Rails on 3000, Vite on 3036
- Worktrees: Rails 3001-3009, Vite 3037-3045
- Max 9 concurrent worktrees (adjustable by expanding range)
- `wtm new` enforces limit and shows error if range exhausted

**Centralized configs:**
- One nvim/zellij setup for all DevPod projects
- Configs persist outside any single project
- No git worktree conflicts with bind-mounted directories

**Note:** Initially tried `network_mode: host` (Linux-only, unlimited ports) but switched to port ranges for team compatibility.

## The Daily Workflow

### Starting Up

```bash
# From host terminal
bin/dpod up      # 8.7 seconds after first build

# SSH in
bin/dpod ssh

# Inside container (zsh, oh-my-zsh with custom prompt)
🐳 devpod ➜ web-3 git:(main)

# Start Rails
bin/dev          # Rails on localhost:3000

# New zellij tab (Ctrl+T N)
# Run tests, Claude Code, whatever
```

**What works great:**
- ✅ Copy/paste images into Claude Code (failed in Cursor's terminal!)
- ✅ Shift+click links in zellij (e.g., Claude auth URLs)
- ✅ Full nvim setup with LazyVim
- ✅ Claude Code running inside container
- ✅ Tests, migrations, everything just works

### Git Worktrees for Parallel Development

Built a worktree manager (`bin/wtm`) for working on multiple branches:

```bash
bin/wtm new my-feature
# Creates: /workspaces/my-app-worktrees/my-feature/
# - Dedicated port (3001, 3002, etc.)
# - Dedicated databases (dev + 3 parallel test DBs)
# - Runs bin/setup automatically
# - Ready in ~1 minute

bin/wtm list
# Shows all worktrees with ports and databases

bin/wtm cleanup my-feature
# Removes worktree and drops databases
```

The worktree manager:
- Auto-assigns unique ports
- Creates isolated databases per branch
- Copies credentials (not code - it's in git!)
- Runs `bundle install`, `yarn install`, `db:setup`, and parallel test setup
- Handles cleanup including all test databases

**Key insight:** Worktrees are persistent! The devcontainer mounts `../..:/workspaces`, so worktrees survive container recreation.

### Branch-Specific Context with Claude Code

One powerful benefit of persistent worktrees: branch-specific context that survives container restarts.

Created a SessionStart hook that automatically loads context for each branch:

```bash
# .claude/hooks/session-start-worktree-context.sh
# Detects current branch and loads .claude/worktree-contexts/{branch}.md
```

Wire it up in `.claude/settings.json`:
```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/session-start-worktree-context.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

**Workflow:**
```bash
# Create new worktree
bin/wtm new my-feature

# After worktree creation, you'll be prompted:
# 📝 Claude Code Context Setup
#
# Would you like to create branch-specific context for Claude Code?
#   [e] Edit template now (opens in $EDITOR)
#   [s] Skip - use basic context only
#
# Choice [e/s]:

# Choose 'e' for detailed features (opens template in editor)
# Choose 's' for quick fixes (uses basic worktree context)
```

**What goes in the context file:**
- Related ticket/issue number
- Feature description and goals
- Key files and components
- Testing strategy
- Local TODOs and blockers

**Benefits:**
- Interactive prompt during `wtm new` - easy to set up or skip
- Claude knows what you're working on when you switch branches
- No need to re-explain context after container restart
- Keeps notes out of git (`.gitignore` excludes these files)
- Skip context for quick fixes, use it for complex features
- Template provides structure for consistency

**Example context:**
```markdown
## Worktree Context

**Related Issue:** #1234
**Feature:** Add OAuth login support

**Key Components:**
- app/controllers/auth/oauth_controller.rb
- app/services/auth/oauth/google.rb

**Testing:**
- [ ] Unit tests for OAuth service
- [ ] Integration test for full flow
- [ ] Manual test with Google OAuth
```

When you start Claude Code in that worktree, this context automatically loads. No more "what was I building here?"

## The Git Signing Saga

This took hours to debug. Git commit signing failed with cryptic errors:

```
error Error receiving git ssh signature: %!w(*status.Error=...)
```

**Root causes:**
1. ❌ Was using private key path instead of public key
2. ❌ DevPod injects a broken `gpg.ssh.program` wrapper

**The fix:**
```bash
# Remove DevPod's wrapper
git config --global --unset gpg.ssh.program

# Use PUBLIC key (not private)
git config --global user.signingkey ~/.ssh/id_ed25519-sign.pub
git config --global gpg.format ssh
git config --global commit.gpgsign true
```

**But:** DevPod's agent recreates the broken wrapper on every SSH login. Current workaround: manually unset it each session.

This is friction Cursor doesn't have - it just syncs your host gitconfig and everything works.

## What's Good

**Speed:** 8.7 seconds from `bin/dpod up` to working environment (after first build). Faster than making coffee.

**True isolation:** No confusion between host and container. Everything runs in the container.

**Terminal multiplexing:** Zellij makes managing multiple terminals clean. Visual tabs, split panes, shift+click links.

**Worktrees:** Having multiple branches running simultaneously with dedicated ports/databases is powerful.

**Copy/paste:** Works better than Cursor's built-in terminal for images.

**Learning:** You understand what's happening under the hood because you configure it yourself.

## What's Rough

**Git signing:** Broken by DevPod's wrapper. Requires manual fix each session. Cursor "just works."

**Port forwarding errors:** Harmless but loud on disconnect:
```
error Error port forwarding 3000: accept tcp 127.0.0.1:3000: use of closed network connection
```
You learn to ignore them.

**Setup script required:** Need a one-time `setup-devpod.sh` to install nvim, zellij, oh-my-zsh, etc. Cursor handles this automatically.

**More manual:** Everything requires explicit configuration. No magic, but also no automatic setup.

**Shell PATH issues:** Oh My Zsh installation can break mise activation. Need careful script ordering.

## Honest Assessment

**Would I use this for daily work?**

Yes, with caveats:
- The worktree workflow is excellent for parallel feature development
- Terminal multiplexing (zellij) is better than IDE panels
- Speed and control are worth the setup friction
- But git signing needs fixing (might file a DevPod issue)

**Would I recommend it?**

For terminal-first developers: Absolutely try it. You'll appreciate the SSH-based workflow.

For VSCode/Cursor users: Probably not worth switching. The IDE integration works well for devcontainers.

**The tradeoff:**
- Cursor: Zero friction, everything just works, but you're locked into their IDE
- DevPod: More setup, more manual, but you use your own tools your own way

**Team adoption:**

DevPod supports multiple devcontainer configs. Instead of forcing everyone to switch, create `.devcontainer-devpod/` alongside the default `.devcontainer/`:

```
.devcontainer/           # Team default (Cursor/VSCode) - UNCHANGED
.devcontainer-devpod/    # DevPod setup - OPT-IN
```

**How it works:**
```bash
# Team members (no changes needed)
cursor .                    # Uses .devcontainer/ automatically
code .                      # Uses .devcontainer/ automatically

# Terminal-first developers
devpod up . --devcontainer-path .devcontainer-devpod
```

**What goes where:**
- `.devcontainer/` - Team's existing setup, stays exactly as-is
- `.devcontainer-devpod/` - Port ranges for worktrees, centralized configs, SSH-friendly mounts

Both read the same `.devcontainer.json` format. The only differences are mount points (centralized nvim/zellij) and port ranges (for parallel worktrees). Team never affected, terminal users opt-in.

## The Setup Scripts

### Environment Setup

Created `setup-devpod.sh` that handles:
- Neovim v0.11.4 installation
- LazyVim with Slim syntax support
- Zellij terminal multiplexer
- Oh My Zsh with custom prompt (`🐳 devpod`)
- Git signing configuration
- Rails directories and credentials
- ripgrep and fd for telescope

Idempotent - safe to re-run.

### Worktree Manager

Built `bin/wtm` (bash-based, ~500 lines) with modular structure:
```
tools/wtm/
├── wtm              # Main entry point
├── commands/        # new, list, cleanup
└── lib/             # common, worktree, database
```

Handles:
- Port scanning and assignment
- Database naming (supports parallel tests)
- Credential copying
- Container detection (skips setup if on host)
- All database cleanup (including parallel test DBs)
- Relative .git path fixing (worktrees work from both host and container)

## Key Learnings

**Simplified database configuration:**
```yaml
# config/database.yml
development:
  database: <%= ENV.fetch("DATABASE_NAME", "my_app") %>_development

test:
  database: <%= ENV.fetch("DATABASE_NAME", "my_app") %>_test<%= ENV['TEST_ENV_NUMBER'] %>
```

Single `DATABASE_NAME` env var drives both dev and test databases. Rails appends suffixes.

**Port ranges enable cross-platform worktree workflows.** Supports Linux, macOS, and Windows with a reasonable limit (9 concurrent worktrees).

**Worktrees + devcontainers = powerful:** The `../..:/workspaces` mount means worktrees are persistent and accessible from both host and container.

**Relative .git paths:** Git worktrees create `.git` files with absolute paths (`/workspaces/...`) that only work inside containers. The `wtm new` command automatically converts these to relative paths (`../../project/.git/worktrees/branch`) so git works from both host and container.

**Centralized configs:** Nvim and zellij configs live in `../../devpod-data/` (shared across all DevPod projects) rather than per-project bind mounts. Cleaner than duplicating configs or using `git update-index --skip-worktree`.

**Team-friendly deployment:** DevPod supports multiple devcontainer configs. Instead of modifying `.devcontainer/` (disrupts Cursor/VSCode users), create `.devcontainer-devpod/` and use `devpod up . --devcontainer-path .devcontainer-devpod`. Team keeps default setup, DevPod users opt-in.

## What's Next

**Fix git signing:** Either solve DevPod's wrapper issue or file an upstream bug.

**Test full-day productivity:** How does LSP performance feel with Ruby/TypeScript? Any hidden friction points?

**Clipboard integration:** Investigate OSC 52 for copy/paste from container to host.

**Optimize for team:** If this works well, document for teammates who want terminal-first devcontainer workflow.

## Resources

- [DevPod Documentation](https://devpod.sh/)
- [Git worktrees guide](https://git-scm.com/docs/git-worktree)
- [Claude Code Documentation](https://docs.anthropic.com/claude/docs/claude-code)
- DevPod scripts in this post (commit `80b9d146` in my Rails project)

---

**Bottom line:** DevPod delivers on its promise - you can use devcontainers without IDE lock-in. It requires more setup and manual configuration than Cursor, but for terminal-first developers, that's a feature not a bug. You get transparency, control, and the ability to use your own tools.

The git signing issue is annoying, and there are rough edges, but the core workflow is solid. After a day of iteration, I have a reproducible setup that works well for daily Rails development with parallel worktrees.

Is it perfect? No. Is it worth trying if you're tired of being forced into an IDE just for devcontainers? Absolutely.
