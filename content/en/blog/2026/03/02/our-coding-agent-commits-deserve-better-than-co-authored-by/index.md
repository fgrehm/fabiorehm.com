---
title: "Our coding agent commits deserve better than Co-Authored-By"
date: 2026-03-02
lastmod: 2026-03-08
tags:
  - ai
  - git
  - claude
description: "Co-Authored-By was meant for people. Here's some thoughts on an alternative for attributing coding agents in commits."
---

I've [disabled Claude Code's `Co-Authored-By` setting][prev-post] ever since I started using Claude Code, the Claude avatar next to people's faces on GitHub always felt wrong to me. The coding agent is a tool and *I am* the one responsible for what it produces and if a bug pops up in prod, Anthropic won't be the ones on call.

If you've never seen that in practice, this is what Claude Code adds to commits it creates by default:

```text
🤖 Generated with Claude Code

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

The `Co-Authored-By` [trailer][git-trailers] in git [was meant for people who exchanged drafts][submitting-patches], and that's not what's happening here.

There's also the practical side to this: the `Co-Authored-By` trailer expects the same format as `Signed-off-by`: `Name <email>`. So Claude Code adds a `noreply@anthropic.com` address just to not break the format. At one point, [GitHub was even attributing those commits to a random user][gh-attribution-bug] who had registered that email (that's what happens when you stuff tool metadata into a human-oriented trailer :see_no_evil:).

I'm not the only one thinking about this BTW, Bence Ferdinandy [wrote about this subject][bence-post] and proposed an `AI-assistant:` trailer that captures tool and model in a single field (e.g. `AI-assistant: OpenCode v1.0.203 (Claude Opus 4.5)`). I ended up with something similar but split into two separate trailers for easier parsing.

## Right Information, Wrong Place, Moving Too Fast

To be fair, Claude Code recently started including the model name in its `Co-Authored-By` line (e.g. `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`). So it's not like the info isn't there. But it's stuffed into a trailer meant for humans, the format keeps changing between releases, the [model name is sometimes wrong][wrong-model-bug], and the [settings to disable it don't always work][settings-bug] (YMMV). This stuff is moving way too fast for something that's supposed to be permanent metadata in your git history.

And that's just one tool, but we live in a multi-tool/model/agent reality now. The same model (ex: `claude-opus-4-6`) can run behind Claude Code, [pi][pi], OpenCode, Cursor, Windsurf, or a fully custom agent. Each tool wraps the model with its own system prompts, context, behavior and tools.

You might be thinking now: "We don't add the Ruby version or IDE to our commits, so why bother here?" Well, those tools are *deterministic* but *coding agents are not*. The same prompt with a different model or tool can produce completely different code.

If we care about "code archeology" and better understanding of how a codebase came to be, what we need is something stable and portable: which tool AND which model, in a dedicated trailer that won't break every time a tool pushes an update.

## What I Use Instead

I've been doing something like this:

```text
feat: some mandatory short title

Optional body text.

