---
title: "crib: Just Enough Devcontainers"
date: 2026-03-20
tags:
  - crib
  - devcontainers
  - docker
  - go
  - open-source
  - podman
description: "After building dev environment tools on and off for many years, I scratched the same itch again, this time on top of the devcontainer spec."
---

_This picks up where [DevPod: SSH-Based Devcontainers Without IDE Lock-in][devpod-post] left off._

I've been hacking on dev environment tooling since 2013. [Ventriloquist][ventriloquist] and [devstep][devstep] were different takes on the same problem: I want to `git clone && cd` into a project to start working on it without thinking about infrastructure. Ventriloquist had you declaring platforms and services explicitly in a Vagrantfile using a custom format with no ecosystem, devstep went the other direction with buildpack magic that auto-detected our stack. I recently built yet another one, and how it came together surprised me.

I think I found out about [devcontainers][devcontainers] back when the CLI got first released ([early 2022 maybe][devcontainer-cli-announcement]? Hard to tell by now), it felt like the spec I've been waiting for. A JSON file describing the environment with tooling that builds the container. Same spirit as what I have been building but I didn't have to own the spec anymore, just the runner.

The thing preventing me from using it was the fact that for a good while the way to use it with a nice UX was through VS Code, I didn't want to leave nvim to go there, but I [got into it anyway with Cursor][cursor-post] last year.

Then DevPod changed that, I could SSH into a container and use whatever editor I wanted. That's something I was comfortable with since the old Vagrant days and I even [wrote a post about it last year][devpod-post], but early this year things started going sideways.

I've been meaning to experiment with [Podman][podman] for a while due to its [daemonless / rootless support][podman-article]. I was trying to get DevPod working with Podman and couldn't get it to work. I went to the repo looking for help and the last commit was... [a merge of my own PR][devpod-pr] from 4 months ago fixing some port forwarding docs. I poked around the issues and remembered that [@nick-walt pointed out to me][nick-walt-discussion] that a [community fork][devpod-fork] was being maintained so I gave it a shot. The fork mostly worked but other things started breaking (git signing workarounds, for one) and I couldn't be bothered troubleshooting.

That's when I started considering more seriously the idea of building my own tooling again which eventually became [crib][crib].

## Why not just use the official CLI? Or fork DevPod?

Before fully committing, I checked: could I just fork DevPod (or the [community fork][devpod-fork]) and strip it down? I pointed Claude at the original `loft-sh/devpod` codebase and asked what it would take to extract the essentials. It ran for about 30 minutes and came back with a long list of things to remove: providers, SSH tunnels, agent injection, gRPC, IDE integrations. They were all "tangled together" which was kinda scary.

The official CLI is a mature reference implementation but it's not the kind of project that's going to move fast on new ideas. I've been missing the [plugin/extension capabilities][devstep-plugins] I had back in my devstep days (I even had a [Squid proxy plugin][devstep-squid3-ssl] for caching package downloads) and the [official CLI][devcontainers-cli] isn't built for that. I also remembered it requiring Node and I just wanted a single binary I could drop in (they apparently have an install script now that bundles Node behind the scenes, but by the time I found that out I was already past it).

TL;DR - ripping things out or trying to push my ideas into the official CLI was probably going to take longer than starting fresh.

## How it came together

crib wasn't a weekend of agentic coding, I actually had a first attempt back in September 2025 that used the Docker Go SDK directly which kinda worked, but it was a lot of code between me and a running container so I just threw it away.

For crib, I started differently though. I asked Claude on my phone to [distill the devcontainer spec][distilled-spec] into something digestible, got that markdown over to the computer, fed it into Claude Code along with a round of research on the reference implementation source code, and ran my [project-inception skill][project-inception] (Claude interviews me about what I want to build and then produces docs + roadmap from that). From there, Claude executed the plan while I reviewed code, handled some architecture decisions and did manual testing on some examples we put together and my work project. Once the core was in place, I switched to focused sessions, one feature or fix per PR, with Copilot reviewing each one before merge.

Go was a conscious choice: I've got experience with it and it compiles to a single binary. Also, instead of the SDK approach, crib just shells out to `docker` or `podman` and lets them "have fun with my `--args`".

## What crib does

crib reads a `devcontainer.json`, builds the image, runs lifecycle hooks, and `crib shell` drops you in. I want to keep the core small and expand once it's battle tested.

