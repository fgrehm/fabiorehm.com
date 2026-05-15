---
title: "ChaosDump #001"
date: 2026-05-13
chaos: true
---

I mentioned I'm [tired of AI](/blog/2026/05/12/im-taired) yesterday, this first dump is mostly around AI since it is all over the place but my hope is to have something non-AI whenever I do one of these.

### Background Noise

_Podcast episodes I've left on the background while doing other stuff_

###### [The best argument I’ve heard for why AI won't take your job - Platformer](https://www.platformer.news/ai-job-loss-box-ceo-aaron-levie/)

Been reading the Platformer newsletter for a while, was cool to put a face to the name.

<details><summary>Notes</summary>

- First of a series on how AI is changing our industry
- They talk about some research on "AI stuff" before interview. Looks like high earners are using more AI. All kinds of workers, knowledge workers using more
- Covered the "SASSPocalipse" and "Why AI wont take your job" plus other stuff with
- AI not helping us work less, burnouts everywhere
- If you have access to abundance of intelligence, not free, how to allocate those tokens?
- "The future is gonna be boring if we are just gonna be supervising / reviewing"
  - I agree, and will we want those jobs?! "My jobs is review slop from AI"
  - How to get fullfilment and creativity out of these jobs
  - Net positive if we automate the stuff that people hate doing (ex: doctor writing notes after an appointment)
- "Our needs and demands are just growing based on what we can automate"
- Layoffs, more or less engineers in the future?
  - There will be disruption
  - New types of jobs might come up, less of building apps and more around deploying agents side of things
- "We dont yet know what degrees are off the table"
  - Not gonna get the degree to build apps that you "push a buttom, more like stuff that deals with clinical trials..."

Aaron (the guest) says something I found interesting around 37min I think, not with these specific words:

> This might be the final form factor: An agent that runs for a minute or a month, has access to all data / tools you work with, can act as you or as its own entity, just an LLM constantly in a loop, making decisions, you intervening to steer, review. This appears to the architecture of the future of AI

</details>

###### [State of Agentic Coding #6 with Armin and Ben](https://www.youtube.com/watch?v=JM1sIVIZYRg)

Fun podcast, subscribed and looking forward to listen more. Pretty chill.

<details><summary>Notes</summary>

- Lefos by Earendil: agent in your email, "similar spirit" to [lazychat](/blog/2026/04/17/lazychat/) in a way? I got access to it a few weeks ago, haven't done much besides asking it to summarize some long newsletters I received and had no time to read in full.
- Laugh moments:
  - "The age of attendees was older than expected"
  - "People cant close their laptop anymore"
  - "RAM vs gold"
