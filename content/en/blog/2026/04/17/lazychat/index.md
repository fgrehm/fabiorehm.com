---
title: "Give your agent a mailbox"
date: 2026-04-17
tags:
  - claude-code
  - pi-coding-agent
  - tooling
description: |
  A file-based async discussion protocol for pair programming with AI agents. Chat
  is the wrong shape for thinking work; a markdown file in the working tree gives
  you back the email thread.
---

I'm starting to come to the conclusion that "rapid-fire chat" with agents is bad for work that requires deep thinking (I'm probably not the only one at this point). If we combine that with running multiple chats with agents begging for our attention, that's a recipe for AI burnout right there.

Many features and discussions need time to think, internalize the knowledge, crystalize the big picture in our brains, something that happens when we go through multiple rounds with some time to think in between them.

As some have been saying, we better start [slowing the fuck down][slow-down] or [the AI vampire will catch us][ai-vampire]. [Terry Godier][body-language] put it well, writing about the speed of communication:

> A letter, hand-written, sealed, carried by horse or ship, might take weeks to arrive. The writer knew this. They wrote with that delay in mind, which meant they wrote with a kind of weight. (...) The delay was never just a limitation. It was where the thinking happened.

This week I was hacking on a side project in between pomodoros and experimented with a flow that I haven't seen been discussed out there.

The gist of the process is basically a shared markdown file with an agent where we go through multiple rounds of Q&A until we come to an agreement on how to tackle something complicated. Some might view it as the old days when we bounced ideas through email and took our time to write a proper reply. A mailbox for your agent, basically.

In a world where things are moving as fast as they are, having a text file with the evolution of how something came to be in a well structured format is priceless and gives me peace of mind, especially for side projects which might need to wait for me to have the time to go back and do something. The feeling of not having a chatbox waiting for me to type in an answer and not having to worry about context loss is great and reduces anxiety as a side effect.

I got excited about it and think it is something that might benefit others, so I packaged the pattern as [lazychat][lazychat-repo]. Two load-bearing files (a SKILL.md and a template) plus a README and a LICENSE. No installation needed, just copy the files into place and that's it, should be super easy to adapt to your way of writing / chatting too.

## The problem with coding agent chats

