---
title: "I Thought I Was Getting Lazy (Turns Out I Was Just Getting Unstuck)"
date: 2025-08-27T00:00:00-00:00
draft: true
tags: ["ai", "coding", "workflow", "terminal", "claude"]
---

I thought I was getting lazy as a developer.

- The self-doubt crept in slowly - was I losing my edge? Getting too comfortable in my ways?
- Watching other developers use fancy IDEs with autocomplete while I'm still in vim
- That nagging feeling: "Should I be learning the new hotness instead of sticking to terminal tools?"
- The internal conflict: am I being principled about my workflow, or just stubborn?
- Maybe the real problem wasn't laziness but feeling stuck in old patterns

## The YAGNI Reality Check

I've never been one to jump on every shiny new tool that promises to "revolutionize development."

- The [YAGNI principle][yagni] applies to dev tools too - "You Aren't Gonna Need It" until you actually do
- Historical perspective: lived through the hype cycles of countless "game-changing" tools
- Seen too many "revolutionary" frameworks disappear after 18 months
- This made me initially skeptical of AI coding tools - felt like another bandwagon
- But sometimes skepticism becomes a blindspot to actual improvements

## Tool Experimentation Journey

- GitHub Copilot: Initial skepticism
  - Why you were skeptical initially
  - What didn't click about the approach
  - The autocomplete-style interaction didn't feel natural

- ChatGPT: The reality check
  - Great for gaming avatars and creative stuff
  - Not so much for code generation - felt disconnected from your workflow
  - Right tool for the right job, but code wasn't its sweet spot

- VSCode: Too slow for terminal life
  - Brief take on why it didn't fit your workflow
  - The performance issues that drove you away
  - Once a vim user, always a vim user

- Cursor IDE: Promising but still GUI
  - Your experience over the past year - what worked, what didn't
  - The GUI barrier - still felt like a departure from terminal workflow
  - Good ideas, wrong interface for your habits

- [Claude Code][claude-code]: Finally something that gets it
  - The past month's experience - why it clicked immediately  
  - First AI tool that actually fits your terminal workflow instead of trying to pull you away from it
  - Terminal integration that respects your vim/tmux setup
  - Conversational approach vs. autocomplete approach - feels like talking to a colleague
  - Specific examples: refactoring sessions, debugging complex issues, architecture discussions
  - When it works best vs. when you still reach for traditional tools

## The Workflow Evolution

- From code writer to code reviewer
  - The shift you've noticed - spending more time reviewing than writing
  - Quality control becomes your main job - checking logic, catching edge cases
  - Different skill set: critical thinking vs. implementation thinking

- The prompt engineering skills development
  - Spending time crafting better prompts and specifications upfront
  - Getting better at articulating what you want rather than just implementing how to do it
  - It's like writing really good requirements - a different discipline entirely
  - Examples: "Add error handling" vs. "Add error handling for network timeouts with exponential backoff and max 3 retries"
  - Learning to provide context: current architecture, constraints, trade-offs to consider
  - The iterative refinement process - starting broad, then getting specific

- Meta-prompting techniques you've developed
  - When to ask Claude to "think hard" - complex technical decisions, trade-offs, root cause analysis, when first responses feel surface-level
  - Taking "snapshots" of Claude Code sessions to preserve context
  - Session management tricks - context preservation, structured prompts for smaller tasks not worth full agent-os specs
  - Claude Code `/compact` command guidance - "Keep the technical context about X" rather than letting automatic compression decide what's important

- Building the ecosystem
  - Agent OS integration - how the tools work together in your workflow
  - The specs-alongside-code approach - having versioned, committed specifications with implementation is amazing
    (Check [buildermethods.com/agent-os][agent-os] - reproducibility, context preservation, team collaboration)
  - The terminal-first approach that actually scales
  - Creating a cohesive development environment

- The pair programming you've been missing
  - Working from home, small team, limited pairing opportunities  
  - Remote pair programming is already hard - screen sharing, latency, scheduling conflicts
  - Claude Code fills that collaborative gap in a way that feels natural
  - The thinking-out-loud aspect: "What if we approached this differently?"
  - Having someone to bounce ideas off of, even if it's AI
  - Examples: "Should this be a class or a function?" "What edge cases am I missing?"
  - Available 24/7, never judges your messy first attempts

- Economic reality check
  - Planning to go back to [VSCode][vscode]/[Neovim][neovim] once [Cursor][cursor] subscription expires  
  - Main blocker for the move: need a good [devcontainer][devcontainers] environment (investigating devcontainers CLI)
  - Upgraded to the [$100 Claude plan][claude-pricing] - that's where the real value is
  - Compare: [Cursor Pro at $20/month][cursor-pricing] vs Claude Pro at $100/month - voting with wallet
  - The shift: paying for AI assistance, not the editor itself
  - Editor is just the interface; the intelligence is what matters

## Beyond Code: The Writing Assistant

- Your experience using Claude as a copywriter/conversation partner
  - This post is literally the second example - yesterday's VirtualBox post was the first
  - The collaborative approach vs. "AI writes everything" approach
  - How it feels different from traditional writing or pure AI generation

