---
title: "TokenLedger: Could a smaller model handle real coding work?"
date: 2026-05-17
description: "Chat with Claude on whether a small local model can do agentic coding in 2026 — MoE architecture, the trace-distillation idea, and what's actually runnable on a 16GB / 64GB box."
ai_disclosure: mixed
ai_label: "AI-Collaboration: Chat steered by me, research and summarization done by Claude."
ai_model: "claude-opus-4.7"
ai_provider: "Anthropic"
---

There's a lot of discussion on running models locally these days, so I went on to Claude and asked some questions for my own learning.

---

{{< clickwall >}}

*A report on a conversation between Claude and Fabio, a developer thinking through local coding model options. Published with Fabio's permission, AI-generated, with disclaimers at the bottom. Last updated: May 2026 — model landscape moves fast, expect drift.*

It started with a random thought while Fabio was looking at [antirez's ds4 project](https://github.com/antirez/ds4): if this whole engine exists to run one specific big model on a MacBook, couldn't he just use something smaller? He didn't need a model that knows Italian poetry. He just wanted to code. Surely there was a tiny specialist that fits a laptop and does the job?

The honest answer turned out to be more interesting than yes or no. Here's the thinking trail.

## What ds4 is, and the trick it pulls

[ds4](https://github.com/antirez/ds4) is a narrow inference engine — a single-purpose program written in C that runs one specific model (DeepSeek V4 Flash) on Apple Silicon and NVIDIA GPUs. Not a generic runner like [Ollama](https://ollama.com) or [llama.cpp](https://github.com/ggml-org/llama.cpp). One model, end-to-end polish.

The interesting part isn't the engine, though. It's the model architecture. DeepSeek V4 Flash has 284 billion parameters total, but it's a **Mixture of Experts** (MoE) — only about 13 billion are active for any given token. Think of it like a hospital: the building has hundreds of specialists, but treating one patient only involves a handful of them at a time. The whole staff doesn't crowd into the room.

This matters because **active parameters determine speed**, while **total parameters determine knowledge breadth and quality**. MoE lets you decouple them. You get the smarts of a big model with the speed of a small one — at the cost of needing enough RAM to hold the whole hospital, even though most of it is idle.

So Fabio's opening intuition — "use a smaller model" — was actually already happening, just not in the way he expected. The "smaller" part was the *active* count, not the total.

## The constraints collide

Here's what he wanted: a local coding assistant that does both agentic work (the [Claude Code](https://docs.claude.com/en/docs/claude-code) / [Aider](https://aider.chat) / [Continue](https://continue.dev) style — multi-step planning, tool calls, file edits) and casual Q&A about code. For Ruby, TypeScript, Go, and Rust. No cloud dependency.

Here's what he had: a Linux box with 16GB of RAM and no GPU. Later in the conversation he remembered a second machine with 64GB of RAM and a tiny 2GB GPU that's effectively useless for this.

These constraints fight each other. Agentic coding is the worst case for small local models — it needs long context (codebases, tool outputs, error messages pile up fast), reliable structured output (one malformed tool call breaks the loop), and multi-step reasoning that doesn't drift. The "snappy speed + frontier quality + no cloud + cheap hardware" combination is a square that doesn't exist.

You can pick any three. You cannot pick four.

## The intuition that won't die

Even after accepting that, Fabio's original idea kept nagging: a human Ruby expert who doesn't speak French isn't somehow worse at Ruby. So why does a model that only needs to handle Ruby and chat need 32 billion parameters? Why can't it be tiny and brilliant within its scope?

The answer is genuinely counterintuitive: **"chat" is the expensive capability, not "Ruby."**

Following instructions, understanding what was meant, planning multi-step responses, recovering from errors — that's general intelligence-shaped stuff, and it scales with parameter count regardless of subject matter. Ruby syntax is comparatively cheap to encode. Reasoning about a Ruby program is not.

A useful mental model: a 7-billion-parameter coding model isn't 7B of memorized code. It's roughly 1B worth of "knows things" and 6B worth of "can reason, follow instructions, hold context, generalize." Strip out half the language knowledge and you barely shrink the file.

The neurosurgeon analogy works here. A surgeon who only operates on left kidneys doesn't have a smaller brain than a general surgeon. The "competent professional who can think under pressure and communicate clearly" substrate is the bulk of the cognitive work. Specialization is a thin layer on top.

Where the intuition *does* pay off: narrow non-chat tasks. Pure autocomplete (no reasoning, just next-token prediction) can use 1B-3B models. SQL-for-one-schema. JSON-to-YAML conversion. The more you remove open-ended conversation and reasoning, the more you can shrink. [Tabby](https://tabby.tabbyml.com) does this for autocomplete.

But "specialized agentic coding assistant" isn't narrow enough. The conversation and reasoning are the load-bearing parts.

## Detour: could he just train his own?

If the off-the-shelf models don't fit, could he build one that does? This is where the conversation got expensive fast.

There are three meanings of "train":

**Pretrain from scratch** — random weights to working model. This is what DeepSeek and Qwen do. Costs millions of dollars and thousands of GPUs. Not a personal project.

**Fine-tune an existing model** — take Qwen3-Coder, show it a bunch of Ruby, nudge it to be better at Ruby. Costs around $50-300 on a weekend using [Unsloth](https://github.com/unslothai/unsloth) or [Axolotl](https://github.com/axolotl-ai-cloud/axolotl) with a rented GPU from [RunPod](https://runpod.io) or [Vast.ai](https://vast.ai). Totally feasible.

**Continued pretraining** — fine-tune's bigger cousin, feeding raw code rather than instruction pairs. Same tools, more data, more cost.

Here's the catch nobody mentions: **fine-tuning makes a model more like your data, not smarter.** For mainstream languages, the base models are already strong, and fine-tuning rarely beats just switching to a better base model. Ruby, TypeScript, Go, and Rust — Fabio's actual stack — are all extremely well-represented in modern coder model training data. Fine-tuning on more of them would be a waste of money. The gains are noise.

Where fine-tuning *does* pay off: a specific codebase's conventions, internal libraries and DSLs, a team's review standards, a niche framework the base model has barely seen. That's a real project. Fine-tuning generically on a popular language is not.

The genuinely interesting middle path is **distillation** — using a big model to generate thousands of high-quality examples, then fine-tuning a small model on them. You're teaching the small one to mimic the big one's behavior on a narrow slice. The [Orca paper](https://arxiv.org/abs/2306.02707) is the canonical reference. Cost: a few hundred dollars in API calls plus a weekend of GPU rental. Result: a small model that punches above its weight on whatever you distilled.

Which led directly to the most interesting thing in the conversation.

## The trace thing

People are uploading agent traces to [Hugging Face](https://huggingface.co/datasets). Not just `(question, answer)` pairs — full transcripts of multi-step agent sessions, including the tool calls, the tool outputs, the recoveries from failed tests, the whole messy loop. [SWE-bench](https://www.swebench.com/) and [SWE-Gym](https://huggingface.co/datasets/SWE-Gym/SWE-Gym) are two well-known examples; there are many more if you search the datasets hub.

These traces are basically **pre-distilled training data for agentic behavior**. Someone else already paid OpenAI or Anthropic to do the thinking; the trace captures it. You can skip the synthetic-data-generation step entirely.

This is closer to apprenticeship data than textbook data. A trace from a good Claude Code session shows judgment about *when* to grep versus read versus ask. That's the kind of behavior pattern that's hard to write as an instruction but easy to demonstrate. And it's exactly what agentic coding needs.

So the realistic version of "train your own specialized model" in 2026 looks like:

1. Pull high-quality agent traces filtered to your stack
2. Fine-tune a small model like Qwen3-Coder or [Nemotron 3 Nano](https://research.nvidia.com/labs/nemotron/Nemotron-3/) using Unsloth
3. Rent a GPU for ~$20-50
4. Evaluate honestly on real tasks

Two caveats worth flagging. Trace quality is wildly uneven — filtering matters more than volume. And the licensing is genuinely unsettled: traces from cloud models technically derive from those models' outputs, and OpenAI/Anthropic terms have historically forbidden using outputs to train competing models. Whether that's enforceable, whether it applies to traces uploaded to Hugging Face by third parties, whether anyone cares — all unclear. Not legal advice, just a flag.

## The "AI everywhere" reality check

Somewhere in the middle of this, Fabio asked the obvious question: if local AI requires this much hardware, how is the entire industry promising "AI everywhere" on every device?

The answer is that **"AI everywhere" doesn't mean "models everywhere."** Almost none of the marketing pitch involves running a real frontier model on the device making the pitch. The actual architecture is:

- The model runs in a datacenter on the kind of hardware you've been pricing out
- Your device runs a thin client — basically a chat UI with an API call
- The "AI" in the AI fridge is a network request

Your phone has on-device AI features, but the heavy lifting goes to Apple's Private Cloud Compute or Google's servers. Your IDE has AI completion, but it's hitting GitHub's GPUs. Customer support "AI agents" are OpenAI API calls dressed up in a chat widget. The device is mostly a straw.

There are three other things going on. First, hyperscalers are eating real losses to win market share — your subscription is almost certainly priced below the cost of heavy usage, and they're betting that costs drop fast enough to catch up. Second, costs really are dropping fast — roughly an order of magnitude per year for equivalent capability. Third, the genuine on-device AI (Apple's small models, Gemma Nano, Microsoft's [Phi line](https://huggingface.co/collections/microsoft/phi-4-677e9380e514feb5577a40e4)) uses much smaller, much dumber models than the demos suggest. They handle narrow tasks like autocomplete and basic intent routing. The big stuff phones home.

So the marketing implies frontier AI in your pocket. The reality is closer to: frontier AI in someone's datacenter accessible from your pocket, plus a small dumb model in your pocket doing narrow tasks. Both are "AI on device" and the two get conflated constantly. They're radically different in what they can do.

The math isn't lying. The industry is mostly hand-waving past it with the cloud.

## So what should Fabio actually run? (May 2026 snapshot)

After all that, here's where the conversation landed for the two machines. **Heavy caveat:** model recommendations age in months, not years. Verify before committing.

### On the 16GB / no-GPU box

This is the harder machine. Realistic options:

- [Qwen3-Coder small variants](https://huggingface.co/Qwen) at 4-bit quantization — newer successor to the well-regarded Qwen2.5-Coder line
- [DeepSeek-Coder-V2-Lite 16B](https://huggingface.co/deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct) — MoE with only ~2.4B active, surprisingly snappy on CPU, tight on 16GB but workable

Honest expectation: usable for Q&A about code and inline-completion-style tasks. Agentic loops will feel slow. Acceptable for a learning setup, painful for daily driver agentic work.

### On the 64GB / tiny-GPU box

This machine changes the picture meaningfully. The 2GB GPU is too small to matter for inference (don't plan around it), but 64GB of RAM unlocks 30B-class models.

Best candidates as of May 2026:

- [**Nemotron 3 Nano**](https://research.nvidia.com/labs/nemotron/Nemotron-3/) (NVIDIA) — 31.6B total / 3.2B active MoE, 1M context, vendor-reports beating GPT-OSS-20B and Qwen3-30B on benchmarks
- **Qwen3-Coder** (latest small variants) — direct successor to Qwen2.5-Coder
- **Gemma 4 26B A4B** (Google) — MoE, Apache 2.0 license, ~14GB at quantized sizes

The pattern is identical to ds4's: MoE models give you big-model quality at small-model speed, *if* you have the RAM to hold the inactive experts. The 64GB box is exactly the right shape for this. Total params determine RAM footprint, active params determine speed — pick a model where both fit your machine.

### Runtime

For both machines, [Ollama](https://ollama.com) is the easy on-ramp. [llama.cpp](https://github.com/ggml-org/llama.cpp) underneath it if you want more control. [LM Studio](https://lmstudio.ai) if you prefer a GUI. Wire whichever model you pick to [Aider](https://aider.chat) or [Continue](https://continue.dev) for agentic glue.

### Quantization, in one paragraph

Models store weights as numbers. Default precision is 16-bit floats, but you can compress to 8, 6, 4, or even 2 bits per weight, trading quality for size. **`Q4_K_M` is the standard sweet spot** — typically under 1% quality loss for a 4x size reduction. It's what Ollama defaults to and it's almost always the right choice. The ds4 project pushes this further with asymmetric 2-bit quantization that only compresses the rarely-used MoE expert weights, which is clever but specific to that model.

## Where to check when this goes stale

This piece will start drifting the moment it's published. Model releases happen weekly. Here are the places worth bookmarking instead of trusting any specific recommendation above:

- [Hugging Face Open LLM Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard) — general capability rankings
- [LiveBench](https://livebench.ai/) — contamination-resistant coding evals, refreshed regularly
- [SWE-bench leaderboards](https://www.swebench.com/) — agentic coding specifically
- [Aider's LLM leaderboard](https://aider.chat/docs/leaderboards/) — pragmatic real-world coding tests
- The [r/LocalLLaMA subreddit](https://www.reddit.com/r/LocalLLaMA/) — for the social signal of what's actually working on consumer hardware right now
- [Ollama's model library](https://ollama.com/library) — quick filter for what's runnable

For evaluating against a specific use case, nothing beats trying two or three candidates on real code for a few days. Benchmarks filter; real tasks decide.

## Open questions the conversation didn't resolve

A few things Fabio was still genuinely uncertain about by the end, in case anyone else is thinking through the same stuff:

- Whether the trace-distillation project is worth the weekend, or whether Qwen3-Coder out of the box gets him 90% of the way there for 0% of the effort
- Whether the 64GB machine actually gives a usable agentic experience or just usable Q&A — the difference between 5 tokens/sec and 15 tokens/sec is the difference between "neat" and "daily driver"
- Whether the right move is just to bite the bullet on a used 3090 (24GB VRAM) and stop pretending the 16GB box is part of the plan
- Whether "fully local agentic coding" is a 2026 reality or a 2027 reality

If anyone reading this has actually shipped a setup that works for this, Fabio would like to hear about it.

---

## Disclaimers and methodology

This piece was generated through a conversation between Fabio and Claude (Anthropic's AI assistant). Fabio asked questions, Claude reasoned and searched the web, and Fabio steered the structure. The final document was drafted by Claude in third-person at Fabio's request, lightly edited, and published with his permission.

**What this is:** one person's exploration of a problem, externalized with AI assistance. A thinking trail, not expert advice.

**What this isn't:** rigorous benchmarking, professional recommendations, or a definitive guide. Where benchmark numbers or model architecture details appear, they trace back to secondary sources that may themselves be wrong. Model vendors over-claim. Listicle sites get details wrong. Verify before betting hardware purchases or work hours on anything here.

**Dated content:** May 2026. The model landscape changes monthly. If reading this more than 6 months later, treat the specific recommendations as historical interest and use the "where to check" section instead.

**Conflicts of interest:** None known. Neither Claude nor Fabio has commercial ties to the companies or projects mentioned, though Claude is itself an Anthropic product, which is worth flagging.

**Generation context:** Single conversation, web search enabled, no specialized agents or chained pipelines. The conversation took about an hour of back-and-forth. For anyone curious about the raw reasoning: agent traces of conversations like this one are exactly the data discussed in the trace section above — a recursion the reader is invited to enjoy.

{{< /clickwall >}}
