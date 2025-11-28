---
title: "Working on Multiple Branches Without Losing My Mind"
date: 2025-11-27
description: "Git worktrees, isolated databases, and Claude Code - how I run multiple branches without losing context."
tags:
  - git
  - worktrees
  - docker
  - devcontainers
  - rails
  - claude-code
---

_**NOTE:** This is Part 4 of the [Modernizing my Terminal-Based Development Environment][series] series._


## The Context Switching Problem

Lets imagine that you're working on a project at work and you need to do one of:

- Fix a quick bug while your feature work is in progress
- Jump on a small task when you need a mental break from your main focus
- Test `main` branch while debugging your branch
- Occasionally pull down a teammate's PR for local testing without stashing everything

If you're not a "hipster", you will: 

1. Stop your development server
2. Commit or stash your work-in-progress changes
3. `git checkout` to the desired branch
4. Rebuild dependencies if needed
5. Restart your server
6. When you're done, reverse the process

This destroys your mental context. By the time you've switched branches, spun up the server, and loaded the PR in your head, you've forgotten what you were working on. Switching back means rebuilding that context all over again (and potentially forgetting to unstash your changes).

## Enter Git Worktrees

[Git Worktrees](https://git-scm.com/docs/git-worktree) is a git feature that lets you have multiple working trees attached to the same repository in separate directories. Combined with some "docker magic" you can run multiple branches in parallel, each with their own server port and dedicated database without having to keep a separate `git clone` of your project.

I, like many others, wrapped that flow into an internal bash tool called `wtm` (worktree manager), the flow with that goes like:

1. Create a new worktree: `bin/wtm new pr-review`
2. `cd` into the worktree folder and start the server (automagically runs in a different port: `http://localhost:3001`)
3. Keep your main work running on `http://localhost:3000`
4. Then I can switch between browser tabs, not git branches

That way my mental context stays intact: the original work keeps running with whatever local changes / WIP I might have. When I'm done reviewing, I can close the tab and return to what I was doing immediately.

## Initial Setup: Port Ranges and Docker Mounts

### Port Range Strategy

In order to serve multiple instances of the app with the same container, I mapped port ranges in our Docker Compose YAML:

```yaml
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

It's been a while since I owned a Mac but I went with port ranges because `network_mode: host` doesn't work properly on macOS - Docker runs in a VM there, so "host networking" means the VM's network, not your actual Mac. My understanding is that port ranges work everywhere (and I have people on the team running mac, they haven't been able to test this but I hope it goes fine for them :sweat_smile:).

TBH I didn't actually know Docker supported port range syntax (`3000-3009:3000-3009`) until I looked into this. It's a nice fit - main project gets the standard ports (`3000` / `3036`), worktrees get `3001-3009`. Ten parallel workstreams is more than enough IMO. The `wtm new` command checks for available ports during port allocation and errors out if you somehow exhaust them all.

### Worktree Persistence

In order to be able to make the worktrees persistent across container recreation we can simply mount the project parent folder instead of just the project:

```yaml
volumes:
  - ../..:/workspaces  # Mounts project parent, not just project
```

With this setup, the main project lives at `/workspaces/my-app` inside the container and worktrees go into `/workspaces/my-app-worktrees/<branch-name>`. Both are accessible from host and container, and survive `docker compose down`.

## The Worktree Manager

With the help of Claude Code I built the `wtm` tool with a modular structure (~1,000 lines of bash):

```text
tools/wtm/
├── wtm                   # Main entry point, available from bin/wtm
├── wtm-completion.bash   # It even has Tab completion!
├── commands/             # new, list, cleanup, open
└── lib/                  # common, worktree, database
```

**NOTE**: `wtm open` was created for Zellij users like me - it creates named tabs showing `branch:port` so I can see at a glance which worktree I'm in and the port that it's running.

### How it works

It all starts with `wtm new <branch-name>`, that command will:

- Create `/workspaces/my-app-worktrees/<branch-name>` with `git worktree add`
- Copy a bunch of files over (ex: `.env`, `config/credentials/`, `CLAUDE.local.md`, etc)
- Find an available port for the Rails app and vite server and write those as `PORT` / `VITE_RUBY_PORT` in the newly created worktree `.env` file
- Convert the branch name to a "database friendly name" for use as `DATABASE_NAME` (also written to `.env`)
- And will finally run `bin/setup --skip-server` once everything is in place for the app to be set up

To see the list of all worktrees with their ports and database names, we can run `wtm list` and get an output like this:

```text
📋 Worktree Summary

Main Project:
  Path: /workspaces/my-app
  Port: 3000 (default)
  Context: -

Worktrees: (3 found)

1 fix-user-device-upsert
   Port:     3002
   Database: fix_user_device_upsert
   Branch:   fix-user-device-upsert
   Context:  /workspaces/my-app-worktrees/fix-user-device-upsert/.claude/context.md
   Path:     /workspaces/my-app-worktrees/fix-user-device-upsert

2 test-123
   Port:     3003
   Database: test_123
   Branch:   test-123
   Context:  -
   Path:     /workspaces/my-app-worktrees/test-123

────────────────────────────────────────────────────────────────────────────────
Total: 2 worktree(s)

Tip: Use 'bin/wtm cleanup <name>' to remove a worktree
```

Once I'm done, I just `wtm cleanup <branch-name>` for deleting the worktree and cleaning up its "artifacts" (more on that below).

### What It Handles

We actually have a worktree manager "V1" script at work written by a colleague that is used within the context of VSCode/Cursor, I personally haven't tried yet but I wanted to do things a bit different without disrupting their workflow. I also thought "we can do better" and started `wtm` from scratch using that "V1" as inspiration.

The new things I wanted to support and got implemented on the new tool were:
- Better database isolation: each branch gets its own database (`myapp_feature_development`), and Rails parallel tests need multiple test databases (`myapp_feature_test`, `myapp_feature_test2`, `myapp_feature_test3`). A single `DATABASE_NAME` env var drives all of this - set it per worktree and forget it. The "V1" did not handle test DB isolation, meaning 2 test runs could interfere with each other.
- User preferences preservation: in addition to massaging `.env`, `wtm` also copies over Claude Code settings (`CLAUDE.local.md`, `.claude/settings.local.json`, `.mcp.json`). With that my personal Claude preferences and MCP servers work immediately without reconfiguration.
- Ability to run `git` commands from my laptop outside of containers: each worktree gets a `.git` file pointing to the main project, but the absolute paths made `git` operations fail from my host machine. Git just didn't recognize the worktree properly because the paths only work inside containers:
  ```text
  gitdir: /workspaces/my-app/.git/worktrees/feature
  ```
  The manager then converts these to relative paths so git works from both host and container:
  ```text
  gitdir: ../../my-app/.git/worktrees/feature
  ```
- Better cleanup: `wtm cleanup` not only removes the worktree directory but it also drops all databases (including parallel test DBs), and cleans up Claude Code session data from `~/.claude/projects/...` and `~/.claude.json`. When you delete a worktree, its isolated approvals and chat history go with it - no orphaned data is left behind.
- And finally, the main thing I wanted to explore was "automagic worktree context loading", more on that below

## Application Database Configuration

To support the creation of all those databases, I changed the Rails database config to something like this:

```yaml
# config/database.yml
development:
  database: <%= ENV.fetch("DATABASE_PREFIX", "my_app") %>_development
test:
  database: <%= ENV.fetch("DATABASE_PREFIX", "my_app") %>_test<%= ENV['TEST_ENV_NUMBER'] %>
```

That way a single `DATABASE_PREFIX` env var drives both dev and test databases. Rails will then append suffixes at boot time:
- Dev: `my_app_feature_development`
- Test: `my_app_feature_test`, `my_app_feature_test2`, `my_app_feature_test3`

## "Automagic" Worktree Context Loading with Claude Code

One powerful benefit of persistent worktrees is that we can easily provide branch-specific context that is applied across multiple chat sessions.

It all starts with a `SessionStart` that automatically loads context for each worktree if it detects a file exists:

```bash
# .claude/hooks/session-start.sh
#!/bin/bash

# Read hook input
hook_input=$(cat)

# Load worktree context if available
CONTEXT_FILE=".claude/context.md"
if [ -f "$CONTEXT_FILE" ]; then
  CONTEXT_CONTENT=$(cat "$CONTEXT_FILE")

  jq -n --arg context "$CONTEXT_CONTENT" '{
    "hookSpecificOutput": {
      "hookEventName": "SessionStart",
      "additionalContext": $context
    }
  }'