The design choices came from things that gave me a hard time with DevPod. Most devcontainer tooling adds ceremony between you and a working shell: providers to configure, SSH tunnels to manage, IDE integrations to maintain. The `git` signing wrapper bug was enough to convince me that the simplest path is `docker exec`, no SSH or agents injected into the container. This is how I used to work with containers back in the [vagrant-lxc][vagrant-lxc] / devstep days way before devcontainers were a thing.

I wanted to `cd` into a project and go, no flags to remember. The workspace names come from the current directory, just `crib up`, `crib shell`, done. Docker and Podman (including rootless) are auto-detected as runtimes or can be set via `CRIB_RUNTIME`.

![crib demo](demo.gif)

The demo above uses a [minimal Rust example][rust-example] if you want to see what a project looks like.

For a detailed comparison with the official CLI and DevPod, there's a [comparison page in the docs][crib-comparison].

## Using it for real

I started using crib on my work project and some OSS tools I got by around late February. Within hours things broke and I had to rollback to DevPod. Lifecycle hooks weren't re-running when I expected, and there was a massive amount of duplicated code that resulted in fixing things while breaking other things "whackamole style".

Claude had implemented the [hook markers on the host side][commit-hook-markers], so `stop` + `up` looked like the container was already set up. That led to renaming `stop` to `down` (which removes the container and clears markers) and eventually to snapshot-based restarts so I wouldn't lose software installed by hooks.

