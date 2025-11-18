---
title: "Neovim and LazyVim for Rails Development over SSH"
date: 2025-11-17
draft: false
description: "Setting up Neovim with LazyVim for Rails development over SSH: clipboard integration, Ruby LSP configuration, multi-cursor editing, and honest gotchas."
tags:
  - neovim
  - lazyvim
  - rails
  - ruby-lsp
  - ssh
  - workflow
---

**Note:** This post focuses on Neovim/LazyVim setup for Rails development over SSH. For the DevPod setup and overall terminal workflow, see:
- [DevPod: SSH-Based Devcontainers](/blog/2025/11/11/devpod-ssh-devcontainers/) - DevPod setup and SSH access
- [Using Zellij and Claude Code Over SSH](/blog/2025/11/14/using-zellij-and-claude-code-over-ssh/) - Daily terminal workflow with Zellij and Claude Code

## Why Neovim Over SSH?

When you SSH into a devcontainer, you have two choices: use a terminal-based editor (nvim, vim, nano) or fight with remote editing complexities. I chose Neovim with [LazyVim](https://www.lazyvim.org/) - a preconfigured Neovim distribution with sane defaults, LSP support, and a plugin ecosystem.

**What I'm testing:**

- LSP performance over SSH with large Ruby/TypeScript codebases
- Whether there's noticeable lag compared to native editing
- How reliable autocomplete/diagnostics feel

**So far:** It works. Haven't hit any obvious lag yet, but I'm only a week in. Will update after more daily use.

## LazyVim Setup

My LazyVim config lives in `../../devpod-data/nvim/` (persists across container recreations) and includes:

- Project-specific plugins (e.g., Slim syntax for Rails)
- Shared config across all DevPod workspaces
- Custom tweaks detailed below

**Installation happens via the DevPod setup script** (`.devcontainer-devpod/setup.sh`):
- Installs Neovim v0.11.4
- Clones LazyVim starter
- Installs `ripgrep` and `fd` for telescope/fuzzy finding
- Fixes permissions on mounted config directory

## What Works

### Clipboard Integration (OSC 52)

Copying from nvim to host clipboard works perfectly via OSC 52! Yank text with `yy` in nvim, paste on host with `Ctrl+V`.

**For pasting FROM host clipboard INTO nvim:** Use terminal paste (`Ctrl+Shift+V` in insert mode) - OSC 52 paste doesn't work reliably and causes timeout issues.

**Key insight:** OSC 52 is one-directional for this workflow (nvim → host copying only). See "LazyVim Configuration Details" below for complete config.

### Multi-Cursor Editing

Using [vim-visual-multi](https://github.com/mg979/vim-visual-multi) for Ctrl+N style multi-cursor. Select a word, press `Ctrl+N` to add next occurrence, edit simultaneously. Works great for quick refactoring.

**Usage:**
1. Put cursor on a word
2. Press `Ctrl+N` - selects first occurrence
3. Press `Ctrl+N` again - adds next occurrence
4. Press `Ctrl+X` - skip current match
5. Type to edit all cursors simultaneously
6. Press `Esc` to exit multi-cursor mode

### Global Find and Replace

LazyVim ships with [grug-far](https://github.com/MagicDuck/grug-far.nvim) (`<leader>sr`) for project-wide search/replace with visual preview. The interface is a bit unintuitive at first (look for keybinding hints in status bar), but powerful once you get it.

## Current Gotchas

### Clipboard Paste Direction

OSC 52 only works for nvim → host copying. For host → nvim pasting, use `Ctrl+Shift+V` (terminal paste) in insert mode, not `p`. Regular `p` pastes from nvim's internal register.

### Buffer vs Tab Confusion

`Ctrl+W Q` quits Neovim entirely if you're on the last window, not just closing a "tab" (which is actually a buffer). Use `<leader>bd` to close buffers instead.

### Navigation Between Nvim Splits and Zellij Panes

Plugins like `zellij-nav.nvim` promise seamless Alt+Arrow navigation between nvim splits and Zellij panes, but they require [zellij-autolock](https://github.com/fresh2dev/zellij-autolock) to work properly. Without autolock, you get stuck in locked mode when moving from nvim to regular panes.

**Current approach:** Use Ctrl+W H/J/K/L for nvim splits and Alt+Arrow for Zellij panes - different keybindings, but no mode switching headaches.

## LazyVim Configuration Details

<details>
<summary>Buffer Navigation with Ctrl+PageUp/PageDown</summary>

Add to `~/.config/nvim/lua/config/keymaps.lua`:

```lua
-- Buffer navigation with Ctrl+PageUp/PageDown
vim.keymap.set("n", "<C-PageUp>", "<cmd>bprevious<cr>", { desc = "Previous Buffer" })
vim.keymap.set("n", "<C-PageDown>", "<cmd>bnext<cr>", { desc = "Next Buffer" })
```

</details>

<details>
<summary>Show Buffer Numbers in Bufferline</summary>

Create `~/.config/nvim/lua/plugins/bufferline.lua`:

```lua
-- Bufferline configuration - add buffer numbers to make it clear these are buffers, not tabs
return {
  {
    "akinsho/bufferline.nvim",
    opts = {
      options = {
        numbers = "buffer_id", -- Show buffer numbers (1, 2, 3, etc.)
        separator_style = "slant",
      },
    },
  },
}
```

</details>

<details>
<summary>Show Hidden/Gitignored Files in Snacks Explorer</summary>

Create `~/.config/nvim/lua/plugins/snacks.lua`:

```lua
-- Snacks configuration
-- Explorer: Show hidden and gitignored files by default
-- File pickers (<space>ff, <space><space>): Show hidden files, respect .gitignore
return {
  {
    "folke/snacks.nvim",
    opts = {
      picker = {
        sources = {
          explorer = {
            hidden = true,     -- Show hidden files (dotfiles)
            ignored = true,    -- Show gitignored files
          },
          files = {
            hidden = true,     -- Show hidden files in file picker
            -- Note: Gitignored files intentionally excluded from fuzzy finders
            -- This is standard behavior - keeps search results focused
          },
        },
      },
    },
  },
}
```

</details>

<details>
<summary>Disable Relative Line Numbers</summary>

Add to `~/.config/nvim/lua/config/options.lua`:

```lua
-- Disable relative line numbers
vim.opt.relativenumber = false
```

</details>

<details>
<summary>OSC 52 Clipboard Configuration</summary>

Add to `~/.config/nvim/lua/config/options.lua`:

```lua
-- OSC 52 clipboard over SSH - copy only
-- Yank (y) copies to system clipboard via OSC 52
-- Paste (p) uses nvim's internal registers only (OSC 52 paste doesn't work reliably)
-- For pasting from system clipboard, use terminal paste (Ctrl+Shift+V in insert mode)
local osc52 = require("vim.ui.clipboard.osc52")
vim.g.clipboard = {
  name = "OSC 52",
  copy = {
    ["+"] = osc52.copy("+"),
    ["*"] = osc52.copy("*"),
  },
  paste = {
    ["+"] = function()
      return vim.split(vim.fn.getreg('"'), '\n')
    end,
    ["*"] = function()
      return vim.split(vim.fn.getreg('"'), '\n')
    end,
  },
}
```

</details>

<details>
<summary>Multi-Cursor Plugin</summary>

Create `~/.config/nvim/lua/plugins/vim-visual-multi.lua`:

```lua
-- vim-visual-multi: Multi-cursor support (Ctrl+N style)
return {
  {
    "mg979/vim-visual-multi",
    branch = "master",
    init = function()
      vim.g.VM_maps = {
        ["Find Under"] = "<C-n>",           -- Start multi-cursor, add next match
        ["Find Subword Under"] = "<C-n>",
        ["Select All"] = "<C-A-n>",         -- Select all matches
        ["Skip Region"] = "<C-x>",          -- Skip current match
        ["Remove Region"] = "<C-p>",        -- Go back to previous match
      }
    end,
  },
}
```

</details>

## Ruby LSP Setup for Rails Projects

For Rails development, getting Ruby LSP working properly requires avoiding Mason's global installation approach. Here's why and how to fix it.

### The Problem with Mason

When LazyVim uses Mason to install ruby-lsp globally, you hit several issues:

1. **Version Mismatch**: Mason installs ruby-lsp using system Ruby, which often differs from your project's Ruby version
2. **Missing Project Context**: The globally installed ruby-lsp doesn't have access to your project's gems in the Gemfile
3. **C Extension Issues**: Ruby LSP dependencies include C extensions that rely on the Ruby ABI, causing compatibility problems across Ruby versions
4. **Mason v2 Changes**: Recent breaking changes in mason.nvim (v2.0.0, May 2025) renamed plugins and internal APIs

### The Solution: Use Your Bundled ruby-lsp Gem

Instead of fighting with Mason, use the [adam12/ruby-lsp.nvim](https://github.com/adam12/ruby-lsp.nvim) plugin which:
- Uses your project's bundled ruby-lsp gem (from Gemfile)
- Runs via `bundle exec ruby-lsp` ensuring correct Ruby version
- Automatically configures lspconfig without Mason interference
- Provides Rails-specific code lens features (jump to views/routes, run tests, etc.)

**Step 1: Ensure ruby-lsp is in Your Gemfile**

```ruby
# Gemfile
group :development do
  gem 'ruby-lsp', require: false
end
```

Run `bundle install` to install it.

**Step 2: Create LazyVim Plugin Configuration**

Create `~/.config/nvim/lua/plugins/ruby-lsp.lua`:

```lua
return {
  -- Use adam12/ruby-lsp.nvim to manage ruby-lsp with the correct Ruby version
  {
    "adam12/ruby-lsp.nvim",
    dependencies = {
      "nvim-lua/plenary.nvim",
      "neovim/nvim-lspconfig",
    },
    ft = "ruby",
    opts = {
      -- Don't auto-install - use the bundled gem from Gemfile
      auto_install = false,
      -- Pass configuration to lspconfig
      lspconfig = {
        cmd = { "bundle", "exec", "ruby-lsp" },
        init_options = {
          formatter = "rubocop",
          linters = { "rubocop" },
        },
      },
    },
  },

  -- Disable Mason from managing ruby_lsp
  {
    "mason-org/mason-lspconfig.nvim",
    optional = true,
    opts = function(_, opts)
      opts.ensure_installed = opts.ensure_installed or {}
      -- Remove ruby_lsp from auto-install list
      opts.ensure_installed = vim.tbl_filter(function(server)
        return server ~= "ruby_lsp"
      end, opts.ensure_installed)
    end,
  },

  -- Prevent LazyVim from setting up ruby_lsp via default mechanism
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        ruby_lsp = {
          mason = false,
        },
      },
      setup = {
        ruby_lsp = function()
          return true -- Skip default setup, handled by ruby-lsp.nvim
        end,
      },
    },
  },
}
```

**Step 3: Verify It's Working**

1. Restart Neovim completely
2. Open a Ruby file: `nvim app/models/user.rb`
3. Check LSP status: `:LspInfo`

You should see `ruby_lsp` with cmd: `["bundle", "exec", "ruby-lsp"]`

Test LSP features:
- `gd` - Go to definition
- `K` - Show documentation hover
- `<leader>ca` - Code actions
- `<leader>cr` - Rename symbol

### Performance Considerations: Git Worktrees

**Current limitation:** Each git worktree creates its own ruby-lsp index independently.

If you have multiple worktrees like:
```bash
/workspaces/web                           # main branch
/workspaces/web-worktrees/feature-1       # worktree 1
/workspaces/web-worktrees/feature-2       # worktree 2
```

Each worktree will:
- Create its own `.ruby-lsp/` directory
- Re-index the entire project + all gems from scratch
- **No shared caching** between worktrees
- 3 worktrees = 3x full indexing time

**Index caching is not yet implemented** as of 2025. Open feature requests:
- [Issue #1040](https://github.com/Shopify/ruby-lsp/issues/1040): Project-based index caching
- [Issue #1009](https://github.com/Shopify/ruby-lsp/issues/1009): Gem index caching

The ruby-lsp team estimates caching could save **5+ seconds** on project load.

### Optimizing Index Performance

You can reduce indexing time by excluding unnecessary files and gems. Create `.ruby-lsp/config.yml` in your project root:

```yaml
# Exclude test files (indexed by default)
excluded_patterns:
  - "spec/**/*.rb"
  - "test/**/*.rb"
  - "features/**/*.rb"

# Exclude gems you never navigate to
excluded_gems:
  - "rubocop"
  - "rubocop-rails"
  - "rubocop-rspec"
  - "rspec-core"
  - "rspec-expectations"
  - "rspec-mocks"
  - "factory_bot"
  - "faker"
  - "debug"
  - "web-console"
  # Add any gems you use but never "go to definition" into

# Include gems normally excluded (development group gems are excluded by default)
included_gems:
  - "ruby-lsp"  # if you want to navigate into ruby-lsp source
```

**Default indexing behavior:**
- Indexes all Ruby files in project and dependencies
- **Excludes** gems in `:development` group by default
- **Excludes** `test/**/*.rb` files by default

**Configuration notes:**
- `.index.yml` is deprecated - use `.ruby-lsp/config.yml` instead
- Excluding large dev/test gems can significantly reduce index size
- Changes require restarting ruby-lsp (`:LspRestart` in Neovim)

**Workaround strategies for worktrees:**
1. **Exclude development gems** (biggest impact) - See config example above
2. **Single Neovim instance** - Open buffers from multiple worktrees in one Neovim session
3. **Symbolic links** - ⚠️ Untested and unsupported, may cause path issues

## The Honest Take

**What works great:**
- ✅ Full LSP support over SSH with no noticeable lag
- ✅ Clipboard integration (nvim → host) via OSC 52
- ✅ Multi-cursor editing for quick refactoring
- ✅ Global find/replace with visual preview
- ✅ Ruby LSP with bundled gems (correct versions, project context)

**What's different from IDEs:**
- ⚠️ Clipboard paste is terminal-based, not OSC 52
- ⚠️ Buffer/tab mental model takes adjustment
- ⚠️ Navigation between nvim splits and Zellij panes requires different keybindings
- ⚠️ Ruby LSP indexing happens per-worktree (no shared cache)
- ⚠️ Manual configuration for everything

**Would I use this daily?**

Yes. The control over my editor, understanding of the stack, and terminal flexibility are worth the manual configuration. But it's not necessarily better than VSCode/Cursor - it's different tradeoffs that match my preferences.

## Resources

**Official Documentation:**

- [LazyVim](https://www.lazyvim.org/)
- [Neovim](https://neovim.io/)
- [adam12/ruby-lsp.nvim](https://github.com/adam12/ruby-lsp.nvim)
- [Ruby LSP Official Docs](https://shopify.github.io/ruby-lsp/)
- [vim-visual-multi](https://github.com/mg979/vim-visual-multi)
- [grug-far](https://github.com/MagicDuck/grug-far.nvim)

**Related Posts:**

- [DevPod: SSH-Based Devcontainers](/blog/2025/11/11/devpod-ssh-devcontainers/) - DevPod setup
- [Using Zellij and Claude Code Over SSH](/blog/2025/11/14/using-zellij-and-claude-code-over-ssh/) - Daily terminal workflow
- [Index Caching Feature Request #1040](https://github.com/Shopify/ruby-lsp/issues/1040)
