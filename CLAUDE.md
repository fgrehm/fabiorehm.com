# Fabio Rehm's Blog Writing Style Guide

*Extracted from analyzing 15+ blog posts (2013-2017) to maintain authentic voice and style consistency*

## Writing Voice & Tone

**Conversational and Personal**
- Write in first-person ("I've been", "my experience", "I need to say")
- Keep tone conversational, like talking to a friend or colleague
- Use self-deprecating humor and honest admissions of limitations
- Example tone: *"I need to say that I'm not a 'DevOps guy'. My day to day job still consists of building Ruby On Rails apps"*

**Technical but Accessible**
- Explain complex technical concepts in approachable language
- Balance technical depth with readability
- Use analogies to clarify concepts
- Example: *"LXC is the userspace control package for Linux Containers, a lightweight virtual system mechanism sometimes described as 'chroot on steroids'"*

**Honest and Transparent**
- Admit when things don't work or when uncertain
- Share failures alongside successes
- Be upfront about limitations and drawbacks

## Post Structure Patterns

### Opening Approaches
1. **Problem Statement**: Start by identifying a pain point or need
   - *"If you have done any kind of Puppet manifests / Chef cookbooks development using Vagrant chances are that you've been staring at your screen waiting..."*

2. **Context Setting**: Provide background about situation or experience
   - *"I've been doing all of my real (paid) work on VMs / containers for a while now but when it comes to writing Java code..."*

3. **Tool/Project Introduction**: Directly introduce what you're announcing
   - *"Devstep is a relatively new project that I've been working on since February 2014..."*

### Common Section Headers
- "Why bother?" / "Why do I think..." (motivation)
- "How does it work?" (mechanics)  
- "What's next?" / "Future work" (future plans)
- "Performance" (metrics when relevant)
- "Limitations" / "Worth mentioning limitations" (honest about drawbacks)
- "That's it!" / "Summing up" (conclusion)

## Language Patterns & Expressions

### Signature Phrases
- "That's it!" (conclusion marker)
- "That said..." (transitional clarification)
- "To be really honest..." (honest admission)
- "Let's say you want to..." (hypothetical scenarios)
- "Feel free to..." (encouraging action)
- "Keep in mind that..." (important caveats)
- "IMHO" / "TBH" (casual abbreviations)

### Casual Internet Language
- Use internet slang appropriately: "WTF?!?", "AFAIK", "YMMV"
- Employ strikethrough for updates: `~~buzzword~~`
- Use emphasis with **bold** and _italics_
- Occasional playful language: "went nuts", "striked again"

### Humor and Personality
- Self-deprecating jokes about code quality
- Pop culture references and casual expressions
- Example: *"Before you think I'm going nuts, I have a reason behind releasing each plugin"*

## Technical Communication Style

### Code Examples & Commands
- Always provide practical, runnable examples
- Use proper syntax highlighting with language tags
- Include both code snippets and full command sequences
- Show before/after comparisons when useful

### Metrics and Evidence  
- Provide concrete numbers for performance claims
- Use tables for benchmark comparisons
- Example: *"on average those numbers represents ~41% drop on provisioning time"*

### Step-by-Step Approach
- Break down complex processes into numbered/bulleted steps
- Use clear transitions: "The next step was...", "After that..."
- Include troubleshooting information when relevant

## Content Elements

### Updates and Maintenance
- Add update notices to posts with clear formatting
- Use: *"**UPDATE** (date): explanation"*
- Cross-reference related posts with internal links
- Show project evolution over time

### External References
- Link generously to related projects, docs, other developers
- Credit other people's work and contributions  
- Reference GitHub issues, PRs, and commits
- Use proper attribution for quotes and ideas

### Media Integration
- Embed videos, screencasts, and demos when available
- Use animated GIFs for demonstrations
- Include social media embeds for social proof
- Note when videos are "mute" (like HashiCorp style)

## Project Announcement Style

### Project Context
- Always explain the "why" behind creating something new
- Position projects relative to existing solutions
- Discuss evolution from previous attempts
- Example: *"This was my third attempt at building a tool to make my life easier"*

### Deprecation Handling
- Clearly mark deprecated projects
- Explain reasons for deprecation
- Provide migration paths when possible
- Show responsibility when stepping down as maintainer

## Conclusion Patterns

### Common Endings
- Invite feedback and contributions
- Provide links to project repositories
- Acknowledge collaborators and reviewers
- End with forward-looking statements

### Call-to-Action Style
- *"Feel free to reach me in case you need any help"*
- *"Let me know if you have any trouble"* 
- *"Don't hesitate to throw some tomatoes as well if you think I deserve :P"*

## Writing Quality Indicators

### Editing and Polish
- Show awareness of writing quality with self-corrections
- Update posts with new information over time
- Acknowledge reviewers and editors in closing notes
- Example: *"Many thanks to some fellow coworkers... for reading drafts of this post and for giving me their feedback!"*

## Technical Depth Balance

