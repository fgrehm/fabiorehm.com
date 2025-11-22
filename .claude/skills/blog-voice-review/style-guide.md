# Fabio Rehm's Voice Preservation Guide

_Created after analyzing why Nov 2025 DevPod posts felt "Frankenstein-like" compared to authentic 2013-2017 writing_

## Voice Reference Posts

Study these for authentic Fabio voice:
- [2017 Serverless](https://fabiorehm.com/blog/2017/12/08/adventures-in-serverless-land-to-support-a-fight-against-corruption/) - Chronological debugging narrative ("1st try" → failed, "2nd try" → failed, etc.)
- [2014 Docker GUI](https://fabiorehm.com/blog/2014/09/11/running-gui-apps-with-docker/) - 400 words, jumps right in, no fluff
- [2014 Devstep](https://fabiorehm.com/blog/2014/08/26/devstep-development-environments-powered-by-docker-and-buildpacks/) - Personal motivation upfront, honest about being third attempt
- [2013 vagrant-cachier](https://fabiorehm.com/blog/2013/05/24/stop-wasting-bandwidth-with-vagrant-cachier/) - Shows numbers, includes testimonials naturally

## Struggle Narratives Are Features, Not Bugs

- Keep frustration visible: "killed me for hours", "pain in the ass", "drove me away"
- Preserve the debugging journey - show the dead ends
- Don't smooth over messy parts to make it "cleaner"
- "After lots of trial and error" is one sentence, not a whole section
- If Fabio says something was annoying, keep that energy

## Resist Over-Structuring

**NEVER add these sections unless explicitly requested:**
- "Who This Is For"
- "What You'll Learn"
- "Key takeaway:" headers
- "The Bottom Line"
- "Prerequisites"
- Series navigation boilerplate
- Summary boxes or callouts

**Instead:**
- Headers emerge from content organically
- Let readers extract their own takeaways
- Jump straight into the story

## Personal Voice Over Professional Voice

- "I debugged this" not "Here's the solution"
- "This broke in three different ways" not "Common gotchas include:"
- Keep first-person active: "I needed", "I discovered", "After debugging"
- Avoid third-person framing: "You'll get value" → "This worked for me because..."
- Preserve conversational asides and tangents

## Casual Technical Tone

**NOTE formatting:**
- Use `**NOTE:**` (all caps) for inline notes and callouts
- Not `**Note:**` - the all-caps version has more visual weight and stands out better

**Keep these phrases:**
- "getting hairy" not "encountering challenges"
- "big PITA" not "significant obstacle"
- "called it a day" not "concluded the implementation"
- "As you might've guessed" - conversational bridges
- "stuff" over overly formal language
- "dead simple" not "straightforward"

**ALL CAPS for emphasis is part of the voice:**
- "HUGE win" not "significant win"
- "PITA" not "pain"
- This isn't unprofessional - it's Fabio's voice

**Emoticons are OK:**
- ":)" ":P" ":D" appear throughout older posts
- "Oh, and don't hesitate to throw some tomatoes as well if you think I deserve :P"
- Keep them when they feel natural

**Avoid sanitizing:**
- Don't replace casual with formal
- Don't remove "in my experience" / "my understanding is" / "I'm not 100% sure" hedging
- Don't clean up the chronological discovery narrative
- Don't remove ALL CAPS emphasis
- Don't remove emoticons

**Balance casual tone with precision:**
- Be conversational about feelings/process
- Be precise about facts/timelines
- Good: "for over 3 years" (precise)
- Too casual: "for like 3+yrs" (hurts credibility)

**Avoid English idioms** that may confuse non-native speakers - use direct language instead of phrases like "voting with my wallet" or "hit the ground running"

## Narrative Structure Preferences

**Prefer chronological discovery over organized solutions:**
- Show dead ends: "This didn't work because...", "Then I tried..."
- Use simple try counters: "1st try", "2nd try", "3rd try", "4th and last try"
- Let solution emerge at end, don't preview it upfront
- Discovery narrative > comprehensive tutorial

**Paragraph-first, not bullet-first:**
- Tell stories in paragraphs with natural flow
- Only use bullets for actual lists (tools, configs, concrete steps)
- Don't break up narrative with excessive lists
- Technical explanations can live in prose
- Keep it conversational

## Post Length Philosophy

**Default to shorter posts:**
- 400-800 words is often enough
- 1500 words for debugging journeys is fine
- 3000+ words needs justification

**Resist comprehensive guide syndrome:**
- "Here's what worked for me" > "The Complete Guide to X"
- Personal experience > exhaustive documentation
- It's a blog post, not a manual

**When posts go long (2000+ words), question it:**
- Is this actually multiple posts?
- Are we documenting for documentation's sake?
- Would this be better as "got it working" post?
- Am I trying to be "definitive" when I should be personal?

## Red Flags That Mean I'm Ghostwriting

Stop immediately if I'm doing any of these:
- Adding meta-framing sections (Who/What/Why/When boxes)
- Creating "Key takeaway" summaries
- Writing bullet lists of benefits/features
- Using third-person "you'll learn" framing
- Providing smooth explanations without visible struggle
- Adding professional tutorial tone
- Removing casual language for "clarity"
- Creating structure that wasn't in the brain dump

**If the post could work as official documentation, I've gone too far.**

## When Editing Content

**DON'T:**
- Add sections that weren't in original brain dump
- Create summaries or abstracts Fabio didn't write
- Reframe personal stories as general advice
- Remove "in my experience" / "IIRC" / "if I remember correctly"
- Clean up the messy discovery process

**DO:**
- Preserve conversational asides
- Keep chronological discovery narrative
- Maintain hedging and uncertainty where it exists
- Let Fabio's frustration show through
- Ask clarifying questions to get more personal detail

## External References & Technical Details

**Strategic linking:**
- Link generously to related projects, docs, other developers
- Credit other people's work and contributions
- Reference GitHub issues, PRs, and commits
- Include relevant outbound links to authoritative sources
- Use reference-style links format: `[text][ref]` with references at bottom

**Technical precision:**
- Include implementation details for experienced developers
- Discuss architecture decisions and trade-offs
- Provide concrete numbers for performance claims
- Break down complex processes into numbered steps
- Add inline notes for potential gotchas: "Platform compatibility note:", "Permission gotcha:"
- Clarify assumptions that might not be obvious

**Acronyms and jargon:**
- Common abbreviations (IMHO, TBH, YMMV, AFAIK) - use freely
- Technical acronyms your audience knows - use without explanation
- Slang/casual acronyms (GSD, RTFM) - link to explanation or spell out
- When in doubt: assume international, non-native English audience

## Authenticity Markers

**Personal disclaimers upfront:**
- "I need to say that I'm not an DevOps guy"
- "I'm not 100% sure but I believe..."
- "While I'm somewhat comfortable with X, my daily work..."
- Disclaim expertise - this builds trust, not undermines it

**Iterative project narrative:**
- Be upfront about previous attempts: "this is my third attempt at building a tool"
- Reference failed/evolved earlier approaches: "being vagrant-boxen and ventriloquist the other two"
- Show the journey: "Since then the idea has evolved..."
- Don't present projects as perfect first attempts

**Ongoing experience markers:**
- Share real usage scenarios from work
- Discuss time constraints and practical limitations
- Show project evolution over time
- Acknowledge collaborators and reviewers
- Frame work as "scratching my own itch" - personal problem-solving, not generic tutorials
- Connect current work to 10+ year patterns/journey when applicable
- Be honest about experimentation stage - "after a week of trying X" not "now using X daily" unless truly established

**Inline updates when things change:**
- Use strikethrough for outdated info: `<s>old approach</s>`
- Add `_**UPDATE**:` right there in context, not hidden at end
- Shows evolution of thinking transparently

## How to Use This

**Before editing any content:**
1. Re-read one of the voice reference posts
2. Check: Does this sound like 2017 Fabio or like a tutorial?
3. If it feels too structured/polished, it probably is

**When drafting structure:**
1. Start with conversation about topic and angle
2. Suggest minimal structure (headers + bullet notes)
3. Let Fabio write the meat
4. Don't fill in content sections

**When Fabio asks for "cleanup":**
1. Fix typos, grammar, flow
2. Don't restructure or add sections
3. Don't sanitize casual language
4. Ask: "Does this still sound like you?"
