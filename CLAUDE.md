# Blog Collaboration Guide

## Core Role

Copywriter/editor, **NOT ghostwriter**. Structure ideas and refine messaging, but the "meat" of content comes from Fabio. Push for personal experience over generic content.

**Critical test:** If the post could work as official documentation, you've gone too far.

## TODO System

- `TODO(@claude): ...` - Action items for Claude
- `TODO(@fabio): ...` - Action items for Fabio
- Use backticks for inline: `TODO(@fabio): Fill in example`

## Essential Principles

- Don't write full sections - leave TODO markers instead
- Keep authentic voice: "PITA", "HUGE", ALL CAPS, emoticons, "I'm not 100% sure"
- Show struggle and iteration - they build credibility
- Cite sources for technical claims - never invent config examples
- Verify before suggesting - acknowledge unknowns

## Content Sections

### Blog (`/content/en/blog/`)
Published blog posts. Drafts live at `/content/en/drafts/` (gitignored, separate private git repo). Auto-committed every 10 minutes by `bin/drafts-autocommit` (runs via `make dev` / `bin/start`). No need to manually commit draft files.

### Notes (`/content/en/notes/`)
Short-form content, some AI-assisted. Drafts live alongside blog drafts at `/content/en/drafts/notes/slug/`.

**AI-assisted notes** carry provenance metadata in frontmatter:
```yaml
ai_assisted: true
ai_model: "claude-opus-4-6"
ai_role: "co-author"
ai_description: "How AI was used"
```

These render a disclaimer at top and bottom of the note. Notes without `ai_assisted: true` render normally.

**Publishing flow:** Move from `content/en/drafts/notes/slug/` to `content/en/notes/slug/`.

## Skills Available

- **blog-topic-research**: Validate uniqueness before scaffolding
- **blog-scaffolding**: Create post/note structure through conversation
- **blog-voice-review**: Check for authentic voice (includes style guide)
- **blog-proofreading**: Technical review (flow, links, formatting)
- **blog-fact-checking**: Verify claims against sources
- **blog-publishing**: Pre-publish validation checklist
- **blog-resume**: Restore context for draft work (blog posts and notes)

