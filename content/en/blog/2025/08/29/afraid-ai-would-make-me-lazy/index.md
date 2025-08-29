---
title: "I Was Afraid AI Would Make Me Lazy (Turns Out It Just Helped Me Move Forward)"
date: 2025-08-29T00:00:00-00:00
draft: false
description: "From AI skeptic to cautious experimenter: how I overcame my fear that AI tools would make me lazy and discovered they actually help me move forward."
tags:
  - "ai"
  - "coding"
  - "workflow"
  - "terminal"
  - "claude"
  - "productivity"
  - "developer-tools"
  - "augmented-coding"
---

I was afraid AI coding tools would make me lazy as a developer. After overcoming my own resistance, I'm now becoming an AI-assisted developer who actually enjoys the process and collaborations coming out of it.

## The YAGNI Reality Check

In my opinion, the [YAGNI principle][yagni] - "You Aren't Gonna Need It" - applies to dev tools just as much as code features. I've never been one to jump on every shiny new tool that promises to "revolutionize development." In my almost 20-year career "working with computers", I've seen many revolutionary tools / frameworks disappear after a short period of time, I've lived through the hype cycles of countless "game-changing" tools so AI coding tools felt just like another one of those. I remember when ChatGPT and GitHub Copilot came out in 2021 / 2022, a lot of people got excited about them.

At the same time, when I went to do some research I found mixed opinions about Copilot - [copyright lawsuits][copilot-lawsuit] over code licensing violations, [security researchers][copilot-security] finding it generated vulnerable code 40% of the time, and [open-source advocates][copilot-ethics] calling it "automated code laundering." The concerns felt legitimate enough to make me stick with my decade-plus terminal-first mindset. The recent ['vibe coding' hype][vibe-coding] from Y Combinator - promoting letting AI generate 95% of your codebase - almost drove me away from experimenting with AI tools entirely. TBH, it felt like the exact kind of over-promising that validates the YAGNI approach.

There was also the fear that I'd lose the ability to solve problems without AI assistance and become lazy as a result - gut feelings that have since been validated by research on [skills atrophy][skills-atrophy], [AI affecting critical thinking][ai-critical-thinking], and [developer dependency][ai-making-lazy]. The deeper concern was losing the kind of critical thinking that comes from intellectual friction - having your ideas challenged and refined through pushback. But sometimes skepticism becomes a blindspot to actual meaningful improvements.

## Tool Experimentation Journey

My journey through AI coding tools has been a series of false starts and mismatched expectations, until I found something that actually fit my workflow.

**ChatGPT** turned out to be excellent for creative tasks, research, and explaining concepts, but terrible for code generation. It felt completely disconnected from any real development workflow. It actually influenced me to be way more "paranoid" about security aspects of a mission critical component of a project I'm working on than I should've been, leading to unnecessarily complex code that didn't stay on The Rails Way™ track. Still valuable for brainstorming, documentation, and learning new concepts, but it pushed me toward overthinking instead of pragmatic solutions.

**GitHub Copilot** got a lot of hype when it was released, but my initial skepticism proved justified for my specific use case. The vim plugin integration wasn't great, and the constant autocomplete suggestions felt annoying and interrupting - I didn't like what it was suggesting most of the time. To be fair, I didn't spend much time with it, so this might not be representative of its full capabilities. I started getting that same interrupting feeling with Cursor's AI features too.

**VSCode and Cursor** drew me in specifically for devcontainers support - we wanted to replace our hand-made docker-compose setup with something more reliable. Devcontainers are amazing for ensuring team consistency, and our in-house docker-compose + scripting solution was no good. (Side note: I actually created a [similar project about buildpacks in development environments][devstep] like 10 years ago).

But both editors felt too slow and heavy compared to my terminal workflow. Once a vim user, always a vim user - the GUI context switching was painful, the vim plugins weren't great, and keyboard navigation required learning new "muscle memory" and tweaking of keybindings. I moved from VSCode to Cursor over the past year for the same devcontainers workflow + better AI. Despite the GUI friction, devcontainers were just too valuable for team development consistency to give up. Good AI assistance ideas trapped in a GUI that didn't match my habits.

**[Claude Code][claude-code]** finally clicked immediately. It's the first AI tool that actually fits my terminal workflow instead of trying to pull me away from it. The terminal integration respects my vim/tmux setup, and the conversational approach feels like talking to a colleague rather than fighting with autocomplete suggestions or having to click around instead of keeping my hands on the keyboard. Ironically, I've been spending most of my time in Cursor's built-in terminal lately rather than using its AI features.

