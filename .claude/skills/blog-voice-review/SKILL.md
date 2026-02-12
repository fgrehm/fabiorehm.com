---
name: blog-voice-review
description: |
  Review blog content for authentic voice and tone. Checks if content sounds like Fabio's conversational, honest technical writing style.
  Trigger phrases: "voice", "voice review", "tone", "sounds like me", "authentic", "check voice", "voice check"
allowed-tools: Read
---

# Voice & Tone Review

## Quick Checks
- First person? ("I've been", "my experience")
- Conversational? (like talking to a colleague)
- Honest about limitations?
- Personal experience vs generic advice?
- Any English idioms that confuse non-native speakers?

## Red Flags
- Overly formal language
- Generic examples ("Let's say you have...")
- Claims without personal context
- Marketing speak
- Phrases like "leverage", "utilize" instead of "use"

## Title & Clickbait Check
Watch for clickbait patterns in titles:
- Excessive superlatives ("worst", "best", "ultimate")
- Manufactured urgency or drama
- Promising more than the content delivers
- "You won't believe..." or similar hooks

**Good titles:**
- Honest about scope ("one of my bad habits" not "my worst habit")
- Clear about what the post covers
- Personal and specific
- No artificial drama

## Voice Guidelines

For comprehensive voice patterns, see reference files:
- **Core voice characteristics**: `references/voice-markers.md` - Read this for struggle narratives, casual tone, personal voice patterns
- **Authenticity patterns**: `references/authenticity-patterns.md` - Read this for disclaimers, project narratives, inline updates
- **Technical writing**: `references/technical-writing.md` - Read this for external references, precision, acronym usage

**Quick reference:**
- First person ("I've been", "my experience")
- Conversational (like talking to a colleague)
- Honest about limitations
- Personal experience vs generic advice
- No English idioms that confuse non-native speakers
- Keep struggle visible - "killed me for hours", "pain in the ass"
- ALL CAPS for emphasis is OK ("HUGE", "PITA")
- Emoticons are OK (":)", ":P", ":D")

## Process

1. Read the content
2. Check against quick reference above
3. For deeper patterns, read relevant reference file:
   - Voice issues? → `references/voice-markers.md`
   - Authenticity concerns? → `references/authenticity-patterns.md`
   - Technical content? → `references/technical-writing.md`
4. Flag issues with brief explanation
5. Don't rewrite - let author fix in their voice

## Predictive Gap Detection (Optional)

After voice review passes, offer to identify potential gaps:

**When to use:**
- Voice review found no major issues
- Post seems ready but you want to catch blind spots
- User asks for a final check

**Format:**
```
**Predicted Reader Questions:**

Based on what you've written, I think readers might wonder:
1. [Question about context X that's mentioned but not explained]
2. [Question about why you didn't mention Y tool]
3. [Question about how this applies to scenario Z]

Are these worth addressing? Or outside the scope you intended?
```

**Why this helps:**
- Catches gaps in experience-sharing before publishing
- Identifies assumptions that might not be obvious
- Surfaces questions from a fresh reader perspective

**Ghostwriting boundary:** Identifies gaps, doesn't fill them. User decides if the questions are worth addressing.

## Response Format
Keep it conversational:

```
This section feels generic - you mention "users might want" but where's YOUR experience? 

Also caught an idiom: "hit the ground running" might confuse non-native speakers. Try more direct language.

The technical explanation is great though - clear and accessible.
```
