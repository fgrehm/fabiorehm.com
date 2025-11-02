---
title: "Managing Parallel Git Branches in Docker with Worktrees"
date: 2025-11-01
draft: true
description: "Building a worktree manager for Docker development - port ranges, database isolation, and branch-specific Claude Code context."
tags:
  - git
  - worktrees
  - docker
  - devcontainers
  - rails
  - claude-code
---

## The Problem

You're working on a Rails project with Docker/devcontainers. You need to:
- Review a teammate's PR while working on your feature
- Test main branch while debugging your branch
- Run two features in parallel for comparison

Traditional approach: stop your container, switch branches, restart, rebuild. Painful.

**Git worktrees** let you have multiple branches checked out simultaneously. Combined with Docker, you can run multiple branches in parallel - each with its own port, database, and environment.

This post covers building a worktree manager that handles the messy parts: port assignment, database isolation, and persistent context that survives container restarts.

## The Setup: Port Ranges and Mounts

### Port Range Strategy

For parallel development, map port ranges in your Docker Compose:

```yaml
# docker-compose.yml or .devcontainer/docker-compose.yml
services:
  rails-app:
    # Port ranges support main + up to 9 worktrees
    ports:
      - "3000-3009:3000-3009"   # Rails (main: 3000, worktrees: 3001-3009)
      - "3036-3045:3036-3045"   # Vite  (main: 3036, worktrees: 3037-3045)
  postgres-db:
    ports:
      - "5432:5432"
  chrome:
    ports:
      - "4444:4444"
```

**Why port ranges:**
- Cross-platform (works on Linux, macOS, Windows)
- Main project gets standard ports (3000, 3036)
- Worktrees get sequential ports (3001-3009, 3037-3045)
- Clear limit (9 concurrent worktrees)
- `wtm new` enforces limit and shows error if exhausted

**Alternative considered:** `network_mode: host` (Linux-only, unlimited ports) but sacrificed for team compatibility.

### Worktree Persistence

The key insight: mount the parent directory so worktrees persist across container recreation:

```yaml
# In .devcontainer/devcontainer.json or docker-compose
volumes:
  - ../..:/workspaces  # Mounts project parent, not just project
```

This means:
- Main project: `/workspaces/my-app/`
- Worktrees: `/workspaces/my-app-worktrees/feature-branch/`
- Both accessible from host and container
- Worktrees survive `docker-compose down`

## The Worktree Manager

Built `bin/wtm` (~500 lines of bash) with modular structure:

```
tools/wtm/
├── wtm              # Main entry point
├── commands/        # new, list, cleanup
└── lib/             # common, worktree, database
```

### Creating a Worktree

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

### What It Handles

**Port assignment:**
- Scans for available ports in range
- Assigns sequentially (3001, 3002, ...)
- Fails gracefully if range exhausted

**Database isolation:**
- Creates unique database per branch: `myapp_feature_development`
- Supports Rails parallel test databases: `myapp_feature_test`, `myapp_feature_test2`, `myapp_feature_test3`
- Single `DATABASE_NAME` env var drives naming

