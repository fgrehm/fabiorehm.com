# fabiorehm.com

The code and content behind [fabiorehm.com](https://fabiorehm.com).

## Development Setup

### Prerequisites

Install Hugo via snap (recommended for Linux):

```bash
sudo snap install hugo
```

Alternative installation methods: <https://gohugo.io/installation/>

### Initial Setup

After cloning the repository, initialize the theme submodule:

```bash
git submodule update --init --recursive
```

### Content Structure

This blog uses a dual-repository setup:

- **Main repo (public):** Site structure, published posts, configuration
- **Drafts repo (private):** Located at `content/en/drafts/` (nested git repo, gitignored)

To set up the drafts repo:

```bash
git clone git@github.com:fgrehm/blog-drafts.git content/en/drafts
```

Drafts are visible at <http://localhost:1313/drafts/> when running the dev server.

### Local Development

Start the development server with auto-commit for drafts:

```bash
make dev
```

This starts:

- Hugo server at <http://localhost:1313>
- Auto-commit loop for drafts (every 30 minutes)

**Manual draft commit:**

```bash
bin/drafts-autocommit
```

**Alternative (Hugo only, no auto-commit):**

```bash
hugo server -D
```

### Building

Build the static site:

```bash
hugo --minify
```

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when pushing to the `main` branch.
