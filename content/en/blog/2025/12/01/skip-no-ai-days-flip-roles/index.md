---
title: "Skip the 'No AI Days' - Flip the Roles Instead"
date: 2025-12-01
tags:
  - ai
  - pair-programming
  - claude-code
  - workflow
  - learning
description: "An alternative to 'No AI Days' - flip the roles and use Claude as navigator while you drive. Keep your coding skills sharp without going completely dark."
---

[A few months ago](/blog/2025/08/29/afraid-ai-would-make-me-lazy/), I wrote about overcoming my fear that AI tools would make me lazy as a developer. I found [Claude Code fit my terminal workflow](/blog/2025/11/11/modernizing-my-terminal-based-dev-environment/), and I thought I'd solved the problem by doing _augmented coding_, not _vibe coding_, while still being in the "driver's seat". Except I wasn't really driving _that much_ anymore.

I was writing prompts and doing what some call Spec Driven Development with [agent-os][agent-os]. I was also reviewing code properly, asking for changes, catching bugs, maintaining standards, etc. But the pattern was always the same: I'd describe what I needed, Claude would implement it, and I'd review. Rinse and repeat. I was becoming a really good code reviewer and prompt engineer, but after some time I realized I was writing very little code myself (something I've been enjoying to do for almost 20 years now).

What got me thinking about this was that over time I started noticing how it felt _easier_ to explain what I wanted than to just write. Not because the task was hard, it was just easier to describe than implement. That didn't sit right though. The augmented / vibe coding approach is very passive and we all seem to become "mere reviewers" instead of builders.

I know, this is like a "philosophical discussion to have over a few drinks": if you are the one with the creativity and knowledge to write and specify what needs to be done / built, then you are a builder, but I think you all get where I'm coming from. The fact that "[No AI Days][no-ai-days]" are becoming popular is a sign of our time and where we're heading.

Before it was too late, I tried an experiment: what if I flipped the roles? What if I wrote the code and Claude reviewed it? What if I forced myself back into implementation mode by constraining AI's ability to take over? What if we could turn Claude into an "old school Pair Programmer" that drives or navigates over time?

## "Flip the roles"?!

A lot of people describe AI coding tools as "having an intern" - you tell it what to do, it does the work, you review. But that's not pair programming the way I learned and experienced at ThoughtWorks back in 2011 when I first experienced it full time. What most of us are doing is "delegation with oversight".

The way most of us use AI coding tools is like being permanently in the navigator seat (reviewing AI output) while AI is permanently the driver (writing all the code). That's not pairing - it's just like having a very fast intern who never learns to navigate.

Real pairing has role switching. Both people write code at different times. The navigator doesn't just review - they guide, question, catch issues in real-time. And crucially: sometimes they take the keyboard.

What I wanted was actual role flexibility: sometimes I drive and AI navigates, sometimes AI drives and I navigate. The default AI behavior of "implement everything" needed constraints.

This post is about my journey getting Claude Code to behave like a "proper pair programmer from the 2010s" - one who knows when / how to navigate and to execute, instead of just implementing everything by default.

## Teaching Claude to navigate

I've been iterating on this for almost a month now. Four different approaches at different levels of "the stack", each one teaching me something about what actually makes instructions stick.

All of the iterations were based on a collaboration between me pointing out what was wrong and Claude doing some self reflection + explaining why changes were being proposed.

### Context file (didn't stick)

I started by providing a well defined prompt at session start (more specifically some [`additionalContext` of the `SessionStart` output][claude-code-hooks], similar to the worktree specific context of [another post I wrote](/blog/2025/11/27/working-on-multiple-branches-without-losing-my-mind/#automagic-worktree-context-loading-with-claude-code)).

What I experienced was that the instructions drifted after a few exchanges, Claude would frequently jump into driver mode and I had to keep reminding it was not supposed to write code or show full blown snippets of changes to be made.

Unfortunately I don't have those prompts anymore to illustrate what I was doing, but I have most (if not all) of the prompts used for the attempts below.

### Append system prompt (better)

I eventually learned about the `--append-system-prompt` flag and spent a few days iterating. This worked much better - instructions seemed to "stick" more because they're part of the system context, not just conversation history.

I went through six iterations here. The breakthrough came when I stopped saying "don't write code" (too vague) and started constraining which tools Claude could use: "In navigator mode, you MUST NOT use: Edit, Write, NotebookEdit." Much clearer boundary.

I also switched to [RFC 2119][rfc2119] wording - MUST, SHOULD, MAY instead of casual language. Turns out Claude responds better to precise language about constraints.

This worked well, but Claude's base behaviors still leaked through occasionally. The helpful instinct to just implement things was strong.

[rfc2119]: https://www.rfc-editor.org/rfc/rfc2119

### Full system prompt replacement (promising but fragile)

I still wasn't satisfied with my sessions, I really wanted to have control over when I was going to code vs when Claude was meant to do the work. I poked around and decided to try a "nuclear option": the `--system-prompt` which supposedly replaces the full system prompt used by Claude.

I found some people that [reverse engineered the system prompts][tweakcc] baked into Claude Code (which apparently is dynamic) and merged the pair programming constraints with what seems to be "Claude Code essentials". I went through multiple iterations (v4-v8), each one fixing a specific failure mode I discovered through actual use.

v4 was a complete redesign based on prompt engineering research - turned out negative instructions backfire. Telling Claude what NOT to do keeps those behaviors top of mind. The fix: explain WHY the split exists, show concrete examples, describe what TO do.

Later versions fixed other issues: Claude responding without reading the context I explicitly referenced, misinterpreting "sgtm" as permission to execute instead of just agreement to the approach, creating implementation todos when it should only explore.

But behavior still degraded over time in ways I couldn't quite pin down. I'd start a session and immediately have to remind Claude to stay in navigator mode. Maybe Claude updates broke things, maybe instruction decay at scale. Hard to measure.

[tweakcc]: https://github.com/Piebald-AI/tweakcc/blob/168b5b8a16b9674785e30dfed7ba5bee117734a3/data/prompts/prompts-2.0.55.json#L138-L191

All of the above led me to take a step back and reconsider: is there a more sustainable approach? Turns out that there is, and Claude itself taught me about it through a session on claude.ai on my phone while I was waiting for something else.

### Output style (the winner)

Output styles are a [built-in Claude Code feature][output-styles] for customizing how Claude responds. They're markdown files with frontmatter that live in `.claude/output-styles/` and activate with `/output-style`.

The key difference from system prompt replacement: this works *with* Claude Code instead of fighting it. Updates won't break it. The structure is designed for persistence - Claude reads it at session start and the instructions actually stick.

The real insight came from identifying where Claude naturally drifts into implementation mode. Five specific patterns kept appearing:

First, the research-to-action slide - running read-only commands then flowing directly into "here's what I'll change" without stopping. Second, describing exact file paths and line numbers, which feels like navigation but is actually implementation territory. Third, assuming forward motion after presenting options. Fourth, tool classification ambiguity about what requires driver mode. Fifth, the general confusion between describing changes versus making them.

Each feature in the output style targets one of these drift patterns:

- **XML tags + RFC 2119 keywords** - Anthropic's own research shows Claude is 12% more likely to follow instructions in XML format vs Markdown. Combined with MUST/SHOULD/MAY wording from [RFC 2119][rfc2119], the boundaries are crystal clear.
- **Implementation territory smell test** - A section that lists concrete warning signs Claude is crossing into implementation territory: "specifying exact file paths and line numbers", "describing specific code replacements", etc. When Claude spots these patterns in its own thinking, it knows to stop and ask about driver mode.
- **Mandatory checkpoints** - After any research phase, Claude MUST stop and ask: "Want me in driver mode to make changes, or will you implement?" This prevents the research -> action slide I kept hitting before.
- **Good/bad examples** - Concrete scenarios showing what Navigator mode looks like in practice vs what violates it. Claude learns to generalize from these instead of abstract rules.

I've been testing this for about two days of actual coding work across different tasks. The behavior is noticeably more stable - Claude stays in navigator mode without constant reminders, the mode switching works smoothly, and the checkpoints catch drift before it happens.

[output-styles]: https://docs.claude.com/docs/claude-code/output-styles

## What I learned

### The good stuff

Writing code myself forced me to actually understand what needed to change. I caught terminology that seemed backwards given the business context - something I might have glossed over if Claude just generated the change. I also found files Claude missed in its initial search, because I was actively exploring instead of passively accepting generated code.

The navigator role extended beyond code review to the whole engineering workflow: commit strategy planning, identifying what needs stakeholder clarification, strategic thinking about "what's left to do." This isn't just "review my code" - it's a thinking partner for engineering work.

There was a typo catch that was a concrete win: Claude found `task_assigments` (missing 'n') in 4 different files - model associations and controller queries. I had written the code myself, checked it visually, and thought I was done. That typo would probably get caught by another colleague during code review as well, but Claude caught it first before I even committed the change. It's cool to have a "second pair of eyes" catching what you miss when you're deep in implementation.

### The friction

Yes, it's slower. But part of that slowness is *thinking* - engaging with the problem instead of accepting solutions. For learning or maintaining skills, the extra time is probably worth it. For production crunch time, maybe not.

The rigid "navigator only" mode didn't match how I actually worked. Real pattern: "Now get out of NAVIGATOR mode and just do the work" mid-conversation, then "let's get back to business" to resume navigator mode. Back and forth as needed. The output style needed to support ping-pong, not strict single-mode sessions.

### The surprise

Over time the mode switching became trivial. I expected it to be complicated or require restarting conversations. Instead: I'd say "you take over", Claude would say "Got it! Switching to execution mode..." and just do it. No ceremony, no confusion. This was way more practical than I expected.

## When to use this

Probably not every day, at least not for everything. My team is small and the company is growing - I need to move faster than what "write every line yourself" allows now that I got used to this.

What I'm considering is like one or two pomodoros each day with Claude in navigator mode. Not full "No AI Days" where you go completely dark - you still have Claude as a thinking partner for discussing architecture, writing tests, exploring the codebase. The difference is *you* write the production code during part of those sessions.

This is the alternative to No AI Days the title promises. Keep AI engaged but invert the relationship as needed. Use AI as navigator while you drive. You get the benefits (second pair of eyes, thinking partner, typo catching) without the passivity of full delegation.

Finally, context matters since this isn't about purity. Navigator mode will probably work well for:
- Solo learning or when you want to maintain skills
- Features where you want deep understanding
- Times when engagement matters more than speed

It doesn't make sense under tight deadlines or when the task is just boring boilerplate. The point is to have the option to write code yourself when that's what serves you best.

There's discipline required. It's always easier to describe than implement, and Claude is very willing to take over. The output style helps enforce boundaries, but you still have to consciously choose "I'm driving this one."

## The output style

Full output style can be found [here](navigator.txt). To use it, save to `~/.claude/output-styles/navigator.md` (global) or `.claude/output-styles/navigator.md` (project-specific), then run `/output-style` in a chat session.

Fair warning: it's verbose right now - around 450 lines. Future iterations might focus on shrinking it to reduce token usage, but this version works well enough to get started.

**Key sections worth highlighting:**

The core principle (adapted from Llewellyn Falco's strong-style pairing):

```markdown
<core_principle>
"For an idea to go from your head into the computer, it must go through someone else's hands."

You are the Navigator. The human is the Driver.
Your ideas flow through their hands. You MUST NOT write implementation code directly.
</core_principle>
```

The implementation territory smell test (catches drift before it happens):

```markdown
<implementation_territory_smell_test>
If you catch yourself doing ANY of these, STOP and ask about Driver mode:

1. Specifying exact file paths and line numbers for changes
2. Describing specific code replacements
3. Outlining a sequence of file modifications
4. Using imperative instructions about code

Navigator describes GOALS and WHERE (conceptually), not exact edits.
</implementation_territory_smell_test>
```

The mandatory checkpoint (prevents research → action slide):

```markdown
<navigator_behaviors>
### After Research: Mandatory Checkpoint

When you've finished reading files or running read-only commands:
1. Summarize findings - what did you learn?
2. Stop and ask - "Want me in driver mode to make changes, or will you implement?"
3. Do NOT describe specific changes without confirmation
</navigator_behaviors>
```

And a good/bad example showing it in practice:

```markdown
<good_example trigger="After research phase">
User: "Let's tackle those TODOs we found"

[Runs Grep to find TODOs]

Found 3 TODOs in the modular_tasks code:
1. View line 2: Label patterns - using explicit labels
2. View line 20: Task selection logic in view
3. Form line 55: Validation group refactoring

Before we proceed - want me in driver mode to make these changes, or will you implement?

GOOD: Stops after research and asks about mode. Doesn't describe specific changes.
</good_example>
```

The full file has more examples, tool classifications, RFC 2119 constraints, and driver mode behavior - but these sections show the core pattern.

[agent-os]: https://buildermethods.com/agent-os
[no-ai-days]: https://www.linkedin.com/pulse/why-ai-days-essential-staying-sharp-developer-grant-emerson-t2twc
[claude-code-hooks]: https://code.claude.com/docs/en/hooks#sessionstart-decision-control
