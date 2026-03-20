---
title: "please-make-me-an-app, or not"
date: 2026-03-17
tags:
  - please-make-me-an-app
  - linux
  - rust
  - webview
  - desktop
description: "I got tired of waiting for native Linux apps, so I built a tool with a very long name"
---

Ever since I started working with Ruby back in 2009, Linux has been my home and recently I got tired. Not like, angry-tired, but more like the "sigh" of someone who's been working around missing apps and some ~~shit~~ quirks for like almost 17 years.

The quirks range from Internet Banking that didn't work properly on Linux (unless I installed some `.deb` from someone I dunno) to government sites that only worked on Windows for issuing "Notas Fiscais" (basically tax receipts I needed to file as a company). The bottom line is that for a long time people didn't really care about Linux, the "Year of Linux on Desktop" never arrived to this day.

Turns out [native apps themselves seem to be falling apart][tonsky-native] too, so maybe waiting for them was never the answer :shrug:

## The hacks

For a long time I had to just use Windows VMs for some government stuff (thankfully that changed) and for my bank I just installed this thing called "[Warsaw module][warsaw]" which I constantly forgot to install after reformatting my machine and had to do so last minute when I just wanted to make a payment or use something that I can't do from the mobile app.

Once [Electron][electron] was released, things started changing, apps like Spotify, Slack and others just started using it for cross platform support. For those that did not release "an app", I just used the "[Browser `--app` trick][app-flag]" many ppl use, but that never really worked out flawlessly, for example, the "app" window got grouped with my main browser window during alt tabs given they share the same process tree (I think), window icons also got messed up very frequently. Yeah, I know about PWAs, they are cool... but they are kinda like a "glorified `--app`" or `--app` on steroids IMO.

## Then came "The AI"

I've been thinking about ways to properly package / use the things that don't get released as proper apps on Linux (think claude.ai, figma, etc) without using Electron. After some ~~AI back and forth~~ research I got to know about this duo in Rust which looked promising:

- [tao][tao]: "The TAO of cross-platform windowing. A library in Rust built for Tauri."
- [wry][wry]: "A cross-platform WebView rendering library."

Both are part of another project called [Tauri][tauri] for creating cross-platform applications. There's also [Pake][pake] which is built on top of Tauri, but it compiles a binary per app and I didn't want a build step. I'm not a Rust developer but AI made it possible to get this idea out of my head without a ton of effort and...

## So I built it

[please-make-me-an-app][pmmaapp] (or `pmmaapp` for short) is like "dotfiles for your web apps". The idea is to turn _any_ website into a standalone desktop app with just YAML, no Electron, no bundled browser and no build step (small binaries FTW).

`pmmaapp` uses your system's WebKit engine ([WebKitGTK][webkitgtk] in my case, running on Debian 13 / KDE Wayland) and provides profile isolation, meaning instances of your apps are truly isolated in terms of processes, cookies and the like. As a bonus, I added built-in ad blocking, CSS / JS injection and `.desktop` file generation with pretty icons fetched from the source site.

Here's an example of using WhatsApp with it. Some sites (like WhatsApp) detect webview user agents and refuse to load, so the config spoofs a Chrome UA and navigator to get around that:

```yaml
name: whatsapp
url: https://web.whatsapp.com
url_schemes:
  - whatsapp
window:
  title: WhatsApp
  width: 1100
  height: 750
user_agent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
navigator:
  vendor: "Google Inc."
  platform: "Linux x86_64"
  chrome: true
notifications: true
tray:
  enabled: true
  minimize_to_tray: false
allowed_domains:
  - whatsapp.com
  - whatsapp.net
  - wa.me
```

Full config reference is in the [README][pmmaapp-config].

## The banking story

Fun fact: thanks to `pmmaapp` I no longer need to install some obscure `.deb` package to use my internet banking. The built-in UA and navigator spoofing lets me pretend I'm on SunOS, which makes the bank's security module go "I don't know what that is" and skip its check entirely. A 15+ year Linux frustration solved in a couple Claude Code sessions.

## Not everything is purrfect

Some apps won't work without a "full blown browser" like the ones which require WebRTC or depend on Chrome extensions like Loom. Others like [claude.ai][claude] are protected by [Cloudflare Turnstile][turnstile] which seems to reject WebKitGTK.

For those we can use a browser "backend" to at least segregate cookies and work around the fact they don't support multi user profiles with a single session like Google accounts.

On the bright side, the Tauri folks are [working on Chromium rendering support][cef-rs] through [Chromium Embedded Framework (CEF)][cef] so this might get better over time and the browser backend might become unnecessary in the future.

## Go hack

If you're on Linux and tired of second-class apps, you don't need to wait for companies to care about you. The web already has everything, we just need a better window for it. Even [Claude's own desktop app is Electron][claude-electron], so don't hold your breath, [give `pmmaapp` a try][pmmaapp] or go build your own :v:

[tonsky-native]: https://tonsky.me/blog/fall-of-native/
[warsaw]: https://www.hardware.com.br/artigos/warsaw-o-modulo-de-seguranca-bancario-que-continua-inportunando-os-usuarios/
[electron]: https://www.electronjs.org/
[app-flag]: https://dev.to/anuchito/what-is-the-chrome-app-flag-9i6
[tao]: https://github.com/tauri-apps/tao
[wry]: https://github.com/tauri-apps/wry
[tauri]: https://tauri.app/
[pake]: https://github.com/tw93/Pake
[pmmaapp]: https://github.com/fgrehm/please-make-me-an-app
[pmmaapp-config]: https://github.com/fgrehm/please-make-me-an-app/#config-reference
[webkitgtk]: https://webkitgtk.org/
[claude]: https://claude.ai
[turnstile]: https://developers.cloudflare.com/turnstile/
[cef-rs]: https://github.com/tauri-apps/cef-rs
[claude-electron]: https://www.dbreunig.com/2026/02/21/why-is-claude-an-electron-app.html
[cef]: https://en.wikipedia.org/wiki/Chromium_Embedded_Framework
