---
title: "Neovim and LazyVim for Rails Development over SSH"
date: 2025-11-20
lastmod: 2025-11-26
description: "Using Neovim and LazyVim for Rails development over SSH - the good parts, the LSP friction, and what keeps me in the terminal anyway."
tags:
  - neovim
  - vim
  - lazyvim
  - rails
  - ruby-lsp
  - ssh
  - remote-development
  - osc52
  - workflow
---

_**NOTE:** This is Part 3 of the [Modernizing my Terminal-Based Development Environment](/blog/2025/11/11/modernizing-my-terminal-based-dev-environment/) series._

---

## The Editor Setup

When you SSH into a devcontainer, you have two choices: use a terminal-based editor (nvim, vim, nano) or use an IDE with [remote development extensions][vscode-remote-ssh] (VS Code and others handle this pretty well). I chose Neovim with [LazyVim][lazyvim] - a preconfigured Neovim distribution with sane defaults, LSP support, and a plugin ecosystem.

Once a vim user, always a vim user. I was even using vim keybindings in Cursor, so going back to actual Neovim felt natural.

## LazyVim Setup

The LazyVim config for my DevPods lives outside of containers and is mounted in my host machine. The config includes things like project-specific plugins (e.g., Slim syntax for Rails) and other custom tweaks detailed below.

Installation happens through the custom DevPod setup scripts:
- Installs Neovim v0.11.4
- Clones LazyVim starter
- Installs `ripgrep` and `fd` for telescope/fuzzy finding
- Fixes permissions on mounted config directory (for the cases when the folder is created as `root` by docker compose)

## What Works

### Clipboard Integration (OSC 52)

Copying from nvim to host clipboard works perfectly via [OSC 52][osc52] (a terminal escape sequence for clipboard operations)!

- Yank text with `yy` in nvim inside the container, paste on host with `Ctrl+V` / `Ctrl+Shift+V`
- For pasting FROM host clipboard INTO nvim I just use terminal paste (`Ctrl+Shift+V`) in insert mode. OSC 52 paste doesn't seem to work reliably in nvim and causes weird timeout issues.

My learning here was that OSC 52 is basically one-directional for this workflow (nvim -> host copying only). See "LazyVim Configuration Details" below for complete config.

### Multi-Cursor Editing

[vim-visual-multi][vim-visual-multi] works great for [`Ctrl+N` style multi-cursor][sublime-multicursor] (popularized by Sublime Text). Select a word, press `Ctrl+N` to add next occurrence, edit simultaneously. Works great for quick refactoring.

**Usage:**
1. Put cursor on a word
2. Press `Ctrl+N` - selects first occurrence
3. Press `Ctrl+N` again - adds next occurrence
4. Press `Ctrl+X` - skip current match
5. Type `c` to change all cursors simultaneously
6. Press `Esc` to exit multi-cursor mode

### Global Find and Replace

LazyVim ships with [grug-far][grug-far] (`<leader>sr`) for project-wide search/replace with visual preview. The interface is a bit unintuitive at first (look for keybinding hints in status bar), but powerful once you get it.

## The Friction

### Ruby LSP Setup

The [Ruby LSP documentation recommends against using Mason][ruby-lsp-editors] for installation due to Ruby version and C extension compatibility issues. I followed their guidance and landed on a simple config (updated 2025-11-26 from the adam12 plugin approach) using LazyVim's native Ruby LSP support (available since v12.33.0) with `bundle exec ruby-lsp`. See the configuration details below for the full setup.

### Ruby LSP Performance with Git Worktrees