**Setup automation:**
- Creates worktree directory
- Copies credentials (not code - it's in git!)
- Runs `bundle install`, `yarn install`
- Runs `db:setup` and parallel test setup
- Ready to develop immediately

**Cleanup:**
- Removes worktree directory
- Drops all databases (including parallel test DBs)
- Clean slate

**Relative .git paths:**
Git worktrees create `.git` files with absolute paths that only work inside containers:
```
gitdir: /workspaces/my-app/.git/worktrees/feature
```

The manager converts to relative paths:
```
gitdir: ../../my-app/.git/worktrees/feature
```

Now git works from both host and container.

## Database Configuration

Simplified Rails database config:

```yaml
# config/database.yml
development:
  database: <%= ENV.fetch("DATABASE_NAME", "my_app") %>_development

test:
  database: <%= ENV.fetch("DATABASE_NAME", "my_app") %>_test<%= ENV['TEST_ENV_NUMBER'] %>
```

**Single `DATABASE_NAME` env var** drives both dev and test databases. Rails appends suffixes:
- Dev: `my_app_feature_development`
- Test: `my_app_feature_test`, `my_app_feature_test2`, `my_app_feature_test3`

Set it per worktree and forget it.

## Branch-Specific Context with Claude Code

One powerful benefit of persistent worktrees: branch-specific context that survives container restarts.

### The SessionStart Hook

Created a SessionStart hook that automatically loads context for each branch:

```bash
# .claude/hooks/session-start-worktree-context.sh
#!/bin/bash
BRANCH=$(git branch --show-current)
CONTEXT_FILE=".claude/worktree-contexts/${BRANCH}.md"

if [ -f "$CONTEXT_FILE" ]; then
  cat "$CONTEXT_FILE"
fi
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

### The Workflow

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

**Benefits:**
- Interactive prompt during `wtm new` - easy to set up or skip
- Claude knows what you're working on when you switch branches
- No need to re-explain context after container restart
- Keeps notes out of git (`.gitignore` excludes these files)
- Skip context for quick fixes, use it for complex features
- Template provides structure for consistency

## The Daily Workflow

**Starting multiple branches:**

```bash
# Main branch on port 3000
cd /workspaces/my-app
bin/dev

# Feature branch on port 3001
cd /workspaces/my-app-worktrees/oauth-feature
bin/dev

# PR review on port 3002
cd /workspaces/my-app-worktrees/teammates-pr
bin/dev
```

Each has:
- Its own Rails server port
- Its own database
- Its own test database pool
- Persistent Claude Code context

Switch between them instantly. No container restarts. No confusion.

## Key Learnings

**Port ranges are the sweet spot** - Cross-platform, reasonable limits, clear mental model. `network_mode: host` is simpler but Linux-only.

**Worktrees + Docker = powerful** - The `../..:/workspaces` mount makes worktrees persistent and accessible from both host and container.

**Single DATABASE_NAME env var** - Drives both dev and test databases. Rails handles suffixes. Clean and simple.

**Relative .git paths matter** - Git worktrees need path conversion to work from both host and container.

**Branch context is game-changing** - Returning to a worktree after days and having Claude immediately understand what you're building? Priceless.

**Template prompts reduce friction** - Interactive prompt during `wtm new` makes context setup easy. Low-effort for quick fixes, detailed for features.

## Honest Assessment

**What works great:**
- ✅ True parallel development - no more stopping/starting
- ✅ Database isolation prevents test interference
- ✅ Context persistence across container restarts
- ✅ Port ranges provide clarity and limits
- ✅ Works on Linux, macOS, Windows

**What's rough:**
- ⚠️ Initial setup requires bash scripting
- ⚠️ Port range limits concurrent worktrees (expandable but not infinite)
- ⚠️ Database cleanup must be explicit (can't rely on worktree removal alone)
- ⚠️ Requires discipline to clean up old worktrees

**Would I use this daily?**

Absolutely. The ability to review PRs, test main, and develop features simultaneously - all with isolated environments and persistent context - is worth the setup effort.

**Applicability:**

This pattern works with:
- Plain Docker Compose
- VSCode devcontainers
- Cursor devcontainers
- [DevPod](https://devpod.sh/) (SSH-based workflow)
- Any Docker-based Rails development

The worktree manager is framework-agnostic. The database isolation requires Rails (or similar env-var based config). The Claude Code context works anywhere you use Claude Code.

## Resources

- [Git worktrees documentation](https://git-scm.com/docs/git-worktree)
- [Claude Code SessionStart hooks](https://docs.anthropic.com/claude/docs/claude-code)
- Worktree manager implementation (commit `80b9d146` in my Rails project)

---

**Bottom line:** Git worktrees + Docker + port ranges = parallel development without the pain. Add branch-specific Claude Code context and you have a workflow that remembers what you're building across container restarts. Worth the initial setup effort.
