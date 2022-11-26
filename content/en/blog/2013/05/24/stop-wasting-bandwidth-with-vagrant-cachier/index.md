---
date: "2013-05-24"
title: Stop wasting bandwidth with vagrant-cachier
description: 'Reduce Vagrant provisioning time with a local cache'
tags:
- vagrant
- cache
- apt
- yum
- pacman
- rubygems
- gems
---

If you have done any kind of Puppet manifests / Chef cookbooks development using
Vagrant chances are that you've been staring at your screen waiting for the machine
to be provisioned for really long periods of time, specially when you need to
destroy the VM and start over.

A while ago I came across this [gist](http://gist.github.com/juanje/3797297) which
solves part of the issue by caching downloaded packages on the host machine and
sharing them among similar VM instances. After copying and pasting it on different
projects, I decided to extract it to a Vagrant plugin and expand its usage by
supporting multiple Linux distros and package managers allowing others to benefit
from it as well.

I started spiking the plugin a while ago and after using it on a couple projects
today I went ahead and [open sourced it](https://github.com/fgrehm/vagrant-cachier).
The code is not the best you'll find around and right now it supports caching for
APT, Yum, Pacman and RubyGems packages and I'm planning to add others as needed.

On a side note, this is probably the first Vagrant plugin to make use of
[guest capabilities](http://docs.vagrantup.com/v2/plugins/guest-capabilities.html)
that I'm aware of ;)

## How does it work?

From the project's [README](https://github.com/fgrehm/vagrant-cachier/blob/master/README.md):

> Under the hood, the plugin will hook into calls to `Vagrant::Builtin::Provision` during `vagrant up` / `vagrant reload` and will set things up for each configured cache bucket. Before halting the machine, it will revert the changes required to set things up by hooking into calls to `Vagrant::Builtin::GracefulHalt` so that you can repackage the machine for others to use without requiring users to install the plugin as well.
>
> Cache buckets will be available from `/tmp/vagrant-cachier` on your guest and the appropriate folders will get symlinked to the right path _after_ the machine is up but _right before_ it gets provisioned. We _could_ potentially do it on one go and share bucket's folders directly to the right path if we were only using VirtualBox since it shares folders _after_ booting the machine, but the LXC provider does that _as part of_ the boot process (shared folders are actually `lxc-start` parameters) and as of now we are not able to get some information that this plugin requires about the guest machine before it is actually up and running.
>
> Please keep in mind that this plugin won't do magic, if you are compiling things during provisioning or manually downloading packages that does not fit into a "cache bucket" you won't see that much of improvement.

_**UPDATE**: Please refer to the project's [docs](http://fgrehm.viewdocs.io/vagrant-cachier/how-does-it-work)
for the most up-to-date information about it. Things have changed a bit lately and are
likely to change a bit more ;)_


## Show me the numbers!

I've done some pretty basic testing on four different boxes doing something along
the lines of [this script](https://gist.github.com/fgrehm/1b4025f65a66bdbccc12)
on VirtualBox VMs with [NFS](/blog/2013/01/17/100-percent-on-vagrant/#enable_nfs)
and [machine cache scope](https://github.com/fgrehm/vagrant-cachier#cache-scope)
enabled:

* vagrant-lxc's Ubuntu 12.10 [dev box](https://github.com/fgrehm/vagrant-lxc#using-virtualbox-for-development)
* [rails-dev-box](https://github.com/rails/rails-dev-box)
* My own [rails-base-box](https://github.com/fgrehm/rails-base-box)
* Discourse's [dev box](https://github.com/discourse/discourse/blob/master/Vagrantfile)

The times shown below are just for provisioning after the machine has already been
brought up on a 35mb connection:

|                | First provision | Second provision | Diff.  | APT cache |
| ---            | ---             | ---              | ---    | ---       |
| rails-dev-box  | 4m45s           | 3m20s            | ~29%   | 66mb      |
| rails-base-box | 11m56s          | 7m54s            | ~34%   | 77mb      |
| vagrant-lxc    | 10m16s          | 5m9s             | ~50%   | 124mb     |
| discourse      | 1m41s           | 49s              | ~51%   | 62mb      |


As I said, the plugin does not do any magic and it will just save you from downloading
packages. For instance, my rails-base-box compiles Ruby 2.0 from source using [ruby-build](https://github.com/sstephenson/ruby-build)
and there's nothing much we can do about it (apart from using precompiled rubies of course).

If you do the maths, on average those numbers represents `~41%` drop on provisioning time.
In my opinion this alone represents a huge win, specially if you are running
a CI server as it means a faster feedback loop. It also means that if a mirror is slower
that usual for some weird reason or if you are on a 3G connection, it'll save you a few mbs
worth of downloading packages. Not to say that is "[against etiquette towards package hosters](https://github.com/sstephenson/ruby-build/pull/232)"
to download those files over and over throughout the day.

So please, be nice and stop wasting yours and others bandwidth :)

## UPDATE

I've been <s>stalking</s> [watching](https://twitter.com/search?q=vagrant%20cachier)
what people have been saying about the plugin on twitter and looks like some have
experienced an even bigger drop on provisioning time:

<blockquote class="twitter-tweet" data-cards="hidden"><p>vagrant-cachier took my vagrant spin up from 30 to 5 minutes and reduced my caffeine intake by 3 cups <a href="http://t.co/V0uYpr3U0y" title="http://bit.ly/114CIr3">bit.ly/114CIr3</a></p>&mdash; Russell Cardullo (@russellcardullo) <a href="https://twitter.com/russellcardullo/status/343070870744494080">June 7, 2013</a></blockquote>
<blockquote class="twitter-tweet" data-cards="hidden"><p>Tested vagrant-cachier. Saved 60% of vagrant up time installing 10 rpms with chef. Pretty awesome. Check it out! <a href="https://t.co/HfbLJNP7GH" title="https://github.com/fgrehm/vagrant-cachier">github.com/fgrehm/vagrant…</a></p>&mdash; Miguel. (@miguelcnf) <a href="https://twitter.com/miguelcnf/status/343757107058847746">June 9, 2013</a></blockquote>
<script async="true" src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
