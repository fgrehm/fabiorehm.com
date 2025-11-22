---
title: "Using Zellij and Claude Code Over SSH"
date: 2025-11-19
description: "What it's actually like to use SSH-based development with Zellij and Claude Code CLI. The good parts, the gotchas, and the friction that IDE users don't deal with."
tags:
  - terminal
  - terminal-multiplexer
  - zellij
  - ssh
  - remote-development
  - workflow
  - claude-code
  - mcp-servers
  - devpod
---

_**NOTE:** This is Part 2 of the [Modernizing my Terminal-Based Development Environment](/blog/2025/11/11/modernizing-my-terminal-based-dev-environment/) series._

---

## The Setup

I recently switched back to SSH-based development using DevPod for devcontainers (see [DevPod post](/blog/2025/11/11/devpod-ssh-devcontainers/) for the devcontainer setup). 

This post focuses on the terminal multiplexer (Zellij) and AI assistant (Claude Code CLI) experience. For editor setup (Neovim/LazyVim), see the [companion post](/blog/2025/11/20/neovim-lazyvim-rails-ssh/). For setup details (config persistence, git signing fixes, port forwarding), see the [DevPod post](/blog/2025/11/11/devpod-ssh-devcontainers/).

## The Daily Workflow

My actual workflow is straightforward:

```bash
# Start devcontainer from host terminal
bin/dpod up     

# SSH in
bin/dpod ssh

# Inside container - start a zellij "work session"
zellij -s work
```

I then work from inside that zellij session and the browser on my machine:

- `bin/dev` runs in one tab/pane
- App is accessible from `localhost:3000` in the browser
- Other Zellij tabs / panes are used to run tests, edit files with nvim, use Claude Code, run migrations, etc

The only "special" thing I do is pass `-s work` to zellij to ensure I have a distinct name for the window when alt tabbing between multiple terminals. Other than that, I currently don't use any [complex layouts](https://zellij.dev/documentation/layouts.html) - just SSH in, start zellij and GSD.

