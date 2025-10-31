---
title: "Refactoring My Blog Workflow with Claude Skills"
date: 2025-10-30
draft: true
tags:
  - ai
  - claude
  - blogging
  - workflow
description: "TODO(@fabio): Add a one-line description about experimenting with Claude Skills for blog collaboration"
---

## Why bother?

TODO(@fabio): Write about the problem with the monolithic CLAUDE.md approach - what wasn't working? What made you think "there's a better way"?

**Context efficiency problem:**

- Experiencing context limits on other projects (not blog specifically)
- CLAUDE.md size contributes to more frequent context compression (larger = more tokens per message = more compression)
- Side note: Been playing with status line monitoring for better visibility (see references)

**Learning about Skills:**

- Discovered [Skills announcement][skills-announcement] on Oct 16, 2025
- Progressive disclosure = only loads what's needed when needed
- "Progressive disclosure ensures only relevant content occupies the context window at any given time"
- Not about the feature itself, but about **natural chatting while being context efficient**
- Can say "fact-check section Y" without loading proofreading, voice review, etc. context

**Testing in isolation:**

- Tried to use Skills in agent-os but didn't work properly
  - Skill names had wrong format (capitalized vs lowercase-hyphenated)
  - Even after fixing, unclear if Claude was actually using them (no confirmation prompts)
  - See [agent-os discussion][agent-os-skills]
- Blog was perfect testbed to validate if Skills actually work in isolation

**The goals:**

- Publish more content without compromising voice (spot on)
- Added bonus: workflow tools like fact-checking, proofreading, etc.
- More natural collaboration flow

**Note:** CLAUDE.md got refactored today 2025-10-30 (first pass) - went from 140 lines down to 37 lines. See "Breaking down the monolithic prompt" section below for details.

## The fear of AI slop

TODO(@fabio): Be honest about the concern that posts might end up sounding generic. This is a real fear and worth addressing head-on.

Questions to answer:

- What does "AI slop" mean to you?
- Why is this a concern for your blog specifically?
- How are you trying to avoid it?

## What are Claude Skills anyway?

TODO(@fabio): Explain Skills in your own words based on what you learned. This doesn't need to be comprehensive - just what matters for your use case.

**Progressive disclosure (three-level structure):**

- Level 1: Only skill metadata (name + description) loads at startup
- Level 2: Full `SKILL.md` loads only when Claude determines skill applies to current task
- Level 3+: Additional bundled files load dynamically based on specific needs

**Key insight from [agent skills deep dive][agent-skills-deep-dive]:**

- "Agents with a filesystem and code execution tools don't need to read the entirety of a skill into their context window when working on a particular task"
- Skill size becomes effectively unbounded - can bundle comprehensive resources without bloating every interaction
- Dramatically reduces token usage for typical operations

**Filesystem-based vs monolithic:**

- Monolithic: Everything loads upfront, consumes tokens whether relevant or not
- Skills: Load information only as needed, context efficient

**How they work for your blog:**

- Each skill represents a distinct workflow (scaffolding, fact-checking, etc.)
- Only loads when you invoke it ("do a fact-check of section Y")
- Rest of the skills stay dormant, not consuming context

## Breaking down the monolithic prompt

**First pass: Extract workflows**

Started by identifying distinct workflows and moving them to skills:

- **blog-scaffolding**: New post creation through conversation
- **blog-voice-review**: Authentic voice checking
- **blog-proofreading**: Technical review (flow, links, formatting)
- **blog-fact-checking**: Claim verification (after the quote incident)
- **blog-publishing**: Pre-publish validation checklist
- **blog-resume**: Context restoration across sessions

This removed the scaffolding and publishing sections from CLAUDE.md, but it still contained 100+ lines of style guidelines.

**Second pass: Go aggressive**

Realized we could move almost everything:

- Created `style-guide.md` in the `blog-voice-review` skill with all the writing guidelines
- The skill already referenced it, just needed to populate it
- Moved all voice/tone, structure patterns, and content guidelines there
- CLAUDE.md went from **140 lines → 37 lines**

**What stayed in CLAUDE.md:**

- Role definition (copywriter not ghostwriter)
- TODO system (used in all conversations)
- "What NOT to Do" principles
- Brief pointer to skills

**The separation principle:**

CLAUDE.md now only contains collaboration essentials that affect every conversation, regardless of which workflow. Everything else lives in skills and loads only when invoked:

- Need style guidelines? → They load with `blog-voice-review`
- Need scaffolding patterns? → They load with `blog-scaffolding`
- Need publishing checklist? → Loads with `blog-publishing`

**Why blog-resume deserved its own skill:**

Posts span multiple conversations. You start a draft, life happens, you come back days later. The resume skill helps restore context: what's done, what's TODO, what was decided in earlier chats. Without it, every session starts from scratch.

## How it's working so far

TODO(@fabio): Share your actual experience. Has it been better? Worse? Different?

**The "code laundering" quote incident (commit 9839bf7):**

- Published post originally said: "open-source advocates calling it 'automated code laundering'"
- **I caught it myself** - the actual quote was much more specific
- Should have been: "open-source advocates raising concerns about what System 76 principal engineer Jeremy Soller called 'illegal source code laundering, automated by GitHub.'"
- Different wording, needed specific attribution
- This is the biggest reason the fact-checking skill exists - bad quotes can slip through when Claude rewrites/summarizes
- See [commit 9839bf7][commit-9839bf7] for the fix

Be honest about:

- What's improved in the collaboration flow
- What's still awkward or unclear
- Whether you're actually publishing more
- How you're monitoring for that "AI slop" problem

## Worth mentioning limitations

TODO(@fabio): What doesn't work yet? What are you still figuring out?

Possible limitations:

- Skills don't sync across surfaces (API vs claude.ai)
- Still learning what should be in skills vs natural conversation
- TODO system might need refinement
- Not sure if this scales long-term

## What's next?

TODO(@fabio): Where do you see this going? More skills? Different approach? Still experimenting?

TODO(@fabio): Compare the refactored skills in this commit with the original skills Claude generated on claude.ai (available as zip download from that chat). Document any interesting differences in approach or structure.

## That's it

TODO(@fabio): Wrap up with invitation for feedback and your usual sign-off.

---

[skills-announcement]: https://www.anthropic.com/news/skills
[agent-skills-deep-dive]: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
[agent-os-skills]: https://github.com/buildermethods/agent-os/discussions/253#discussioncomment-14819381
[commit-9839bf7]: https://github.com/fabiorehm/fabiorehm.com/commit/9839bf7ecf6b903d190fc033f102bcce3bfd0c2d

TODO(@fabio): Get the <https://aitmpl.com/> link (page not loading) and add any other references as you write
