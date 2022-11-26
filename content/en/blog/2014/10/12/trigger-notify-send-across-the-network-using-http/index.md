---
date: "2014-10-12"
title: "Trigger notify-send across the network using HTTP"
description: "Useful for forwarding notifications from local VMs / Containers to your own computer"
tags:
- docker
- devstep
- vagrant
- golang
- notify-send
---

Last week I cut the first release of [notify-send-http](https://github.com/fgrehm/notify-send-http),
a tool for triggering `notify-send` across the network using HTTP. Useful for
forwarding notifications from local VMs / Containers to your own computer. It
even supports notification icons!

![demo](http://i.imgur.com/51hGcuW.png)

**_Tested on Ubuntu 14.04 only_**

## Why?

Because I do all of my dev work on virtualized environments and I use [guard](https://github.com/guard/guard/)
quite a lot to keep my Ruby tests running when files get changed. The problem is
that its builtin notification support will trigger a `notify-send` inside the virtual
environment instead of my machine.

With `notify-send-http` I can run an HTTP server on my machine and make use of a
custom `notify-send` executable on my virtual environments that has the same
interface as the original command and will send notifications to the HTTP server
so that I can see alerts poping up on my screen whenever the build fails.

Check out the [project's README](https://github.com/fgrehm/notify-send-http#readme)
for installation and usage with Devstep, Docker and Vagrant.
