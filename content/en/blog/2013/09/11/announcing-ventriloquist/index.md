---
date: "2013-09-11"
title: Announcing Ventriloquist
description: 'Development environments made easy'
tags:
- vagrant
- docker
- devops
- puppet
- provisioning
- lxc
---

Although I've been writing about and working on a lot of Vagrant related stuff
lately, I need to say that I'm not a "DevOps guy". My day to day job still consists
of building web apps using Ruby On Rails and even though I like using Puppet (and
recently Chef), my daily work does not involve any sort of machine configuration
management.

Configuring a Vagrant development environment is not an easy task. As an example,
the "default stack" of the Rails apps I've been working on consists on [quite a few components](https://github.com/fgrehm/rails-base-box#vagrant-12-base-box-for-working-with-rails)
and getting the provisioning scripts / manifests / recipes right is not a trivial
task for many people (myself included). I know there are a lot of modules /
cookbooks available out there but in my opinion having to know that they exist
and learning how to wire them up together shouldn't be a *requirement* for
**developers**.

Projects like [PuPHPet](https://puphpet.com/) and [Web VM Generator](http://vmg.slynett.com/)
are available to make that initial bootstrap easier for PHP projects but at the
end they both spit out a set of Puppet manifests. While I like the idea, it still
"forces" users to learn Puppet to make changes to the VM or go through the process of
clicking checkboxes and filling in text inputs to build a new set of manifests with
the new configs.

Inspired by both [Rails Wizard](http://railswizard.org/) and GitHub's [Boxen](http://boxen.github.com/),
earlier this year I started a project called [vagrant-boxen](https://github.com/fgrehm/vagrant-boxen)
that followed the same approach as PuPHPet or Web VM Generator but without the UI.
My idea was to use a set of pre-defined Puppet modules to allow users to configure
the VMs from within the Vagrantfile with less pain.

Since then the idea has evolved into a new tool I have just open sourced called
[Ventriloquist](https://github.com/fgrehm/ventriloquist) that combines [Vagrant](http://www.vagrantup.com/)
and [Docker](http://www.docker.io/) to give **developers** the ability to configure
portable and disposable development VMs with ease. It follows vagrant-boxen
approach of configuring things from Vagrantfiles and it attempts to lower the
entry barrier of building a sane working environment without having to worry about
provisioning tools.


## Project Goals

As stated on the [README](https://github.com/fgrehm/ventriloquist#project-goals),
the idea is to build a tool that supports creating multi purpose, "zero-conf"
development environments that fits into a gist. It also aims to be the easiest
way to build other tools development environments and to be a learning
playground, making it easy to learn new programming languages / tools.

This may sound weird for some people but Ventriloquist can help you achieve
"Production Parity" if you don't have control of your production environment
(like if you are deploying to Heroku or another PaaS) or have a complex setup
in place (involving load balancers, multiple database servers and the like).
IMHO it doesn't make sense to replicate **ALL** of the aspects of your
production environment during development and using the same distro / tools
version as you'll have available over there is usually enough. Not to say that
if you use Docker in production, you might as well try to use the same services
images during development and stay closer to your production environment.


## How does it look like?

To give you an idea, this is what it takes to configure a Vagrant VM ready
for development on [Discourse](http://www.discourse.org/) (and probably a whole
lot of other Ruby On Rails apps):

{{< highlight ruby >}}
Vagrant.configure("2") do |config|
  # ... your other Vagrant configs ...
  config.vm.provision :ventriloquist do |env|
    env.services  << %w( redis pg:9.1 )
    env.platforms << %w( nodejs ruby:1.9.3 )
  end
end
{{< /highlight >}}

As another example, [this](https://github.com/fgrehm/rails-base-box/commit/69021b08dab0ff9ed78a17b16344d207dafb045c#L0L78)
is what I ended up removing from my own [rails-base-box](https://github.com/fgrehm/rails-base-box)
Puppet manifest after introducing the plugin. Since most of the work is being
handled by Ventriloquist, I've replaced all of the Puppet [modules dependencies](https://github.com/fgrehm/rails-base-box/blob/689494009a4fd1955a6b8564d886bbb3e8ed7a80/Puppetfile)
I needed with [4 lines of code](https://github.com/fgrehm/rails-base-box/blob/84fc7649163fb19f2ea4f552420962bd630f8290/Vagrantfile#L32-L35)
on my Vagrantfile. I'm still dealing with some pretty basic stuff [using puppet](https://github.com/fgrehm/rails-base-box/blob/84fc7649163fb19f2ea4f552420962bd630f8290/site.pp)
but I'm planing to swap it with a bash script that has even less lines of code
to keep things simpler and leverage provisionerless base Vagrant boxes.


## As with other stuff I've built recently, it's just a start

There are a lot of things that needs to be improved and you can find some ideas
on the project's [README](https://github.com/fgrehm/ventriloquist#ideas-for-improvements).

For now I'll continue to do some more testing and will start looking into adding
support for other languages as I have the need. If you have a need for an unsupported
platform or service, feel free to open up an issue or a Pull Request on GitHub.

I would also love to know any kind of feedback you might have about the tool.
If you are feeling specially charitable, share this post on Twitter / star the
project on GitHub or drop by a comment. Oh, and don't hesitate to throw some
tomatoes as well if you think I deserve :P

_**UPDATE** (26 AUG 2014): I've stepped down as a maintainer of the plugin, feel
free to [reach out in case you want to take over responsibility for the project](https://github.com/fgrehm/ventriloquist/issues/63)_
