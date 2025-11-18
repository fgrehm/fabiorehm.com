# Zellij Unlock-First Cheatsheet

## Daily Workflow

- `Ctrl+G` - Unlock (enter normal mode from locked)
- `p` - Enter Pane mode
- `t` - Enter Tab mode
- `Esc` - Return to locked mode

## Pane Management

**Enter pane mode:** `Ctrl+G` → `p`

- `n` - New pane
- `h` / `j` / `k` / `l` - Navigate panes (vim-style)
- `←` / `↓` / `↑` / `→` - Navigate panes (arrows)
- `d` - New pane below
- `r` - New pane to the right
- `f` - Toggle fullscreen
- `e` - Toggle floating/embedded
- `x` - Close pane
- `w` - Toggle floating panes
- `z` - Toggle pane frames
- `c` - Rename pane

## Tab Management

**Enter tab mode:** `Ctrl+G` → `t`

- `n` - New tab
- `h` / `l` - Navigate tabs (vim-style)
- `←` / `→` - Navigate tabs (arrows)
- `r` - Rename tab
- `x` - Close tab
- `1` - `9` - Jump to tab number
- `[` - Break pane left into new tab
- `]` - Break pane right into new tab
- `b` - Break pane into new tab

## Navigation (Always Available in Locked Mode)

- `Alt+←` / `Alt+→` / `Alt+↑` / `Alt+↓` - Navigate between panes/tabs
- These work freely in locked mode without conflicts

## Session Management

- `Ctrl+Q` - Quit zellij
- `zellij attach session-name --create` - Create or attach to named session
- `zellij list-sessions` - List running sessions

## Quick Actions

- `Ctrl+G` → `f` - Toggle floating panes
- `Ctrl+G` → `e` - Edit pane contents in editor

---

**Note:** This cheatsheet is for the "Unlock-First (non-colliding)" preset. Actions automatically return you to locked mode after execution.
