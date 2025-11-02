---
title: "Docker Containers Failing on 5G? It's Probably MTU"
date: 2025-10-23
draft: true
description: "TODO(@fabio): Add short description for SEO"
keywords:
  - docker
  - 5g
  - networking
  - devcontainer
  - mtu
---

## The Problem

`TODO(@fabio): Set the scene - you were working on 5G and suddenly your devcontainer wouldn't come up. HTTP worked fine on the host, but inside Docker containers, HTTPS connections were dying with SSL errors. The classic "works on my machine but not in Docker" situation, except this time it was "works on fiber but not on 5G".`

Key symptoms:
- HTTP requests worked fine
- HTTPS connections failed during SSL handshake with `unexpected eof while reading` errors
- Host machine had no issues connecting
- Only affected Docker containers

## Why This Happens

`TODO(@fabio): Explain MTU (Maximum Transmission Unit) in your conversational way. 5G networks use GTP (GPRS Tunneling Protocol) which adds overhead to packets. The default Docker MTU of 1500 bytes is too large - when you add the tunnel headers, packets get fragmented or dropped. SSL handshakes use larger packets than regular HTTP requests, which is why HTTPS failed but HTTP worked.`

Worth mentioning: This isn't specific to 5G - any network with encapsulation overhead can cause this (VPNs, some WiFi setups, LTE/4G).

## The Fix

`TODO(@fabio): Walk through the solution. Started with MTU 1450 (didn't work), ended up at 1280. Show the daemon.json config. Mention that you needed to merge it with existing nvidia runtime config.`

Final working configuration in `/etc/docker/daemon.json`:

```json
{
    "mtu": 1280,
    "runtimes": {
        "nvidia": {
          "args": [],
          "path": "nvidia-container-runtime"
        }
    }
}
```

Then restart Docker:
```bash
sudo systemctl restart docker
```

## Testing It

`TODO(@fabio): Share the before/after. Show the failing wget command and then the successful one after the fix. Mention testing with your devcontainer.`

`TODO(@fabio): ADD OUTCOME HERE - did your devcontainer come up successfully after the MTU change?`

## But Wait, There's More

`TODO(@fabio): After fixing MTU, you still hit multiple network-related failures in the devcontainer setup process.`

MTU fixed the SSL handshake issue, but 5G's high latency and intermittent connectivity caused a cascade of failures:

1. **custom_initializer.sh** - Failed `npm install -g @anthropic-ai/claude-code` (npm registry timeout)
2. **updateContentCommand** (bin/setup) - Bundler timing out fetching specs from rubygems.org (even with vendor/cache!)
3. **Ruby LSP extension activation** - Triggered mise to check tool versions
4. **mise auto-install** - Detected missing node@20.19.5, tried to download from nodejs.org
5. **Connection reset by peer** - Node.js download failed due to network issues
6. **Ruby LSP failure** - Gave up and prompted for manual Ruby binary selection

`TODO(@fabio): Talk about having to strip out bin/setup and custom_initializer.sh from devcontainer.json just to get the container to start. The irony of having automation break because of network issues. Each layer of "helpful" automation (mise auto-installing missing tools, bundler checking for updates, npm installing dependencies) became a liability on poor networks.`

`TODO(@fabio): At this point, did you keep fighting or decide to explore alternatives like Codespaces?`

This cascading failure led to a broader investigation of optimizing devcontainers for metered networks. `TODO(@fabio): Link to the devcontainer post if you end up writing it`

## Performance Impact on Regular Networks

`TODO(@fabio): Address the "what about when I'm back on fiber/wifi?" question. MTU 1280 on a network that supports 1500 means slightly more packets (~8-15% overhead), but for typical development work (Rails, bundler, yarn, database operations) the impact is negligible. Discuss the tradeoff: convenience of working everywhere vs. theoretical performance you'll never notice.`

The practical options:
1. Keep MTU 1280 everywhere (set it and forget it)
2. Switch manually when changing networks (annoying)
3. Find a higher value that works on your 5G (probably not worth the effort)

`TODO(@fabio): Share what you decided to do and why`

## Or Just Use GitHub Codespaces

`TODO(@fabio): After all this fighting with MTU and bundler timeouts, you realized there's a simpler option: GitHub Codespaces.`

The nuclear option: Don't run containers locally on 5G at all.

**The idea**: Your devcontainer runs in GitHub's datacenter (fast network, no MTU issues), and you just connect your editor to it. The editor connection is lightweight compared to downloading gems, npm packages, and Docker images.

`TODO(@fabio): Did you end up going this route? Is this where the story ends - "I spent hours fighting MTU and bundler, then realized I should just use Codespaces"? That would be very on-brand for your honest writing style.`

Tradeoffs:
- Pros: No network issues, consistent performance, no local Docker overhead
- Cons: Costs money, requires internet connection, potential latency for editor operations
- `TODO(@fabio): Any other pros/cons you discovered?`

## That's It!

`TODO(@fabio): Wrap up. How long did this take you to figure out? Would you have preferred a better error message? Any thoughts on Docker's default behavior here?`

`TODO(@fabio): What did you end up doing? Did you:
- Stick with local devcontainer + MTU fix + manual setup?
- Switch to Codespaces?
- Only work on fiber?
- Some hybrid approach?
- Give up on 5G development entirely?

Be honest about whether the fight was worth it or if you decided to take a different path. Add your typical call-to-action for people with similar issues to reach out.`

---

## References

`TODO(@fabio): Add any relevant links you referenced while debugging this`
