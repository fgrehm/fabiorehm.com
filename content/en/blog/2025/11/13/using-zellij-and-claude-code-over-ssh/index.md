---
title: "Using Zellij and Claude Code Over SSH"
date: 2025-11-13
draft: true
description: "What it's actually like to use SSH-based development with Zellij and Claude Code CLI. The good parts, the gotchas, and the friction that IDE users don't deal with."
tags:
  - terminal
  - zellij
  - ssh
  - workflow
  - claude-code
  - devpod
---

```text
TODO(@fabio/@claude): When publishing this post, make these cross-link updates:
  - Update series index at `/blog/2025/11/11/modernizing-my-terminal-based-dev-environment/` to add link to this post in Part 2 section
  - Update DevPod post at `/blog/2025/11/11/devpod-ssh-devcontainers/` to uncomment the cross-link at top and fix the path to this post's final published path
  - Fix all `/drafts/` references in this file to use correct `/blog/2025/11/13/` paths once published
```

**Note:** This post covers the daily terminal workflow experience with Zellij and Claude Code. For related topics, see:
- [DevPod: SSH-Based Devcontainers](/blog/2025/11/11/devpod-ssh-devcontainers/) - DevPod setup and SSH access
- [Neovim and LazyVim for Rails Development](/blog/2025/11/14/neovim-lazyvim-rails-ssh/) - Editor setup, Ruby LSP, and configuration

## The Setup

I recently switched to SSH-based development using DevPod for devcontainers (see [DevPod post](/blog/2025/11/11/devpod-ssh-devcontainers/) for the devcontainer setup). This post is about what daily development actually feels like with this workflow.

**The stack:**

- **SSH into containers** - DevPod gives me SSH access to devcontainers
- **Zellij** - Terminal multiplexer (tabs, panes, persistent sessions)
- **Claude Code** - AI coding assistant (CLI, not GUI)
- **Oh My Zsh** - Shell with custom prompt
- **Neovim / LazyVim** - IDE... (covered in a separate post `TODO: Link to other post`)

This post focuses on the terminal multiplexer (Zellij) and AI assistant (Claude Code CLI) experience. For editor setup (Neovim/LazyVim), see the [companion post](/drafts/neovim-lazyvim-rails-ssh/).

For setup details (config persistence, git signing fixes, port forwarding), see the [DevPod post](/blog/2025/11/11/devpod-ssh-devcontainers/).

## The Daily Workflow

My actual workflow is straightforward:

```bash
# From host terminal
bin/dpod up      # Start devcontainer

# SSH in
bin/dpod ssh

# Inside container - start zellij
zellij

# Work from inside zellij + browser
# - Start Rails server in one tab/pane
# - Run tests, Claude Code, migrations in others
# - Open browser to localhost:3000
```

That's it. No named sessions, no complex layouts - just SSH in, start zellij, and get to work.