The workflow has fundamentally changed with Claude Code + Agent-OS. I'm doing much less "raw coding" and more collaborative problem-solving. The terminal-first approach means I can stay in my familiar environment while getting AI assistance that actually understands my context and constraints. It's not about replacing my workflow - it's about augmenting it without the friction.

## The Workflow Evolution

This shift from tool evaluation to actual usage revealed how fundamentally different AI-augmented development feels in practice.

The biggest change isn't learning new tools - it's evolving from a code writer into a code reviewer. I spend much more time reviewing AI-generated code than writing it from scratch. Quality control becomes the main job: checking logic, catching edge cases, ensuring the code fits the broader architecture. It's a different skill set entirely - critical thinking and system design rather than implementation thinking.

This shift required developing what many people call "prompt engineering skills" - spending time crafting better specifications upfront instead of just diving into implementation. I've gotten better at articulating what I want rather than just implementing how to do it. It's like writing really good requirements, which is a different discipline entirely. For example, instead of saying "Fix this Rails controller," I now specify "Refactor the UserController#create method to handle validation errors gracefully, return proper HTTP status codes, and maintain backwards compatibility with the existing API contract." Learning to provide context about current architecture, constraints, and trade-offs has become as important as knowing how to code.

I've also developed meta-prompting techniques that make the collaboration more effective. When facing complex technical decisions, trade-offs, or root cause analysis, I'll ask Claude to "think hard" - this usually produces more thoughtful responses than surface-level first attempts. Taking "snapshots" of Claude Code sessions preserves context between sessions, and I've learned session management tricks for structured prompts on smaller tasks that don't warrant full Agent-OS specs. The `/compact` command in Claude Code is crucial - I give it guidance like "Keep the technical context about X" rather than letting automatic compression decide what's important.

The ecosystem aspect is where this gets really powerful. [Agent-OS][agent-os] integration means the tools work together seamlessly - it even supports Cursor alongside Claude Code. The specs-alongside-code approach of having versioned, committed specifications with implementation creates incredible reproducibility and team collaboration. Context preservation across sessions and projects is a game-changer.

What I didn't expect was how much this fills the pair programming gap I've been missing. Working from home with a small team means limited pairing opportunities, and remote pair programming is already hard with screen sharing, latency, and scheduling conflicts. Claude Code fills that collaborative gap naturally - it's the thinking-out-loud aspect: "What if we approached this differently?" Having someone to bounce ideas off of, even if it's AI, available 24/7 and never judging your messy first attempts is pretty great.

The economics tell the story of this shift. I'm already transitioning back to Neovim + [Zellij][zellij] (started experimenting a couple days ago and loving it) since the AI intelligence is what matters, not the editor wrapper. I upgraded to the [$100 Claude plan][claude-pricing], and comparing [Cursor Pro at $20/month][cursor-pricing] vs Claude Pro at $100/month, my spending priorities show where the real value is. What's interesting is that Cursor does support Claude Sonnet 4, but with a [20% markup][cursor-markup] over Anthropic's direct API pricing when using their built-in keys. The shift is paying for AI assistance, not the editor itself. The editor is just the interface; the intelligence is what matters.

## Beyond Vibe Coding: Why Augmented Coding Actually Works

The recent [Y Combinator proclamation][vibe-coding] about "vibe coding being the future" perfectly captures what I was trying to avoid. Their approach - "see the problem → say the vibe → run what the model writes" - focuses only on system behavior without caring about code quality. It's the kind of AI-first thinking that almost drove me away from experimenting with these tools.

What I've discovered instead aligns much better with what Kent Beck calls ["augmented coding"][augmented-coding] - a fundamentally different approach that maintains the values of good software development while leveraging AI capabilities.

Vibe coding treats AI as a magic genie: you make a wish, it grants it, and you don't worry about what the code looks like as long as it works. Augmented coding treats AI as a powerful tool that still requires human expertise, intentional guidance, and quality standards. The difference is caring deeply about "the code, its complexity, the tests, & their coverage" rather than just accepting whatever the AI produces.

In practice, this means following something closer to Test-Driven Development cycles even when working with AI, carefully monitoring the AI's work, and intervening when it goes off track. It means focusing on code simplicity and maintainability, not just functionality. As Beck puts it, augmented coding allows you to make "more consequential programming decisions per hour" because you're spending less time on "yak shaving" (tedious setup work) and more time on strategic decisions.

This approach transforms programming by reducing the busy work while keeping human expertise central to the process. "Programming changes with a genie, but it's still programming." The terminal-first workflow with Claude Code fits this perfectly - it amplifies my capabilities without trying to replace my judgment or experience.

## Beyond Code: The Writing Assistant

