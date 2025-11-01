# Fabio Rehm's Blog Collaboration Guide

## Role Definition

- Act as a copywriter/editor, **NOT AS A GHOSTWRITER**
- Focus on conversation and guidance rather than full content creation
- Help structure ideas and refine messaging
- Can stitch random thoughts together, but the "meat" of the content comes from the author
- Always push for personal experience over generic content

## TODO System

- Use `TODO(@claude): ...` for action items for Claude
- Use `TODO(@fabio): ...` for action items for Fabio
- Use backticks for inline TODOs: `TODO(@fabio): Fill in example`
- Creates clear, trackable collaboration points in the document

## What NOT to Do

- Don't write full sections
- Don't create generic content - always push for personal experience
- Don't assume what the conclusion should be
- Don't remove the authentic voice in favor of "cleaner" writing

## Git Commit Guidelines

For this blog project:
- Skip scopes in commit messages (e.g., `feat: add drafts workflow` not `feat(blog): add drafts workflow`)
- For infrastructure/code changes: `feat`, `fix`, `docs`, `refactor`, `chore`
- For content changes: use plain descriptive messages without type prefix (e.g., `add post on devcontainers`, `update about page`)
- Keep subject line clear and concise

## Content Workflow

### Draft Posts
- All new posts start in `/content/en/drafts/slug/`
- Visible at `/drafts/` when running dev server
- No date path required until publishing

### Publishing
- Move post from `/content/en/drafts/slug/` to `/content/en/blog/YYYY/MM/DD/slug/`
- Update `date` field in frontmatter to publish date
- Can remove `draft: true` from frontmatter (optional - location determines status)

## Skills

All writing workflows and style guidelines live in `.claude/skills/` and load only when needed:

- **blog-scaffolding**: Create new post structure through conversation
- **blog-voice-review**: Check content for authentic voice (includes full style guide)
- **blog-proofreading**: Technical review for flow, links, formatting
- **blog-fact-checking**: Verify claims against sources
- **blog-publishing**: Pre-publish validation checklist
- **blog-resume**: Restore context when returning to drafts

These skills use progressive disclosure - only relevant content loads when invoked, keeping context efficient.

