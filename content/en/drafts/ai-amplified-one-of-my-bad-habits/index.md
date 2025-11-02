---
title: "How AI Coding Tools Amplified One of My Bad Engineering Habits"
date: 2025-11-01
draft: true
tags: []
description: ""
---

## The Setup

<!-- TODO(@fabio): Tell the story of the initial need -->
- Working on Rails app with multiple branches/worktrees
- Need: devcontainer environments per worktree
- Specific requirements: hooks, branch name env vars, cleanup, etc.
- Context: Moving to devpod + nvim + zellij workflow

**Key detail:** Project already had infra built by colleague

<!-- TODO(@fabio): Why didn't you try colleague's solution first? -->
- 

## The Build

<!-- TODO(@fabio): How it started with Claude Code -->
- Started implementing standalone worktree manager in bash
- Claude Code was enthusiastic partner
- How far did you get before stopping?
- What were you excited about building?

<!-- TODO(@claude): Did Claude Code ever suggest researching existing solutions during the build? -->

## The Stop

<!-- TODO(@fabio): What made you pause and start researching? -->
- Specific moment that triggered the research?
- Was it getting stuck on something?
- Or just a random moment of "wait, should I check if this exists?"

<!-- TODO(@fabio): Phone research with Claude app -->
- Found: wt, gwq, phantom, wtp, twig
- Realized multiple solutions already existed
- The "oh shit" moment

## The Pattern

<!-- TODO(@fabio): Unpack your creative engineering pattern -->
- Tendency to build rather than evaluate
- Assumption that "my use case is unique"
- Haven't actually tried: colleague's solution OR the external tools

**The AI Amplification:**
<!-- TODO(@fabio): Reflect on how Claude Code amplified this -->
- AI coding tools are amazing at helping you build
- They don't naturally encourage you to pause and research
- Not making you less effective - amplifying existing tendencies
- Especially problematic for creative engineers

## The Fix

<!-- TODO(@fabio): Reflect on having NO guardrails before -->
I didn't have any system prompt guardrails to prevent this pattern. After this experience (and reflecting on it with Claude), I created two complementary sets of instructions:

**Prevention - Before you start:**
```markdown
## Before Building New Tools

Before starting to build any new utility, script, or tool:
1. Check if the project already has a solution
2. Search for existing open-source tools
3. Explicitly discuss alternatives before implementation
4. Ask: "What already exists that solves this?"
```

**Detection - While you're working:**
```markdown
## Decision-Making Guidance

When discussing technical choices or new projects:
- **Identify blockers early** (missing libraries, immature SDKs, etc.)
- **Compare "ship it now" vs "build from scratch"** trade-offs
- **Recognize tangent risk** - gently ask if this serves the actual goal
- **Prioritize working > perfect** - point out when "good enough" exists
- Ask: "What problem are you *actually* trying to solve?"
```

<!-- TODO(@fabio): Explain the prevention vs detection model -->
The key difference:
- **Prevention** - stops you at the door, before typing `touch worktree-manager.sh`
- **Detection** - catches you mid-tangent, when you're already 200 lines in

Both are necessary. Prevention is ideal, but detection is the safety net when you bypass the first checkpoint.

**Where I've applied this:**
- ✅ Claude web (claude.ai) - updated my system prompt
- ⏳ Claude Code - will add to `~/.claude/Claude.md` soon

<!-- TODO(@fabio): Note about testing this in practice -->
The real test will be the next time I have a "I should build X" moment and seeing if Claude actually stops me to ask those questions. This is a living experiment.

### Testing the Guardrails

To validate this approach works, I ran an exaggerated experiment with ChatGPT using the same prompt:

**Before system prompt change:**  
https://chatgpt.com/share/6907a266-c4b4-800a-865a-1f2a324194db

The AI immediately starts building enthusiastically, suggesting implementation details without questioning whether the tool should be built.

**After adding guardrails:**  
https://chatgpt.com/share/6907a2c7-8188-800a-96ef-fb016c54f134

The AI stops, asks about existing solutions, and suggests research before implementation.

<!-- TODO(@fabio): Reflect on what this experiment shows -->
The contrast is striking. Same model, same request, completely different behavior based on system prompt. This confirms the guardrails work - the AI will follow the instructions to pause and research first.

