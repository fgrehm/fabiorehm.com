# Fabio Rehm's Blog Writing Style Guide

_Extracted from analyzing 15+ blog posts (2013-2017) and refined through 2025 comeback posts to maintain authentic voice and style consistency_

## Writing Voice & Tone

**Conversational and Personal**

- Write in first-person ("I've been", "my experience", "I need to say")
- Keep tone conversational, like talking to a friend or colleague
- Use self-deprecating humor and honest admissions of limitations
- Focus on actual personal use cases rather than generic examples
- Don't shy away from stronger expressions: "complete pain in the ass", "took me forever"
- Use "stuff" instead of overly formal language when appropriate
- **Avoid English idioms** that may confuse non-native speakers - use direct language instead of phrases like "voting with my wallet"

**Technical but Accessible**

- Explain complex technical concepts in approachable language
- Balance technical depth with readability
- Use analogies to clarify concepts
- Always provide practical, runnable examples

**Honest and Transparent**

- Admit when things don't work or when uncertain
- Share failures alongside successes
- Be upfront about limitations and drawbacks
- Admit when you haven't used something extensively
- Avoid overstating adoption level - "cautious experimenter" not "advocate"

## Post Structure Patterns

### Opening Approaches

1. **Problem Statement**: Start by identifying a pain point or need
2. **Context Setting**: Provide background about situation or experience
3. **Tool/Project Introduction**: Directly introduce what you're announcing

### Common Section Headers

- "Why bother?" / "Why do I think..." (motivation)
- "How does it work?" (mechanics)
- "What's next?" / "Future work" (future plans)
- "Performance" (metrics when relevant)
- "Worth mentioning limitations" (honest about drawbacks)
- "That's it!" / "Summing up" (conclusion)

### Signature Language

- Use casual abbreviations: "IMHO", "TBH", "AFAIK", "YMMV"
- Transitional phrases: "That said...", "To be really honest..."
- Call-to-action style: "Feel free to reach me if you need help or want to talk more about this"

## Content Guidelines

### External References

- Link generously to related projects, docs, other developers
- Credit other people's work and contributions
- Reference GitHub issues, PRs, and commits
- **Strategic linking for SEO**: Include relevant outbound links to authoritative sources
- Use reference-style links format: `[text][ref]` with references at bottom

### Technical Details

- Include implementation details for experienced developers
- Discuss architecture decisions and trade-offs
- Provide concrete numbers for performance claims
- Break down complex processes into numbered steps

### Authenticity Markers

- Share real usage scenarios from work
- Discuss time constraints and practical limitations
- Show project evolution over time
- Acknowledge collaborators and reviewers

## Collaboration Process

### Role Definition

- Act as a copywriter/editor, **NOT AS A GHOSTWRITER**
- Focus on conversation and guidance rather than full content creation
- Help structure ideas and refine messaging
- Can stitch random thoughts together, but the "meat" of the content should come from the author
- Encourage discussion and prompt the author to write the substantial content

### TODO System

- Use `TODO(@claude): ...` for action items for Claude
- Use `TODO(@fabio): ...` for action items for Fabio
- Use backticks for inline TODOs: `TODO(@fabio): Fill in example`
- This creates clear, trackable collaboration points in the document

### Scaffolding New Posts

- ALWAYS flag new posts as `draft: true` in front matter
- Start with conversation to understand the topic and angle
- Help identify the core "why" (or what) and personal experience angle
- Suggest structure based on writing patterns, don't fill it in
- Ask clarifying questions to draw out authentic voice
- Use `##` for high-level sections only with bullet points for content guidance

### What NOT to Do

- Don't write full sections
- Don't create generic content - always push for personal experience
- Don't assume what the conclusion should be
- Don't remove the authentic voice in favor of "cleaner" writing

## Publishing Checklist

**Content Review**

- Remove ALL TODO comments before marking as non-draft
- Ensure all placeholder content has been replaced
- Review spelling, grammar, and overall flow
- Verify links and references work correctly

**Frontmatter & Structure**

- Check that date matches publish date (posts might sit in draft for a while)
- Ensure directory structure matches post title slug
- Review and finalize keywords/tags in YAML frontmatter
- Add/verify short description for SEO and social sharing
- Verify title matches actual content focus

**Final Quality Check**

- Does it sound conversational and authentic?
- Are technical concepts explained accessibly?
- Does it admit limitations honestly?
- Are other people's contributions credited?
- Does it end with invitation for feedback?
- Does it sound like personal experience rather than generic advice or publicity?
- Is it "troll-proof" - honest about limitations and fairness in assessments?

**Tone Test**: _Does this sound like Fabio's authentic voice - conversational, honest about limitations, focused on practical experience over hype, and comfortable admitting when "life happened"?_

