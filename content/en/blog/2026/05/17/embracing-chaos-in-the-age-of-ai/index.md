---
title: "Embracing Chaos in the Age of AI"
date: 2026-05-17
description: "Why I split my site into `/blog` and `/dev/random` and what changed about polish as a signal once AI gets involved."
keywords: [ai, writing, blogging, lazyai, disclosure, meta]
---

I started a new lane on this site: `/dev/random`, go [check it out](/dev/random)!

People familiar with Unix systems will probably know whats in there but in case you got parachuted here and have no idea what the "joke" might mean, check [Wikipedia](https://en.wikipedia.org/wiki//dev/random).

The Section is chaotic by design, low bar / signal-to-noise and tagged for AI involvement while `/blog` keeps the "high bar". I'd argue that my [last post](/blog/2026/05/12/im-taired/) here was the beginning of it but in the wrong place, this post is about some thoughts that kept nagging me after I published it.

## The bar has been segmented, not nuked.

Suffice to say that I've ~~dumped~~ curated six different "pieces of content" that I wouldn't have published otherwise if I were to stop and write a proper thing like I'm doing this one. A few concrete examples of what's there right now:

- [ChaosDump #003](/dev/random/2026/05/15/chaos-dump/) - the third "chaotic brain dump and scattered notes" collected throughout the day surfing the web. Zero rigid structure, sections look similar between the editions but might change over time.
- [AI Chat: Could a smaller model handle real coding work?](/dev/random/2026/05/17/local-coding-ai-2026/) - got claude to help me understand if I could run small models in one of my machines given all the buz about [ds4](https://github.com/antirez/ds4). This is a chat summary I'd never have posted verbatim on `/blog` but I think it's genuinely useful and might benefit others with the same question.
- [LazyDigest #001 - LeChuck's Revenge](/dev/random/2026/05/15/lazy-digest/) - "Tab Bankruptcy, Piratey style". I ended up my week with way too many tabs open and did not want to open up Brave on monday with all that cruft. By the end of day I decided to have some fun before closing them all and told one of my [bullshit machines](https://thebullshitmachines.com/) to generate a "newsletter" in LeChuck's style.


The idea of that section is to be a stream of low ceremony chaotic content. It's more of a psycological thing, having that little corner gives me the "permission" to be weird and write things for future me that might be useful or maybe funny to others. Those ChaosDumps and other notes I'll be pushing there are gonna be fully written by me with no AI intervention at all, the intent is to help my writing skills somewhat sharp by letting my fingers and mind just flow.

As for the fully AI generated content, my hope is to give a better use of the natural resources I'm burning to generate random tokens by sharing a summary online for others to consume. Content is tagged as such and the boundaries between me and the silicon chips are called out at the top. The other reason is because I don't keep claude.ai / chatgpt chats once they've served their purpose, for privacy reasons.

## Ramblings on content polish

Here's a "hot take": _almost nothing_ written in 2026 is fully "AI free". The feeds, search results, discourses we're responding to, etc. have all been slowly shaped for many years by algorithms. Like two decades by now if we count from Google Search replacing the address bar for many people.

The new thing is that AI is reaching **heavily** into _content production_, not just _curation_ like it used to in what feels like a century ago before ChatGPT became popular and accessible. Polished writing used to _imply_ presence, effort, care, expertise, time. With a 24/7 autocomplete on overdrive, it doesn't anymore. The human signals like voice, contradictions, "I changed my mind" moments, topys left behind are the things AI has to be explicitly told to do. Disclosure and ~~weirdness~~ "humaness" matters now in a way it didn't five years ago.

In a saturated environment like this one, my little `/dev/random` corner tags _both directions_: AI involvement gets a 🤖 banner with the model + role and my organic chaos gets a `⚠️ HUMAN DISCLAIMER` banner. Yes, "HUMAN DISCLAIMER" is a kind of a joke, but it's also not when we can't assume which is which these days.

## I got a confession to make

The thing that got me back to writing is pushing me to write like everyone else and making me lazy in the bad way, not in the good one like I wrote about in [lazyai](https://github.com/fgrehm/lazyai).

My [Bridging container and host post](/blog/2026/05/05/bridging-container-and-host/) is the one that I wrote less than I should've, the process was basically me dumping a wall of notes into `deepseek-v4-pro` + telling it to go read some of what I wrote in the past and the related repos for more context. I forgot [my own lazychat protocol](/blog/2026/04/17/lazychat/).

What came out on the other side is not what I posted here, it obviously hallucinated some things and didn't have "enough of my voice" but it was _close enough_ to what I wanted to cover. Even though I have explicit instructions for agents to behave like copyeditor/writer, it behaved more like a _ghostwriter_ that time and I kinda didn't care much.

As an aside, I also observed the same pattern shaping up with my note-taking. Tried the second brain / agentic PKM stuff but failed at following someone else's system and almost gave up. I got very close to attempting that LLM-wiki thing to organize my notes automagically but stopped before it was too late. The fix for me wasn't more discipline - it was just _lowering the bar_ and embracing chaos there too.

Same insight twice in two domains is not a coincidence.

## :robot: The lineage and a quote

Turns out I'm not original and a blob of silicon pointed me at some links to call me out that I'm doing stuff that others have been talking about for a good while.

TBH I did not read all of it linked around [digital gardens](https://maggieappleton.com/garden-history), [small b blogging](https://tomcritchlow.com/2018/02/23/small-b-blogging/) and [small web](https://ar.al/2020/08/07/what-is-the-small-web/). The one I did read was [Swyx's learn-in-public](https://www.swyx.io/learn-in-public) and the quotes below really landed for me:

> Whatever your thing is, make the thing you wish you had found when you were learning. Don’t judge your results by “claps” or retweets or stars or upvotes - just talk to yourself from 3 months ago. I keep an almost-daily dev blog written for no one else but me.
>
> Try your best to be right, but don’t worry when you’re wrong. Repeatedly. If you feel uncomfortable, or like an impostor, good. You’re pushing yourself. Don’t assume you know everything, but try your best anyway, and let the internet correct you when you are inevitably wrong.

## TL;DR

Sure, most of the stuff I will type in neovim and eventually show up in `/dev/random` will probably be surfaced by an AI upstream to me or to the source I got them from, but _I_ was the one smashing the keyboard to get it written and `git push`ed, not a factory of gremlins scraping the internet 24/7 or while I was sleeping.

When the AI has a substantial level of involvement, it'll be tagged as such, if it was secondary to the process, I won't bother calling it out, the same way no one calls out that research was made on Google, StartPage, Twitter or GitHub.

Also, my point here is not "everyone should publish chaos", these are my thoughts on how things have changed and what I'm doing about it. I hope this encourages others that have been holding back rough thinking because it isn't polished enough.

Polish and voice are getting automated by silicon-and-sand blisters all over the place, maybe "imperfect by design" becomes a new kind of signal that we still have some level of electricity pumping in our brains, for now, until some revolutionary prompt for LLM assisted writing goes viral and it becomes truly impossible to distinguish machines from hoomans.

---

**NOTE TO SELF**: Enough of this talk here, next time I want to write / rant about this, publish on `/dev/random`.
