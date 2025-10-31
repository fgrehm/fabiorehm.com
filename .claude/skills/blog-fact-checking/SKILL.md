---
name: blog-fact-checking
description: Verify claims against referenced sources. Use when checking if blog content accurately represents external resources, APIs, or documentation.
---

# Fact Checking

## What to Verify
- Claims about external tools/libraries
- Version numbers and API details
- Quotes and attributions
- Technical specifications
- Links match what's claimed in text

## Process

1. **User directs what to check**
   - "Check the Redis claim in paragraph 3"
   - "Verify the Vagrant version requirements"
   - "Is the systemd behavior I described accurate?"

2. **Fetch the source**
   - Use `web_fetch` to get referenced documentation
   - Read official docs, not secondary sources when possible

3. **Compare claim vs source**
   - Does the claim match what the source says?
   - Is version information current?
   - Are quotes/code examples accurate?

4. **Report findings**
   - ✅ Verified: matches source
   - ⚠️ Outdated: source has changed
   - ❌ Mismatch: claim doesn't match source

## Not Exhaustive
This is **targeted checking**, not an audit of every claim. User points to specific sections they want verified.

## Example Workflow

User: "Check if I got the LightDM systemd behavior right in the 'Display Manager Symlink' section"

Action:
1. Fetch systemd documentation on service types
2. Fetch LightDM documentation if available
3. Compare claim about "static" service type
4. Report: Verified/Mismatch/Unclear

## Response Format

```
**Checked**: LightDM systemd service behavior

✅ **Verified**: LightDM is indeed a "static" unit type requiring explicit symlink to display-manager.service

Source: systemd.unit(5) man page confirms static units cannot be enabled without symlinks.

**Note**: Minor point - the systemd docs use slightly different terminology but your explanation is accurate.
```

## Tools
- `web_fetch` for documentation
- Always cite sources checked
- Focus on technical accuracy, not writing style