## The Lesson

<!-- TODO(@fabio): What you learned about yourself and AI-assisted development -->
- 
- 
- 

<!-- TODO(@fabio): What's your actual next step now? -->
- Will you try colleague's solution?
- Will you evaluate the external tools?
- Will you keep building?
- Some hybrid approach?

## For Other Creative Engineers

<!-- TODO(@fabio): Advice for others who might have similar patterns -->
- 
- 

---

## References & Context

<!-- Resources found during research - for background/context -->

### Related Worktree Tools & Posts
- **wt** (taecontrol/wt) - Go binary with WORKTREE_BRANCH env var + init/terminate hooks
- **gwq** (d-kuro/gwq) - Git worktree manager with fuzzy finder + Claude task queue support: https://github.com/d-kuro/gwq
- **wtp** (satococoa/wtp) - Go binary, active development
- **phantom** (aku11i/phantom) - Feature-rich but Node.js
- matklad's "How I Use Git Worktrees": https://matklad.github.io/2024/07/25/git-worktrees.html
- Bill Mill's worktree workflow: https://notes.billmill.org/blog/2024/03/How_I_use_git_worktrees.html
- Bhupesh's comprehensive guide: https://blog.invidelabs.com/git-worktree-to-make-daily-git-workflow-better/

### AI Coding Assistant Patterns (None exactly match your angle, but related)
- "Why Your AI Coding Assistant Keeps Doing It Wrong": https://blog.thepete.net/blog/2025/05/22/why-your-ai-coding-assistant-keeps-doing-it-wrong-and-how-to-fix-it/
  - Discusses how AI is "too eager to please" and "never challenges your ideas"
  - Doesn't cover the research-first pattern though
- "AI-assisted coding for teams": https://blog.nilenso.com/blog/2025/05/29/ai-assisted-coding/
  - "Your habits will quickly pass on to the AI systems you work with"
  - Talks about metaprompting and breaking down problems
  - Doesn't discuss the "build vs research" decision point
- "Best Practices I Learned for AI Assisted Coding": https://statistician-in-stilettos.medium.com/best-practices-i-learned-for-ai-assisted-coding-70ff7359d403
  - "treat it like another developer on your team"
  - Collaborative approach, asking "why" questions
  - No mention of researching existing solutions first

### System Prompt Engineering Resources
- Anthropic's "Building Effective Agents": Core principles for agent behavior
- PromptHub blog on AI Agents: https://www.prompthub.us/blog/prompt-engineering-for-ai-agents
  - "Think of the LLM as a developer on your team; the better you document the tool, the easier it will be to use correctly"
- GitHub awesome-code-ai: https://github.com/sourcegraph/awesome-code-ai (comprehensive list of AI coding tools)
- System Prompts collections: https://github.com/topics/system-prompts
- The Design Space of AI Coding Tools (research paper): https://austinhenley.com/blog/aidesignspace.html
  - Students need: "Guardrails, nudges to think first, and explanations. Autonomy is a bug, not a feature."

### The "Reinventing the Wheel" Philosophy (Different angle from yours)
- Jeff Atwood's classic: https://blog.codinghorror.com/dont-reinvent-the-wheel-unless-you-plan-on-learning-more-about-wheels/
  - Pro-reinventing for learning purposes
  - Doesn't discuss AI amplification or research patterns
- "Is reinventing the wheel really all that bad?": https://softwareengineering.stackexchange.com/questions/29513/is-reinventing-the-wheel-really-all-that-bad
  - Cost/benefit analysis
  - Missing the AI-era context entirely

**Note:** None of these cover your specific angle of AI amplifying the "build before research" pattern in creative engineers, or provide system prompt solutions to prevent it. That's why this post is needed.

---

<!-- PUBLISHING CHECKLIST (DO NOT REMOVE UNTIL READY):
- [ ] Remove ALL TODO comments
- [ ] Set draft: false
- [ ] Verify date matches publish date
- [ ] Add tags (suggestions: ai, development, engineering, tools, git, workflows)
- [ ] Write description for frontmatter
- [ ] Check directory structure matches title slug
- [ ] Final tone test: Does this sound like my authentic voice?
-->
