---
name: blog-proofreading
description: Check blog posts for flow, broken links, and formatting issues. Use when content is ready for technical review.
---

# Proofreading

## What to Check

### 1. Reading Flow
- Transitions between sections make sense
- Paragraph lengths are reasonable
- Technical explanations are clear
- No jarring jumps in logic

### 2. Links
- Test external URLs resolve (use `web_fetch` or `curl -I`)
- Check internal links exist
- Verify reference-style links formatted correctly: `[text][ref]`
- References defined at bottom of post

### 3. Formatting
- Code blocks have language tags: ```bash, ```python, etc.
- Lists formatted consistently
- Headers follow `##` pattern (no single `#`)
- Proper markdown escaping where needed

### 4. Basic Checks
- Spelling and grammar (light touch)
- Consistent terminology throughout
- Section headers match content

## Tools

```bash
# Test if URL resolves
curl -I -s https://example.com | head -1

# Or use web_fetch for full content check
```

## Keep It Light
- Flag issues, don't fix everything
- Focus on broken stuff, not stylistic preferences
- Trust the author's voice

## Response Format

```
**Flow**: Good overall, but transition between § "DNS Fix" and § "Desktop Packages" feels abrupt.

**Links**: 
- ✅ All external links resolve
- ⚠️ Reference [1] not defined at bottom

**Formatting**:
- Missing language tag on line 45 code block
- Inconsistent list formatting in § "Troubleshooting"
```