**NOTE:** `bin/dpod` is a wrapper script that makes DevPod easier to use in my environment. See the [DevPod post's "Workspace Stickiness" section](/blog/2025/11/11/devpod-ssh-devcontainers/#workspace-stickiness) for the full implementation.

Most things you'd expect from a local dev environment work great. Shift+click links in terminal output open in my browser, Zellij's tabs show what's running where, sessions survive container restarts, Claude Code has full access to `ruby`/`nodejs`/etc, port forwarding is automatic, and tests just work.

The only big issue I have atm is SSH agent forwarding for git operations (signing, pushing, etc.). It works, but there are some gotchas documented in the [DevPod post's Git Signing section](/blog/2025/11/11/devpod-ssh-devcontainers/#git-signing-the-devpod-gotcha).

## Zellij & Claude Code

### Zellij

Zellij is a terminal multiplexer - a tool that lets you run multiple terminal sessions inside a single window with tabs and panes. If you're new to the concept, check out [this Zellij vs tmux comparison guide](https://typecraft.dev/tutorial/zellij-vs-tmux) for an introduction.

#### The Friction

The main issue I ran into was keyboard shortcuts. Zellij's defaults intercept a bunch of shortcuts I need for Claude Code and nvim - `Ctrl+T` (Claude's todo toggle), `Ctrl+O` (view thinking), `Ctrl+G` (edit in nvim). Pretty annoying when you're trying to work and half your shortcuts don't fire.

The fix is Zellij's ["Unlock-First" preset](https://zellij.dev/documentation/keybinding-presets.html#the-unlock-first-non-colliding-preset) - it works like tmux's prefix key. Default state is "locked" (shortcuts pass through to your apps), then you hit `Ctrl+G` to unlock and access Zellij modes with single keys (`p` for panes, `t` for tabs). Navigation with `Alt+Arrow` works in all modes.

To enable it: `Ctrl+O` -> `C` (config menu) -> select "Unlock-First (non-colliding)" -> **`Ctrl+A` to save** (not just Enter!).

<figure>
  <img src="zellij-unlock-first-preset.png" alt="Zellij configuration showing Unlock-First preset option" width="500">
  <figcaption>Zellij's built-in preset for avoiding keybinding conflicts</figcaption>
</figure>

This helped, but I wanted more ergonomic shortcuts for common operations. So I added some `Alt+` bindings to my config (see collapsible below). The trade-off with something like `Alt+N` for new pane is that placement is non-deterministic - Zellij guesses where to put it. For most ad-hoc layouts that's fine, but if you want predictable placement you need to use the pane mode (`Ctrl+G` -> `p` -> `r` for right, `d` for down).

Terminal multiplexers add shortcut complexity. You'll accidentally lock/unlock, hit the wrong binding, and need time to build new muscle memory. Took me less than a week to get fluent with it.

**Other friction points:**

**Accidental quit** - Hit `Ctrl+Q` and Zellij closes. Sometimes `zellij attach` recovers your session, other times you're hunting for the process in `htop`. Using `-s work` when starting helps with session recovery and also gives you a distinct name for alt-tabbing between terminals.

**No clickable file paths** - In VS Code or iTerm2 you can `Cmd+Click` file paths in output (test failures, stack traces) to open them. Over SSH this doesn't work. I just copy the path and `:e <paste>` in nvim. Not a dealbreaker, but I miss clicking failed test screenshots to view them - was super convenient in Cursor.

<details>
<summary>My Custom Zellij Keybindings</summary>

Beyond unlock-first, I added these to my `~/.config/zellij/config.kdl` for more ergonomic daily use:

- `Alt+N` - Create new pane (non-deterministic placement, but fast)
- `Alt+F` - Open floating pane that overlays workspace
- `Alt+P` - Toggle pin on floating pane (keeps it visible across tabs - essential for monitoring output)
- `Alt++` / `Alt+-` - Increase/decrease pane size
- `Alt+R` - Rename current tab
- `Alt+T` - Create new tab
- `Ctrl+PageUp/Down` - Browser-style tab navigation
- `Ctrl+Shift+PageUp/Down` - Move tabs left/right

See Zellij's [swap layouts](https://zellij.dev/documentation/swap-layouts) if you want to make `Alt+N` placement deterministic based on pane count.

_NOTE: I should push the full config to GitHub at some point_

</details>

### Claude Code CLI

Claude Code runs via CLI, integrating directly into my terminal workflow: it runs where my code runs. As a side effect of this setup, I no longer suffer from the [terminal scrolling bug](https://github.com/anthropics/claude-code/issues/826) that causes frequent "stroboscope effects" that I experienced in Cursor.

The keyboard shortcuts conflict with Zellij's default, but I solved by using unlock-first mode and my custom shortcuts (covered earlier). The thing that I still could not get working was image pasting, but that's something I could not get working in Cursor either. For now I just get my screenshots into a file at `tmp/` and `@tmp/file.png` when I want Claude to read it.

#### Multiline input options

I use alacritty and my understanding is that claude's `/terminal-setup` does not work there. I spent a lot of time typing in `\` to get line breaks on my terminal which messed up with my muscle memory pretty bad (I started typing in `\` in emails, slack, etc :see_no_evil:)

After some research and "pairing" with claude itself, I found out I could get `Shift+Enter` to work properly by adding the following to my `~/.config/alacritty/alacritty.toml`:

```toml
[[keyboard.bindings]]
key = "Return"
mods = "Shift"
chars = "\n"
```

The other way to handle multiline input is to use `Ctrl+G` to open the prompt in nvim for full editor power (perfect for longer messages). Just note that this conflicts with Zellij's default unlock key, but if you remap that to Ctrl+A this works great.

#### MCP Server OAuth in SSH Environments

I ran into this annoying thing with MCP servers that use OAuth (Figma, Notion, etc.). The OAuth flow redirects to `localhost:PORT` after authentication, but when Claude Code runs inside an SSH session, that localhost is the container - not your host machine's browser.

Claude's own oauth dance works fine - it somehow detects the environment can't `open` a browser (I'm guessing) and gives you a code to type back into the `/login` flow.

But for MCP servers you'll need some extra steps:

##### The OAuth Workaround

When Claude Code starts OAuth, it prompts you to visit an URL that contains a `redirect_uri` with `localhost:<PORT>` parameter. The port is most likely to be random.

The way I found to work around this was to:

1. Note the `redirect_uri` port from the OAuth URL
2. Open another terminal on my host
3. Run: `ssh -L 53744:localhost:53744 workspace.devpod` (replace `53744` with the actual port number you got)
4. Click the OAuth URL in your browser (or copy/paste if it was truncated)
5. Authorize in browser
6. OAuth callback completes through the SSH tunnel ✅

How this works? Well, `-L` (local port forwarding) forwards your host's browser traffic to the container where Claude Code's OAuth listener is waiting. You only need the tunnel for like 30 seconds during the OAuth flow.

This is **only needed for initial OAuth authentication** though. Once you've authenticated an MCP server, it works normally without port forwarding. The credentials persist, so you only do this dance once per MCP server.

I know, this is manual and requires quick action, but it works reliably. There are probably fancier automated solutions out there, but not worth the complexity for a one-time thing.

## The Honest Friction Points

### Shortcut Conflicts and Muscle Memory

As a Cursor user I'd just press `Ctrl+T` in Claude Code to open the list of todos and get my list toggled. With Zellij, I had to do some reading to customize settings and make things work.

It sucks, but fine-tuning configs and adapting muscle memory goes a long way to "tune up our brains" IMO. For me, it took less than a week to adjust and now I'm fluent with the unlock-first workflow plus the extra `Alt+` mappings for common operations.

### SSH Agent + Zellij Environment Hell

If we detach from Zellij (`Ctrl+D`), `exit` from SSH session and come back in then git might stop working due to `Permission denied (publickey)`.

The reason this happens is because the `SSH_AUTH_SOCK` environment variable still points to a socket file that got cleaned up when you disconnected. Zellij preserved the old environment, but the actual socket is gone. My recommendation is to always exit Zellij when disconnecting from containers.

IIRC there are complex workarounds involving symlinks and socket management. They're not worth it. This is just friction you accept.

## Wrapping Up

For me, this is a workflow I'm comfortable with - just needed to adapt to new tooling. The benefit is that I configure everything and understand what's happening under the hood. Solving these friction points teaches me more than clicking buttons in an IDE ever would. After about 2 weeks of daily use, the friction is acceptable - almost gone.

## Resources

**Official Documentation:**

- [Zellij Documentation](https://zellij.dev/documentation/)
- [Claude Code Documentation](https://code.claude.com/docs/claude)

**Related Posts:**

- [DevPod: SSH-Based Devcontainers](/blog/2025/11/11/devpod-ssh-devcontainers/) - DevPod setup and SSH access
- [Neovim and LazyVim for Rails Development](/blog/2025/11/20/neovim-lazyvim-rails-ssh/) - Editor setup, Ruby LSP, and configuration
- [Zellij as Part of Your Development Workflow](https://haseebmajid.dev/posts/2024-12-18-part-7-zellij-as-part-of-your-development-workflow/) - Practical Zellij setup guide (Dec 2024)
- [Terminal-Based Development with Neovim, tmux, and CLI Tools](https://joshuamichaelhall.com/blog/2025/03/23/terminal-based-development-environment/) - Full terminal setup walkthrough (March 2025)
- [Zellij vs Tmux](https://typecraft.dev/tutorial/zellij-vs-tmux) - Feature comparison for choosing a multiplexer
