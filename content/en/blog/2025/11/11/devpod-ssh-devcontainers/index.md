---
title: "DevPod: SSH-Based Devcontainers Without IDE Lock-in"
date: 2025-11-11
draft: true
description: "How DevPod enables terminal-based devcontainer workflows through SSH, allowing you to use your own tools without VSCode/Cursor lock-in."
tags:
  - devcontainers
  - devpod
  - ssh
  - workflow
  - terminal
  - developer-experience
---

**NOTE:** This is a living document. I'll update as I discover new patterns, gotchas, and solutions while using DevPod daily.

<!--

**Note:** This post focuses on DevPod setup and SSH devcontainer workflow. For the daily terminal workflow experience (zellij, shortcuts, friction), see the companion post: [Terminal-Based Development Workflow](/drafts/terminal-based-development-workflow/).
-->

## The Problem

My team uses [devcontainers](https://containers.dev/) and they're great for consistency - everyone gets the same Ruby version, Postgres, Chrome for system tests... It Works :tm:. New developers run one command and they're productive.

But there's a catch: devcontainers basically require VSCode or Cursor (at least the way most people have it set up?). Sure, you can technically use them without an IDE, but the tooling usually assumes you want a GUI editor (even the `USER` of Docker images are named `vscode`!). For a "terminal-based developer", this is awkward.

I've started using Cursor for devcontainers and its "AI stuff", but it felt wrong. I didn't want the IDE - I just wanted to hop into a terminal inside a container and use my tools. [DevPod promised exactly that](https://devpod.sh/docs/quickstart/vim).

## What is DevPod?

[DevPod](https://devpod.sh/) is an open-source tool for creating reproducible developer environments using the devcontainer specification. Their tagline says it all: ["Codespaces but open-source, client-only and unopinionated"](https://github.com/loft-sh/devpod) - it treats devcontainers as remote machines you SSH into, with [no vendor lock-in](https://devpod.sh/docs/what-is-devpod). IDEs are opt-in :heart_hands:

The development environments in DevPod are called [workspaces](https://devpod.sh/docs/developing-in-workspaces/what-are-workspaces):

> A workspace in DevPod is a containerized development environment, that holds the source code of a project as well as the dependencies to work on that project, such as a compiler and debugger. The underlying environment where the container runs will be created and managed through a DevPod provider. This allows DevPod to provide a consistent development experience no matter where the container is actually running, which can be a remote machine in a public cloud, localhost or even a Kubernetes cluster.

The workflow goes like:

1. `devpod up` - creates or starts your workspace with your desired IDE (or `--ide none` in my case)
2. `ssh workspace-name.devpod` - SSH into the workspace
3. Use your terminal tools (nvim, zellij, whatever) to hack away and GSD

If you are more of a GUI person, you can also use their [desktop app](https://devpod.sh/docs/getting-started/update) to manage containers / workspaces:

<figure>
  <img src="https://devpod.sh/docs/media/devpod-flow.gif" alt="DevPod desktop application workflow showing workspace creation and management">
  <figcaption>DevPod desktop app workflow (source: <a href="https://devpod.sh/docs/what-is-devpod">DevPod documentation</a>)</figcaption>
</figure>

**Note:** DevPod defaults to [OpenVSCode Server](https://github.com/gitpod-io/openvscode-server) (a web-based VS Code) when you don't specify `--ide none`. I learned about this while exploring the project - it's a nice default for GUI users who want to quickly spin up a browser-based IDE.

### Why Not the Official Dev Containers CLI?

The [official `@devcontainers/cli`](https://github.com/devcontainers/cli) exists, but my understanding is that it's heavily designed for VS Code integration. For terminal-based development, it's awkward:

```bash
# Official CLI workflow
devcontainer up --workspace-folder .
devcontainer exec --workspace-folder . bash
# Each command needs devcontainer exec...
```

**Issues:**

- **No SSH support** - must wrap every command in `devcontainer exec`
- **No persistent shell** - each exec is a new process
- **No stop/delete commands** - can't manage workspace lifecycle (marked as TODO [per their README](https://github.com/devcontainers/cli/blame/ac2d5b7aeaf0eff69c25ba923609013b28ed67c2/README.md#L20-L21) for like 3+yrs)
- **Node.js dependency** - requires npm/node runtime

**DevPod difference:**

- **Single binary** - no runtime dependencies, just download and run
- **SSH-based** - standard SSH workflow with persistent sessions
- **Full lifecycle management** - `up`, `stop`, `delete` commands (plus `--recreate` flag)
- **Terminal multiplexers work naturally** - zellij/tmux just work
- **Feels like SSH to a remote dev machine**, not Docker exec wrapper

Both read the same `.devcontainer.json` format, but based on my limited experience, DevPod seems to work better with terminal workflow and daily usability.

## Installation

_Please refer to their [official documentation](https://devpod.sh/docs/getting-started/install#install-devpod-cli) for up to date instructions in case the ones below dont work for you._

```bash
# Install DevPod (Linux)
curl -L -o devpod "https://github.com/loft-sh/devpod/releases/latest/download/devpod-linux-amd64" && \
  sudo install -c -m 0755 devpod /usr/local/bin && \
  rm -f devpod

# macOS users: brew install devpod

# Add and configure Docker provider
devpod provider add docker
devpod provider use docker

# Configure context options like dotfiles (optional)
devpod context set-options -o DOTFILES_URL=https://github.com/yourusername/dotfiles

# Disable telemetry (enabled by default)
devpod context set-options -o TELEMETRY=false
```

**Note on telemetry:** [DevPod sends usage data by default](https://devpod.sh/docs/other-topics/telemetry). Disable it with the command above if you prefer not to share. You can review all context options with `devpod context options`.

**Note on dotfiles:** The `DOTFILES_URL` setting is global - it applies to ALL DevPod workspaces ([VSCode has a similar feature](https://code.visualstudio.com/docs/devcontainers/containers#_personalizing-with-dotfile-repositories)). When DevPod starts a workspace, it clones your dotfiles repo and runs the installation script (defaults to `install.sh`). Your shell config, aliases, and tools can stay consistent across every project. More information [here](https://devpod.sh/docs/developing-in-workspaces/dotfiles-in-a-workspace).

## Basic Usage

The simplest way to get started is to run `devpod up` in a directory with a `.devcontainer` folder:

```bash
cd your-project
devpod up .
```

This creates a workspace, builds the container from your devcontainer config, and opens it (by default in OpenVSCode Server). Once the workspace is running, you can SSH into it:

```bash
# DevPod creates an SSH host entry: workspace-name.devpod
ssh your-project.devpod
```

To skip the IDE entirely (my preference), use `--ide none`:

```bash
devpod up . --ide none
```

For terminal-based workflows, that's really all you need. The rest of this post covers how I set this up at work alongside the team's existing VSCode/Cursor setup, and the customizations that make it work for my daily workflow.

## Giving the team an option without disrupting their flows

I set up this "new way of using devcontainers" at work alongside our existing Cursor/VSCode setup. Here's how:

```text
.devcontainer/           # Team default (Cursor/VSCode) - UNCHANGED
.devcontainer-devpod/    # DevPod setup - OPT-IN
```

I know that the [devcontainer spec allows placing `devcontainer.json` in subfolders](https://containers.dev/implementors/spec/#devcontainerjson), but VSCode/Cursor will prompt users to select which config to use if multiple exist and might disrupt existing environments. The custom `.devcontainer-devpod/` path avoids this entirely - IDEs won't recognize it and will just continue using `.devcontainer/` as usual. "Terminal-based developers" like me can opt into DevPod with the custom script I mentioned above using `dpod up`.

For those interested in the full devcontainer.json capabilities, check out the [complete JSON reference](https://containers.dev/implementors/json_reference/).

The major differences in `.devcontainer-devpod/` is the centralized config mounts (`../../devpod-data/`) configured with compose for nvim/zellij/claude and a custom setup script for terminal tools. Both configs use the same [`bin/setup` from Rails](https://github.com/rails/rails/blob/46474c1eb2c6ffab2eca1b8c6248e1d601ccfca6/railties/lib/rails/generators/rails/app/templates/bin/setup.tt) to set up the app, read the same `.devcontainer.json` _format_ and delegate some of the work to docker compose.

## "DevPod my way" :tm:

Now that you understand the dual-config approach, let me walk through the specific customizations I made to make DevPod feel like a natural part of my terminal-based workflow.

### Workspace "Stickiness"

Providing all of the `devpod` paramters for every interaction gets old fast, to me it'd mean something like this to bring a workspace up for my project at work:

```bash
devpod up . \
          --id my-app \
          --ide none \
          --devcontainer-path .devcontainer-devpod/devcontainer.json
```

DevPod can take a workspace name directly (via `devpod up workspace-name`) once it's created, but you still need those flags on first run. To make my life easier I created a wrapper script (`bin/dpod`) that provides the workspace ID and devcontainer path as defaults, avoiding repetitive typing.

Instead of the command above, I just do:

```bash
bin/dpod up
```

Here's an excerpt of the wrapper if you are interested:

```bash
#!/bin/bash
# bin/dpod - DevPod wrapper

# Use custom .devcontainer-devpod/ path (explained in "Giving the team an option" above)
DEVCONTAINER_PATH="${DEVCONTAINER_PATH:-.devcontainer-devpod/devcontainer.json}"
WORKSPACE_ID="${DEVPOD_WORKSPACE_ID:-my-app}"
IDE="${DEVPOD_IDE:-none}"

case "$1" in
  up)
    if devpod list 2>/dev/null | grep -q "^$WORKSPACE_ID"; then
      devpod up --devcontainer-path "$DEVCONTAINER_PATH" "$WORKSPACE_ID"
    else
      devpod up . --devcontainer-path "$DEVCONTAINER_PATH" --id "$WORKSPACE_ID" --ide "$IDE"
    fi
    ;;
  recreate)
    devpod up "$WORKSPACE_ID" --devcontainer-path "$DEVCONTAINER_PATH" --recreate
    ;;
  ssh)
    ssh "$WORKSPACE_ID.devpod" "$@"
    ;;
  stop)
    devpod stop "$WORKSPACE_ID"
    ;;
  delete)
    devpod delete "$WORKSPACE_ID"
    ;;
  status)
    devpod list | grep -E "^NAME|^$WORKSPACE_ID"
    ;;
esac
```

The wrapper makes DevPod easier to use daily: `bin/dpod up` creates or starts your workspace, `bin/dpod ssh` gets you in, and `bin/dpod recreate` rebuilds from scratch - all without typing the same arguments repeatedly.

### Config Persistence for tools installed inside the container

It's very unlikely you'll create containers once and never recreate them. By using standard Docker Compose volume mounts, we can make configs persistent across container recreations.

**Note:** You can also configure mounts directly in `devcontainer.json` using the [`mounts` property](https://containers.dev/implementors/json_reference/#general-properties), but I prefer keeping them in the compose file since my setup already uses compose for services (Postgres, Redis, etc.). Both approaches work - choose what fits your project structure.

```yaml
# .devcontainer-devpod/compose.yaml
services:
  rails-app:
    volumes:
      - ../..:/workspaces:cached
      - ../../devpod-data/ssh:/home/vscode/.ssh
      - ../../devpod-data/nvim:/home/vscode/.config/nvim
      - ../../devpod-data/zellij:/home/vscode/.config/zellij
      - ../../devpod-data/claude:/home/vscode/.claude
```

Your editor / zellij / claude configs live outside the container in a folder that is mounted on your machine. That way you can destroy and recreate the workspace as many times as you want and your configs stay intact.

**Permission gotcha:** If Docker Compose creates these directories (because they don't exist yet), they'll be owned by `root`. Your setup script should include a `chown` to fix permissions:

```bash
# In .devcontainer-devpod/setup.sh
sudo chown -R vscode:vscode ~/.config/nvim ~/.config/zellij ~/.claude
```

**Claude Code config persistence:** Claude Code stores credentials in `~/.claude/.credentials.json` (which is already persistent via the mount), but expects config files at `~/.claude.json` and `~/.mcp.json` in your home directory. Those paths aren't persistent across container recreations. The workaround is to store the actual config files in the mounted `~/.claude/` directory and symlink to them:

```bash
# In .devcontainer-devpod/setup.sh

# Create config files in persisted location if they don't exist
if [ ! -f ~/.claude/.claude.json ]; then
  echo "{}" > ~/.claude/.claude.json
fi
if [ ! -f ~/.claude/.mcp.json ]; then
  echo "{}" > ~/.claude/.mcp.json
fi

# Symlink from expected locations to persisted files
if [ ! -e ~/.claude.json ]; then
  ln -s ~/.claude/.claude.json ~/.claude.json
fi
if [ ! -e ~/.mcp.json ]; then
  ln -s ~/.claude/.mcp.json ~/.mcp.json
fi
```

This way, your Claude Code authentication (already in `~/.claude/.credentials.json`) and config files both survive container recreation.

### The Setup Script

In addition to setting up the app with `bin/setup` as part of container creation, I created a `setup.sh` script [that runs via `postCreateCommand`](https://containers.dev/implementors/json_reference/#lifecycle-scripts) before the app setup:

```json
// in .devcontainer-devpod/devcontainer.json
{
  "name": "my-app",
  "postCreateCommand": ".devcontainer-devpod/setup.sh && bin/setup"
}
```

The script is idempotent and handles:

- Neovim v0.11.4 installation
- LazyVim with project-specific plugins
- Zellij terminal multiplexer
- Oh My Zsh with custom prompt (Docker emoji prefix)
- Git configuration (opt-in commit signing + hack mentioned below)
- `ripgrep` and `fd` for nvim plugins
- Claude Code CLI

## Git Signing: The DevPod Gotcha

Not everyone cares about [signing git commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits), but if you do, you'll hit a frustrating DevPod issue. When attempting to sign commits using SSH keys inside a DevPod container, you'll see cryptic errors:

```
error Error receiving git ssh signature: %!w(*status.Error=...)
```

Or:

```
unknown shorthand flag: 'U' in -U
```

**The problem:** DevPod automatically configures git to use a custom SSH signing wrapper by setting `gpg.ssh.program=devpod-ssh-signature`. This wrapper is meant to bridge SSH signing between host and container, but it's broken - it doesn't support the `-U` flag that modern git versions use for SSH signing ([tracked in issue #1803](https://github.com/loft-sh/devpod/issues/1803)).

**Why it's tricky:** [DevPod keeps re-adding this configuration](https://github.com/loft-sh/devpod/issues/1803#issuecomment-3497641284) even after you manually remove it. Simply running `git config --global --unset gpg.ssh.program` once only provides a temporary fix.

### The Solution

The fix requires persistence: **remove the broken wrapper on every shell startup**.

**1. Add to your setup script (`.devcontainer-devpod/setup.sh`):**

```bash
# Remove DevPod's broken signing wrapper
git config --global --unset gpg.ssh.program 2>/dev/null || true

# Add persistent removal to shell rc files
echo 'git config --global --unset gpg.ssh.program 2>/dev/null || true' >> ~/.zshrc
echo 'git config --global --unset gpg.ssh.program 2>/dev/null || true' >> ~/.bashrc

# Configure SSH signing properly
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519-sign.pub
git config --global commit.gpgsign true
```

**2. Mount only your public SSH key (`.devcontainer-devpod/compose.yaml`):**

```yaml
volumes:
  # Mount only public SSH key for git signing (agent forwarding handles private key)
  - ~/.ssh/id_ed25519-sign.pub:/home/vscode/.ssh/id_ed25519-sign.pub:ro
```

**Why only the public key?** DevPod's `ForwardAgent yes` configuration forwards your SSH agent socket into the container. Git only needs the public key to identify which key to use - the private key is accessed securely through the forwarded SSH agent. This is more secure since the private key never enters the container.

### How It Works

With this setup, the signing flow is:

1. **Git needs to sign** a commit
2. **Git reads** `~/.ssh/id_ed25519-sign.pub` to know which key to use
3. **Git invokes** `ssh-keygen -Y sign` directly (no broken wrapper)
4. **ssh-keygen contacts** the SSH agent via `$SSH_AUTH_SOCK` (forwarded by DevPod)
5. **SSH agent on host** signs the commit using the private key
6. **Signature returned** to git in the container

### Verification

Check if signing is working:

```bash
# Check the broken wrapper is NOT set
git config --global --get gpg.ssh.program
# Should output nothing or "not found"

# Check SSH signing is configured
git config --global --get gpg.format          # should be: ssh
git config --global --get user.signingkey     # should be: ~/.ssh/id_ed25519-sign.pub
git config --global --get commit.gpgsign      # should be: true

# Verify HEAD commit is signed
git cat-file commit HEAD
# Look for: "gpgsig -----BEGIN SSH SIGNATURE-----"
```

**Alternative:** If you don't need signed commits from inside the container, simply disable signing: `git config --global commit.gpgsign false`.

**Note on git config sync:** Much like VSCode's Remote Containers, DevPod automatically syncs your git configuration from the host into the container (including `user.name`, `user.email`, `user.signingkey`, etc.). This is convenient but explains why the broken wrapper appears - DevPod's trying to be helpful by configuring signing, but their implementation is broken. The workaround above removes their wrapper while keeping your signing config intact.

## Summing up

The main thing here is that DevPod is letting me regain control over my development environment and letting me get back to neovim. I'm already used to the SSH workflow using terminal multiplexers and am pretty comfortable with that. The downside is that everything requires explicit configuration and things are "less magical", but I personally see that as an opportunity to learn about "new stuff".

After a week of experimentation and setting this up at work, I'm ready to use it daily.

### Would I recommend it?

- For "terminal-based developers": Absolutely try it. You'll appreciate the SSH-based workflow, specially if you, like me, recently switched to a ~~click based~~ "more modern IDE" for whatever reason.
- For happy VSCode/Cursor users: Probably not worth switching. The IDE integration works well for devcontainers.

---

## Resources

- [DevPod Documentation](https://devpod.sh/)
- [DevContainer Specification](https://containers.dev/)
- [DevContainer JSON Reference](https://containers.dev/implementors/json_reference/) - Complete spec for devcontainer.json
- [DevPod Issue #1803](https://github.com/loft-sh/devpod/issues/1803) - Git SSH signing bug tracker
