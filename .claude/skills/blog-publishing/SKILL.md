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
- Confirms post is in `/content/en/drafts/` (warns if already in blog/)

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

## 3. Final Publishing Steps

If all checks pass:

1. **Update date** - Set `date` field in frontmatter to publish date
2. **Move post** - Move from `/content/en/drafts/slug/` to `/content/en/blog/YYYY/MM/DD/slug/`
   ```bash
   # Example
   mv content/en/drafts/my-post content/en/blog/2025/11/01/my-post
   ```
3. **Clean frontmatter** - Remove `draft: true` (optional - location determines status)
4. **Commit and push** - Post will be live on next build

## Script Location
See `scripts/validate-post.py` for implementation.
