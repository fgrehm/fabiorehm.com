---
date: "2013-04-28"
title: 'LXC provider for Vagrant'
description: "Run your Vagrant boxes as Linux Containers"
tags:
- vagrant
- lxc
- linux containers
- video
---

_**UPDATE**: This post is likely to be out of date, please see [this post](/blog/2015/07/21/quick-update-about-some-vagrant-plugins)
for more_

It's been nearly 2 months since I open sourced my "not so pretty" [initial spike](https://github.com/fgrehm/vagrant-lxc/tree/55c9be772db32d4f49bf61af1801d2d6f14a880e)
and [announced](https://groups.google.com/d/topic/vagrant-up/fp3UfclJDg8/discussion) on
Vagrant's mailing list that I was going to work on this. By that time, Vagrant 1.1 wasn't
even released yet and it was a [long](https://github.com/fgrehm/vagrant-lxc/contributors)
[way](http://rubygems.org/gems/vagrant-lxc/versions) to get where it is now.

Almost two weeks after "releasing" the spike, Vagrant 1.1 [came out](http://www.hashicorp.com/blog/vagrant-1-1-and-vmware.html)
and by then someone [challenged](https://twitter.com/fgrehm/status/312340609350385664)
people to write a LXC [provider](http://docs.vagrantup.com/v2/providers/index.html)
for it. I felt great since I was already using [vagrant-lxc](https://github.com/fgrehm/vagrant-lxc)
over the past couple weeks :)

For those who have never heard about [LXC](http://lxc.sourceforge.net/)
, it is *"the userspace control package for Linux Containers, a lightweight
virtual system mechanism sometimes described as 'chroot on steroids'"*.
As a "real world" example, it is the technology that powers Heroku's [Dynos](https://devcenter.heroku.com/articles/dynos#technologies)
and probably a whole lot of [other PaaS providers](http://blog.dotcloud.com/paas-under-the-hood-ebook).

Below you'll be able to watch a video / screencast that demonstrates the plugin
on its current state.

<div class="flash-video">
  <iframe src="http://player.vimeo.com/video/64778133?portrait=0" width="720" height="405" frameborder="0" webkitAllowFullScreen="true" mozallowfullscreen="true" allowFullScreen="true"></iframe>
  <p>
    Please note that the video is "mute" (like HashiCorp's <a href="http://www.hashicorp.com/blog/preview-vagrant-aws.html">AWS</a>
    and <a href="https://vimeo.com/58059557">VMWare Fusion</a> videos), so make sure
    you get yourself some nice soundtrack to watch it :)
  </p>
</div>

Alright, that last bit was cool hey? I'm not sure exactly how I'll explore that
yet but it was crazy when I realized that it was possible.

## A few notes about the video

* I'm not sure you noticed but the nginx base box exported shows `quantal64` as the
  hostname on the prompt but it is actually a `precise64` box. Don't worry,
  it is a [known issue](https://github.com/fgrehm/vagrant-lxc/issues/60) (that has
  been fixed already).
* If you have used lxc before you might be asking yourself why haven't I been asked
  for root privileges not even once. The reason behind it is that all the time I
  was on a vagrant box which by definition requires passwordless `sudo` to be [enabled](http://docs-v1.vagrantup.com/v1/docs/base_boxes.html).
* When compressing boxes `tar` might throw up some [warnings](https://github.com/fgrehm/vagrant-lxc/issues/46)
  on you. I don't know exactly what I'm going to do about that but I'll look into
  it ASAP.
* I know that the video quality is not the best in the world, I actually fought a
  lot to be able to properly edit it after recording with [recordMyDesktop](http://recordmydesktop.sourceforge.net/about.php)
  until I [found a solution](http://superuser.com/a/484288). Please LMK if you
  know better tools to record high quality screencasts on Ubuntu :)

## Why bother?

So far I've been using the plugin pretty much every day to work on some Ruby on
Rails projects with great success. Before that I was a VirtualBox user and so
far LXC has proven not only to perform better but to be more stable (at least
for my work).

My primary goal with this was to have a lightweight alternative for VirtualBox
for Linux users and after [eating my own dog food](http://en.wikipedia.org/wiki/Eating_your_own_dog_food)
for the last 2 months I believe I was able to achieve that. [I do see it being pushed](https://twitter.com/fgrehm/status/313746305195323392)
to its limits and I already know about people going further and using it for
continous integration but I don't see it being my main focus for the short term
(more on this below). From what I've read it looks like some people have struggled
to use lxc and vagrant-lxc attempts to make it a no brainer.

I'm not saying that "VirtualBox is dead" neither that LXC is perfect. There are
also other proven virtualization technologies take into consideration too (like
[libvirt](http://libvirt.org/) or [KVM](http://www.linux-kvm.org/page/Main_Page)
for example). For instance, I still use VBox to [try out new things while developing the provider](https://github.com/fgrehm/vagrant-lxc/wiki/Development#using-virtualbox-for-development)
and there will be times that you'll need to have a full blown VM (like when you
need to test your web apps on IE :)

## Performance

Although I haven't done any "serious" benchmarking, performance wise I *feel*
that things are "faster". I'll save the benchmark to another post but one thing
I can say for sure: bringing a vagrant-lxc container up from scratch and reloading
it is a lot faster (no double quotes here).

On my machine, it takes around `01:31` to bring a clean Ubuntu 12.10 VBox VM up
from scratch and `00:40` to reload it, with vagrant-lxc those numbers go down to
`00:30` and `00:12` respectively, that alone is a HUGE win. If you have done any
Puppet or Chef development using Vagrant for a long time you have probably spent a
fair bit of time recreating / restarting machines to try things out and a lxc
container can potentially save you from a lot of waiting time.

Another cool thing about using containers is that they [share](http://wiki.gentoo.org/wiki/LXC#Container-based_Virtualization_.28lxc.29)
your host's Kernel and resources. I'm not a 100% sure but I believe that at least
in theory it means you'd achieve the same performance as if you were running things
directly on your physical machine. You *can* limit the amount of memory and CPU
cores / shares the containers will get by configuring [Control Groups](http://en.gentoo-wiki.com/wiki/LXC#Control_Groups)
but by default it will allow using everything you've got.

On a site note, if you need to run [Guard](https://github.com/guard/guard) on the
guest machine it will simply work. There's no need to [enable pooling](https://github.com/guard/listen/issues/53)
neither you need to [enable NFS shared folders](/blog/2013/01/17/100-percent-on-vagrant/#enable_nfs)
to have a reasonable performance.

## Stability

I've been using VirtualBox even before I got to know Vagrant (which happened just
last year). I began using it back in 2009 when I used to be a frustrated Windows
user trying to learn Ruby on Rails. After consecutive failed attempts to get things
working within Windows and not switching to Linux I had to rely on a VM to work.
I ended up spending a lot of my time inside the VM and one of the main reasons
that made me "promote" Linux to my main OS was that VBox was crashing and acting
weird quite a lot.

After switching to Linux I started using VirtualBox as my own little "playground".
Whenever I wanted to try out some new stuff that could potentially mess up with
my host OS or had lots of dependencies I'd do it there. In my experience, the
amount of crashes / issues I had reduced dramatically but were still present.

So far my experience with LXC has been awesome, I haven't experienced any crash
at all during normal usage. The only problem I had so far was a [*buggy* Kernel](https://github.com/fgrehm/vagrant-lxc#help-im-unable-to-restart-containers)
and a hard time trying to boot nested containers as I've done on the video.

## Usage on OS X / Windows

Even if you have never heard about LXC, by now you might have guessed that it does
not work on OS X nor Windows hosts. But you can still benefit from it!

As I said the time taken to recreate containers is lower than what you'll get with
VirtualBox so you can use it to get a faster feedback about Puppet manifests / Chef
cookbooks even though your physical machine can't create containers. Right now you
are thinking: "but dude, I'm on a mac / windows! how will I use this?". Well, if
you watched the video you'll probably remember that the "box stack" I've shown
has a VBox container between my laptop and the other containers. My laptop has
Ubuntu 12.10 installed but you could easily replace it with a Windows or
OS X machine (and why not use it from a EC2 instance managed by [vagrant-aws](https://github.com/mitchellh/vagrant-aws)
;)

With the proper Vagrant setup, you can make it a trivial process. Imagine you
have this Vagrantfile:

<script src="https://gist.github.com/fgrehm/5463831.js"></script>

When you run:

    [host] $ vagrant up vbox
    [host] $ vagrant ssh vbox

    [vbox] $ vagrant plugin install vagrant-lxc
    [vbox] $ cd /vagrant
    [vbox] $ vagrant box add quantal64 http://dl.dropbox.com/u/13510779/lxc-quantal-amd64-2013-04-21.box
    [vbox] $ vagrant up lxc --provider=lxc

You'll end up with a container ready to rock. Because of the way the ports
are being forwarded, you could potentially be able to hit an Apache instance
running on the container on port `80` directly by going to http://localhost:3001
in your browser. You might as well set up the container to automatically start
when the VBox machine goes up to save you some trouble.

<s>Before you alt-tab to try it out, please keep in mind that on its current
state it won't work out of the box but I believe that it wouldn't be hard to automate
that process and [I do have plans](https://github.com/fgrehm/vagrant-lxc/issues/23)
to make it a no brainer as well.</s>
_**UPDATE**: As of [vagrant-lxc 0.5.0](/blog/2013/08/02/vagrant-lxc-0-5-0-and-beyond#promiscuous-port-forwarding)
that now works!_

## "Worth mentioning" limitations

* Port forwarding is currently being handled by `redir`. I've failed several times
  to make it work with just `iptables` since it is bundled with pretty much every
  Linux installation and it seems that it is not possible. Ideally we should not
  depend on `redir` but for now it does the trick.
* "Advanced networking" Vagrant features are not implemented yet. <s>If you need
  features like [automatic port collision handling](http://docs.vagrantup.com/v2/networking/forwarded_ports.html)
  you'll need to wait a bit more</s> _**UPDATE**: as of [vagrant-lxc 0.5.0](https://github.com/fgrehm/vagrant-lxc/blob/master/CHANGELOG.md#050-aug-1-2013)
  port collisions are now properly sorted out automatically._
* Until [user namespaces](https://wiki.ubuntu.com/UserNamespace) get into the
  mainstream kernel there will be a hell lot of `sudo`s involved. <s>I'm looking
  into different approaches of working around them and reducing to a minimum,
  nothing rock solid yet.</s> _**UPDATE**: as of 0.5.0 there is support for using
  a "[sudo wrapper script](/blog/2013/08/07/vagrant-lxc-0-5-0-and-beyond#support-for-a-sudo-wrapper-script-aka-no-more-sudo-passwords)"._
* If you need a GUI inside your VMs you are on your own to properly set it up.
  Making it work from within vagrant-lxc is [also planned](https://github.com/fgrehm/vagrant-lxc/issues/44)
  but it is currently a low priority for me.

## What about [Docker](http://www.docker.io/)?

I'd love to play more with Docker and I actually thought of [integrating it with
vagrant-lxc](https://github.com/fgrehm/vagrant-lxc/issues/41). I keep hearing
people talk a lot about it but I only got to play with it for a couple days. As I
commented on this [GitHub issue](https://github.com/dotcloud/docker/issues/404#issuecomment-16697703),
I actually don't think a Docker provider would be a "competitor" to the pure lxc
implementation, my goal is to have it as a replacement to VirtualBox for
Linux users. On the other hand: *"Docker complements LXC with a high-level API
which operates at the process level. It runs unix processes with strong guarantees
of isolation and repeatability across servers"*.

Given what I know so far, my initial impression is that the Docker provider would
be something like an "advanced vagrant-lxc", don't know... To be honest, I neither
played with Docker enough nor I have a deep knowledge around linux containers
itself to understand if that actually makes sense, but at least is one less
dependency for users to install ;)

## Ok, so what's next?

Now that the basic functionallity is in place and things seem to be stable, my
main focus will now shift to write documentation and to improve the current
codebase. I've started working on this even before there was any official Vagrant
1.1 documentation (remember that I had a somewhat working version even before 1.1
got released?) and the internal design has not changed that much since then. There
is a lot of improvements that can be made to the codebase in order to take the
project to the "next level". I also have a lot of homework to do and I want to
dig deeper into LXC itself before pushing more functionality into the plugin.

We definitely need more base boxes to increase adoption, so far I [released 3
versions of Ubuntu](https://github.com/fgrehm/vagrant-lxc#available-boxes) and I've
just received a [pull request](https://github.com/fgrehm/vagrant-lxc/pull/65)
with the scripts to build Debian base boxes. I personally only use Ubuntu
boxes so feel free to contribute with scripts to build base boxes for other
distros (documentation about building base boxes are [on the way](https://github.com/fgrehm/vagrant-lxc/issues/67)).

As I wrote above, `redir` is something that I don't want to depend on and I'd love
to know better alternatives for it. I also need to think about a way of properly
exposing forwarded guest containers' port to the outer world. This is *probably*
the next functionality that might get into the plugin.

There is also a few [core features missing](https://github.com/fgrehm/vagrant-lxc/issues?labels=core&page=1&state=open),
some extra functionality [planned](https://github.com/fgrehm/vagrant-lxc/issues?labels=enhancement&page=1&state=open)
and some known [bugs](https://github.com/fgrehm/vagrant-lxc/issues?labels=bug&page=1&state=open)
to be fixed. I'm not sure in what order I'm going to tackle those guys yet but
feel free to sign up to fix / implement any of them or report bugs as you find
them. Any kind of help will be greatly appreaciated here since I've been doing
this pretty much all by myself so far.

## Summing up

I hope you enjoyed reading this post and watching the video. Feel free to reach
me in case you need any help. I tried to write my current feelings about all this
and after some thought I chose to end this post by just quoting [HashiCorp](http://www.hashicorp.com/blog/preview-vagrant-aws.html)
which perfectly maps to my current thinking:

> I’m very excited for the opportunities and use cases this unlocks, as well as the
> potential to dramatically improve end-to-end productivity and testability of your
> work environments.

*A special thanks goes to those that reviewed the initial version of the video and
somehow contributed to this post. I own all of you a beer :D*
