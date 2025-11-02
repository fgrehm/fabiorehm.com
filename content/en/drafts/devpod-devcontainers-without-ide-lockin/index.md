---
title: "DevPod: Using Devcontainers Without the IDE Lock-in"
date: 2025-11-01
draft: true
description: "A terminal-first developer's journey with DevPod - SSH-based workflow, terminal multiplexing, and the honest reality of ditching VSCode/Cursor for devcontainers."
tags:
  - devcontainers
  - terminal
  - workflow
  - docker
  - neovim
  - devpod
  - zellij
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
# Install DevPod (Linux)
curl -L -o devpod "https://github.com/loft-sh/devpod/releases/latest/download/devpod-linux-amd64" && \
  sudo install -c -m 0755 devpod /usr/local/bin && \
  rm -f devpod

# macOS users: brew install devpod

# Set default provider to Docker
devpod provider use docker

# Configure context options
devpod context set-options -o DOTFILES_URL=https://github.com/yourusername/dotfiles
devpod context set-options -o EXIT_AFTER_TIMEOUT=false

# Disable telemetry (enabled by default)
devpod context set-options -o TELEMETRY=false
```

**Note on telemetry:** DevPod sends usage data by default. If you prefer not to share telemetry, disable it with the command above. You can review all context options with `devpod context options`.

**Note on dotfiles:** The `DOTFILES_URL` setting is global - it applies to ALL DevPod workspaces you create. When DevPod starts a new workspace, it clones your dotfiles repo and runs the installation script (specified by `DOTFILES_SCRIPT` option, defaults to `install.sh`). This means your shell config, aliases, and tools are consistent across every project. No per-project dotfiles setup needed.

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
  setup)
    # Alias for up (setup runs via postCreateCommand)
    if devpod list 2>/dev/null | grep -q "^$WORKSPACE_ID"; then
      devpod up "$WORKSPACE_ID"
    else
      echo "→ Creating workspace '$WORKSPACE_ID' with IDE=$IDE..."
      echo "  (setup runs automatically via postCreateCommand)"
      devpod up . --id "$WORKSPACE_ID" --ide "$IDE"
    fi
    ;;
  recreate)
    # Rebuild container (setup runs automatically)
    echo "→ Recreating workspace '$WORKSPACE_ID'..."
    echo "  (setup runs automatically via postCreateCommand)"
    devpod up "$WORKSPACE_ID" --recreate
    ;;
  ssh)
    ssh "$WORKSPACE_ID.devpod" "$@"
    ;;
  stop)
    devpod stop "$WORKSPACE_ID"
    ;;
  delete)
    devpod delete "$WORKSPACE_ID"
    ;;
  status)
    devpod list | grep -E "^NAME|^$WORKSPACE_ID"
    ;;
esac
```

**Key features:**
- `setup` command creates workspace (setup runs via postCreateCommand)
- `recreate` rebuilds container and re-runs setup automatically
- `ssh` passes through extra arguments
- No manual setup script calls needed

### Config Mounts

For DevPod, centralize your editor configs across all projects:

```yaml
# .devcontainer/compose.devpod.yaml
services:
  rails-app:
    volumes:
      - ~/.ssh:/home/vscode/.ssh
      - ~/.claude/CLAUDE.md:/home/vscode/.claude/CLAUDE.md
      - ~/.claude/settings.json:/home/vscode/.claude/settings.json
      # Centralized configs shared across all DevPod projects
      - ../../devpod-data/nvim:/home/vscode/.config/nvim
      - ../../devpod-data/zellij:/home/vscode/.config/zellij
```

**Benefits:**
- One nvim/zellij setup for all DevPod projects
- Configs persist outside any single project
- No git conflicts with bind-mounted directories

**Alternative: Per-project configs**

For project-specific customizations, mount to `tmp/` (gitignored):

```yaml
# .devcontainer/compose.yaml
services:
  rails-app:
    volumes:
      - ../:/workspaces/my-app:cached
      - ../tmp/nvim-config:/home/vscode/.config/nvim:cached
      - ../tmp/shell-history:/home/vscode/.shell-history:cached
```

**Trade-offs:**
- **Centralized** (`~/../../devpod-data/`): One config for all projects, easier to maintain
- **Per-project** (`tmp/`): Project-specific customizations, configs travel with repo (though gitignored)

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

