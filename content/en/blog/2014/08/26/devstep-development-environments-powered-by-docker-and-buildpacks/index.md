---
date: "2014-08-26"
title: "Devstep: Development environments powered by Docker and Buildpacks"
description: "'devstep hack' and BOOM!"
tags:
- docker
- buildpacks
- ruby
- rails
---

[Devstep](http://fgrehm.viewdocs.io/devstep) is a relatively new project that I
I've been working on since February 2014 and had its second release last friday.
On its current state, Devstep is a dead simple, no frills development environment
builder powered by [Docker](https://www.docker.com/) and the [buildpack](https://devcenter.heroku.com/articles/buildpacks)
abstraction that is based around a simple (yet ambitious) goal:

> I want to git clone and run a single command to hack on any software project.

Intrigued? Check out the demo below of my "canonical [Discourse](http://www.discourse.org/)
example" and read on for more.

<div class="flash-video">
  <iframe src="//player.vimeo.com/video/99212562" width="720" height="405" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>


## A bit of background

I've mentioned this before but just to make sure everyone is on the same page,
even though I've wrote and done a lot of work on Vagrant / LXC in the past and
have been playing with Docker for a good amount of my free time, I'm not an DevOps /
operations / sysadmin guy (but [some people believe I am](https://twitter.com/jeffsussna/status/377905545048756224)
:P)

My day to day work still consists of building Ruby On Rails apps and some Golang
for a couple side projects. While I'm somewhat comfortable writing Puppet manifests
/ Chef recipes, my daily work does not involve any kind of configuration management
as pretty much all of the apps I've worked on over the past 2 / 3 years have been
deployed to Heroku.

Because of that and because I don't see myself going back to developing on "bare
metal" anytime soon, I've been thinking and experimenting with different ways of
simplifying the process of building virtualized development environments for a
while now and Devstep is my third attempt at building a tool to make my life
easier, being [vagrant-boxen](https://github.com/fgrehm/vagrant-boxen) and
[ventriloquist](https://github.com/fgrehm/ventriloquist) the other two.

That said, Devstep is not about building images for usage in production. Like
Ventriloquist, it is a tool for developing other tools / libraries and for people
that can't be bothered setting up a virtualized development environment from
scratch and / or don't have control over their production environments.

How's Devstep different from the other projects I've created and why am I so
excited about it? Because it is the simplest one and because it requires "almost
zero" configuration to work. "Almost zero" because projects might require
some additional service (like a database) and you'll probably need to set it up
with some [Docker links](http://docs.docker.com/userguide/dockerlinks/).


## Motivation

Have you ever deployed an app to a platform like Heroku? How awesome it is to
`git push` some code and see it running without worrying about the infrastructure
it is going to run on? Now imagine that idea applied to any type of project,
regardless of whether they are web apps or not. This is what I'm trying to achieve
with Devstep.

At Devstep's heart, there is a "self suficient" Docker [image](http://docs.docker.com/introduction/understanding-docker/#docker-images)
that leverages the [buildpack](https://devcenter.heroku.com/articles/buildpacks)
abstraction for automatic detection and installation of project dependencies. The
base image comes with a script that takes your app's source as an input and installs
everything that is required for hacking on it.

Be it a CLI tool, a plugin for some framework or a web app, it doesn't matter,
Devstep can do the heavy lifting of preparing an isolated and disposable
environment using as close to zero configuration as possible so that we can
**focus on writing and delivering working software**.


## Benefits

Configuring a base system from scratch to hack on a project (using Docker or not)
is not an easy task for many people. Yes, there are plenty of platform specific
images available for download on [Docker Hub](https://hub.docker.com/) but because
Devstep's base image provides an environment that is [similar to Heroku's](https://github.com/progrium/cedarish),
it should be capable of building and running a wide range of applications / tools
/ libraries from a single image.

Devstep is also capable of reducing the disk space and initial configuration times by
(optionally) caching packages on the host machine using a strategy similar to [vagrant-cachier's cache buckets](http://fgrehm.viewdocs.io/vagrant-cachier/how-does-it-work),
where project dependencies packages are kept on the host while its contents are
extracted inside the container.


## Project status and future work

Right now Devstep is the result of many different hacks that suits my needs for
developing Ruby on Rails and Go CLI / Web apps. It has been working fine for my
use cases since April / March 2014 and it also seems to play really well with
other platforms based on my [testing](https://github.com/fgrehm/devstep-examples).

As with any software project, there's always a lot that can be improved but in
the short term my focus will be on [dogfooding](http://en.wikipedia.org/wiki/Eating_your_own_dog_food)
and converting the current Bash script that makes up for the CLI into a more
robust Golang CLI that interacts with the Docker API (which is already [in the works](https://github.com/fgrehm/devstep-cli)).

From there I have many ideas of cool things that could be done to improve the
project but I'd rather keep them on GitHub issues to avoid making this blog post
go "stale" as some of my Vagrant plugins posts I've wrote on the past.

I also plan to write some blog posts on bootstrapping projects for the currently
supported environments, write about usage with Vagrant / Fig and also work on
improving documentation in general. Stay tunned for more and feel free to join
me on [Gitter](https://gitter.im/fgrehm/devstep) if you need help setting things
up or just want to share some feedback :)

-----------------------------------------------------------------------------

## PS: What about [Ventriloquist](/blog/2013/09/11/announcing-ventriloquist/)?

Ventriloquist served me well for many different projects over the 6 / 7 months
period I used it more heavily. The reason why I started from scratch with Devstep
was that I really wanted a more isolated environment that was simpler, smarter
and faster to build with a very small need for configuration files.

While Devstep is currently Docker only, it's core functionality is provided by
handful of bash scripts and could be extracted and adapted to other environments
(like your very own laptop or Vagrant VMs for example). On the other hand, Ventriloquist
builds on top of Ruby and the Vagrant plugins infrastructure and making it work
on other environments would be a PITA.

To finish this up, I need to say that after almost an year after Ventriloquist's
initial release I haven't received much feedback about it and I risk saying I was the
only one that interacted with it on a daily basis. With that in mind, I'm
officially stepping down as a maintainer of the project and will
[hapilly hand it over to someone else that has the interest and time to maintain it](https://github.com/fgrehm/ventriloquist/issues/63).