fi

exit 0
```

The hook is wired up in `.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/session-start.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

And that way each worktree gets its own `.claude/context.md` that lives in the worktree directory only and is automatically isolated per branch. The hook configuration and script are commited to our `main` branch since it works if the context file doesn't exist too, `context.md` is `.gitignore`d.

`wtm new` prompts us for writing that `context.md` file (optional). In that file we can provide whatever context makes sense to be present in **ALL** claude code sessions for the specific worktree. I also implemented a `--issue` flag that fetches the issue title and description to pre-fill the context file, when that's used we just review and save. No need to copy ticket info manually and no need to write a full blown prompt if your issues have a nice description that can be fed into claude.

One more thing: `wtm new` creates branches from your *current* branch, not always main. So if you're on `feature-a` and run `wtm new feature-b`, you get a stacked branch. Useful for building on top of in-flight work without waiting for it to merge.

I usually just use the `--issue` flag these days and add any additional context that might be relevant. At the end claude gets something like this as the `additionalContext`:

```markdown
## Issue 1234: Implement Feature XYZ

... here goes the issue description from github ...

## Additional context

**Key Components**:
- app/controllers/some_controller.rb
- app/services/some_service.rb

**Testing**:
- [ ] Unit tests for SomeService
- [ ] Integration test for full flow
```

