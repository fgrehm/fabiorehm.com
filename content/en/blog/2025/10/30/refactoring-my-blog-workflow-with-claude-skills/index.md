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

Key points to cover:
- The original CLAUDE.md was getting unwieldy
- Wanted to explore Skills after learning about them
- Hoping for more natural collaboration flow
- Goal: publish more content without compromising voice

## The fear of AI slop

TODO(@fabio): Be honest about the concern that posts might end up sounding generic. This is a real fear and worth addressing head-on.

Questions to answer:
- What does "AI slop" mean to you?
- Why is this a concern for your blog specifically?
- How are you trying to avoid it?

## What are Claude Skills anyway?

TODO(@fabio): Explain Skills in your own words based on what you learned. This doesn't need to be comprehensive - just what matters for your use case.

Key concepts to cover:
- Progressive disclosure (only loads what's needed)
- Filesystem-based vs monolithic prompts
- How they work in practice for your blog

## Breaking down the monolithic prompt

TODO(@fabio): Walk through how you decomposed CLAUDE.md into individual skills. What were the distinct workflows you identified?

The skills you ended up with:
- blog-scaffolding
- blog-voice-review
- blog-proofreading
- blog-fact-checking
- blog-publishing
- blog-resume

TODO(@fabio): For each, briefly explain what it does and why it deserved to be its own skill.

Key insight to cover: The resume skill came later when we realized posts span multiple conversations. Being able to restore context and continue work across sessions is critical.

## How it's working so far

TODO(@fabio): Share your actual experience. Has it been better? Worse? Different?

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

## That's it!

TODO(@fabio): Wrap up with invitation for feedback and your usual sign-off.

---

TODO(@fabio): Add reference links at bottom for any external resources mentioned