**Note:** `bin/dpod` is a wrapper script that makes DevPod easier to use with project-specific defaults. See the [DevPod post's "Workspace Stickiness" section](/blog/2025/11/11/devpod-ssh-devcontainers/#workspace-stickiness) for the full implementation.

**What works great:**

- ✅ Shift+click links in zellij (e.g., Claude auth URLs open in browser)
- ✅ Claude Code running inside container with full context and access to what it needs to do its job (`ruby`, `nodejs`, etc)
- ✅ Tests, migrations, everything just works
- ✅ Port forwarding handled automatically by DevPod / Docker Compose (Rails on `localhost:3000`, database on `...`, etc.)
- ✅ Persistent sessions survive SSH disconnects (a Zellij feature covered below)

SSH agent forwarding for git operations (signing, pushing, etc.) works, but there are some gotchas - see the [DevPod post's Git Signing section](/blog/2025/11/11/devpod-ssh-devcontainers/#git-signing-the-devpod-gotcha) for details.

## Zellij & Claude Code

### Zellij

Zellij is a terminal multiplexer - a tool that lets you run multiple terminal sessions inside a single window with tabs and panes. If you're new to the concept, check out [this comparison guide](https://typecraft.dev/tutorial/zellij-vs-tmux) for an introduction.

What works great:

- **Visual tabs and panes:** Zellij shows status bar with tabs, makes it obvious what's running where.
- **Persistent sessions:** Sessions survive SSH disconnects. Reattach and everything's still there.
- **Shift+click links:** URLs in terminal output are clickable. Claude Code auth links just work.

#### Common Gotchas

**Accidental quit (Ctrl+Q):**

Hit `Ctrl+Q` and zellij closes. Sometimes `zellij attach` recovers your session - restoring tabs and prompting to resume running commands. Other times you're hunting for the process in `htop`.

**Why recovery is unreliable:**

Session resurrection in Zellij has [documented issues](https://github.com/zellij-org/zellij/issues/4129):
- First pane in tabs often restores to home directory instead of original location
- Environment variables not always respected
- Sessions can get lost between version upgrades
- Ctrl+Q deletes the session by default (not just detach)

**Lesson learned:** Use named sessions (`zellij attach project-name --create`) to make it easier to find and reattach to the right session. Random names like "colorful-aardvark" work fine for persistence, but they're hard to remember when you have multiple projects running.

**Keyboard shortcut conflicts:**

Zellij's default keybindings intercept shortcuts needed by Claude Code, nvim and potentially other tools:

- `Ctrl+T` - zellij new tab (blocks Claude Code)
- `Ctrl+O` - zellij pane navigation (blocks Claude Code)
- Workaround: `Ctrl+G` locks zellij, passes shortcuts through
- Problem: `Ctrl+G` is also nvim's edit prompt trigger

**Solution: Unlock-First Preset**

Zellij includes an "Unlock-First (non-colliding)" preset that solves these conflicts. Like tmux's `Ctrl+A` prefix pattern, you unlock first, then access modes. This keeps `Alt+Arrow` navigation working freely.

<figure>
  <img src="zellij-unlock-first-preset.png" alt="Zellij configuration showing Unlock-First preset option">
  <figcaption>Zellij's built-in preset for avoiding keybinding conflicts</figcaption>
</figure>

**How to enable:**
1. Press `Ctrl+O` then `C` (Configuration menu)
2. Navigate to "Change mode behavior" tab
3. Select "Unlock-First (non-colliding)"
4. Press `Ctrl+A` to save permanently (not just Enter!)

**How it works:**
- **Default state:** Locked mode - all shortcuts pass through to apps
- **Unlock:** `Ctrl+G` enters normal mode
- **Access modes:** Press `p` (panes) or `t` (tabs) - no Ctrl needed
- **Your navigation:** `Alt+Arrow` works freely in locked mode

This feels natural if you're used to tmux's prefix key workflow. Read more in the [official tutorial on colliding keybindings](https://zellij.dev/tutorials/colliding-keybindings/).

**Note:** `Ctrl+G` unlock conflicts with Claude Code's "edit prompt in nvim" shortcut. You can remap the unlock key to something else (like `Ctrl+A` for tmux users) - see the "Tmux-Style Ctrl+A Configuration" section below for details.

Terminal multiplexers add shortcut complexity. You'll lock/unlock accidentally, hit the wrong binding, and occasionally lose work. VSCode/Cursor don't have this friction. But with unlock-first, the friction became minimal.

#### No Clickable File Paths from Terminal Output

In IDEs like VS Code or terminals like iTerm2, you can Cmd+Click or Ctrl+Click on file paths in output (like test failures, stack traces) to open them. This doesn't work in Zellij over SSH.

**Workarounds:**
- Copy file path → `:e <paste>` in nvim
- Use terminal emulator features (WezTerm, Kitty, iTerm2) if they support clickable paths over SSH

Not a dealbreaker, but you'll miss this convenience from GUI IDEs.

**Note on tab activity monitoring:** Zellij doesn't have built-in tab activity indicators like tmux's `monitor-activity`. There's a [zj-status-bar](https://github.com/cristiand391/zj-status-bar) plugin that tracks command completion, but I haven't found the need for it yet. Might revisit if background tab monitoring becomes a pain point.

**Tips:**

**Named sessions (optional):**

If you work on multiple projects simultaneously, named sessions make it easier to find and switch between them:

```bash
# Named session
zellij attach my-app --create

# Auto-generated name (e.g., "colorful-aardvark")
zellij
```

Auto-generated names work fine for single-project workflows. The persistence mechanism is the same either way. Named sessions are about convenience when juggling multiple projects, not reliability.

#### List Running Sessions

```bash
zellij list-sessions
```

If you're not sure what's running, check before creating a new session.

#### Quick Pane Creation

**Note:** These shortcuts assume you're using the unlock-first preset described above.

- `Alt+N` - Create new pane (placement is non-deterministic - Zellij guesses where)
- `Alt+F` - Open floating pane that overlays your workspace
- `Ctrl+A` → `p` → `i` - Toggle pin on floating pane (keeps it visible across tabs - essential for monitoring output)

**The trade-off:** `Alt+N` is way more ergonomic than `Ctrl+A` → `p` → `n` for quick pane creation, but you sacrifice predictable placement. For most ad-hoc layouts, the convenience wins.

**For predictable placement:** Use pane mode - `Ctrl+A` → `p` → `r` (right) or `d` (down)

#### Pane Resizing

- `Alt++` / `Alt+-` - Increase/decrease pane size

**Advanced:** Alt+N can be made deterministic using [swap layouts](https://zellij.dev/documentation/swap-layouts) which define rules for pane arrangement based on pane count, but requires configuration.

**Quick tip for tmux users:**

If you're coming from tmux and want Ctrl+A as your prefix instead of Ctrl+G, you'll need to manually edit `~/.config/zellij/config.kdl` (the wizard won't let you because Ctrl+A saves configs). Expand below for a complete tmux-style config example.

<details>
<summary>Zellij Configuration Details</summary>

**Named Sessions with Auto-Naming**

Shell function for auto-naming sessions based on directory (add to `.zshrc` or `.bashrc`):

```bash
za() {
  local session_name=${1:-${PWD:t}}
  zellij attach "$session_name" || zellij -s "$session_name"
}
```

**Usage:** In `~/projects/my-app`, run `za` → creates/attaches to session "my-app"

**Clear Scrollback with Ctrl+K**

Add to `~/.config/zellij/config.kdl`:

```kdl
keybinds {
    shared_among "normal" "locked" {
        bind "Ctrl k" { Clear; }  // Clear scrollback (like tmux)
    }
}
```

**Gotcha:** Clears the prompt too - just hit Enter after Ctrl+K to get your prompt back.

**Tmux-Style Ctrl+A Configuration**

For complete tmux parity with Ctrl+A prefix, edit `~/.config/zellij/config.kdl`:

```kdl
keybinds clear-defaults=true {
    // Start in locked mode by default (like tmux)
    normal clear-defaults=true {
        bind "Ctrl a" { SwitchToMode "tmux"; }
    }

    // Locked mode - Ctrl+A unlocks to tmux mode
    locked {
        bind "Ctrl a" { SwitchToMode "tmux"; }
    }

    // Tmux mode - single key shortcuts after Ctrl+A
    tmux clear-defaults=true {
        bind "Ctrl a" { Write 2; SwitchToMode "locked"; }  // Ctrl+A twice sends Ctrl+A to terminal
        bind "Esc" { SwitchToMode "locked"; }
        bind "p" { SwitchToMode "pane"; }
        bind "t" { SwitchToMode "tab"; }
        bind "1" { GoToTab 1; SwitchToMode "locked"; }
        bind "2" { GoToTab 2; SwitchToMode "locked"; }
        // ... add more as needed
    }

    shared_except "locked" "tmux" {
        bind "Ctrl a" { SwitchToMode "locked"; }
    }
}

default_mode "locked"
```

**Note:** The full tmux-style config requires careful setup. For simpler needs, stick with the unlock-first preset from the wizard and just use Ctrl+G.

</details>

**Layouts for repeatable setups:**

For workflows you repeat often, layouts can automate your pane setup. Here's a Rails development layout with server logs, Claude Code, and nvim:

<details>
<summary>Rails Development Layout Example</summary>

**Save as:** `~/.config/zellij/layouts/rails-dev.kdl`

```kdl
layout {
  default_tab_template {
    pane size=1 borderless=true {
      plugin location="zellij:tab-bar"
    }
    children
    // Removed status-bar - uses global config instead
  }

  tab name="dev" {
    pane split_direction="horizontal" {
      pane size="35%" command="bin/dev" {
        start_suspended true
        close_on_exit false
        name "server"
      }
      pane split_direction="vertical" {
        pane size="30%" command="claude --continue" {
          start_suspended true
          close_on_exit false
          name "shell"
        }
        pane size="70%" command="nvim" {
          start_suspended true
          close_on_exit false
          name "editor"
        }
      }
    }
  }
}
```

**Usage:**
```bash
zellij -l rails-dev
# or with named session
zellij -s my-project -l rails-dev
```

**Key features:**
- `default_tab_template` with `children` - Tab bar shows on all tabs (including new ones)
- `start_suspended true` - Commands show "Press ENTER to run..." instead of auto-starting
- `close_on_exit false` - Panes stay open when command exits (see errors/exit status)
- Status bar uses global config for cleaner unlock-first display

**Layout structure:**
- Top pane (35%): Rails server logs
- Bottom-left (30%): Claude Code in continue mode
- Bottom-right (70%): Neovim editor

**Honestly?** Most of the time you don't need layouts. Just start Zellij and create panes manually with `Alt+N` or `Alt+F`. But for specific workflows you run daily, layouts save setup time.

</details>

### Claude Code CLI

Running Claude Code via CLI instead of GUI has tradeoffs.

**What works:**

- Full terminal integration (Claude runs where your code runs)
- No context switching between IDE and terminal
- **No aggressive scrolling issues:** Unlike my Cursor experience, the CLI doesn't suffer from the [terminal scrolling bug](https://github.com/anthropics/claude-code/issues/826) that causes the "stroboscope effect" I experienced frequently in Cursor.

**What's different:**

- Keyboard shortcuts conflict with zellij (need lock mode)
- No GUI for browsing chat history (terminal-only interface)
- Need to remember CLI flags instead of clicking buttons

**Quick wins:**

- **Multiline input:** Two options:
  - **Shift+Enter:** Add this to `~/.config/alacritty/alacritty.toml`:
    ```toml
    [[keyboard.bindings]]
    key = "Return"
    mods = "Shift"
    chars = "\n"
    ```
    Works perfectly over SSH! Configures Shift+Enter at the terminal emulator level.
  - **Ctrl+G:** Opens prompt in nvim for full editor power, perfect for longer messages (conflicts with Zellij unlock, use in locked mode)

**Current gotchas:**

- **Image pasting not working yet:** Can't paste images into Claude Code chat over SSH. Text clipboard works via OSC 52, but images don't. [Multiple GitHub issues](https://github.com/anthropics/claude-code/issues/1361) track this problem.

**Honest take:** The CLI feels faster for quick questions, but the GUI is better for reviewing long conversations. I miss being able to scroll through history visually. The clipboard issue is annoying but solvable.

**MCP Server OAuth in SSH Environments:**

Using MCP servers with OAuth authentication over SSH adds complexity. The OAuth flow redirects to `localhost:PORT` after authentication, but when Claude Code runs inside an SSH session, that localhost is the container - not your host machine's browser.

**What works:**
- **HTTP MCP servers** (Figma, Notion, etc.) - All require the quick port forwarding workaround below

**The OAuth Workaround:**

When Claude Code starts OAuth, it shows a URL like `https://figma.com/oauth/mcp?...&redirect_uri=http://localhost:53744/callback`. The port (53744 in this example) is random.

**Quick fix:**
1. Note the port from the OAuth URL
2. Open another terminal on your host
3. Run: `ssh -L 53744:localhost:53744 workspace.devpod` (replace port number)
4. Click the OAuth URL in your browser (or copy/paste if it was truncated)
5. Authorize in browser
6. OAuth callback completes through the SSH tunnel ✅

**Why this works:** `-L` (local port forwarding) forwards your host's browser traffic to the container where Claude Code's OAuth listener is waiting. You only need the tunnel for ~30 seconds during the OAuth flow.

**Important:** This is **only needed for initial OAuth authentication**. Once you've authenticated an MCP server, it works normally without port forwarding. The credentials persist, so you only do this dance once per MCP server.

**Trade-off:** It's manual and requires quick action, but works reliably. More automated solutions (dynamic port forwarding with SOCKS proxy, pre-forwarding a port range) exist but add complexity for what's essentially a one-time authentication per MCP server.

## The Honest Friction Points

### Shortcut Gymnastics

IDE users press `Ctrl+T` and get what they expect. I press `Ctrl+T` and zellij intercepts it. I press `Ctrl+G` to lock zellij. Now Claude Code gets `Ctrl+T`. But wait, `Ctrl+G` also conflicts with Claude Code's "edit prompt in editor" feature.

You learn the dance. But it's a dance.

### Session Recovery Uncertainty

When zellij crashes or I accidentally quit, sometimes recovery works perfectly. Sometimes it doesn't. I don't know why. IDE users close their editor and everything's exactly where they left it.

### Manual Configuration

Every tool needs configuration:

- Zellij config for keybindings and layouts
- Shell config for aliases/prompt
- Git config for signing
- Claude Code for MCP servers

IDE users install an extension and it just works. I write setup scripts and debug when they break.

### SSH Agent + Zellij Environment Hell

Detach from Zellij (`Ctrl+D`), close your terminal, reconnect to SSH, reattach to Zellij - and git stops working. `Permission denied (publickey)`.

**What happened:** The `SSH_AUTH_SOCK` environment variable still points to a socket file that got cleaned up when you disconnected. Zellij preserved the old environment, but the actual socket is gone.

**The fix:** Exit Zellij entirely (`Ctrl+Q`), exit SSH, reconnect, start Zellij fresh. Or just close your terminal window without detaching (keeps SSH connected).

**Why this matters:** IDE users never think about SSH agent socket paths. I need to remember not to detach if I'm going to disconnect SSH, or I'll break git authentication.

There are complex workarounds involving symlinks and socket management. They're not worth it. This is just friction you accept.

## What I'm Still Figuring Out

**Zellij keybinding customization:** Want to use `Ctrl+A` as prefix instead of `Ctrl+G` (coming from tmux background). The configuration wizard uses `Ctrl+A` for saving configs, so you can't rebind it through the UI. Will need to manually edit `~/.config/zellij/config.kdl`. See "Zellij Configuration Details" section for tmux-style config examples.

**Session backup/restore:** Zellij has `Ctrl+O` then tab to resurrect recently closed sessions, but it feels unreliable. Sometimes it works perfectly, sometimes it doesn't. Need to investigate if there are settings to make resurrection more consistent.

## Why Do This At All?

**Control:** I configure everything. I understand what's happening under the hood.

**Speed:** SSH into container, start zellij, get to work. 8.7 seconds total. No GUI loading time.

**Flexibility:** Want to try a different multiplexer? Install it. Different shell? Configure it. Different editor? Use it. Not locked into an IDE's worldview.

**Worktrees:** Multiple branches running simultaneously with dedicated ports/databases. See [git worktrees post](/drafts/git-worktrees-docker-parallel-development/) for details.

**Learning:** Solving these friction points teaches you more about terminals, shells, and SSH than clicking buttons in an IDE ever would.

## Is This Worth It?

**If you're already terminal-based:** Yes. You're used to the friction. You value the control. This gives you SSH-based devcontainers without forcing you into an IDE.

**If you're learning terminal tools:** Maybe. You'll learn a lot. You'll also fight with shortcuts, lose sessions occasionally, and wonder why you didn't just use VSCode.

**If you're happy with VSCode/Cursor:** No. Stay there. The IDE integration works well. This isn't an upgrade for you - it's a lateral move with different tradeoffs.

### The Tradeoff

**IDE users get:**
- Zero friction
- Automatic setup
- GUI for everything
- Consistent shortcuts
- Reliable state persistence

**Terminal users get:**
- Manual configuration
- Understanding of the stack
- Flexibility to change tools
- SSH-based workflow
- Occasional friction

Neither is necessarily better. It's a preference.

### My Take

After a week of daily use, the friction is acceptable. The shortcut conflicts are annoying but learnable. The session recovery uncertainty is frustrating but rare. The manual configuration is time-consuming but educational.

Is it better than VSCode/Cursor? No. It's different. It trades IDE convenience for terminal flexibility. Whether that's worth it depends entirely on what you value.

For me: I'm sticking with it. The control and understanding are worth the friction.

## Resources

**Official Documentation:**

- [Zellij Documentation](https://zellij.dev/documentation/)
- [Claude Code Documentation](https://code.claude.com/docs/claude)

**Related Posts:**

- [DevPod: SSH-Based Devcontainers](/blog/2025/11/11/devpod-ssh-devcontainers/) - DevPod setup and SSH access
- [Neovim and LazyVim for Rails Development](/blog/2025/11/14/neovim-lazyvim-rails-ssh/) - Editor setup, Ruby LSP, and configuration
- [Zellij as Part of Your Development Workflow](https://haseebmajid.dev/posts/2024-12-18-part-7-zellij-as-part-of-your-development-workflow/) - Practical Zellij setup guide (Dec 2024)
- [Terminal-Based Development with Neovim, tmux, and CLI Tools](https://joshuamichaelhall.com/blog/2025/03/23/terminal-based-development-environment/) - Full terminal setup walkthrough (March 2025)
- [Zellij vs Tmux](https://typecraft.dev/tutorial/zellij-vs-tmux) - Feature comparison for choosing a multiplexer

---

## Future Investigations

Items worth exploring but not yet tested or documented:

**Ergonomic Keybindings:**
- Alt+R for rename tab (vs. Ctrl+A → t → r)
- Alt+I for toggle floating pane pin (vs. Ctrl+A → p → i)
- Alt+T for new tab (matches Alt+N for new pane)

**Zellij Feature Request:**
- Alt+N should consider terminal window size when deciding split direction (wide → vertical, tall → horizontal)

**Floating Pane Pin Toggle:**
- Manual toggle works (Ctrl+A → p → i), but investigating simpler shortcuts

These are on my radar for future refinement of this workflow.