The re-quoting is also a terrible UX, questions end up fading away into yet another infinite scroll we got into our lives (like if social media wasn't enough already).

Chats are LIFO and humans have to answer in the order that the agent wants or we risk misinterpretation by the model. I'm pretty sure most of you that went through a long ass session eventually realized that it was best to just start fresh at one point. But how can you start fresh if nothing got persisted? Sure, you can tell the model to "flush to disk", or save the memory on "_<insert this week's revolutionary memory system here>_", but at that point your words might get distorted and important context (especially the little details or nuances of a problem you've explained in great detail) will fade away.

Chat transcripts are also hard to revisit but a file can be re-opened, git-tracked, and referenced later. I've seen chat transcripts vanish from inside a container out of nowhere from one day to the other. I built [clotilde][clotilde-repo] back when Claude Code didn't have named sessions as a first-class citizen so I could easily resume based on names, and even with that safety net, some sessions still go missing.

## Models' "interviewing formats" are inconsistent

The inconsistency is the one that bit me most (even for the same models). Sometimes questions came labeled with numbers or letters. Sometimes they got nested, sometimes numbers got duplicated, sometimes questions are not even numbered and come as "plain old bullet points."

No numbering or "zero classification" is the hardest one: the only way to reply to those is to reference the question in your own words, or reply in the order they came and hope that the model does the right thing.

I ended up creating my own workflow to make sure the model stays on track during long discussions to shape / plan complicated work. When I'm asked for many questions in a row, I'd switch into zellij's scroll mode, copy the questions, go back to Claude's `vim` mode with `Ctrl+g`, paste them in and reply in "old school email format" with ">" quoting the agent's messages / questions ("like the Incas and Mayans" as we say in Brazil).

## So I started replying in a file

At one point I got tired of going through all those hops to keep a discussion going, the "chat -> zellij scroll copy -> chat -> vim mode -> reply -> more questions -> rinse and repeat" is tiring.

The project that I first tried this in a more "formal" way is related to lazychat so I'll give a teaser by sharing its name (`lazypAIr`) and the tagline ("_Less thinking spinners, more synapses_"). Suffice to say that I wanted to shape the MVP of the project async across multiple sessions on my own time, using different models to avoid bias.

Being able to just see the questions and go do something else (like real work that pays the billz) without losing context makes me a lot less anxious. I know that when I reach a stopping point or when I have an insight throughout the day I can just open the markdown, jot some notes and move on with my life, the agent won't see those notes, only my final, well thought answer.

## Le protocol

Lazychat is not rocket science, the "protocol" fits on a postcard:

1. Tell the agent to create `.lazyai/YYYY-MM-DDTHHMM-topic.md` from a template.
2. Make it write questions, proposals, drafts - freeform, _in the file_.
3. Once done, it will stop and tell you in chat: "file is ready at `<path>`."
4. You reply in the file at your own pace however you want to do so: inline, new section, quoted, prose - doesn't matter.
5. When you're done, tell the agent to re-read end-to-end and move on until you both agree that the discussion is done.

There is no need for any special vocabulary or rigid structure, the file is the thread and it's self sufficient.

## Fighting scope creep

The first version of the template inside lazypAIr had a lot of guidance about reply vocabulary, round types, lifecycle rules and god knows what else, I already deleted that version. Every subsequent discussion I had using it got shorter and simpler, the agent and I didn't need the scaffolding and by the time I was ready to extract and ship a v0, I had cut most of it.

The discussion template is just a markdown with an invalid HTML tag and HTML comments so it's [invisible on GH web][template-rendered] (need to [open in code mode][template-plain]), here's what it contains:

```markdown
# <topic>

<!--
One paragraph: what we are figuring out, why it matters, and what the target artifact is.
Example: "Designing the SKILL.md for the new lazychat repo; target is SKILL.md committed to lazychat main."
-->

---

<!--
Agent writes questions, proposals, or drafts below, freeform.
Human replies on their own time. Inline, in a new section, or in prose. No required structure.
-->
```

One small detail I did end up adding by hand: the `>` block quotes around the agent's questions in the file you're about to see below. The agent didn't produce those, I did, so I could reply inline without the thread getting tangled. I might bake that into a more structured template later. For less capable models, structure probably helps more than it hurts but for a v0 with capable agents, I wanted to see what emerged without it.

## What lazychat actually is

Again, no rocket science, head over to [github.com/fgrehm/lazychat][lazychat-repo] to see it, the whole thing works with just these 2 files:

- `SKILL.md`: tells the agent when to use the protocol and how to operate it.
- `templates/discussion.md`: the 13-line starting point for any new discussion.

The repo includes [an example discussion][cli-example] with the shiny new Opus 4.7 about the benefits of introducing a small CLI to improve the workflow.

## Status and what's next

This is intentionally minimal, like the bare minimum v0.0.1 extracted from two days of use, mostly with Claude Code and pi.dev. Early results on open models offered by Ollama cloud suggested the flow works, I'll try to document which ones work best in the project's README as I use this more.

I'll probably write more about it when I get to introduce more templates and when lazypAIr gets into "demoable" shape. :v:


## META: The discussion that shaped this post

I used lazychat to write this post, the full verbatim discussion is below.

<details>
<summary>Click to read</summary>

```yaml
title: Blog post about lazychat
started: 2026-04-16
model: claude-opus-4-7
status: scaffolded
```

# Blog post about lazychat

```md
<!--
Shaping a blog post on fabiorehm.com about lazychat: the file-based async discussion
protocol you just extracted from lazypair. Target artifact is a post under
content/en/blog/YYYY/MM/DD/lazychat-slug/. This discussion decides audience, angle,
length, what personal experience to surface, and what NOT to cover. Using lazychat
itself to plan the lazychat post is on the nose, and on-thesis.
-->
```

---

## What I know going in

- Project is minimal: SKILL.md, README, template, LICENSE, one worked example.
- Thesis (from README): chat is lossy for multi-decision work — context rot, sequential forcing, no persistent artifact, proposals get paraphrased on reply.
- Origin: "a day of real use with pi.dev and Claude Code." Distilled from a longer spec that was cut.
- Not yet public. Post would likely land near the repo going public, or slightly before/after.
- Per `CLAUDE.md`, my job here is copywriter/editor, not ghostwriter. I will push for your lived moments over generic framing. If a section could pass as the project's README, we have gone too far.

## Questions to pin down before any drafting

### 1. Audience

> Who is the reader? This changes everything — vocabulary, what needs explaining, what can be assumed.
>
> - (a) Other Claude Code / agent-skill users. They know what a skill is, what `~/.claude/skills/` means, what pi.dev is.
> - (b) The broader AI-assisted-coding crowd. Knows "AI pair programming" but not the skill ecosystem. Needs a bit of setup.
> - (c) Dev tooling readers generally. Minimalism + async collaboration might land even for folks who do not use agents daily.
> - (d) Future-you / your own archive. Posts you write to remember why you built a thing.
>
> My read: you have previously written for a mix of (a) and (b), leaning (b). The lazychat thesis is accessible enough that (c) is reachable without much extra scaffolding. If you tell me the audience, I will stop guessing at reading level.

I think more like (b) and (c).

### 2. The angle — what is the post *really* about?

> Candidate framings, roughly ordered from concrete to reflective:
>
> 1. **"Here is lazychat, here is how to use it."** Announcement-shaped. Risks reading like the README.
> 2. **"Chat is lossy for pair programming. Here is a file-shaped fix."** Problem-first. Leads with the four failure modes from the README, lazychat arrives as the answer.
> 3. **"A day of real use, and what survived distillation."** Origin-story-shaped. You had a longer spec. You cut it. What was load-bearing, what was decoration. This one lets your voice do more work.
> 4. **"Email thread with an agent."** Metaphor-first. Short, rhetorical, leans on the familiar shape of an email thread. Works as a note, maybe not a full post.
> 5. **"The scope I did not build."** Anti-feature post. What lazychat is *not* (CLI, reply vocabulary, round types). Fits your "PITA, HUGE, I'm not 100% sure" voice and the project's own discipline.
>
> My instinct: (3) is the strongest for your voice because it lets you tell the story and still cover (1) and (2) along the way. (5) is tempting but narrower. (2) is safest but most README-adjacent.
>
> Which of these pulls for you? Or is there a different one-liner the post is really about that I am missing?

I'd say 2 and 3

### 3. The lived moments

> Per `CLAUDE.md`, the meat comes from you, not me. A few prompts so you can scribble raw notes; I will shape them later:
>
> - **The break moment.** When did chat stop working for a piece of pair-programming work recently? What were you trying to decide? What did the agent do that felt wrong?

It didn't necessarily break, but things were almost never consistent: sometimes questions came as numbers, or letters. Sometimes nested, sometimes numbers got repeated, sometimes not even numbered.

No numbering or "classification" is the hardest one: the only way to reply to those is to reference the question in your own words, or reply in the order they came.

A workflow that started emerging to me was to get into zellij's scroll mode, copy the questions, enter claude's vim mode with `Ctrl+g`, then reply in old school email format with quoting like "the Incas and Mayans" as we say here in Brazil, or just "old school" in plain English.

The other issue is the fact that chat encourages one shot / "rapid fire" conversations, some discussions need thinking, seeing the big picture, going through multiple rounds, etc. If we rely on chat only then we are at mercy of how the model handles it's context window (which might get compressed btw).

And finally: chats are ephemeral by nature, I've ran into situations that my chat sessions went missing inside containers out of the blue. [clotilde](https://github.com/fgrehm/clotilde) helps me remember them but for whatever reason claude removes some of them ad hoc (or maybe I do something wrong? hard to tell TBH)

> - **The first time the file worked.** The first topic you ran async-through-a-file with pi.dev or Claude Code. What was the topic, and what did the file give you that chat could not?

I'm working on another project called lazypAIr which expands on this "slow AI" idea (spoiler: "Less thinking spinners, more synapses" is the tagline). I had done some experimentation with pi extensions and claude hooks which worked ok and I wanted to shape a MVP of it async across multiple sessions.

What did the file give me? Peace of mind honestly, I knew that I would just open the document and reply on my own time whenever I had a break between pomodoros, without the pressure of a chatbox waiting for me to type in an answer.

> - **What you almost built but did not.** The longer spec with rounds, reply vocabulary, round types — why did you cut it? Was there a specific moment you realized it was ceremony?

I think the patterns will naturally evolve, the first version of the template had lots of guidance and every chat I had after the initial one was getting reduced down to a minimum which resulted in the version I shipped with v0.

I tested this idea with a handful of models on ollama cloud too and they all seemed to understand the flow naturally without much structure.

I might add a more structured template later based on more usage, for example, this document started without any `>` block quotes, I manually added them. I think giving some guidance on how to structure questions and answers might benefit this flow when using less capable models.

> - **The pi.dev / Claude Code pairing.** You are running two agents. Does lazychat matter more for one than the other? Does one of them "get it" more naturally?

Hard to tell at this point.

> - **The smallest thing that surprised you.** A small unexpected win or annoyance from actual use. Those ship the post.

I'm just impressed that this worked with minimal guidance so far TBH. Maybe the constant reading of the content + the fact they might have been trained on old school forums might help them understand the idea of replying inside the document.

> Don't answer all of these. Three raw bullets per prompt you have something on is plenty — I will weave.

:X

### 4. The CLI-packaging example

> `examples/2026-04-16T1811-cli-packaging.md` is the project's strongest demo — it shows the protocol *and* carries the meta-decision about lazychat's own scope. Two options for the post:
>
> - (a) **Link to it, don't quote it.** Post stays short, example lives in the repo. Readers who want proof click through.
> - (b) **Quote a slice in the post.** One round, maybe just the "Questions for you" → your freeform reply. Shows the texture (freeform human reply, no vocabulary). Cost: adds length and leaks into repo territory.
>
> I lean (a) for a tight post, (b) if we want one section that *shows* rather than tells.

I'm actually thinking about shipping this actual document as a `<details><summary>` block in the final post.

### 5. Format and length

> - **Blog post (`/content/en/blog/`)**, 800–1500 words, room for origin + thesis + example + related work.
> - **Series?** Your "Devcontainers Without the Ceremony" thinking has a shared thread with lazychat's minimalism ("what was load-bearing, what was cut"). Not necessarily formal series tie-in, just worth asking whether you want to cross-link.
>
> My lean: blog post, 900–1200 words, no series wrapper, but an optional callout tying the "cut the ceremony" thread to the crib post if that feels natural.

This has nothing to do with crib, but yeah, small / mid sized post? (not counting this discussion)

### 6. Timing vs. the repo going public

> - (a) **Post lands before the repo is public.** Teaser shape. Risky — readers click through and find a private repo.
> - (b) **Post lands the same day.** Announcement shape. Needs the repo polished.
> - (c) **Post lands a week or two after.** Reflective shape — lets you write from "I used this for two more weeks" rather than "I had a day of use." Strongest evidence, weakest urgency.
>
> My lean: (c) if you can stand the wait. (b) is fine. (a) I would avoid.

(b), I can write a follow up later

### 7. What I should *not* write

> Things I will keep my hands off unless you tell me otherwise:
>
> - The "break moment" anecdote. Yours to tell.
> - The pi.dev specifics. I do not use it and would invent.
> - Any "why I open-sourced it" framing that claims a motivation you did not state.
> - The relationship to lazypair (the parent project). I know it exists; I do not know the story.

Yeah, if you have questions just ask

## What I would like from you next

- A line or two on audience (pick a, b, c, d or describe).
- Which angle (1–5) pulls, or a replacement one-liner.
- Any raw bullets under the "lived moments" prompts you have energy for today.
- A lean on format (note vs post) and timing vs repo going public.
- Anything I should add to the "do not write" list.

No need to answer all of this in one sitting. Drop in when you have something. I will re-read end-to-end when you signal.

---

## Round 2 (agent)

### What I heard

- **Audience**: (b) + (c). No skill-ecosystem assumptions. "What is a Claude Code skill" can be a one-liner or a footnote, not a section.
- **Angle**: (2) + (3). Problem-first opening ("chat is lossy"), origin threaded through the middle ("here is what survived distillation"). The two blend naturally because the distillation *is* the response to the lossiness.
- **Format**: small/mid post, discussion embedded as `<details><summary>` block. That is a great move — the post argues chat is lossy, then shows a file that is not. Self-proving.
- **Timing**: (b) same day as repo public. Follow-up post later once you have more miles.
- **Voice gold I will try to preserve**:
  - "Old school" / "Incas and Mayans" email quoting — authentic, specifically Brazilian, ties the file-based idea to a familiar human pattern.
  - "Peace of mind between pomodoros" — candidate hook or pull-quote.
  - "Less thinking spinners, more synapses" — tagline from lazypAIr, strong, but see Q1 below.
  - The inconsistency anecdote (numbers, letters, nested, not-numbered) is the sharpest specific failure-mode. Landed well.

### Questions before I draft a skeleton

> 1. **lazypAIr reveal.** You mentioned it by name with the "slow AI / less thinking spinners, more synapses" tagline. Are you ready for that to be public in this post, or should I refer to it as "another project I am working on" or just skip it? Teasing an unshipped project in an announcement for a different project is fine, but your call.

Tease it

> 2. **Clotilde link.** You mentioned it in the context of chat-session loss. Worth a one-line link in the post (problem framing: chats are ephemeral, I even wrote a tool to archive them, and they still go missing), or keep clotilde out to avoid sprawl?

Mention, I built clotilde back when claude didnt have named sessions as a first class citizen.

> 3. **Ollama cloud experiment.** "Tested with a handful of models on ollama cloud, all understood the flow naturally" is a surprisingly strong piece of evidence — it weakens the "this only works because Claude is special" objection. Worth one sentence, or cut to keep the post focused?

Worth it, I can try and get the model names tomorrow

> 4. **Opening hook.** I can pitch drafts later, but a direction check: do you want the opening to be
>
> - (a) **Inconsistency-first** — "The agent asked me five questions. Two were numbered, one was a letter, one was nested, one had no marker at all." Concrete, annoying, recognizable.
> - (b) **Peace-of-mind-first** — "Between pomodoros I open a markdown file and reply to my agent. That is my whole pair programming workflow now." Counterintuitive, softer.
> - (c) **Chat-is-lossy-first** — the README thesis, but in your voice. Safest, least distinctive.

Maybe combine the 3? Dunno, if I were to pick one I'd say (c) or (b).

> 5. **Title candidates** (brainstorm, not commitments):
>
> - "Pair programming with markdown files"
> - "Chat is lossy. A file is not."
> - "Old-school email with my AI agent"
> - "lazychat: a file-shaped reply to chat's failure modes"
> - "Between pomodoros: async pair programming with AI"
> - Something you already have in mind?

More ideas:
- Give your agent a mailbox for async collaboration
- Something that calls out that rapid shot chats for "thinking intensive" or creative work is terrible. We need time to think and process ideas / information

> 6. **Embed shape.** The `<details>` embed — which slice? Options:
>
> - (a) The full file verbatim. Long but honest.
> - (b) This whole discussion, cleaned up lightly (fix typos, remove this meta round if it feels too self-referential).
> - (c) Just Round 1 questions + your answers. Shorter, still shows the texture.
> - (d) Just the CLI-packaging example from the repo, not this file at all.

(a)

### Proposed skeleton (rough, all sections short)

Intent: each section a few paragraphs max, room for your voice, no section that could pass as the README.

```
# <title>

<hook — 1 short paragraph, direction TBD per Q4>

## Chat is lossy for multi-decision work
<the four failure modes, in your voice not the README's>
<inconsistent-numbering anecdote fits here, woven in from Round 1>

## So I started replying in a file
<peace-of-mind-between-pomodoros moment, lazypair MVP context per Q1>
<"the first topic I ran async" beat — one short paragraph from Fabio>

## What survived distillation
<longer spec existed, got cut, patterns emerged on their own>
<the ollama cloud observation if Q3 lands as yes>
<the ">" block quotes detail is fun — the template evolves from usage, not design>

## What it is, minimum viable
<four files. SKILL.md + template + README + LICENSE. One worked example.>
<one sentence on "what is a Claude Code skill" for audience (b)/(c)>
<pointer to the repo>

## The discussion that wrote this post
<setup sentence, then <details><summary> embed per Q6>

## Status and what is next
<v0. Follow-up later once I have more miles. Possible sync primitive (wait-for-edit) parked. lazypair coming.>
```

No section fully drafted. Once you answer Q1–Q6, I will fill in the linking prose between your blocks and leave TODO markers for the rest. You bring the meat, I stitch.

### What I would like from you next

Answer Q1–Q6 when convenient. The skeleton above is not load-bearing — redirect freely if the structure feels wrong.

---

## Round 3 (agent)

### What I heard

- lazypAIr: tease it.
- clotilde: mention, with the "before named sessions were first-class" framing. Good — that also dates the problem, shows the ephemerality is not new.
- ollama cloud: keep. Model names coming tomorrow. TODO marker in draft.
- Hook: combine, but if forced, (c) or (b). My plan: open with a short (c)-flavored thesis line, cut to a (b) moment in paragraph two. That gets the "rapid-fire chat is wrong for thinking work" idea up front and the pomodoro scene as the human beat.
- Embed: full file verbatim. Including this round. Fine — the self-referential thing is a feature here, not a bug.

### On titles

Your two additions are the strongest candidates because they carry an idea, not just a description:

- **"Give your agent a mailbox for async collaboration"** — mailbox is a sharp metaphor. Readers immediately know what this is. Slight risk: "mailbox" might signal literal email integration (it does not).
- **"Rapid-fire chat is the wrong shape for thinking work"** (paraphrase of your second bullet) — thesis-first, earns the post. Good headline, slightly wordy.

Narrowing to a shortlist I would ship with:

1. **"Give your agent a mailbox"** — short, metaphor-forward, curious.
2. **"Chat is the wrong shape for thinking work"** — thesis-forward, declarative.
3. **"Pair programming by markdown file"** — concrete, plain, SEO-friendly.

I would pick (1). It is the most distinctive, it carries the "old-school email" subtext without saying email, and it leaves room for the post to explain. (2) is my second choice.

### Next move

I think we have enough to scaffold a draft. Proposed:

- Create `content/en/drafts/lazychat/index.md` with frontmatter, rough section order from the Round 2 skeleton, your raw bullets woven into the sections that need them, and TODO markers where you need to fill in:
  - Ollama cloud model names (tomorrow).
  - Anything you want to say about lazypAIr beyond the tagline.
  - The specific lazypair MVP moment (one short paragraph — the "first time the file worked" beat).
  - Whatever you want about the pi.dev / Claude Code pairing (you said hard to tell; I will leave a skip-or-fill TODO).
- Leave this discussion file in `.lazyai/` as the record. We can move it or embed it at publish time.
- Post stays draft until the repo is ready to go public (timing (b)).

### Questions

> 1. Title pick: (1) mailbox, (2) thinking-work, (3) markdown-file — or something else you have been sitting with?

(1) or (2)

> 2. Am I clear to scaffold `content/en/drafts/lazychat/index.md` now, or do you want another round in this file first?

Yes

> 3. Anything I left out of the skeleton that you want covered? E.g. the "future-you archive" / re-openable record angle, the wait-for-edit sync primitive idea, the pi.dev-as-companion-agent context?

Leave those as notes, I'll follow up there

</details>

[lazychat-repo]: https://github.com/fgrehm/lazychat
[clotilde-repo]: https://github.com/fgrehm/clotilde
[slow-down]: https://mariozechner.at/posts/2026-03-25-thoughts-on-slowing-the-fuck-down/
[ai-vampire]: https://steve-yegge.medium.com/the-ai-vampire-eda6e4f07163
[body-language]: https://www.terrygodier.com/body-language/ascii
[template-rendered]: https://github.com/fgrehm/lazychat/blob/920db661996671f537e3a357203879ae00e13c61/templates/discussion.md
[template-plain]: https://github.com/fgrehm/lazychat/blob/main/templates/discussion.md?plain=1
[cli-example]: https://github.com/fgrehm/lazychat/blob/920db661996671f537e3a357203879ae00e13c61/examples/2026-04-16T1811-cli-packaging.md
