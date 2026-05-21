---
title: "TokenLedger: Landscape Survey on Agentic Code Review Tools"
date: 2026-05-21
description: "Survey on a bunch of different tools used for local code reviews, for humans and agents"
keywords: [token-ledger]
ai_disclosure: mixed
ai_label: "AI-Collaboration: List of projects and reserach guidance provided by me. Actual analysis and summarization made by Opus 4.7 and DeepSeek Pro V4."
---

I'm writing a blog post on the recent "explosion" of tooling to review and annotate code written by agents so I gave some related projects to LLMs for a first pass on analysis / clustering. The projects list came from my own GitHub stars, personal notes of things I came across online and some basic GitHub project searching.

The content below was generated from a single DeepSeek V4 Pro chat powered by Pi using Ollama Cloud. The initial classification was done by Claude Opus 4.7 in another chat and "fact-checked" by DeepSeek afterwards in the original chat which had more context. The final post will be linked back here once it's out

---

{{< clickwall >}}

In early 2026, a new category of developer tooling emerged: local, human-in-the-loop tools for reviewing code written by AI coding agents. These aren't cloud PR bots or IDE-native accept/reject flows — they're standalone review surfaces that sit between you and your agent, giving you a place to inspect changes, annotate problems, and pipe feedback back into the agent's context.

This document surveys 59 GitHub repos in that space. For each tool we scraped public GitHub stats (stars, commits, releases, contributors, README) and classified it across five dimensions:

- **Surface** — TUI, local-web, CLI, IDE-plugin, desktop, hybrid
- **Annotation model** — how human comments reach the agent (clipboard, file-sidecar, MCP, GitHub PR API, stdout, local API, hook-inject, in-source, voice, or none)
- **Agent integration** — Claude Code skill, MCP, agnostic, or proprietary
- **Bidirectionality** — human→agent only, agent→human narration, or both
- **Primary use case** — local-diff-review, PR-review, CI-auto-review, plan-review, or other

The initial classification was done by Opus 4.7 from aggregated repo summaries. DeepSeek V4 Pro fact-checked key claims against raw API data, corrected license information, and enriched the profiles for the 25 most relevant tools with detailed GitHub stats.

## What's inside

- **§1** — Full classification table for all 59 repos, with per-repo caveats.
- **§2** — Timeline analysis. The field is ~6 months old. Before mid-2025 there are only 6 repos, all general-purpose. The first purpose-built tool shipped July 2025. March 2026 was the peak: 15 new repos in 31 days.
- **§3** — Surface × use-case gap matrix. TUI × local-diff-review holds 28 of 59 tools (47%). Plan review is served by only 2 tools (both web). IDE plugins are nearly absent. No terminal plan reviewer exists.
- **§4** — Surprising patterns: 25 repos with zero tagged releases, Rust/Go/TS three-way language split, machine-paced release cadences, recursive agent authorship, namespace saturation, and 21 repos with no license.
- **§5** — Top 10 most notable, ranked by relevance to the pre-PR, human-in-the-loop framing (not by stars).
- **§6** — Enriched profiles for the 25 most relevant tools, with scraped GitHub stats and README excerpts. Grouped by role: the three classic prettifiers (the "before" picture), the top 10, honorable mentions, and unique outliers.

---

## 0. Methodology notes (read first)

**Taxonomy was extended.** The original 5-value annotation taxonomy (`clipboard-markdown / file-sidecar / MCP / github-pr-api / none`) does not cover the real spread. Four more delivery mechanisms show up repeatedly and are worth naming:

- **stdout** — tool prints structured annotations to stdout on quit; the calling agent/script consumes them (revdiff, vet, copanion).
- **local-API** — tool runs a localhost server; the agent reads/writes comments over a REST endpoint (discuss-cli, diffity, diffx partially).
- **hook-inject** — feedback is injected straight into the agent's context/terminal via a hook, slash-command return, or editor buffer (plannotator, pi-diff-review, orche).
- **in-source** — comments are written *into the source file itself* at the change site, picked up by an agent hook (kizu — genuinely novel).

Where a tool maps cleanly to one of your 5, I used it. Where it doesn't, I used the extended label so the data stays honest.

**Three repos look like scrape contamination / tangential.** `pronto` (2013, linter aggregator), `pester` (2014, PR-review nag bot), `git-appraise` (2015, distributed git-native review) all predate LLM coding agents and were not built for this use case. The three classic pagers (`delta`, `difftastic`, `diff-so-fancy`) are general-purpose diff renderers, not review tools. Treat the "real" agentic-review cluster as ~53 repos; the other 6 inflate star counts and distort the timeline.

**Terminal bias.** The seed list for this survey was curated by a terminal-first developer researching tools for their own workflow. The result over-indexes on TUI and CLI surfaces (40 of 59 tools, 68%). Local-web tools (11), IDE plugins (3), and desktop apps (2) are underrepresented relative to their likely broader usage — a survey seeded from VS Code or Cursor users would produce different surface ratios. This isn't a flaw (the accompanying blog post focuses specifically on terminal-native review tooling), but the ratios should not be read as market share.

**Legend for the table below**

