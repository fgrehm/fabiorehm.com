---
date: "2013-01-17"
title: 100% on Vagrant
slug: '100-percent-on-vagrant'
description: 'Some tips on getting the most out of Vagrant'
tags:
- vagrant
- vagrant-notify
- rails
- ruby
- tmux
- virtualization
---

Last year I heard a lot about [Vagrant](http://www.vagrantup.com/) and even
 though I had the chance to play with it, performance was always an issue
that prevented me from doing 100% of my development work from a VM. By december, when
my laptop started acting weird (and eventually died) I decided that my next
computer would have as much cores and RAM that I could afford. I looked at a few
different options and ended up getting a Dell Inspiron 15R SE with a Core I7 that
has 4 cores and 8 threads and 8 Gb RAM. Combined with some Vagrant / VirtualBox tweaks,
I'm now able to use Vagrant for pretty much **all** of my "real" (paid)
development work.

If you are thinking about doing the same or are curious about how I am doing it,
here's a list of some useful tips that might help you out as well. If you are
new to Vagrant, check out [the getting started guide](http://docs.vagrantup.com/v1/docs/getting-started/index.html)
and [this overview about it](http://nefariousdesigns.co.uk/vagrant-virtualised-dev-environments.html).

## Enable NFS

If you ever tried to run the specs for a reasonable sized Rails app from a Vagrant
box without enabling [NFS Shared folders](http://docs.vagrantup.com/v1/docs/nfs.html),
you probably noticed that it takes ages to run compared to your physical machine.
If you've never heard of this feature, check out the link and pay attention to the
[benchmarks](http://docs.vagrantup.com/v1/docs/nfs.html#performance_benchmarks).

In my experience, even though I configured my VirtualBox machine [to use 3 cores
 and 2 Gb of RAM](https://github.com/fgrehm/rails-template/blob/master/templates/Vagrantfile#L25-L30)
the specs **AND** the app were performing really bad. It took me a while to figure
out that at least part of the issue was this as my specs went from around 2:20 minutes down
to 1:40 minute after the initial NFS warn up just by enabling this.

So try your best to use NFS Shared Folders on your projects, it will have a
**HUGE** impact on your productivity. If you have trouble setting it up, shoot me an
email or post a question to the [Vagrant mailing list](https://groups.google.com/group/vagrant-up?pli=1).

If you are an Ubuntu user like me, there is an issue that prevents it to work properly.
I don't remember exactly the error I had but my projects were stored under my `/home`
folder that was encrypted (I think I might have checked a box while installing the OS).
My workaround was to move all my code from `/home/fabio/projects` to `/home/projects`
but the path you use probably doesn't matter, as long as it is not an encrypted folder.

## Custom base boxes

Rebuilding a box setting up all dependencies all the time is a PITA.

Be nice to other people on the team and make a base box with everything
set up available somewhere. Put it on your [public Dropbox folder](
https://www.dropbox.com/help/16/en) and set it as the base box on
the project's `Vagrantfile`.

I've [created one](https://github.com/fgrehm/rails-base-box) that I'm using
for my Rails projects. Just by importing that base box, you'll get:

* PostgreSQL 9.1
* memcached
* Redis
* rbenv
* Ruby 1.9.3-p327 with [falcon's patch](https://gist.github.com/1688857) and
some other some [tunings](https://github.com/fgrehm/rails-base-box/blob/master/site.pp#L46-L48)
* NodeJS (for the asset pipeline)
* PhantomJS for using [poltergeist](https://github.com/jonleighton/poltergeist) and
[guard-jasmine](https://github.com/netzpirat/guard-jasmine)
* Commonly used packages (like curl, imagemagick and git)

Because it has all that set up, my `Vagrantfile` ends up being a dead simple [inline
bash script](https://github.com/fgrehm/rails-template/blob/master/templates/Vagrantfile#L37-L44)
that creates the databases if they don't exist yet and I don't need to keep Puppet
related files under source control.

## Shared Vagrant box

Sometimes you just want to hack on a gem, on an old app or want to try out a new language
/ framework without messing up your computer installing a lot of packages and dependencies.

In that case you don't need a specific `Vagrantfile` for them. You can just place one
under your `/home` folder or the root folder of all your projects and run the machine
from any project subfolder you are. Vagrant will look it up for you whenever you run
`vagrant up` or `vagrant ssh`.

## [vagrant-notify](https://github.com/fgrehm/vagrant-notify)

If you want to use something like [guard](https://github.com/guard/guard) or have some
other script that uses [`notify-send`](http://manpages.ubuntu.com/manpages/gutsy/man1/notify-send.1.html)
that you want to run from the VM, you can make use this gem. It is not
[100% done](https://github.com/fgrehm/vagrant-notify/issues) but it does suit
my current needs and might suit yours as well.

With the gem, whenever a Vagrant box is provisioned, the guest `notify-send` executable
will get replaced with a [ruby script](https://github.com/fgrehm/vagrant-notify/blob/master/files/notify-send.erb)
that connects to a [TCP server](https://github.com/fgrehm/vagrant-notify/blob/master/lib/vagrant-notify/server.rb)
running on the host machine that runs the command.

## Drawbacks

Nothing is perfect right? There are some drawbacks of using a virtual machine
wheter you are using Vagrant or not:

* Your laptop battery won't last that much, so keep that in mind before hacking some
code on a plane.
* A lot of vagrant machines means a lot of disk space will get eaten by the machines.
In average, each of my boxes is getting 2.3 Gb of my HD.
* If you edit project files from your host machine using your favorite IDE,
chances are that a process on the guest machine [won't get notified that a file](
https://github.com/mitchellh/vagrant/issues/707) was changed. I'm thinking about
a workaround for that and already have something on my mind. I'll release it as
a gem as soon as I have a chance.

Apart from the file change propagation there's nothing much that we can do. I'm
already [freeing up the base box disk space](https://github.com/fgrehm/rails-base-box/blob/master/purge.sh)
when packaging my base boxes and as far as I know, at least here in Brazil there
is no such thing as an airplane with power outlets ;-)