One killer feature: DevPod's `../..:/workspaces` mount makes git worktrees persistent and accessible from both host and container.

I built a worktree manager (`bin/wtm`) that handles:
- Port assignment for parallel branches
- Database isolation per branch
- Branch-specific Claude Code context (via SessionStart hooks)
- Automatic setup and cleanup

Details on the worktree workflow, port ranges, and Claude Code integration: **[Managing Parallel Git Branches in Docker with Worktrees](/drafts/git-worktrees-docker-parallel-development/)** (separate post - the pattern works beyond DevPod too)

## The Git Signing Saga

This took hours to debug. Git commit signing failed with cryptic errors:

```
error Error receiving git ssh signature: %!w(*status.Error=...)
```

**Root causes:**
1. ❌ Was using private key path instead of public key
2. ❌ DevPod injects a broken `gpg.ssh.program` wrapper

**The fix (add to `.devcontainer/setup.sh`):**
```bash
# CRITICAL: Remove DevPod's broken SSH signature wrapper
# DevPod sets gpg.ssh.program to a wrapper that breaks signing
echo "Configuring Git..."
git config --global --unset gpg.ssh.program 2>/dev/null || true
git config --local --unset gpg.ssh.program 2>/dev/null || true
git config --system --unset gpg.ssh.program 2>/dev/null || true

# Use PUBLIC key (not private) - git finds the private key automatically
git config --global user.signingkey ~/.ssh/id_ed25519-sign.pub
git config --global gpg.format ssh
git config --global commit.gpgsign true
```

Put this in your setup script so it runs automatically on container creation via `postCreateCommand`. The aggressive unset commands handle all git config levels (global, local, system).

**Status:** ✅ This fixes the issue permanently. No manual intervention needed each session.

## What's Good

**Speed:** 8.7 seconds from `bin/dpod up` to working environment (after first build). Faster than making coffee.

**True isolation:** No confusion between host and container. Everything runs in the container.

**Terminal multiplexing:** Zellij makes managing multiple terminals clean. Visual tabs, split panes, shift+click links.

**Worktrees:** Having multiple branches running simultaneously with dedicated ports/databases is powerful.

**Copy/paste:** Works better than Cursor's built-in terminal for images.

**Learning:** You understand what's happening under the hood because you configure it yourself.

## What's Rough

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

Yes:
- The worktree workflow is excellent for parallel feature development
- Terminal multiplexing (zellij) is better than IDE panels
- Speed and control are worth the setup friction
- Git signing works reliably with the setup script fix

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

## The Setup Script

Created `.devcontainer/setup.sh` that handles:
- Neovim v0.11.4 installation
- LazyVim with Slim syntax support
- Zellij terminal multiplexer
- Oh My Zsh with custom prompt (`🐳 devpod`)
- Git signing configuration
- Rails directories and credentials
- ripgrep and fd for telescope

Idempotent - safe to re-run. Cursor does this automatically, but here you configure it yourself.

## Automating Setup with postCreateCommand

Instead of manually running the setup script, use devcontainer.json's `postCreateCommand`:

```json
{
  "name": "my-app",
  "postCreateCommand": ".devcontainer/setup.sh && bin/setup"
}
```

DevPod (and VSCode/Cursor) automatically runs this after container creation. No need for manual setup script calls in your wrapper - it just happens when you run `devpod up` or `bin/dpod recreate`.

## Key Learnings

**Centralized configs:** Nvim and zellij configs live in `../../devpod-data/` (shared across all DevPod projects) rather than per-project bind mounts. Cleaner than duplicating configs or using `git update-index --skip-worktree`.

**Team-friendly deployment:** DevPod supports multiple devcontainer configs. Instead of modifying `.devcontainer/` (disrupts Cursor/VSCode users), create `.devcontainer-devpod/` and use `devpod up . --devcontainer-path .devcontainer-devpod`. Team keeps default setup, terminal users opt-in.

**SSH-based workflow matters:** Persistent shells, terminal multiplexers, and copy/paste all work naturally. DevPod feels like SSHing to a remote dev machine, not wrapping Docker exec.

**Git worktrees benefit from persistence:** The `../..:/workspaces` mount makes worktrees survive container recreation. See the [worktree post](/drafts/git-worktrees-docker-parallel-development/) for the full pattern.

## What's Next

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
