---
title: "LazyDigest #001 - LeChuck's Revenge"
date: 2026-05-15
description: "Tab bankruptcy, pirate-style. I dumped a week of unread links into deepseek-v4-pro and asked it to write a Monday-morning digest in LeChuck's voice."
keywords: [lazy-digest]
ai_disclosure: mixed
ai_label: "AI-Collaboration: Links provided by me, synthesis and summarization done by the AI."
ai_model: "deepseek-v4-pro"
ai_provider: "Ollama Cloud"
---

Today I spent most of my "free time" getting ready to open source [lazyai](https://github.com/fgrehm/lazyai) after doing my daily "15min social network round" / tab hoarding.

Didn't want to get into the weekend with this many tabs so decided to have a bit of fun and told deepseek-v4-pro to write a digest for me, basically a "Read it later LeChuck edition". :pirate:

<details><summary> Click to see the prompt</summary>

I want you to read all the links below and write a newsletter / digest to convince me to read them on Monday. The arguments should be written in pirate style, inspired by LeChuck from Monkey Island games.

Cluster the material if possible into topics and write the digest to `read-it-monday.md`, **DONT FORGET TO LINK TO THE PAGES**.

If one of the links fail fetching, write them to `errored.md`, then add a "vibe section" for those based on the URL only, use your imagination, just make sure you add a disclaimer it's all fabricated (in pirate voice too)

- https://antirez.com/news/165
- https://arize.com/blog/code-is-free-technical-debt-isnt-notes-from-ai-engineer-europe/
- https://blog.k10s.dev/im-going-back-to-writing-code-by-hand/
- https://choosealicense.com/licenses/cc0-1.0/
- https://codemanship.wordpress.com/2025/10/15/is-your-development-team-ai-ready/
- https://codemanship.wordpress.com/2025/10/30/the-ai-ready-software-developer-index/
- https://codemanship.wordpress.com/2026/05/10/slow-the-fk-down/
- https://goose-docs.ai/
- https://jamesclear.com/3-2-1/may-14-2026
- https://kyleandco.com/tokenmaxxing-performance-reviews/
- https://leandronsp.com/articles/taming-non-determinism-from-logic-gates-to-llms
- https://mariozechner.at/posts/2026-03-25-thoughts-on-slowing-the-fuck-down
- https://martinfowler.com/bliki/InterrogatoryLLM.html
- https://newsletter.pragmaticengineer.com/p/the-pulse-did-capacity-shortages-0e6
- https://newsletter.pragmaticengineer.com/p/typescript-c-and-turbo-pascal-with
- https://steve-yegge.medium.com/welcome-to-gas-city-57f564bb3607
- https://techcrunch.com/2026/05/14/clawdmeter-turns-your-claude-code-usage-stats-into-a-tiny-desktop-dashboard/
- https://tidyfirst.substack.com/p/hey-n00b-we-didnt-hire-you-to-complete
- https://tidyfirst.substack.com/p/thinkies-world-congress-ii-may-20
- https://vinineves.com/en/posts/the-bottleneck-just-moved/
- https://www.anthropic.com/news/gates-foundation-partnership
- https://www.docker.com/blog/comparing-sandboxing-approaches-ai-agents/
- https://www.platformer.news/threads-bluesky-x-usage-utopia-twitter-clones/
- https://www.youtube.com/watch?v=eqbfokhLioY
- https://x.com/SentientAGI/status/2046967422004154739
- https://x.com/dhh/status/2055261064284033386

</details>

---

{{< clickwall >}}

## ARRR! READ IT MONDAY, YE SPINELESS BILGE RATS!

*AVAST! I, the dread pirate LeChuck, have assembled these treasures from the farthest reaches of the techno-seas. Cast yer weepin' eyeballs upon 'em and despair — or learn somethin', whichever comes first. Fail to read these by Monday and I'll have ye scrubbing the ectoplasmic barnacles off me ghostly hull with yer own toothbrush! FAIR WINDS AND FULL CONTEXTS TO YE — OR ELSE!*

---

### Cluster I: "SLOW THE F**K DOWN, YE RUSHIN' IDJITS!"

*The sea of AI velocity be a churning maelstrom of DOOM, ye witless deck-swabbers! Everywhere I turn, some scurvy-ridden codebase has impaled itself upon the jagged rocks of "move fast and ship garbage." These be yer survival charts, and if ye ignore 'em, I'll PERSONALLY ensure yer next deploy summons a kraken directly into prod!*

#### The Bottleneck Just Moved

Vinny Neves, bless his barnacled soul, be soundin' the foghorn on code review in this cursed age of agents! Picture it: AI bein' spittin' nine PRs with nine thousand lines like some possessed parrot on a methamphetamine bender. 'Tis temptin' to think "she's validated, mateys, LGTM and away!" BUT HOLD THY HORSES, YE SORRY EXCUSE FOR A PRIVATEER! Review ain't about checkin' if code *works* — CI does that, the test suite does that, five whole layers of AI validation do that! REVIEW BE ABOUT *SHARIN' KNOWLEDGE*, YE SOGGY-BRAINED COCONUT! 'Tis the ONLY rigging that keeps a crew from becoming a collection of sad, isolated deckhands each scribblin' their own private corner of the git repo while understanding absolutely NOTHIN' about what anyone else be doin'!

> "Five layers of validation are still one head."

If only ONE wretched soul reads those nine thousand lines with actual attention... that ain't efficiency, that's FRAGILITY dolled up in a fancy GitHub diff like a skeleton in a ball gown! Tomorrow that one soul takes vacation, or wins the lottery, or gets devoured by a sea serpent, and suddenly NO LIVIN' BEIN' understands the code! PLUNDER THIS: [The bottleneck just moved](https://vinineves.com/en/posts/the-bottleneck-just-moved/)

---

#### Slow. The. F**k. Down.

Codemanship's Jason Gotshit — a name I'd carve into the mast of me own ghost ship — be hurlin' data from the Faros AI Engineering Report across 22,000 developers like flaming cannonballs! AND THE CARNAGE BE MAGNIFICENT:

- Incidents per PR up a blood-curdlin' **242%**!
- Bugs up **54%** — and ACCELERATIN' like a ship with a hole the size of a whale!
- PRs makin' it to production with **ZERO HUMAN EYES** upon 'em up **31%** — the fools be callin' it "LGTM-speed," which in my tongue translates to "LORD GIVE THESE MORONS MERCY!"
- Delivery lead times up a horrifyin' **480%** — FIVE! TIMES! LONGER! Because code's barrelling into downstream bottlenecks like lemmings off a cliff and cloggin' the entire damned harbor!

> "Bigger changes hitin' downstream bottlenecks faster just causes longer delays. We walked into this ambush with our eyes wide open."

SEVENTY-FIVE YEARS of software engineering wisdom! Flushed straight into Davy Jones' locker the moment some shiny new toy winked at 'em! Not the first time this has happened, mind ye — but NEVER on this scale, NEVER at this velocity, NEVER with this much carnage scattered across the seven digital seas! PLUNDER THIS: [Slow. The. F**k. Down.](https://codemanship.wordpress.com/2026/05/10/slow-the-fk-down/)

---

#### Thoughts On Slowing The F**k Down

Mario Zechner, the VERY SAME cutthroat quoted at AI Engineer Europe, descendin' into the murky depths to explain *why* agentic coding be smashin' everything to splinters! THE CORE REVELATION, YE BLIND MOLLUSKS: HUMANS BE BOTTLENECKS, AND THAT BE A FEATURE, NOT A BUG! A mortal fleshbag can only inject so many tiny booboos per day — the pain creeps in slow, the brain adapts, the fingers learn caution. But yer agents? THEY HAVE NO LIMITS! They spew forth harmless-looking little errors at industrial scale, and EVERY SINGLE ONE seems innocent when ye squint at it in isolation!

> "A human makes the same error a few times. Eventually they learn not to make it again. An agent has no such learning ability. It will continue making the same errors over and over again."

And HERE be the dagger twisted between yer shoulder blades while ye sleep — agents NEVER see each other's runs! Every decision gets made LOCALLY, in glorious isolation! Code duplication like a plague of rats! Abstractions stacked on abstractions for no discernible reason other than the agent saw some over-engineered enterprise garbage in its training data! A MAGNIFICENT SHIT-FLOWER OF COMPLEXITY blooming in WEEKS — WEEKS, I TELL YE! — that took enterprise codebases YEARS of committee meetings and PowerPoint decks to cultivate! PLUNDER THIS: [Thoughts on slowing the fuck down](https://mariozechner.at/posts/2026-03-25-thoughts-on-slowing-the-fuck-down)

---

#### Code Is Free, Technical Debt Isn't

Field dispatch from AI Engineer Europe in London, relayed by the fine fiends at Arize AI! The most cutthroat minds on stage ALL converged on the same stinkin' truth like sharks smellin' blood: QUALITY BE THE WORK NOW! Code generation has blasted past our pitiful ability to verify it, and everyone's flailin' like rats on a burning plank, squeakin' about "velocity" while the ship goes down!

Key plunder from the conference floor, etched in whalebone:

- "Review can't keep up with generation" — the ratio of producers to reviewers be so broken ye might as well be askin' ONE sailor to inspect the work of FIVE THOUSAND!
- "Agents don't feel pain" — humans write paranoid, defensive code because shippin' a bug HURTS, and the agent be home drinkin' grog while YOU explain to the CEO why production is on fire!
- "Removing friction removes HITL" — THAT FRICTION YE KEEP ELIMINATIN'? THAT WAS THE ENTIRE POINT, YE GIBBERING FOOL! The friction WAS the human-in-the-loop!

> "Bad code is the most expensive it's ever been." — Matt Pocock

And Sarah Chieng from Cerebras delivered a truth that should make every engineering manager soil their breeches: code bein' generated at **1,200 TOKENS PER SECOND** means "at that speed, ye can't watch 10 agents at once, and ye don't need to." BUT — and this be the crucial rejoinder — that means verification must become free as well! Test suites! Linting! Pre-commit hooks! Diff reviews! Browser-based QA! NO! MORE! EXCUSES! PLUNDER THIS: [Code is free, technical debt isn't](https://arize.com/blog/code-is-free-technical-debt-isnt-notes-from-ai-engineer-europe/)

---

#### The AI-Ready Software Developer

Codemanship's 22-PART SAGA of a guide to actually extractin' treasure from the code-generatin' firehose instead of simply drownin' in it! The entire gospel, carved onto a single waterlogged plank:

> "The key to being effective with AI coding assistants is being effective WITHOUT them."

Only crews who were already sailin' tight and shipshape see any actual benefit from these tools! Think ye can optimize a NON-bottleneck in a system riddled with REAL bottlenecks? THAT JUST MAKES THE REAL BOTTLENECKS WORSE, YE DAFT BARNACLE! This be yer guide to AI-readiness, and it has absolutely NOTHIN' to do with AI and EVERY LAST THING to do with disciplined software craftsmanship! PLUNDER THIS: [The AI-Ready Software Developer Index](https://codemanship.wordpress.com/2025/10/30/the-ai-ready-software-developer-index/)

---

#### Vibe Coding: A Cautionary Tail

The k10s devlog served as guinea pig — vibe-codin' an entire Kubernetes TUI over 7 months! 234 commits! ~30 weekends! ALL of it AI-assisted! AND HE ARCHIVED THE WHOLE CURSED THING! Flung it into the abyss like a sack of unwanted kittens! Now he's rebuildin' from scratch in Rust, doin' the design work with his own TWO HANDS before a single line of AI code touches the repo! The verdict from the smoking wreckage? AI writes FEATURES, not ARCHITECTURE! Let it steer without constraints and the wreckage multiplies! And the CRUELEST part? The velocity makes ye feel like a GOD right up until the exact moment everything collapses simultaneously, and ye realize the entire codebase is one 1690-line struct called `Model` with 110 switch/case branches!

> "AI gravitates toward single-struct-holds-everything because it satisfies the immediate prompt with minimal ceremony."

PLUNDER THIS: [I'm going back to writing code by hand](https://blog.k10s.dev/im-going-back-to-writing-code-by-hand/)

---

### Cluster II: "TOKENMAXXING BE PURE CARGO CULTIN'!"

*I have watched captains count barnacles on their hulls while steering blind into maelstroms! I have seen navigators worship driftwood idols while their charts turned to pulp! But NEVER — in ALL my centuries of undeath — have I witnessed a metric as STAGGERINGLY, CATASTROPHICALLY STUPID as counting tokens! These articles be the flogging these charlatans deserve!*

#### Tokenmaxxing on Performance Reviews Will Backfire

Kyle & Co deliverin' a flensing that'll leave scars! Tokenmaxxing is merely "lines of code" dressed up in a venture-backed hoodie with a slick pitch deck! Meta — those absolute goblins — built an INTERNAL LEADERBOARD rankin' ALL 85,000 employees by token consumption like some dystopian high-score table! Jensen Huang — the man who SELLS THE TOKENS — leaned into the All-In microphones and declared that if a $500K engineer don't consume at least $250K of tokens, he'd be "DEEPLY ALARMED"! And now the question's slitherin' through HR departments worldwide: should token usage appear on IC performance reviews?!

AND HERE BE THE SCORCHING IRONY — the loudest bellows pushin' tokenmaxxing COME FROM THE VERY FIENDS WHO SELL THE TOKENS! Jensen! Altman! Amodei! Draw yer own conclusions, or let me draw 'em for ye: they want ye countin' the nails while they sell ye the hammer!

Receipts from the bloody battlefield: GitClear found AI users produced **9.4x MORE CODE CHURN**! Faros AI reported churn up **861%**! Jellyfish, peerin' at 7,548 engineers, found the fattest token budgets produced TWICE the throughput at TEN TIMES the cost! TWICE! THE THROUGHPUT! AT TEN TIMES! THE COST! Those numbers should be INVERTED, ye innumerate plank-walkers! Twice the output at ten times the price ain't productivity — it's a BONFIRE OF CASH with a PowerPoint wrapped around it!

> "Tokens are lines of code, disguised in a new startup hoodie. Easy to measure. Easy to game. Completely uncorrelated with the thing that actually matters."

PLUNDER THIS: [Tokenmaxxing on Performance Reviews Will Backfire](https://kyleandco.com/tokenmaxxing-performance-reviews/)

---

### Cluster III: "BUILDIN' THE SHIP WHILE SAILIN' IT!"

*Fer when ye actually need to DO the agentic sorcery without summonin' a demon that eats yer production database and cackles!*

#### Docker Sandboxes: A Deep Dive on Isolatin' AI Agents

EVERY AGENT NEEDS ITS OWN ISLAND or one rogue `rm -rf` turns yer entire fleet into matchsticks and ye'll be doggy-paddlin' home through shark-infested waters! This Docker Captain charted the ENTIRE archipelago of sandboxin' approaches so ye don't have to discover 'em through catastrophe:

- **Chroot** — the ancient way, as leaky as a sieve, breaks apart if the process so much as WHISPERS "root"!
- **systemd-nspawn** — chroot after consuming a barrel of steroids, process AND network isolation, but LUNIX ONLY, and who among ye lily-livered developers actually runs Linux on their daily driver? NOBODY, that's who!
- **Docker containers** — looks gorgeous on the brochure until ye need Docker-IN-Docker, which demands `--privileged` mode, which is functionally identical to leavin' the fortress doors wide open and postin' the key on Reddit!
- **MicroVMs** — the GOLDEN MEAN! VM-level fortification with container-level boot times! All hail Firecracker, the tiny explosive that changed everything!
- **gVisor** — user-space kernel swallowin' every syscall whole, fiendishly clever, but ONCE AGAIN, Linux-only, as if the entire industry hasn't moved on!
- **Docker Sandbox** — THE FULL MONTE! MicroVMs spanin' Mac, Windows, AND Linux! Per-sandbox Docker Engines! Network isolation! Same Docker incantations ye already know!

The comparison table don't lie, and neither do I: traditional VMs give ye isolation but boot in MINUTES. Containers boot in MILLISECONDS but share a kernel like strangers sharin' a toothbrush. Docker MicroVMs give ye STRONG ISOLATION in SECONDS. The math ain't complicated, even for ye! PLUNDER THIS: [Comparing Sandboxing Approaches for AI Agents](https://www.docker.com/blog/comparing-sandboxing-approaches-ai-agents/)

---

#### Taming Non-Determinism: From Logic Gates to LLMs

Leandro Proença chartin' the ENTIRE HISTORY of determinism in computing like he's navigatin' the unexplored Atlantic with nothin' but a sextant and spite! LOGIC GATES ARE NOT DETERMINISTIC AT THE PHYSICS LEVEL! Electrons couldn't give a SINGLE damn about Boolean algebra! Voltage thresholds? That's ENGINEERING, not physics — a GENTLEMAN'S AGREEMENT carved into silicon! The CPU clock? A SAMPLING STRATEGY disguised as truth! Metastability — when a flip-flop freezes in existential crisis, unable to choose between ZERO and ONE — that's the raw non-determinism of the physical universe BLEEDIN' through our tidy abstractions like ghostly ichor!

AND THEN — because apparently the man has never heard of doing things by halves — HE BUILDS AN ENTIRE CPU FROM ARTIFICIAL NEURAL NETWORKS TRAINED TO MIMIC LOGIC GATES! IN RUST! Trained ANNs! Composed into gates! Composed into adders! Composed into a FULL GODFORSAKEN PROCESSOR! And THEN he makes the leap to LLMs — which are non-deterministic in a WAY DEEPER and WAY MORE STUBBORN fashion than anything that came before! What serves as the clock for an agent? Where's the timing analysis? IT DOESN'T EXIST! Not yet! We're sailin' blind!

> "Non-determinism doesn't go away. It never has. We just keep finding better ways to push it where it can't hurt us."

PLUNDER THIS: [Taming non-determinism: from logic gates to LLMs](https://leandronsp.com/articles/taming-non-determinism-from-logic-gates-to-llms)

---

#### Gas City: Welcome to the Light Factory

STEVE YEGGE — the man, the myth, the walking beard — singin' hosannas to Gas City v1.0! 'Tis the evolution of Gas Town into a proper SDK for constructin' yer own DARK FACTORIES! The premise, delivered with appropriate dramatic flourish: deploy crews of collaboratin' agents in ANY topology that tickles yer fancy, all backed by a git-versioned Dolt database so EVERY! SINGLE! ACTION! be logged, auditable, and recoverable when — and I do mean WHEN, not IF — the whole contraption catches fire!

The insight that'll make yer CFO weep salted tears into their artisanal rum: SaaS is EXTRACTIVE, a leech on yer company's very soul! It swells to become the superset of ALL features for ALL customers, while yer humble crew uses a measly 20% and subsidizes the other 80% for complete strangers! Build the 20% ye ACTUALLY need with Gas City and a swarm of agents, and that capability stays IN-HOUSE as a compounding treasure chest instead of leakin' out as recurring rent, month after month after cursed month!

> "A small team of three to five human engineers running Gas City packs can credibly replace seven-figure SaaS bills."

PLUNDER THIS: [Welcome to Gas City](https://steve-yegge.medium.com/welcome-to-gas-city-57f564bb3607)

---

#### Local AI Inference: DS4 and the New Frontier

ANTIREZ — YES, *THE* ANTIREZ, THE ARCHITECT OF REDIS, THE MAN WHO GAVE THE INTERNET ITS MEMORY — droppin' DS4 (DwarfStar 4) into the local AI scene like a CANNONBALL through a stained-glass window! This be a single-model integration focused local AI experience wrapped around DeepSeek v4 Flash! He labored FOURTEEN HOURS A DAY for an ENTIRE WEEK to birth this beast! FOUR! TEEN! HOURS! EVERY! SINGLE! DAY! While ye were sleepin', antirez was CODING!

> "It is the first time since I play with local inference that I find myself using a local model for serious stuff that I would normally ask to Claude / GPT."

DeepSeek v4 Flash with a 2/8-bit quant recipe hums along on 96-128GB of RAM! Fast enough to ACTUALLY USE for REAL WORK! This be the watershed moment fer anyone who's been squintin' at local inference for years, waitin' for it to stop bein' a toy and start bein' a TOOL! On the horizon: quality benchmarks, a coding agent baked into the project, and DISTRIBUTED INFERENCE spread across multiple machines like a ghost fleet! PLUNDER THIS: [A few words on DS4](https://antirez.com/news/165)

---

#### Goose: Open Source AI Agent

Goose be an extensible, open source AI agent that lives RIGHT ON YER MACHINE and chains itself to the world through MCP! Multi-provider — OpenAI, Anthropic, Google, Meta, Ollama, whatever dark god of inference ye prefer! Cross-platform! MIT licensed! Community-driven! Picture Claude Code's scrappy dockside cousin who lives in the same cramped apartment but somehow always has fresher fish! PLUNDER THIS: [Goose docs](https://goose-docs.ai/)

---

#### Interrogatory LLM: Let the AI Ask Ye Questions

MARTIN FOWLER — the grand vizier of software architecture HIMSELF — describin' a technique most devious: let the LLM INTERROGATE the human to construct context for a task, ONE! QUESTION! AT! A! TIME! Instead of ye writin' pages of tedious context like some medieval scribe, the LLM GRILLS ye and assembles the context from yer answers! Particularly useful for souls who find long-form writing about as pleasant as having their fingernails extracted by a bored bosun!

> "People often find reviewing hard, so a conversation with an LLM might be more fruitful, particularly if the document isn't well-written."

PLUNDER THIS: [Interrogatory LLM](https://martinfowler.com/bliki/InterrogatoryLLM.html)

---

### Cluster IV: "WISDOM FROM THE OLD SEA DOGS!"

*The ancient mariners of our trade — barnacled, scarred, and STILL STANDIN' — share their hard-won spoils! SIT DOWN, SHUT UP, AND LISTEN, ye wet-eared cabin boys!*

#### Hey, N00b, We Didn't Hire Ye to Complete Tasks

KENT BECK — THE PROPHET OF EXTREME PROGRAMMING, THE MAN WHO TAUGHT THE WORLD TO TEST FIRST — hurls truth like grapeshot at the tender faces of junior engineers! NOBODY! CARES! HOW! MANY! TASKS! YE! CLOSE! Yer productivity is GARBAGE by senior standards and THEY BLOODY WELL KNOW IT! They're not payin' for yer sad little output — they're payin' the OPTION PREMIUM on the engineer ye MIGHT BECOME! What they're truly huntin' is the FIRST DERIVATIVE! Are ye an A — a force of nature who makes everyone better? A B — a solid hand who'll mature with time? Or a C — a lost cause who won't last the year?!

The A signals — the deeds that make crusty old salts sit up and take notice:
- Convince 'em the task NEEDN'T BE DONE AT ALL!
- Mine the data and surface the 10% that delivers 90% of the prize!
- Implement it SEVERAL ways, not just the first one that compiles!
- Unearth a superior design and SIMPLIFY the surrounding code while ye're at it!
- Submit a STRING of small diffs, not one bloated horror!
- Write up what ye learned so it's useful and persuasive!
- Be a reviewer that other engineers actually WANT feedback from!

> "We are paying your salary now as the option premium on the engineer you are going to become."

PLUNDER THIS: [Hey, N00b, We Didn't Hire You to Complete Tasks](https://tidyfirst.substack.com/p/hey-n00b-we-didnt-hire-you-to-complete)

---

#### 3-2-1: James Clear on Self-Image, Luck, and Mediocre Problems

Three gleaming pearls from the MASTER OF ATOMIC HABITS, each one worth more than the entire contents of a Spanish treasure galleon:

1. "You will rarely outperform your self-image." — THE BELIEF SYSTEM BE THE CEILING, YE SWABS! Picture yerself as mediocre? MEDIOCRITY IT SHALL BE! Picture yerself as the terror of the seven seas? WELL! At the very least ye won't undersell yerself at the negotiation table!

2. "Luck flows through people and travels by conversation." — Circle with the same sorry crew, discover the same sorry opportunities! Stagger into DIFFERENT taverns, start meeting DIFFERENT rogues, and suddenly the treasure map looks entirely different!

3. "Small problems often threaten our quality of life more than big ones." — A job that's HELL? Ye MUTINY! A job that's merely... *unsatisfying*? Ye GRIND through it for years while yer soul slowly erodes! The MEDIOCRE problems be the REAL buccaneers plunderin' yer existence while ye keep starin' at the horizon waitin' for a dramatic crisis that never arrives!

PLUNDER THIS: [3-2-1: May 14, 2026](https://jamesclear.com/3-2-1/may-14-2026)

---

#### TypeScript, C# and Turbo Pascal with Anders Hejlsberg

GERGELY OROSZ, captain of the Pragmatic Engineer, sat across from ONE OF THE MOST INFLUENTIAL LANGUAGE DESIGNERS TO EVER INHALE OXYGEN! Turbo Pascal! Delphi! C#! TypeScript! This man's spectral fingerprints stain HALF THE PROGRAMMING LANGUAGES ye use without a second thought! Gems pried from the interview:

- C# might not EXIST if Sun hadn't sued Microsoft into a corner!
- The original C# team numbered SIX PITIFUL SOULS meeting three times weekly for two hours each!
- TypeScript didn't win because of language design — it won because of OPEN DEVELOPMENT ON GITHUB!
- AI's competence in a language correlates almost perfectly with HOW MUCH OF THAT LANGUAGE CLUTTERS THE INTERNET!
- AI remains DOGSHIT at writin' COMPILERS — cannot grasp the panoramic view of how types, symbols, binding, and parsing all intertwine like serpents in a pit!

> "Designing a programming language is a 10-year play. Version one is great, but has all sorts of issues. Version two is not much better. It's not until version three that it really starts to be great."

PLUNDER THIS: [TypeScript, C# and Turbo Pascal with Anders Hejlsberg](https://newsletter.pragmaticengineer.com/p/typescript-c-and-turbo-pascal-with)

---

#### Anthropic x Gates Foundation: $200M Partnership

ACTUAL GOOD NEWS FROM THE SEVEN SEAS, FOR ONCE! Anthropic be claspin' hands with the Gates Foundation on a $200M commitment across four years, targeting global health, life sciences, education, and economic mobility! They're chasin' vaccines for polio, HPV, and preeclampsia! Buildin' health intelligence dashboards for governments in low- and middle-income countries! Craftin' educational tools for K-12 children across three continents! And developin' AI-powered agricultural tools for the near two billion souls whose livelihoods depend on smallholder farming!

The Gates Foundation brings decades of on-the-ground expertise! Anthropic brings the models! Together they might actually MOVE THE NEEDLE on diseases that primarily afflict people who cannot afford the admission price! THIS be the kind of AI deployment that deserves a toast, not a walk off the plank! PLUNDER THIS: [Anthropic forms $200 million partnership with the Gates Foundation](https://www.anthropic.com/news/gates-foundation-partnership)

---

#### Clawdmeter: A Hardware Tokenmaxxing Dashboard

AND JUST WHEN YE THINK THE TOKENMAXXING CULT CANNOT SINK ANY LOWER — SOME MAGNIFICENT MADMAN BUILT A PHYSICAL BOX FOR YER DESKTOP! It connects via Bluetooth to yer laptop! It displays yer Claude Code token usage on a tiny AMOLED screen! A PIXEL-ART CLAWD SPRITE DANCES FASTER THE MORE TOKENS YE INCINERATE! The creator — a software developer from Reykjavik who'd NEVER touched embedded devices before — built the entire thing with CLAUDE'S HELP in a few days! EIGHT HUNDRED GitHub stars in four days! Someone on Reddit called it "A HARDWARE TAMAGOTCHI FOR MY CONTEXT WINDOW" and I'll be damned if that's not the most poetically accurate description of ANYTHING shipped this cursed year! PLUNDER THIS: [Clawdmeter turns your Claude Code usage stats into a tiny desktop dashboard](https://techcrunch.com/2026/05/14/clawdmeter-turns-your-claude-code-usage-stats-into-a-tiny-desktop-dashboard/)

---

#### Platformer: Are the Twitter Clones in Trouble?

Casey Newton pickin' through the smolderin' wreckage of the social media clone wars like a vulture with a journalism degree! Threads — Meta's sad little experiment — peaked in October 2024 right before the US election and has since PLUMMETED **61%** in daily active users! SIXTY! ONE! PERCENT! Bluesky hasn't been growin' for months! X flat to down! The ENTIRE CATEGORY of text-based social networks appears to be sinkin' in unison like a synchronized swimming team composed entirely of anchors!

> "Text-based social networks as a category don't appear to be growing, either."

PLUNDER THIS: [Are the Twitter clones in trouble?](https://www.platformer.news/threads-bluesky-x-usage-utopia-twitter-clones/)

---

#### The Pulse: Did Capacity Shortages Turn Anthropic Hostile to Devs?

GERGELY OROSZ reconstructin' the timeline of Anthropic's recent villain arc! Claude Code silently NERFED! Corporate accounts BANNED without warning! Growth experiments so BIZARRE they read like a fever dream! And then — OUT OF NOWHERE — SpaceX/xAI rents the entirety of Colossus 1 (TWO HUNDRED AND TWENTY THOUSAND NVIDIA GPUS) to Anthropic! Claude Code limits DOUBLED overnight! Peak hour restrictions VANISHED! API rate limits SKYROCKETED! ALL IN THE SAME GLORIOUS ANNOUNCEMENT!

THE PUNCHLINE: Anthropic planned for 10x growth and received 80x instead! They were runnin' the entire operation on fumes and vapor, and every developer's Claude experience suffered for it!

> "We originally planned for 10x growth, and we've seen something more like 80x growth in revenue and usage."

PLUNDER THIS: [The Pulse: Did capacity shortages turn Anthropic hostile to devs?](https://newsletter.pragmaticengineer.com/p/the-pulse-did-capacity-shortages-0e6)

---

#### Thinkies World Congress II

Kent Beck summonin' the faithful to Thinkies World Congress II on May 20th, 0800-1100 Pacific time! Half price with the code "BreakTheStuck" — which be both a discount and the entire philosophical foundation of the event! Come learn about Thinkies! Apply 'em! Share what ye discover! And catch the closing panel on CREATIVITY! PLUNDER THIS: [Thinkies World Congress II: May 20, 2026](https://tidyfirst.substack.com/p/thinkies-world-congress-ii-may-20)

---

### Creative Commons Zero v1.0

And for those generous souls who wish to cast their treasure maps into the public domain with NO strings, NO anchors, NO cursed fine print: CC0 be the incantation ye seek! Waives ALL copyright interest! Dedicates the work to the WORLDWIDE PUBLIC DOMAIN! As free as a ghost on the wind! PLUNDER THIS: [Creative Commons Zero v1.0 Universal](https://choosealicense.com/licenses/cc0-1.0/)

---

### VIBE SECTION: THESE LINKS BE RESTIN' AT DAVY JONES' LOCKER!

*AHOY! The following cursed URLs defied our summons — either deleted by their cowardly authors, protected behind walls of digital sorcery, or swallowed whole by the kraken of the timeline! We present these fabrications based on PURE PIRATE CLAIRVOYANCE and aggressive URL-staring! EVERYTHING THAT FOLLOWS BE PURE FABRICATION — LESS RELIABLE THAN A DRUNK PARROT'S TESTIMONY!*

---

#### VIBE: @SentientAGI (X/Twitter)

*Tweets from the SentientAGI handle — some self-appointed oracle of the AGI apocalypse/utopia, depending on which way the engagement winds be blowin'! Based on nothing but the handle and raw intuition: this be yet another thread proclaimin' that the machines have achieved consciousness, or that they haven't, or that they're about to, or that we're all fools for thinkin' they ever will! Bold declarations with precisely zero evidence! Heavy quote-tweet bait! Probably got ratio'd into the next dimension by someone who actually works in ML research and pointed out that the thread author is also, ironically, running on a language model!*

[Attempt to view](https://x.com/SentientAGI/status/2046967422004154739) — *(THIS LINK BE DECEASED! CONTENTS BE FABRICATED!)*

---

#### VIBE: @dhh (X/Twitter)

*Tweets from DAVID HEINEMEIER HANSSON — Ruby on Rails warlord, Basecamp sovereign, and the internet's most RELENTLESSLY CONSISTENT contrarian voice! If DHH be tweetin' in May 2026, I'd wager me ghostly galleon it concerns one of three sacred topics: (1) the AI hype machine be a house of cards and he's holdin' the matches, (2) yer startup should stop bein' run like a growth-hacking pyramid scheme, or (3) Basecamp is doin' perfectly fine without any of this AI tomfoolery, thank ye very much! Probably a multi-tweet thread written in ALL CAPS with at least one reference to a tweet from 2017 that turned out to be CORRECT, and he'd like everyone to remember that. Comments disabled, ratio impossible, DHH unbothered, moisturized, thriving in his lane!*

[Attempt to view](https://x.com/dhh/status/2055261064284033386) — *(THIS LINK BE DECEASED! CONTENTS BE FABRICATED!)*

---

## THAT BE THE LOT, YE MAGNIFICENT WRETCHES!

*There ye have it — a cargo hold BURSTIN' with reading material to set yer Monday ablaze! Me? I'm skippin' the tokenmaxxin' drivel entirely and divin' STRAIGHT into the "slow the f**k down" cluster! Seems half the internet is FINALLY catchin' up to what we spectral pirates have been screamin' from the ghostly riggin' all along: THE CODE AIN'T THE PRODUCT! The MAINTAINABLE code ain't the product! The code that the NEXT POOR BASTARD can UNDERSTAND — THAT be the product!*

*Now WEIGH ANCHOR and READ, ye bilge-drinking scallywags — OR I'LL HAUNT YER CI PIPELINE FOREVER!*

{{< /clickwall >}}