I use [git worktrees][git-worktree] to work on multiple branches simultaneously, and ran into a performance issue: Ruby LSP reindexes the entire project every time you open Neovim. This isn't a bug - it's because Ruby LSP [doesn't have persistent index caching yet][ruby-lsp-issue-1040].

For my work project, that's ~16 seconds of indexing on every nvim startup. With worktrees, each one creates its own `.ruby-lsp/` directory and re-indexes independently, so 3 worktrees = 3x the pain.

I tested aggressive exclusions (specs, test gems, dev tools) via `init_options.indexing` config, but they made zero performance difference for my codebase - most of my files are application code, not tests/gems. Your mileage may vary depending on your project's test-to-code ratio.

There are open feature requests for persistent caching ([Issue #1040][ruby-lsp-issue-1040] for project-based caching, [Issue #1009][ruby-lsp-issue-1009] for gem caching), but no ETA yet.

### Navigation Between Nvim Splits and Zellij Panes

I tried getting seamless Alt+Arrow navigation between nvim splits and Zellij panes working with [zellij-nav.nvim][zellij-nav], but it requires [zellij-autolock][zellij-autolock] which messed up my Zellij setup.

For now I just use `Ctrl+W` `H/J/K/L` for nvim splits and `Alt+Arrow` for Zellij panes - different keybindings, but no mode switching headaches. I'll come back to this another time and see if I can get things working like I used to have in [my "old" tmux days][vim-tmux-navigator].

## LazyVim Configuration Details

These are some things I added to my configs that might be useful to you too.

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

<details>
<summary>Ruby LSP Configuration</summary>

_Updated 2025-11-26: Simplified to use LazyVim's native Ruby LSP support instead of the [adam12/ruby-lsp.nvim][ruby-lsp-nvim] plugin._

Using LazyVim's native Ruby LSP support (available since v12.33.0):
- Use your project's bundled ruby-lsp gem via `bundle exec`
- No extra plugins needed
- Disable Mason to avoid version conflicts

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
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        ruby_lsp = {
          mason = false,
          cmd = { "bundle", "exec", "ruby-lsp" },
          init_options = {
            formatter = "rubocop",
          },
        },
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

</details>

## That's It

I'm happy with the setup. Feels good to be back to my roots after months in Cursor. Multi-cursor editing feels natural, clipboard integration via OSC 52 just works, and Ruby LSP provides the autocomplete/diagnostics I need for daily Rails work.

Still figuring some things out though. LSP doesn't feel as stable as it was in Cursor - not sure if it's ruby-lsp itself or my config yet. Can't get Alt+Arrow navigation to work seamlessly between nvim splits and Zellij panes (gave up on zellij-nav.nvim for now). And there's lots of learning about LazyVim - the plugin ecosystem and configuration approach takes time to internalize.

Overall, it's great. The friction is acceptable and I'm learning more about my tools in the process.

## Resources

**Official Documentation:**

- [LazyVim][lazyvim]
- [Neovim][neovim]
- [Ruby LSP Official Docs][ruby-lsp-docs]
- [vim-visual-multi][vim-visual-multi]
- [grug-far][grug-far]

**Related Posts:**

- [DevPod: SSH-Based Devcontainers](/blog/2025/11/11/devpod-ssh-devcontainers/) - DevPod setup
- [Using Zellij and Claude Code Over SSH](/blog/2025/11/19/using-zellij-and-claude-code-over-ssh/) - Daily terminal workflow
- [Index Caching Feature Request #1040][ruby-lsp-issue-1040]

[vscode-remote-ssh]: https://code.visualstudio.com/docs/remote/ssh
[lazyvim]: https://www.lazyvim.org/
[osc52]: https://github.com/ojroques/vim-oscyank#what-is-osc-52
[vim-visual-multi]: https://github.com/mg979/vim-visual-multi
[sublime-multicursor]: https://www.sublimetext.com/docs/multiple_selection_with_the_keyboard.html
[grug-far]: https://github.com/MagicDuck/grug-far.nvim
[mason-nvim]: https://github.com/williamboman/mason.nvim
[ruby-lsp-nvim]: https://github.com/adam12/ruby-lsp.nvim
[git-worktree]: https://git-scm.com/docs/git-worktree
[ruby-lsp-issue-1040]: https://github.com/Shopify/ruby-lsp/issues/1040
[ruby-lsp-issue-1009]: https://github.com/Shopify/ruby-lsp/issues/1009
[zellij-nav]: https://github.com/swaits/zellij-nav.nvim
[zellij-autolock]: https://github.com/fresh2dev/zellij-autolock
[vim-tmux-navigator]: https://github.com/christoomey/vim-tmux-navigator
[neovim]: https://neovim.io/
[ruby-lsp-docs]: https://shopify.github.io/ruby-lsp/
[ruby-lsp-editors]: https://shopify.github.io/ruby-lsp/editors.html
