---
title: "Our coding agent commits deserve better than Co-Authored-By"
date: 2026-03-01
draft: true
tags:
  - ai
  - git
  - developer-workflow
description: "Co-Authored-By was meant for people. Here's an alternative for attributing coding agents in commits."
---

Don't worry, this isn't another "how I 10x'd my productivity with AI" post. It's about something way less sexy: _commit metadata_.

I've disabled Claude Code's `Co-Authored-By` setting ever since I started using it. The Claude avatar next to mine on GitHub always felt wrong. The coding agent is a tool, *I am* the one responsible for what it produces. `Co-Authored-By` in git [was meant for people who exchanged drafts](https://git-scm.com/docs/SubmittingPatches), it implies shared responsibility. That's not what's happening here. If a bug pops up in prod, Anthropic won't be the ones on call.

And then there's the practical side. The `Co-Authored-By` trailer expects the same format as `Signed-off-by`: `Name <email>`. So Claude Code adds a fake email address just to not break the format. That's a smell. It's also clearly focused on marketing, using the one trailer that shows up on GitHub's UI.

I'm not the only one thinking about this. Bence Ferdinandy [wrote about this problem](https://bence.ferdinandy.com/2025/12/29/dont-abuse-co-authored-by-for-marking-ai-assistance/) and proposed an `AI-assistant:` trailer that captures tool and model in a single field (e.g. `AI-assistant: OpenCode v1.0.203 (Claude Opus 4.5)`). I ended up with something similar but split into two separate trailers for easier parsing.

## "Claude Code" Alone Tells Us Nothing

IMO the future is "multi-tool, multi-model and multi-agent". Attribution that only captures one dimension is already outdated by today's standards.

Think about it: the same model (ex: `claude-opus-4-6`) can run behind Claude Code, [pi](https://pi.dev/), OpenCode, Cursor, Windsurf, or a fully custom agent. Each tool wraps the model with its own system prompts, context, behavior and tools. Seeing a "Co-Authored-By: Claude Code" in a commit in 2026 tells us nothing about what actually produced the code. We don't add the Ruby version or IDE to our commits, so why bother here? Because those tools are deterministic. Coding agents are not. The same prompt with a different model or tool can produce completely different code.

If we care about "archeology" and better understanding of how the code came to be, what we really need to know is: which tool AND which model.

## What I Use Instead

Since last week I've been doing something like this:

```text
feat: some mandatory short title

Optional body text.

Coding-Agent: Claude Code
Model: claude-opus-4-6
```

Two git trailers: `Coding-Agent` for the tool and `Model` for the specific model identifier. Sometimes we get the fully qualified version with a date at the end (like `claude-sonnet-4-20250514`), sometimes just the short version. Either way, it captures the two dimensions that matter.

And since I recently fell in love with `pi`, I decided to create my own ["ai dotfiles"](https://github.com/fgrehm/dot-ai) to version control these conventions, because these tools keep changing all the time. The same convention should hopefully work across existing tools and the new awesome ones people will continue to build. Here's what a commit from `pi` looks like:

```text
Coding-Agent: pi
Model: claude-opus-4-6
```

Same model, different agent, and the trailers make that clear.

_**NOTE:** While doing some research for this post, I noticed that [git's SubmittingPatches docs](https://git-scm.com/docs/SubmittingPatches) already suggest a rich set of trailers with specific semantics: `Reported-by`, `Reviewed-by`, `Helped-by`, `Suggested-by`, etc. It even says you can create your own if the situation warrants it. So I'm considering aligning with that convention, something like `Assisted-by: Claude Code` + `Model: claude-opus-4-6`. Still thinking about the exact naming, but the `-by` suffix feels more at home in git's world._

I looked into automating this but the tooling isn't there yet. Coding agents don't expose model info programmatically, and the hook systems can't modify commit messages. The agent itself knows which model it's running at commit time, so putting the convention in its instructions (`CLAUDE.md` / `AGENTS.md`) is more reliable and portable than any hook-based approach.

Some things I'm still thinking about: tool version could go on the agent line (e.g. `Coding-Agent: Claude Code v1.0.203`), and for commits where multiple models were involved, something like `Model: plan:claude-opus-4-6, edit:claude-sonnet-4-6` could work. Haven't needed either yet, but worth considering.

## It's Not Just Commits

Whether we like it or not, AI is here to stay and we need to think about attributing / labeling "the AI" in other places too. `git commit`s are covered above, but what about other types of content like blog posts, technical specs, social media posts, etc?

I do use AI here in this blog as a "copywriter" / "thinking partner" / fact checker, and like with code, I review what it sometimes writes on my behalf. Yes, [some slop might go live](https://github.com/fgrehm/fabiorehm.com/commit/20cf161ccad5f8630c5f856a4a1100e12c5a5138) but I [try to improve as I go](https://github.com/fgrehm/fabiorehm.com/commit/abdd50516db7104b9b65ed47a7e2bcb97c6022e4).

For [tech specs I write with AI](https://github.com/fgrehm/dot-ai/blob/main/skills/technical-spec-writer/assets/template-spec.md), I started adding a simple footer like: `*Written in collaboration with Claude (Opus 4.6).*` Same idea as the commit trailers: say what helped, don't pretend it's a co-author.

Platforms are already moving this direction. [Instagram has its "Made with AI" label](https://about.fb.com/news/2024/02/labeling-ai-generated-images-on-facebook-instagram-and-threads/), [YouTube requires an AI disclosure toggle](https://subscribr.ai/p/youtube-ai-disclosure-rules), and the [EU AI Act](https://weventure.de/en/blog/ai-labeling) (August 2026) will require labeling AI-generated content. But for developer artifacts (code, docs, specs), there's no standard yet. I think we're all rolling our own and discovering things as we go.

## Why This Matters

This is a small thing, but small conventions compound. Future us will appreciate knowing which tool and model produced a commit, not just that "AI was involved." And if enough of us adopt something like this, maybe we'll converge on a standard some day.

If you have thoughts on this or a better convention, I'd love to hear about it, just reach out using the links below.
