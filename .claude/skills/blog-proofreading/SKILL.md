---
name: blog-proofreading
description: |
  Check blog posts for flow, broken links, and formatting issues. Technical review for content ready to publish.
  Trigger phrases: "proofread", "check links", "formatting", "technical review", "check formatting", "review links"
allowed-tools: Read, Bash, WebFetch
---

# Proofreading

## What to Check

### 1. Reading Flow
- Transitions between sections make sense
- Paragraph lengths are reasonable
- Technical explanations are clear
- No jarring jumps in logic
- Check for contradicting statements (within paragraphs, between sections, intro vs conclusion)

### 2. Links

**Reference-style format (REQUIRED):**
- ALL content links MUST use reference-style: `[text][ref-name]`
- Reference definitions at bottom: `[ref-name]: https://example.com`
- Inline format `[text](url)` is NOT allowed in content

**Exceptions (inline OK):**
- Image paths: `![alt](./image.png)` (local files)
- Internal anchors: `[See above](#section-name)` (on-page links)

**Check for:**
- Any inline URLs like `[text](https://url)` → convert to `[text][ref-name]`
- Raw URLs like `https://example.com` → wrap as `[description][ref-name]`
- Missing reference definitions at bottom
- Duplicate reference names

**Test external URLs:**
```bash
# Verify URL resolves
curl -I -s https://example.com | head -1

# Or use WebFetch for content validation
```

**Example conversion:**
```markdown
BEFORE:
I read about [Skills](https://anthropic.com/skills) and decided to try them.

AFTER:
I read about [Skills][skills-announcement] and decided to try them.

[skills-announcement]: https://anthropic.com/skills
```

### 3. Formatting
- Code blocks have language tags: ```bash, ```python, etc.
- Lists formatted consistently
- Headers follow `##` pattern (no single `#`)
- Proper markdown escaping where needed

### 4. Basic Checks
- Spelling and grammar (light touch)
- Consistent terminology throughout
- Consistent person (first person for experience, "you" when addressing reader is OK, but no "users should" or "one might")
- Section headers match content

## Link Testing

Test external URLs with curl:
```bash
curl -I -s https://example.com | head -1
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