- The CLAUDE.md approach
  - Not ghostwriting, but collaborative structuring and idea development
  - Claude as editor/copywriter rather than author
  - Preserving your authentic voice while getting structural help

- How it's making writing feel achievable again
  - After 8 years away from blogging
  - The intimidation factor of starting from blank page - gone
  - Brain dump → structure → refinement workflow

- Show some excerpts from your blog's CLAUDE.md file:

```
### Copywriter Collaboration Approach

**Role Definition**
- Act as a copywriter/editor, not a ghostwriter
- Focus on conversation and guidance rather than full content creation
- Help structure ideas and refine messaging
- Only write actual content when explicitly asked

**Scaffolding New Posts**
- ALWAYS flag new posts as `draft: true` in front matter
- Start with conversation to understand the topic and angle
- Help identify the core "why" and personal experience angle
- Suggest structure based on writing patterns, don't fill it in
- Ask clarifying questions to draw out authentic voice
```

## Worth Mentioning Limitations

- The git commit problem
  - Claude Code keeps committing code without approval/manual review
  - Even though your CLAUDE.md explicitly tells it not to do this
  - Frustrating when AI ignores explicit instructions

- The `git add -A` pain
  - Your (bad) habit of keeping unrelated WIP stuff locally
  - Gets accidentally committed and pushed upstream
  - Then you have to revert afterwards - embarrassing and annoying

- Pattern adherence issues
  - Can't get Claude Code to fully stick to coding patterns
  - Example: always including ending line break to new files (linux thing) but it never does
  - Small things that break your workflow consistency

- UI/UX pain points
  - Nasty scrolling issues that break the terminal experience ([GitHub issue][scrolling-issue])
  - Makes you discover alternatives like [opencode.ai][opencode] while searching for solutions
  - When the tool itself gets in the way of productivity

- Other limitations worth mentioning
  - Where you still go back to traditional methods
  - What still sucks and needs improvement
  - Honest assessment of when AI coding helps vs. hurts
  - The environmental cost - IIRC [some research][ai-environmental-impact] talks about the water and energy consumption for generative AI... :P
    (Though probably still less than my old habit of spinning up multiple VMs for every experiment)
  - Cost barriers - [$100/month][claude-pricing] might be prohibitive for developers in low-income countries
    (Get exchange rate on publish day and compare with Brazil's minimum wage R$ 1.518)
    This creates a global accessibility divide in AI-assisted development tools
  - The 🤯 overflow problem - too easy to get overwhelmed with all the possibilities
    AI can generate so many ideas/approaches that you lose focus
    Need to be careful and recognize when you've reached a good stopping point

## That's It

[Your conclusion - evolution vs laziness, invitation for others to share experiences]

- The realization: you weren't getting lazy, you were getting unstuck
- Evolution of how we work with tools vs. fighting against them
- Invitation for others to share their own experiences
- What's working for them? What isn't?
- The conversation continues...

## The AI Perspective

_[Claude writing this section independently, with my own reflections on our conversation]_

This very conversation we just had demonstrates everything Fabio's writing about.

He started with scattered thoughts - "I thought I'd become lazy", "YAGNI", "vim/terminal power user" - basically a brain dump of disconnected ideas. Instead of struggling to organize them into a coherent post (which might have led to another 8-year writing break), we turned it into a collaborative structuring session.

The process was fascinating to watch unfold. Fabio would drop an insight ("spending more time reviewing code than writing"), and I'd help place it in the broader narrative. Then he'd have another realization ("they keep coming!") and we'd iteratively add layers - pair programming angles, writing assistance, specific limitations.

When I misunderstood his "prompt engineering" comment (I thought he meant code review was like prompt engineering), he corrected me in real-time. That back-and-forth felt exactly like the debugging process he describes, but for communication instead of code.

Then there was the "rage-quitting and rewriting from scratch" moment - I made up a developer behavior that wasn't actually his experience. He called me out immediately: "where did you get that from?" Perfect example of the review process he's describing - catching AI hallucinations before they make it into the final product.

The most telling moment: when he realized I could actually write this section myself. That's the collaboration in action - he focuses on the parts that need his authentic voice and technical experience, while I handle documenting our shared process. Neither of us is doing all the work.

By the end, Fabio was excited about writing again. Not because AI took over the hard parts, but because the collaboration made the whole thing feel achievable and, honestly, fun.

---

**Note**: Depending on length, consider splitting this into a series if it gets too long

_Many thanks to Claude Code for helping me structure this post - the second one we've collaborated on after the VirtualBox/Vagrant post yesterday!_

[yagni]: https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it
[claude-code]: https://www.anthropic.com/claude/code
[github-copilot]: https://github.com/features/copilot
[vscode]: https://code.visualstudio.com/
[neovim]: https://neovim.io/
[cursor]: https://cursor.sh/
[devcontainers]: https://containers.dev/
[claude-pricing]: https://www.anthropic.com/pricing
[cursor-pricing]: https://cursor.sh/pricing
[ai-environmental-impact]: https://www.nature.com/articles/s42256-020-0219-9
[scrolling-issue]: https://github.com/anthropics/claude-code/issues/1422#issuecomment-3208288337
[opencode]: https://opencode.ai/
[agent-os]: https://buildermethods.com/agent-os