### Beginner-Friendly Elements
- Explain acronyms and technical terms
- Provide context for tools and technologies
- Link to getting started guides and documentation

### Advanced Technical Details
- Include implementation details for experienced developers
- Discuss architecture decisions and trade-offs
- Provide benchmarks and performance considerations

## Authenticity Markers

### Personal Experience Focus
- Share real usage scenarios from work
- Admit when you haven't used something extensively
- Discuss time constraints and practical limitations
- Example: *"I personally have been using less that I thought I would but I know quite a few people that has been using it"*

### Community Awareness
- Acknowledge other people's contributions and ideas
- Participate in broader technical discussions
- Show awareness of community needs and feedback

---

## Quick Style Checklist

**Before Publishing:**
- [ ] Does it sound conversational and authentic?
- [ ] Are technical concepts explained accessibly?
- [ ] Are there practical, runnable examples?
- [ ] Does it admit limitations honestly?
- [ ] Are other people's contributions credited?
- [ ] Does it end with invitation for feedback?
- [ ] Are metrics/benchmarks included when relevant?
- [ ] Is the "why" behind the topic clearly explained?
- [ ] Does it avoid absolute statements and acknowledge other approaches?
- [ ] Does it sound like personal experience rather than generic advice?

**Tone Test:** *Would this feel natural coming from a Rails developer who's trying to get back to writing after an 8-year break, values honesty and practical solutions over hype, and isn't afraid to admit when "life happened"?*

---

## Recent Updates (2025)

### New Insights from Blog Comeback

**Real Use Cases Over Generic Examples**
- Focus on actual personal use cases: "testing stuff before reformatting my machine"  
- Avoid generic examples like "GUI development" or "training" unless they're genuinely your experience
- Be specific about pain points: "Previously I'd set up VMs by hand, which was a complete pain in the ass"

**Even More Casual Language**
- Don't shy away from stronger expressions: "complete pain in the ass", "took me forever"
- Use "stuff" instead of overly formal language when appropriate
- Embrace honest frustration: "This one took me forever to figure out"

**Acknowledge AI Assistance Naturally**
- Credit Claude Code help when relevant: "debugged the problems (with some help from Claude Code)"
- Don't hide the collaboration - it's part of the authentic story
- Make it natural, not promotional - just honest acknowledgment of tools used

**Updated Personal Context (2025)**
- Currently focused on Rails development and exploring AI tools for developer productivity
- Past open source work is archived/deprecated ("because life happened") 
- Trying to get back to writing after 8-year break (not "back to writing" - still trying)
- Career evolution: PHP → .NET → Rails → DevOps → Go → even some VB6 → back to Rails focus
- Real use cases: testing before machine reformats, reproducible development environments

**Project Context Evolution**  
- Working on "chezmakase" project (expect to open source)
- Practical automation focus rather than pure open source contribution
- Real-world debugging and problem-solving over theoretical solutions

---

## Post Scaffolding and Writing Process

### Copywriter Collaboration Approach

**Role Definition**
- Act as a copywriter/editor, not a ghostwriter
- Focus on conversation and guidance rather than full content creation
- Help structure ideas and refine messaging
- Only write actual content when explicitly asked

**Scaffolding New Posts**
- ALWAYS flag new posts as `draft: true` in front matter
- Start with conversation to understand the topic and angle
- Help identify the core "why" and personal experience angle
- Suggest structure based on writing patterns, don't fill it in
- Ask clarifying questions to draw out authentic voice

**Scaffold Structure Format**
- Use `##` for high-level sections only
- Use bullet points for subsections and content guidance
- Keep it free-form and flexible rather than rigid subsection headers
- This makes it easier to reorganize and write naturally
- Example format:
  ```
  ## Main Section
  - Key point to cover - brief explanation of what to include
  - Another aspect - more guidance
  - Specific example or anecdote to mention
  ```

**Conversation Flow**
1. **Topic Exploration**: What's the real problem you're solving? What's your personal experience?
2. **Angle Discovery**: Why this topic now? What's your unique perspective?
3. **Structure Suggestion**: Recommend post organization based on content type
4. **Content Guidance**: Help refine tone, suggest examples to include
5. **Review & Polish**: Only when explicitly asked to write or edit sections

**What NOT to Do**
- Don't write full sections unless explicitly requested
- Don't create generic content - always push for personal experience
- Don't assume what the conclusion should be
- Don't fill in technical details without being asked
- Don't remove the authentic voice in favor of "cleaner" writing

**Draft Management**
- New posts start with `draft: true` 
- Remove draft flag only when explicitly told to publish
- Suggest when a post might be ready, but don't assume

**Final Pass Before Publishing**
- Review spelling, grammar, and overall flow of the post
- Check that the date matches the current date (posts might sit in draft for a while)
- Ensure all placeholder content has been replaced with actual content
- Verify links and references work correctly
- Use reference-style links format (not inline links):
  ```
  [link text][reference]
  
  [reference]: http://example.com
  ```