- Surface: `TUI` / `web` (local-web) / `CLI` / `IDE` (editor plugin) / `desktop` / `hybrid` / `other`
- Annotation: `clip` (clipboard-markdown) / `file` (file-sidecar) / `MCP` / `gh-api` (github-pr-api) / `stdout` / `local-API` / `hook-inject` / `in-source` / `voice` / `none`
- Agent: `cc-skill` (Claude Code skill/plugin) / `claude-code` (Claude-specific, not packaged as a skill) / `agnostic` / `proprietary` / `none`
- Bidir: `H→A` (human→agent only) / `both` / `A→H` (agent→human narration) / `n/a` (no agent loop)
- Use case: `diff` (local-diff-review) / `PR` (PR-review) / `CI` (CI-auto-review) / `plan` (agent-plan-review) / `other`

---

## 1. Per-repo classification (59 repos, ordered by stars)

| # | Repo | ★ | Surface | Annotation | Agent | Bidir | Use case |
|---|------|---|---------|-----------|-------|-------|----------|
| 1 | [dandavison/delta](https://github.com/dandavison/delta) | 30866 | CLI | none | none | n/a | diff |
| 2 | [Wilfred/difftastic](https://github.com/Wilfred/difftastic) | 25349 | CLI | none | none | n/a | diff |
| 3 | [so-fancy/diff-so-fancy](https://github.com/so-fancy/diff-so-fancy) | 18024 | CLI | none | none | n/a | diff |
| 4 | [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer) | 8446 | web | none | cc-skill | A→H | other |
| 5 | [backnotprop/plannotator](https://github.com/backnotprop/plannotator) | 5450 | web | hook-inject | agnostic | both | plan |
| 6 | [google/git-appraise](https://github.com/google/git-appraise) | 5298 | CLI | file (git objects) | none | n/a | PR |
| 7 | [modem-dev/hunk](https://github.com/modem-dev/hunk) | 4228 | TUI | file (skill) | agnostic | both | diff |
| 8 | [prontolabs/pronto](https://github.com/prontolabs/pronto) | 2667 | CLI | gh-api | none | n/a | CI |
| 9 | [remorses/critique](https://github.com/remorses/critique) | 1205 | TUI | none | agnostic | A→H | diff |
| 10 | [HexmosTech/git-lrc](https://github.com/HexmosTech/git-lrc) | 1026 | CLI | none | proprietary | A→H | CI |
| 11 | [kitlangton/ghui](https://github.com/kitlangton/ghui) | 957 | TUI | gh-api | none | n/a | PR |
| 12 | [agavra/tuicr](https://github.com/agavra/tuicr) | 830 | TUI | clip (+gh-api/stdout) | agnostic | H→A | diff |
| 13 | [nilbuild/diffity](https://github.com/nilbuild/diffity) | 668 | web | local-API (+gh-api) | agnostic | both | diff |
| 14 | [umputun/revdiff](https://github.com/umputun/revdiff) | 459 | TUI | stdout | agnostic | H→A | diff |
| 15 | [nkzw-tech/codiff](https://github.com/nkzw-tech/codiff) | 400 | desktop | clip | agnostic | both | diff |
| 16 | [tomasz-tomczyk/crit](https://github.com/tomasz-tomczyk/crit) | 344 | web | file (skill) | agnostic | both | diff |
| 17 | [badlogic/pi-diff-review](https://github.com/badlogic/pi-diff-review) | 265 | desktop | hook-inject (editor) | proprietary | H→A | diff |
| 18 | [mcollina/githuman](https://github.com/mcollina/githuman) | 254 | web | file (+ask handoff) | agnostic | both | diff |
| 19 | [earendil-works/pi-review](https://github.com/earendil-works/pi-review) | 223 | CLI | in-agent (Pi) | proprietary | both | diff |
| 20 | [agynio/gh-pr-review](https://github.com/agynio/gh-pr-review) | 154 | CLI | gh-api | agnostic | both | PR |
| 21 | [thoughtbot/pester](https://github.com/thoughtbot/pester) | 147 | web | none (notify) | none | n/a | PR |
| 22 | [wong2/diffx](https://github.com/wong2/diffx) | 143 | web | clip (+local-API) | agnostic | both | diff |
| 23 | [Royal-lobster/code-explainer](https://github.com/Royal-lobster/code-explainer) | 75 | IDE | none | cc-skill | A→H | other |
| 24 | [kevindutra/crit](https://github.com/kevindutra/crit) | 58 | TUI | file (skill) | cc-skill | both | diff |
| 25 | [josephschmitt/monocle](https://github.com/josephschmitt/monocle) | 52 | TUI | MCP (+socket) | agnostic | both | diff |
| 26 | [codesoda/discuss-cli](https://github.com/codesoda/discuss-cli) | 44 | web | local-API | agnostic | both | plan |
| 27 | [juanibiapina/deltoids](https://github.com/juanibiapina/deltoids) | 17 | CLI | none | agnostic | A→H | diff |
| 28 | [0xKitsune/pr.nvim](https://github.com/0xKitsune/pr.nvim) | 14 | IDE | gh-api | none | n/a | PR |
| 29 | [Waraq-Labs/review-for-agent](https://github.com/Waraq-Labs/review-for-agent) | 10 | web | file (+clip) | agnostic | H→A | diff |
| 30 | [polyphilz/glance](https://github.com/polyphilz/glance) | 10 | TUI | none | none | n/a | diff |
| 31 | [MMesch/quickfix-review-nvim](https://github.com/MMesch/quickfix-review-nvim) | 9 | IDE | file (+clip) | agnostic | H→A | diff |
| 32 | [lava/backloop](https://github.com/lava/backloop) | 8 | web | MCP | agnostic | both | diff |
| 33 | [gh-tui-tools/gh-review-conductor](https://github.com/gh-tui-tools/gh-review-conductor) | 6 | TUI | gh-api | agnostic | n/a | PR |
| 34 | [taranek/orche](https://github.com/taranek/orche) | 5 | hybrid | hook-inject (terminal) | agnostic | both | diff |
| 35 | [benstroud/lazygaze](https://github.com/benstroud/lazygaze) | 4 | TUI | none | agnostic | A→H | diff |
| 36 | [rose-m/diffman](https://github.com/rose-m/diffman) | 4 | TUI | clip (+gh-api) | agnostic | H→A | diff |
| 37 | [andrewleech/git-review](https://github.com/andrewleech/git-review) | 4 | TUI | file (planned) | none | n/a | diff |
| 38 | [peterfication/git-local-review](https://github.com/peterfication/git-local-review) | 2 | TUI | file (SQLite) | none | n/a | diff |
| 39 | [abdul-hamid-achik/gpeek](https://github.com/abdul-hamid-achik/gpeek) | 1 | hybrid | MCP | agnostic | both | diff |
| 40 | [opencodereview-org/opencodereview](https://github.com/opencodereview-org/opencodereview) | 1 | other | file (spec) | agnostic | both | other |
| 41 | [MerlinSMQWQ/CodeReviewer](https://github.com/MerlinSMQWQ/CodeReviewer) | 1 | TUI | file (md artifacts) | none | A→H | diff |
| 42 | [inferaldata/acre](https://github.com/inferaldata/acre) | 1 | TUI | file (.xml) | claude-code | both | diff |
| 43 | [ryandday/gauge](https://github.com/ryandday/gauge) | 1 | TUI | file (CLI-built) | agnostic | both | diff |
| 44 | [drisspg/pi-review](https://github.com/drisspg/pi-review) | 0 | web | gh-api (+Pi SDK) | proprietary | both | PR |
| 45 | [0xd219b/cr-helper](https://github.com/0xd219b/cr-helper) | 0 | TUI | file (skill+hooks) | cc-skill | both | diff |
| 46 | [Asafrose/revue](https://github.com/Asafrose/revue) | 0 | TUI | clip | agnostic | H→A | diff |
| 47 | [tkrajcar/vet](https://github.com/tkrajcar/vet) | 0 | TUI | stdout | cc-skill | both | diff |
| 48 | [gerunddev/tcr](https://github.com/gerunddev/tcr) | 0 | TUI | file (feedback.md) | agnostic | H→A | diff |
| 49 | [cloudflavor/parley](https://github.com/cloudflavor/parley) | 0 | TUI | file (.parley/) | agnostic | both | diff |
| 50 | [samverrall/review-ui](https://github.com/samverrall/review-ui) | 0 | TUI | clip / file | agnostic | H→A | diff |
| 51 | [fanzeyi/bino](https://github.com/fanzeyi/bino) | 0 | TUI | none | none | n/a | diff |
| 52 | [Tehsmash/copilotfeedback](https://github.com/Tehsmash/copilotfeedback) | 0 | TUI | file (feedback.json) | agnostic | H→A | diff |
| 53 | [inmzhang/copanion](https://github.com/inmzhang/copanion) | 0 | TUI | clip / stdout | agnostic | both | diff |
| 54 | [lix42/rev](https://github.com/lix42/rev) | 0 | TUI | file (export) | agnostic | H→A | diff |
| 55 | [onikukiraii/rikugan](https://github.com/onikukiraii/rikugan) | 0 | TUI | clip | agnostic | H→A | diff |
| 56 | [ahmetbir/yap](https://github.com/ahmetbir/yap) | 0 | TUI | voice | claude-code | both | diff |
| 57 | [alieron/debth](https://github.com/alieron/debth) | 0 | TUI | file (.debth/) | none | n/a | diff |
| 58 | [annenpolka/kizu](https://github.com/annenpolka/kizu) | 0 | TUI | in-source | agnostic | both | diff |
| 59 | [mgd34msu/goodvibes-tui](https://github.com/mgd34msu/goodvibes-tui) | 0 | TUI | n/a (internal) | proprietary | both | CI |

### Notable per-repo caveats

- **#5 plannotator** — started as a *plan* annotator (built-in plan-mode hook); code review was added later. Multi-agent (Claude Code, Copilot CLI, Gemini CLI, OpenCode, Pi, Codex). Annotation reaches the agent through the hook / slash-command return, not a file or MCP.
- **#19 / #44 pi-review** — two unrelated repos with the same name. earendil's is a Pi *extension* (CLI slash commands, the agent does the reviewing); drisspg's is a standalone local web app for *GitHub PR* review backed by the Pi SDK.
- **#27 deltoids** — primarily a tree-sitter diff *pager* plus a set of CLI edit/write/trace tools for agents; `deltoids review` exists but the project is viewer-first. The "agent→human" rating reflects its agent edit-trace browser.
- **#33 gh-review-conductor** — *consumes* GitHub PR reviews and applies suggestions to a local checkout; it is the inverse direction of most tools here. Optional AI-assisted suggestion application.
- **#40 opencodereview** — not an application: a portable, tool-agnostic *specification* for "review as a first-class file object." Conceptually the most on-thesis artifact in the set; zero traction. `acre` (#42) implements it.
- **#43 gauge** & **#9 critique (`critique review`)** — invert the loop: the *agent* builds/organizes the review (themed, ordered sections; reading-order walkthroughs) and the human consumes it.
- **#56 yap** — voice-driven: Claude narrates each diff aloud, you reply by voice, it fixes in place. Only voice-native tool in the set.
- **#58 kizu** — unique annotation model: writes `@kizu[...]` comments into the source file; the agent picks them up on its next `PostToolUse`/`Stop` hook.
- **#59 goodvibes-tui** — an outlier: it is itself a full autonomous coding agent with an internal write-review-fix-check pipeline. Not a human-in-the-loop review tool; included for completeness.

---

## 2. Timeline clusters

### First-release quarter (as given in the data)
Only ~34 of 59 repos have any GitHub release, so this view is incomplete:

`2016-Q1: 2 · 2019-Q3: 1 · 2021-Q1: 1 · 2022-Q2: 1 · 2025-Q3: 1 · 2025-Q4: 2 · 2026-Q1: 4 · 2026-Q2: 3` (plus 2026-02/03/04/05 detail: Q1 2026 = 7, Q2 2026 ≈ 9). **25 repos ship with no tagged release at all** — see Surprising Patterns.

### Repo-creation month (the honest "when did it ship" signal — all 59)

| Period | New repos | Notes |
|--------|-----------|-------|
| 2013–2019 | 6 | pronto, pester, git-appraise, diff-so-fancy, difftastic, delta — the pre-agent legacy tail |
| 2025-Q3 | 2 | git-local-review (Jul), backloop (Sep) |
| 2025-Q4 | 8 | Oct: critique, gh-review-conductor, andrewleech/git-review · Dec: plannotator, githuman, gh-pr-review, vet, copilotfeedback |
| **2026-Jan** | **8** | tuicr, cr-helper, acre, opencodereview, tcr, gpeek, pr.nvim, review-ui |
| **2026-Feb** | **7** | gauge, git-lrc, review-for-agent, quickfix-review-nvim, visual-explainer, crit (tomasz), diffman |
| **2026-Mar** | **15** | hunk, monocle, diffity, rev, goodvibes-tui, code-explainer, lazygaze, rikugan, glance, revue, crit (kevindutra), copanion, pi-diff-review, orche, yap |
| **2026-Apr** | **10** | revdiff, bino, CodeReviewer, diffx, ghui, deltoids, kizu, parley, discuss-cli, earendil/pi-review |
| 2026-May (partial) | 3 | drisspg/pi-review, debth, codiff |

### Inflection points

- **The field is ~6 months old.** Before mid-2025 there are only 6 repos, all general-purpose. The first purpose-built "review without a PR" tool in the modern cluster is **git-local-review (Jul 2025)**, followed by **backloop (Sep 2025)**.
- **December 2025 is the take-off month** — 5 repos created in one month (plannotator, githuman, gh-pr-review, vet, copilotfeedback), the first time 5+ shipped together.
- **Every month since has cleared the 5+ bar:** Jan 8, Feb 7, Mar 15, Apr 10.
- **March 2026 is the peak: 15 new repos in 31 days** — roughly one new local agent-review tool every two days. ~64% of the entire field (38/59) was created in the Jan–Apr 2026 window.

---

## 3. Category gaps — Surface × Use-case matrix

Counts are by *primary* use case (n = 59).

| Surface ↓ / Use case → | diff | PR | CI | plan | other | Total |
|---|---|---|---|---|---|---|
| TUI | **28** | 2 | 1 | 0 | 0 | 31 |
| local-web | 6 | 2 | 0 | 2 | 1 | 11 |
| CLI | 5 | 2 | 2 | 0 | 0 | 9 |
| IDE-plugin | 1 | 1 | 0 | 0 | 1 | 3 |
| desktop | 2 | 0 | 0 | 0 | 0 | 2 |
| hybrid | 2 | 0 | 0 | 0 | 0 | 2 |
| other | 0 | 0 | 0 | 0 | 1 | 1 |
| **Total** | **44** | 7 | 3 | 2 | 3 | 59 |

### Empty / underserved cells

- **TUL × plan review = empty.** No terminal tool treats agent *plan* review as its primary job. crit (kevindutra) and earendil/pi-review do plans as a secondary feature; nothing is plan-first in a TUI. Given that plan review is where the agent loop starts, this is a real gap.
- **Plan review overall is served by 2 tools, both local-web** (plannotator, discuss-cli). No CLI, TUI, IDE, or desktop plan reviewer.
- **CI-auto-review is nearly empty (3)** and barely overlaps the human-in-the-loop framing: pronto (legacy linter), git-lrc (commit-hook AI reviewer), goodvibes-tui (autonomous agent). No tool does pre-PR auto-review that *hands findings to a human* to triage.
- **IDE-plugin surface is thin (3 repos)** and entirely Neovim/VS Code. No JetBrains plugin; no VS Code extension with a real agent feedback loop (code-explainer is narration-only, quickfix-review-nvim and pr.nvim have no agent loop). This is surprising given most agent users live in VS Code/Cursor.
- **desktop and hybrid only do local-diff-review** — no desktop plan reviewer, no desktop PR tool aimed at agents.
- **local-web × CI = empty**; **CLI × plan = empty**.

### The crowded cell

**TUI × local-diff-review holds 28 of 59 tools (47%).** local-diff-review as a column holds 44/59 (75%). The category is a monoculture: a Rust/Go terminal app that shows a git diff, takes line comments, and exports them to the agent. Differentiation inside that cell is now down to VCS support (jj/hg), keybindings, and handoff mechanism.

---

## 4. Surprising patterns

1. **25 of 59 repos have zero tagged releases** (~42%) yet are all marked "active." Distribution is `cargo install` / `npm i` / `go install` / `curl | sh` straight from `main`. The "first release by quarter" stat silently undercounts the field by nearly half — worth flagging if you cite release dates in the post.

2. **Rust leads, but it's a three-way race.** Rust 17 · Go 15 · TypeScript 15. Rust + Go together = 32/59 (54%), and they dominate the TUI cell (ratatui / Bubble Tea). TypeScript owns the local-web and desktop surfaces almost entirely. There is essentially no Python TUI traction (4 Python repos, all tiny).

3. **Release velocity is extreme on a few repos.** goodvibes-tui shipped **105 releases in ~4 weeks** (2026-04-15 → 05-13). revdiff: **54 releases in ~6 weeks**. plannotator: 105 releases in ~5 months. crit (tomasz): 54 in ~3 months. monocle: 62 in ~5 weeks. This pace is consistent with agent-assisted release workflows but was not independently verified.

4. **High PR-to-contributor ratios suggest agent-assisted development.** crit (tomasz): 470 PRs, 454 merged, 615 commits, 15 contributors. peterfication/git-local-review: 99 PRs / 235 commits / **2 stars** / 2 contributors. tuicr: 220 PRs, 50 contributors at only 830 stars and ~4 months old. plannotator: 630 commits / 81 contributors. The commit and PR volumes per human contributor are unusually high — consistent with agents participating in the development loop, though the exact workflow isn't visible from public data.

5. **Namespace collisions are common.** Two repos named **`crit`** (tomasz-tomczyk, kevindutra) plus `critique`. Two named **`pi-review`** (earendil, drisspg) plus `pi-diff-review`. Multiple repos with `git-review` or `review` in the name. The category is young enough that naming hasn't converged.

6. **Star count is a bad proxy for relevance.** The top 6 by stars include 3 legacy pagers (delta 30.8k, difftastic 25.3k, diff-so-fancy 18k) with no annotation and no agent integration, plus visual-explainer (8.4k — a presentation skill, not a review tool) and git-appraise (5.3k — a 2016 distributed-review system). The most on-thesis tools sit at 0–5k stars. Rank by framing, not stars (see §5).

7. **A "Pi ecosystem" sub-cluster is forming.** badlogic/pi-diff-review, earendil/pi-review, drisspg/pi-review are all Pi-native; plannotator and deltoids also ship Pi packages. badlogic's README openly calls his own repo "pure slop" and asks someone to build it properly — and people are.

8. **jj (Jujutsu) support appears in tools that are weeks old.** tuicr, hunk, revdiff, acre, tcr, copanion, deltoids all auto-detect jj (several also hg). Multi-VCS support in such young projects is notable.

9. **Loop inversions exist.** gauge and `critique review` have the *agent* build and order the review; deltoids ships a real-time agent edit-trace browser; gh-review-conductor runs the loop backwards (pulls existing PR reviews down to local). Most tools are human→agent; these four are not.

10. **Genuinely novel annotation models.** kizu writes review comments *into the source file* and lets agent hooks pick them up (zero copy-paste, zero typing). yap is voice-native. monocle/backloop/gpeek deliver over MCP. The original 5-value annotation taxonomy doesn't cover ~10 tools — the delivery mechanism is itself an area of active experimentation.

11. **21 of 59 repos have no (or unrecognized) license.** 19 are fully unlicensed, 2 have custom licenses GitHub classifies as "Other" (githuman, git-lrc). ~36% unlicensed or ambiguous is a real risk worth a sentence in the post. One AGPL (backloop) — unusual for dev tooling.

12. **The "review before commit, not before PR" thesis is stated explicitly and repeatedly.** githuman ("moves the review checkpoint to the staging area"), opencodereview ("review happens too late"), git-lrc ("why not wait for a PR? too late"), and others independently articulate the same argument. It's a converged thesis, not one author's pitch.

---

## 5. Top 10 most notable (by relevance to "local agent code review")

Ranked by fit to the pre-PR, human-in-the-loop, agent-authored-code framing — traction used only as a tiebreak.

1. **josephschmitt/monocle** (52★) — The purest expression of the thesis: review the diff *as the agent writes it*, leave line comments, submit a batch, and MCP pushes the feedback straight into the agent's context. Real-time review loop without gating the agent.

2. **backnotprop/plannotator** (5450★) — Highest-traction tool in the agentic cluster; covers both plan and code review, with one-click feedback to six different agents via a built-in hook. The closest thing to a category leader.

3. **modem-dev/hunk** (4228★) — "Review-first terminal diff viewer for agent-authored changesets" — the framing in one sentence. 4.2k stars, watch mode, skill-based agent handoff.

4. **tomasz-tomczyk/crit** (344★) — Tagline "your feedback loop with the agent." Reviews code, plans, live apps, and HTML artifacts — the only tool that recognizes agents emit more than diffs. 13+ agent integrations, round-by-round loop.

5. **mcollina/githuman** (254★) — Names the thesis outright ("GitHub defines how humans collaborate; GitHuman defines how humans review code written by AI") and moves the checkpoint to the staging area, pre-commit. Includes an explicit `ask`→handoff flow.

6. **agavra/tuicr** (830★) — The most mature TUI in the cluster (50 contributors, 220 PRs in ~4 months). Classified comment types, triple export (GitHub PR / clipboard / stdout), git+jj+hg. The reference implementation others benchmark against.

7. **annenpolka/kizu** (0★) — Most novel design: a real-time diff monitor that lets you mark a bad change with one keystroke, writing an in-source "scar" the agent must heal on its next hook. Solves the articulation problem, not just the display problem.

8. **umputun/revdiff** (459★) — Cleanest minimal expression of the loop: review diffs/files/docs, annotate, emit structured annotations to stdout for the calling agent. 54 releases in ~6 weeks; multi-VCS. Deliberately "just enough UI."

9. **wong2/diffx** (143★) — "A local code review tool designed for the coding agent workflow." GitHub-PR-like web UI, structured XML export, and agents reply to comments via a local API — a true two-way thread, not a one-shot dump.

10. **codesoda/discuss-cli** (44★) — Extends the loop beyond diffs to plans, PRDs, and RFCs — PR-style threaded comments on Markdown that the agent reads and replies to in the margins, fully bidirectional over a local API. The best answer to the empty "plan review" matrix cell.

**Honorable mentions:** `opencodereview` (the portable review-as-object spec — conceptually central, zero traction); `lava/backloop` (clean MCP feedback-loop server); `kevindutra/crit` and `tkrajcar/vet` (tight Claude Code plugin loops); `ryandday/gauge` (agent-built, human-triaged structured review — the most interesting loop inversion).

---

## 6. Enriched profiles — most relevant tools

Enriched from scraped GitHub data (stars, commits, contributors, README excerpts).
Licenses verified via GitHub API. Grouped by role in the blog post narrative.

### The "before" picture (pre-agent prettifiers)

These are general-purpose diff renderers from the pre-agent era. No annotation, no agent integration, no review loop. Included for the blog post's historical contrast.

#### dandavison/delta

- **Description:** A syntax-highlighting pager for git, diff, grep, rg --json, and blame output
- **Stars:** 30,866 | **Language:** Rust | **License:** MIT
- **First release:** 2019-07-16 (0.0.1) | **Last:** 2026-03-28 (0.19.2) | **Total releases:** 62
- **Commits:** 2,176 | **Contributors:** 152 | **PRs:** 1,109 (92 open, 615 merged)
- **Topics:** color-themes, delta, diff, git, pager, rust, syntax-highlighter

#### Wilfred/difftastic

- **Description:** a structural diff that understands syntax
- **Stars:** 25,349 | **Language:** Rust | **License:** MIT
- **First release:** 2022-04-10 (0.26.1) | **Last:** 2026-04-30 (0.69.0) | **Total releases:** 51
- **Commits:** 15,806 | **Contributors:** 490 | **PRs:** 256 (32 open, 150 merged)
- **Topics:** diff, tree-sitter

#### so-fancy/diff-so-fancy

- **Description:** Make your diffs human readable for improved code quality and faster defect detection
- **Stars:** 18,024 | **Language:** Perl | **License:** MIT
- **First release:** 2016-02-29 (v0.1.0) | **Last:** 2026-04-09 (v1.4.10) | **Total releases:** 39
- **Commits:** 871 | **Contributors:** 95 | **PRs:** 223 (0 open, 169 merged)
- **Topics:** diff, diff-highlight, diffs, fancy, git

### Top 10 most relevant (ranked by §5)

#### 1. josephschmitt/monocle (52★)

- **Description:** Keep an eye on what your agent makes and stay in the loop
- **Stars:** 52 | **Language:** Go | **License:** MIT
- **First release:** 2026-03-18 (v0.1.0) | **Last:** 2026-04-25 (v0.46.1) | **Total releases:** 62
- **Commits:** 473 | **Contributors:** 3 | **PRs:** 91 (3 open, 77 merged)
- **README:** "Review your AI agent's code as it writes it. Leave comments on diffs, submit structured feedback, and watch the agent fix things in real time — all from your terminal. Monocle connects to your agent via MCP tools or CLI commands over a Unix socket."

#### 2. backnotprop/plannotator (5,450★)

- **Description:** Annotate and review coding agent plans and code diffs visually, share with your team, send feedback to agents with one click
- **Stars:** 5,450 | **Language:** TypeScript | **License:** Apache-2.0
- **First release:** 2025-12-29 (v0.1.0) | **Last:** 2026-05-19 (v0.19.20) | **Total releases:** 105
- **Commits:** 630 | **Contributors:** 81 | **PRs:** 451 (34 open, 367 merged)
- **Topics:** agents, claude-code, code-review, codex, obsidian, opencode, pi-mono, plan-mode, skills
- **README:** "Interactive Plan & Code Review for AI Coding Agents. Mark up and refine your plans or code diffs using a visual UI, share for team collaboration, and seamlessly integrate with Claude Code, Copilot CLI, Gemini CLI, OpenCode, Pi, and Codex."

#### 3. modem-dev/hunk (4,228★)

- **Description:** Review-first terminal diff viewer for agentic coders
- **Stars:** 4,228 | **Language:** TypeScript | **License:** MIT
- **First release:** 2026-03-22 (v0.4.0) | **Last:** 2026-05-19 (v0.13.1) | **Total releases:** 36
- **Commits:** 389 | **Contributors:** 25 | **PRs:** 280 (28 open, 232 merged)
- **Topics:** cli, code-review, diff, git, tui
- **README:** "Hunk is a review-first terminal diff viewer for agent-authored changesets, built on OpenTUI and Pierre diffs. Multi-file review stream with sidebar navigation, inline AI and agent annotations beside the code, watch mode for auto-reloading."

#### 4. tomasz-tomczyk/crit (344★)

- **Description:** Your feedback loop with the agent
- **Stars:** 344 | **Language:** Go | **License:** MIT
- **First release:** 2026-02-16 (v0.1.0) | **Last:** 2026-05-20 (v0.15.3) | **Total releases:** 54
- **Commits:** 615 | **Contributors:** 15 | **PRs:** 470 (2 open, 454 merged)
- **Topics:** agentic-coding, ai-agents, ai-tools, cli, code-review, developer-tools, llm, markdown
- **README:** "A browser-based review UI for AI agent output. Point at the line. Tell the agent. Four review modes: diffs, plans, HTML pages, live apps. Each output needs a different review surface — terminal diffs work for none of them."

#### 5. mcollina/githuman (254★)

- **Description:** Keep the Human in the Loop of coding
- **Stars:** 254 | **Language:** TypeScript | **License:** Other (custom, unrecognized)
- **First release:** 2026-01-19 (v0.1.0) | **Last:** 2026-04-12 (v0.9.0) | **Total releases:** 9
- **Commits:** 153 | **Contributors:** 3 | **PRs:** 14 (6 open, 7 merged)
- **README:** "Review AI agent code changes before commit."

#### 6. agavra/tuicr (830★)

- **Description:** a code review TUI with vim keybindings
- **Stars:** 830 | **Language:** Rust | **License:** MIT
- **First release:** 2026-01-09 (v0.1.1) | **Last:** 2026-05-19 (v0.15.0) | **Total releases:** 20
- **Commits:** 248 | **Contributors:** 50 | **PRs:** 220 (5 open, 202 merged)
- **Topics:** ai-tools, code-review, rust, tui
- **README:** "A code review TUI with vim keybindings. Export to GitHub or clipboard. GitHub-style continuous diff in the terminal — scroll through every changed file in one stream. PR-style comments at line, range, file, and review level. Works with git, jj, and mercurial."

#### 7. annenpolka/kizu (0★)

- **Description:** Realtime diff monitor + inline scar review TUI for AI coding agents
- **Stars:** 0 | **Language:** Rust | **License:** MIT
- **First release:** 2026-04-18 (v0.3.0) | **Last:** 2026-05-04 (v0.7.0) | **Total releases:** 9
- **Commits:** 244 | **Contributors:** 1 | **PRs:** 18 (0 open, 18 merged)
- **README:** "Realtime diff monitor + inline scar review TUI for AI coding agents — Claude Code, Cursor, Codex, Qwen Code, Cline, Gemini. When something looks wrong, press one key and a @kizu comment is written into the source file at the change site. The agent picks it up on its next hook."

#### 8. umputun/revdiff (459★)

- **Description:** TUI for reviewing diffs, files, and documents with inline annotations
- **Stars:** 459 | **Language:** Go | **License:** MIT
- **First release:** 2026-04-01 (v0.1.0) | **Last:** 2026-05-13 (v1.3.0) | **Total releases:** 54
- **Commits:** 342 | **Contributors:** 28 | **PRs:** 139 (1 open, 123 merged)
- **Topics:** agentic-workflow, claude-code, code-review, diff, tui
- **README:** "TUI for reviewing diffs, files, and documents with inline annotations. Outputs structured annotations to stdout on quit, making it easy to pipe results into AI agents. Built for reviewing code changes, plans, and documents without leaving a terminal-based AI coding session. Just enough UI — no more, no less."

#### 9. wong2/diffx (143★)

- **Description:** A local code review tool designed for the coding agent workflow
- **Stars:** 143 | **Language:** TypeScript | **License:** none
- **First release:** 2026-04-05 (v0.7.1) | **Last:** 2026-04-16 (v0.12.1) | **Total releases:** 10
- **Commits:** 76 | **Contributors:** 4 | **PRs:** 18 (0 open, 15 merged)
- **README:** "A local code review tool designed for the coding agent workflow. Review AI-generated changes in a GitHub PR-like web UI, leave inline comments, then hand them back to your coding agent to fix."

#### 10. codesoda/discuss-cli (44★)

- **Description:** Stop reviewing agent plans in the terminal — PR-style review for Markdown that Codex / Claude Code can reply to
- **Stars:** 44 | **Language:** Rust | **License:** none
- **First release:** 2026-04-24 (v0.2.0) | **Last:** 2026-04-29 (v0.4.0) | **Total releases:** 3
- **Commits:** 90 | **Contributors:** 2 | **PRs:** 9 (5 open, 4 merged)
- **README:** "Stop reviewing agent plans in the terminal. Discuss opens any Markdown file in your browser with PR-style comment threads on every paragraph. Your Codex or Claude Code session reads your comments and replies in the margins — same terminal session, no copy-paste. Anchored. Threaded. Bidirectional. No cloud."

### Honorable mentions

#### lava/backloop (8★)

- **Description:** A local code review server for agentic coding
- **Stars:** 8 | **Language:** Python | **License:** AGPL-3.0
- **Created:** 2025-09-15 | **Last push:** 2026-04-14
- **Commits:** 194 | **Contributors:** 2
- **README:** "A fully local code review platform with a built-in feedback loop."

#### kevindutra/crit (58★)

- **Description:** TUI for reviewing AI-generated code and plans
- **Stars:** 58 | **Language:** Go | **License:** none
- **First release:** 2026-03-08 (v0.1.0) | **Last:** 2026-03-13 (v0.2.2) | **Total releases:** 4
- **Commits:** 17 | **Contributors:** 2
- **README:** "TUI for reviewing AI-generated code and plans — built for human-in-the-loop agentic coding workflows."

#### ryandday/gauge (1★)

- **Description:** Structured code review TUI — agents break your diff into themed, ordered sections, you triage and deep review
- **Stars:** 1 | **Language:** Rust | **License:** Apache-2.0
- **Commits:** 19 | **Contributors:** 1
- **README:** "Structured code review sessions, built by AI agents, reviewed by humans. The problem: GitHub shows diffs alphabetically by filename. There's no narrative, no ordering for understanding. Gauge inverts the loop — the agent builds the review, the human triages it."

#### opencodereview-org/opencodereview (1★)

- **Description:** A portable, tool-agnostic code review specification
- **Stars:** 1 | **Language:** Python | **License:** MIT
- **Created:** 2026-01-13
- **README:** "A portable, tool-agnostic specification for code review as a first-class object. Review happens too late. Traditional code review waits until code is committed and a PR is opened. But when AI generates code, you need to review it before committing."

### Unique / notable for the post

#### ahmetbir/yap (0★) — voice-driven

- **Description:** AI that yaps at your code so your colleagues don't have to — voice-driven code review TUI
- **Stars:** 0 | **Language:** Go | **License:** none
- **Commits:** 3 | **Contributors:** 1
- **README:** "The AI that yaps at your code so your colleagues don't have to. yap is a voice-driven code review TUI. It talks you through every diff, listens to your feedback, and fixes things on the spot. Stop vibe coding. Start reviewing."

#### juanibiapina/deltoids (17★) — tree-sitter diff pager

- **Description:** Diff filter that expands every hunk to include the enclosing function or block via tree-sitter
- **Stars:** 17 | **Language:** Rust | **License:** MIT
- **First release:** 2026-04-24 (v0.1.0) | **Last:** 2026-05-18 (v0.7.0) | **Total releases:** 7
- **Commits:** 208 | **Contributors:** 2
- **Topics:** claude, claude-code, cli, code-review, coding-agents, diff, git, lazygit, pager, pi, rust, terminal, tree-sitter
- **README:** "Tools for reviewing code in the agentic era."

#### nilbuild/diffity (668★) — threaded web reviews

- **Description:** GitHub-style diff viewer for reviewing code changes, works with Claude Code, Cursor and other AI tools
- **Stars:** 668 | **Language:** TypeScript | **License:** MIT
- **Commits:** 198 | **Contributors:** 3
- **README:** "Diffity is an agent-agnostic, GitHub-style diff viewer and code review tool."

#### remorses/critique (1,205★) — beautiful TUI, agent→human narration

- **Description:** TUI for reviewing git changes
- **Stars:** 1,205 | **Language:** TypeScript | **License:** MIT
- **First release:** 2026-01-07 | **Last:** 2026-04-25 | **Total releases:** 44
- **Commits:** 449 | **Contributors:** 9
- **Topics:** diff, opentui, tui
- **README:** "A beautiful terminal UI for reviewing git diffs with syntax highlighting, split view, and word-level diff."

#### nkzw-tech/codiff (400★) — desktop app, LLM walkthroughs

- **Description:** a fast local diff viewer
- **Stars:** 400 | **Language:** TypeScript | **License:** MIT
- **First release:** 2026-05-17 (v0.1.0) | **Last:** 2026-05-20 (v0.4.0) | **Total releases:** 5
- **Commits:** 75 | **Contributors:** 4
- **README:** "Codiff is a beautiful, minimal, local diff viewer for reviewing staged and unstaged Git changes before committing. LLM Walkthroughs: Run `codiff -w` to ask Codex to give you a review order and more context."

#### agynio/gh-pr-review (154★) — terminal PR review for agents

- **Description:** GitHub CLI extension for full inline PR review comment support — LLM-ready and ideal for automated PR review agents
- **Stars:** 154 | **Language:** Go | **License:** MIT
- **First release:** 2025-12-07 (v1.6.1) | **Total releases:** 2
- **Commits:** 73 | **Contributors:** 5
- **Topics:** ai-agents, automation, code-review, gh-extension, github, inline-comments, llm-tools, pull-requests, review-threads, skill, terminal
- **README:** "gh-pr-review finally brings inline PR review comments to the terminal. GitHub's built-in gh tool does not show inline comments or review threads — but this extension does."

---

## Disclaimers and methodology

**What this is:** an externalized exploration of the local agent code review tool landscape, captured as structured data and classification. The seed list was curated by a terminal-first developer researching tools for their own workflow.

**What this isn't:** a comprehensive survey. The seed list over-indexes on terminal-native tools (68% TUI/CLI). IDE plugins, VS Code extensions, and cloud PR bots are underrepresented relative to their broader usage. The classification and top-10 ranking reflect the authors' judgment, not a weighted scoring system. Claims about activity levels, repo stats, and licensing are from GitHub's public API (scraped 2026-05-20) and may be stale.

**Dated content:** May 2026. The tools and landscape change rapidly — several repos in this survey shipped 50+ releases in under six weeks. The field is approximately six months old at time of writing.

**Conflicts of interest:** the initial classification was done by Claude Opus 4.7 (Anthropic), a model from a company whose product (Claude Code) is referenced by many of the surveyed tools. Fact-checking, license verification, and profile enrichment were done by DeepSeek V4 Pro via the pi coding agent (pAIr00t).

**Generation context:** initial classification from aggregated repo summaries in a single Claude Opus session with thinking=high. Fact-checking, license verification via `gh api`, and enriched profiles in a follow-up DeepSeek V4 Pro session (thinking=medium) using raw scraped GitHub data. Total: two LLM sessions plus ~60 GitHub API calls for repo stats.


{{< /clickwall >}}
