---
name: blog-scaffolding
description: |
  Create new blog post structure through two-phase workflow: (1) validate topic uniqueness and identify personal angle, (2) create scaffold with TODOs. Always validates before scaffolding to prevent generic content. Use when starting a NEW blog post.
  Trigger phrases: "new post", "write about", "scaffold", "create post", "start writing", "new blog post", "start post"
allowed-tools: Read, Write, Grep, Glob, WebSearch
---

# Blog Post Scaffolding

## When to Use

Trigger when user wants to CREATE A NEW BLOG POST or NOTE. This skill includes validation as Phase 1.

**For standalone research/validation without creating a post, use blog-topic-research instead.**

**For notes:** Ask if the content is a blog post or a note. Notes are shorter-form, may be AI-assisted, and use a simpler structure. See "Notes Scaffolding" section below.

## Two-Phase Workflow

### PHASE 1: Topic Validation & Angle Discovery

**Before creating any structure, validate the topic is worth writing:**

1. **Capture the topic idea** - What do they want to write about?

2. **Internal content search:**
   - Check `content/en/blog/` for existing posts
   - Check `content/en/drafts/` for in-progress drafts
   - Look for related tags
   - Ask: "Have you already covered this?"

3. **External landscape search** (use WebSearch):
   - What's already well-covered on this topic?
   - What angles exist in the wild?
   - What gaps can be identified?
   - Who has authority here already?

4. **Present findings with structured format:**

```
I searched for existing content on [topic]. Here's what I found:

**Already well-covered:**
1. [Common angle 1 with examples]
2. [Common angle 2 with examples]
3. [etc.]

**Potential gaps identified:**
- [Gap 1]
- [Gap 2]

**Internal content check:**
- [Existing posts if any] OR [No existing posts found]
```

5. **Ask numbered, assumption-based questions about THEIR experience:**

```
Based on this landscape, I have some questions about your specific angle:

1. I'm assuming you have hands-on experience with [specific aspect]. What problems did you encounter that others don't discuss?

2. I'm thinking your unique value might be [specific implementation/discovery]. Is that accurate, or is there something else?

3. What did you build/discover that solves a gap I identified above?

4. Is there anything you tried that contradicts common advice on this topic?

What's your specific experience with this that would add genuine value beyond what already exists?
```

6. **Validate uniqueness before proceeding:**
   - Do they have personal, hands-on experience?
   - Is their angle different from what exists?
   - Are they sharing experience, not summarizing knowledge?

**Red flags that should pause scaffolding:**
- "I think people should know about X" (no personal experience)
- "It's a trending topic" (no unique angle)
- Just summarizing others' work
- No specific problems encountered or solutions built

**Green flags to proceed:**
- "I built X and discovered Y"
- "Everyone says X but I found Y"
- "I tried common solution and it failed because Z"
- "Here's my implementation handling edge case W"

**Key principle: The blog exists to share experience, not summarize knowledge.**

**MUST NOT proceed to Phase 2 if:**
- No personal hands-on experience shared
- Angle duplicates existing content
- User responds with "I think people should know" without specifics

**Response when not proceeding:**

```
Based on your responses, I'm concerned this might end up generic. The existing content covers [X] thoroughly, and I'm not seeing your unique angle yet.

Before scaffolding, I need to understand:
- What specific problems did YOU encounter that others don't discuss?
- What did YOU build/discover that's different?
- What failed for YOU that contradicts common advice?

Without personal experience to differentiate, this post risks being a summary of others' work rather than sharing your experience.

Want to explore a different angle, or do you have more specific experience to share?
```

### PRE-SCAFFOLD: Context Dump (Optional but Recommended)

Before outlining structure, encourage comprehensive context gathering:

**Prompt:**
```
Before we outline, dump everything you know about this - your experience, struggles, what you discovered, dead ends, links, tangents. No need to organize yet - just get it all out. This helps me ask better questions and structure the post around YOUR actual experience.
```

**Exit condition:** You understand their specific angle deeply enough to ask clarifying questions about edge cases, not just basics.

**Why this helps:**
- Surfaces details they might forget to mention
- Identifies patterns in their experience
- Reveals the actual story structure (chronological vs problem-first vs technical-first)
- Reduces back-and-forth during writing

**Ghostwriting boundary:** The context dump is Fabio's content, not Claude-generated. You're gathering, not inventing.

### PHASE 2: Scaffold Creation

**Only proceed after angle is validated through conversation.**

1. **Brief structure discussion** (now that angle is solid):
   - What sections make sense for THIS angle?
   - How does your experience map to structure?
   - What's the "why bother" for readers?

### PHASE 2b: Narrative Framing (When Structure Isn't Clear)

If the section structure isn't obvious from the context dump, offer alternatives:

**Prompt:**
```
I'm seeing a few ways you could tell this story:

1. **Chronological Discovery** - "1st try (failed because X), 2nd try (failed because Y), finally Z worked"
2. **Problem-First** - "Here's the pain point, here's what I tried, here's what worked"
3. **Technical-First** - "The mechanism is X, I chose it because Y, here's how it evolved"

Which narrative fits your experience? Or would you combine them?
```

