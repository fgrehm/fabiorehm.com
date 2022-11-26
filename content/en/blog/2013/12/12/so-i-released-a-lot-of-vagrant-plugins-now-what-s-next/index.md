---
date: "2013-12-12"
title: "So I released a lot of Vagrant plugins... Now what's next?"
slug: "so-i-released-a-lot-of-vagrant-plugins-now-what-s-next"
description: "Check this out in case you are using one of the plugins I've built"
category: blog
tags:
- vagrant
- vagrant-lxc
- vagrant-pristine
- vagrant-cachier
- vagrant-notify
- vagrant-boxen
- vagrant-global-status
- ventriloquist
- vocker
- bindler
---

2013 was the year I [went 100% on Vagrant](/blog/2013/01/17/100-percent-on-vagrant),
went crazy releasing plugins (10 to be more specific) and ended [becoming a Vagrant core commiter](https://groups.google.com/d/msg/vagrant-up/sAnsUdp4r7s/_jzhosAPgQsJ)
back in June. To give you an idea, this is what I've released over the year:

* [vagrant-notify](https://github.com/fgrehm/vagrant-notify) - Released at the end of 2012, but "matured" by beginning of 2013
* [vagrant-boxen](https://github.com/fgrehm/vagrant-boxen) **(deprecated)** - February 17th
* [vagrant-lxc](https://github.com/fgrehm/vagrant-lxc) - March 12th
* [vagrant-cachier](https://github.com/fgrehm/vagrant-cachier) - May 22nd
* [vagrant-pristine](https://github.com/fgrehm/vagrant-pristine) **(deprecated)** - July 11th
* [bindler](https://github.com/fgrehm/bindler) - **(deprecated)** Public release on July 15th as Vundler and later renamed to Bindler
* [vagrant-global-status](https://github.com/fgrehm/vagrant-global-status) **(deprecated)** - August 8th
* [vocker](https://github.com/fgrehm/vocker) **(deprecated)** - August 14th
* [ventriloquist](https://github.com/fgrehm/ventriloquist) **(deprecated)** - September 10th
* [docker-provider](https://github.com/fgrehm/docker-provider) **(deprecated)** - November 5th

Before you think I'm going nuts, I have a reason behind releasing each plugin and
I might blog about that someday but for the scope of this post
I'll focus on what you should expect for each one of them over 2014.


## [vagrant-notify](https://github.com/fgrehm/vagrant-notify)

For those who haven't met it yet, vagrant-notify is a plugin that redirects
`notify-send` from the guest VM to the host machine. I built it because I wanted
to run [Guard](https://github.com/guard/guard) on the guest machine and wanted
notifications popping up on my laptop.

For its future, I'm [planning](https://github.com/fgrehm/vagrant-notify/issues/5)
to add support for displaying provisioning status so that I can `vagrant up` and
go do something else while the machine gets provisioned without me "Alt-Tab"ing
to check if things have finished. I also [plan](https://github.com/fgrehm/vagrant-notify/issues/6)
to allow people to opt-out from it.

With those two features in place, I'll cut 1.0 and I'll probably won't get back to
it for a looooong time :)


## [vagrant-boxen](https://github.com/fgrehm/vagrant-boxen) (deprecated)

This was my first attempt at building an easy to use tool for provisioning
dev boxes. I ended up not doing much work on it mostly because having a tool that
aims to _lower the "entry barrier" of getting a manageable Vagrant machine targetted
for development up and running without the need to learn Puppet or Chef"_ that
used Puppet under the hood just felt _wrong_ after a while.

Since then the plugin has evolved into the Vagrant + Docker combo that got released
under the name of Ventriloquist. If you are interested on the gem name feel free to
shoot me an email so we can arrange things.


## [vagrant-lxc](https://github.com/fgrehm/vagrant-lxc)

This is by far my most "popular" plugin until today and is the one that I have dedicated
most of my time. The plugin has gone a long way since my [initial spike](https://github.com/fgrehm/vagrant-lxc/tree/55c9be772db32d4f49bf61af1801d2d6f14a880e),
going through 19 releases and is really stable on its current 0.7.0 version.

If you've been following this blog, you'll remember that I wrote a couple posts
about it that included a few big plans (like supporting `lxc-clone`, snapshotting
and ephemeral containers) and while I'll hopefully get to to implement them at
some point, I think it is about time to lay down a more realistic plan for 1.0 as
I've been "`vagrant up`ing" a vagrant-lxc container _every single working day_
since 0.1.0!

Over the following days I'll look into setting up a nice (and doable) [milestone](https://github.com/fgrehm/vagrant-lxc/issues?milestone=2&state=open)
on GitHub issues with things that I plan to ship on 1.0. Among other things, I
can tell in advance that it will involve a major revamp on the codebase, improved
test coverage, improved documentation, private networking support (at least for
Ubuntu hosts) and locking the base box format plus shipping stable base boxes
(like Vagrant itself) without releasing new versions every couple months.

On the short term, I plan to ship 0.8.0 with NFS support to help people having
[issues](https://github.com/fgrehm/vagrant-lxc/issues/151) with bind mount
permissions and will start looking into deprecating support for Vagrant 1.1,
1.2 and 1.3. This might make a few people angry but Vagrant has just [reached 1.4](http://www.vagrantup.com/blog/vagrant-1-4.html)
and it's pretty hard to keep things compatible across a big range of releases.
Right now I have to resort to some [ugly](https://github.com/fgrehm/vagrant-lxc/blob/master/lib/vagrant-lxc/action.rb#L23-L26)
[workarounds](https://github.com/fgrehm/vagrant-lxc/blob/master/lib/vagrant-lxc/action/disconnect.rb#L11-L13)
to make sure things run smooth on 1.1 / 1.3 and I really want to reduce that
kind of stuff down to a minimum.


## [vagrant-cachier](https://github.com/fgrehm/vagrant-cachier)

vagrant-cachier has gone through some really [nice improvements](https://github.com/fgrehm/vagrant-cachier/blob/master/CHANGELOG.md)
since my [initial announcement](/blog/2013/05/24/stop-wasting-bandwidth-with-vagrant-cachier)
that I'll cover on a separate post but I'm planning to get to 1.0 on the
first semester of 2014.

I've already started working on [making docs better](http://fgrehm.viewdocs.io/vagrant-cachier)
and now I'll look into cleaning up the codebase so that it opens up for
easier contributions, unit testing and the [support for caching specific folders](https://github.com/fgrehm/vagrant-cachier/issues/4).

We already have a nice [1.0 milestone](https://github.com/fgrehm/vagrant-cachier/issues?direction=desc&milestone=1&page=1&sort=updated&state=open)
in place so please check it out and let us know if you think something else should
be included.

On a side note, Vagrant 1.4 ships with a [hook](https://github.com/mitchellh/vagrant/pull/2405)
that will allow us to get rid of some [ugly monkey patching](https://github.com/fgrehm/vagrant-cachier/blob/master/lib/vagrant-cachier/provision_ext.rb)
we have in place to allow cache buckets to be configured around provisioners runs.
Because of that, I think I'll backport the hook support on the following version
and will just drop support for Vagrant < 1.4 after that for the same reasons as
I'll do it for vagrant-lxc.


## [vagrant-pristine](https://github.com/fgrehm/vagrant-pristine) (deprecated)

_**UPDATE** (21 JUL 2015): Similar functionality is likely to be provided by a future
Vagrant release, see the following links for more https://github.com/mitchellh/vagrant/issues/5378,
https://github.com/mitchellh/vagrant/pull/5410, https://github.com/mitchellh/vagrant/pull/5613_

This is a really tiny plugin that has been saving me lots of keystrokes when
rebuilding VMs from scratch. There's not a lot for it to be improved apart from
[2 bugs](https://github.com/fgrehm/vagrant-pristine/issues) that I want to fix
for a 1.0 release.


## [bindler](https://github.com/fgrehm/bindler) (deprecated)

_**UPDATE** (26 AUG 2014): Since Vagrant 1.5 came out with a [tight integration](https://github.com/mitchellh/vagrant/pull/2769)
with Bundler, Bindler is no longer being maintained as it would basically
require a rewrite of the plugin. The functionality provided by the plugin is
not yet provided by Vagrant itself but it is likely to be on some future release._

The Vagrant plugin ecossystem just keep growing and Mitchell has already said
more than once that he has plans to eventually add support for that on Vagrant's
core. I personally have been using less that I thought I would but I know quite
a few people that has been using it on their projects.

On its current state, it is still **highly experimental** and relies on some
**badass monkey patching**. It's probably broken on Vagrant 1.4 and I **strongly**
recommend you holding back on upgrading to 1.4 while we don't get to [GH-26](https://github.com/fgrehm/bindler/issues/26).

Even though things are broken when using Vagrant's latest release, 1.4 [introduces](https://github.com/mitchellh/vagrant/pull/2437)
a hook that might make things less "ugly" and experimental on Bindler's side.
But, as I wrote on [this comment](https://github.com/fgrehm/bindler/issues/19#issuecomment-24460940),
I still don't have a strong need for using Bindler on a daily basis so I added
[@patcon](https://github.com/patcon) and [@ipwnstuff](https://github.com/ipwnstuff)
as maintainers so that they can "keep the fire burning" over there.

On a side note, there's an open [Pull Request](https://github.com/mitchellh/vagrant/pull/2598)
that will allow people to use `Vagrant.require_plugin` with gem versions. It
still does not allow people to have multiple versions of plugins as you can have
with Bindler but I think that will handle some use cases that are currently
covered by Bindler as of now.


## [vagrant-global-status](https://github.com/fgrehm/vagrant-global-status) (deprecated)

_**UPDATE** (26 AUG 2014): The functionality provided by the plugin [landed into Vagrant 1.6](https://www.vagrantup.com/blog/feature-preview-vagrant-1-6-global-status.html)_

This is another plugin that I haven't been using as much as I thought I would.
As I [wrote on this comment](https://github.com/fgrehm/vagrant-global-status/pull/5#issuecomment-29757526),
I hardly fire up a VirtualBox VM these days and a plain old `lxc-list` gives me
enough information right now.

[@ryuzee](https://github.com/ryuzee) seems to be interested enough on the project
to submit 3 Pull Requests so far. I'll be adding him as a commiter to it soon and
I hope he'll be able to push things forward over there :)


## [vocker](https://github.com/fgrehm/vocker) (deprecated)

Vocker was extracted from Ventriloquist and had a short life (only 4 months) as
it has just been [merged back](https://github.com/mitchellh/vagrant/pull/2549)
into Vagrant's core on [1.4](http://www.vagrantup.com/blog/vagrant-1-4.html).
Because of that the plugin is now deprecated.

Please note that Mitchell decided to make things simpler when pulling the provisioner
into Vagrant's core. The DSL has changed and you should definitely have a look
at the [official docs](http://docs.vagrantup.com/v2/provisioning/docker.html) to
find out how things will work from now on.


## [ventriloquist](https://github.com/fgrehm/ventriloquist) (deprecated)

_**UPDATE** (26 AUG 2014): I've stepped down as a maintainer of the plugin, feel
free to [reach out in case you want to take over responsibility for the project](https://github.com/fgrehm/ventriloquist/issues/63)_

After successfuly using Ventriloquist to build VMs for my last 3 projects,
I can say that feature-wise it is stable but I'll have to deal with the changes
introduced with the new Docker provisioner DSL from Vagrant 1.4.

My plans for it is to handle those changes first, [add support for PHP](https://github.com/fgrehm/ventriloquist/issues/18)
and then create a proper documentation website with [Viewdocs](http://viewdocs.io).

This may sound crazy but I'm also willing to make it a first class provisioner so
that it can be used outside of Vagrant as well. My long term plan is to build a
standalone CLI tool that can be used to on real machines as well as Docker containers
and whatever kinds of VMs that [Packer](http://www.packer.io/) supports.

I have _absolutely no idea_ if / when I'll get to that neither how it would look like
but there seems to be enough interest on a developer friendly tool for building
development environments that I'm willing to have a shot at it :)


## [docker-provider](https://github.com/fgrehm/docker-provider) (deprecated)

_**UPDATE** (26 AUG 2014): The plugin was merged into [Vagrant 1.6](https://www.vagrantup.com/blog/feature-preview-vagrant-1-6-docker-dev-environments.html)_

This is my most recent experiment on the Vagrant world and I'm not sure if someone
is using it. There are a lot of [limitations](https://github.com/fgrehm/docker-provider#limitations)
around it but there seemed to be many people interested on having that around
so I went ahead and built it :P

I personally haven't used it that much and I'm not sure that's a good idea. As
I wrote on the README:

> Another thing to keep in mind is that Docker is all about application containers
and not machine containers. I failed to boot a Docker container in what people have
been calling "[machine mode](https://github.com/dotcloud/docker/issues/2170#issuecomment-26118964)"
and some hacking will be required in order to run multiple processes on the container...
For more information about the issues related to it, please search Docker's issue
tracker for `/sbin/init` and / or "machine mode".

For now I'll keep using Docker as a _provisioner_ instead of a _provider_
but if you think there's value on that provider, please let me know so we
can figure out what would be the next steps.


## That's it!

That's a lot stuff already. I think I've got enough Vagrant related work for 2014
to keep me busy along with things I might be doing on core and things not related
to Vagrant as well.

Stay tuned :-)