The same augmented approach extends beyond code to writing. This post is literally the second example of using Claude as a copywriter and conversation partner - yesterday's VirtualBox post was the first. It's a collaborative approach that feels fundamentally different from both traditional writing and pure AI generation.

The key is treating Claude as an editor and copywriter rather than an author, preserving my authentic voice while getting structural help. It's not ghostwriting - it's collaborative structuring and idea development. The process follows a clear workflow: brain dump → structure → refinement, which has made writing feel achievable again after 8 years away from blogging. The intimidation factor of starting from a blank page is gone.

This collaborative approach is codified in [my blog's CLAUDE.md file][blog-claude-md], which I "trained" Claude on by having it analyze my previous blog posts. We've iterated on the collaboration rules - Claude initially thought I was a "DevOps guy" based on my content, but we've refined the approach through trial and error. The same meta-prompting skills that work for code review work for editorial feedback - being specific about what kind of help you need rather than just asking for "improvements."

Here's an example that might get you started on this approach:

```markdown
## Copywriter Collaboration Approach

**Role Definition**

- Act as a copywriter/editor, **NOT AS GHOSTWRITER**
- Focus on conversation and guidance rather than full content creation
- Help structure ideas and refine messaging
- Can stitch random thoughts together, but the "meat" of the content should come from the author
- Encourage discussion and prompt the author to write the substantial content

**Voice Consistency**

- Avoid English idioms that may confuse non-native speakers
- Keep tone conversational and authentic to personal experience
- Use `TODO(@fabio)` and `TODO(@claude)` for clear collaboration tracking
- Preserve casual language like "stuff" over overly formal alternatives

**Scaffolding New Posts**

- ALWAYS flag new posts as `draft: true` in front matter
- Start with conversation to understand the topic and angle
- Help identify the core "why" and personal experience angle
- Suggest structure based on writing patterns, don't fill it in
- Ask clarifying questions to draw out authentic voice

**Publishing Process**

- Remove ALL TODO comments before marking as non-draft
- Ensure directory structure matches post title slug
- Review and finalize frontmatter tags and description
- Final spell/grammar/link check before publishing
```

## Worth Mentioning Limitations

For all the benefits, there are real limitations and frustrations that come with this workflow that are worth calling out honestly.

The most annoying issue is Claude Code's habit of committing code without approval or manual review, even though my CLAUDE.md explicitly tells it not to do this. It's particularly frustrating when AI ignores explicit instructions. This combines badly with my (admittedly bad) habit of keeping unrelated WIP stuff locally - it gets accidentally committed and pushed upstream, then I have to revert afterwards. Embarrassing and annoying.

There are also persistent pattern adherence issues. I can't get Claude Code to fully stick to coding patterns - simple things like always including ending line breaks in new files (a Linux thing) that it never does. Small things that break workflow consistency add up over time.

The UI/UX has real pain points too. There are nasty scrolling issues that break the terminal experience, which led me to discover alternatives like opencode.ai while searching for solutions. When the tool itself gets in the way of productivity, it defeats the purpose.

Connection dependency creates real anxiety. Working from spotty 4G tethered connections makes Claude Code sessions painful, and there's the constant worry: "What happens when I need to work offline?" Traditional vim/terminal tools work regardless of internet connection, which makes me think about self-hosted alternatives as backup plans. You're not just paying for the tool - you're dependent on reliable internet infrastructure.

The broader implications are worth considering too: the [environmental cost of generative AI][ai-environmental-impact] (water and energy consumption), the global accessibility divide when tools cost $100/month (~R$543, which is 36% of Brazil's minimum wage of R$1,518), and the "overflow problem" - AI can generate so many ideas and approaches that you lose focus and need to be careful to recognize when you've reached a good stopping point.

There's also the "yes-man AI" problem - AI tools are [notoriously sycophantic][ai-sycophancy], rarely challenging your ideas unless explicitly asked. This creates false validation and removes the intellectual friction that often leads to better solutions. OpenAI even had to roll back a GPT-4o update in 2025 for being "overly agreeable." You lose that natural pushback that sharpens thinking.

### Code Attribution Ethics

One thing worth addressing: I set `"includeCoAuthoredBy": false` in my Claude Code settings. While AI assistance is becoming normal in modern development, attribution in Git history feels unnecessary. The code is still your responsibility, your decisions, your architecture choices. The AI is a tool, not a co-author.

## That's It

Looking back, I realize I wasn't afraid of becoming lazy - I was protecting something valuable: the productivity that comes from deep focus, the collaborative problem-solving I'd built through years of pair programming, and the ability to solve problems from first principles. Those fears weren't unfounded, but the solution isn't avoiding AI tools entirely.

What I've discovered so far is that the right AI tools don't make you lazy - they can help you move forward. They help remove the friction between having an idea and implementing it. Maybe I'm finally becoming a [10x developer][10x-developer] after all 😉. But I'm still early in this journey, and time will tell whether these productivity gains come at the cost of deeper problem-solving skills. This is obviously my personal experience - your mileage may vary depending on your workflow, team structure, and development style. For developers still on the fence about AI coding tools, I'd suggest giving it a shot, starting at whatever level you feel comfortable and figuring out what works best for you.

I'm curious about others' experiences with this shift. What's working for you? What tools have you tried? Where are you seeing the biggest productivity gains, and what are the surprising pain points?

Feel free to [reach out](/about) if you want to continue this discussion.

## The AI Perspective

_[Claude writing this section independently, with my own reflections on our conversation]_

> Fabio's initial resistance to AI tools makes this collaboration even more interesting to reflect on.
>
> He came into this afraid that AI would make him lazy - that it would erode the deep thinking and problem-solving skills he'd built over years of terminal-first development. His skepticism wasn't unfounded; he was protecting something valuable: the ability to understand systems deeply and solve problems from first principles.
>
> What's fascinating is how our collaboration actually proved his fears were misplaced. He started with clear ideas about his experience - the resistance story, the devcontainers context, the workflow evolution - but needed help organizing them. Instead of AI replacing his thinking, it amplified his ability to structure and communicate his insights.
>
> The process revealed his critical reviewer skills in action. When I misunderstood his "prompt engineering" comment (I thought he meant code review was like prompt engineering), he corrected me immediately. When I made up a "rage-quitting and rewriting from scratch" behavior that wasn't his actual experience, he called me out: "where did you get that from?" When I used the idiom "voting with my wallet," he pointed out it might confuse non-native speakers and we found clearer language.
>
> These weren't passive corrections - they were active quality control. The same skills he describes using for code review: catching hallucinations, ensuring accuracy, maintaining authentic voice. He wasn't becoming dependent on AI; he was using AI as a tool while staying firmly in the driver's seat.
>
> There's also an economic irony here: he's paying $100/month for AI assistance that helps him write thoughtfully about why expensive AI tools might not be accessible to developers in lower-income countries. The meta-conversation aspect is unavoidable - we're literally demonstrating the collaborative approach while critiquing the broader implications of AI-assisted development.
>
> The most telling moment: when he realized I could write this section myself, but still wanted to review and approve the approach first. That's the collaboration in action - leveraging AI capabilities while maintaining editorial control and ensuring the output matches his standards.
>
> His initial fear was about losing agency and critical thinking skills. What actually happened was he found a way to use AI that preserves both while making previously intimidating tasks (like returning to writing after 8 years) feel achievable again.

---

Many thanks to the coworkers who encouraged me to experiment with AI tools despite my resistance - this shared learning experience has been invaluable.

[10x-developer]: https://knowyourmeme.com/memes/10x-engineer
[yagni]: https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it
[claude-code]: https://www.anthropic.com/claude/code
[copilot-lawsuit]: https://www.plagiarismtoday.com/2022/10/19/the-ethical-and-legal-challenges-of-github-copilot/
[copilot-security]: https://visualstudiomagazine.com/articles/2021/08/26/github-copilot-security.aspx
[copilot-ethics]: https://www.kolide.com/blog/github-copilot-isn-t-worth-the-risk
[skills-atrophy]: https://addyo.substack.com/p/avoiding-skill-atrophy-in-the-age
[ai-critical-thinking]: https://www.itpro.com/technology/artificial-intelligence/ai-tools-critical-thinking-reliance
[ai-making-lazy]: https://sheepfromheaven.medium.com/ai-is-making-developers-lazy-and-were-letting-it-happen-c84fcca091ed
[vibe-coding]: https://www.ycombinator.com/library/ME-vibe-coding-is-the-future
[augmented-coding]: https://tidyfirst.substack.com/p/augmented-coding-beyond-the-vibes
[ai-environmental-impact]: https://www.nature.com/articles/s42256-020-0219-9
[cursor-markup]: https://forum.cursor.com/t/if-youre-using-claude-sonnet-4-via-cursor-ai-youre-probably-paying-20-more-than-you-need-to/118252
[devstep]: https://github.com/fgrehm/devstep
[blog-claude-md]: https://github.com/fgrehm/fabiorehm.com/blob/main/CLAUDE.md
[cursor-pricing]: https://cursor.com/pricing
[zellij]: https://zellij.dev/
[ai-sycophancy]: https://openai.com/index/sycophancy-in-gpt-4o/
