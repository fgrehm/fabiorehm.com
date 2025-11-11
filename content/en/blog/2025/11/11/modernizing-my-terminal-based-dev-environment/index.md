---
title: "Modernizing my Terminal-Based Development Environment"
date: 2025-11-11
description: "Returning to terminal-based development after a Cursor detour: SSH-based workflows with DevPod, modern multiplexers, and AI tools - the latest chapter in a 10+ year journey of working with virtualized dev environments."
tags:
  - terminal
  - devpod
  - devcontainers
  - workflow
  - developer-experience
  - ssh
  - series
---

After over a decade as a "terminal-based developer", I ended up using Cursor for a while when we decided to make use of devcontainers at work. This series documents how I am "returning to my roots" using modern tools like [DevPod](https://devpod.sh/), [Zellij](https://zellij.dev/), and [Claude Code](https://claude.com/product/claude-code) AI assistance without leaving the command line.

**NOTE:** This is a living series. I'll update posts as I discover new patterns, gotchas, and solutions. New posts may be added as the workflow evolves.

## The Backstory

I've been a vim/terminal person ever since I started working with Ruby / Rails. I've also spent considerable time building tools to improve virtualized development environments - it all started when I [went 100% on Vagrant](/blog/2013/01/17/100-percent-on-vagrant/) in early 2013, transitioning to [vagrant-lxc](/blog/2013/04/28/lxc-provider-for-vagrant/), building [vagrant-cachier](/blog/2013/05/24/stop-wasting-bandwidth-with-vagrant-cachier/) later that year, and ultimately building [Devstep](/blog/2014/08/26/devstep-development-environments-powered-by-docker-and-buildpacks/) in 2014. Developer experience in virtualized workflows has been a consistent passion, but I stopped focusing on tooling when I shifted from consultancy to product companies.

When my current team adopted devcontainers, I ended up moving to Cursor because that's what was easier and I wanted to experiment with its AI features. But the GUI felt painfully slow compared to my terminal workflow and I had to relearn a bunch of new shortcuts. Later, when I started using Claude Code, I ended up spending most of my time in Cursor's built-in terminal.

I recently discovered DevPod and realized it solved my problem: SSH-based devcontainers without IDE lock-in. I could return to neovim, move to zellij (from tmux), and use my terminal tools while keeping the team's devcontainer benefits. Claude Code, which I was already using in Cursor's terminal, now works even better in a real terminal setup.

This is me scratching my own itch again - the latest evolution of a 10+ year journey improving my own virtualized dev environments, this time building on top of other people's tooling instead of building my own :)

## Who This Is For

**You'll get value from this series if:**

- You're already terminal-based and frustrated by devcontainer IDE requirements
- You're curious about SSH-based development workflows
- You want to understand the tradeoffs before switching away from VSCode/Cursor
- You're looking for practical DevPod setup examples (not just the official docs)

**This _probably_ isn't for you if:**

- You're happy with VSCode/Cursor (seriously, stay there - the IDE integration works well)
- You're not using devcontainers (this is specifically about devcontainer workflows)
- You're looking for "vibe coding" / AI-generates-everything approaches (this is about augmented development, not replacement)

## The Series

### Part 1: [DevPod: SSH-Based Devcontainers Without IDE Lock-in](/blog/2025/11/11/devpod-ssh-devcontainers/)

How to use DevPod to SSH into devcontainers instead of opening them in VSCode/Cursor. Covers installation, wrapper scripts, config persistence, git signing fixes, and team adoption (dual-setup approach so you don't disrupt teammates).

**Key takeaway:** You can have devcontainer consistency without IDE lock-in. DevPod reads the same `.devcontainer.json` format but gives you SSH access instead of forcing a GUI editor.

### Part 2: Terminal-Based Development: SSH, Multiplexers, and the Honest Friction (Coming Soon)

What daily development actually feels like with this setup. Covers Zellij (terminal multiplexer), keyboard shortcuts, session management, and the honest friction points that IDE users don't deal with.

**Key takeaway:** Terminal-based development has real tradeoffs. You get control and flexibility, but you also get shortcut conflicts, and a good amount of manual configuration. It's not necessarily better - it's different.

### Part 3: Managing Parallel Git Branches in devcontainers with Worktrees (Coming Soon)

How I built a Git worktree manager for running multiple branches simultaneously, dealing with port allocation, database isolation, and branch-specific AI context that survives container recreation.

**Key takeaway:** Once you have SSH-based devcontainers working, git worktrees become incredibly powerful for parallel development. Review PRs while working on features, test main while debugging your branch, run two features side-by-side for comparison.

**Timing note:** Git worktrees for parallel AI development has become a major trend in 2024-2025, but most guides focus on basic worktree + Claude Code workflows. The devcontainer-specific challenges (port conflicts, database isolation, persistent AI context across recreations) remain largely unexplored.

## The Technical Stack

Here's what the final setup looks like:

**SSH & Containers:**

- **[DevPod](https://devpod.sh/)** - SSH access to devcontainers (instead of VSCode Remote Containers)
- **[Docker](https://www.docker.com/)** - Standard devcontainer backend
- **Dual configs** - `.devcontainer/` for team (Cursor/VSCode), `.devcontainer-devpod/` for terminal users

**Terminal Tools:**

- **[Neovim](https://neovim.io/)** - Editor ([LazyVim](https://lazyvim.org) config)
- **[Zellij](https://zellij.dev/)** - Terminal multiplexer (tabs, panes, sessions)
- **[Oh My Zsh](https://ohmyz.sh/)** - Zsh configuration framework

**AI & Development:**

- **[Claude Code](https://claude.com/download)** - AI coding assistant (CLI, not GUI)
- **[Git worktrees](https://git-scm.com/docs/git-worktree)** - Parallel branch development
- **Persistent configs** - Volume mounts survive container recreation

**Team Compatibility:**

- Team keeps using Cursor/VSCode with `.devcontainer/`
- Terminal users opt into `.devcontainer-devpod/`
- Both read same `.devcontainer.json` format
- No team disruption

## The Bottom Line

This workflow trades IDE convenience for terminal flexibility.

**What you gain:**

- Control over your tools
- Understanding of the stack
- SSH-based development
- AI assistance without leaving terminal

**What you deal with:**

- Manual configuration
- Shortcut conflicts
- Occasional friction

After a week of using this setup, I'm sticking with it. The control and understanding are worth the friction. But it's not necessarily better than Cursor/VSCode - it's a different set of tradeoffs that happens to match my preferences.

Your experience will vary based on your workflow, team structure, and how much you value terminal tools over IDE convenience.

---

## Resources

**Series Posts:**

- [Part 1: DevPod: SSH-Based Devcontainers Without IDE Lock-in](/blog/2025/11/11/devpod-ssh-devcontainers/)
- Part 2: Terminal-Based Development (Coming Soon)
- Part 3: Git Worktrees in Devcontainers (Coming Soon)

**Background Reading:**

- [Parallel AI Coding with Git Worktrees and Claude Code](https://docs.agentinterviews.com/blog/parallel-ai-coding-with-gitworktrees/) - The parallel development trend driving Part 3
- [Things I Learned About DevPod After Obsessing Over it for a Week](https://geekingoutpodcast.substack.com/p/things-i-learned-about-devpod-after) - Complementary DevPod experience
- [Zellij as Part of Your Development Workflow](https://haseebmajid.dev/posts/2024-12-18-part-7-zellij-as-part-of-your-development-workflow/) - Practical Zellij setup guide
