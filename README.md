# fabiorehm.com

The code behind [fabiorehm.com](https://fabiorehm.com).

## Development Setup

### Prerequisites

Install Hugo via snap (recommended for Linux):

```bash
sudo snap install hugo
```

Alternative installation methods: <https://gohugo.io/installation/>

### Local Development

Start the development server:

```bash
make dev
# or
hugo server -D
```

The site will be available at <http://localhost:1313>

### Building

Build the static site:

```bash
hugo --minify
```

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when pushing to the `main` branch.
