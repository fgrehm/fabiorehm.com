---
title: "Pi + Ollama Cloud API: Setup and First Impressions"
date: 2026-04-12
tags:
  - pi-coding-agent
  - ollama
description: |
  Using Pi with Ollama's cloud API directly (no local server needed) + first impressions after a few days
---

Ever since I found out about [pi][pi-dev] and gave it a shot I loved it, it "just works" and the UX is very well thought out. Some folks have even been saying it's like ["vim for agentic coding"][vim-pi] which I'm starting to agree with.

I think I first came across it before the "OpenClaw boom" when someone shared [this post][pi-author-post] by its author on some social media feed and last week I put some effort into making it a first class citizen in my stack.

_If you just want the setup instructions: [skip to Setup](#setup), skip to [plugin extraction note](#update-theres-a-plugin-now) or head over to GitHub to [check out the plugin][pi-ollama-cloud-repo] I extracted which is a lot better than the setup described here._

## Getting off the "Claude train" for a bit

I've been exclusively a Claude Code user for a while now, I still think Opus is like "state of the art" in terms of models for coding agents but it's more like a guess based on what others have written about it. For that reason my interactions with Pi were powered by Opus through Claude's OAuth creds which [has been a grey area for a while][pi-oauth-discussion] and [recently stopped working with Claude subscriptions][bcherny-tweet].

The risk of being blocked by Anthropic made me look around for alternatives last month, and over time I've been thinking that we need to somehow "embrace AI diversity" by experiencing other models / harnesses to understand how they behave and be better informed when the primary tool goes down or gets too expensive.

Thanks to the "OpenClaw boom" and a 2 hour failed attempt to set it up when it first came out, I [found out about Venice.ai in their docs][openclaw-venice]. Their [privacy focus][venice-privacy] caught my eye and made me put a $20 credit in. I used it to [play with Pi a lil bit][pi-venice-issue] and on some experiments with my very personal data.

Like many other providers, Venice.ai pricing is usage based, but for coding that can get expensive. While looking for alternatives, I found out about a basic free tier by Ollama and gave it a shot with Pi. (_If you want to try out venice.ai regardless, [use this link][venice-ref] to sign up so we both get $10 bonus._)

## The undocumented approach

The [Pi integration docs][ollama-pi-docs] assume you're running Ollama locally and will point Pi to `http://localhost:11434/v1` with a "key based auth". My understanding is that the local web server acts as middleware between our computers and the cloud models and provides the authentication mechanism.

At first that approach is fine on your host machine, especially if you use Ollama for other stuff, but inside containers it means running a separate Ollama process which can get hairy given containers usually have no init system to keep the daemon running. You _could_ wire it up with docker-compose and run Ollama as a sidecar, but now you've got more moving parts just to run a coding agent.

Turns out Ollama's cloud models can also be accessed with an API key using the same OpenAI-compatible interface and no need for local server. The Pi integration docs will hook you up with the localhost + local-server approach, and it took some digging to find that the OpenAI-compatible endpoint also accepts direct API key auth.

## The URL gotcha

The [Pi integration docs][ollama-pi-docs] and [Ollama API auth docs][ollama-auth-docs] only show examples against `localhost` or `https://ollama.com/api`. So I tried `https://ollama.com/api/v1` as the `baseUrl` in Pi's `models.json` which seemed logical, but ended up getting 404s and the debugging saga started:

```bash
curl https://ollama.com/api/v1/models -H "Authorization: Bearer $OLLAMA_API_KEY"

# {"error":"path \"/api/v1/models\" not found"}
```

I was debugging this with Claude (the irony 🙈) and at one point it confidently told me the OpenAI-compatible `/v1` path "_simply doesn't exist on Ollama cloud_" and suggested I either run a local Ollama server as a proxy like the docs suggest or switch to OpenRouter entirely. I almost gave up on the whole thing.

Later in the day I resumed the chat and pushed it harder, then it walked back and said "_actually... let's also try without the `/api` prefix._" That was it:

```bash
curl https://ollama.com/v1/models -H "Authorization: Bearer $OLLAMA_API_KEY"
# works
```

Turns out I should've just RTFM: the [OpenAI-compatible layer lives at `https://ollama.com/v1`][ollama-openai-docs], not `https://ollama.com/api/v1`, the `/api` prefix is for native Ollama endpoints [like `ps` and others][ollama-ps-api].

## Setup

Here's what you need to get this Pi + Ollama API combo without running the local Ollama server. First thing is (obviously) to create an account, then:

1. Create an API key at [ollama.com/settings/keys][ollama-keys] (free tier works for light usage, see [pricing][ollama-pricing] for plan details and limits)
2. Install Pi: `npm install -g @mariozechner/pi-coding-agent`
3. Add this to your `~/.pi/agent/models.json`:

```jsonc
{
  // Pi docs use "ollama" with localhost, I chose "ollama-api-key" to make things clear
  "ollama-api-key": {
    "api": "openai-completions",
    // TODO: replace with your key from step 1
    "apiKey": "YOUR_API_KEY_HERE",
    "baseUrl": "https://ollama.com/v1",
    "models": [
      {
        "id": "glm-5:cloud",
        "contextWindow": 202752, // 198K
        "input": ["text"],
        "reasoning": true
      }
    ]
  }
}
```

4. Set the default provider/model in `~/.pi/agent/settings.json`:

```json
{
  "defaultModel": "glm-5:cloud",
  "defaultProvider": "ollama-api-key"
}
```

The `:cloud` suffix tells Ollama to run the model on their infrastructure rather than locally - that's what makes this whole setup work without a local daemon. Only models on the [cloud model list][ollama-cloud-models] support this suffix, so pick from there and swap out `glm-5:cloud` for whatever you want to try.

## A few days in

I started on the free tier and bumped to the $20 Pro plan after a couple of days seeing the setup work. Ollama uses subscription tiers with usage limits rather than pay-per-token, so no surprise bills, but you can hit your limit and get cut off until the reset window (5h / 7d). Pro gives 50x the free usage and up to 3 concurrent models, which is enough for my Pi workflow.

I've been mostly using `glm-5:cloud` with thinking set to medium / high, it's been my daily driver when using Pi for OSS work and feels OK so far. Still need to spend some time with other models to compare but it's somewhat refreshing to use something other than claude code + Opus. Also, a nice side effect: less capable models force me to write clearer prompts and better agent instructions, and that feeds back into any model I use. I hope it improves my setup as a whole, time will tell.

A couple of things took some getting used to coming from Claude Code though.

First, Pi is YOLO by design without plan mode, no permission prompts, no built-in TODO tracking. It just gives the model four tools (read, write, edit, bash) and gets out of the way. Second, `glm-5:cloud` doesn't feel as sharp as Opus when it comes to judgment calls, when it _does_ go YOLOing it might head in the wrong direction.

As a concrete example, earlier today I used pi+glm-5 to wrap up a PR I'd been "ping-ponging" on with Claude Code for implementation + GitHub copilot for reviewing. I ended up sending like 20+ messages over less than 20 minutes and most of them were about keeping the model on track, as per Claude Opus (my data analyst) the highlights include:

- _"show me your plan before implementation"_ - when model went too far without explaining
- _"can we abstract this logic into one of the existing components?"_ - when it did not keep code DRY
- _"hang on, what's the state of things?"_ - before it asked me if I was ready to push
- _"do not use `| tail`"_ - as it ran `go test ./... | tail -n ...` and the tool output was blank without any feedback (side note: Claude does this at times too, dunno why)
- _"why the fuck do your test commands never finish?"_ - turns out `tail`ing was the culprit

I also bumped the thinking level from medium to high mid-session and loaded my [`golang-pro` skill][golang-pro-skill] to give it more guidance.

It did get the job done in the end, but I'll probably need to fine-tune my [`AGENTS.md`][agents-md] to push back on the YOLOing and try other models for comparison. That's a topic for another post, for now I just want to put this to test and see how good this setup can be as an alternative to claude code.

Speaking of which: while wrapping up this post I noticed [`glm-5.1:cloud` dropped 5 days ago][glm-51] and it's supposedly better at sustaining performance "over hundreds of rounds and thousands of tool calls", they also claim that "the longer it runs, the better the result." About to try it out throughout the week. 🚀

## Update: there's a plugin now

A few days after publishing this post I went and wrapped the whole thing into a [Pi extension][pi-ollama-cloud-repo] so I don't have to manually manage the model list in `models.json`. It fetches the full model catalog from `ollama.com/v1/models`, pulls details for each model via `/api/show` to figure out which ones support tools and thinking, and caches all of that locally. Run `/ollama-cloud-refresh` whenever you want to update.

It also bundles the web search and fetch tools that use the same Ollama Cloud API key, so no local server needed for those either. The provider name is `ollama-cloud` (different from the `ollama-api-key` I used in the manual setup above) so you can run both side by side if you're into that sort of thing.

If you followed the manual setup above, the extension gives you the same end result with less config noise. If you're just starting out, just `pi install git:github.com/fgrehm/pi-ollama-cloud` and you're off to the races.

[pi-ollama-cloud-repo]: https://github.com/fgrehm/pi-ollama-cloud
[pi-dev]: https://pi.dev
[vim-pi]: https://www.hansschnedlitz.com/writing/2026/03/08/pi-is-vim-for-agentic-coding
[pi-author-post]: https://mariozechner.at/posts/2025-11-30-pi-coding-agent/
[openclaw-venice]: https://docs.openclaw.ai/providers/venice
[venice-privacy]: https://venice.ai/privacy#privacy-architecture
[pi-venice-issue]: https://github.com/badlogic/pi-mono/issues/1174#issuecomment-3987876943
[venice-ref]: https://venice.ai/chat?ref=SfsgyU
[ollama-keys]: https://ollama.com/settings/keys
[ollama-ps-api]: https://docs.ollama.com/api/ps
[ollama-pricing]: https://ollama.com/pricing
[bcherny-tweet]: https://x.com/bcherny/status/2040206440556826908
[pi-oauth-discussion]: https://github.com/badlogic/pi-mono/discussions/1999
[ollama-pi-docs]: https://docs.ollama.com/integrations/pi
[ollama-auth-docs]: https://docs.ollama.com/api/authentication
[ollama-openai-docs]: https://docs.ollama.com/api/openai-compatibility
[ollama-cloud-models]: https://ollama.com/search?c=cloud
[glm-51]: https://ollama.com/library/glm-5.1
[golang-pro-skill]: https://github.com/fgrehm/dot-ai/tree/main/skills/golang-pro
[agents-md]: https://github.com/fgrehm/dot-ai/blob/main/pi/AGENTS.md
