---
title: "TokenLedger: CEF migration for please-make-me-an-app"
date: 2026-05-14
description: "Chat summary with Claude exploring Electron alternatives and what a CEF in-process migration for please-make-me-an-app would look like in Rust."
ai_disclosure: mixed
ai_label: "AI-Collaboration: Chat steered by me, research and summarization done by Claude."
ai_model: "claude-opus-4.7"
ai_provider: "Anthropic"
---

I've been thinking about ways to support more sites / apps with [please-make-me-an-app](https://github.com/fgrehm/please-make-me-an-app) lately so spent some time in a chat with Claude working through the state of Electron alternatives in 2026 and what a CEF integration would look like.

I drove the questions, Claude surfaced data and research material, I made the calls. AI generated chat summary pasted verbatim below.

---


{{< clickwall >}}

## What we covered

Started as "what's the state of Electron alternatives in 2026" but quickly reframed: pmmaapp doesn't compete with Electron, it competes with site-wrapper tools (Pake, Nativefier, Tangram, WebApp Manager). The real question turned out to be about expanding pmmaapp's reach to sites that currently force a fallback to a system browser (claude.ai being the canonical example).

## Landscape snapshot (May 2026)

- **Tauri 2** is the default Electron alternative for new app dev. Doesn't compete with pmmaapp directly (framework, not wrapper).
- **Pake** (https://github.com/tw93/Pake) is pmmaapp's closest neighbor. Per-app build step is the key difference; pmmaapp's YAML/no-build model is the wedge.
- **Nativefier** is archived/dead.
- **Electrobun** (https://electrobun.dev) is a newcomer, TypeScript+Bun, system WebView, very young.
- **WebApp Manager** (Linux Mint) is GUI-driven and Mint-centric.
- **cef-rs** (https://github.com/tauri-apps/cef-rs) is alive and tracking current Chromium — 244 releases, latest Feb 2026, tracks CEF 145.

## The actual problem pmmaapp has

pmmaapp ships two engines today: WebKitGTK (default, full feature set) and a system-browser subprocess backend (Brave/Chrome/Chromium via `--app=URL`). The browser backend works for Cloudflare Turnstile / WebAuthn / Chrome extensions but loses most pmmaapp features (no tray, no UA spoofing, no allowed_domains, no JS adblock; CSS/JS injection works via an auto-generated extension).

The desired end state: one engine that passes Turnstile etc. **and** keeps the full pmmaapp feature set.

## Why CEF in-process is the answer

CEF (https://bitbucket.org/chromiumembedded/cef) is Chromium-as-a-library — what Spotify, Steam, OBS, JetBrains IDEs use. In-process embedding means no subprocess shell-out, full control over request handling, native CSS/JS injection via `OnContextCreated`, network-layer ad blocking via `CefRequestHandler`.

Tray/desktop/icon/profile code in pmmaapp is engine-agnostic and survives the migration unchanged. `tray-icon` crate (https://github.com/tauri-apps/tray-icon) is decoupled from rendering.

## Language considerations

Working through CEF binding maturity:
- **C++** — official, mature, but build/ergonomics pain.
- **C# (CefSharp)** — mature, Windows-only.
- **Java (JCEF)** — mature, cross-platform, used by JetBrains. Ruled out: user dislikes JVM ecosystem.
- **Python (cefpython)** — effectively dead, stuck on Chromium ~66.
- **Go (cef2go)** — dead since 2014.
- **Rust (cef-rs)** — alpha-ish but actively released, tracks current Chromium.

Landed on **Rust + cef-rs** since it keeps the existing pmmaapp codebase as scaffolding.

## Architectural options for CEF migration

Three coherent shapes, ranked by fit to user's "stay narrow + memory matters" priorities:

1. **CEF as opt-in alongside WebKitGTK** (chosen direction). New `engine: cef` per-app, delete the three browser-subprocess backends. Light apps stay light on WebKit, heavy ones get CEF with full feature support.
2. **CEF everywhere + daemon model.** Single long-lived process hosts N browsers. Best multi-app memory amortization. Loses WebKitGTK advantage at small N. Bigger refactor (daemon lifecycle, IPC).
3. **CEF everywhere, per-app process.** Simplest port, worst memory. Approaches Electron's failure mode. Rejected.

## Memory framing — honest version

Spent some time on memory numbers. Initial confident table was actually folklore — popular Tauri-vs-Electron blogs use suspiciously round numbers without methodology, and CEF forum threads show real-world variance from 80MB to 850MB. What's *architecturally* true:

- WebKitGTK is structurally smaller than Chromium.
- CEF in one process with N browser instances shares browser/GPU process overhead.
- CEF in N separate processes shares nothing across apps.
- Electron is worse still (each app bundles its own Chromium + V8 + Node).

Directional ranking for 5 running apps: WebKitGTK < CEF-daemon < CEF-per-app < Electron. **Specific MB numbers need to be benchmarked, not assumed.**

Sources to verify with later:
- https://www.magpcss.org/ceforum/viewtopic.php?f=6&t=168 (CEF multi-browser process model)
- https://www.magpcss.org/ceforum/viewtopic.php?f=10&t=12979 (CEF memory variance in real apps)
- https://www.chromium.org/developers/memory-usage-backgrounder/ (Chromium memory model)
- https://planet.webkitgtk.org/ (WebKitGTK measurement baselines)
- https://www.leagueoflegends.com/en-us/news/dev/client-cleanup-we-launched-the-updated-chromium-embedded-framework-cef/ (real-world CEF case study)

## What the existing pmmaapp code already does

Cloned and reviewed the repo. Key findings:
- `Backend` enum already supports the dual-engine pattern. Option 1 fits cleanly.
- `docs/known-limitations.md` has a thorough honest inventory of what doesn't work where.
- `docs/alternatives.md` already has a solid 2026 landscape doc.
- ROADMAP has "Native ad blocking" as an open item that the CEF migration would resolve.
- ~60K lines of adblock rules in `data/adblock-domains.txt`.

## Blockers / unknowns identified

1. Whether CEF's `OnContextCreated` fires early enough to defeat Cloudflare Turnstile fingerprinting (go/no-go for the whole direction).
2. cef-rs pre-1.0 API stability vs upstream CEF churn.
3. CEF Linux subprocess helper layout under per-invocation (non-daemon) lifecycle.
4. ~200MB CEF binary distribution strategy.
5. CEF profile isolation parity with current `--user-data-dir` approach.

## Decisions made

- Direction: CEF in-process as opt-in alongside WebKitGTK (Option 1).
- Binding: Rust + cef-rs.
- Subprocess browser backends will be deleted once `engine: cef` reaches parity.
- Daemon model parked unless memory benchmarks later argue for it.

{{< /clickwall >}}
