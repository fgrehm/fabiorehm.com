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

## The Technical Stack

Here's what I ended up with: [DevPod](https://devpod.sh/) gives me SSH access to devcontainers (instead of VSCode Remote Containers), running on standard [Docker](https://www.docker.com/). The team keeps using Cursor/VSCode with `.devcontainer/`, I opt into `.devcontainer-devpod/` - both read the same format, no disruption.

Inside the container I'm using [Neovim](https://neovim.io/) ([LazyVim](https://lazyvim.org) config), [Zellij](https://zellij.dev/) for terminal multiplexing (tabs, panes, sessions), and [Oh My Zsh](https://ohmyz.sh/) for shell config. [Claude Code](https://claude.com/download) runs via CLI for AI assistance, and I'm using [git worktrees](https://git-scm.com/docs/git-worktree) for parallel branch development. Everything's mounted via Docker volumes so configs survive container recreation.

After a few weeks of using this setup, I'm sticking with it. The control and understanding are worth the friction for me. But it's not necessarily better than Cursor/VSCode - it's a different set of tradeoffs that happens to match my preferences.

If you're happy with VSCode/Cursor, stay there - the IDE integration works well. But if you're terminal-based and frustrated by devcontainer IDE requirements, read on. Part 1 walks through the DevPod setup.

## The Series

The posts cover the setup, daily workflow, and tooling details:

### Part 1: [DevPod: SSH-Based Devcontainers Without IDE Lock-in](/blog/2025/11/11/devpod-ssh-devcontainers/)

How to use DevPod to SSH into devcontainers instead of opening them in VSCode/Cursor. Covers installation, wrapper scripts, config persistence, git signing fixes, and team adoption using a dual-setup approach so you don't disrupt teammates who prefer IDEs.

### Part 2: [Using Zellij and Claude Code Over SSH](/blog/2025/11/19/using-zellij-and-claude-code-over-ssh/)

What daily development actually feels like with Zellij (terminal multiplexer) and Claude Code CLI. Keyboard shortcuts, persistent sessions, the unlock-first workflow, and the honest friction points that IDE users don't deal with.

### Part 3: [Neovim and LazyVim for Rails Development over SSH](/blog/2025/11/20/neovim-lazyvim-rails-ssh/)

Setting up Neovim with LazyVim for Rails development over SSH. Clipboard integration using OSC 52, Ruby LSP configuration with bundled gems (avoiding Mason's global installation for Rails projects), multi-cursor editing, global find/replace, and performance considerations when using git worktrees.

### Part 4: [Working on Multiple Branches Without Losing My Mind](/blog/2025/11/27/working-on-multiple-branches-without-losing-my-mind/)

How I built a Git worktree manager for running multiple branches simultaneously - port allocation, database isolation, and branch-specific Claude Code context that survives container recreation.