- Mention of [AI Eng conf](https://www.youtube.com/@aiDotEngineer/videos), already watched these, worth the time:
  - [Mario Zechner:   "Building Pi in a world of slop"](https://www.youtube.com/watch?v=RjfbvDXpFls)
  - [Armin Ronacher & Cristina Poncela Cubeiro: "The Friction is Your Judgment"](https://www.youtube.com/watch?v=_Zcw_sVF6hU)
  - Not the exact words, but the idea of not closing laptop to keep agent running
- Friendly reminder that shit is gonna get expensive
- "The beginning of the end of subsidies"
  - I agree with this, been kidding about it internally with team for a while now
- AI code reviewer, worth it?
  - Personal opinion: yes, but definitely not automatic and always on, should be on demand by default
- AI product used by agents, not humans: seats pricing doesn't make sense, need usage based pricing
- "pi is great as a building block"
- On xAI, Cursor, and why traces are gold
  - TIL: spacex / xai bought cursor?!
  - "The value of traces"
    - Link to his or mario's thingy about sharing pi sesh to huggingface
    - we can built reinf learnings based on that
  - "If you're not the customer you're the product, with cursor, you're both!" :see-no-evil:
  - "Should we worry about our traces?"
    - Do you have the data sharing with anthropics? :P
- On GitHub outages and leaving the platform
  - Frustration is kinda general, we all know that this is related to the explosion in using by agents
  - [mitchellh taking ghostty out](https://mitchellh.com/writing/ghostty-leaving-github)
  - [Armin also wrote about it](https://lucumr.pocoo.org/2026/4/28/before-github/)
- TILs:
  - https://tangled.org/
  - https://antire.com/
  - https://codeberg.org/
- On CVS, Subversion, and how GitHub won
  - good history depending how much you know about the "history of OSS"
  - brief mention of the old times folks did not trust github for proprietary code
- Mentions of:
  - [termDRAW!](https://github.com/benvinegar/termdraw)
  - [tldraw](https://www.tldraw.com/)
  - [presenterm](https://github.com/mfontanini/presenterm)
- "AI makes things too easy, there's value from pain"

</details>

## [Jam Programming Language](https://rapha.land/jam-programming-language/) - Quotes and notes

Pretty refreshing to see this on my feed for a break on "AI stuff" (LinkedIn I think?). Good read if you want to know about things that need to be considered when building new programing languages.

> ... if you think learning a programming language in the age of LLMs is a waste of time, then this post isn’t for you. Saying it up front so you can save some of yours.

You've been warned!

> The cliff between “I can write some Rust” and “I am productive in Rust” is steep enough that good engineers stall on it, and you spend months pulling them up.

Yeah, I had that feeling when I gave it a shot TBH. [please-make-me-an-app](/blog/2026/03/17/please-make-me-an-app/) is fully vibe coded, I tried to read the code a few times but still feels weird. Probably need to write code by hand to get better at it.

> The question I’ve been working on: how do you keep the joyful, immediate feel of a C-like language (Go, Zig, modern C) while making the language safe without a garbage collector? How do you give people the C ergonomic without the C bug class? The compromise that fell out is a language that draws from four places. Today I’m focusing on two; the other two will get their own posts.

> The goal is for Jam to match Rust and Zig on performance. There is no garbage collector, no managed-memory runtime, no per-allocation header to chase, and the codegen is straightforward LLVM IR, so the ceiling is in the right neighborhood by construction.

> Jam isn’t public yet. The compiler exists and runs, but I’m holding the language back from a wider release while I work on the things that make it usable day to day: a stable surface, a package manager, an LSP, a formatter, the rest of the tooling you only notice when it isn’t there. Shipping a language without that is shipping a sharp edge, and I’d rather take the time.

Project site is at https://jamlang.org/

## Speed Reading

_Stuff I read without paying **that much** attention._

### pi-coding-agent stuff

- [Armin Ronacher thread on killing some pi coding agent deps](https://x.com/mitsuhiko/status/2054483288807370790)
  - ["Every `pi update` feels like rolling the dice"](https://x.com/lucasmeijer/status/2054485141557313967), true story given the state of supply chain woes these days
- [The PR](https://github.com/earendil-works/pi/pull/4467) "In total this removes 17 lockfile entries"
- [Armin on using scripting languages for agents like pi](https://x.com/mitsuhiko/status/2054519228456198565)
  > Pi wouldn’t make any sense in rust or go. Extensibility is key to it. That leaves ruby, python, js, php for the most part unless you want to ship an interpreter. None of those languages have any benefit over node.
  - Some interesting replies there
- [Mario (pi creator) joked about it](https://x.com/badlogicgames/status/2054529088191168773)
  - Worth reading the replies for the fun

### [AI Made Us Faster. That Was the Problem](https://x.com/davidfowl/status/2054084334848790652)

<details><summary>Quotes for future me</summary>

> Building production software with AI is not the same as building demos with AI.

> By AI-first, I do not mean "AI writes all the code." I mean we are starting to treat AI as part of the engineering system itself: present during planning, implementation, docs, testing, review, validation, and release.

> We are not just asking AI to write code; we are asking how it changes the whole process of building and shipping software.

> But production software is not judged by how much output exists. It is judged by whether that output is correct, maintainable, understandable, useful, and aligned with what customers actually need.

> ... it also created an overconfidence problem. When there is no back pressure on output, it is easy to generate more code than the team can reasonably absorb, understand, and review. That can be a blessing and a curse.

> Without major breakthroughs in memory, continuity, and long-term context, human operators still hold most of the information required to do complex work well. Agents can move fast. They can generate options. They can write code. They can update docs. They can explore large parts of a codebase. But they often lack the accumulated product context, customer history, architectural intent, team tradeoffs, and memory of why things are the way they are.

> One example is how we plan work. When everything starts to feel doable, the hard part is no longer finding enough work to fill a milestone. The hard part is deciding what to focus on and what to measure

> That is the real work ahead of us: not replacing software engineers, but helping software engineers operate with more leverage while still owning the quality, maintainability, and direction of what they build.

> AI accelerates the work. Engineers still own the result.

</details>

Also TIL: https://github.blog/ai-and-ml/automate-repository-tasks-with-github-agentic-workflows/

### [Amazon employees are "tokenmaxxing" due to pressure to use AI tools](https://arstechnica.com/ai/2026/05/amazon-employees-are-tokenmaxxing-due-to-pressure-to-use-ai-tools/)

> Amazon employees are using an internal AI tool to automate non-essential tasks in a bid to show managers they are using the technology more frequently.

> Some employees said colleagues were using the software to automate additional, unnecessary AI activity to increase their consumption of tokens—units of data processed by models.

That's just terrible IMO, what could go wrong? Right?

## Random stuff that popped up on my gh feed

- https://github.com/xyproto/orbiton
  > Snappy and configuration-free text editor/IDE for the terminal. Suitable for writing git commit messages, editing Markdown, config files, source code, man pages and for quick edit-format-compile cycles when programming. Has syntax highlighting, jump-to-error, rainbow parentheses, macros, cut/paste portals, LSP support and a simple gdb+dlv frontend.
- https://github.com/openchamber/openchamber
  > Desktop and web interface for OpenCode AI agent<br>
  > OpenCode, everywhere. Desktop. Browser. Phone.<br>
  > Why use OpenChamber? Cross-device continuity: Start in TUI, continue on tablet/phone, return to terminal - same session
- https://github.com/ruvnet/midstream
  > MidStream is a powerful platform that makes AI conversations smarter and more responsive. Instead of waiting for an AI to finish speaking before understanding what it's saying, MidStream analyzes responses as they stream in real-time—enabling instant insights, pattern detection, and intelligent decision-making.
- https://github.com/ReviewStage/stage-cli / https://stagereview.app/
  > Code review for the modern era. Backed by Y Combinator<br>
  > A viewer for reviewing local code changes in small individual chapters. Works with any AI agent.
  - Fun fact: I've been experimenting with this flow on the terminal recently. None of what I found so far gets the job done "the way I want". Hopefully we'll get there eventually
- https://github.com/raiyanyahya/how-to-train-your-gpt
  > Build a modern LLM from scratch. Every line commented. Explained like we are five.<br>
  > .. a 12-chapter, 3,900+ line interactive textbook that teaches you how to build, train and run a modern language model from absolute scratch. The same family of architecture behind ChatGPT, Claude, LLaMA and Mistral.
  - Pretty interesting, includes some Jupyter Notebooks. Might be useful whenever I have the money to buy a beefy machine to do that kinda thing? Local models are becoming cool.
- https://blog.tangled.org/vouching/
  > combat LLM spam by building a web of trust
  - Seems like a great idea to fight the "personal assistants" spamming on high profile projects in GitHub these days. Based on https://github.com/mitchellh/vouch/ ("A community trust management system")
- https://tinyhumans.gitbook.io/openhuman
  - Another day, another trending "always on assistant / agent thingy like OpenClaw with second brain vibes"(?)
  - Loved the disclaimer though:
    > OpenHuman is not AGI. But it is a meaningful architectural step closer, with better memory, better orchestration, and better tooling.
  - [Comparisson with other harnesses if you're curious](https://github.com/tinyhumansai/openhuman#openhuman-vs-other-agent-harnesses)