**Use when:**
- Multiple valid structures exist
- User seems stuck on organization
- The context dump suggests multiple angles

**Don't use when:**
- Structure is obvious from their story
- They've already indicated their preference

2. **Create structure:**
   - **Blog posts:** Directory `content/en/drafts/slug-from-title/`
   - **Notes:** Directory `content/en/drafts/notes/slug-from-title/`
   - File: `index.md`
   - Frontmatter with current date and `draft: true`
   - Headers with `##` and bullet point guidance
   - NO content filling - just structure

3. **Leave TODOs:**
   - `TODO(@fabio): Write introduction about...`
   - Mark sections that need the author's voice
   - Reference the validated unique angle in TODO guidance

4. **Collapse reference material:**
   - Use `<details><summary>` blocks for research findings, examples, technical notes
   - Example: Research findings from external search → collapsed under "Research findings for reference"
   - Example: Technical examples or code snippets → collapsed under "Technical details"
   - Keeps the main structure clean while preserving context for writing

### PHASE 2c: Midpoint Quality Check (at ~80% completion)

Once the post is roughly 80% drafted, suggest a "remove the filler" checkpoint:

**Prompt:**
```
**Midpoint Quality Check:**

Re-reading your draft, I notice:
- [Section A could be tighter - is all of this necessary?]
- [Paragraph B repeats what you said in § "Earlier Section"]
- [You keep hedging with "I'm not 100% sure" - is that genuine uncertainty or overthinking?]

What can we remove without losing important information?
```

**Why this helps:**
- Prevents over-written blog posts
- Catches redundancy before it multiplies
- Aligns with preference for shorter, punchier posts (400-800 words ideal)
- Identifies hedging that weakens vs. hedging that builds trust

**When to suggest:**
- After most content is written but before final polish
- When post is trending toward 2000+ words
- When you notice repetition or filler

**Ghostwriting boundary:** Identify what could be removed, but let Fabio decide what to cut.

## Frontmatter Template (Blog Posts)

```yaml
---
title: "Post Title Here"
date: YYYY-MM-DD  # Current date when scaffolding, update when publishing
draft: true
tags:
  - tag1
  - tag2
description: "TODO(@fabio): Add one-line description for SEO"
---
```

**Note**: Post stays in `/content/en/drafts/` until ready to publish. When publishing, move to `/content/en/blog/YYYY/MM/DD/slug/` and update date.

## Notes Scaffolding

Notes are shorter-form content. Some are AI-assisted, some are not. When scaffolding a note:

1. **Ask about AI involvement** - Is this AI-assisted? If so, gather provenance details.
2. **Simpler validation** - Notes don't need the full Phase 1 landscape search. A quick internal content check is enough.
3. **Lighter structure** - Notes can be just frontmatter + content, no elaborate section headers needed.
4. **Title is optional** - Some notes may just be date + content.

### Frontmatter Template (Notes)

```yaml
---
title: "Note Title Here"  # Optional for short-form notes
date: YYYY-MM-DD
draft: true
tags:
  - tag1
description: "TODO(@fabio): Add one-line description"
# AI provenance (include only if AI-assisted)
ai_assisted: true
ai_model: "claude-opus-4-6"
ai_role: "co-author"  # or "research", "editor", etc.
ai_description: "TODO(@fabio): Describe how AI was used"
---
```

**Note**: Note stays in `/content/en/drafts/notes/` until ready to publish. When publishing, move to `/content/en/notes/slug/` and update date.

## Structural Notes

**Headers emerge from content organically** - don't prescribe structure. Examples from past posts show different approaches:
- 2017 Serverless: "Background", "Why do I think...", "How did it go?", "TL;DR"
- 2025 AI/Lazy: "The YAGNI Reality Check", "Tool Experimentation Journey"
- 2025 VirtualBox: "The Problem", "The Solution", "Troubleshooting"

**Opening approaches vary:**
- Jump straight into the problem/context
- Start with personal background/motivation
- Lead with "I've been doing X but..."

Let the narrative dictate the structure, not a template.

## Anti-patterns

**Phase 1 anti-patterns:**
- Skipping validation and jumping straight to scaffolding
- Accepting "I think people should know" without hands-on experience
- Not searching for existing content (internal + external)
- Approving generic topics just because they're trending
- Doing comprehensive research that belongs in the post itself

**Phase 2 anti-patterns:**
- Writing full paragraphs instead of structure
- Creating scaffold before validating unique angle
- Generic examples instead of referencing validated personal experience
- Assuming the conclusion
- Missing the `draft: true` flag
- Adding meta-framing sections: "Who This Is For", "What You'll Learn", "Key Takeaway:", "Prerequisites", etc.
- Creating "The Bottom Line" or summary boxes
- Over-structuring with series navigation boilerplate

## Relationship to blog-topic-research Skill

**blog-scaffolding includes validation as Phase 1** - use this for "I want to write about X" flows

**blog-topic-research remains standalone** for:
- Mid-writing validation ("is this section/angle actually unique?")
- Additional research after initial scaffold
- Researching content without starting a new post
- Surgical validation anytime during writing process
