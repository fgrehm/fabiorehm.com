---
title: "Neovim and LazyVim for Rails Development over SSH"
date: 2025-11-20
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

When you SSH into a devcontainer, you have two choices: use a terminal-based editor (nvim, vim, nano) or use an IDE with [remote development extensions](https://code.visualstudio.com/docs/remote/ssh) (VS Code and others handle this pretty well). I chose Neovim with [LazyVim](https://www.lazyvim.org/) - a preconfigured Neovim distribution with sane defaults, LSP support, and a plugin ecosystem.

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

Copying from nvim to host clipboard works perfectly via [OSC 52](https://github.com/ojroques/vim-oscyank#what-is-osc-52) (a terminal escape sequence for clipboard operations)!

- Yank text with `yy` in nvim inside the container, paste on host with `Ctrl+V` / `Ctrl+Shift+V`
- For pasting FROM host clipboard INTO nvim I just use terminal paste (`Ctrl+Shift+V`) in insert mode. OSC 52 paste doesn't seem to work reliably in nvim and causes weird timeout issues.

My learning here was that OSC 52 is basically one-directional for this workflow (nvim -> host copying only). See "LazyVim Configuration Details" below for complete config.

### Multi-Cursor Editing

[vim-visual-multi](https://github.com/mg979/vim-visual-multi) works great for [`Ctrl+N` style multi-cursor](https://www.sublimetext.com/docs/multiple_selection_with_the_keyboard.html) (popularized by Sublime Text). Select a word, press `Ctrl+N` to add next occurrence, edit simultaneously. Works great for quick refactoring.

**Usage:**
1. Put cursor on a word
2. Press `Ctrl+N` - selects first occurrence
3. Press `Ctrl+N` again - adds next occurrence
4. Press `Ctrl+X` - skip current match
5. Type `c` to change all cursors simultaneously
6. Press `Esc` to exit multi-cursor mode

### Global Find and Replace

LazyVim ships with [grug-far](https://github.com/MagicDuck/grug-far.nvim) (`<leader>sr`) for project-wide search/replace with visual preview. The interface is a bit unintuitive at first (look for keybinding hints in status bar), but powerful once you get it.

## The Friction

### Ruby LSP Setup

Getting Ruby LSP working took some troubleshooting. LazyVim's default setup uses [Mason](https://github.com/williamboman/mason.nvim) to manage LSP servers, which is convenient for most languages but didn't work well for Rails - the globally installed ruby-lsp didn't have access to my project's gems from the Gemfile.

After pairing with Claude Code, I found [adam12/ruby-lsp.nvim](https://github.com/adam12/ruby-lsp.nvim) as the solution. See the configuration details below for the full setup.

### Ruby LSP Performance with Git Worktrees

I use [git worktrees](https://git-scm.com/docs/git-worktree) to work on multiple branches simultaneously, and ran into a performance issue: each worktree creates its own ruby-lsp index independently. So if you have 3 worktrees, each one will create its own `.ruby-lsp/` directory and re-index the entire project + all gems from scratch. No shared caching between them.

Index caching doesn't seem to be implemented yet, so you're stuck with 3x indexing time if you have 3 worktrees. There are open feature requests for this ([Issue #1040](https://github.com/Shopify/ruby-lsp/issues/1040) for project-based caching, [Issue #1009](https://github.com/Shopify/ruby-lsp/issues/1009) for gem caching).

I haven't tried this yet, but you can reduce indexing time by excluding unnecessary files and gems via `.ruby-lsp/config.yml` in your project root. The config lets you exclude test files, gems you never navigate to (like rubocop, rspec internals, factory_bot, etc.), and include gems that are normally excluded (development group gems and test files are excluded by default). Here's an example:

<details>
<summary>Example .ruby-lsp/config.yml</summary>

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

# Include gems normally excluded (development group gems are excluded by default)
included_gems:
  - "ruby-lsp"  # if you want to navigate into ruby-lsp source
```

Note: `.index.yml` is deprecated, use `.ruby-lsp/config.yml` instead. Changes require restarting ruby-lsp (`:LspRestart` in Neovim).

</details>

### Navigation Between Nvim Splits and Zellij Panes

I tried getting seamless Alt+Arrow navigation between nvim splits and Zellij panes working with [zellij-nav.nvim](https://github.com/swaits/zellij-nav.nvim), but it requires [zellij-autolock](https://github.com/fresh2dev/zellij-autolock) which messed up my Zellij setup.

For now I just use `Ctrl+W` `H/J/K/L` for nvim splits and `Alt+Arrow` for Zellij panes - different keybindings, but no mode switching headaches. I'll come back to this another time and see if I can get things working like I used to have in [my "old" tmux days](https://github.com/christoomey/vim-tmux-navigator).

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

Using [adam12/ruby-lsp.nvim](https://github.com/adam12/ruby-lsp.nvim) instead of Mason:
- Use your project's bundled ruby-lsp gem (from Gemfile)
- Run via `bundle exec ruby-lsp` ensuring correct Ruby version
- Automatically configure lspconfig without Mason interference
- Get Rails-specific code lens features (jump to views/routes, run tests, etc.)

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

</details>

## That's It

I'm happy with the setup. Feels good to be back to my roots after months in Cursor. Multi-cursor editing feels natural, clipboard integration via OSC 52 just works, and Ruby LSP provides the autocomplete/diagnostics I need for daily Rails work.

Still figuring some things out though. LSP doesn't feel as stable as it was in Cursor - not sure if it's ruby-lsp itself or my config yet. Can't get Alt+Arrow navigation to work seamlessly between nvim splits and Zellij panes (gave up on zellij-nav.nvim for now). And there's lots of learning about LazyVim - the plugin ecosystem and configuration approach takes time to internalize.

Overall, it's great. The friction is acceptable and I'm learning more about my tools in the process.

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
- [Using Zellij and Claude Code Over SSH](/blog/2025/11/19/using-zellij-and-claude-code-over-ssh/) - Daily terminal workflow
- [Index Caching Feature Request #1040](https://github.com/Shopify/ruby-lsp/issues/1040)