Variable interpolation bit me as well. My `devcontainer.json` used `${PATH}` in `remoteEnv` (instead of the spec-standard `${containerEnv:PATH}`) and crib was passing the literal string instead of resolving it, which [overwrote the container's real PATH][commit-path-interpolation]. The kind of stuff you only find when you stop testing against toy configs.

Environment probing was also tricky. crib probes the container's shell to capture `$PATH` and other vars so `crib shell` sees the right tools. But Claude had it [running before lifecycle hooks][commit-env-probe], so anything installed by hooks (like `mise install` in my setup script) wasn't on PATH, I'd open a shell and `ruby` just wasn't there. The fix was to probe again after hooks, but then mise's internal state variables leaked into the saved environment and confused mise in new shells. Every fix surfaced the next bug and I almost gave up TBH.

And then multiply all of that by two, single-container and compose had separate code paths, so every bug showed up twice with slightly different symptoms. I ended up doing a "backend abstraction refactor" to consolidate the two paths, which helped, but it's still an ongoing effort.

Using crib on my work project and a few other projects felt like the first time devstep came together back in the day. `cd` into the project, `crib up`, `crib shell`, and I'm in a working environment that I configured once and don't think about anymore.

## Plugins and other surprises

The thing I missed most from devstep was opinionated defaults that work everywhere without per-project boilerplate so I gave crib a [plugin system][crib-plugins]. They're all compiled into the binary for now since I'm the only user and it's just easier that way, but the architecture is there to extract them if it ever makes sense. [Built-in plugins][crib-builtin-plugins] handle SSH agent forwarding, shell history persistence, package caching a la [vagrant-cachier][vagrant-cachier], and coding agent credentials.

They all run automatically at container creation (except for the caching one which requires configuration) and fail open, if the SSH agent isn't running or there are no Claude credentials the plugin just skips without errors.

The Claude credentials plugin [workspace mode][crib-workspace-mode] was not planned. Coincidence or not, my company recently signed up for a Claude Team plan so I added a way to use my work email credentials inside work containers instead of my personal ones which get mounted into other containers by default.

`crib restart` wasn't planned either. It came from getting annoyed at unnecessary rebuilds while dogfooding. It diffs the devcontainer config against the stored one and picks the minimal action. No changes? Just `docker restart`. Safe changes like volumes, mounts, or env vars? Recreate the container without rebuilding the image. Image-affecting changes like the Dockerfile or features? It tells you to `crib rebuild` instead. It might not cover all scenarios but does the trick for me most of the time.

## Why it feels like mine

The majority of code I "wrote" for crib was markdown. Basically lots of prompts, fine tuning specs / project inception docs. Claude wrote like 99% of the Go code and yet it feels like mine in a way I didn't expect.

I knew what to build because I've been ~~obsessing~~ tinkering about this same problem for many years. The opinions that shaped crib came from years of building my own and experimenting with other things, and those opinions haven't changed much even though I'm not writing much of the Go myself anymore.

I know Go and I steered the architecture + reviewed the code as it came out, it's obviously not a perfect codebase but it works for my use cases. When the duplicated code paths kept causing bugs, I pushed for a backend abstraction refactor that Claude resisted for a good while, but I'd been through enough whackamole to know it was needed. There's definitely code in crib I won't be able to explain line by line without reading it first, but that's true of any codebase I haven't touched in a few weeks. If a bug pops up (like the ones I mentioned above), I can just review the code and ask for help from Claude if I need a more in depth explanation. There's a growing test suite (unit, integration, e2e) and I've also been getting [Copilot code reviews][copilot-pr-review] on every PR which caught real bugs Claude missed (like [plugins not running during container recreation][crib-pr-1]).

The tool does exactly what I wanted, shaped by decisions I've been forming since 2013 and I think that's what really matters.

## Le Future

I've been thinking in containers since the LXC days before Docker was a thing. We have people in the team that use devcontainers on VS Code, others continue to use DevPod and I use them with `crib`, but the same `devcontainer.json` works for everyone in the team today and in the future.

I've been building dev environment tooling on and off for many years and I'm not stopping. I might take a break here and there but the lesson that took me the longest to learn was to stop inventing the format and just try to build a better runner. [crib][crib] is that for me right now, a small opinionated runner based on years of opinions about how I believe this should work on top of a spec I trust and is adopted by many ppl out in the wild. If you want to try it or poke around, the [docs][crib-docs] are a good place to start.

[devpod-post]: /blog/2025/11/11/devpod-ssh-devcontainers/
[vagrant-lxc]: /blog/2013/04/28/lxc-provider-for-vagrant/
[ventriloquist]: /blog/2013/09/11/announcing-ventriloquist/
[devstep]: /blog/2014/08/26/devstep-development-environments-powered-by-docker-and-buildpacks/
[devcontainers]: https://containers.dev
[devcontainer-cli-announcement]: https://code.visualstudio.com/blogs/2022/05/18/dev-container-cli
[cursor-post]: /blog/2025/08/29/afraid-ai-would-make-me-lazy/#tool-experimentation-journey
[podman]: https://podman.io/
[podman-article]: https://medium.com/@itz.aman.av/all-about-podman-daemonless-containers-without-the-drama-5832b9856e46
[devpod-pr]: https://github.com/loft-sh/devpod/commit/5a0efcbff6610ab114b421f68a890739a452e66b
[nick-walt-discussion]: https://github.com/fgrehm/fabiorehm.com/discussions/2
[devpod-fork]: https://github.com/skevetter/devpod
[crib]: https://github.com/fgrehm/crib
[devcontainers-cli]: https://github.com/devcontainers/cli
[devstep-plugins]: https://github.com/fgrehm/devstep/blob/master/docs/cli/plugins.md
[devstep-squid3-ssl]: https://github.com/fgrehm/devstep-squid3-ssl
[distilled-spec]: https://github.com/fgrehm/crib/blob/main/docs/devcontainers-spec.md
[project-inception]: https://github.com/fgrehm/dot-ai/blob/01c4c35ccdd24b8eefef51960015cd5ed7e56e66/skills/project-inception/SKILL.md
[crib-comparison]: https://fgrehm.github.io/crib/comparison/
[commit-hook-markers]: https://github.com/fgrehm/crib/commit/e131467
[commit-path-interpolation]: https://github.com/fgrehm/crib/commit/54c1815
[commit-env-probe]: https://github.com/fgrehm/crib/commit/929af2d
[crib-plugins]: https://fgrehm.github.io/crib/contributing/plugin-development/
[crib-builtin-plugins]: https://fgrehm.github.io/crib/guides/plugins/
[vagrant-cachier]: /blog/2013/05/24/stop-wasting-bandwidth-with-vagrant-cachier/
[crib-workspace-mode]: https://fgrehm.github.io/crib/guides/plugins/#workspace-mode
[crib-docs]: https://fgrehm.github.io/crib
[rust-example]: https://github.com/fgrehm/crib/tree/main/examples/rust-project
[copilot-pr-review]: https://docs.github.com/en/copilot/using-github-copilot/code-review/using-copilot-code-review
[crib-pr-1]: https://github.com/fgrehm/crib/pull/1#pullrequestreview-2676313988
