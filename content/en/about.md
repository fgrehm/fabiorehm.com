---
title: "About"
date: "2026-05-13"
description: "About Fabio Rehm - Software engineer"
---

Hi, I'm Fabio! 👋

I'm a software engineer based in Brazil. I've been hacking on developer environment tooling since 2013 - first to make my own setup less painful, then as open source, and most recently as the kind of environment a coding agent can work inside.

## What I'm Working On

Most of my recent writing these days are about AI and one series about [Modernizing my Terminal-Based Development Environment](/blog/2025/11/11/modernizing-my-terminal-based-dev-environment/), which walks through how my dev stack looks like these days in the modern agentic world. The standalone posts orbit the same neighborhood - things like [giving agents a mailbox](/blog/2026/04/17/lazychat/) so they can work async, or [arguing that agent commits deserve better than Co-Authored-By](/blog/2026/03/02/our-coding-agent-commits-deserve-better-than-co-authored-by/). A lot of my recent posts mention AI and [I'm getting tired of the discourse](/blog/2026/05/12/im-taired/) like many of you, the work itself is still interesting though.

I also recently [split off](/dev/random) a `/dev/random` lane for chaotic, lower-bar content: scattered notes, link dumps, and AI-collaborated pieces I wouldn't publish on `/blog`. More on the *why* in [Embracing Chaos in the Age of AI](/blog/2026/05/17/embracing-chaos-in-the-age-of-ai/).

Believe it or not, my day job is (and has been) Ruby on Rails for like 15 years with a 1-2 year shift towards Golang / Kubernetes and back along the way.

## How I Got Here

I started writing code professionally around 2007 and worked through PHP, .NET, some Go, and (yes) some VB6 before settling into Rails. The dev-env tooling started as a side project around 2013 and has come back in waves ever since: [vagrant-lxc](https://github.com/fgrehm/vagrant-lxc), [ventriloquist](https://github.com/fgrehm/ventriloquist), and [devstep](https://github.com/fgrehm/devstep) were all different shots at the same target - `git clone && cd` into a project and start working without thinking about infrastructure. Those are archived now. My current take is [crib](/blog/2026/03/20/crib-just-enough-devcontainers/), a small runner on top of the devcontainer spec - same problem, three iterations later, this time built on a spec someone else maintains.

The other thing I keep getting pulled back to is using tech for civic stuff - back in 2017 I [used serverless to help Operação Serenata de Amor](/blog/2017/12/08/adventures-in-serverless-land-to-support-a-fight-against-corruption/) flag suspicious congressional reimbursements, and during the pandemic I built [covid19br.pub](https://github.com/fgrehm/covid19br-pub) to monitor official COVID-19 publications in Brazil. Haven't touched that space since, but honestly, with how much easier it's gotten to hack on things with LLMs in the loop, I probably should.

I started this blog in 2013, then "life happened" and I took an 8-year break before coming back in 2025. In case you find a broken link on the internet to this site, in 2022 I rebuilt it on Hugo and some content was deleted as part of that transition.

## 🤖 AI Use

I use AI as a coding and writing assistant, and I want to be transparent about how.

For code, it's a pair programmer - sometimes driving while I review, sometimes the other way around. I wrote about that evolution in [Skip the 'No AI Days'](/blog/2025/12/01/skip-no-ai-days-flip-roles/) and [an earlier post on resistance](/blog/2025/08/29/afraid-ai-would-make-me-lazy/). Architectural decisions and quality standards are mine.

For writing on `/blog`, AI is a copywriter and editor, not a ghostwriter. I brain-dump, it helps me structure, I refine. The ideas and opinions are always mine. I'm still learning the craft - [some slop has made it through](https://github.com/fgrehm/fabiorehm.com/commit/20cf161ccad5f8630c5f856a4a1100e12c5a5138) and I [fix it as I go](https://github.com/fgrehm/fabiorehm.com/commit/abdd50516db7104b9b65ed47a7e2bcb97c6022e4). AI amplifies, it doesn't replace.

`/dev/random` plays by different rules. It's where chat summaries, AI-generated digests, and other AI-collaborated pieces go - with a 🤖 banner declaring the model and role, and a "clickwall" you have to accept before the AI portion of a post is revealed. Pure-human chaos in that section gets a `⚠️ HUMAN DISCLAIMER` banner instead. I unpack the segmentation and the polish-as-signal thinking in [Embracing Chaos in the Age of AI](/blog/2026/05/17/embracing-chaos-in-the-age-of-ai/).

I also adopted [dweekly's AI Content Disclosure proposal](https://github.com/dweekly/ai-content-disclosure) for machine-readable signals: every AI-tagged post emits `<meta name="ai-disclosure">` at the page level and `ai-disclosure="ai-generated"` on the gated sections, with model + provider attribution.

## Get in Touch

Questions, collaboration, or just want to nerd out about tech in general - reach out.

- **GitHub**: [@fgrehm](https://github.com/fgrehm)
- **Email**: [site@fabiorehm.com](mailto:site@fabiorehm.com)
- **Twitter**: [@fgrehm](https://x.com/fgrehm)
- **LinkedIn**: [fgrehm](https://linkedin.com/in/fgrehm)

Thanks for reading! 🚀
