---
name: blog-publishing
description: Pre-publish validation and checklist for blog posts. Use when preparing to publish a post - runs checks and walks through final review.
---

# Publishing Workflow

## 1. Automated Checks

Run validation script:
```bash
python scripts/validate-post.py <path-to-post>
```

The script checks:
- Scans for leftover `TODO(@` comments
- Validates required frontmatter fields (title, date, description)
- Checks directory structure matches slug
- Verifies date is reasonable for publish
- Ensures `draft: true` is present (warns if missing on draft)

## 2. Publishing Checklist

Walk through interactively:

**Content Review**
- [ ] All TODO comments removed?
- [ ] No placeholder content remaining?
- [ ] Spelling and grammar checked?

**Frontmatter & Structure**
- [ ] Date matches intended publish date?
- [ ] Description suitable for SEO/social?
- [ ] Tags are relevant and accurate?
- [ ] Directory structure matches slug?

**Final Quality Check**
- [ ] Conversational and authentic voice?
- [ ] Technical concepts explained accessibly?
- [ ] Honest about limitations?
- [ ] Credits and attributions included?
- [ ] Links tested and working?
- [ ] Invitation for feedback at end?

## 3. Final Action

If all checks pass:
- Remove `draft: true` from frontmatter
- Commit and push to publish

## Script Location
See `scripts/validate-post.py` for implementation.
