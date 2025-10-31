---
name: blog-scaffolding
description: Create new blog post structure for fabiorehm.com. Use when starting a new blog post - creates directory, frontmatter, and content outline through conversation.
---

# Blog Post Scaffolding

## When to Use
Trigger when user wants to create a new blog post or says "new post", "write about", etc.

## Workflow

1. **Conversation first** - Don't jump to creation
   - What's the core topic?
   - What's YOUR experience with it? (push for personal angle)
   - Why does this matter to you?
   - What's the "why bother" for readers?

2. **Create structure** (only after understanding angle)
   - Directory: `content/posts/YYYY/MM/slug-from-title/`
   - File: `index.md`
   - Frontmatter with `draft: true`
   - Headers with `##` and bullet point guidance
   - NO content filling - just structure

3. **Leave TODOs**
   - `TODO(@fabio): Write introduction about...`
   - Mark sections that need the author's voice

## Frontmatter Template

```yaml
---
title: "Post Title Here"
date: YYYY-MM-DD
draft: true
tags:
  - tag1
  - tag2
description: "TODO(@fabio): Add one-line description for SEO"
---
```

## Post Structure Patterns

### Opening Approaches
- **Problem Statement**: Start by identifying a pain point or need
- **Context Setting**: Provide background about situation or experience
- **Tool/Project Introduction**: Directly introduce what you're announcing

### Common Section Headers
- "Why bother?" / "Why do I think..." (motivation)
- "How does it work?" (mechanics)
- "What's next?" / "Future work" (future plans)
- "Worth mentioning limitations" (honest about drawbacks)
- "That's it!" / "Summing up" (conclusion)

## Anti-patterns
- Writing full paragraphs
- Generic examples instead of asking about real experience
- Assuming the conclusion
- Missing the `draft: true` flag