Coding-Agent: Claude Code
Model: claude-opus-4-6
```

Two git trailers: `Coding-Agent` for the tool and `Model` for the specific model identifier. Sometimes we get the fully qualified version with a date at the end (like `claude-sonnet-4-20250514`), sometimes just the short version. Either way, it captures the two dimensions that matter to me.

And since I recently fell in love with `pi`, I decided to create my own ["ai dotfiles"][dot-ai] to version control these conventions, because these tools keep changing all the time. The same convention should hopefully work across existing tools and the new awesome ones people will continue to build. A commit created from within `pi` will have the same model but a different `Coding-Agent` that will be set to `pi`, for example:

```text
Coding-Agent: pi
Model: claude-opus-4-6
```

Same model, different agent, and the trailers make that clear.

_**NOTE:** While doing some research for this post, I found out that [git's SubmittingPatches docs][submitting-patches] already suggest a rich set of trailers with specific semantics: `Reported-by`, `Reviewed-by`, `Helped-by`, `Suggested-by`, etc. It even says you can create your own if the situation warrants it. So I'm considering aligning with that convention, something like `Assisted-by: Claude Code`. Still thinking about the exact naming, but the `-by` suffix feels more at home in git's world._

I looked into automating this but it's not there yet. I believe Claude Code bakes attribution into its system prompt, but the end result is not consistent. For now, putting the convention in the agent's instructions (`CLAUDE.md` / `AGENTS.md`) seems more reliable and portable.

## It's Not Just Commits

Whether we like it or not, AI is here to stay and we need to think about attributing / labeling "the AI" in other places too. `git commit`s are covered above, but what about other types of content like blog posts, technical specs, social media posts, etc?

I do [use AI here in this blog][about-ai] as a "copywriter" / "thinking partner" / fact checker, and like with code, I review what it sometimes writes on my behalf. Yes, [some slop might go live][slop-commit] but I [try to improve as I go][improve-commit].

For [tech specs I write with AI][spec-template], I started adding a simple footer like: `*Written in collaboration with Claude (Opus 4.6).*` Same idea as the commit trailers: say what helped, don't pretend it's a co-author.

Platforms are already moving this direction. [Instagram has its "Made with AI" label][meta-ai-labels], [YouTube requires an AI disclosure toggle][youtube-ai-disclosure], and the [EU AI Act][eu-ai-act] (August 2026) will require labeling AI-generated content. But for developer artifacts (code, docs, specs), there's no standard yet. I think we're all rolling our own and discovering things as we go.

## Why This Matters

This is a small thing, but small conventions compound. Future us will appreciate knowing which tool and model produced a commit, not just that "AI was involved." And if enough of us adopt something like this, maybe we'll converge on a standard someday.

If you have thoughts on this or a better convention, I'd love to hear about it, just reach out using the links below.

---

**Update (Mar 3):** Nothing like a good night of sleep... This morning I realized that what I'm describing is basically a user-agent string for coding tools :grimacing:

Think about it: a browser's `User-Agent` header encodes layers: the browser, the rendering engine, the OS. My `Coding-Agent` + `Model` trailers are doing the same thing, identifying the tool layer and the model layer behind a commit.

The parallel goes further. User-agents became a de facto standard because servers *needed* that information to adapt behavior. As codebases accumulate more AI-assisted commits, we might want the same thing. "Show me all commits where early Sonnet 4.5 touched the auth module" is the kind of query we might want to run if we care about this information in the future.

But! There's a cautionary tale here too: `User-agent` strings are famously messy. Every browser started pretending to be Mozilla for backwards compatibility and the whole thing [became a pile of lies][ua-history]. If we want coding tool attribution to actually be useful long term, we need to keep it simple and resist the temptation to stuff everything into one field :v:

---

**Update (Mar 8):** Got some good feedback on this. Someone pointed out that if we don't attribute compilers, linters, formatters, or IDEs in commits, why attribute AI tools? I covered the "deterministic" argument above, but then I started thinking a bit more about everything that goes into an AI-assisted code change: custom instructions (`CLAUDE.md` / `AGENTS.md`), skills, context window contents, thinking level... none of that is versioned. Capturing just tool + model gives a false sense of completeness. At the end of the day it might be more honest to just do `AI-Assisted: Yes` which is pointless :sweat_smile:

There's another aspect to this which is the fact Claude Code doesn't always output the right model if I change mid session, so I just ended up [dropping the trailers from my own setup][dropped-trailers].

If anyone cares about this (whether for preference or compliance), the **ecosystem needs to solve it at the tool level first**. Something like coding agents exporting env vars with the currently selected model, so a simple (and predictable) git hook can handle the rest without manual intervention.

[prev-post]: /blog/2025/08/29/afraid-ai-would-make-me-lazy/#code-attribution-ethics
[git-trailers]: https://git-scm.com/docs/git-interpret-trailers
[submitting-patches]: https://git-scm.com/docs/SubmittingPatches
[gh-attribution-bug]: https://github.com/anthropics/claude-code/issues/1653
[bence-post]: https://bence.ferdinandy.com/2025/12/29/dont-abuse-co-authored-by-for-marking-ai-assistance/
[wrong-model-bug]: https://github.com/anthropics/claude-code/issues/24590
[settings-bug]: https://github.com/anthropics/claude-code/issues/18253
[pi]: https://pi.dev/
[dot-ai]: https://github.com/fgrehm/dot-ai
[slop-commit]: https://github.com/fgrehm/fabiorehm.com/commit/20cf161ccad5f8630c5f856a4a1100e12c5a5138
[improve-commit]: https://github.com/fgrehm/fabiorehm.com/commit/abdd50516db7104b9b65ed47a7e2bcb97c6022e4
[spec-template]: https://github.com/fgrehm/dot-ai/blob/main/skills/technical-spec-writer/assets/template-spec.md
[meta-ai-labels]: https://about.fb.com/news/2024/02/labeling-ai-generated-images-on-facebook-instagram-and-threads/
[youtube-ai-disclosure]: https://blog.youtube/news-and-events/disclosing-ai-generated-content/
[eu-ai-act]: https://weventure.de/en/blog/ai-labeling
[about-ai]: /about/#-ai-use
[ua-history]: https://webaim.org/blog/user-agent-string-history/
[dropped-trailers]: https://github.com/fgrehm/dot-ai/commit/796652737e9a255e9cc1ab705b1b3da4261aeca5