With that file in place and the hook properly wired up, Claude Code will automatically get this context whenever you start a new chat. No need to explain everything again. I also tend to ask claude itself to update that file with the milestones completed and the remaining work whenever a branch requires multiple chat sessions.

The real payoff comes when you return to a worktree after being heads down on something else - maybe hours later to address another PR comments, maybe days later (monday morning without coffee) to pick up where you left off. If that file is up to date, we can just start Claude Code and say `let's resume work on that ticket`, it will know what you're building and where we left off. No re-explaining, no digging into `git log`s.

Another side effect of this is that Claude Code's local settings are stored per-worktree in `.claude/`. Things like command approvals - for example, I don't let Claude run `git add -A` or `git commit` by default on my main worktree because I prefer to review what's being committed when I'm actively looking at a session. But I might approve those in a throwaway worktree. When you delete the worktree, those approvals go with it. Approving something in one branch doesn't affect other branches. Chat history is also organized per-worktree, so conversations about a specific feature stay together when you `claude --resume` or `claude --continue`

## Disclaimer

I'm not doing what some call "parallel AI coding." You'll find approaches where people [run multiple AI agents simultaneously on isolated worktrees][parallel-ai-coding], each implementing the same feature differently to compare results. That's not what this is about. I'm using worktrees to preserve mental context - switching between my feature work and a quick bugfix without losing my mind. Two or three branches max, not a farm of competing agents.

## That's It

The bash scripting took some effort (not a ton thanks to claude), but now I can switch between branches without losing my mind and without using a ton of machine resources. I also found out that other people built similar worktree managers independently for their own - seems like a common need once you start using AI Coding Agents "more seriously". The context isolation per branch is a natural fit.

There are [plenty of worktree managers on GitHub](https://www.google.com/search?q=worktree+manager+github) if you want something off the shelf. Most are either more advanced than I needed or don't provide a nice mechanism to perform a proper cleanup when worktree is deleted (ex: drop databases, remove session data from `~/.claude`, etc). The first version of `wtm` took a couple hours to build with Claude's help, and I keep refining it as we go.

## Resources

**Official Documentation:**
- [Git worktrees documentation][git-worktree]
- [Claude Code hooks][claude-code-hooks]

**Related Posts:**
- [Mastering Git Worktrees with Claude Code][medium-worktrees] - parallel AI sessions approach (different from this post)
- [Parallel AI Coding with Git Worktrees][parallel-ai-coding] - AI-assisted parallel development patterns
- [Supercharging Claude Code with Git Worktrees and Docker][sangyh-worktrees] - similar approach for Django + Docker

[series]: /blog/2025/11/11/modernizing-my-terminal-based-dev-environment/
[git-worktree]: https://git-scm.com/docs/git-worktree
[claude-code-hooks]: https://code.claude.com/docs
[medium-worktrees]: https://medium.com/@dtunai/mastering-git-worktrees-with-claude-code-for-parallel-development-workflow-41dc91e645fe
[parallel-ai-coding]: https://docs.agentinterviews.com/blog/parallel-ai-coding-with-gitworktrees/
[sangyh-worktrees]: https://sangyh.com/posts/productivity/claude-code-with-git-worktrees/
